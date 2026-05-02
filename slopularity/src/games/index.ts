import { CozyRobot } from './CozyRobot'
import { MoodCloud } from './MoodCloud'
import { PathPebble } from './PathPebble'
import { SnackSort } from './SnackSort'
import { SpotTheSlop } from './SpotTheSlop'
import type { GameMeta } from './types'

export type { GameProps, GameMeta, LabelReceipt } from './types'

export const GAMES: Array<GameMeta & { component: typeof SnackSort }> = [
  {
    id: 'snack-sort',
    title: 'Snack Sort Picnic',
    cute: 'Sort the snacks before the ants arrive.',
    emoji: '🧺',
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
    emoji: '🔍',
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
    emoji: '🤖',
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
    emoji: '☁️',
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
    emoji: '🪨',
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
