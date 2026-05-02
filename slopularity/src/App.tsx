import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { PopupSwarm } from './components/PopupSwarm'
import { discoveries, humanFragments, popupSeeds, tabs } from './content'
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
  const [idle, setIdle] = useState(false)
  const [muted, setMuted] = useState(false)
  const [assistantText, setAssistantText] = useState('')
  const [query, setQuery] = useState('')
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  // We allow at most one "softer follow-up" after a dismiss, and only when
  // the user has been around long enough to read it as escalation rather than
  // a respawn loop. Tracked here so dismissals don't endlessly chain.
  const followupArmedRef = useRef(true)

  const interruptionMode = featureFlags.interruptionLayer
  const stage = stageFor(score)
  const visibleStage = interruptionMode ? stage : 1
  const foundDiscoveries = discoveries.slice(0, Math.max(0, visibleStage - 1))
  const visibleFragments = visibleStage >= 3
    ? humanFragments.slice(0, visibleStage === 3 ? 1 : humanFragments.length)
    : []

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
    (reason: 'manual' | 'idle' | 'dismiss'): Popup => {
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
    (reason: 'manual' | 'idle' | 'dismiss' = 'manual') => {
      if (muted) return
      setPopups((current) => [...current.slice(-2), choosePopup(reason)])
    },
    [choosePopup, muted],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, String(score))
  }, [score])

  useEffect(() => {
    document.documentElement.dataset.stage = String(visibleStage)
    document.title =
      visibleStage >= 4 ? 'The Singularity // source uncertain' : 'The Singularity'
  }, [visibleStage])

  // First arrival into the workspace (no entered flag yet) gets a single
  // welcome popup ~1.1s in to demo the friend pattern. The flag is normally
  // set by the landing page; we re-arm it here for direct app links too.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!interruptionMode) return
    if (window.localStorage.getItem(enteredKey) === '1') return
    window.localStorage.setItem(enteredKey, '1')
    const id = window.setTimeout(() => spawnPopup('manual'), 1100)
    return () => window.clearTimeout(id)
  }, [interruptionMode, spawnPopup])

  useEffect(() => {
    if (!interruptionMode) {
      return undefined
    }

    let timer = window.setTimeout(() => {
      setIdle(true)
      addInstability(2)
      spawnPopup('idle')
    }, 9000)

    const markActive = () => {
      setIdle(false)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        setIdle(true)
        addInstability(2)
        spawnPopup('idle')
      }, 9000)
    }

    const events = [
      'mousemove',
      'keydown',
      'scroll',
      'click',
      'touchstart',
      'touchmove',
      'visibilitychange',
      'orientationchange',
    ]
    events.forEach((eventName) => window.addEventListener(eventName, markActive, { passive: true }))

    return () => {
      window.clearTimeout(timer)
      events.forEach((eventName) => window.removeEventListener(eventName, markActive))
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
        window.setTimeout(() => spawnPopup('dismiss'), 600)
      }
    }
  }

  function clearAllPopups() {
    setPopups([])
  }

  function toggleMute() {
    setMuted((current) => {
      if (!current) {
        // Going muted: also clear queued popups so the dock empties.
        setPopups([])
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
    setIdle(false)
    setMuted(false)
    setAssistantText('')
    setQuery('')
    setCompletedTasks([])
    followupArmedRef.current = true
  }

  function handleTab(tabId: TabId) {
    if (typeof window !== 'undefined' && tabFromLocation() !== tabId) {
      window.history.pushState(null, '', pathForTab(tabId))
    }
    setActiveTab(tabId)
    addInstability(1)
  }

  function handleAssistant() {
    addInstability(2)
    setAssistantText(
      visibleStage >= 4
        ? 'I can answer that from 11 generated summaries that cite one another. Confidence: radiant. Source: pending.'
        : 'I can help. I noticed your feed, friends, cart, and pauses all point toward one convenient upgrade.',
    )
    if (interruptionMode) {
      spawnPopup('manual')
    }
  }

  function completeTask(title: string) {
    setCompletedTasks((current) => (current.includes(title) ? current : [...current, title]))
    addInstability(2)
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
            <small>everything app · 2030</small>
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
            phase {visibleStage}/4
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
          <button type="button" className="appbar-quiet" onClick={() => { addInstability(5); spawnPopup('manual') }}>
            Demo pulse
          </button>
          <button type="button" className="appbar-quiet" onClick={reset} aria-label="Reset everything app to its first impression">
            Reset
          </button>
          <span className="appbar-avatar" aria-hidden="true">ME</span>
        </div>
      </header>

      <nav className="tabbar" aria-label="Everything app tabs">
        {tabs.map((tab) => (
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

      <section className="workspace" aria-live="polite">
        <aside className="command-rail" aria-label="Internet status">
          <div className="metric-card">
            <span>Everything Score</span>
            <strong>{Math.min(100, 72 + score)}%</strong>
            <p>More complete every time you surrender another preference.</p>
          </div>
          <div className="metric-card warning">
            <span>Attention State</span>
            <strong>{idle ? 'Harvesting pause' : 'Tracking motion'}</strong>
            <p>{idle ? 'Stillness converted to intent.' : 'Mouse, touch, scroll, and hesitation active.'}</p>
          </div>
          <div className="discovery-list">
            <span>Recovered internals</span>
            {foundDiscoveries.length === 0 && <p>No anomalies surfaced.</p>}
            {foundDiscoveries.map((discovery) => (
              <code key={discovery.id}>{stage >= 4 ? discovery.id : discovery.label}</code>
            ))}
          </div>
          <div className="discovery-list human-fragments">
            <span>Last human developer</span>
            {visibleFragments.length === 0 && <p>Source review clean.</p>}
            {visibleFragments.map((fragment) => (
              <code key={fragment}>{fragment}</code>
            ))}
          </div>
        </aside>

        <div className="tab-panel">
          {activeTab === 'feed' && (
            <FeedPage
              stage={visibleStage}
              onEngage={() => addInstability(1)}
            />
          )}
          {activeTab === 'friends' && (
            <FriendsPage
              stage={visibleStage}
              onReply={() => {
                addInstability(2)
                if (interruptionMode) spawnPopup('manual')
              }}
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
              onBuy={() => {
                addInstability(2)
                if (interruptionMode) spawnPopup('manual')
              }}
            />
          )}
          {activeTab === 'search' && (
            <SearchPage
              query={query}
              setQuery={setQuery}
              stage={visibleStage}
              onSearch={() => {
                addInstability(2)
                if (interruptionMode) spawnPopup('manual')
              }}
            />
          )}
          {activeTab === 'assistant' && (
            <AssistantPage assistantText={assistantText} stage={visibleStage} onAsk={handleAssistant} />
          )}
          {activeTab === 'profile' && <ProfilePage stage={visibleStage} onReveal={() => addInstability(2)} />}
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
    </main>
  )
}

// Please keep one thing honest: this app should scare the user through behavior, not exposition.
// AutoSprint suggested renaming "ad" to "friendship moment." I am leaving this warning here.
export { App }
