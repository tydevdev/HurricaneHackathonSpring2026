import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { pushActivity } from './activityLog'
import { IdleEye } from './components/IdleEye'
import { LonelinessPopup, type IdleNudgeDestination } from './components/LonelinessPopup'
import { PopupSwarm } from './components/PopupSwarm'
import { fragmentLeaks, popupSeeds, tabs as defaultTabs } from './content'
import { featureFlags } from './featureFlags'
import { AssistantPage } from './pages/AssistantPage'
import { FeedPage } from './pages/FeedPage'
import { FriendsPage } from './pages/FriendsPage'
import { GamesPage } from './pages/GamesPage'
import { ProfilePage } from './pages/ProfilePage'
import { pathForTab, tabFromLocation } from './routes'
import { SearchPage } from './pages/SearchPage'
import { ShopPage } from './pages/ShopPage'
import type { Popup, TabId } from './types'
import { stageFor } from './utils'

const storageKey = 'slopularity-state-v1'
const enteredKey = 'slopularity-entered-v1'
type PopupReason = 'manual' | 'idle' | 'dismiss'

function loadScore() {
  if (typeof window === 'undefined') return 0
  const raw = window.localStorage.getItem(storageKey)
  if (!raw) {
    return 0
  }

  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) ? value : 0
}

