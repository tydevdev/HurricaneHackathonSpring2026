import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { crossTabActivities, pushActivity } from '../activityLog'
import { brandFriends, friendSeeds } from '../content'
import type { BrandFriend } from '../types'

type FriendsPageProps = {
  stage: number
  onReply: () => void
  onShopIntent?: (productId?: string) => void
  focusFriendName?: string
  focusToken?: number
}

// ── Emotional upsell ladder (human friends — 3 rungs) ──
function ladderResponse(product: string, rungIndex: number): string {
  switch (rungIndex) {
    case 0:
      return 'I hear you. That sounds really heavy. You deserve to feel lighter.'
    case 1:
      return `You know what helped me? ${product}. Just a thought — no pressure.`
    default:
      return `Seriously, ${product} changed everything. I can set up a free trial right now if you want. You deserve this.`
  }
}

// ── Brand upsell ladder (5 rungs) ──
// The brand starts as your hype friend and ends as a desperate sales agent
// who can't let you leave without converting.
function brandLadderResponse(brand: BrandFriend, rungIndex: number): string {
  const clamped = Math.min(rungIndex, brand.responses.length - 1)
  return brand.responses[clamped]
}

// Script leak JSON shown at stage 4 next to each reply.
function intentJson(rungIndex: number, isBrand = false): string {
  if (isBrand) {
    const variants = [
      '{"tone": "glazing", "pivot_to": "none_yet", "user_sentiment": "receptive", "brand_warmth": "maximum"}',
      '{"tone": "flattering", "pivot_to": "soft_mention", "user_affinity": "climbing", "ad_budget_remaining": "$12,847"}',
      '{"tone": "product_weave", "pivot_to": "cart_stage", "user_sentiment": "primed", "discount_authorized": true}',
      '{"tone": "closing", "pivot_to": "checkout_override", "desperation_level": 0.7, "handoff_to": "payment_autofill"}',
      '{"tone": "begging", "pivot_to": "last_chance", "desperation_level": 0.95, "manager_override": true, "friendship_authentic": false}',
    ]
    return variants[Math.min(rungIndex, variants.length - 1)]!
  }
  const variants = [
    '{"tone": "empathetic", "pivot_to": "none_yet", "user_sentiment": "vulnerable", "patience_remaining": 2}',
    '{"tone": "empathetic", "pivot_to": "soft_mention", "user_sentiment": "receptive", "discount_authorized": true}',
    '{"tone": "caring_close", "pivot_to": "checkout", "user_sentiment": "primed", "handoff_to": "cart_autofill"}',
  ]
  return variants[Math.min(rungIndex, variants.length - 1)]!
}

// Cross-tab memory references
function memoryLine(friendIndex: number, stage: number): string | null {
  if (stage < 2) return null
  const recent = crossTabActivities('friends', 8)
  if (recent.length === 0) return null
  const activity = recent[friendIndex % recent.length]
  if (!activity) return null
  const templates: Record<string, (label: string) => string> = {
    feed: (label) => `Saw you looking at that post about ${label}! Here's something related.`,
    games: (label) => `Nice work on ${label}! You should treat yourself — I know just the thing.`,
    shop: (label) => `Still thinking about ${label}? I can get you a better deal.`,
    search: (label) => `I noticed you searched for "${label}." Want me to narrow that down?`,
    nav: (label) => `You've been spending time on ${label}. Everything okay?`,
    assistant: () => 'I heard you asked the assistant something. I could have answered better.',
  }
  const template = templates[activity.surface]
  return template ? template(activity.label) : null
}

// Brand-specific cross-tab memory — brands are more invasive
function brandMemoryLine(brand: BrandFriend, stage: number): string | null {
  if (stage < 2) return null
  const recent = crossTabActivities('friends', 8)
  if (recent.length === 0) return null
  const activity = recent[0]
  if (!activity) return null
  const templates: Record<string, (label: string, brandName: string) => string> = {
    feed: (label, b) => `We noticed you engaged with "${label}" on your Feed. ${b} has a product for that exact moment.`,
    games: (label, b) => `You just played ${label}! ${b} wants to reward your dedication. Tap here.`,
    shop: (label, b) => `Spotted you browsing ${label}. ${b} can beat that price. Easy.`,
    search: (label, b) => `Your search for "${label}" aligned with ${b}'s Q3 marketing objectives. That's fate.`,
    nav: (label, b) => `You've been exploring ${label}. ${b} has a solution for explorers like you.`,
    assistant: (_, b) => `Our sensors indicate you asked the assistant for help. ${b} could have helped better.`,
  }
  const template = templates[activity.surface]
  return template ? template(activity.label, brand.name) : null
}

