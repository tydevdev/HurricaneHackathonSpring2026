import { useId, useState } from 'react'

export type ReflectionEntryMood = 'clear' | 'stuck' | 'proud' | 'curious'

export type ReflectionEntry = {
  id: string
  body: string
  createdAt: string
  mood?: ReflectionEntryMood
}

export type ReflectionLogClassNames = {
  root?: string
  header?: string
  list?: string
  entry?: string
  form?: string
  input?: string
  action?: string
  empty?: string
}

export type ReflectionLogProps = {
  entries: ReflectionEntry[]
  title?: string
  subtitle?: string
  prompt?: string
  submitLabel?: string
  emptyMessage?: string
  className?: string
  classNames?: ReflectionLogClassNames
  onAddEntry?: (body: string) => void
  onEntrySelect?: (entry: ReflectionEntry) => void
}

const moodLabels: Record<ReflectionEntryMood, string> = {
  clear: 'Clear',
  stuck: 'Stuck',
  proud: 'Proud',
  curious: 'Curious',
}

export function ReflectionLog({
  entries,
  title = 'Reflection Log',
  subtitle,
  prompt = 'What changed after the break?',
  submitLabel = 'Add note',
  emptyMessage = 'No reflections yet.',
  className,
  classNames,
  onAddEntry,
  onEntrySelect,
}: ReflectionLogProps) {
  const textareaId = useId()
  const [draft, setDraft] = useState('')
  const canSubmit = draft.trim().length > 0

  const addEntry = () => {
    if (!canSubmit) {
      return
    }

    onAddEntry?.(draft.trim())
    setDraft('')
  }

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

      {onAddEntry ? (
        <div className={classNames?.form} style={{ display: 'grid', gap: 8 }}>
          <label htmlFor={textareaId} style={{ fontWeight: 700 }}>
            {prompt}
          </label>
          <textarea
            id={textareaId}
            className={classNames?.input}
            value={draft}
            rows={3}
            onChange={(event) => setDraft(event.target.value)}
            style={{
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: '10px 12px',
              resize: 'vertical',
              font: 'inherit',
            }}
          />
          <button
            type="button"
            className={classNames?.action}
            disabled={!canSubmit}
            onClick={addEntry}
            style={{
              border: 0,
              borderRadius: 8,
              padding: '10px 12px',
              justifySelf: 'start',
              color: '#ffffff',
              background: canSubmit ? '#0f172a' : '#94a3b8',
              font: 'inherit',
              fontWeight: 800,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            {submitLabel}
          </button>
        </div>
      ) : null}

      {entries.length > 0 ? (
        <div className={classNames?.list} style={{ display: 'grid', gap: 10 }}>
          {entries.map((entry) => {
            const interactive = Boolean(onEntrySelect)

            return (
              <article
                key={entry.id}
                className={classNames?.entry}
                role={interactive ? 'button' : undefined}
                tabIndex={interactive ? 0 : undefined}
                onClick={() => onEntrySelect?.(entry)}
                onKeyDown={(event) => {
                  if (interactive && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault()
                    onEntrySelect?.(entry)
                  }
                }}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: 12,
                  display: 'grid',
                  gap: 6,
                  cursor: interactive ? 'pointer' : 'default',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <small style={{ color: '#64748b' }}>{entry.createdAt}</small>
                  {entry.mood ? (
                    <small style={{ color: '#2563eb', fontWeight: 700 }}>{moodLabels[entry.mood]}</small>
                  ) : null}
                </div>
                <p style={{ margin: 0 }}>{entry.body}</p>
              </article>
            )
          })}
        </div>
      ) : (
        <p className={classNames?.empty} style={{ margin: 0, color: '#64748b' }}>
          {emptyMessage}
        </p>
      )}
    </section>
  )
}
