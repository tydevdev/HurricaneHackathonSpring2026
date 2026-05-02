import { useCallback, useEffect, useMemo, useState } from 'react'

export type Stage = 1 | 2 | 3 | 4 | 5

const STORAGE_KEY = 'quiet-collapse:state-v1'

const STAGE_THRESHOLDS: Array<{ stage: Stage; min: number }> = [
  { stage: 1, min: 0 },
  { stage: 2, min: 8 },
  { stage: 3, min: 22 },
  { stage: 4, min: 40 },
  { stage: 5, min: 62 },
]

export function stageFor(score: number): Stage {
  let current: Stage = 1
  for (const t of STAGE_THRESHOLDS) {
    if (score >= t.min) current = t.stage
  }
  return current
}

export type DiscoveryId =
  | 'faq-contradiction'
  | 'source-drift'
  | 'stale-summary'
  | 'search-no-source'
  | 'assistant-confident-wrong'
  | 'assistant-prompt-leak'
  | 'assistant-source-collapse'
  | 'form-not-sent'
  | 'duplicate-page'
  | 'changelog-rewrite'
  | 'review-conflict'
  | 'hotline-drift'
  | 'fake-citation'
  | 'placeholder-language'
  | 'final-warning'

export interface CollapseState {
  score: number
  clicks: number
  discoveries: Set<DiscoveryId>
  counts: Record<string, number>
}

interface SerializedState {
  score: number
  clicks: number
  discoveries: DiscoveryId[]
  counts: Record<string, number>
}

function loadInitial(): CollapseState {
  if (typeof window === 'undefined') {
    return { score: 0, clicks: 0, discoveries: new Set(), counts: {} }
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { score: 0, clicks: 0, discoveries: new Set(), counts: {} }
    const parsed = JSON.parse(raw) as SerializedState
    return {
      score: parsed.score ?? 0,
      clicks: parsed.clicks ?? 0,
      discoveries: new Set(parsed.discoveries ?? []),
      counts: parsed.counts ?? {},
    }
  } catch {
    return { score: 0, clicks: 0, discoveries: new Set(), counts: {} }
  }
}

export function useInstability() {
  const [state, setState] = useState<CollapseState>(loadInitial)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const serialized: SerializedState = {
      score: state.score,
      clicks: state.clicks,
      discoveries: [...state.discoveries],
      counts: state.counts,
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
    } catch {
      /* ignore quota errors */
    }
  }, [state])

  const bump = useCallback((amount = 1, key?: string) => {
    setState((s) => {
      const counts = key ? { ...s.counts, [key]: (s.counts[key] ?? 0) + 1 } : s.counts
      return {
        score: s.score + amount,
        clicks: s.clicks + 1,
        discoveries: s.discoveries,
        counts,
      }
    })
  }, [])

  const discover = useCallback((id: DiscoveryId) => {
    setState((s) => {
      if (s.discoveries.has(id)) return s
      const next = new Set(s.discoveries)
      next.add(id)
      return { ...s, discoveries: next }
    })
  }, [])

  const reset = useCallback(() => {
    setState({ score: 0, clicks: 0, discoveries: new Set(), counts: {} })
  }, [])

  const stage = useMemo(() => stageFor(state.score), [state.score])

  const instability = useMemo(() => {
    return Math.min(1, state.score / 78)
  }, [state.score])

  const countFor = useCallback(
    (key: string) => state.counts[key] ?? 0,
    [state.counts],
  )

  return {
    state,
    stage,
    instability,
    bump,
    discover,
    reset,
    countFor,
  }
}