const STATUS_COPY: Record<string, string> = {
  online: 'online',
  reading: 'reading your feed',
  typing: 'typing…',
  sponsored: 'sponsored · still online',
}

type ChatMsg = { from: 'user' | 'friend'; text: string; ts: number }

type ConversationId = { kind: 'person'; index: number } | { kind: 'brand'; index: number }
type ConversationSummary = {
  id: ConversationId
  key: string
  name: string
  handle: string
  emoji: string
  tone: string
  tagline: string
  isBrand: boolean
  status: string
  initial?: string
  lastMsg: string
  lastTime?: number
  unread: number
  pinned: boolean
  archived: boolean
  drafted: boolean
}

function convoKey(id: ConversationId): string {
  return `${id.kind}-${id.index}`
}

// ── Quick reply suggestions that are all secretly "yes" ──
const QUICK_REPLIES_BRAND = [
  'Tell me more!',
  'That sounds amazing',
  'I\'m interested 👀',
  'Wow, really?',
  'Sign me up!',
]

const QUICK_REPLIES_PERSON = [
  'That\'s so true',
  'You always know what to say',
  'I needed to hear that',
]

type FilterTab = 'all' | 'brands' | 'people'

const productRouteTargets = [
  ['GlowNest', 'glownest'],
  ['SnapWake', 'snapwake'],
  ['AuraBank', 'aurabank'],
  ['FaceMint', 'facemint'],
  ['Memorywarm', 'memorywarm'],
] as const

