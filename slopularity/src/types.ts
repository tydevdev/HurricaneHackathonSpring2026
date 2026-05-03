export type TabId = 'feed' | 'news' | 'friends' | 'games' | 'shop' | 'search' | 'assistant' | 'profile'

export type PopupTone =
  | 'hype'
  | 'wellness'
  | 'finance'
  | 'dating'
  | 'nostalgia'
  | 'lucid'

export type Popup = {
  id: number
  name: string
  role: string
  tone: PopupTone
  message: string
  offer: string
  source: 'manual' | 'idle' | 'dismiss'
  /** Internal label leaked at stage 4+. */
  intent: string
}

export type PopupSeed = {
  name: string
  role: string
  tone: PopupTone
  intent: string
  /** Opener variants picked by reason and interaction count. */
  messages: Record<'manual' | 'idle' | 'dismiss', string | string[]>
  offer: string
}

export type Discovery = {
  id: string
  label: string
}

export type BrandTone =
  | 'coca-cola'
  | 'fortnite'
  | 'mcdonalds'
  | 'nike'
  | 'spotify'
  | 'amazon'
  | 'apple'
  | 'netflix'

export type BrandFriend = {
  name: string
  handle: string
  emoji: string
  tone: BrandTone
  tagline: string
  status: 'online'
  voice: string
  /** Emotional upsell ladder — each deeper than the last. */
  responses: string[]
  product: string
  productSub: string
  memory: string
  intent: string
}

export type FeedPost = {
  id: string
  author: string
  handle: string
  initials: string
  location: string
  title: string
  sponsor: string
  stats: string
  altStats: string
  comments: string
  time: string
  image: string
  imageSrc: string
  storyName: string
  storyTone: string
  baseLikes: number
  sampleComments: string[]
}

export type ScrollStats = {
  activeSeconds: number
  eventCount: number
  distancePx: number
  bestBurstSeconds: number
}
