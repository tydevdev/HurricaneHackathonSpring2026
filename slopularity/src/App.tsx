import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { pushActivity } from './activityLog'
import { BugScatter } from './components/BugScatter'
import { CrackRepairAssistant } from './components/CrackRepairAssistant'
import { HumanDevRescue } from './components/HumanDevRescue'
import { IdleEye } from './components/IdleEye'
import { LonelinessPopup, type IdleNudgeAction } from './components/LonelinessPopup'
import { PageFracture } from './components/PageFracture'
import { PopupSwarm } from './components/PopupSwarm'
import { fragmentLeaks, newsPosts, popupSeeds, tabs as defaultTabs } from './content'
import { recoveryScore } from './decayRecovery'
import { featureFlags } from './featureFlags'
import { choosePageWarp, pageWarpModeClassNames, pageWarpStartStage, type PageWarp } from './pageWarp'
import { AssistantPage } from './pages/AssistantPage'
import { FeedPage } from './pages/FeedPage'
import { FriendsPage } from './pages/FriendsPage'
import { GamesPage } from './pages/GamesPage'
import { ProfilePage } from './pages/ProfilePage'
import { appBasePath, pathForTab, tabFromLocation } from './routes'
import { SearchPage } from './pages/SearchPage'
import { ShopPage } from './pages/ShopPage'
import type { Popup, ScrollStats, TabId } from './types'
import { maxDecayScore, maxDecayStage, scoreForStage, shouldShowPageFractures, stageFor } from './utils'

const storageKey = 'slopularity-state-v1'
const enteredKey = 'slopularity-entered-v1'
const scrollStatsKey = 'slopularity-scroll-stats-v1'
const CRACK_EXPERIENCE_COOLDOWN_MS = 120_000
type PopupReason = 'manual' | 'idle' | 'dismiss'
type ActivePageWarp = PageWarp & {
  tabId: TabId
  token: number
}

const popupProductTargets: Record<string, string> = {
  Honey: 'glownest',
  Pia: 'snapwake',
  Devon: 'aurabank',
  Jules: 'facemint',
  Marlo: 'memorywarm',
  Echo: 'context',
}

const emptyScrollStats: ScrollStats = {
  activeSeconds: 0,
  eventCount: 0,
  distancePx: 0,
  bestBurstSeconds: 0,
}

function loadScore() {
  if (typeof window === 'undefined') return 0
  const raw = window.localStorage.getItem(storageKey)
  if (!raw) {
    return 0
  }

  const value = Number.parseInt(raw, 10)
  return Number.isFinite(value) ? value : 0
}

function loadScrollStats(): ScrollStats {
  if (typeof window === 'undefined') return emptyScrollStats

  try {
    const raw = window.localStorage.getItem(scrollStatsKey)
    if (!raw) {
      return emptyScrollStats
    }

    const parsed = JSON.parse(raw) as Partial<ScrollStats>
    return {
      activeSeconds: Math.max(0, Number(parsed.activeSeconds) || 0),
      eventCount: Math.max(0, Number(parsed.eventCount) || 0),
      distancePx: Math.max(0, Number(parsed.distancePx) || 0),
      bestBurstSeconds: Math.max(0, Number(parsed.bestBurstSeconds) || 0),
    }
  } catch {
    return emptyScrollStats
  }
}

function loadTab(): TabId {
  if (typeof window === 'undefined') return 'feed'
  return tabFromLocation() ?? 'feed'
}

function pathForLanding(location: Location = window.location) {
  const appRoot = appBasePath(location)
  return appRoot.replace(/\/app\/?$/, '/') || '/'
}

