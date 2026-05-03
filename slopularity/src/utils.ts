export const maxDecayStage = 5
// Score per stage. Tuned so a natural 5–10 minute demo passes through every
// phase: ~10 deliberate interactions advance one stage, and "Demo pulse"
// jumps directly to the next threshold for the impatient.
export const decayStageStep = 10
export const maxDecayScore = (maxDecayStage - 1) * decayStageStep

export function scoreForStage(stage: number) {
  const clampedStage = Math.min(maxDecayStage, Math.max(1, stage))
  return (clampedStage - 1) * decayStageStep
}

export function stageFor(score: number) {
  return Math.min(maxDecayStage, Math.max(1, Math.floor(score / decayStageStep) + 1))
}

export function hasPageFractures(stage: number) {
  return stage >= maxDecayStage
}

export function shouldShowPageFractures(stage: number, repaired: boolean) {
  return hasPageFractures(stage) && !repaired
}

export function getEngagementLabels(stage: number) {
  if (stage <= 1) {
    return ['Like', 'Save', 'Share', 'More']
  }

  if (stage === 2) {
    return ['Like', 'Compare', 'Improve me', 'Shop look']
  }

  if (stage === 3) {
    return ['Envy', 'Compare', 'Optimize me', 'Comment']
  }

  return ['Envy', 'Rank body', 'Rewrite self', 'Comment']
}

export function scoreLikePrice(stage: number, index: number) {
  return String((stage * 17 + index * 9) % 100).padStart(2, '0')
}
