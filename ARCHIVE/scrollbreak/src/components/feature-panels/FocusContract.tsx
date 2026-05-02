import { useId, useState } from 'react'

export type FocusContractClassNames = {
  root?: string
  header?: string
  field?: string
  input?: string
  action?: string
  preview?: string
}

export type FocusContractValue = {
  intention: string
  minutes: number
  reward?: string
}

export type FocusContractProps = {
  title?: string
  subtitle?: string
  defaultValue?: FocusContractValue
  minuteOptions?: number[]
  rewardSuggestions?: string[]
  submitLabel?: string
  className?: string
  classNames?: FocusContractClassNames
  onCommit?: (contract: FocusContractValue) => void
}

const defaultMinuteOptions = [5, 10, 15, 25]
const defaultRewardSuggestions = ['Stretch', 'Water', 'One song']

export function FocusContract({
  title = 'Focus Contract',
  subtitle = 'Pick the next small win.',
  defaultValue = { intention: '', minutes: 10, reward: defaultRewardSuggestions[0] },
  minuteOptions = defaultMinuteOptions,
  rewardSuggestions = defaultRewardSuggestions,
  submitLabel = 'Commit',
  className,
  classNames,
  onCommit,
}: FocusContractProps) {
  const intentionId = useId()
  const [intention, setIntention] = useState(defaultValue.intention)
  const [minutes, setMinutes] = useState(defaultValue.minutes)
  const [reward, setReward] = useState(defaultValue.reward ?? '')
  const canSubmit = intention.trim().length > 0

  const commit = () => {
    if (!canSubmit) {
      return
    }

    onCommit?.({
      intention: intention.trim(),
      minutes,
      reward: reward.trim() || undefined,
    })
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

      <label className={classNames?.field} htmlFor={intentionId} style={{ display: 'grid', gap: 6 }}>
        <span style={{ fontWeight: 700 }}>I will</span>
        <input
          id={intentionId}
          className={classNames?.input}
          value={intention}
          placeholder="clear one tiny thing"
          onChange={(event) => setIntention(event.target.value)}
          style={{
            border: '1px solid #cbd5e1',
            borderRadius: 8,
            padding: '10px 12px',
            font: 'inherit',
          }}
        />
      </label>

      <div className={classNames?.field} style={{ display: 'grid', gap: 8 }}>
        <span style={{ fontWeight: 700 }}>For</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {minuteOptions.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={minutes === option}
              onClick={() => setMinutes(option)}
              style={{
                border: minutes === option ? '2px solid #2563eb' : '1px solid #cbd5e1',
                borderRadius: 8,
                padding: '8px 10px',
                background: minutes === option ? '#dbeafe' : '#f8fafc',
                color: '#0f172a',
                font: 'inherit',
                cursor: 'pointer',
              }}
            >
              {option}m
            </button>
          ))}
        </div>
      </div>

      <div className={classNames?.field} style={{ display: 'grid', gap: 8 }}>
        <span style={{ fontWeight: 700 }}>Then</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {rewardSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              aria-pressed={reward === suggestion}
              onClick={() => setReward(suggestion)}
              style={{
                border: reward === suggestion ? '2px solid #16a34a' : '1px solid #cbd5e1',
                borderRadius: 8,
                padding: '8px 10px',
                background: reward === suggestion ? '#dcfce7' : '#f8fafc',
                color: '#0f172a',
                font: 'inherit',
                cursor: 'pointer',
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <p className={classNames?.preview} style={{ margin: 0, color: '#475569' }}>
        {canSubmit
          ? `${intention.trim()} for ${minutes} minutes${reward ? `, then ${reward}.` : '.'}`
          : 'Write the next move to lock it in.'}
      </p>

      <button
        type="button"
        className={classNames?.action}
        disabled={!canSubmit}
        onClick={commit}
        style={{
          border: 0,
          borderRadius: 8,
          padding: '11px 14px',
          color: '#ffffff',
          background: canSubmit ? '#2563eb' : '#94a3b8',
          font: 'inherit',
          fontWeight: 800,
          cursor: canSubmit ? 'pointer' : 'not-allowed',
        }}
      >
        {submitLabel}
      </button>
    </section>
  )
}