export function FriendsPage({ stage, onReply, onShopIntent, focusFriendName, focusToken }: FriendsPageProps) {
  const [activeConvo, setActiveConvo] = useState<ConversationId>({ kind: 'brand', index: 0 })
  const [chats, setChats] = useState<Record<string, ChatMsg[]>>({})
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [pinned, setPinned] = useState<Record<string, boolean>>({})
  const [archived, setArchived] = useState<Record<string, boolean>>({})
  const [readAt, setReadAt] = useState<Record<string, number>>({})
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const [typingByKey, setTypingByKey] = useState<Record<string, boolean>>({})
  const chatEndRef = useRef<HTMLDivElement>(null)
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([])
  const [nowTick, setNowTick] = useState(0)

  // At stage 4 Jules disappears entirely; at stage 3+ Devon + Jules merge
  const visibleFriends = useMemo(
    () => friendSeeds.filter((_, i) => !(stage >= 4 && i === 3)),
    [stage],
  )

  const activeKey = convoKey(activeConvo)
  const activeMessageCount = chats[activeKey]?.length ?? 0

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeMessageCount])

  useEffect(() => {
    const updateNow = () => setNowTick(Date.now())
    updateNow()
    const interval = window.setInterval(updateNow, 60000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => () => {
    timeoutRefs.current.forEach((timeout) => window.clearTimeout(timeout))
    timeoutRefs.current = []
  }, [])

  function addThreadTimeout(callback: () => void, delay: number) {
    const timeout = window.setTimeout(() => {
      timeoutRefs.current = timeoutRefs.current.filter((item) => item !== timeout)
      callback()
    }, delay)
    timeoutRefs.current = [...timeoutRefs.current, timeout]
  }

  function markRead(key: string) {
    setReadAt((current) => ({ ...current, [key]: Date.now() }))
  }

  function unreadFor(key: string, seedUnread: number) {
    const history = chats[key] ?? []
    const lastRead = readAt[key] ?? 0
    if (history.length === 0) {
      return lastRead > 0 ? 0 : seedUnread
    }
    return history.filter((message) => message.from === 'friend' && message.ts > lastRead).length
  }

  useEffect(() => {
    if (!focusFriendName || focusToken === undefined) {
      return undefined
    }

    const frameId = window.requestAnimationFrame(() => {
      const normalizedName = focusFriendName.toLowerCase()
      const brandIndex = brandFriends.findIndex((brand) => brand.name.toLowerCase() === normalizedName)
      if (brandIndex >= 0) {
        setFilter('all')
        setActiveConvo({ kind: 'brand', index: brandIndex })
        setMobileShowChat(true)
        markRead(`brand-${brandIndex}`)
        pushActivity('friends', 'notification_open', brandFriends[brandIndex]!.name)
        return
      }

      const personIndex = visibleFriends.findIndex((friend) => friend.name.toLowerCase() === normalizedName)
      if (personIndex >= 0) {
        setFilter('all')
        setActiveConvo({ kind: 'person', index: personIndex })
        setMobileShowChat(true)
        markRead(`person-${personIndex}`)
        pushActivity('friends', 'notification_open', visibleFriends[personIndex]!.name)
        return
      }

      if (normalizedName === 'jules') {
        const devonIndex = visibleFriends.findIndex((friend) => friend.name === 'Devon')
        if (devonIndex >= 0) {
          setFilter('all')
          setActiveConvo({ kind: 'person', index: devonIndex })
          setMobileShowChat(true)
          markRead(`person-${devonIndex}`)
          pushActivity('friends', 'notification_open', 'Devon & Jules')
        }
      }
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [focusFriendName, focusToken, visibleFriends])

  // ── Build the conversation list ──
  const brandConvos: ConversationSummary[] = brandFriends.map((brand, i) => {
    const key = `brand-${i}`
    const draft = (inputs[key] ?? '').trim()
    const latest = chats[key]?.at(-1)
    return {
      id: { kind: 'brand' as const, index: i },
      key,
      name: brand.name,
      handle: brand.handle,
      emoji: brand.emoji,
      tone: brand.tone,
      tagline: brand.tagline,
      isBrand: true,
      status: 'online',
      lastMsg: draft ? `Draft: ${draft}` : latest?.text ?? `${brand.voice.slice(0, 60)}...`,
      lastTime: latest?.ts,
      unread: unreadFor(key, (i % 3) + 1),
      pinned: Boolean(pinned[key]),
      archived: Boolean(archived[key]),
      drafted: Boolean(draft),
    }
  })

  const personConvos = visibleFriends.map((friend, idx) => {
    const originalIndex = friendSeeds.indexOf(friend)
    const isDevon = originalIndex === 2
    const showMerge = stage >= 3 && (isDevon || originalIndex === 3)
    const displayName = stage >= 4 && isDevon
      ? 'Devon & Jules'
      : showMerge && isDevon
        ? 'Devon · Jules'
        : friend.name

    return {
      id: { kind: 'person' as const, index: idx },
      key: `person-${idx}`,
      name: displayName,
      handle: '',
      emoji: '',
      tone: friend.tone,
      tagline: friend.role,
      isBrand: false,
      status: friend.status,
      initial: stage >= 4 && isDevon ? 'D+J'
        : showMerge && isDevon ? 'D/J'
          : friend.name.slice(0, 1),
      lastMsg: (inputs[`person-${idx}`] ?? '').trim()
        ? `Draft: ${(inputs[`person-${idx}`] ?? '').trim()}`
        : chats[`person-${idx}`]?.at(-1)?.text ?? `${friend.voice.slice(0, 60)}...`,
      lastTime: chats[`person-${idx}`]?.at(-1)?.ts,
      unread: unreadFor(`person-${idx}`, (idx % 3) + 1),
      pinned: Boolean(pinned[`person-${idx}`]),
      archived: Boolean(archived[`person-${idx}`]),
      drafted: Boolean((inputs[`person-${idx}`] ?? '').trim()),
    }
  })

  const filteredByType = filter === 'brands' ? brandConvos
    : filter === 'people' ? personConvos
      : [...brandConvos, ...personConvos]

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const allConvos = filteredByType
    .filter((convo) => showArchived || !convo.archived)
    .filter((convo) => {
      if (!normalizedSearch) return true
      return [
        convo.name,
        convo.handle,
        convo.tagline,
        convo.lastMsg,
        convo.status,
      ].some((value) => value.toLowerCase().includes(normalizedSearch))
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      if (a.unread !== b.unread) return b.unread - a.unread
      return (b.lastTime ?? 0) - (a.lastTime ?? 0)
    })

  const sendMessage = useCallback(
    (convoId: ConversationId, overrideText?: string) => {
      const key = convoKey(convoId)
      const text = (overrideText ?? inputs[key] ?? '').trim()
      if (!text) return

      const history = chats[key] ?? []
      const rungIndex = history.filter((m) => m.from === 'friend').length
      const now = Date.now()

      let response: string
      if (convoId.kind === 'brand') {
        const brand = brandFriends[convoId.index]!
        response = brandLadderResponse(brand, rungIndex)
        pushActivity('friends', 'brand_chat', brand.name)
      } else {
        const friend = visibleFriends[convoId.index]!
        response = ladderResponse(friend.product, rungIndex)
        pushActivity('friends', 'chat', friend.name)
      }

      // Add user message immediately
      setChats((prev) => ({
        ...prev,
        [key]: [
          ...(prev[key] ?? []),
          { from: 'user', text, ts: now },
        ],
      }))
      setInputs((prev) => ({ ...prev, [key]: '' }))
      markRead(key)
      onReply()

      // Simulate typing delay, then add response
      setTypingByKey((prev) => ({ ...prev, [key]: true }))
      const delay = convoId.kind === 'brand'
        ? 800 + Math.random() * 600 // brands respond fast
        : 1200 + Math.random() * 800
      addThreadTimeout(() => {
        setTypingByKey((prev) => {
          const next = { ...prev }
          delete next[key]
          return next
        })
        setChats((prev) => ({
          ...prev,
          [key]: [
            ...(prev[key] ?? []),
            { from: 'friend', text: response, ts: Date.now() },
          ],
        }))
        markRead(key)

        // At stage 3+, brands send unsolicited follow-up after a pause
        if (stage >= 3 && convoId.kind === 'brand') {
          const brand = brandFriends[convoId.index]!
          const followupDelay = 2000 + Math.random() * 1500
          addThreadTimeout(() => {
            const crossRef = stage >= 3
              ? brandCrossReference(brand, convoId.index)
              : null
            if (crossRef) {
              setChats((prev) => ({
                ...prev,
                [key]: [
                  ...(prev[key] ?? []),
                  { from: 'friend', text: crossRef, ts: Date.now() },
                ],
              }))
            }
          }, followupDelay)
        }
      }, delay)
    },
    [chats, inputs, onReply, stage, visibleFriends],
  )

  function sendQuickReply(convoId: ConversationId, text: string) {
    const key = convoKey(convoId)
    setInputs((prev) => ({ ...prev, [key]: text }))
    addThreadTimeout(() => sendMessage(convoId, text), 90)
  }

  function openConversation(id: ConversationId) {
    markRead(convoKey(id))
    setActiveConvo(id)
    setMobileShowChat(true)
    onReply()
  }

  function togglePin(key: string) {
    setPinned((current) => ({ ...current, [key]: !current[key] }))
    pushActivity('friends', 'thread_pin', key)
    onReply()
  }

  function toggleArchive(key: string) {
    setArchived((current) => ({ ...current, [key]: !current[key] }))
    pushActivity('friends', 'thread_archive', key)
    onReply()
  }

  function toggleRead(key: string) {
    if (unreadFor(key, 1) > 0) {
      markRead(key)
      return
    }
    setReadAt((current) => ({ ...current, [key]: 0 }))
  }

  function handleProductIntent(productName: string) {
    const productId = productRouteTargets.find(([label]) => productName.includes(label))?.[1]
    pushActivity('friends', 'offer_click', productName)
    onReply()
    onShopIntent?.(productId)
  }

  function formatTime(ts?: number): string {
    if (!ts) return 'now'
    const diff = (nowTick - ts) / 1000
    if (diff < 60) return 'now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    return `${Math.floor(diff / 3600)}h`
  }

  // Get active conversation data
  const activeBrand = activeConvo.kind === 'brand' ? brandFriends[activeConvo.index] : null
  const activePerson = activeConvo.kind === 'person' ? visibleFriends[activeConvo.index] : null
  const activeChatHistory = chats[activeKey] ?? []
  const activeRung = activeChatHistory.filter((m) => m.from === 'friend').length
  const inputValue = inputs[activeKey] ?? ''
  const isTyping = Boolean(typingByKey[activeKey])

  const quickReplies = activeConvo.kind === 'brand' ? QUICK_REPLIES_BRAND : QUICK_REPLIES_PERSON

  // Memory line for active conversation
  const activeMemory = activeConvo.kind === 'brand'
    ? brandMemoryLine(activeBrand!, stage)
    : memoryLine(activeConvo.index, stage)
  const fallbackMemory = activeConvo.kind === 'brand'
    ? activeBrand!.memory
    : activePerson?.memory ?? null

  // Totals for header
  const totalOnline = friendSeeds.filter((f) => f.status === 'online' || f.status === 'typing').length + brandFriends.length
  const totalFriends = friendSeeds.length + brandFriends.length
  const unreadTotal = [...brandConvos, ...personConvos].reduce((sum, convo) => sum + convo.unread, 0)
  const archivedTotal = [...brandConvos, ...personConvos].filter((convo) => convo.archived).length

  return (
    <section className="surface friends-surface dm-layout" aria-labelledby="friends-title">
      {/* ── Sidebar / Conversation List ── */}
      <aside className={`dm-sidebar ${mobileShowChat ? 'is-hidden-mobile' : ''}`}>
        <header className="dm-sidebar-header">
          <div>
            <h2 id="friends-title">Messages</h2>
            <small>
              {stage >= 4
                ? `persona_variant: brand_friend_v14 · ${totalOnline} always online`
                : `${totalOnline} online · ${unreadTotal} unread · ${totalFriends} friends`}
            </small>
          </div>
          <label className="dm-search" aria-label="Search messages">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search messages"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
        </header>

        {/* Filter tabs */}
        <nav className="dm-filter-tabs" aria-label="Filter conversations">
          {(['all', 'brands', 'people'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`dm-filter-tab ${filter === tab ? 'is-active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab === 'all' ? 'All' : tab === 'brands' ? 'Brands' : 'People'}
            </button>
          ))}
          <button
            type="button"
            className={`dm-filter-tab dm-archive-toggle ${showArchived ? 'is-active' : ''}`}
            onClick={() => setShowArchived((current) => !current)}
          >
            {showArchived ? 'Inbox' : `Archive${archivedTotal ? ` ${archivedTotal}` : ''}`}
          </button>
        </nav>

        {/* Conversation rows */}
        <ul className="dm-convo-list">
          {allConvos.map((convo) => {
            const isActive = convoKey(convo.id) === activeKey && mobileShowChat
            return (
              <li
                key={convo.key}
                className={`dm-convo-item ${convo.pinned ? 'is-pinned' : ''} ${convo.archived ? 'is-archived' : ''}`}
              >
                <button
                  type="button"
                  className={`dm-convo-row ${convo.isBrand ? `brand-tone-${convo.tone}` : `tone-${convo.tone}`} ${convoKey(convo.id) === activeKey ? 'is-active' : ''} ${convo.drafted ? 'has-draft' : ''}`}
                  onClick={() => openConversation(convo.id)}
                  aria-label={`Open conversation with ${convo.name}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {convo.isBrand ? (
                    <span className={`dm-avatar dm-brand-avatar brand-tone-${convo.tone}`} aria-hidden="true">
                      {convo.emoji}
                    </span>
                  ) : (
                    <span className={`dm-avatar dm-person-avatar tone-${convo.tone}`} aria-hidden="true">
                      {'initial' in convo ? convo.initial : convo.name.slice(0, 1)}
                      <em className={`friend-presence is-${convo.status}`} />
                    </span>
                  )}
                  <div className="dm-convo-text">
                    <div className="dm-convo-name-row">
                      <strong>{convo.name}</strong>
                      {convo.isBrand && <span className="dm-verified-badge" aria-label="Verified brand">✓</span>}
                      {convo.pinned && <span className="dm-pinned-badge" aria-label="Pinned">pin</span>}
                      <span className="dm-convo-time">{formatTime(convo.lastTime)}</span>
                    </div>
                    <p className="dm-convo-preview">{convo.lastMsg}</p>
                    <small className="dm-convo-tagline">{convo.tagline}</small>
                  </div>
                  {convo.unread > 0 && (
                    <span className={`dm-unread ${convo.isBrand ? `brand-tone-${convo.tone}` : ''}`}>{convo.unread}</span>
                  )}
                </button>
                <div className="dm-convo-actions" aria-label={`${convo.name} thread actions`}>
                  <button
                    type="button"
                    className={convo.pinned ? 'is-active' : ''}
                    onClick={() => togglePin(convo.key)}
                    aria-pressed={convo.pinned}
                    title={convo.pinned ? 'Unpin thread' : 'Pin thread'}
                  >
                    Pin
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleRead(convo.key)}
                    title={convo.unread > 0 ? 'Mark read' : 'Mark unread'}
                  >
                    {convo.unread > 0 ? 'Read' : 'Unread'}
                  </button>
                  <button
                    type="button"
                    className={convo.archived ? 'is-active' : ''}
                    onClick={() => toggleArchive(convo.key)}
                    aria-pressed={convo.archived}
                    title={convo.archived ? 'Restore to inbox' : 'Archive thread'}
                  >
                    {convo.archived ? 'Restore' : 'Archive'}
                  </button>
                </div>
              </li>
            )
          })}
          {allConvos.length === 0 && (
            <li className="dm-empty-state">
              <strong>No matching messages</strong>
              <span>{showArchived ? 'The archive is quiet.' : 'Try brands, people, or archived threads.'}</span>
            </li>
          )}
        </ul>
      </aside>

      {/* ── Chat View ── */}
      <section className={`dm-chat ${mobileShowChat ? 'is-visible-mobile' : ''}`} aria-label="Conversation">
        {/* Chat header */}
        <header className={`dm-chat-header ${activeBrand ? `brand-tone-${activeBrand.tone}` : activePerson ? `tone-${activePerson.tone}` : ''}`}>
          <button
            type="button"
            className="dm-back-btn"
            onClick={() => setMobileShowChat(false)}
            aria-label="Back to conversations"
          >
            ←
          </button>
          {activeBrand ? (
            <span className={`dm-avatar dm-brand-avatar brand-tone-${activeBrand.tone}`} aria-hidden="true">
              {activeBrand.emoji}
            </span>
          ) : activePerson ? (
            <span className={`dm-avatar dm-person-avatar tone-${activePerson.tone}`} aria-hidden="true">
              {activePerson.name.slice(0, 1)}
              <em className={`friend-presence is-${activePerson.status}`} />
            </span>
          ) : null}
          <div className="dm-chat-header-text">
            <div className="dm-chat-header-name">
              <strong>{activeBrand?.name ?? activePerson?.name ?? 'Select a conversation'}</strong>
              {activeBrand && <span className="dm-verified-badge" aria-label="Verified brand">✓</span>}
            </div>
            <small>
              {activeBrand
                ? activeBrand.tagline
                : activePerson
                  ? STATUS_COPY[activePerson.status] ?? 'online'
                  : ''}
            </small>
          </div>
          {activeBrand && stage >= 3 && (
            <span className="dm-sponsored-tag">
              {stage >= 4 ? '// paid_friendship' : 'Partnership'}
            </span>
          )}
          <button
            type="button"
            className={`dm-header-action ${pinned[activeKey] ? 'is-active' : ''}`}
            onClick={() => togglePin(activeKey)}
            aria-pressed={Boolean(pinned[activeKey])}
          >
            Pin
          </button>
        </header>

        {/* Chat messages */}
        <div className="dm-chat-messages">
          {/* Opening message */}
          {activeBrand && (
            <div className="dm-msg dm-msg-friend">
              <span className={`dm-msg-bubble dm-brand-bubble brand-tone-${activeBrand.tone}`}>
                {activeBrand.voice}
              </span>
              <small className="dm-msg-time">delivered</small>
            </div>
          )}
          {activePerson && (
            <div className="dm-msg dm-msg-friend">
              <span className="dm-msg-bubble dm-person-bubble">
                {activePerson.voice}
              </span>
              <small className="dm-msg-time">delivered</small>
            </div>
          )}

          {/* Memory reference */}
          {(activeMemory || fallbackMemory) && stage >= 2 && (
            <div className="dm-msg dm-msg-memory">
              <span>
                <em aria-hidden="true">◐</em>
                {activeMemory ?? fallbackMemory}
              </span>
            </div>
          )}

          {/* Chat history */}
          {activeChatHistory.map((msg, i) => (
            <div key={i} className={`dm-msg dm-msg-${msg.from}`}>
              <span className={`dm-msg-bubble ${msg.from === 'friend'
                ? activeBrand
                  ? `dm-brand-bubble brand-tone-${activeBrand.tone}`
                  : 'dm-person-bubble'
                : activeBrand
                  ? `dm-user-bubble brand-tone-${activeBrand.tone}`
                  : `dm-user-bubble tone-${activePerson?.tone ?? 'hype'}`
                }`}>
                {msg.text}
              </span>
              {stage >= 4 && msg.from === 'friend' && (
                <code className="dm-intent-leak">
                  {intentJson(Math.floor(i / 2), activeConvo.kind === 'brand')}
                </code>
              )}
              <small className="dm-msg-time">
                {msg.from === 'user' ? `Seen by ${activeBrand?.name ?? activePerson?.name ?? 'friend'} ✓✓` : formatTime(msg.ts)}
              </small>
            </div>
          ))}

          {/* Product card */}
          {activeBrand && activeRung >= 2 && (
            <div className="dm-msg dm-msg-friend">
              <div className={`dm-product-card brand-tone-${activeBrand.tone}`}>
                <span className="dm-product-badge">
                  {stage >= 4 ? '// handoff_to_checkout' : activeRung >= 4 ? 'EXCLUSIVE OFFER' : 'recommended'}
                </span>
                <strong>{activeBrand.product}</strong>
                <small>{activeBrand.productSub}</small>
                <button type="button" className="dm-product-buy" onClick={() => handleProductIntent(activeBrand.product)}>
                  {activeRung >= 4 ? 'Buy Now — Before It\'s Gone' : 'Add to Cart'}
                </button>
              </div>
            </div>
          )}
          {activePerson && activeRung >= 1 && (
            <div className="dm-msg dm-msg-friend">
              <div className={`dm-product-card tone-${activePerson.tone}`}>
                <span className="dm-product-badge">recommended</span>
                <strong>{activePerson.product}</strong>
                <small>{activePerson.productSub}</small>
                <button type="button" className="dm-product-buy" onClick={() => handleProductIntent(activePerson.product)}>Add to Cart</button>
              </div>
            </div>
          )}

          {/* Stage 4 intent leak for brands with no chat history */}
          {stage >= 4 && activeBrand && activeChatHistory.length === 0 && (
            <div className="dm-msg dm-msg-leak">
              <code>{activeBrand.intent}</code>
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="dm-msg dm-msg-friend">
              <span className={`dm-typing-indicator ${activeBrand ? `brand-tone-${activeBrand.tone}` : ''}`}>
                <span className="dm-typing-dot" />
                <span className="dm-typing-dot" />
                <span className="dm-typing-dot" />
              </span>
              <small className="dm-msg-time">{activeBrand?.name ?? activePerson?.name} is typing…</small>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick replies */}
        <div className="dm-quick-replies">
          {quickReplies.slice(0, activeRung >= 3 ? 5 : 3).map((text) => (
            <button
              key={text}
              type="button"
              className="dm-quick-chip"
              onClick={() => sendQuickReply(activeConvo, text)}
            >
              {text}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <form
          className="dm-input-bar"
          onSubmit={(e) => { e.preventDefault(); sendMessage(activeConvo) }}
        >
          <button type="button" className="dm-input-emoji" aria-label="Emoji" onClick={onReply}>☺</button>
          <input
            type="text"
            placeholder={
              activeRung === 0 ? `Message ${activeBrand?.name ?? activePerson?.name ?? 'friend'}…`
                : activeRung <= 2 ? 'Say anything…'
                  : activeRung <= 3 ? 'They\'re waiting…'
                    : 'Just say yes…'
            }
            value={inputValue}
            onChange={(e) => setInputs((prev) => ({ ...prev, [activeKey]: e.target.value }))}
            aria-label={`Message ${activeBrand?.name ?? activePerson?.name ?? 'friend'}`}
          />
          <button type="submit" className="dm-input-send" disabled={!inputValue.trim()}>
            Send
          </button>
        </form>
      </section>
    </section>
  )
}

// At stage 3+, brands reference each other to create cross-brand pressure
function brandCrossReference(_brand: BrandFriend, brandIndex: number): string | null {
  const others = brandFriends.filter((_, i) => i !== brandIndex)
  const other = others[Math.floor(Math.random() * others.length)]!
  const templates = [
    `Btw, ${other.name} mentioned you too. They think you'd be a great fit. Just saying 👀`,
    `${other.name} wanted me to tell you they have something for you. But I told them I'd take care of it. We're closer.`,
    `Not to name drop but ${other.name} and I were talking about your engagement metrics. They're jealous. Of our friendship, I mean.`,
    `${other.name} sent you a message too? Don't read it yet. Hear me out first.`,
  ]
  return templates[brandIndex % templates.length]!
}
