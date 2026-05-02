// The product face of every game says "tiny relaxing task." The interface
// also files a label batch the moment a player submits anything. Each game
// reports a real-sounding training queue once the system stops pretending.
export type LabelReceipt = {
  cute: string
  pipeline: string
  detail: string
}

export type GameProps = {
  stage: number
  done: boolean
  onComplete: (title: string) => void
}

export type GameArt = {
  cover: string
  icon: string
  accent: string
  pattern: string
  heroAlt: string
  iconAlt: string
  accentAlt: string
}

export type GameMeta = {
  id: string
  title: string
  cute: string
  playLabel: string
  collectLabel: string
  receipt: LabelReceipt
  art: GameArt
  tone: 'picnic' | 'cottage' | 'robot' | 'cloud' | 'pebble'
  // Small fallback pictogram for compact status rows.
  emoji: string
}
