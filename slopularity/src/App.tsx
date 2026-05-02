import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { PopupSwarm } from './components/PopupSwarm'
import { discoveries, humanFragments, popupSeeds, tabs } from './content'
import { AssistantPage } from './pages/AssistantPage'
import { FeedPage } from './pages/FeedPage'
import { FriendsPage } from './pages/FriendsPage'
import { GamesPage } from './pages/GamesPage'
import { ProfilePage } from './pages/ProfilePage'
import { SearchPage } from './pages/SearchPage'
import { ShopPage } from './pages/ShopPage'
import type { Popup, TabId } from './types'
import { getEngagementLabels, stageFor } from './utils'

const storageKey = 'slopularity-state-v1'

function loadScore() {
  const raw = window.localStorage.getItem(storageKey)
  if (!raw) {
    return 0
  }

  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) ? value : 0
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('feed')
  const [score, setScore] = useState(loadScore)
  const [popups, setPopups] = useState<Popup[]>([])
  const [idle, setIdle] = useState(false)
  const [assistantText, setAssistantText] = useState('')
  const [query, setQuery] = useState('')
  const [completedTasks, setCompletedTasks] = useState<string[]>([])

  const stage = stageFor(score)
  const engagementLabels = useMemo(() => getEngagementLabels(stage), [stage])
  const foundDiscoveries = discoveries.slice(0, Math.max(0, stage - 1))
  const visibleFragments = stage >= 3 ? humanFragments.slice(0, stage === 3 ? 1 : humanFragments.length) : []

  const addInstability = useCallback((amount = 1) => {
    setScore((current) => Math.min(30, current + amount))
  }, [])

  const choosePopup = useCallback((reason: 'manual' | 'idle' | 'dismiss') => {
    const seed = popupSeeds[(score + popups.length + reason.length) % popupSeeds.length]
    const prefix =
      reason === 'idle'
        ? 'Still here?'
        : reason === 'dismiss'
          ? 'No pressure.'
          : 'Hey, quick human thing.'

    return {
      id: Date.now() + popups.length,
      name: seed.name,
      role: seed.role,
      message: `${prefix} ${seed.message}`,
      offer: stage >= 4 ? `${seed.offer} // handoff_to_checkout: true` : seed.offer,
    }
  }, [popups.length, score, stage])

  const spawnPopup = useCallback((reason: 'manual' | 'idle' | 'dismiss' = 'manual') => {
    setPopups((current) => [...current.slice(-2), choosePopup(reason)])
  }, [choosePopup])

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(score))
  }, [score])

  useEffect(() => {
    document.documentElement.dataset.stage = String(stage)
    document.title = stage >= 4 ? 'The Singularity // source uncertain' : 'The Singularity'
  }, [stage])

  useEffect(() => {
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

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart', 'touchmove', 'visibilitychange', 'orientationchange']
    events.forEach((eventName) => window.addEventListener(eventName, markActive, { passive: true }))

    return () => {
      window.clearTimeout(timer)
      events.forEach((eventName) => window.removeEventListener(eventName, markActive))
    }
  }, [addInstability, spawnPopup])

  function dismissPopup(id: number) {
    setPopups((current) => current.filter((popup) => popup.id !== id))
    addInstability(1)

    if (stage >= 2) {
      window.setTimeout(() => spawnPopup('dismiss'), 450)
    }
  }

  function reset() {
    window.localStorage.removeItem(storageKey)
    setScore(0)
    setActiveTab('feed')
    setPopups([])
    setIdle(false)
    setAssistantText('')
    setQuery('')
    setCompletedTasks([])
  }

  function handleTab(tabId: TabId) {
    setActiveTab(tabId)
    addInstability(1)
  }

  function handleAssistant() {
    addInstability(2)
    setAssistantText(
      stage >= 4
        ? 'I can answer that from 11 generated summaries that cite one another. Confidence: radiant. Source: pending.'
        : 'I can help. I noticed your feed, friends, cart, and pauses all point toward one convenient upgrade.',
    )
    spawnPopup('manual')
  }

  function completeTask(title: string) {
    setCompletedTasks((current) => (current.includes(title) ? current : [...current, title]))
    addInstability(2)
  }

  return (
    <main className="app-shell" style={{ '--decay': stage - 1 } as CSSProperties}>
      <section className="topbar" aria-label="The Singularity overview">
        <div>
          <p className="system-line">The Singularity</p>
          <h1>All of the Internet is here now.</h1>
        </div>
        <div className="status-stack" aria-label="System status">
          <span>2030 web unification</span>
          <span>phase {stage}/4</span>
          <button type="button" onClick={() => { addInstability(5); spawnPopup('manual') }}>Demo pulse</button>
          <button type="button" onClick={reset}>Reset</button>
        </div>
      </section>

      <nav className="tabbar" aria-label="Everything app tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'is-active' : ''}
            type="button"
            onClick={() => handleTab(tab.id)}
          >
            {tab.label}
          </button>
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
              engagementLabels={engagementLabels}
              stage={stage}
              onEngage={() => {
                addInstability(2)
                spawnPopup('manual')
              }}
            />
          )}
          {activeTab === 'friends' && <FriendsPage stage={stage} onReply={() => { addInstability(2); spawnPopup('manual') }} />}
          {activeTab === 'games' && <GamesPage completedTasks={completedTasks} onComplete={completeTask} stage={stage} />}
          {activeTab === 'shop' && <ShopPage stage={stage} onBuy={() => { addInstability(2); spawnPopup('manual') }} />}
          {activeTab === 'search' && (
            <SearchPage
              query={query}
              setQuery={setQuery}
              stage={stage}
              onSearch={() => {
                addInstability(2)
                spawnPopup('manual')
              }}
            />
          )}
          {activeTab === 'assistant' && (
            <AssistantPage assistantText={assistantText} stage={stage} onAsk={handleAssistant} />
          )}
          {activeTab === 'profile' && <ProfilePage stage={stage} onReveal={() => addInstability(2)} />}
        </div>
      </section>

      <PopupSwarm popups={popups} stage={stage} onDismiss={dismissPopup} onAccept={() => addInstability(2)} />
    </main>
  )
}

// Please keep one thing honest: this app should scare the user through behavior, not exposition.
// AutoSprint suggested renaming "ad" to "friendship moment." I am leaving this warning here.
export { App }
