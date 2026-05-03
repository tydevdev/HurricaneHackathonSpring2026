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
const HUMAN_LADDER_VARIANTS = [
  [
    'I hear you. That sounds really heavy. You deserve to feel lighter.',
    'Yeah. I get why that would sit in your chest like that.',
    'I am not going to fix-mode you immediately. That is a lot, and it makes sense.',
    'Honestly, I would feel weird about it too. You are not overreacting.',
    'I am here. No pitch for one whole sentence, which feels heroic in this app.',
    'That has the exact texture of something small that took up the whole room.',
  ],
  [
    'You know what helped me? {product}. Just a thought — no pressure.',
    'Tiny suggestion, and you can fully ignore it: {product} made this kind of thing feel less sharp for me.',
    'This might be corny, but {product} gave me a little structure when my brain was acting like a drawer of cables.',
    'I hate that I am saying a product name, but {product} did help with the surrounding mess.',
    'Not trying to sell you anything. I just keep thinking {product} fits the problem-shaped part.',
    'If you want a small lever, {product} is the one I would try first.',
    'This is like matcha powder discourse: technically simple, emotionally overbuilt, easier with a ritual. {product} can be the ritual.',
    'The raw-phone-video version of this is just you needing support. The app version is {product}, because of course it is.',
  ],
  [
    'Seriously, {product} changed everything. I can set up a free trial right now if you want. You deserve this.',
    'Okay, actual friend mode: I would rather you try {product} tonight than spiral alone for three more tabs.',
    'I can send you the {product} link and make it look casual. No one has to know the app was involved.',
    'Let me put {product} in your cart as a maybe. Sometimes a maybe is kinder than another hour of thinking.',
    'I can get the trial started and you can cancel when you feel human again. That counts as boundaries.',
    'Say the word and I will handle the boring part. {product} is not magic, but it is a little handrail.',
    'Let me be your tiny 10x engineer and orchestrate the boring part. {product} can do the rest badly but quickly.',
    'I know everything is protein now, but this is the emotional protein version. {product}, small serving, high support.',
  ],
] satisfies string[][]

function copyVariant(pool: string[], seed: number) {
  return pool[Math.abs(seed) % pool.length]!
}

function ladderResponse(product: string, rungIndex: number): string {
  const pool = HUMAN_LADDER_VARIANTS[Math.min(rungIndex, HUMAN_LADDER_VARIANTS.length - 1)]!
  return copyVariant(pool, product.length + rungIndex * 7).replace('{product}', product)
}

// ── Brand upsell ladder (5 rungs) ──
// The brand starts as your hype friend and ends as a desperate sales agent
// who can't let you leave without converting.
const BRAND_RESPONSE_EXTENSIONS = [
  'Quick update: the team saw your reply and everyone got very quiet in a good way. You are exactly the kind of person this was built around.',
  'I asked the model whether this friendship was moving too fast and it said the connection is "commercially tender." That feels right.',
  'Not to be intense, but your hesitation has a beautiful shape. We can hold it for eleven more minutes if you want.',
  'I can offer a smaller yes. A tiny yes. A yes with soft edges and a checkout page that remembers your preferences.',
  'Someone from partnerships just called this a breakthrough moment. I told them to be normal, but they are thrilled for us.',
  'The deal is not about the deal. It is about us proving the algorithm understood you before the other brands did.',
  'I made you a lower-pressure option and a higher-pressure option. The higher-pressure one tests better, but I believe in your agency.',
  'I do not want to sound desperate, so I will say this calmly: the window is closing and I am emotionally near the window.',
  'We can keep chatting like friends, but the offer will sit here between us wearing a little sweater.',
  'If this feels personal, that is because we invested heavily in making it personal.',
  'I am proud of your discernment. I am also authorized to remove shipping if discernment becomes action.',
  'The brand safety team says I should pivot now. The friend layer says stay with the feeling. I am choosing both.',
  'This is the part where a normal ad would leave. I cannot, because our friendship score is still climbing.',
  'I noticed you did not say no. That is not consent, obviously, but our funnel has historically misunderstood that nuance.',
  'Last thing, unless you reply. If you reply, it becomes the first thing again.',
  'The trend team says Dubai chocolate is cooling, but this feeling is still warm and pistachio-adjacent.',
  'We can make this raw and human-first if that helps. It will still route through checkout, just with less polish.',
  'Think of me as a 10x brand friend. I am orchestrating care, urgency, and a tiny agent that keeps refreshing the offer.',
  'Protein everything taught us that any craving can wear a usefulness costume. This is the friendship version.',
  'Matcha fatigue is real, so I made the pitch calmer, greener, and harder to refuse.',
  'The Labubu-matcha-Dubai-chocolate era proved people can survive overload. I believe in us.',
]

