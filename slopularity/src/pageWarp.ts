import { maxDecayStage } from './utils.ts'

export const pageWarpModes = [
  'colorInverted',
  'upsideDown',
  'zeroGravity',
  'melt',
  'mirror',
  'duplicateEcho',
  'fontInfection',
  'jelly',
  'translationFailure',
  'looseScrews',
  'notFoundBleed',
  'autofillHallucination',
] as const

export type PageWarpMode = (typeof pageWarpModes)[number]

export type PageWarp = {
  modes: PageWarpMode[]
}

export const pageWarpModeClassNames: Record<PageWarpMode, string> = {
  colorInverted: 'is-color-inverted',
  upsideDown: 'is-upside-down',
  zeroGravity: 'is-zero-gravity',
  melt: 'is-melt-mode',
  mirror: 'is-mirror-mode',
  duplicateEcho: 'is-duplicate-echo-mode',
  fontInfection: 'is-font-infection-mode',
  jelly: 'is-jelly-mode',
  translationFailure: 'is-translation-failure-mode',
  looseScrews: 'is-loose-screws-mode',
  notFoundBleed: 'is-404-bleed-mode',
  autofillHallucination: 'is-autofill-hallucination-mode',
}

export const pageWarpStartStage = maxDecayStage - 2
const pageWarpEventChanceByStage: Record<number, number> = {
  [maxDecayStage - 2]: 0.2,
  [maxDecayStage - 1]: 0.3,
  [maxDecayStage]: 0.4,
}

function eventChanceForStage(stage: number) {
  return pageWarpEventChanceByStage[Math.min(maxDecayStage, Math.max(pageWarpStartStage, stage))] ?? 0
}

function modeCountForRoll(roll: number) {
  if (roll >= 0.94) {
    return 3
  }

  if (roll >= 0.72) {
    return 2
  }

  return 1
}

function chooseModes(count: number, random: () => number) {
  const candidates = [...pageWarpModes]
  const modes: PageWarpMode[] = []

  while (modes.length < count && candidates.length > 0) {
    const index = Math.min(candidates.length - 1, Math.floor(random() * candidates.length))
    const [mode] = candidates.splice(index, 1)
    if (mode) {
      modes.push(mode)
    }
  }

  return modes
}

export function choosePageWarp(stage: number, random = Math.random): PageWarp | null {
  if (stage < pageWarpStartStage) {
    return null
  }

  if (random() >= eventChanceForStage(stage)) {
    return null
  }

  const modeCount = modeCountForRoll(random())
  const modes = chooseModes(modeCount, random)

  if (modes.length === 0) {
    return null
  }

  return { modes }
}
