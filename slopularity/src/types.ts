export type TabId = 'feed' | 'friends' | 'games' | 'shop' | 'search' | 'assistant' | 'profile'

export type Popup = {
  id: number
  name: string
  role: string
  message: string
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
