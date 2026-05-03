import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'

type CrackRepairAssistantProps = {
  stage: number
  onRepair: () => void
}

const repairStages = new Set([3, 4])
const requiredDragMs = 2000
const requiredMinDistance = 60

export function CrackRepairAssistant({ stage, onRepair }: CrackRepairAssistantProps) {
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [repaired, setRepaired] = useState(false)
  const dragRef = useRef<{
    startedAt: number
    lastX: number
    lastY: number
    distance: number
  } | null>(null)
  const repairedRef = useRef(false)
  const rafRef = useRef(0)

  const visible = repairStages.has(stage) && !repaired

  const finishRepair = useCallback(() => {
    if (repairedRef.current) return
    repairedRef.current = true
    setProgress(1)
    setDragging(false)
    dragRef.current = null

    // Brief flash at 100% before hiding
    setTimeout(() => {
      setRepaired(true)
      onRepair()
    }, 400)
  }, [onRepair])

  // Animate progress smoothly during drag via rAF
  useEffect(() => {
    if (!dragging) return undefined

    let running = true
    function tick() {
      if (!running) return
      const drag = dragRef.current
      if (!drag) return

      const elapsed = performance.now() - drag.startedAt
      const next = Math.min(1, elapsed / requiredDragMs)
      setProgress(next)

      if (elapsed >= requiredDragMs && drag.distance >= requiredMinDistance) {
        finishRepair()
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      running = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [dragging, finishRepair])

  if (!visible) {
    return null
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    // Only start from the brush button
    const target = event.target as HTMLElement
    if (!target.closest('.spackle-brush')) return

    ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    const now = performance.now()
    dragRef.current = {
      startedAt: now,
      lastX: event.clientX,
      lastY: event.clientY,
      distance: 0,
    }
    setDragging(true)
    setProgress(0)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || !dragging) return

    const dx = event.clientX - drag.lastX
    const dy = event.clientY - drag.lastY
    drag.distance += Math.hypot(dx, dy)
    drag.lastX = event.clientX
    drag.lastY = event.clientY
  }

  function cancelDrag() {
    dragRef.current = null
    setDragging(false)
    setProgress(0)
  }

  const progressPct = Math.round(progress * 100)

  return (
    <div
      className={`crack-repair ${dragging ? 'is-dragging' : ''}`}
      style={{ '--repair-progress': String(progress) } as React.CSSProperties}
      aria-live="polite"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={cancelDrag}
      onPointerCancel={cancelDrag}
      onLostPointerCapture={cancelDrag}
    >
      {/* Full-screen wash effect while dragging */}
      {dragging && <div className="spackle-wash" aria-hidden="true" />}

      <div className="crack-repair-card" role="dialog" aria-label="Helpy crack repair">
        {/* Helpy message */}
        <div className="crack-repair-header">
          <span className="crack-repair-avatar" aria-hidden="true">🤖</span>
          <div className="crack-repair-body">
            <p className="crack-repair-name">Helpy</p>
            <p className="crack-repair-msg">
              {dragging
                ? 'Keep going! Sealing the cracks…'
                : 'Uh oh — cracks detected. Drag the brush to seal them.'}
            </p>
          </div>
        </div>

        {/* Progress bar + brush in one row */}
        <div className="crack-repair-action">
          <div
            className="spackle-progress-track"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Repair progress"
          >
            <div
              className="spackle-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
            <span className="spackle-progress-label">
              {progressPct > 0 ? `${progressPct}%` : 'Drag brush →'}
            </span>
          </div>
          <button
            type="button"
            className="spackle-brush"
            aria-label="Press and drag to seal the cracks"
            title="Hold and drag for 2 seconds"
          >
            🖌️
          </button>
        </div>
      </div>
    </div>
  )
}
