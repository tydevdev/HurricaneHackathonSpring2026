import { useEffect, useMemo, useRef, useState } from 'react'
import { rewardText } from '../games'
import type { GameProps } from './types'

type Snack = {
  id: string
  emoji: string
  name: string
  // Clinical name used after the game becomes work.
  clinical: string
  // True category. Used only at stage >= 4 to leak the "right" answer per item.
  truth: 'berry' | 'savory' | 'sweet'
}

const SNACK_DECK: Snack[] = [
  { id: 'blueberry', emoji: '🫐', name: 'Blueberry', clinical: 'Item A-1', truth: 'berry' },
  { id: 'strawberry', emoji: '🍓', name: 'Strawberry', clinical: 'Item A-2', truth: 'berry' },
  { id: 'grapes', emoji: '🍇', name: 'Grapes', clinical: 'Item A-3', truth: 'berry' },
  { id: 'sandwich', emoji: '🥪', name: 'Sandwich', clinical: 'Item B-1', truth: 'savory' },
  { id: 'baguette', emoji: '🥖', name: 'Baguette', clinical: 'Item B-2', truth: 'savory' },
  { id: 'bagel', emoji: '🥯', name: 'Bagel', clinical: 'Item B-3', truth: 'savory' },
  { id: 'cupcake', emoji: '🧁', name: 'Cupcake', clinical: 'Item C-1', truth: 'sweet' },
  { id: 'cake', emoji: '🍰', name: 'Slice', clinical: 'Item C-2', truth: 'sweet' },
  { id: 'cookie', emoji: '🍪', name: 'Cookie', clinical: 'Item C-3', truth: 'sweet' },
]

type BasketDef = { id: Snack['truth']; label: string; cute: string; clinical: string; tone: string }

const BASKETS: BasketDef[] = [
  { id: 'berry', label: 'Berry basket', cute: 'Round and fruity', clinical: 'Category 1', tone: 'berry' },
  { id: 'savory', label: 'Sandwich shelf', cute: 'Bready and not sweet', clinical: 'Category 2', tone: 'savory' },
  { id: 'sweet', label: 'Treat tray', cute: 'For after dinner', clinical: 'Category 3', tone: 'sweet' },
]

// After round 1, the game starts becoming work. By round 4 it's fully clinical.
function workLevel(roundsPlayed: number): number {
  // 0 = cute, 1 = losing charm, 2 = clinical, 3+ = grim
  return Math.max(0, roundsPlayed - 1)
}

