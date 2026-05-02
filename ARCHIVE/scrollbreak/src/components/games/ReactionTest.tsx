import { useRef, useState } from 'react'

type ReactionPhase = 'idle' | 'waiting' | 'ready' | 'tooSoon' | 'finished'

export type ReactionTestProps = {
  title?: string
  prompt?: string
  minDelayMs?: number
  maxDelayMs?: number
  bestTimeMs?: number
  onResult?: (reactionTimeMs: number) => void
}

const panelStyle = {
  border: '1px solid rgba(255, 255, 255, 0.16)',
  borderRadius: 8,
  padding: 20,
  display: 'grid',
  gap: 14,
  background: 'rgba(12, 17, 27, 0.86)',
  color: '#f8fafc',
} satisfies React.CSSProperties

const buttonStyle = {
  border: 0,
  borderRadius: 8,
  padding: '14px 16px',
  font: 'inherit',
  fontWeight: 700,
  cursor: 'pointer',
  color: '#07111f',
  background: '#7dd3fc',
} satisfies React.CSSProperties

export function ReactionTest({
  title = 'Reaction Test',
  prompt = 'Tap when the card changes.',
  minDelayMs = 900,
  maxDelayMs = 2600,
  bestTimeMs,
  onResult,
}: ReactionTestProps) {
  const [phase, setPhase] = useState<ReactionPhase>('idle')
  const [lastTimeMs, setLastTimeMs] = useState<number | null>(null)
  const readyAtRef = useRef(0)
  const timerRef = useRef<number | null>(null)

  const getDelayMs = () => {
    const floor = Math.min(minDelayMs, maxDelayMs)
    const ceiling = Math.max(minDelayMs, maxDelayMs)
    return floor + Math.round(Math.random() * (ceiling - floor))
  }

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const start = () => {
    clearTimer()
    setLastTimeMs(null)
    setPhase('waiting')
    timerRef.current = window.setTimeout(() => {
      readyAtRef.current = performance.now()
      setPhase('ready')
    }, getDelayMs())
  }

  const handlePress = () => {
    if (phase === 'idle' || phase === 'finished' || phase === 'tooSoon') {
      start()
      return
    }

    if (phase === 'waiting') {
      clearTimer()
      setPhase('tooSoon')
      return
    }

    const reactionTimeMs = Math.round(performance.now() - readyAtRef.current)
    setLastTimeMs(reactionTimeMs)
    setPhase('finished')
    onResult?.(reactionTimeMs)
  }

  const status =
    phase === 'waiting'
      ? 'Wait for it...'
      : phase === 'ready'
        ? 'Now'
        : phase === 'tooSoon'
          ? 'Too soon'
          : lastTimeMs === null
            ? prompt
            : `${lastTimeMs} ms`

  return (
    <section style={panelStyle} aria-label={title}>
      <div>
        <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
        <p style={{ margin: '6px 0 0', color: '#cbd5e1' }}>{status}</p>
      </div>
      <button
        type="button"
        style={{
          ...buttonStyle,
          background: phase === 'ready' ? '#86efac' : phase === 'tooSoon' ? '#fca5a5' : '#7dd3fc',
        }}
        onClick={handlePress}
      >
        {phase === 'waiting' ? 'Hold steady' : phase === 'ready' ? 'Tap' : 'Start'}
      </button>
      {bestTimeMs !== undefined ? (
        <small style={{ color: '#94a3b8' }}>Best: {bestTimeMs} ms</small>
      ) : null}
    </section>
  )
}
