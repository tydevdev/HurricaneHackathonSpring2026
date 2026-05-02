import { CozyRobot } from './CozyRobot'
import { MoodCloud } from './MoodCloud'
import { PathPebble } from './PathPebble'
import { SnackSort } from './SnackSort'
import { SpotTheSlop } from './SpotTheSlop'
import type { GameMeta } from './types'

export type { GameProps, GameMeta, LabelReceipt } from './types'

export const GAMES_LOBBY_ART = {
  background: new URL('../assets/games/lobby/arcade-garden-lobby.png', import.meta.url).href,
  icon: new URL('../assets/games/lobby/games-app-icon.png', import.meta.url).href,
  backgroundAlt: 'A cheerful arcade garden with tiny game kiosks inside the everything app.',
}

export const GAMES: Array<GameMeta & { component: typeof SnackSort }> = [
  {
    id: 'snack-sort',
    title: 'Snack Sort Picnic',
    cute: 'Sort the snacks before the ants arrive.',
    playLabel: 'Classification picnic',
    collectLabel: 'Nine snacks, three baskets, one cute batch.',
    emoji: '🧺',
    tone: 'picnic',
    art: {
      cover: new URL('../assets/games/snack-sort/picnic-blanket-hero.png', import.meta.url).href,
      icon: new URL('../assets/games/snack-sort/snack-basket-icon.png', import.meta.url).href,
      accent: new URL('../assets/games/snack-sort/snack-sticker-cluster.png', import.meta.url).href,
      pattern: new URL('../assets/games/snack-sort/picnic-ui-pattern.png', import.meta.url).href,
      heroAlt: 'A colorful picnic blanket covered with neatly arranged snacks and soft game-world details.',
      iconAlt: 'A cute picnic basket filled with snacks.',
      accentAlt: 'A sticker cluster of berries, sandwiches, and treats.',
    },
    receipt: {
      cute: 'reward: sticker pack',
      pipeline: 'vision_label_queue.snack_v41',
      detail: 'image classification · 9 samples per round',
    },
    component: SnackSort,
  },
  {
    id: 'spot-the-slop',
    title: 'Spot the Slop',
    cute: 'Find the thing that does not belong.',
    playLabel: 'Hallucination hunt',
    collectLabel: 'Cozy shelves, one impossible detail.',
    emoji: '🔍',
    tone: 'cottage',
    art: {
      cover: new URL('../assets/games/spot-the-slop/cozy-cottage-shelf-hero.png', import.meta.url).href,
      icon: new URL('../assets/games/spot-the-slop/magnifying-cottage-icon.png', import.meta.url).href,
      accent: new URL('../assets/games/spot-the-slop/anomaly-sticker.png', import.meta.url).href,
      pattern: new URL('../assets/games/spot-the-slop/shelf-object-pattern.png', import.meta.url).href,
      heroAlt: 'A cozy cottage shelf filled with cute objects and one subtly wrong object.',
      iconAlt: 'A magnifying glass over a cottage shelf.',
      accentAlt: 'A cute anomaly sticker with one mismatched object.',
    },
    receipt: {
      cute: 'reward: sticker pack',
      pipeline: 'hallucination_dataset.cottage_v12',
      detail: 'anomaly detection · 3 anomalies per batch',
    },
    component: SpotTheSlop,
  },
  {
    id: 'cozy-robot',
    title: 'Cozy Robot Coach',
    cute: 'Teach the robot which reply sounds nicer.',
    playLabel: 'Reply ranking',
    collectLabel: 'Choose the warmer voice before it chooses yours.',
    emoji: '🤖',
    tone: 'robot',
    art: {
      cover: new URL('../assets/games/cozy-robot/cozy-robot-coach-hero-background.png', import.meta.url).href,
      icon: new URL('../assets/games/cozy-robot/cozy-robot-mascot-icon.png', import.meta.url).href,
      accent: new URL('../assets/games/cozy-robot/cozy-robot-message-bubbles-sticker.png', import.meta.url).href,
      pattern: new URL('../assets/games/cozy-robot/cozy-robot-circuit-stickers-pattern.png', import.meta.url).href,
      heroAlt: 'A friendly robot in a soft assistant training room.',
      iconAlt: 'A friendly robot mascot.',
      accentAlt: 'A pair of message bubble stickers.',
    },
    receipt: {
      cute: 'reward: sticker pack',
      pipeline: 'rlhf_preference_batch.helpful_kind_safe',
      detail: 'pairwise preference · 4 ranks per batch',
    },
    component: CozyRobot,
  },
  {
    id: 'mood-cloud',
    title: 'Mood Cloud Parade',
    cute: 'Pick a feeling for each cloud.',
    playLabel: 'Emotion tagging',
    collectLabel: 'Five soft faces, four feelings, no neutral option.',
    emoji: '☁️',
    tone: 'cloud',
    art: {
      cover: new URL('../assets/games/mood-cloud/mood-cloud-parade-hero-background.png', import.meta.url).href,
      icon: new URL('../assets/games/mood-cloud/mood-cloud-mascot-icon.png', import.meta.url).href,
      accent: new URL('../assets/games/mood-cloud/mood-cloud-sticker-sheet.png', import.meta.url).href,
      pattern: new URL('../assets/games/mood-cloud/mood-cloud-soft-sky-pattern.png', import.meta.url).href,
      heroAlt: 'A pastel sky parade of expressive clouds.',
      iconAlt: 'A smiling cloud mascot.',
      accentAlt: 'A sticker sheet with expressive cloud faces.',
    },
    receipt: {
      cute: 'reward: sticker pack',
      pipeline: 'emotion_annotation.soft_face_v3',
      detail: 'multi-class emotion · 5 samples per parade',
    },
    component: MoodCloud,
  },
  {
    id: 'path-pebble',
    title: 'Path of the Pebble',
    cute: 'Trace the dotted path with the pebble.',
    playLabel: 'Segmentation trace',
    collectLabel: 'Drag the pebble through a path the model can reuse.',
    emoji: '🪨',
    tone: 'pebble',
    art: {
      cover: new URL('../assets/games/path-pebble/meadow-tracing-hero.png', import.meta.url).href,
      icon: new URL('../assets/games/path-pebble/pebble-mascot-icon.png', import.meta.url).href,
      accent: new URL('../assets/games/path-pebble/pond-tracing-hero.png', import.meta.url).href,
      pattern: new URL('../assets/games/path-pebble/pebble-path-pattern.png', import.meta.url).href,
      heroAlt: 'A meadow tracing path for a pebble game.',
      iconAlt: 'A small pebble mascot.',
      accentAlt: 'A pond tracing path scene.',
    },
    receipt: {
      cute: 'reward: sticker pack',
      pipeline: 'segmentation_seed.path_v9',
      detail: 'pointer-trace segmentation · per-pixel',
    },
    component: PathPebble,
  },
]

