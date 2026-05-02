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
