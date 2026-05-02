import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'

type BugScatterProps = {
  stage: number
}

type BugRun = {
  id: number
  style: BugStyle
}

type BugStyle = CSSProperties & {
  '--bug-from-x': string
  '--bug-from-y': string
  '--bug-to-x': string
  '--bug-to-y': string
  '--bug-spin': string
  '--bug-scale': string
  '--bug-duration': string
}

const minBugDelayMs = 30_000
const maxBugDelayMs = 300_000
const bugForceEvent = 'slopularity:force-bug-scatter'

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randomDelay() {
  return randomBetween(minBugDelayMs, maxBugDelayMs)
}

function makeBugStyle(): BugStyle {
  const startsLeft = Math.random() > 0.5
  const topStart = randomBetween(4, 72)
  const verticalDrift = randomBetween(24, 48) * (topStart > 45 ? -1 : 1)
  const duration = randomBetween(8.5, 14)

  return {
    '--bug-from-x': startsLeft ? '-12vw' : '112vw',
    '--bug-from-y': `${topStart}vh`,
    '--bug-to-x': startsLeft ? '112vw' : '-12vw',
    '--bug-to-y': `${Math.min(94, Math.max(3, topStart + verticalDrift))}vh`,
    '--bug-spin': `${startsLeft ? 1 : -1}turn`,
    '--bug-scale': String(randomBetween(0.85, 1.35)),
    '--bug-duration': `${duration}s`,
  }
}

export function BugScatter({ stage }: BugScatterProps) {
  const [bugRun, setBugRun] = useState<BugRun | null>(null)
  const timerRef = useRef<number | null>(null)
  const cleanupRef = useRef<number | null>(null)
  const sequenceRef = useRef(0)

  const clearTimers = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (cleanupRef.current !== null) {
      window.clearTimeout(cleanupRef.current)
      cleanupRef.current = null
    }
  }, [])

  const spawnBug = useCallback(() => {
    sequenceRef.current += 1
    setBugRun({
      id: sequenceRef.current,
      style: makeBugStyle(),
    })

    cleanupRef.current = window.setTimeout(() => {
      setBugRun(null)
    }, 15_000)
  }, [])

  useEffect(() => {
    clearTimers()

    if (stage < 4 || typeof window === 'undefined') {
      return undefined
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return undefined
    }

    let cancelled = false

    const scheduleNext = () => {
      timerRef.current = window.setTimeout(() => {
        if (cancelled) {
          return
        }

        spawnBug()
        scheduleNext()
      }, randomDelay())
    }

    scheduleNext()

    const forceBug = () => spawnBug()
    window.addEventListener(bugForceEvent, forceBug)

    return () => {
      cancelled = true
      clearTimers()
      window.removeEventListener(bugForceEvent, forceBug)
    }
  }, [clearTimers, spawnBug, stage])

  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (stage < 4 || prefersReducedMotion || bugRun === null) {
    return null
  }

  return (
    <div className="bug-scatter-layer" aria-hidden="true">
      <span key={bugRun.id} className="bug-scatter-bug" style={bugRun.style}>🐛</span>
    </div>
  )
}