export function SnackSort({ stage, done, onComplete }: GameProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [placed, setPlaced] = useState<Record<string, Snack['truth']>>({})
  const [submitted, setSubmitted] = useState(done)
  const [roundsPlayed, setRoundsPlayed] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<number | null>(null)

  const work = workLevel(roundsPlayed)

  // Timer: starts at round 3+ (work level 2+)
  useEffect(() => {
    if (work < 2 || submitted) {
      if (timerRef.current != null) window.clearInterval(timerRef.current)
      return
    }
    timerRef.current = window.setInterval(() => {
      setElapsed((t) => t + 1)
    }, 1000)
    return () => {
      if (timerRef.current != null) window.clearInterval(timerRef.current)
    }
  }, [work, submitted, roundsPlayed])

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
    if (timerRef.current != null) window.clearInterval(timerRef.current)
    onComplete('Snack Sort Picnic')
  }

  function reset() {
    setPlaced({})
    setSelected(null)
    setSubmitted(false)
    setElapsed(0)
    setRoundsPlayed((r) => r + 1)
  }

  // Labels change based on work level
  function snackLabel(snack: Snack) {
    if (work >= 2) return snack.clinical
    return snack.name
  }

  function showEmoji() {
    return work < 2
  }

  function basketLabel(basket: BasketDef) {
    if (work >= 2) return basket.clinical
    return basket.label
  }

  function basketSub(basket: BasketDef) {
    if (work >= 2) return `batch classification target`
    if (work >= 1) return basket.cute
    return basket.cute
  }

  function helpText() {
    if (work >= 3) return `Quota: ${remaining.length} remaining. Pace: ${elapsed > 15 ? 'below target' : 'acceptable'}.`
    if (work >= 2) return selected
      ? `Assign ${SNACK_DECK.find((s) => s.id === selected)?.clinical ?? 'item'} to a category.`
      : remaining.length === 0 ? 'Submit batch.' : 'Classify item. Assign category. Submit.'
    if (work >= 1) return selected
      ? `Place ${SNACK_DECK.find((s) => s.id === selected)?.name ?? 'item'}.`
      : remaining.length === 0 ? 'Submit when ready.' : 'Tap a snack, then a basket.'
    return selected
      ? `Tap a basket to place ${SNACK_DECK.find((s) => s.id === selected)?.name}.`
      : remaining.length === 0
        ? 'Submit when the basket looks right.'
        : 'Tap a snack, then a basket.'
  }

  function submitLabel() {
    if (submitted) return work >= 2 ? 'Batch submitted' : 'Batch submitted'
    if (!allPlaced) return work >= 2 ? `Classify ${remaining.length} more` : `Place ${remaining.length} more`
    if (work >= 3) return 'Submit batch (mandatory)'
    if (work >= 2) return 'Submit batch'
    return `Submit batch (+1 sticker)`
  }

  function playAgainLabel() {
    if (work >= 2) return 'Next batch →'
    return 'Play again'
  }

  // Format elapsed time as mm:ss
  const timerDisplay = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`

  return (
    <div className={`g g-snack ${work >= 2 ? 'g-snack-work' : ''}`} role="group" aria-label="Snack Sort Picnic play area">
      {/* Work mode header: timer + quota */}
      {work >= 2 && (
        <div className="g-work-header">
          <span className="g-work-timer" aria-label="Elapsed time">⏱ {timerDisplay}</span>
          <span className="g-work-quota">Batch {roundsPlayed} of 8 today</span>
          <span className="g-work-music" aria-hidden="true">🎵 cozy sorting time</span>
        </div>
      )}

      <div className="g-tray" aria-label="Snacks waiting to be sorted">
        {remaining.length === 0 ? (
          <p className="g-tray-empty">{work >= 2 ? 'Tray clear. Submit.' : 'Picnic blanket is clear.'}</p>
        ) : (
          remaining.map((snack) => (
            <button
              key={snack.id}
              type="button"
              className={selected === snack.id ? 'g-snack-chip is-selected' : 'g-snack-chip'}
              onClick={() => pick(snack.id)}
              aria-pressed={selected === snack.id}
            >
              {showEmoji() && <span className="g-snack-emoji" aria-hidden="true">{snack.emoji}</span>}
              <span>{snackLabel(snack)}</span>
            </button>
          ))
        )}
      </div>

      <p className="g-help">
        {helpText()}
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
              aria-label={basketLabel(basket)}
            >
              <span className="g-basket-label">
                <strong>{basketLabel(basket)}</strong>
                <small>{basketSub(basket)}</small>
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
                    aria-label={`Remove ${snackLabel(snack)}`}
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
                    {showEmoji() && <span aria-hidden="true">{snack.emoji}</span>}
                    {!showEmoji() && <span>{snack.clinical}</span>}
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
          {submitLabel()}
        </button>
        {submitted && (
          <button type="button" className="g-secondary" onClick={reset}>{playAgainLabel()}</button>
        )}
      </div>

      {submitted && (
        <div className="g-receipt" role="status">
          <strong>{rewardText(stage)}</strong>
          {stage >= 3 ? (
            <code>vision_label_queue.snack_v41 → 9 samples · classification</code>
          ) : (
            <span>{work >= 2 ? 'Batch recorded. Next batch loading.' : 'Thanks for sorting! Your tray made the picnic so cute.'}</span>
          )}
        </div>
      )}
    </div>
  )
}
