export type TabId = 'feed' | 'friends' | 'games' | 'shop' | 'search' | 'assistant' | 'profile'

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
  /** Internal label leaked at stage 4+. */
  intent: string
}

export type PopupSeed = {
  name: string
  role: string
  tone: PopupTone
  intent: string
  /** A pool of opener variants — picked by reason. */
  messages: { manual: string; idle: string; dismiss: string }
  offer: string
}

export type Discovery = {
  id: string
  label: string
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
