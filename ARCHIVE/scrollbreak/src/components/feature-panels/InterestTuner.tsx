export type InterestTopic = {
  id: string
  label: string
  description?: string
  weight: number
}

export type InterestTunerClassNames = {
  root?: string
  header?: string
  list?: string
  topic?: string
  slider?: string
}

export type InterestTunerProps = {
  topics: InterestTopic[]
  title?: string
  subtitle?: string
  min?: number
  max?: number
  className?: string
  classNames?: InterestTunerClassNames
  onTopicChange?: (topicId: string, weight: number) => void
}

export function InterestTuner({
  topics,
  title = 'Interest Tuner',
  subtitle = 'Nudge the feed toward what is worth your attention.',
  min = 0,
  max = 100,
  className,
  classNames,
  onTopicChange,
}: InterestTunerProps) {
  return (
    <section
      className={[className, classNames?.root].filter(Boolean).join(' ')}
      style={{
        border: '1px solid rgba(148, 163, 184, 0.24)',
        borderRadius: 8,
        padding: 18,
        display: 'grid',
        gap: 14,
        background: '#ffffff',
        color: '#0f172a',
      }}
    >
      <header className={classNames?.header}>
        <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
        {subtitle ? <p style={{ margin: '4px 0 0', color: '#475569' }}>{subtitle}</p> : null}
      </header>

      <div className={classNames?.list} style={{ display: 'grid', gap: 12 }}>
        {topics.map((topic) => {
          const value = Math.min(max, Math.max(min, topic.weight))

          return (
            <label
              key={topic.id}
              className={classNames?.topic}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: 12,
                display: 'grid',
                gap: 8,
              }}
            >
              <span style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <strong>{topic.label}</strong>
                <small style={{ color: '#64748b' }}>{value}%</small>
              </span>
              {topic.description ? (
                <span style={{ color: '#475569', fontSize: 14 }}>{topic.description}</span>
              ) : null}
              <input
                className={classNames?.slider}
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(event) => onTopicChange?.(topic.id, Number(event.target.value))}
              />
            </label>
          )
        })}
      </div>
    </section>
  )
}
