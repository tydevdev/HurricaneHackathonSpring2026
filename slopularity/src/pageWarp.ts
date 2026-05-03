import { maxDecayStage } from './utils.ts'

export type PageWarp = {
  inverted: boolean
  upsideDown: boolean
  zeroGravity: boolean
}

const warpChance = 0.3
const zeroGravityChance = 0.2
const lateWarpStage = maxDecayStage - 1

function chanceMultiplierForStage(stage: number) {
  if (stage >= maxDecayStage) {
    return 1
  }

  if (stage >= lateWarpStage) {
    return 0.5
  }

  return 0
}

export function choosePageWarp(stage: number, random = Math.random): PageWarp | null {
  const chanceMultiplier = chanceMultiplierForStage(stage)

  if (chanceMultiplier === 0) {
    return null
  }

  const inverted = random() < warpChance * chanceMultiplier
  const upsideDown = random() < warpChance * chanceMultiplier
  const zeroGravity = random() < zeroGravityChance * chanceMultiplier

  if (!inverted && !upsideDown && !zeroGravity) {
    return null
  }

  return { inverted, upsideDown, zeroGravity }
}
