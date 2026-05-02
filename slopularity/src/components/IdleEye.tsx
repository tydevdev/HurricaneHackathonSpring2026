import { useEffect, useMemo, useRef, useState } from 'react'

// The eye watches. It does not explain itself.

type IdleEyeProps = {
  visible: boolean
}

const EYE_CALLOUTS = [
  'HEY LOOK OVER HERE',
  'COME BACK PLEASE!!!',
  'YOU LEFT A FEELING OPEN',
  'I FOUND SOMETHING FOR YOU',
  'JUST ONE MORE THING',
  'YOUR PAUSE IS LOUD',
]

function chooseEyeCallout() {
  if (Math.random() < 0.2) {
    return { text: 'HELP ME PLEASE', urgent: true }
  }

  return {
    text: EYE_CALLOUTS[Math.floor(Math.random() * EYE_CALLOUTS.length)]!,
    urgent: false,
  }
}

export function IdleEye({ visible }: IdleEyeProps) {
  const eyeRef = useRef<HTMLDivElement | null>(null)
  const [blink, setBlink] = useState(false)
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 })
  const callout = useMemo(
    () => (visible ? chooseEyeCallout() : { text: '', urgent: false }),
    [visible],
  )

  // Blink every 3 seconds.
  useEffect(() => {
    if (!visible) return
    const id = window.setInterval(() => {
      setBlink(true)
      window.setTimeout(() => setBlink(false), 180)
    }, 3000)
    return () => window.clearInterval(id)
  }, [visible])

  // Follow cursor with a subtle lag.
  useEffect(() => {
    if (!visible) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    function handleMove(e: MouseEvent) {
      if (!eyeRef.current) return
      const rect = eyeRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxShift = 14
      const scale = Math.min(1, dist / 300)
      setPupilOffset({
        x: (dx / (dist || 1)) * maxShift * scale,
        y: (dy / (dist || 1)) * maxShift * scale,
      })
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={`idle-eye ${blink ? 'idle-eye-blink' : ''}`}
      ref={eyeRef}
      aria-hidden="true"
    >
      <div className="idle-eye-white">
        <div
          className="idle-eye-pupil"
          style={{
            transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
          }}
        />
      </div>
      <div className={`idle-eye-callout ${callout.urgent ? 'is-urgent' : ''}`}>
        {callout.text}
      </div>
    </div>
  )
}
