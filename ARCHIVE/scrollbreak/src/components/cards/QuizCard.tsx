export type QuizOption = {
  id: string
  label: string
}

export type QuizCardProps = {
  question: string
  options: QuizOption[]
  selectedOptionId?: string
  correctOptionId?: string
  onSelect?: (optionId: string) => void
}

const cardStyle = {
  border: '1px solid rgba(148, 163, 184, 0.28)',
  borderRadius: 8,
  padding: 18,
  display: 'grid',
  gap: 12,
  background: '#ffffff',
  color: '#0f172a',
} satisfies React.CSSProperties

export function QuizCard({
  question,
  options,
  selectedOptionId,
  correctOptionId,
  onSelect,
}: QuizCardProps) {
  return (
    <article style={cardStyle}>
      <h2 style={{ margin: 0, fontSize: 22 }}>{question}</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        {options.map((option) => {
          const selected = option.id === selectedOptionId
          const correct = option.id === correctOptionId
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect?.(option.id)}
              style={{
                borderRadius: 8,
                border: selected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                padding: '10px 12px',
                textAlign: 'left',
                background: correct ? '#dcfce7' : selected ? '#dbeafe' : '#f8fafc',
                color: '#0f172a',
                font: 'inherit',
                cursor: 'pointer',
              }}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </article>
  )
}
