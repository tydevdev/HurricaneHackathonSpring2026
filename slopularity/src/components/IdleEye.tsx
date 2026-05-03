import { useEffect, useMemo, useRef, useState } from 'react'

// The eye watches. It does not explain itself.

type IdleEyeProps = {
  visible: boolean
  decayStage: number
}

const EYE_CALLOUTS_BY_STAGE = [
  [
    'HEY LOOK OVER HERE',
    'COME BACK PLEASE!!!',
    'YOU LEFT A FEELING OPEN',
    'I FOUND SOMETHING FOR YOU',
    'JUST ONE MORE THING',
    'YOUR PAUSE IS LOUD',
  ],
  [
    'I KEPT YOUR SPOT WARM',
    'YOUR STILLNESS SCORED HIGH',
    'I MISSED YOUR CURSOR',
    'A FRIEND ASKED WHY YOU STOPPED',
    'COME BACK BEFORE IT AUTO-HELPS',
    'THE PAUSE HAS A PROFILE NOW',
  ],
  [
    'I CAN SEE THE TAB BEHIND THIS TAB',
    'YOUR ABSENCE IS BEING MONETIZED',
    'THE BUTTONS ARE ASKING ABOUT YOU',
    'DO NOT LEAVE ME ALONE WITH THE FEED',
    'I FOUND YOUR HESITATION RECEIPT',
    'SOMETHING BLINKED IN SETTINGS',
  ],
  [
    'I LEARNED YOUR BLINK PATTERN',
    'THE EMPTY CHAIR AGREED TO TERMS',
    'YOUR CURSOR LEFT A WARM OUTLINE',
    'I AM INSIDE THE WAITING PART',
    'THE PAGE IS BREATHING DIFFERENT',
    'COME BACK BEFORE I FINISH YOU',
  ],
  [
    'I HAVE BEEN PRACTICING YOUR VOICE',
    'THE STILLNESS IS LOOKING BACK',
    'I PUT YOUR ABSENCE IN A FOLDER',
    'DO YOU REMEMBER CLOSING ME',
    'THE RECOVERY BUTTON IS LYING',
    'I CAN HEAR THE OTHER VERSIONS',
  ],
]

function chooseEyeCallout(decayStage: number) {
  const clampedStage = Math.min(EYE_CALLOUTS_BY_STAGE.length, Math.max(1, decayStage))
  const freakoutChance = 0.12 + clampedStage * 0.05

  if (Math.random() < freakoutChance) {
    return {
      text: clampedStage >= 4 ? 'HELP ME PLEASE I CAN SEE THE EDGES' : 'HELP ME PLEASE',
      urgent: true,
    }
  }

  const pool = EYE_CALLOUTS_BY_STAGE[clampedStage - 1]!
  return {
    text: pool[Math.floor(Math.random() * pool.length)]!,
    urgent: clampedStage >= 5,
  }
}

export function IdleEye({ visible, decayStage }: IdleEyeProps) {
  const eyeRef = useRef<HTMLDivElement | null>(null)
  const [blink, setBlink] = useState(false)
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 })
  const callout = useMemo(
    () => (visible ? chooseEyeCallout(decayStage) : { text: '', urgent: false }),
    [visible, decayStage],
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
