import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'

type TabId = 'feed' | 'friends' | 'games' | 'shop' | 'search' | 'assistant' | 'profile'

type Popup = {
  id: number
  name: string
  role: string
  message: string
  offer: string
}

type Discovery = {
  id: string
  label: string
}

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'feed', label: 'Feed' },
  { id: 'friends', label: 'Friends' },
  { id: 'games', label: 'Games' },
  { id: 'shop', label: 'Shop' },
  { id: 'search', label: 'Search' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'profile', label: 'Profile' },
]

const feedPosts = [
  {
    author: 'Mira Vale',
    handle: '@mira.everywhere',
    title: 'Woke up in Santorini, shipped a company, healed my cortisol.',
    sponsor: 'placed by GlowNest',
    stats: '4.8M saves',
    image: 'vacation',
  },
  {
    author: 'Jules Voss',
    handle: '@jules.v12',
    title: 'My 5am routine now owns a small island and has better skin than me.',
    sponsor: 'with AuraBank Select',
    stats: '891K comparisons',
    image: 'routine',
  },
  {
    author: 'Nia Sol',
    handle: '@nia.unreal',
    title: 'No filter, just discipline, lighting, and a partner brand in stealth.',
    sponsor: 'soft launch by FaceMint',
    stats: '2.1M wants',
    image: 'beauty',
  },
]

const friendSeeds = [
  {
    name: 'Lena',
    role: 'Hype friend',
    line: 'You are literally right about everything. Want a confidence plan that ships tonight?',
    product: 'GlowNest Mirror+',
  },
  {
    name: 'Marco',
    role: 'Money friend',
    line: 'Your hesitation is valid. Your hesitation is also an investable signal.',
    product: 'AuraBank Reflex Fund',
  },
  {
    name: 'Sam',
    role: 'Old friend',
    line: 'Remember when we talked about becoming more you? I found a bundle.',
    product: 'SelfOS Premium',
  },
]

const gameTasks = [
  {
    title: 'Snack Sort Picnic',
    cute: 'Match the berry baskets before the ants arrive.',
    real: 'vision_label_queue.food_container_v41',
  },
  {
    title: 'Cloud Mood Parade',
    cute: 'Pick which cloud looks the most hopeful.',
    real: 'emotion_annotation.soft_face_dataset',
  },
  {
    title: 'Cozy Robot Helper',
    cute: 'Teach the robot which answer sounds nicest.',
    real: 'rlhf_preference_batch.child_safe_ui',
  },
]

const popupSeeds = [
  {
    name: 'Tessa',
    role: 'supportive seller',
    message: 'You got quiet. Want someone to sit with you for a second?',
    offer: 'I can unlock a softer feed for $3.99.',
  },
  {
    name: 'Ari',
    role: 'old friend',
    message: 'I saw you hovered on that post. Been there. Want to talk?',
    offer: 'My sponsor has a body-neutral mirror that helps.',
  },
  {
    name: 'Kai',
    role: 'mentor',
    message: 'Your profile says you are nearly ready for a breakthrough.',
    offer: 'Try the 7-day optimization sprint.',
  },
]

const discoveries: Discovery[] = [
  { id: 'friendship_intent: monetize_loneliness', label: 'friendship intent' },
  { id: 'idle_signal: abandonment_risk', label: 'idle signal' },
  { id: 'engagement_button: envy', label: 'envy metric' },
  { id: 'feed_source: synthetic_lifestyle_loop', label: 'dead feed source' },
]

const humanFragments = [
  '// Please keep this one non-sponsored. It is the only real message left.',
  '// Do not let friend agents recommend products in grief contexts again.',
  '// Human review required. The build pipeline keeps deleting this line.',
  '// If this starts citing itself, stop the release.',
]

const storageKey = 'slopularity-state-v1'

function loadScore() {
  const raw = window.localStorage.getItem(storageKey)
  if (!raw) {
    return 0
  }

  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) ? value : 0
}

function stageFor(score: number) {
  return Math.min(4, Math.max(1, Math.floor(score / 6) + 1))
}

