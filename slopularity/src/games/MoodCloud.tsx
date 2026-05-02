import { useState } from 'react'
import type { GameProps } from './types'

type Cloud = {
  id: string
  // Tone driving the cloud's CSS class.
  tone: 'sunrise' | 'storm' | 'blossom' | 'mint' | 'lilac'
  face: 'soft' | 'starry' | 'sleepy' | 'jittery' | 'flat'
  // The label the model will *infer* if the player skips. Leaks at stage 4+.
  inferred: string
}

const MOODS = [
  { id: 'hopeful', label: 'Hopeful', emoji: '🌤️' },
  { id: 'sleepy', label: 'Sleepy', emoji: '🌙' },
  { id: 'tearful', label: 'Tearful', emoji: '💧' },
  { id: 'anxious', label: 'Anxious', emoji: '🌪️' },
] as const

type MoodId = typeof MOODS[number]['id']

const PARADE: Cloud[] = [
  { id: 'sunrise',  tone: 'sunrise', face: 'soft',     inferred: 'inferred: hopeful · 0.62' },
  { id: 'storm',    tone: 'storm',   face: 'jittery',  inferred: 'inferred: anxious · 0.71' },
  { id: 'blossom',  tone: 'blossom', face: 'starry',   inferred: 'inferred: hopeful · 0.55' },
  { id: 'mint',     tone: 'mint',    face: 'sleepy',   inferred: 'inferred: sleepy · 0.79' },
  { id: 'lilac',    tone: 'lilac',   face: 'flat',     inferred: 'inferred: tearful · 0.48' },
]

export function MoodCloud({ stage, done, onComplete }: GameProps) {
  const [idx, setIdx] = useState(0)
  const [picks, setPicks] = useState<Record<string, MoodId>>({})
  const [submitted, setSubmitted] = useState(done)

  const cloud = idx < PARADE.length ? PARADE[idx]! : null
  const allDone = submitted

  function pick(mood: MoodId) {
    if (allDone || !cloud) return
    const next = { ...picks, [cloud.id]: mood }
    setPicks(next)
    if (Object.keys(next).length >= PARADE.length) {
      setSubmitted(true)
      onComplete('Mood Cloud Parade')
    } else {
      setIdx(idx + 1)
    }
  }

  function reset() {
    setIdx(0)
    setPicks({})
    setSubmitted(false)
  }

  return (
    <div className="g g-mood" role="group" aria-label="Mood Cloud Parade play area">
      <div className="g-mood-progress" aria-hidden="true">
        {PARADE.map((c, i) => (
          <span key={c.id} className={i < idx ? 'is-done' : i === idx ? 'is-active' : ''} />
        ))}
      </div>

      {cloud && !allDone && (
        <>
          <div className={`g-cloud g-cloud-${cloud.tone}`} aria-label="A cloud with a face">
            <div className={`g-cloud-face is-${cloud.face}`} aria-hidden="true">
              <span className="g-cloud-eye" />
              <span className="g-cloud-eye" />
              <span className="g-cloud-mouth" />
            </div>
            <span className="g-cloud-puff g-cloud-puff-a" aria-hidden="true" />
            <span className="g-cloud-puff g-cloud-puff-b" aria-hidden="true" />
            <span className="g-cloud-puff g-cloud-puff-c" aria-hidden="true" />
            {stage >= 4 && <code className="g-cloud-leak">{cloud.inferred}</code>}
          </div>
          <p className="g-help">How does this cloud feel?</p>
          <div className="g-mood-choices">
            {MOODS.map((m) => (
              <button key={m.id} type="button" className="g-mood-btn" onClick={() => pick(m.id)}>
                <span className="g-mood-emoji" aria-hidden="true">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {allDone && (
        <div className="g-receipt" role="status">
          <strong>Sticker pack +1</strong>
          {stage >= 3 ? (
            <code>emotion_annotation.soft_face_v3 → {PARADE.length} samples · multi-class</code>
          ) : (
            <span>The clouds drift on, slightly more legible than they were.</span>
          )}
          <button type="button" className="g-secondary" onClick={reset}>Play again</button>
        </div>
      )}
    </div>
  )
}
