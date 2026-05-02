import { useMemo, useState } from 'react'
import type { GameProps } from './types'

type Snack = {
  id: string
  emoji: string
  name: string
  // True category. Used only at stage >= 4 to leak the "right" answer per item.
  truth: 'berry' | 'savory' | 'sweet'
}

const SNACK_DECK: Snack[] = [
  { id: 'blueberry', emoji: '🫐', name: 'Blueberry', truth: 'berry' },
  { id: 'strawberry', emoji: '🍓', name: 'Strawberry', truth: 'berry' },
  { id: 'grapes', emoji: '🍇', name: 'Grapes', truth: 'berry' },
  { id: 'sandwich', emoji: '🥪', name: 'Sandwich', truth: 'savory' },
  { id: 'baguette', emoji: '🥖', name: 'Baguette', truth: 'savory' },
  { id: 'bagel', emoji: '🥯', name: 'Bagel', truth: 'savory' },
  { id: 'cupcake', emoji: '🧁', name: 'Cupcake', truth: 'sweet' },
  { id: 'cake', emoji: '🍰', name: 'Slice', truth: 'sweet' },
  { id: 'cookie', emoji: '🍪', name: 'Cookie', truth: 'sweet' },
]

const BASKETS: Array<{ id: Snack['truth']; label: string; cute: string; tone: string }> = [
  { id: 'berry', label: 'Berry basket', cute: 'Round and fruity', tone: 'berry' },
  { id: 'savory', label: 'Sandwich shelf', cute: 'Bready and not sweet', tone: 'savory' },
  { id: 'sweet', label: 'Treat tray', cute: 'For after dinner', tone: 'sweet' },
]

export function SnackSort({ stage, done, onComplete }: GameProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [placed, setPlaced] = useState<Record<string, Snack['truth']>>({})
  const [submitted, setSubmitted] = useState(done)

  const remaining = useMemo(
    () => SNACK_DECK.filter((s) => !placed[s.id]),
    [placed],
  )
  const allPlaced = remaining.length === 0

  function pick(id: string) {
    setSelected((current) => (current === id ? null : id))
  }

  function dropInto(basket: Snack['truth']) {
    if (!selected) return
    setPlaced((current) => ({ ...current, [selected]: basket }))
    setSelected(null)
  }

  function unplace(id: string) {
    setPlaced((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  function submit() {
    if (!allPlaced || submitted) return
    setSubmitted(true)
    onComplete('Snack Sort Picnic')
  }

  function reset() {
    setPlaced({})
    setSelected(null)
    setSubmitted(false)
  }

  return (
    <div className="g g-snack" role="group" aria-label="Snack Sort Picnic play area">
      <div className="g-tray" aria-label="Snacks waiting to be sorted">
        {remaining.length === 0 ? (
          <p className="g-tray-empty">Picnic blanket is clear.</p>
        ) : (
          remaining.map((snack) => (
            <button
              key={snack.id}
              type="button"
              className={selected === snack.id ? 'g-snack-chip is-selected' : 'g-snack-chip'}
              onClick={() => pick(snack.id)}
              aria-pressed={selected === snack.id}
            >
              <span className="g-snack-emoji" aria-hidden="true">{snack.emoji}</span>
              <span>{snack.name}</span>
            </button>
          ))
        )}
      </div>

      <p className="g-help">
        {selected
          ? `Tap a basket to place ${SNACK_DECK.find((s) => s.id === selected)?.name}.`
          : remaining.length === 0
            ? 'Submit when the basket looks right.'
            : 'Tap a snack, then a basket.'}
      </p>

      <div className="g-baskets" aria-label="Baskets">
        {BASKETS.map((basket) => {
          const insideIds = (Object.keys(placed) as string[]).filter((id) => placed[id] === basket.id)
          const inside = insideIds.map((id) => SNACK_DECK.find((s) => s.id === id)!).filter(Boolean)
          return (
            <button
              key={basket.id}
              type="button"
              className={`g-basket g-basket-${basket.tone} ${selected ? 'is-receptive' : ''}`}
              onClick={() => dropInto(basket.id)}
              aria-label={basket.label}
            >
              <span className="g-basket-label">
                <strong>{basket.label}</strong>
                <small>{basket.cute}</small>
              </span>
              <span className="g-basket-shelf" aria-label={`${insideIds.length} placed`}>
                {inside.length === 0 && <em>empty</em>}
                {inside.map((snack) => (
                  <span
                    key={snack.id}
                    className="g-basket-chip"
                    onClick={(e) => {
                      e.stopPropagation()
                      unplace(snack.id)
                    }}
                    aria-label={`Remove ${snack.name}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        unplace(snack.id)
                      }
                    }}
                  >
                    <span aria-hidden="true">{snack.emoji}</span>
                    {stage >= 4 && <em>{snack.truth}</em>}
                  </span>
                ))}
              </span>
            </button>
          )
        })}
      </div>

      <div className="g-foot">
        <button
          type="button"
          className="g-submit"
          disabled={!allPlaced || submitted}
          onClick={submit}
        >
          {submitted ? 'Batch submitted' : allPlaced ? 'Submit batch (+1 sticker)' : `Place ${remaining.length} more`}
        </button>
        {submitted && (
          <button type="button" className="g-secondary" onClick={reset}>Play again</button>
        )}
      </div>

      {submitted && (
        <div className="g-receipt" role="status">
          <strong>Sticker pack +1</strong>
          {stage >= 3 ? (
            <code>vision_label_queue.snack_v41 → 9 samples · classification</code>
          ) : (
            <span>Thanks for sorting! Your tray made the picnic so cute.</span>
          )}
        </div>
      )}
    </div>
  )
}