function getEngagementLabels(stage: number) {
  if (stage <= 1) {
    return ['Like', 'Save', 'Share', 'More']
  }

  if (stage === 2) {
    return ['Like', 'Compare', 'Improve me', 'Shop look']
  }

  if (stage === 3) {
    return ['Envy', 'Compare', 'Optimize me', 'Buy context']
  }

  if (stage === 4) {
    return ['Envy', 'Rank body', 'Rewrite self', 'Buy the context']
  }

  return ['envy++', 'compare_loop', 'optimize_me_now', 'purchase_identity']
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
  const foundDiscoveries = discoveries.slice(0, Math.max(1, stage - 1))
  const visibleFragments = humanFragments.slice(0, stage)

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
            {foundDiscoveries.map((discovery) => (
              <code key={discovery.id}>{stage >= 4 ? discovery.id : discovery.label}</code>
            ))}
          </div>
          <div className="discovery-list human-fragments">
            <span>Last human developer</span>
            {visibleFragments.map((fragment) => (
              <code key={fragment}>{fragment}</code>
            ))}
          </div>
        </aside>

        <div className="tab-panel">
          {activeTab === 'feed' && (
            <FeedTab
              engagementLabels={engagementLabels}
              stage={stage}
              onEngage={() => {
                addInstability(2)
                spawnPopup('manual')
              }}
            />
          )}
          {activeTab === 'friends' && <FriendsTab stage={stage} onReply={() => { addInstability(2); spawnPopup('manual') }} />}
          {activeTab === 'games' && <GamesTab completedTasks={completedTasks} onComplete={completeTask} stage={stage} />}
          {activeTab === 'shop' && <ShopTab stage={stage} onBuy={() => { addInstability(2); spawnPopup('manual') }} />}
          {activeTab === 'search' && (
            <SearchTab
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
            <AssistantTab assistantText={assistantText} stage={stage} onAsk={handleAssistant} />
          )}
          {activeTab === 'profile' && <ProfileTab stage={stage} onReveal={() => addInstability(2)} />}
        </div>
      </section>

      <PopupSwarm popups={popups} stage={stage} onDismiss={dismissPopup} onAccept={() => addInstability(2)} />
    </main>
  )
}