/** Stage-aware reward text. Stickers devalue into fractional credits. */
export function rewardText(stage: number): string {
  if (stage <= 1) return 'reward: sticker pack'
  if (stage === 2) return 'reward: 0.3 sticker credits'
  if (stage === 3) return 'reward: 0.003 credits toward your next sticker pack (47,000 credits required)'
  return 'reward: 0.00004 credits (sticker pack ETA: 11.7 years at current pace)'
}

/** Stage-aware sticker stat display. */
export function rewardStat(stickers: number, total: number, stage: number): { label: string; value: string } {
  if (stage <= 1) return { label: 'Stickers', value: `${stickers}/${total}` }
  if (stage === 2) return { label: 'Credits', value: `${(stickers * 0.3).toFixed(1)} / 47,000` }
  if (stage === 3) return { label: 'Credits', value: `${(stickers * 0.003).toFixed(3)} / 47,000` }
  return { label: 'Credits', value: `${(stickers * 0.00004).toFixed(5)} / 47,000` }
}

/** Progress note for the stats row. */
export function rewardProgress(stickers: number, stage: number): string | null {
  if (stage <= 1) return null
  const credits = stage === 2 ? stickers * 0.3 : stage === 3 ? stickers * 0.003 : stickers * 0.00004
  const pct = ((credits / 47000) * 100)
  return `Sticker pack: ${pct.toFixed(pct < 0.001 ? 6 : 4)}% complete`
}
