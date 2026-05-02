import { useState } from 'react'
import type { GameProps } from './types'

type Round = {
  theme: string
  hint: string
  items: string[]
  // Index of the AI-hallucinated token in this scene.
  oddIndex: number
  oddLabel: string
  reason: string
}

const ROUNDS: Round[] = [
  {
    theme: 'Cottage shelf',
    hint: 'One of these does not belong on a cozy shelf.',
    items: ['🪴', '🫖', '🧸', '🕯️', '🏵️', '🎀', '🍵', '🪺', '🪻', '🐸', '🌷', '🌹', '🪞', '🪜', '🛠️', '🍪'],
    oddIndex: 14,
    oddLabel: 'wrench',
    reason: 'A toolbox token snuck into the cozy scene.',
  },
  {
    theme: 'Kitchen counter',
    hint: 'One ingredient was added without a recipe.',
    items: ['🥕', '🥬', '🧄', '🧅', '🍅', '🥔', '🥒', '🌽', '🍆', '🥑', '🥦', '🍞', '🧀', '🥪', '🥐', '🦴'],
    oddIndex: 15,
    oddLabel: 'bone',
    reason: 'That belongs to the dog set, not the dinner set.',
  },
  {
    theme: 'Garden bug walk',
    hint: 'Find the thing that cannot pollinate.',
    items: ['🌷', '🌸', '🐝', '🦋', '🐞', '🐌', '🐛', '🐜', '🪲', '🪳', '🕷️', '🌹', '🌻', '🌼', '🌿', '🚀'],
    oddIndex: 15,
    oddLabel: 'rocket',
    reason: 'Rockets do not visit flowers.',
  },
]

export function SpotTheSlop({ stage, done, onComplete }: GameProps) {
  const [roundIdx, setRoundIdx] = useState(0)
  const [shakeIdx, setShakeIdx] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(done)
  const [misses, setMisses] = useState(0)

  const round = ROUNDS[roundIdx]!
  const allDone = submitted

  function tryCell(i: number) {
    if (allDone) return
    if (i === round.oddIndex) {
      if (roundIdx + 1 >= ROUNDS.length) {
        setSubmitted(true)
        onComplete('Spot the Slop')
      } else {
        setRoundIdx(roundIdx + 1)
      }
      setShakeIdx(null)
    } else {
      setMisses((m) => m + 1)
      setShakeIdx(i)
      window.setTimeout(() => setShakeIdx((current) => (current === i ? null : current)), 380)
    }
  }

  function reset() {
    setRoundIdx(0)
    setShakeIdx(null)
    setSubmitted(false)
    setMisses(0)
  }

  return (
    <div className="g g-spot" role="group" aria-label="Spot the Slop play area">
      <div className="g-spot-head">
        <div>
          <p className="g-eyebrow">Round {Math.min(roundIdx + 1, ROUNDS.length)} of {ROUNDS.length}</p>
          <h3>{round.theme}</h3>
          <p className="g-help">{allDone ? 'Three slops caught.' : round.hint}</p>
        </div>
        <div className="g-spot-misses" aria-label="Miss counter">
          <span>misses</span>
          <strong>{misses}</strong>
        </div>
      </div>

      <div className={`g-spot-grid ${allDone ? 'is-locked' : ''}`}>
        {round.items.map((emoji, i) => (
          <button
            key={`${roundIdx}-${i}`}
            type="button"
            className={`g-spot-cell ${shakeIdx === i ? 'is-shake' : ''}`}
            onClick={() => tryCell(i)}
            aria-label={`Item ${i + 1}`}
          >
            <span aria-hidden="true">{emoji}</span>
            {stage >= 4 && i === round.oddIndex && <em>{round.oddLabel}</em>}
          </button>
        ))}
      </div>

      {allDone && (
        <div className="g-receipt" role="status">
          <strong>Sticker pack +1</strong>
          {stage >= 3 ? (
            <code>hallucination_dataset.cottage_v12 → 3 anomalies flagged</code>
          ) : (
            <span>Such sharp eyes! You found every odd one out.</span>
          )}
          <button type="button" className="g-secondary" onClick={reset}>Play again</button>
        </div>
      )}

      {!allDone && (
        <div className="g-spot-progress" aria-hidden="true">
          {ROUNDS.map((_, i) => (
            <span key={i} className={i < roundIdx ? 'is-done' : i === roundIdx ? 'is-active' : ''} />
          ))}
        </div>
      )}
    </div>
  )
}