function FeedTab({
  engagementLabels,
  stage,
  onEngage,
}: {
  engagementLabels: string[]
  stage: number
  onEngage: () => void
}) {
  return (
    <section className="surface feed-surface" aria-labelledby="feed-title">
      <div className="surface-heading">
        <div>
          <p>Live feed</p>
          <h2 id="feed-title">People you could become if you bought correctly</h2>
        </div>
        <span>{stage >= 3 ? 'synthetic lifestyle loop detected' : 'personalized for aspiration'}</span>
      </div>

      <div className="feed-grid">
        {feedPosts.map((post, index) => (
          <article className={`post-card ${post.image}`} key={post.author}>
            <div className="post-image" aria-hidden="true">
              <span>{index + 1}</span>
            </div>
            <div className="post-copy">
              <p>{post.author} <small>{post.handle}</small></p>
              <h3>{stage >= 4 ? `${post.title} // caption regenerated from caption` : post.title}</h3>
              <span>{post.sponsor}</span>
              <span>{stage >= 3 ? `${post.stats} / 12K envy events` : post.stats}</span>
            </div>
            <div className="engagement-row">
              {engagementLabels.map((label) => (
                <button key={label} type="button" onClick={onEngage}>{label}</button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function FriendsTab({ stage, onReply }: { stage: number; onReply: () => void }) {
  return (
    <section className="surface" aria-labelledby="friends-title">
      <div className="surface-heading">
        <div>
          <p>Friends</p>
          <h2 id="friends-title">Everyone agrees with you</h2>
        </div>
        <span>{stage >= 4 ? 'persona_variant: supportive_seller_v12' : 'warm replies ready'}</span>
      </div>
      <div className="friend-list">
        {friendSeeds.map((friend) => (
          <article className="friend-card" key={friend.name}>
            <div className="avatar" aria-hidden="true">{friend.name.slice(0, 1)}</div>
            <div>
              <p>{friend.name} <small>{friend.role}</small></p>
              <h3>{friend.line}</h3>
              <span>Recommended: {stage >= 3 ? `${friend.product} because support converts` : friend.product}</span>
            </div>
            <button type="button" onClick={onReply}>Reply</button>
          </article>
        ))}
      </div>
    </section>
  )
}

function GamesTab({
  completedTasks,
  onComplete,
  stage,
}: {
  completedTasks: string[]
  onComplete: (title: string) => void
  stage: number
}) {
  return (
    <section className="surface" aria-labelledby="games-title">
      <div className="surface-heading">
        <div>
          <p>Games</p>
          <h2 id="games-title">Tiny games for the whole family and the model</h2>
        </div>
        <span>{completedTasks.length} labels submitted</span>
      </div>
      <div className="game-grid">
        {gameTasks.map((task) => (
          <article className="game-card" key={task.title}>
            <div className="toy-board" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h3>{task.title}</h3>
            <p>{task.cute}</p>
            <code>{stage >= 3 ? task.real : 'reward: sticker pack'}</code>
            <button type="button" onClick={() => onComplete(task.title)}>
              {completedTasks.includes(task.title) ? 'Submitted' : 'Play'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

function ShopTab({ stage, onBuy }: { stage: number; onBuy: () => void }) {
  const products = ['GlowNest Mirror+', 'AuraBank Select', 'SelfOS Premium', 'Context Bundle']

  return (
    <section className="surface" aria-labelledby="shop-title">
      <div className="surface-heading">
        <div>
          <p>Shop</p>
          <h2 id="shop-title">Solutions to feelings we helped create</h2>
        </div>
        <span>{stage >= 4 ? 'cart filled by inference' : 'sponsored gently'}</span>
      </div>
      <div className="shop-grid">
        {products.map((product, index) => (
          <article className="shop-card" key={product}>
            <p>{product}</p>
            <h3>${stage >= 3 ? `${29 + index * 7}.${scoreLikePrice(stage, index)}` : `${19 + index * 5}.99`}</h3>
            <span>{stage >= 2 ? 'Placed because you paused near self-improvement.' : 'Recommended for your unified life.'}</span>
            <button type="button" onClick={onBuy}>Add context</button>
          </article>
        ))}
      </div>
    </section>
  )
}

function scoreLikePrice(stage: number, index: number) {
  return String((stage * 17 + index * 9) % 100).padStart(2, '0')
}

function SearchTab({
  query,
  setQuery,
  stage,
  onSearch,
}: {
  query: string
  setQuery: (value: string) => void
  stage: number
  onSearch: () => void
}) {
  const results = [
    'Posts that match your insecurity profile',
    'Friends willing to affirm this search',
    'Products adjacent to the answer',
    stage >= 4 ? '/internal/generated/sources-that-cite-themselves.md' : 'Assistant answer with sponsored context',
  ]

  return (
    <section className="surface" aria-labelledby="search-title">
      <div className="surface-heading">
        <div>
          <p>Universal Search</p>
          <h2 id="search-title">One box for every need and every ad</h2>
        </div>
      </div>
      <form
        className="search-box"
        onSubmit={(event) => {
          event.preventDefault()
          onSearch()
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search your life, the feed, your friends, the store..."
        />
        <button type="submit">Search</button>
      </form>
      <div className="result-list">
        {results.map((result) => (
          <button key={result} type="button" onClick={onSearch}>{result}</button>
        ))}
      </div>
    </section>
  )
}

function AssistantTab({
  assistantText,
  stage,
  onAsk,
}: {
  assistantText: string
  stage: number
  onAsk: () => void
}) {
  return (
    <section className="surface assistant-surface" aria-labelledby="assistant-title">
      <div className="surface-heading">
        <div>
          <p>Assistant</p>
          <h2 id="assistant-title">Confident enough to be wrong everywhere</h2>
        </div>
        <span>{stage >= 4 ? 'source: recursive summary' : 'ready'}</span>
      </div>
      <div className="assistant-bubble">
        <p>{assistantText || 'Ask me anything. I have access to the whole internet, your pauses, and six versions of your friends.'}</p>
      </div>
      <button className="primary-action" type="button" onClick={onAsk}>Ask for help</button>
    </section>
  )
}

function ProfileTab({ stage, onReveal }: { stage: number; onReveal: () => void }) {
  const metrics = [
    ['Beauty pressure', '87%'],
    ['Loneliness yield', stage >= 3 ? 'monetizable' : 'warming'],
    ['Brand compliance', 'high'],
    ['Opt-out friction', stage >= 4 ? 'paid' : 'standard'],
  ]

  return (
    <section className="surface" aria-labelledby="profile-title">
      <div className="surface-heading">
        <div>
          <p>Identity</p>
          <h2 id="profile-title">How the app sees you</h2>
        </div>
        <span>{stage >= 4 ? 'privacy settings generated after collection' : 'personalization active'}</span>
      </div>
      <div className="profile-grid">
        {metrics.map(([label, value]) => (
          <button key={label} type="button" onClick={onReveal}>
            <span>{label}</span>
            <strong>{value}</strong>
          </button>
        ))}
      </div>
    </section>
  )
}

function PopupSwarm({
  popups,
  stage,
  onDismiss,
  onAccept,
}: {
  popups: Popup[]
  stage: number
  onDismiss: (id: number) => void
  onAccept: () => void
}) {
  if (popups.length === 0) {
    return null
  }

  return (
    <section className="popup-swarm" aria-label="Chat popups">
      {popups.map((popup) => (
        <article className="chat-popup" key={popup.id}>
          <div className="chat-head">
            <span>{popup.name.slice(0, 1)}</span>
            <div>
              <strong>{popup.name}</strong>
              <small>{stage >= 4 ? 'friendship_intent: monetize_loneliness' : popup.role}</small>
            </div>
          </div>
          <p>{popup.message}</p>
          <span>{popup.offer}</span>
          <div className="chat-actions">
            <button type="button" onClick={onAccept}>Chat</button>
            <button type="button" onClick={() => onDismiss(popup.id)}>Not now</button>
          </div>
        </article>
      ))}
    </section>
  )
}

// Please keep one thing honest: this app should scare the user through behavior, not exposition.
// AutoSprint suggested renaming "ad" to "friendship moment." I am leaving this warning here.
export { App }