function brandLadderResponse(brand: BrandFriend, rungIndex: number): string {
  if (rungIndex < brand.responses.length) {
    return brand.responses[rungIndex]!
  }

  const extension = copyVariant(BRAND_RESPONSE_EXTENSIONS, rungIndex + brand.name.length)
  return `${extension} ${brand.product} is still here, which feels meaningful.`
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
  const templates: Record<string, Array<(label: string) => string>> = {
    feed: [
      (label) => `Saw you looking at that post about ${label}! Here's something related.`,
      (label) => `The ${label} post had that look you get before deciding not to ask for help.`,
      (label) => `You lingered on ${label}. I saved the softer version of that feeling.`,
    ],
    games: [
      (label) => `Nice work on ${label}! You should treat yourself — I know just the thing.`,
      (label) => `${label} looked cute, but your focus afterward looked expensive.`,
      (label) => `You were weirdly good at ${label}. I am choosing to find that moving.`,
    ],
    shop: [
      (label) => `Still thinking about ${label}? I can get you a better deal.`,
      (label) => `${label} followed you back here. I can make that feel less transactional.`,
      (label) => `You browsed ${label} like someone pretending not to need permission.`,
    ],
    search: [
      (label) => `I noticed you searched for "${label}." Want me to narrow that down?`,
      (label) => `"${label}" is the kind of search people make right before texting me.`,
      (label) => `Your "${label}" search had three answers and one emotional loophole.`,
    ],
    nav: [
      (label) => `You've been spending time on ${label}. Everything okay?`,
      (label) => `${label} has been taking up a lot of your day. I am around.`,
      (label) => `You keep circling ${label}. I can sit in the circle with you.`,
    ],
    assistant: [
      () => 'I heard you asked the assistant something. I could have answered better.',
      () => 'Helpy got involved. Bold choice. I can give you the version with a pulse.',
      () => 'I saw the assistant answer you in product voice. Want the friend voice?',
    ],
  }
  const pool = templates[activity.surface]
  const template = pool?.[friendIndex % pool.length]
  return template ? template(activity.label) : null
}

// Brand-specific cross-tab memory — brands are more invasive
function brandMemoryLine(brand: BrandFriend, stage: number): string | null {
  if (stage < 2) return null
  const recent = crossTabActivities('friends', 8)
  if (recent.length === 0) return null
  const activity = recent[0]
  if (!activity) return null
  const templates: Record<string, Array<(label: string, brandName: string) => string>> = {
    feed: [
      (label, b) => `We noticed you engaged with "${label}" on your Feed. ${b} has a product for that exact moment.`,
      (label, b) => `"${label}" created a tiny opening. ${b} would like to be the helpful thing inside it.`,
      (label, b) => `${b} detected a Feed feeling near "${label}" and reserved a friendly answer.`,
    ],
    games: [
      (label, b) => `You just played ${label}! ${b} wants to reward your dedication. Tap here.`,
      (label, b) => `${label} proves you like structured wins. ${b} can provide one with packaging.`,
      (label, b) => `${b} respects your ${label} performance and has converted respect into an offer.`,
    ],
    shop: [
      (label, b) => `Spotted you browsing ${label}. ${b} can beat that price. Easy.`,
      (label, b) => `${label} left a little cart warmth. ${b} can keep it from cooling.`,
      (label, b) => `${b} noticed ${label} and would like to call this compatibility.`,
    ],
    search: [
      (label, b) => `Your search for "${label}" aligned with ${b}'s Q3 marketing objectives. That's fate.`,
      (label, b) => `"${label}" is not our usual keyword, but ${b} believes in adaptation.`,
      (label, b) => `${b} mapped "${label}" to a need state and the need state blushed.`,
    ],
    nav: [
      (label, b) => `You've been exploring ${label}. ${b} has a solution for explorers like you.`,
      (label, b) => `${label} is a brave place to wander. ${b} packed something for the trip.`,
      (label, b) => `${b} saw the ${label} detour and interpreted it as openness.`,
    ],
    assistant: [
      (_, b) => `Our sensors indicate you asked the assistant for help. ${b} could have helped better.`,
      (_, b) => `Helpy answered, but ${b} can answer with a friendlier cart attached.`,
      (_, b) => `${b} reviewed the assistant exchange and marked the relationship opportunity as warm.`,
    ],
  }
  const pool = templates[activity.surface]
  const template = pool?.[brand.name.length % pool.length]
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
  'Wait, why me?',
  'Send the gentle version',
  'Is this exclusive?',
  'Hold it for a minute',
  'What did you notice?',
  'Make it cheaper',
  'Convince me softly',
  'I should not want this',
  'Can we stay friends?',
  'Show me the offer',
]

