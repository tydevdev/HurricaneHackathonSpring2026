import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'

type CrackRepairAssistantProps = {
  stage: number
  onRepair: () => void
}

type BrushPosition = {
  x: number
  y: number
}

type DragState = {
  lastX: number
  lastY: number
  startedAt: number
  distance: number
}

type RepairStyle = CSSProperties & {
  '--brush-x': string
  '--brush-y': string
  '--repair-progress': string
}

const repairStages = new Set([3, 4])
const requiredDragMs = 2000
const requiredDistance = 80

function defaultBrushPosition(): BrushPosition {
  if (typeof window === 'undefined') {
    return { x: 320, y: 520 }
  }

  return {
    x: Math.max(48, window.innerWidth - 72),
    y: Math.max(88, window.innerHeight - 96),
  }
}

export function CrackRepairAssistant({ stage, onRepair }: CrackRepairAssistantProps) {
  const [brushPosition, setBrushPosition] = useState(defaultBrushPosition)
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const dragRef = useRef<DragState | null>(null)
  const repairedRef = useRef(false)
  const visible = repairStages.has(stage)

  if (!visible) {
    return null
  }

  const style: RepairStyle = {
    '--brush-x': `${brushPosition.x}px`,
    '--brush-y': `${brushPosition.y}px`,
    '--repair-progress': `${progress}`,
  }

  function finishRepair() {
    if (repairedRef.current) return
    repairedRef.current = true
    setProgress(1)
    setDragging(false)
    dragRef.current = null
    onRepair()
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    const now = performance.now()
    dragRef.current = {
      lastX: event.clientX,
      lastY: event.clientY,
      startedAt: now,
      distance: 0,
    }
    setBrushPosition({ x: event.clientX, y: event.clientY })
    setDragging(true)
    setProgress(0)
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || !dragging) return

    const dx = event.clientX - drag.lastX
    const dy = event.clientY - drag.lastY
    drag.distance += Math.hypot(dx, dy)
    drag.lastX = event.clientX
    drag.lastY = event.clientY
    setBrushPosition({ x: event.clientX, y: event.clientY })

    if (drag.distance < 12) {
      return
    }

    const elapsed = performance.now() - drag.startedAt
    const nextProgress = Math.min(1, elapsed / requiredDragMs)
    setProgress(nextProgress)

    if (elapsed >= requiredDragMs && drag.distance >= requiredDistance) {
      finishRepair()
    }
  }

  function cancelDrag() {
    dragRef.current = null
    setDragging(false)
    setProgress(0)
  }

  return (
    <div
      className={`crack-repair ${dragging ? 'is-dragging' : ''}`}
      style={style}
      aria-live="polite"
    >
      {dragging && <div className="spackle-wash" aria-hidden="true" />}

      <div className="helpy-rescue crack-repair-card" role="dialog" aria-label="Helpy crack repair">
        <div className="helpy-rescue-bubble">
          <div className="helpy-rescue-avatar" aria-hidden="true">
            <span className="helpy-rescue-face">🤖</span>
          </div>
          <div className="helpy-rescue-body">
            <p className="helpy-rescue-name">Helpy</p>
            <p className="helpy-rescue-msg">
              Uh oh, looks like there&apos;s some cracks. Take this Spackle and seal them.
            </p>
            <div className="spackle-meter" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="spackle-brush"
        aria-label="Drag the paintbrush around the cracks for two seconds"
        title="Drag for 2 seconds"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={cancelDrag}
        onPointerCancel={cancelDrag}
        onLostPointerCapture={cancelDrag}
      >
        🖌️
      </button>
    </div>
  )
}
