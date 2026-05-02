export function stageFor(score: number) {
  return Math.min(4, Math.max(1, Math.floor(score / 6) + 1))
}

export function getEngagementLabels(stage: number) {
  if (stage <= 1) {
    return ['Like', 'Save', 'Share', 'More']
  }

  if (stage === 2) {
    return ['Like', 'Compare', 'Improve me', 'Shop look']
  }

  if (stage === 3) {
    return ['Envy', 'Compare', 'Optimize me', 'Buy context']
  }

  return ['Envy', 'Rank body', 'Rewrite self', 'Buy the context']
}

export function scoreLikePrice(stage: number, index: number) {
  return String((stage * 17 + index * 9) % 100).padStart(2, '0')
}
