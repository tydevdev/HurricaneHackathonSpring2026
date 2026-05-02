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
