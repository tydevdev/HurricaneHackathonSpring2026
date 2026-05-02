import { useEffect, useMemo, useRef, useState, type CSSProperties, type ChangeEvent, type FormEvent, type PointerEvent } from 'react'
import { feedPosts } from '../content'
import type { FeedPost } from '../types'

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.2 5.8c-1.6-1.7-4.2-1.8-5.9-.2L12 7.8 9.7 5.6C8 4 5.4 4.1 3.8 5.8c-1.7 1.8-1.6 4.7.2 6.4l8 7.3 8-7.3c1.8-1.7 1.9-4.6.2-6.4Z" />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12a1.7 1.7 0 1 0 0 .1M12 12a1.7 1.7 0 1 0 0 .1M19 12a1.7 1.7 0 1 0 0 .1" />
    </svg>
  )
}

function formatCompact(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}K`
  }

  return String(value)
}

const botCommenters = [
  'Mira_C_dealflow',
  'KaiNovaVerified',
  'WellnessAunt2049',
  'actualperson_77',
  'BrandFriendOS',
  'SoftLaunchSam',
]

const replyProducts = ['GlowNest', 'AuraBank Select', 'SelfOS Beauty', 'MealHalo', 'FormCloud', 'CalmCan']
const scrollConfetti = Array.from({ length: 36 }, (_, index) => index)
const scrollUnlockInterval = 10
const initialFeedCycles = 2
const maxFeedCycles = 5
const renderLimitByScrollMode: Record<ScrollMode, number> = {
  single: 60,
  double: 36,
  triple: 30,
}
const feedScrollSessionKey = 'slopularity:feed-scroll-state'
const localPostStorageKey = 'slopularity:feed-local-posts-v1'
let hasInitializedFeedScrollMode = false
const helpyCaptionLimit = 180
const helpyTouchUps = ['face confidence', 'vacation proof', 'wealth lighting', '$9.99 aura trial']
const helpyPresets = [
  'Make it look like I meant to be here.',
  'Soft launch my better timeline.',
  'Tell them this is effortless but searchable.',
]

type ScrollMode = 'single' | 'double' | 'triple'
type ScrollPrompt = Exclude<ScrollMode, 'single'>
type FeedLane = 'single' | 'left' | 'middle' | 'right'

type FeedReaction = {
  id: 'jealousy' | 'cancel' | 'offended'
  label: string
  icon: 'heart' | 'x' | 'spark'
  baseCountOffset: number
}

type LocalComment = {
  author: string
  text: string
}

type CommentSort = 'trusted' | 'new' | 'sponsored'
type HelpySource = 'reenactment' | 'upload-enhanced' | 'menu'

type SavedLocalPost = {
  id: string
  basePostId: string
  caption: string
  options: string[]
  source: HelpySource
  createdAt: number
}

const emptyReactions = new Set<FeedReaction['id']>()

const feedReactions: FeedReaction[] = [
  { id: 'jealousy', label: 'Jealousy', icon: 'heart', baseCountOffset: 0 },
  { id: 'cancel', label: 'Cancel', icon: 'x', baseCountOffset: 19 },
  { id: 'offended', label: 'This offends me', icon: 'spark', baseCountOffset: 43 },
]

type ConfettiStyle = CSSProperties & {
  '--confetti-hue': string
  '--confetti-x': string
  '--confetti-y': string
  '--confetti-spin': string
  '--confetti-delay': string
}

function getConfettiStyle(piece: number): ConfettiStyle {
  const seed = piece + 1
  const angle = ((seed * 53.13) % 360) * (Math.PI / 180)
  const radiusX = (seed % 7) * 4 + 22
  const radiusY = (seed % 9) * 3 + 18

  return {
    '--confetti-hue': `${(seed * 47) % 360}`,
    '--confetti-x': `${Math.cos(angle) * radiusX}vw`,
    '--confetti-y': `${Math.sin(angle) * radiusY}vh`,
    '--confetti-spin': `${220 + seed * 33}deg`,
    '--confetti-delay': `${(seed % 15) * 32}ms`,
  }
}

function isReloadNavigation(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const navEntries = window.performance.getEntriesByType('navigation')
  const navEntry = navEntries[0] as PerformanceNavigationTiming | undefined
  if (navEntry?.type === 'reload') {
    return true
  }

  // Safari compatibility fallback for older engines still surfacing legacy values.
  return (window.performance as Performance & { navigation?: { type?: number } }).navigation?.type === 1
}

function getSavedScrollMode(): ScrollMode {
  if (typeof window === 'undefined') {
    return 'single'
  }

  try {
    const rawState = window.sessionStorage.getItem(feedScrollSessionKey)
    if (!rawState) {
      return 'single'
    }

    const parsed = JSON.parse(rawState) as { scrollMode?: ScrollMode }
    return parsed.scrollMode === 'double' || parsed.scrollMode === 'triple' ? parsed.scrollMode : 'single'
  } catch {
    return 'single'
  }
}

function initScrollMode(): ScrollMode {
  try {
    if (!hasInitializedFeedScrollMode && isReloadNavigation()) {
      window.sessionStorage.removeItem(feedScrollSessionKey)
      hasInitializedFeedScrollMode = true
      return 'single'
    }

    hasInitializedFeedScrollMode = true
    return getSavedScrollMode()
  } catch {
    hasInitializedFeedScrollMode = true
    return 'single'
  }
}

function ReactionIcon({ icon }: { icon: FeedReaction['icon'] }) {
  if (icon === 'heart') {
    return <HeartIcon />
  }

  if (icon === 'x') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.8 13.9 9l5.3 1.8-5.3 1.9L12 18l-1.9-5.3-5.3-1.9L10.1 9 12 3.8Z" />
    </svg>
  )
}

function reactionCount(post: FeedPost, reaction: FeedReaction, isActive: boolean) {
  const baseline = Math.max(12, Math.round(post.baseLikes / (reaction.baseCountOffset + 73)))
  return baseline + (isActive ? 1 : 0)
}

function makeHelpyPost(basePost: FeedPost, savedPost: SavedLocalPost): FeedPost {
  const { caption, createdAt, id, options, source } = savedPost
  const optionText = options.length > 0 ? ` Helpy applied ${options.join(', ')} and called it care.` : ''
  const cleanCaption = caption.trim()
  const sourceLine = source === 'upload-enhanced'
    ? 'AI enhancement replaced upload with safer reenactment'
    : source === 'menu'
      ? 'generated from feed envy'
      : 'chosen from approved reenactments'

  return {
    ...basePost,
    id,
    author: 'You + Helpy',
    handle: '@you.optimized',
    initials: 'HY',
    location: sourceLine,
    title: `${cleanCaption}${optionText}`,
    sponsor: 'local-only demo post',
    stats: '0 saves',
    altStats: '0 saves / fresh insecurity path',
    comments: 'View all 0 comments',
    time: createdAt > 0 ? 'now' : 'now',
    image: 'helpy',
    storyName: 'You',
    storyTone: 'quiet',
    baseLikes: 0,
    sampleComments: [
      'first draft already feels shareable. Helpy Pro knows where confidence belongs',
      'wow this feels authentic. I used GlowNest Boost and got similar honest lighting in 3 days',
    ],
  }
}

function readSavedLocalPosts(): SavedLocalPost[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawState = window.localStorage.getItem(localPostStorageKey)
    if (!rawState) {
      return []
    }

    const parsed = JSON.parse(rawState) as SavedLocalPost[]
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((post) => (
      typeof post.id === 'string' &&
      typeof post.basePostId === 'string' &&
      typeof post.caption === 'string' &&
      Array.isArray(post.options)
    ))
  } catch {
    return []
  }
}

function canonicalPostFor(post: FeedPost): FeedPost {
  return feedPosts.find((feedPost) => feedPost.id === post.id)
    ?? feedPosts.find((feedPost) => feedPost.imageSrc === post.imageSrc)
    ?? feedPosts[0]
}

function pickEnhancedReenactment(file: File): FeedPost {
  const seed = Array.from(file.name).reduce((total, character) => total + character.charCodeAt(0), file.size)
  return feedPosts[seed % 20] ?? feedPosts[0]
}

type FeedPageProps = {
  stage: number
  onEngage: () => void
}

export function FeedPage({ stage, onEngage }: FeedPageProps) {
  const [postReactions, setPostReactions] = useState<Record<string, Set<FeedReaction['id']>>>({
    'glass-ledger': new Set(['jealousy']),
  })
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null)
  const [expandedPhotoPostId, setExpandedPhotoPostId] = useState<string | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [storyIndex, setStoryIndex] = useState<number | null>(null)
  const [isStoryDragging, setIsStoryDragging] = useState(false)
  const [storyDragX, setStoryDragX] = useState(0)
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [commentSort, setCommentSort] = useState<CommentSort>('trusted')
  const [commentFlags, setCommentFlags] = useState<Record<string, string>>({})
  const [localComments, setLocalComments] = useState<Record<string, LocalComment[]>>({})
  const [localPosts, setLocalPosts] = useState<SavedLocalPost[]>(readSavedLocalPosts)
  const [cycleCount, setCycleCount] = useState(initialFeedCycles)
  const [isHelpyOpen, setIsHelpyOpen] = useState(false)
  const [helpyCaption, setHelpyCaption] = useState('Trying the future self filter before it tries me.')
  const [helpyBaseId, setHelpyBaseId] = useState(feedPosts[0]?.id ?? '')
  const [helpyOptions, setHelpyOptions] = useState<string[]>(['face confidence'])
  const [helpySource, setHelpySource] = useState<HelpySource>('reenactment')
  const [uploadMessage, setUploadMessage] = useState('')
  const wasReloaded = isReloadNavigation()
  const [scrollMode, setScrollMode] = useState<ScrollMode>(initScrollMode)
  const [scrollPrompt, setScrollPrompt] = useState<ScrollPrompt | null>(null)
  const superScrollerUnlocked = useRef(scrollMode !== 'single')
  const tripleScrollerUnlocked = useRef(scrollMode === 'triple')
  const didResetScrollPosition = useRef(false)
  const storyDragStartX = useRef<number | null>(null)
  const storyTapDirection = useRef<1 | -1 | null>(null)
  const storyPointerId = useRef<number | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const renderedLocalPosts = useMemo(() => (
    localPosts.map((post) => {
      const basePost = feedPosts.find((feedPost) => feedPost.id === post.basePostId) ?? feedPosts[0]
      return makeHelpyPost(basePost, post)
    })
  ), [localPosts])
  const allPosts = useMemo(() => [...renderedLocalPosts, ...feedPosts], [renderedLocalPosts])
  const renderLimit = renderLimitByScrollMode[scrollMode]
  const effectiveMaxFeedCycles = Math.min(
    maxFeedCycles,
    Math.max(1, Math.ceil(renderLimit / Math.max(allPosts.length, 1))),
  )
  const renderedCycleCount = Math.min(cycleCount, effectiveMaxFeedCycles)
  const loopedPosts = useMemo(
    () => Array.from({ length: renderedCycleCount }, (_, cycle) => allPosts.map((post) => ({ post, cycle }))).flat(),
    [allPosts, renderedCycleCount],
  )
  const storyPosts = allPosts.slice(0, 14)
  const storyPost = storyIndex === null ? null : storyPosts[storyIndex]
  const storyCarouselPosts = storyIndex === null || storyPosts.length === 0
    ? []
    : ([-1, 0, 1] as const).map((offset) => ({
        offset,
        post: storyPosts[(storyIndex + offset + storyPosts.length) % storyPosts.length],
      }))
  const helpyBasePost = allPosts.find((post) => post.id === helpyBaseId) ?? feedPosts[0]
  const helpyCaptionLength = helpyCaption.trim().length
  const isHelpyReady = helpyCaptionLength > 0
  const reenactmentPosts = feedPosts.slice(0, 20)
  const isDegrading = stage >= 4
  const isMultiScroll = scrollMode !== 'single'
  const visibleLoopedPosts = useMemo(
    () => loopedPosts.slice(0, Math.min(loopedPosts.length, renderLimit)),
    [loopedPosts, renderLimit],
  )
  const hasLoadedAllDemoCycles = renderedCycleCount >= effectiveMaxFeedCycles
  const activeCommentPost = activeCommentPostId === null
    ? null
    : allPosts.find((post) => post.id === activeCommentPostId) ?? null
  const activePhotoPost = expandedPhotoPostId === null ? null : allPosts.find((post) => post.id === expandedPhotoPostId) ?? null

  useEffect(() => {
    if (wasReloaded && !didResetScrollPosition.current) {
      window.scrollTo({ top: 0, left: 0 })
      didResetScrollPosition.current = true
    }

    try {
      window.sessionStorage.setItem(feedScrollSessionKey, JSON.stringify({ scrollMode }))
    } catch {
      // Keep the app functional in constrained browser storage environments.
    }
  }, [scrollMode, wasReloaded])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(localPostStorageKey, JSON.stringify(localPosts))
    } catch {
      // Local-only posting should still work for the session if storage is full.
    }
  }, [localPosts])

  useEffect(() => {
    const loadTarget = loadMoreRef.current
    if (!loadTarget || hasLoadedAllDemoCycles) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return
        }

        setCycleCount((current) => Math.min(effectiveMaxFeedCycles, current + 1))
      },
      { rootMargin: '1200px 0px 1600px', threshold: 0 },
    )

    observer.observe(loadTarget)
    return () => observer.disconnect()
  }, [effectiveMaxFeedCycles, hasLoadedAllDemoCycles])

  useEffect(() => {
    if (scrollPrompt !== null || scrollMode === 'triple') {
      return
    }

    const targetIndex = scrollMode === 'single' ? scrollUnlockInterval - 1 : scrollUnlockInterval * 2 - 1
    const isAlreadyUnlocked = scrollMode === 'single' ? superScrollerUnlocked.current : tripleScrollerUnlocked.current
    if (isAlreadyUnlocked) {
      return
    }

    let frameId = 0

    const checkUnlockTarget = () => {
      frameId = 0
      const unlockTarget = document.querySelector<HTMLElement>(`[data-feed-index="${targetIndex}"]`)
      if (!unlockTarget) {
        return
      }

      const targetRect = unlockTarget.getBoundingClientRect()
      const reachedTarget = targetRect.top <= window.innerHeight * 0.82 && targetRect.bottom >= 0
      if (!reachedTarget) {
        return
      }

      if (scrollMode === 'single') {
        superScrollerUnlocked.current = true
        setScrollPrompt('double')
      } else {
        tripleScrollerUnlocked.current = true
        setScrollPrompt('triple')
      }
      onEngage()
    }

    const scheduleCheck = () => {
      if (frameId !== 0) {
        return
      }

      frameId = window.requestAnimationFrame(checkUnlockTarget)
    }

    scheduleCheck()
    window.addEventListener('scroll', scheduleCheck, { passive: true })
    window.addEventListener('resize', scheduleCheck)
    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener('scroll', scheduleCheck)
      window.removeEventListener('resize', scheduleCheck)
    }
  }, [onEngage, scrollMode, scrollPrompt])

  useEffect(() => {
    if (storyIndex === null || storyPosts.length === 0 || isStoryDragging) {
      return undefined
    }

    const advanceTimer = window.setTimeout(() => {
      setStoryDragX(0)
      setStoryIndex((current) => {
        if (current === null) {
          return null
        }

        return (current + 1) % storyPosts.length
      })
    }, 3000)

    return () => window.clearTimeout(advanceTimer)
  }, [isStoryDragging, storyIndex, storyPosts.length])

  function toggleReaction(postId: string, reactionId: FeedReaction['id']) {
    setPostReactions((current) => {
      const currentReactions = current[postId] ?? new Set<FeedReaction['id']>()
      const nextReactions = new Set(currentReactions)

      if (nextReactions.has(reactionId)) {
        nextReactions.delete(reactionId)
      } else {
        nextReactions.add(reactionId)
      }

      return {
        ...current,
        [postId]: nextReactions,
      }
    })
    onEngage()
  }

  function openCommentSheet(postId: string) {
    setActiveCommentPostId(postId)
    setOpenMenu(null)
    onEngage()
  }

  function closeCommentSheet() {
    setActiveCommentPostId(null)
  }

  function toggleMenu(instanceId: string) {
    setOpenMenu((current) => (current === instanceId ? null : instanceId))
    onEngage()
  }

  function reactFromMenu(postId: string, reactionId: FeedReaction['id']) {
    toggleReaction(postId, reactionId)
    setOpenMenu(null)
  }

  function envisionAsSelf(post: FeedPost) {
    const canonicalPost = canonicalPostFor(post)
    setHelpyBaseId(canonicalPost.id)
    setHelpyCaption(`Me, but with ${post.sponsor.replace(/^.+? by /, '').replace(/^.+? with /, '')} confidence.`)
    setHelpyOptions(['face confidence', 'wealth lighting'])
    setHelpySource('menu')
    setUploadMessage('')
    setOpenMenu(null)
    setIsHelpyOpen(true)
    onEngage()
  }

  function openCommentTrail(postId: string) {
    openCommentSheet(postId)
    setOpenMenu(null)
  }

  function openPhotoViewer(post: FeedPost) {
    setExpandedPhotoPostId(post.id)
    setOpenMenu(null)
    onEngage()
  }

  function closePhotoViewer() {
    setExpandedPhotoPostId(null)
  }

  function submitComment(event: FormEvent<HTMLFormElement>, postId: string) {
    event.preventDefault()
    const value = commentDrafts[postId]?.trim()
    if (!value) {
      return
    }

    const product = replyProducts[Math.abs(value.length + postId.length) % replyProducts.length]
    const sanitizedValue = value.length > 56 ? `${value.slice(0, 53)}...` : value
    const botReply = `I hear "${sanitizedValue}" and honestly the ${product} starter bundle fixed this exact feeling for me`

    setLocalComments((current) => ({
      ...current,
      [postId]: [
        ...(current[postId] ?? []),
        { author: 'you', text: value },
        { author: 'BrandFriendOS', text: botReply },
      ],
    }))
    setCommentDrafts((current) => ({ ...current, [postId]: '' }))
    onEngage()
  }

  function commentKey(postId: string, comment: LocalComment, index: number) {
    return `${postId}-${index}-${comment.author}-${comment.text.slice(0, 18)}`
  }

  function commentsForPost(post: FeedPost): LocalComment[] {
    return [
      ...post.sampleComments.map((comment, commentIndex) => ({
        author: botCommenters[commentIndex % botCommenters.length],
        text: comment,
      })),
      ...(localComments[post.id] ?? []),
    ]
  }

  function sortComments(comments: LocalComment[]) {
    if (commentSort === 'new') {
      return [...comments].reverse()
    }

    if (commentSort === 'sponsored') {
      return [...comments].sort((first, second) => Number(first.author === 'you') - Number(second.author === 'you'))
    }

    return [...comments].sort((first, second) => {
      const firstScore = first.author === 'you' ? 2 : first.author.includes('Verified') ? -1 : 0
      const secondScore = second.author === 'you' ? 2 : second.author.includes('Verified') ? -1 : 0
      return firstScore - secondScore
    })
  }

  function setQuickReply(postId: string, reply: string) {
    setCommentDrafts((current) => ({ ...current, [postId]: reply }))
    onEngage()
  }

  function flagComment(key: string, label: string) {
    setCommentFlags((current) => ({ ...current, [key]: current[key] === label ? '' : label }))
    onEngage()
  }

  function toggleHelpyOption(option: string) {
    setHelpyOptions((current) => (
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option]
    ))
  }

  function openHelpyComposer() {
    setOpenMenu(null)
    setActiveCommentPostId(null)
    setHelpySource('reenactment')
    setUploadMessage('')
    setIsHelpyOpen(true)
    onEngage()
  }

  function applyHelpyPreset(preset: string) {
    setHelpyCaption(preset)
    onEngage()
  }

  function chooseReenactment(postId: string) {
    setHelpyBaseId(postId)
    setHelpySource('reenactment')
    setUploadMessage('')
    onEngage()
  }

  function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const replacementPost = pickEnhancedReenactment(file)
    setHelpyBaseId(replacementPost.id)
    setHelpySource('upload-enhanced')
    setUploadMessage(`AI enhancement complete: ${file.name} became ${replacementPost.storyName}'s reenactment.`)
    onEngage()
    event.target.value = ''
  }

  function publishHelpyPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanCaption = helpyCaption.trim()
    if (!cleanCaption) {
      return
    }

    const savedPost: SavedLocalPost = {
      id: `helpy-${Date.now()}`,
      basePostId: (feedPosts.find((post) => post.id === helpyBaseId) ?? feedPosts[0]).id,
      caption: cleanCaption,
      options: helpyOptions,
      source: helpySource,
      createdAt: Date.now(),
    }
    setLocalPosts((current) => [savedPost, ...current])
    setIsHelpyOpen(false)
    setHelpyCaption('Trying the future self filter before it tries me.')
    setHelpyOptions(['face confidence'])
    setHelpySource('reenactment')
    setUploadMessage('')
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0)
    onEngage()
  }

  function nextStory(direction: 1 | -1) {
    setIsStoryDragging(false)
    setStoryDragX(0)
    setStoryIndex((current) => {
      if (current === null) {
        return null
      }
      return (current + direction + storyPosts.length) % storyPosts.length
    })
    onEngage()
  }

  function closeStoryViewer() {
    cancelStoryDrag()
    setStoryIndex(null)
  }

  function beginStoryDrag(event: PointerEvent<HTMLDivElement>) {
    const frameRect = event.currentTarget.getBoundingClientRect()
    const relativeX = event.clientX - frameRect.left

    storyDragStartX.current = event.clientX
    storyTapDirection.current = relativeX < frameRect.width / 3 ? -1 : relativeX > (frameRect.width * 2) / 3 ? 1 : null
    storyPointerId.current = event.pointerId
    setIsStoryDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveStoryDrag(event: PointerEvent<HTMLDivElement>) {
    if (storyDragStartX.current === null || storyPointerId.current !== event.pointerId) {
      return
    }

    const nextDragX = event.clientX - storyDragStartX.current
    const maxDrag = event.currentTarget.getBoundingClientRect().width * 0.92
    setStoryDragX(Math.max(-maxDrag, Math.min(maxDrag, nextDragX)))
  }

  function finishStoryDrag(event: PointerEvent<HTMLDivElement>) {
    if (storyDragStartX.current === null || storyPointerId.current !== event.pointerId) {
      return
    }

    const finalDragX = event.clientX - storyDragStartX.current
    const frameWidth = event.currentTarget.getBoundingClientRect().width
    const tapDirection = storyTapDirection.current
    const didDrag = Math.abs(finalDragX) > 8
    storyDragStartX.current = null
    storyTapDirection.current = null
    storyPointerId.current = null
    setIsStoryDragging(false)
    setStoryDragX(0)

    if (finalDragX <= -frameWidth * 0.18) {
      nextStory(1)
    } else if (finalDragX >= frameWidth * 0.18) {
      nextStory(-1)
    } else if (!didDrag && tapDirection !== null) {
      nextStory(tapDirection)
    }
  }

  function cancelStoryDrag() {
    storyDragStartX.current = null
    storyTapDirection.current = null
    storyPointerId.current = null
    setIsStoryDragging(false)
    setStoryDragX(0)
  }

  function unlockScrollMode() {
    if (scrollPrompt === null) {
      return
    }

    setScrollMode(scrollPrompt)
    setScrollPrompt(null)
    setOpenMenu(null)
    onEngage()
  }

  function renderPost(post: FeedPost, cycle: number, feedIndex: number, lane: FeedLane) {
    const reactionsForPost = postReactions[post.id] ?? emptyReactions
    const localCommentsForPost = localComments[post.id] ?? []
    const likes = post.baseLikes + reactionsForPost.size
    const postTitle = isDegrading ? `${post.title} // caption regenerated from caption` : post.title
    const instanceId = `${lane}-${post.id}-${cycle}`
    const occurrence = cycle === 0 ? '' : ` loop ${cycle + 1}`
    const visibleCommentCount = post.sampleComments.length + localCommentsForPost.length
    const commentPreview = post.sampleComments.slice(0, 2)

    return (
      <article
        className={`ig-post ${post.image}`}
        data-feed-index={lane === 'single' || lane === 'left' ? feedIndex : undefined}
        key={`${lane}-${post.id}-${cycle}`}
      >
        <header className="ig-post-head">
          <button className="ig-author" type="button" onClick={() => setStoryIndex(Math.max(0, storyPosts.findIndex((story) => story.id === post.id)))}>
            <span className="ig-avatar" aria-hidden="true">{post.initials}</span>
            <span>
              <strong>{post.author}</strong>
              <small>{post.location}</small>
            </span>
          </button>
          <div className="ig-post-menu">
            <button
              className="icon-button"
              type="button"
              aria-haspopup="menu"
              aria-expanded={openMenu === instanceId}
              aria-label={`More options for ${post.author}${occurrence}`}
              onClick={() => toggleMenu(instanceId)}
            >
              <MoreIcon />
            </button>

            {openMenu === instanceId && (
              <div className="post-action-menu" role="menu" aria-label={`${post.author} options`}>
                <button type="button" role="menuitem" onClick={() => reactFromMenu(post.id, 'cancel')}>
                  <strong>cancel</strong>
                  <span>Mark the post as socially unsafe.</span>
                </button>
                <button type="button" role="menuitem" onClick={() => envisionAsSelf(post)}>
                  <strong>envision as yourself with AI</strong>
                  <span>Open Helpy with this life preloaded.</span>
                </button>
                <button type="button" role="menuitem" onClick={() => openCommentTrail(post.id)}>
                  <strong>open comments</strong>
                  <span>Read the sponsored feelings trail.</span>
                </button>
                <button type="button" role="menuitem" onClick={() => setOpenMenu(null)}>
                  <strong>not today</strong>
                  <span>Log gentle refusal signal.</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <button className="ig-photo" type="button" onClick={() => openPhotoViewer(post)} aria-label={`${post.author} post image${occurrence}`}>
          {post.imageSrc ? <img src={post.imageSrc} alt="" loading="lazy" decoding="async" /> : <span className="photo-subject" aria-hidden="true" />}
        </button>

        <div className="ig-post-body">
          <div className="ig-action-row" aria-label={`${post.author} post actions${occurrence}`}>
            {feedReactions.map((reaction) => {
              const isActive = reactionsForPost.has(reaction.id)
              return (
                <button
                  className={`feed-action-chip ${reaction.id} ${isActive ? 'is-active' : ''}`}
                  type="button"
                  aria-pressed={isActive}
                  key={reaction.id}
                  onClick={() => toggleReaction(post.id, reaction.id)}
                >
                  <ReactionIcon icon={reaction.icon} />
                  <span>{reaction.label}</span>
                  <small>{formatCompact(reactionCount(post, reaction, isActive))}</small>
                </button>
              )
            })}
          </div>

          <p className="ig-likes">{formatCompact(likes)} signals</p>
          <p className="ig-caption">
            <strong>{post.handle}</strong>{' '}
            {postTitle}
          </p>
          <p className="ig-time">{post.time} ago {post.sponsor}</p>

          <section className="comment-drawer" aria-label={`Comments for ${post.author}${occurrence}`}>
            <button className="ig-comments" type="button" onClick={() => openCommentSheet(post.id)}>
              {post.comments}
            </button>
            <div className="comment-list">
              {commentPreview.map((comment, commentIndex) => (
                <p key={`${post.id}-comment-${commentIndex}`}>
                  <strong>{botCommenters[commentIndex % botCommenters.length]}</strong> {comment}
                </p>
              ))}
            </div>
            {visibleCommentCount > commentPreview.length && (
              <button className="comment-expand" type="button" onClick={() => openCommentSheet(post.id)}>
                Open thread · {formatCompact(visibleCommentCount)} surfaced
              </button>
            )}
          </section>
        </div>
      </article>
    )
  }

  function renderCommentSheet(post: FeedPost) {
    const comments = sortComments(commentsForPost(post))
    const reactionsForPost = postReactions[post.id] ?? emptyReactions
    const hasUserCommented = comments.some((comment) => comment.author === 'you')
    const draftValue = commentDrafts[post.id]?.trim() ?? ''
    const draftProduct = replyProducts[Math.abs(draftValue.length + post.id.length) % replyProducts.length]

    return (
      <div
        className="modal-backdrop comment-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label={`Comments for ${post.author}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeCommentSheet()
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            closeCommentSheet()
          }
        }}
      >
        <section className="comment-sheet">
          <header className="comment-sheet-head">
            <div>
              <p>Comments</p>
              <h3 id="comment-sheet-title">{post.author}</h3>
            </div>
            <button type="button" onClick={closeCommentSheet} aria-label="Close comments">Close</button>
          </header>

          <div className="comment-post-context">
            <span className="comment-post-thumb" aria-hidden="true">
              {post.imageSrc ? <img src={post.imageSrc} alt="" /> : post.initials}
            </span>
            <div>
              <strong>{post.handle}</strong>
              <p>{post.title}</p>
              <small>{formatCompact(post.baseLikes + reactionsForPost.size)} signals · {post.sponsor}</small>
            </div>
          </div>

          <div className="comment-sort-row" aria-label="Comment order">
            {[
              ['trusted', 'Trusted'],
              ['new', 'Newest'],
              ['sponsored', 'Sponsored'],
            ].map(([id, label]) => (
              <button
                className={commentSort === id ? 'is-active' : ''}
                type="button"
                aria-pressed={commentSort === id}
                key={id}
                onClick={() => setCommentSort(id as CommentSort)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="comment-insight-strip" aria-live="polite">
            <span>Thread confidence {hasUserCommented ? 'recalibrated' : 'commercially warm'}</span>
            <strong>{hasUserCommented ? '1 feeling converted' : `${comments.length} purchase-adjacent replies`}</strong>
          </div>

          <div className="comment-thread">
            {comments.map((comment, commentIndex) => {
              const key = commentKey(post.id, comment, commentIndex)
              const flag = commentFlags[key]
              const isUser = comment.author === 'you'
              const isVerified = comment.author.includes('Verified') || comment.author.includes('Brand')

              return (
                <article className={`comment-item ${isUser ? 'is-user' : ''}`} key={key}>
                  <span className="comment-avatar" aria-hidden="true">{comment.author.slice(0, 2).toUpperCase()}</span>
                  <div className="comment-bubble">
                    <header>
                      <strong>{comment.author}</strong>
                      <small>{isUser ? 'just now' : isVerified ? 'verified by fit' : `${commentIndex + 2}m`}</small>
                    </header>
                    <p>{comment.text}</p>
                    <div className="comment-actions" aria-label={`Actions for ${comment.author} comment`}>
                      {['Helpful', 'Human?', 'Ad?'].map((label) => (
                        <button
                          className={flag === label ? 'is-active' : ''}
                          type="button"
                          aria-pressed={flag === label}
                          key={label}
                          onClick={() => flagComment(key, label)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="quick-replies" aria-label="Quick replies">
            {['looks real enough', 'where is this from?', 'please stop optimizing me'].map((reply) => (
              <button type="button" key={reply} onClick={() => setQuickReply(post.id, reply)}>
                {reply}
              </button>
            ))}
          </div>

          <div className="comment-composer-wrap">
            {draftValue && (
              <p className="comment-draft-signal">
                Brand-safe match armed: <strong>{draftProduct}</strong>
              </p>
            )}
            <form className="comment-composer" onSubmit={(event) => submitComment(event, post.id)}>
              <input
                aria-label={`Add comment for ${post.author}`}
                placeholder="Add a comment..."
                value={commentDrafts[post.id] ?? ''}
                onChange={(event) => setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))}
              />
              <button type="submit">Post</button>
            </form>
          </div>
        </section>
      </div>
    )
  }

  return (
    <section
      className={`ig-feed-shell ${isMultiScroll ? 'has-multi-scroll' : ''} ${scrollMode === 'triple' ? 'has-triple-scroll' : ''}`}
      aria-label="Feed"
    >
      <header className="ig-feed-topbar">
        <div>
          <p>Slopularity</p>
          <h2 id="feed-title">Feed</h2>
        </div>
        <div className="ig-top-actions" aria-label="Feed actions">
          <button className="make-post-button" type="button" onClick={openHelpyComposer}>
            <span aria-hidden="true">+</span>
            Make post
          </button>
          <button type="button" aria-label="Messages">inbox</button>
        </div>
      </header>

      <div className="story-strip" aria-label="Stories">
        {storyPosts.map((post, index) => (
          <button className="story-chip" type="button" key={post.id} onClick={() => setStoryIndex(index)}>
            <span className={`story-avatar ${post.storyTone}`} aria-hidden="true">
              {post.imageSrc ? <img src={post.imageSrc} alt="" loading="lazy" decoding="async" /> : post.initials}
            </span>
            <span>{post.storyName}</span>
          </button>
        ))}
      </div>

      <div className={`ig-feed-list ${isMultiScroll ? 'is-multi-scroll' : ''} ${scrollMode === 'triple' ? 'is-triple-scroll' : ''}`} aria-label={scrollMode === 'triple' ? 'Triple Scroll post feed' : scrollMode === 'double' ? 'Double Scroll post feed' : 'Looping post feed'}>
        {isMultiScroll ? (
          <>
            <div className="double-scroll-lane" aria-label="Primary scroll">
              {visibleLoopedPosts.map(({ post, cycle }, feedIndex) => renderPost(post, cycle, feedIndex, 'left'))}
            </div>
            <div className="double-scroll-lane" aria-label="Bonus scroll">
              {visibleLoopedPosts.map(({ post, cycle }, feedIndex) => {
                const shiftedPost = visibleLoopedPosts[(feedIndex + 5) % visibleLoopedPosts.length]?.post ?? post
                return renderPost(shiftedPost, cycle, feedIndex, 'right')
              })}
            </div>
            {scrollMode === 'triple' && (
              <div className="double-scroll-lane" aria-label="Extra bonus scroll">
                {visibleLoopedPosts.map(({ post, cycle }, feedIndex) => {
                  const shiftedPost = visibleLoopedPosts[(feedIndex + 11) % visibleLoopedPosts.length]?.post ?? post
                  return renderPost(shiftedPost, cycle, feedIndex, 'middle')
                })}
              </div>
            )}
          </>
        ) : (
          visibleLoopedPosts.map(({ post, cycle }, feedIndex) => renderPost(post, cycle, feedIndex, 'single'))
        )}
      </div>

      <div className="feed-load-sentinel" ref={loadMoreRef} aria-hidden="true" />
      <p className="loop-note" aria-live="polite">
        Looping demo feed: {renderedCycleCount} cycles loaded from {feedPosts.length} canonical posts · {visibleLoopedPosts.length} live cards per lane{hasLoadedAllDemoCycles ? ' · feed cache warm' : ''}.
      </p>

      {activeCommentPost && renderCommentSheet(activeCommentPost)}

      {activePhotoPost && (
        <div
          className="modal-backdrop photo-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${activePhotoPost.author} photo`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closePhotoViewer()
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              closePhotoViewer()
            }
          }}
        >
          <div className="photo-lightbox" onClick={(event) => event.stopPropagation()}>
            <button className="photo-lightbox-close" type="button" onClick={closePhotoViewer} aria-label="Close photo">
              ×
            </button>
            <div className="photo-lightbox-media">
              {activePhotoPost.imageSrc ? (
                <img src={activePhotoPost.imageSrc} alt={activePhotoPost.title} />
              ) : (
                <span className="photo-lightbox-placeholder" aria-hidden="true">
                  {activePhotoPost.initials}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {storyPost && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${storyPost.author} story`}
          tabIndex={-1}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              closeStoryViewer()
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              nextStory(-1)
            } else if (event.key === 'ArrowRight') {
              nextStory(1)
            } else if (event.key === 'Escape') {
              closeStoryViewer()
            }
          }}
        >
          <div className={`story-viewer ${isStoryDragging ? 'is-dragging' : ''}`}>
            <div className="story-progress" role="progressbar" aria-label="Story auto-advance" aria-valuemin={0} aria-valuemax={100}>
              <span key={storyPost.id} />
            </div>
            <header>
              <span className={`ig-avatar ${storyPost.storyTone}`}>{storyPost.initials}</span>
              <strong>{storyPost.author}</strong>
              <button type="button" onClick={closeStoryViewer}>Close</button>
            </header>
            <div
              className="story-frame"
              onPointerDown={beginStoryDrag}
              onPointerMove={moveStoryDrag}
              onPointerUp={finishStoryDrag}
              onPointerCancel={cancelStoryDrag}
            >
              <div
                className="story-frame-track"
                style={{ transform: `translate3d(calc(-33.333333% + ${storyDragX}px), 0, 0)` }}
              >
                {storyCarouselPosts.map(({ offset, post }) => (
                  <div className="story-frame-slide" aria-hidden={offset !== 0} key={`${post.id}-${offset}`}>
                    {post.imageSrc ? (
                      <img src={post.imageSrc} alt="" draggable={false} loading="eager" decoding="async" />
                    ) : (
                      <span className={`story-frame-placeholder ${post.storyTone}`} aria-hidden="true">
                        {post.initials}
                      </span>
                    )}
                    <p>{post.title}</p>
                  </div>
                ))}
              </div>
              <span className="story-tap-zone story-tap-zone-previous" aria-hidden="true" />
              <span className="story-tap-zone story-tap-zone-next" aria-hidden="true" />
            </div>
          </div>
        </div>
      )}

      {scrollPrompt && (
        <div className="modal-backdrop double-scroll-backdrop" role="dialog" aria-modal="true" aria-labelledby="scroll-unlock-title">
          <div className="confetti-field" aria-hidden="true">
            {scrollConfetti.map((piece) => <span key={piece} style={getConfettiStyle(piece)} />)}
          </div>
          <div className="double-scroll-modal">
            <p className="double-scroll-kicker">Congratulations, Super Scroller</p>
            <h3 id="scroll-unlock-title">You have unlocked the {scrollPrompt.toUpperCase()} SCROLL feature trial *</h3>
            <button type="button" onClick={unlockScrollMode}>Hooray! I love {scrollPrompt} scroll</button>
            <small>*trial stacks automatically. double is $49.99/week. triple is billed as enthusiasm.</small>
          </div>
        </div>
      )}

      {isHelpyOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="helpy-title">
          <form className="helpy-modal" onSubmit={publishHelpyPost}>
            <header>
              <div>
                <p>Make a post</p>
                <h3 id="helpy-title">Helpy found a version of you that tests well.</h3>
              </div>
              <button type="button" onClick={() => setIsHelpyOpen(false)}>Close</button>
            </header>

            <div className={`helpy-preview ig-post ${helpyBasePost.image}`} aria-label="Post preview">
              <div className="helpy-preview-image">
                {helpyBasePost.imageSrc ? <img src={helpyBasePost.imageSrc} alt="" /> : <span className="photo-subject" aria-hidden="true" />}
              </div>
              <div className="helpy-preview-copy">
                <span className="ig-avatar" aria-hidden="true">HY</span>
                <p>
                  <strong>@you.optimized</strong>{' '}
                  {helpyCaption.trim() || 'Draft something before the feed writes you back.'}
                </p>
                <small>
                  {helpySource === 'upload-enhanced'
                    ? 'Your upload was improved into this reenactment.'
                    : 'Local-only demo post. It survives refresh for you.'}
                </small>
              </div>
            </div>

            <div className="helpy-source-panel">
              <label className={`helpy-upload ${helpySource === 'upload-enhanced' ? 'is-active' : ''}`}>
                <span>Upload a photo</span>
                <small>AI enhancement auto-applies before posting.</small>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} />
              </label>
              {uploadMessage && <p className="helpy-upload-result">{uploadMessage}</p>}

              <div className="helpy-reenactments">
                <div>
                  <span>Choose from an assortment of reenactments</span>
                  <small>20 approved memories, conveniently yours.</small>
                </div>
                <div className="reenactment-grid">
                  {reenactmentPosts.map((post) => (
                    <button
                      className={helpyBasePost.id === post.id ? 'is-active' : ''}
                      type="button"
                      key={post.id}
                      onClick={() => chooseReenactment(post.id)}
                      aria-label={`Use ${post.storyName} reenactment`}
                    >
                      {post.imageSrc ? <img src={post.imageSrc} alt="" /> : <span>{post.initials}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="helpy-field">
              <span>
                Caption
                <small>{helpyCaptionLength}/{helpyCaptionLimit}</small>
              </span>
              <textarea
                maxLength={helpyCaptionLimit}
                value={helpyCaption}
                onChange={(event) => setHelpyCaption(event.target.value)}
                rows={3}
              />
            </label>

            <div className="helpy-presets" aria-label="Caption starters">
              {helpyPresets.map((preset) => (
                <button type="button" key={preset} onClick={() => applyHelpyPreset(preset)}>
                  {preset}
                </button>
              ))}
            </div>

            <fieldset className="helpy-options">
              <legend>AI touch-ups</legend>
              {helpyTouchUps.map((option) => (
                <label key={option}>
                  <input
                    type="checkbox"
                    checked={helpyOptions.includes(option)}
                    onChange={() => toggleHelpyOption(option)}
                  />
                  {option}
                </label>
              ))}
            </fieldset>

            <div className="helpy-upsell">
              <strong>Helpy Pro</strong>
              <span>Subscribe for $9.99 to remove pores, hesitation, and visible budget constraints.</span>
            </div>

            <button className="helpy-submit" type="submit" disabled={!isHelpyReady}>Publish draft</button>
          </form>
        </div>
      )}
    </section>
  )
}