function shuffleTabs<T>(tabs: T[]) {
  if (tabs.length < 2) {
    return tabs
  }

  const shuffled = [...tabs]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]!
    shuffled[index] = shuffled[swapIndex]!
    shuffled[swapIndex] = current
  }

  const unchanged = tabs.every((tab, index) => tab === shuffled[index])
  if (unchanged) {
    const first = shuffled.shift()
    if (first) {
      shuffled.push(first)
    }
  }

  return shuffled
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>(loadTab)
  const [score, setScore] = useState(loadScore)
  const [popups, setPopups] = useState<Popup[]>([])
  const [muted, setMuted] = useState(false)
  const [assistantText, setAssistantText] = useState('')
  const [query, setQuery] = useState('')
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [scrollStats, setScrollStats] = useState<ScrollStats>(loadScrollStats)
  const [feedSpotlight, setFeedSpotlight] = useState<{ postId: string; token: number } | null>(null)
  const [friendFocus, setFriendFocus] = useState<{ name: string; token: number } | null>(null)
  const [searchLaunch, setSearchLaunch] = useState<{ query: string; token: number } | null>(null)
  const [shopClaim, setShopClaim] = useState<{ productId?: string; token: number } | null>(null)
  const [pageWarp, setPageWarp] = useState<ActivePageWarp | null>(null)
  const [cracksRepaired, setCracksRepaired] = useState(false)
  const [crackExperienceReady, setCrackExperienceReady] = useState(false)
  const [crackExperienceKey, setCrackExperienceKey] = useState(0)
  // We allow at most one "softer follow-up" after a dismiss, and only when
  // the user has been around long enough to read it as escalation rather than
  // a respawn loop. Tracked here so dismissals don't endlessly chain.
  const followupArmedRef = useRef(true)
  const lastScrollYRef = useRef(0)
  const scrollBurstRef = useRef({ lastAt: 0, startedAt: 0 })
  const previousTabRef = useRef(activeTab)

  // ── Idle surveillance state ──
  const [idleEyeVisible, setIdleEyeVisible] = useState(false)
  const [lonelinessVisible, setLonelinessVisible] = useState(false)
  const [idleNudgeIndex, setIdleNudgeIndex] = useState(0)
  const idleSecondsRef = useRef(0)
  const idleReorgDoneRef = useRef(false)
  const idleNudgeShownRef = useRef(false)
  const queuedPopupReasonRef = useRef<PopupReason | null>(null)
  const lastCrackExperienceAtRef = useRef(0)
  const crackExperienceEligibleRef = useRef(false)
  // Interaction-driven popups: spawn one on average every ~4 meaningful
  // interactions, with a hard cooldown so the dock never feels spammy.
  const interactionsSinceSpawnRef = useRef(0)
  const lastSpawnAtRef = useRef(0)
  const POPUP_COOLDOWN_MS = 9000
  const POPUP_INTERACTION_THRESHOLD = 4
  // Tabs can be silently reordered during idle. Store the current order.
  const [tabOrder, setTabOrder] = useState(defaultTabs)

  const interruptionMode = featureFlags.interruptionLayer
  const stage = stageFor(score)
  const visibleStage = interruptionMode ? stage : 1
  const pageFracturesEligible = shouldShowPageFractures(visibleStage, cracksRepaired)
  const pageFracturesVisible = pageFracturesEligible && crackExperienceReady

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
    setScore((current) => Math.min(maxDecayScore, current + amount))
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
        source: reason,
        intent: seed.intent,
      }
    },
    [popups.length, score, visibleStage],
  )

  const spawnPopup = useCallback(
    (reason: PopupReason = 'manual') => {
      if (muted) return
      lastSpawnAtRef.current = Date.now()
      interactionsSinceSpawnRef.current = 0
      setPopups((current) => [...current.slice(-2), choosePopup(reason)])
    },
    [choosePopup, muted],
  )

  // Interaction-driven spawn: callable from page handlers. Tracks how many
  // meaningful clicks have happened since the last popup, and respects a
  // cooldown so popups feel attentive instead of spammy.
  const spawnFromInteraction = useCallback(() => {
    if (muted || !interruptionMode) return
    const now = Date.now()
    interactionsSinceSpawnRef.current += 1
    if (
      interactionsSinceSpawnRef.current >= POPUP_INTERACTION_THRESHOLD
      && now - lastSpawnAtRef.current >= POPUP_COOLDOWN_MS
    ) {
      spawnPopup('manual')
    }
  }, [interruptionMode, muted, spawnPopup])

  const queuePopup = useCallback(
    (reason: PopupReason = 'manual') => {
      if (muted) return
      queuedPopupReasonRef.current = reason
    },
    [muted],
  )

  const dismissScreenPopups = useCallback(() => {
    setPopups([])
    setLonelinessVisible(false)
    setIdleEyeVisible(false)
    queuedPopupReasonRef.current = null
    idleSecondsRef.current = 0
    idleNudgeShownRef.current = false
  }, [])

  useEffect(() => {
    if (previousTabRef.current === activeTab) {
      return
    }

    previousTabRef.current = activeTab
    dismissScreenPopups()

    const nextWarp = choosePageWarp(visibleStage)
    setPageWarp(nextWarp ? { ...nextWarp, tabId: activeTab, token: Date.now() } : null)
  }, [activeTab, dismissScreenPopups, visibleStage])

  useEffect(() => {
    const alignActiveTabs = () => {
      document.querySelectorAll<HTMLElement>('.tabbar').forEach((tabbar) => {
        const activeLink = tabbar.querySelector<HTMLElement>('[aria-current="page"]')
        if (!activeLink) {
          return
        }

        const centeredLeft = activeLink.offsetLeft - ((tabbar.clientWidth - activeLink.offsetWidth) / 2)
        const maxLeft = Math.max(0, tabbar.scrollWidth - tabbar.clientWidth)
        tabbar.scrollLeft = Math.min(maxLeft, Math.max(0, centeredLeft))
      })
    }

    const frameId = window.requestAnimationFrame(alignActiveTabs)
    const timeoutId = window.setTimeout(alignActiveTabs, 120)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
    }
  }, [activeTab, tabOrder])

  useEffect(() => {
    if (visibleStage < pageWarpStartStage) {
      const frameId = window.requestAnimationFrame(() => setPageWarp(null))
      return () => window.cancelAnimationFrame(frameId)
    }
    return undefined
  }, [visibleStage])

  useEffect(() => {
    if (visibleStage < maxDecayStage) {
      const frameId = window.requestAnimationFrame(() => setCracksRepaired(false))
      return () => window.cancelAnimationFrame(frameId)
    }
    return undefined
  }, [visibleStage])

  useEffect(() => {
    let frameId: number | null = null
    const scheduleReady = (ready: boolean) => {
      frameId = window.requestAnimationFrame(() => setCrackExperienceReady(ready))
    }
    const cleanupFrame = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
    const triggerCrackExperience = () => {
      lastCrackExperienceAtRef.current = Date.now()
      crackExperienceEligibleRef.current = true
      frameId = window.requestAnimationFrame(() => {
        setCrackExperienceReady(true)
        setCrackExperienceKey((current) => current + 1)
      })
    }

    if (!pageFracturesEligible) {
      crackExperienceEligibleRef.current = false
      scheduleReady(false)
      return cleanupFrame
    }

    const now = Date.now()
    const elapsed = now - lastCrackExperienceAtRef.current

    if (!crackExperienceEligibleRef.current) {
      if (lastCrackExperienceAtRef.current === 0 || elapsed >= CRACK_EXPERIENCE_COOLDOWN_MS) {
        triggerCrackExperience()
        return cleanupFrame
      }

      scheduleReady(false)
      const timeoutId = window.setTimeout(triggerCrackExperience, CRACK_EXPERIENCE_COOLDOWN_MS - elapsed)
      return () => {
        cleanupFrame()
        window.clearTimeout(timeoutId)
      }
    }

    if (elapsed >= CRACK_EXPERIENCE_COOLDOWN_MS) {
      triggerCrackExperience()
    } else {
      scheduleReady(true)
    }

    return cleanupFrame
  }, [activeTab, pageFracturesEligible])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, String(score))
  }, [score])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(scrollStatsKey, JSON.stringify(scrollStats))
  }, [scrollStats])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    lastScrollYRef.current = window.scrollY

    const recordScroll = () => {
      const currentY = window.scrollY
      const distance = Math.abs(currentY - lastScrollYRef.current)
      lastScrollYRef.current = currentY

      if (distance < 2) {
        return
      }

      const now = Date.now()
      const burst = scrollBurstRef.current
      const isNewBurst = burst.lastAt === 0 || now - burst.lastAt > 2500
      if (isNewBurst) {
        burst.startedAt = now
      }

      const activeDelta = isNewBurst ? 1 : Math.min(2, Math.max(0.25, (now - burst.lastAt) / 1000))
      burst.lastAt = now
      const burstSeconds = Math.max(activeDelta, (now - burst.startedAt) / 1000)

      setScrollStats((current) => ({
        activeSeconds: Math.min(99999, current.activeSeconds + activeDelta),
        eventCount: Math.min(99999, current.eventCount + 1),
        distancePx: Math.min(9999999, current.distancePx + distance),
        bestBurstSeconds: Math.max(current.bestBurstSeconds, burstSeconds),
      }))
    }

    window.addEventListener('scroll', recordScroll, { passive: true })
    return () => window.removeEventListener('scroll', recordScroll)
  }, [])

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

  function handlePopupReply(id: number) {
    const popup = popups.find((candidate) => candidate.id === id)
    if (popup) {
      setFriendFocus({ name: popup.name, token: Date.now() })
    }
    setPopups((current) => current.filter((popup) => popup.id !== id))
    addInstability(2)
    handleTab('friends')
  }

  function handlePopupOffer(id: number) {
    const popup = popups.find((candidate) => candidate.id === id)
    const productId = popup ? popupProductTargets[popup.name] : undefined
    setShopClaim({ productId, token: Date.now() })
    setPopups((current) => current.filter((popup) => popup.id !== id))
    addInstability(2)
    handleTab('shop')
  }

  function reset() {
    if (typeof window !== 'undefined') {
      // Clear every slopularity-* key from both storages so feed scroll
      // unlocks, local posts, profile progress, and any other per-tab state
      // genuinely reset. Iterate keys snapshot-first because removeItem
      // mutates the index.
      const wipe = (storage: Storage) => {
        const keys: string[] = []
        for (let i = 0; i < storage.length; i += 1) {
          const key = storage.key(i)
          if (key && (key.startsWith('slopularity:') || key.startsWith('slopularity-'))) {
            keys.push(key)
          }
        }
        keys.forEach((key) => storage.removeItem(key))
      }
      try { wipe(window.localStorage) } catch { /* storage may be blocked */ }
      try { wipe(window.sessionStorage) } catch { /* storage may be blocked */ }
      // Real navigation back to the landing entry page.
      window.location.href = pathForLanding(window.location)
      return
    }
    setScore(0)
    setActiveTab('feed')
    setPopups([])
    setMuted(false)
    setAssistantText('')
    setQuery('')
    setCompletedTasks([])
    setScrollStats(emptyScrollStats)
    setTabOrder(defaultTabs)
    setCracksRepaired(false)
    setCrackExperienceReady(false)
    setCrackExperienceKey(0)
    lastCrackExperienceAtRef.current = 0
    crackExperienceEligibleRef.current = false
    queuedPopupReasonRef.current = null
    followupArmedRef.current = true
  }

  function handleTab(tabId: TabId) {
    const isNewScreen = tabId !== activeTab
    if (isNewScreen) {
      setTabOrder((current) => shuffleTabs(current))
    }

    if (typeof window !== 'undefined' && tabFromLocation() !== tabId) {
      window.history.pushState(null, '', pathForTab(tabId))
    }
    setActiveTab(tabId)
    addInstability(1)
    pushActivity('nav', 'tab', tabId)
    if (isNewScreen) {
      spawnFromInteraction()
    }
  }

  function handleAssistant(prompt = query || 'general') {
    addInstability(2)
    pushActivity('assistant', 'ask', prompt)
    setAssistantText(
      visibleStage >= 4
        ? 'I can answer that from 11 generated summaries that cite one another. Confidence: radiant. Source: pending.'
        : 'I can help. I noticed your feed, friends, cart, and pauses all point toward one convenient upgrade.',
    )
    spawnFromInteraction()
  }

  function handleOpenInbox() {
    setFriendFocus({ name: 'Honey', token: Date.now() })
    pushActivity('feed', 'open_inbox', 'Honey')
    handleTab('friends')
  }

  function handleFriendShopIntent(productId?: string) {
    setShopClaim({ productId, token: Date.now() })
    handleTab('shop')
  }

  function handleDemoPulse() {
    setScore((current) => {
      const nextStage = Math.min(maxDecayStage, stageFor(current) + 1)
      return Math.min(maxDecayScore, Math.max(current + 1, scoreForStage(nextStage)))
    })
    spawnPopup('manual')
    pushActivity('system', 'demo_pulse', `stage_${Math.min(maxDecayStage, stageFor(score) + 1)}`)
  }

  function completeTask(title: string) {
    setCompletedTasks((current) => (current.includes(title) ? current : [...current, title]))
    addInstability(2)
    pushActivity('games', 'complete', title)
  }

  function increaseDecayFromProfile() {
    setScore((current) => {
      const currentStage = stageFor(current)
      if (currentStage >= maxDecayStage) {
        return Math.min(maxDecayScore, current + 3)
      }

      return Math.min(maxDecayScore, Math.max(current + 1, scoreForStage(currentStage + 1)))
    })
    pushActivity('profile', 'demo_decay', 'increase')
  }

  function maximizeDecayFromProfile() {
    setScore((current) => Math.max(current, scoreForStage(maxDecayStage)))
    pushActivity('profile', 'demo_decay', `stage_${maxDecayStage}`)
  }

  function handleRepairCracks() {
    setCracksRepaired(true)
    pushActivity('system', 'spackle_repair', `stage_${visibleStage}`)
  }

  function handleHumanDevRescue() {
    setScore(recoveryScore())
    setPageWarp(null)
    setCracksRepaired(false)
    setCrackExperienceReady(false)
    crackExperienceEligibleRef.current = false
    dismissScreenPopups()
    pushActivity('system', 'human_dev_rescue', 'stage_1')
  }

  function handleRepairPageWarp() {
    setPageWarp(null)
    pushActivity('system', 'page_warp_repair', pageWarp ? pageWarp.tabId : activeTab)
  }

  function handleLonelinessDismiss() {
    setLonelinessVisible(false)
    addInstability(1)
  }

  function handleIdleNudgeAct(action: IdleNudgeAction) {
    setLonelinessVisible(false)
    addInstability(2)

    if (action.kind === 'feed-post') {
      setFeedSpotlight({ postId: action.postId, token: Date.now() })
      handleTab('feed')
      return
    }

    if (action.kind === 'friends') {
      if (action.friendName) {
        setFriendFocus({ name: action.friendName, token: Date.now() })
      }
      handleTab('friends')
      return
    }

    if (action.kind === 'search') {
      setQuery(action.query)
      setSearchLaunch({ query: action.query, token: Date.now() })
      handleTab('search')
      return
    }

    if (action.kind === 'shop') {
      setShopClaim({ productId: action.productId, token: Date.now() })
      handleTab('shop')
      return
    }

    handleAssistant(action.prompt)
    handleTab('assistant')
  }

  function handleTabbarClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    const tabId = event.currentTarget.dataset.tabId as TabId | undefined
    if (tabId) {
      handleTab(tabId)
    }
  }

  function renderTabbar(placement: 'global' | 'feed-mobile') {
    return (
      <nav className={`tabbar tabbar-${placement}`} aria-label="Everything app tabs">
        <a className="tabbar-landing-link" href={pathForLanding()}>
          Landing
        </a>
        {tabOrder.map((tab) => (
          <a
            key={tab.id}
            className={activeTab === tab.id ? 'is-active' : ''}
            href={pathForTab(tab.id)}
            data-tab-id={tab.id}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            onClick={handleTabbarClick}
          >
            {tab.label}
          </a>
        ))}
      </nav>
    )
  }

  const workspaceClasses = [
    'workspace',
    ...(pageWarp?.modes.map((mode) => pageWarpModeClassNames[mode]) ?? []),
  ]
    .filter(Boolean)
    .join(' ')

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
          <span
            className={`phase-pill phase-${visibleStage}`}
            role="img"
            aria-label={`Phase ${visibleStage} of ${maxDecayStage}`}
            title={`Phase ${visibleStage} of ${maxDecayStage}`}
          >
            <span className="phase-dot" aria-hidden="true" />
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
          <button
            type="button"
            className="appbar-quiet"
            onClick={handleDemoPulse}
            aria-label="Advance the demo to the next decay phase"
            title="Advance to the next decay phase"
          >
            Demo pulse
          </button>
          <button type="button" className="appbar-quiet" onClick={reset} aria-label="Reset everything app to its first impression">
            Reset
          </button>
          <a
            className="appbar-avatar"
            href={pathForTab('profile')}
            aria-label="Open profile"
            aria-current={activeTab === 'profile' ? 'page' : undefined}
            onClick={(event) => {
              event.preventDefault()
              handleTab('profile')
            }}
          >
            ME
          </a>
        </div>
      </header>

      {renderTabbar('global')}

      <section
        className={workspaceClasses}
        data-page-warp-token={pageWarp?.token}
        aria-live="polite"
      >
        <div className="tab-panel">
          {activeTab === 'feed' && (
            <FeedPage
              stage={visibleStage}
              onEngage={() => addInstability(1)}
              onOpenInbox={handleOpenInbox}
              mobileNavigation={renderTabbar('feed-mobile')}
              spotlightPostId={feedSpotlight?.postId}
              spotlightToken={feedSpotlight?.token}
            />
          )}
          {activeTab === 'news' && (
            <FeedPage
              stage={visibleStage}
              onEngage={() => addInstability(1)}
              onOpenInbox={handleOpenInbox}
              mobileNavigation={renderTabbar('feed-mobile')}
              posts={newsPosts}
              sectionLabel="News"
              storageNamespace="news"
            />
          )}
          {activeTab === 'friends' && (
            <FriendsPage
              stage={visibleStage}
              onReply={() => { addInstability(2); spawnFromInteraction() }}
              onShopIntent={handleFriendShopIntent}
              focusFriendName={friendFocus?.name}
              focusToken={friendFocus?.token}
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
              onBuy={() => { addInstability(2); spawnFromInteraction() }}
              claimProductId={shopClaim?.productId}
              claimToken={shopClaim?.token}
            />
          )}
          {activeTab === 'search' && (
            <SearchPage
              query={query}
              setQuery={setQuery}
              stage={visibleStage}
              onSearch={() => { addInstability(2); spawnFromInteraction() }}
              launchQuery={searchLaunch?.query}
              launchToken={searchLaunch?.token}
            />
          )}
          {activeTab === 'assistant' && (
            <AssistantPage assistantText={assistantText} stage={visibleStage} onAsk={handleAssistant} />
          )}
          {activeTab === 'profile' && (
            <ProfilePage
              completedTaskCount={completedTasks.length}
              scrollStats={scrollStats}
              stage={visibleStage}
              score={score}
              onIncreaseDecay={increaseDecayFromProfile}
              onMaxDecay={maximizeDecayFromProfile}
              onReveal={() => addInstability(2)}
            />
          )}
        </div>
      </section>

      {pageFracturesVisible && <PageFracture key={`fracture-${crackExperienceKey}`} stage={visibleStage} />}
      {pageFracturesVisible && (
        <CrackRepairAssistant key={`repair-${visibleStage}`} stage={visibleStage} onRepair={handleRepairCracks} />
      )}
      <HumanDevRescue stage={visibleStage} onComplete={handleHumanDevRescue} />

      {pageWarp && (
        <div className="helpy-rescue page-warp-repair" role="dialog" aria-label="Helpy page repair">
          <div className="helpy-rescue-bubble">
            <div className="helpy-rescue-avatar" aria-hidden="true">
              <span className="helpy-rescue-face">🤖</span>
            </div>
            <div className="helpy-rescue-body">
              <p className="helpy-rescue-name">Helpy</p>
              <p className="helpy-rescue-msg">
                Uh oh, looks like something&apos;s wrong,{' '}
                <button type="button" className="helpy-rescue-link" onClick={handleRepairPageWarp}>
                  click here to fix!
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {interruptionMode && (
        <PopupSwarm
          popups={visiblePopups}
          stage={visibleStage}
          muted={muted}
          onDismiss={dismissPopup}
          onAccept={handlePopupReply}
          onOffer={handlePopupOffer}
          onClearAll={clearAllPopups}
          onMute={toggleMute}
        />
      )}

      {/* Idle surveillance layer */}
      <BugScatter stage={visibleStage} />
      <IdleEye visible={idleEyeVisible} decayStage={visibleStage} />
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
