export type MythFactAnswer = 'myth' | 'fact'

export type MythFactCardProps = {
  statement: string
  answer: MythFactAnswer
  selectedAnswer?: MythFactAnswer
  explanation?: string
  onAnswer?: (answer: MythFactAnswer, isCorrect: boolean) => void
}

export function MythFactCard({
  statement,
  answer,
  selectedAnswer,
  explanation,
  onAnswer,
}: MythFactCardProps) {
  const pick = (nextAnswer: MythFactAnswer) => {
    onAnswer?.(nextAnswer, nextAnswer === answer)
  }

  const answered = selectedAnswer !== undefined

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
      <p style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{statement}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['myth', 'fact'] as const).map((choice) => (
          <button
            key={choice}
            type="button"
            aria-pressed={selectedAnswer === choice}
            onClick={() => pick(choice)}
            style={{
              borderRadius: 8,
              border: selectedAnswer === choice ? '2px solid #2563eb' : '1px solid #cbd5e1',
              padding: '10px 14px',
              textTransform: 'capitalize',
              font: 'inherit',
              fontWeight: 700,
            }}
          >
            {choice}
          </button>
        ))}
      </div>
      {answered && explanation ? (
        <p style={{ margin: 0, color: selectedAnswer === answer ? '#166534' : '#991b1b' }}>
          {explanation}
        </p>
      ) : null}
    </article>
  )
}
