import { useMemo, useState } from 'react'

export type MemoryMatchItem = {
  id: string
  label: string
  matchKey: string
}

export type MemoryMatchProps = {
  title?: string
  items: MemoryMatchItem[]
  onComplete?: (moves: number) => void
  onMatch?: (matchKey: string) => void
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(72px, 1fr))',
  gap: 10,
} satisfies React.CSSProperties

export function MemoryMatch({
  title = 'Memory Match',
  items,
  onComplete,
  onMatch,
}: MemoryMatchProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [matchedKeys, setMatchedKeys] = useState<Set<string>>(() => new Set())
  const [moves, setMoves] = useState(0)

  const cards = useMemo(() => items.slice(0, 12), [items])
  const complete = cards.length > 0 && cards.every((item) => matchedKeys.has(item.matchKey))

  const pickCard = (item: MemoryMatchItem) => {
    if (matchedKeys.has(item.matchKey) || selectedIds.includes(item.id) || selectedIds.length >= 2) {
      return
    }

    const nextSelectedIds = [...selectedIds, item.id]
    setSelectedIds(nextSelectedIds)

    if (nextSelectedIds.length !== 2) {
      return
    }

    const first = cards.find((card) => card.id === nextSelectedIds[0])
    const second = item
    const nextMoves = moves + 1
    setMoves(nextMoves)

    if (first?.matchKey === second.matchKey) {
      const nextMatchedKeys = new Set(matchedKeys).add(second.matchKey)
      setMatchedKeys(nextMatchedKeys)
      setSelectedIds([])
      onMatch?.(second.matchKey)

      if (cards.every((card) => nextMatchedKeys.has(card.matchKey))) {
        onComplete?.(nextMoves)
      }
      return
    }

    window.setTimeout(() => setSelectedIds([]), 650)
  }

  const reset = () => {
    setSelectedIds([])
    setMatchedKeys(new Set())
    setMoves(0)
  }

  return (
    <section
      style={{
        border: '1px solid rgba(148, 163, 184, 0.28)',
        borderRadius: 8,
        padding: 18,
        display: 'grid',
        gap: 14,
      }}
      aria-label={title}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b' }}>
            {complete ? `Cleared in ${moves} moves` : `${moves} moves`}
          </p>
        </div>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </header>
      <div style={gridStyle}>
        {cards.map((item) => {
          const revealed = selectedIds.includes(item.id) || matchedKeys.has(item.matchKey)
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={revealed}
              onClick={() => pickCard(item)}
              style={{
                minHeight: 74,
                borderRadius: 8,
                border: '1px solid rgba(148, 163, 184, 0.34)',
                background: revealed ? '#f8fafc' : '#0f172a',
                color: revealed ? '#0f172a' : '#f8fafc',
                font: 'inherit',
                fontWeight: 700,
                cursor: matchedKeys.has(item.matchKey) ? 'default' : 'pointer',
              }}
            >
              {revealed ? item.label : '?'}
            </button>
          )
        })}
      </div>
    </section>
  )
}
