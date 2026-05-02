export type SpotFakeChoice = {
  id: string
  text: string
  isFake: boolean
}

export type SpotFakeCardProps = {
  title?: string
  choices: SpotFakeChoice[]
  selectedChoiceId?: string
  onSelect?: (choiceId: string, isFake: boolean) => void
}

export function SpotFakeCard({
  title = 'Spot the Fake',
  choices,
  selectedChoiceId,
  onSelect,
}: SpotFakeCardProps) {
  return (
    <article
      style={{
        border: '1px solid rgba(148, 163, 184, 0.28)',
        borderRadius: 8,
        padding: 18,
        display: 'grid',
        gap: 12,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        {choices.map((choice) => {
          const selected = selectedChoiceId === choice.id
          return (
            <button
              key={choice.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect?.(choice.id, choice.isFake)}
              style={{
                borderRadius: 8,
                border: selected ? '2px solid #f97316' : '1px solid #cbd5e1',
                padding: '12px',
                background: selected ? '#ffedd5' : '#ffffff',
                textAlign: 'left',
                font: 'inherit',
              }}
            >
              {choice.text}
            </button>
          )
        })}
      </div>
    </article>
  )
}