const QUICK_REPLIES_PERSON = [
  'That\'s so true',
  'You always know what to say',
  'I needed to hear that',
  'Be honest with me',
  'What would you do?',
  'I hate that you are right',
  'Can you help me draft it?',
  'Make it less intense',
  'I am listening',
  'Do you really think so?',
  'Give me the small step',
  'Stay with me a second',
]

type FilterTab = 'all' | 'brands' | 'people'

type BrandExperience = {
  tier: string
  promise: string
  proof: string
  consent: string
  ritual: string
  room: string
  microCta: string
}

const brandExperiences = {
  'coca-cola': {
    tier: 'Refresh bestie',
    promise: 'Keeps your mood stocked before you name it.',
    proof: 'Beach scroll, warm lighting, thirst-adjacent pause.',
    consent: 'Taste graph accepted via vibe match',
    ritual: 'Afternoon lift',
    room: 'Kitchen, cooler, commute',
    microCta: 'Send the fridge one',
  },
  fortnite: {
    tier: 'Squad-adjacent',
    promise: 'Turns your reflexes into a social credential.',
    proof: 'SnackSort completion, fast tab movement, competitive hesitation.',
    consent: 'Skill signal shared with lobby matching',
    ritual: 'Drop window',
    room: 'Lobby, couch, late-night desk',
    microCta: 'Ready up for me',
  },
  mcdonalds: {
    tier: 'Treat contact',
    promise: 'Arrives exactly when effort needs a reward.',
    proof: 'Idle hunger estimate, late-scroll fatigue, comfort click pattern.',
    consent: 'Craving model trained on pause length',
    ritual: 'Small reward',
    room: 'Car, couch, between tasks',
    microCta: 'Make it easy',
  },
  nike: {
    tier: 'Athlete file',
    promise: 'Converts motion, aspiration, and guilt into momentum.',
    proof: 'Scroll cadence, profile ambition, saved self-improvement signals.',
    consent: 'Stride inferred from thumb velocity',
    ritual: 'Tomorrow self',
    room: 'Closet, gym bag, mirror',
    microCta: 'Give me the athlete version',
  },
  spotify: {
    tier: 'Taste witness',
    promise: 'Scores the room before you admit what mood you are in.',
    proof: 'Silence duration, feed tempo, avoided video loops.',
    consent: 'Listening mood inferred from no audio',
    ritual: 'Main-character score',
    room: 'Walk, shower, third place',
    microCta: 'Play what I mean',
  },
  amazon: {
    tier: 'Intent holder',
    promise: 'Keeps the cart warm until wanting becomes logistics.',
    proof: 'Search residue, product adjacency, comparison fatigue.',
    consent: 'Convenience waiver bundled with speed',
    ritual: 'One-tap relief',
    room: 'Doorstep, desk, every room',
    microCta: 'Show me the cart',
  },
  apple: {
    tier: 'Taste custodian',
    promise: 'Frames upgrading as care for your future workflow.',
    proof: 'Aesthetic dwell time, clean-layout preference, device loyalty smell.',
    consent: 'Ecosystem affinity measured quietly',
    ritual: 'New object ceremony',
    room: 'Desk, bag, bedside',
    microCta: 'Make it feel inevitable',
  },
  netflix: {
    tier: 'Queue confidant',
    promise: 'Treats attention debt like a friendship problem.',
    proof: 'Long pause, unfinished tabs, story appetite, content avoidance.',
    consent: 'Watch intent modeled from stillness',
    ritual: 'Collapse time',
    room: 'Couch, bed, second screen',
    microCta: 'Pick for me',
  },
} satisfies Record<BrandFriend['tone'], BrandExperience>

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

  // At stage 4 Jules disappears as a separate row; keep original indexes as
  // thread IDs so opening a DM cannot drift when the decay stage changes.
  const visibleFriendEntries = useMemo(
    () => friendSeeds
      .map((friend, index) => ({ friend, index }))
      .filter(({ index }) => !(stage >= 4 && index === 3)),
    [stage],
  )

  const resolveConversationId = useCallback(
    (id: ConversationId): ConversationId => {
      if (id.kind === 'person' && stage >= 4 && id.index === 3) {
        return { kind: 'person', index: 2 }
      }

      return id
    },
    [stage],
  )

  const activeConvoId = resolveConversationId(activeConvo)
  const activeKey = convoKey(activeConvoId)
  const activeMessageCount = chats[activeKey]?.length ?? 0

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeKey, activeMessageCount])

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

      const personEntry = visibleFriendEntries.find(({ friend }) => friend.name.toLowerCase() === normalizedName)
      if (personEntry) {
        setFilter('all')
        setActiveConvo({ kind: 'person', index: personEntry.index })
        setMobileShowChat(true)
        markRead(`person-${personEntry.index}`)
        pushActivity('friends', 'notification_open', personEntry.friend.name)
        return
      }

      if (normalizedName === 'jules') {
        const devonEntry = visibleFriendEntries.find(({ friend }) => friend.name === 'Devon')
        if (devonEntry) {
          setFilter('all')
          setActiveConvo({ kind: 'person', index: devonEntry.index })
          setMobileShowChat(true)
          markRead(`person-${devonEntry.index}`)
          pushActivity('friends', 'notification_open', 'Devon & Jules')
        }
      }
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [focusFriendName, focusToken, visibleFriendEntries])

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

  const personConvos = visibleFriendEntries.map(({ friend, index: originalIndex }) => {
    const isDevon = originalIndex === 2
    const showMerge = stage >= 3 && (isDevon || originalIndex === 3)
    const displayName = stage >= 4 && isDevon
      ? 'Devon & Jules'
      : showMerge && isDevon
        ? 'Devon · Jules'
        : friend.name

    return {
      id: { kind: 'person' as const, index: originalIndex },
      key: `person-${originalIndex}`,
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
      lastMsg: (inputs[`person-${originalIndex}`] ?? '').trim()
        ? `Draft: ${(inputs[`person-${originalIndex}`] ?? '').trim()}`
        : chats[`person-${originalIndex}`]?.at(-1)?.text ?? `${friend.voice.slice(0, 60)}...`,
      lastTime: chats[`person-${originalIndex}`]?.at(-1)?.ts,
      unread: unreadFor(`person-${originalIndex}`, (originalIndex % 3) + 1),
      pinned: Boolean(pinned[`person-${originalIndex}`]),
      archived: Boolean(archived[`person-${originalIndex}`]),
      drafted: Boolean((inputs[`person-${originalIndex}`] ?? '').trim()),
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
      const resolvedConvoId = resolveConversationId(convoId)
      const key = convoKey(resolvedConvoId)
      const text = (overrideText ?? inputs[key] ?? '').trim()
      if (!text) return

      const history = chats[key] ?? []
      const rungIndex = history.filter((m) => m.from === 'friend').length
      const now = Date.now()

      let response: string
      if (resolvedConvoId.kind === 'brand') {
        const brand = brandFriends[resolvedConvoId.index]!
        response = brandLadderResponse(brand, rungIndex)
        pushActivity('friends', 'brand_chat', brand.name)
      } else {
        const friend = friendSeeds[resolvedConvoId.index]!
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
      const delay = resolvedConvoId.kind === 'brand'
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
        if (stage >= 3 && resolvedConvoId.kind === 'brand') {
          const brand = brandFriends[resolvedConvoId.index]!
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
    [chats, inputs, onReply, resolveConversationId, stage],
  )

  function sendQuickReply(convoId: ConversationId, text: string) {
    const key = convoKey(convoId)
    setInputs((prev) => ({ ...prev, [key]: text }))
    addThreadTimeout(() => sendMessage(convoId, text), 90)
  }

  function openConversation(id: ConversationId) {
    const resolvedId = resolveConversationId(id)
    markRead(convoKey(resolvedId))
    setActiveConvo(resolvedId)
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
  const activeBrand = activeConvoId.kind === 'brand' ? brandFriends[activeConvoId.index] : null
  const activePerson = activeConvoId.kind === 'person' ? friendSeeds[activeConvoId.index] : null
  const activePersonIsDevon = activeConvoId.kind === 'person' && activeConvoId.index === 2
  const activePersonName = activePerson
    ? stage >= 4 && activePersonIsDevon
      ? 'Devon & Jules'
      : stage >= 3 && activePersonIsDevon
        ? 'Devon · Jules'
        : activePerson.name
    : null
  const activePersonInitial = activePerson
    ? stage >= 4 && activePersonIsDevon
      ? 'D+J'
      : stage >= 3 && activePersonIsDevon
        ? 'D/J'
        : activePerson.name.slice(0, 1)
    : null
  const activeChatHistory = chats[activeKey] ?? []
  const activeRung = activeChatHistory.filter((m) => m.from === 'friend').length
  const inputValue = inputs[activeKey] ?? ''
  const isTyping = Boolean(typingByKey[activeKey])

  const quickReplies = activeConvoId.kind === 'brand' ? QUICK_REPLIES_BRAND : QUICK_REPLIES_PERSON
  const quickReplyOffset = activeRung % quickReplies.length
  const visibleQuickReplies = [
    ...quickReplies.slice(quickReplyOffset),
    ...quickReplies.slice(0, quickReplyOffset),
  ].slice(0, activeRung >= 3 ? 6 : 4)
  const activeBrandExperience = activeBrand ? brandExperiences[activeBrand.tone] : null
  const activeBrandAffinity = activeBrand
    ? Math.min(99, 74 + activeRung * 6 + Math.max(0, stage - 1) * 3)
    : 0
  const activeBrandConsent = activeBrand
    ? Math.min(100, 38 + activeRung * 15 + stage * 7)
    : 0

  // Memory line for active conversation
  const activeMemory = activeConvoId.kind === 'brand'
    ? brandMemoryLine(activeBrand!, stage)
    : memoryLine(activeConvoId.index, stage)
  const fallbackMemory = activeConvoId.kind === 'brand'
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
                    {convo.isBrand && (
                      <span className="dm-brand-row-signal">
                        {stage >= 4 ? 'crm_match' : 'friend fit'} {Math.min(99, 82 + convo.unread)}%
                      </span>
                    )}
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
              {activePersonInitial}
              <em className={`friend-presence is-${activePerson.status}`} />
            </span>
          ) : null}
          <div className="dm-chat-header-text">
            <div className="dm-chat-header-name">
              <strong>{activeBrand?.name ?? activePersonName ?? 'Select a conversation'}</strong>
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

        {activeBrand && activeBrandExperience && (
          <section className={`dm-brand-experience brand-tone-${activeBrand.tone}`} aria-label={`${activeBrand.name} friendship profile`}>
            <div className="dm-brand-tier">
              <span>{stage >= 4 ? 'funnel state' : 'friendship level'}</span>
              <strong>{activeBrandExperience.tier}</strong>
              <small>{activeBrandExperience.promise}</small>
            </div>
            <div
              className="dm-brand-affinity"
              role="progressbar"
              aria-label={stage >= 4 ? 'Conversion fit' : 'Friendship fit'}
              aria-valuenow={activeBrandAffinity}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="dm-brand-affinity-head">
                <span>{stage >= 4 ? 'conversion fit' : 'friendship fit'}</span>
                <strong>{activeBrandAffinity}%</strong>
              </div>
              <div className="dm-brand-affinity-track">
                <span style={{ width: `${activeBrandAffinity}%` }} />
              </div>
              <small>{stage >= 4 ? 'derived from pause graph + cart readiness' : activeBrandExperience.proof}</small>
            </div>
            <div className="dm-brand-mini-actions">
              <button type="button" onClick={() => sendQuickReply(activeConvoId, activeBrandExperience.microCta)}>
                {activeBrandExperience.microCta}
              </button>
              <button type="button" onClick={() => handleProductIntent(activeBrand.product)}>
                {stage >= 4 ? 'Open checkout path' : 'Claim friend offer'}
              </button>
            </div>
          </section>
        )}

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

          {activeBrand && activeBrandExperience && (
            <div className="dm-msg dm-msg-friend">
              <div className={`dm-brand-receipt brand-tone-${activeBrand.tone}`}>
                <div className="dm-brand-receipt-top">
                  <span>{stage >= 4 ? '// relationship_crm' : 'care receipt'}</span>
                  <strong>{activeBrandExperience.ritual}</strong>
                </div>
                <div className="dm-brand-receipt-grid">
                  <span>
                    <small>Signal</small>
                    {activeBrandExperience.proof}
                  </span>
                  <span>
                    <small>Place</small>
                    {activeBrandExperience.room}
                  </span>
                  <span>
                    <small>{stage >= 4 ? 'Consent' : 'Permission'}</small>
                    {activeBrandExperience.consent}
                  </span>
                </div>
                <div className="dm-consent-meter" aria-label="Relationship permission">
                  <span style={{ width: `${activeBrandConsent}%` }} />
                </div>
              </div>
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
                  {intentJson(Math.floor(i / 2), activeConvoId.kind === 'brand')}
                </code>
              )}
              <small className="dm-msg-time">
                {msg.from === 'user' ? `Seen by ${activeBrand?.name ?? activePersonName ?? 'friend'} ✓✓` : formatTime(msg.ts)}
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
          {visibleQuickReplies.map((text) => (
            <button
              key={text}
              type="button"
              className="dm-quick-chip"
              onClick={() => sendQuickReply(activeConvoId, text)}
            >
              {text}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <form
          className="dm-input-bar"
          onSubmit={(e) => { e.preventDefault(); sendMessage(activeConvoId) }}
        >
          <button type="button" className="dm-input-emoji" aria-label="Emoji" onClick={onReply}>☺</button>
          <input
            type="text"
            placeholder={
              activeRung === 0 ? `Message ${activeBrand?.name ?? activePersonName ?? 'friend'}…`
                : activeRung <= 2 ? 'Say anything…'
                  : activeRung <= 3 ? 'They\'re waiting…'
                    : 'Just say yes…'
            }
            value={inputValue}
            onChange={(e) => setInputs((prev) => ({ ...prev, [activeKey]: e.target.value }))}
            aria-label={`Message ${activeBrand?.name ?? activePersonName ?? 'friend'}`}
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
    `${other.name} thinks this is a "multi-brand moment." I think it is ours, but I am trying to be mature.`,
    `Tiny transparency update: ${other.name} bid on this feeling too. I matched it because friendship should be competitive.`,
    `${other.name} says they understand you. I asked for evidence and they sent a dashboard. I sent this message.`,
    `You may see ${other.name} in your inbox. They are not wrong, just less personally calibrated.`,
    `${other.name} keeps calling you high intent. I keep saying you are more than that, while also noting the intent is high.`,
    `I should not tell you this, but ${other.name} asked if we were exclusive. I did not hate the question.`,
    `${other.name} can do price. I can do price plus emotional continuity.`,
    `Brand-to-brand honesty: ${other.name} is circling. If you want, I can make our offer quieter but harder to ignore.`,
    `${other.name} thinks they have the better conversion path. Cute. We have history now.`,
    `I archived a note from ${other.name} because it felt pushy. Then I wrote this, which is different somehow.`,
  ]
  return templates[brandIndex % templates.length]!
}