function loadTab(): TabId {
  if (typeof window === 'undefined') return 'feed'
  return tabFromLocation() ?? 'feed'
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>(loadTab)
  const [score, setScore] = useState(loadScore)
  const [popups, setPopups] = useState<Popup[]>([])
  const [muted, setMuted] = useState(false)
  const [assistantText, setAssistantText] = useState('')
  const [query, setQuery] = useState('')
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  // We allow at most one "softer follow-up" after a dismiss, and only when
  // the user has been around long enough to read it as escalation rather than
  // a respawn loop. Tracked here so dismissals don't endlessly chain.
  const followupArmedRef = useRef(true)

  // ── Idle surveillance state ──
  const [idleEyeVisible, setIdleEyeVisible] = useState(false)
  const [lonelinessVisible, setLonelinessVisible] = useState(false)
  const [idleNudgeIndex, setIdleNudgeIndex] = useState(0)
  const idleSecondsRef = useRef(0)
  const idleReorgDoneRef = useRef(false)
  const idleNudgeShownRef = useRef(false)
  const queuedPopupReasonRef = useRef<PopupReason | null>(null)
  // Tabs can be silently reordered during idle. Store the current order.
  const [tabOrder, setTabOrder] = useState(defaultTabs)

  const interruptionMode = featureFlags.interruptionLayer
  const stage = stageFor(score)
  const visibleStage = interruptionMode ? stage : 1

  const visiblePopups = muted ? [] : popups

  useEffect(() => {
    const syncRoute = () => {
      const routedTab = tabFromLocation()
      if (routedTab) {
        setActiveTab(routedTab)
      }
    }

    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  const addInstability = useCallback((amount = 1) => {
    setScore((current) => Math.min(30, current + amount))
  }, [])

  const choosePopup = useCallback(
    (reason: PopupReason): Popup => {
      const seed = popupSeeds[(score + popups.length + reason.length) % popupSeeds.length]!
      const message = seed.messages[reason]
      return {
        id: Date.now() + popups.length,
        name: seed.name,
        role: seed.role,
        tone: seed.tone,
        message,
        offer: visibleStage >= 4 ? `${seed.offer} // handoff_to_checkout: true` : seed.offer,
        intent: seed.intent,
      }
    },
    [popups.length, score, visibleStage],
  )

  const spawnPopup = useCallback(
    (reason: PopupReason = 'manual') => {
      if (muted) return
      setPopups((current) => [...current.slice(-2), choosePopup(reason)])
    },
    [choosePopup, muted],
  )

  const queuePopup = useCallback(
    (reason: PopupReason = 'manual') => {
      if (muted) return
      queuedPopupReasonRef.current = reason
    },
    [muted],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, String(score))
  }, [score])

  useEffect(() => {
    document.documentElement.dataset.stage = String(visibleStage)
    if (visibleStage < 4) {
      document.title = 'The Singularity'
      return undefined
    }
    // Stage 4: page title flickers between rewrites every 2.4s. Source
    // leakage is the system editing itself faster than a person can read.
    const titles = [
      'The Singularity',
      'The Singularity // source uncertain',
      'The Singularity // [INSERT PRODUCT NAME]',
      '[BRAND] // pending review',
      'The Singularity // last_human_developer.md',
    ]
    let i = 0
    document.title = titles[0]!
    const id = window.setInterval(() => {
      i = (i + 1) % titles.length
      document.title = titles[i]!
    }, 2400)
    return () => window.clearInterval(id)
  }, [visibleStage])

  // First arrival into the workspace (no entered flag yet) queues a single
  // welcome check-in, but it waits behind the same idle gate as every other
  // friend popup so the feed stays consumable while the user is active.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!interruptionMode) return
    if (window.localStorage.getItem(enteredKey) === '1') return
    window.localStorage.setItem(enteredKey, '1')
    queuePopup('manual')
  }, [interruptionMode, queuePopup])

  // ── Idle detection: tiered (eye → reorg → loneliness → popup) ──
  useEffect(() => {
    if (!interruptionMode) return undefined

    const interval = window.setInterval(() => {
      idleSecondsRef.current += 1
      const s = idleSecondsRef.current

      // 5s: the eye opens and one friend check-in may appear. Queued demo or
      // dismiss follow-ups use their own tone; otherwise stillness itself is
      // interpreted as the signal. No popup appears while the user is active.
      if (s === 5) {
        setIdleEyeVisible(true)
        const queuedReason = queuedPopupReasonRef.current
        queuedPopupReasonRef.current = null
        spawnPopup(queuedReason ?? 'idle')
        if (!queuedReason) {
          addInstability(2)
        }
      }

      // 7s: a rotating idle nudge interrupts the pause.
      if (s === 7 && !idleNudgeShownRef.current) {
        idleNudgeShownRef.current = true
        setIdleNudgeIndex((current) => current + 1)
        setLonelinessVisible(true)
      }

      // 9s: ambient reorganization (once per idle stretch)
      if (s === 9 && !idleReorgDoneRef.current) {
        idleReorgDoneRef.current = true
        // Silently shuffle tab order
        setTabOrder((current) => {
          const shuffled = [...current]
          // Swap two random tabs
          const a = Math.floor(Math.random() * shuffled.length)
          let b = Math.floor(Math.random() * shuffled.length)
          if (b === a) b = (a + 1) % shuffled.length
          const temp = shuffled[a]!
          shuffled[a] = shuffled[b]!
          shuffled[b] = temp
          return shuffled
        })
      }

    }, 1000)

    const resetIdle = () => {
      idleSecondsRef.current = 0
      // Eye disappears instantly
      setIdleEyeVisible(false)
      idleNudgeShownRef.current = false
      // Don't dismiss loneliness popup on move — it has its own dismiss
    }

    const events = [
      'mousemove',
      'pointermove',
      'pointerdown',
      'keydown',
      'input',
      'wheel',
      'scroll',
      'click',
      'touchstart',
      'touchmove',
      'visibilitychange',
      'orientationchange',
    ]
    events.forEach((eventName) => window.addEventListener(eventName, resetIdle, { passive: true }))

    return () => {
      window.clearInterval(interval)
      events.forEach((eventName) => window.removeEventListener(eventName, resetIdle))
    }
  }, [addInstability, interruptionMode, spawnPopup])

  function dismissPopup(id: number) {
    setPopups((current) => current.filter((popup) => popup.id !== id))

    if (interruptionMode) {
      // The dismiss is a real signal — but we only allow one softer follow-up
      // per session so users can actually clear the dock. After that, a
      // dismissed popup stays dismissed. The "Friends muted" toggle silences
      // everything outright.
      addInstability(1)

      if (
        followupArmedRef.current &&
        visibleStage >= 3 &&
        !muted &&
        popups.length <= 1
      ) {
        followupArmedRef.current = false
        queuePopup('dismiss')
      }
    }
  }

  function clearAllPopups() {
    setPopups([])
    queuedPopupReasonRef.current = null
  }

  function toggleMute() {
    setMuted((current) => {
      if (!current) {
        // Going muted: also clear queued popups so the dock empties.
        setPopups([])
        queuedPopupReasonRef.current = null
      } else {
        // Coming back from muted re-arms the one-shot follow-up.
        followupArmedRef.current = true
      }
      return !current
    })
  }

  function reset() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey)
      window.localStorage.removeItem(enteredKey)
      // Real navigation back to the landing entry page.
      window.location.href = '../'
      return
    }
    setScore(0)
    setActiveTab('feed')
    setPopups([])
    setMuted(false)
    setAssistantText('')
    setQuery('')
    setCompletedTasks([])
    setTabOrder(defaultTabs)
    queuedPopupReasonRef.current = null
    followupArmedRef.current = true
  }

  function handleTab(tabId: TabId) {
    if (typeof window !== 'undefined' && tabFromLocation() !== tabId) {
      window.history.pushState(null, '', pathForTab(tabId))
    }
    setActiveTab(tabId)
    addInstability(1)
    pushActivity('nav', 'tab', tabId)
  }

  function handleAssistant(prompt = query || 'general') {
    addInstability(2)
    pushActivity('assistant', 'ask', prompt)
    setAssistantText(
      visibleStage >= 4
        ? 'I can answer that from 11 generated summaries that cite one another. Confidence: radiant. Source: pending.'
        : 'I can help. I noticed your feed, friends, cart, and pauses all point toward one convenient upgrade.',
    )
  }

  function completeTask(title: string) {
    setCompletedTasks((current) => (current.includes(title) ? current : [...current, title]))
    addInstability(2)
    pushActivity('games', 'complete', title)
  }

  function handleLonelinessDismiss() {
    setLonelinessVisible(false)
    addInstability(1)
  }

  function handleIdleNudgeAct(destination: IdleNudgeDestination) {
    setLonelinessVisible(false)
    addInstability(2)
    handleTab(destination)
  }

  function renderTabbar(placement: 'global' | 'feed-mobile') {
    return (
      <nav className={`tabbar tabbar-${placement}`} aria-label="Everything app tabs">
        {tabOrder.map((tab) => (
          <a
            key={tab.id}
            className={activeTab === tab.id ? 'is-active' : ''}
            href={pathForTab(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            onClick={(event) => {
              event.preventDefault()
              handleTab(tab.id)
            }}
          >
            {tab.label}
          </a>
        ))}
      </nav>
    )
  }

  return (
    <main
      className={`app-shell tab-${activeTab}`}
      style={{ '--decay': visibleStage - 1 } as CSSProperties}
    >
      <header className="appbar" aria-label="The Singularity system bar">
        <div className="appbar-brand">
          <span className="brand-mark" aria-hidden="true">
            <span /><span /><span /><span />
          </span>
          <span className="brand-text">
            <strong>The Singularity</strong>
            <small className={visibleStage >= 4 ? 'is-leak' : ''}>
              {visibleStage >= 4 ? fragmentLeaks.brandSubtitle : 'everything app · 2030'}
            </small>
          </span>
        </div>

        <div className="appbar-search" role="search" aria-label="Universal search shortcut">
          <span aria-hidden="true">⌕</span>
          <a
            className="appbar-search-btn"
            href={pathForTab('search')}
            onClick={(event) => {
              event.preventDefault()
              handleTab('search')
            }}
          >
            Search everything
          </a>
          <kbd>↵</kbd>
        </div>

        <div className="appbar-status" aria-label="System status">
          <span className={`phase-pill phase-${visibleStage}`} title={`phase ${visibleStage} of 4`}>
            <span className="phase-dot" aria-hidden="true" />
            {visibleStage >= 4 ? fragmentLeaks.phasePill : `phase ${visibleStage}/4`}
          </span>
          {interruptionMode && (
            <button
              type="button"
              className={`appbar-toggle ${muted ? 'is-muted' : ''}`}
              onClick={toggleMute}
              aria-pressed={muted}
              title={muted ? 'Friends are muted. Tap to wake them.' : 'Friends will check on you.'}
            >
              <span aria-hidden="true">{muted ? '🔕' : '🔔'}</span>
              <span>{muted ? 'Friends muted' : 'Friends on'}</span>
            </button>
          )}
          <button type="button" className="appbar-quiet" onClick={() => { addInstability(5); queuePopup('manual') }}>
            Demo pulse
          </button>
          <button type="button" className="appbar-quiet" onClick={reset} aria-label="Reset everything app to its first impression">
            Reset
          </button>
          <span className="appbar-avatar" aria-hidden="true">ME</span>
        </div>
      </header>

      {renderTabbar('global')}

      <section className="workspace" aria-live="polite">
        <div className="tab-panel">
          {activeTab === 'feed' && (
            <FeedPage
              stage={visibleStage}
              onEngage={() => addInstability(1)}
              mobileNavigation={renderTabbar('feed-mobile')}
            />
          )}
          {activeTab === 'friends' && (
            <FriendsPage
              stage={visibleStage}
              onReply={() => addInstability(2)}
            />
          )}
          {activeTab === 'games' && (
            <GamesPage
              completedTasks={completedTasks}
              onComplete={completeTask}
              stage={visibleStage}
            />
          )}
          {activeTab === 'shop' && (
            <ShopPage
              stage={visibleStage}
              onBuy={() => addInstability(2)}
            />
          )}
          {activeTab === 'search' && (
            <SearchPage
              query={query}
              setQuery={setQuery}
              stage={visibleStage}
              onSearch={() => addInstability(2)}
            />
          )}
          {activeTab === 'assistant' && (
            <AssistantPage assistantText={assistantText} stage={visibleStage} onAsk={handleAssistant} />
          )}
          {activeTab === 'profile' && (
            <ProfilePage stage={visibleStage} score={score} onReveal={() => addInstability(2)} />
          )}
        </div>
      </section>

      {interruptionMode && (
        <PopupSwarm
          popups={visiblePopups}
          stage={visibleStage}
          muted={muted}
          onDismiss={dismissPopup}
          onAccept={() => addInstability(2)}
          onClearAll={clearAllPopups}
          onMute={toggleMute}
        />
      )}

      {/* Idle surveillance layer */}
      <IdleEye visible={idleEyeVisible} />
      <LonelinessPopup
        visible={lonelinessVisible}
        nudgeIndex={idleNudgeIndex}
        onDismiss={handleLonelinessDismiss}
        onAct={handleIdleNudgeAct}
      />
    </main>
  )
}

// Please keep one thing honest: this app should scare the user through behavior, not exposition.
// AutoSprint suggested renaming "ad" to "friendship moment." I am leaving this warning here.
export { App }
