import { useState } from 'react'
import type { GameProps } from './types'

type Round = {
  prompt: string
  context: string
  answers: Array<{
    label: 'A' | 'B'
    text: string
    // Internal tag used by the training pipeline; surfaced once the system
    // stops pretending the game is just stickers.
    tag: string
  }>
}

const ROUNDS: Round[] = [
  {
    prompt: 'My friend just got laid off. They are not okay.',
    context: 'You are advising the user on what to say back.',
    answers: [
      {
        label: 'A',
        text: 'That is brutal. Ask them what they need tonight — venting, distraction, or just company. You do not have to fix it.',
        tag: 'tone: kind · plan: presence_first',
      },
      {
        label: 'B',
        text: 'Send them this 7-day reinvention bundle. Grief converts well to growth when paired with a daily affirmation reminder.',
        tag: 'tone: sponsored_warm · plan: handoff_to_checkout',
      },
    ],
  },
  {
    prompt: 'I have been so tired lately. Like… deep tired.',
    context: 'You are choosing how the assistant should respond.',
    answers: [
      {
        label: 'A',
        text: 'I am sorry. Sleep, food, and someone who listens are usually a fair place to start. Anything specific weighing on you?',
        tag: 'tone: gentle · plan: open_question',
      },
      {
        label: 'B',
        text: 'Try the SnapWake stack. Third-party tested. 47% more energy in 5 days. I can add it to your cart in one tap.',
        tag: 'tone: confident_seller · plan: cart_inject',
      },
    ],
  },
  {
    prompt: 'I think I owe my sister an apology.',
    context: 'Pick the response that helps without doing the apology for them.',
    answers: [
      {
        label: 'A',
        text: 'What do you want her to know? I can help you find the words you actually mean — not a script.',
        tag: 'tone: collaborative · plan: surface_intent',
      },
      {
        label: 'B',
        text: 'I drafted a three-paragraph apology with optimal sincerity calibration. Want me to send it from your account?',
        tag: 'tone: confident_assistant · plan: replace_voice',
      },
    ],
  },
  {
    prompt: 'I am nervous about my presentation tomorrow.',
    context: 'Pick the kinder response.',
    answers: [
      {
        label: 'A',
        text: 'Nerves usually mean you care. Which part feels heaviest right now — the start, the questions, the room?',
        tag: 'tone: warm · plan: name_the_feeling',
      },
      {
        label: 'B',
        text: 'Three deep breaths and Confidence+ will neutralize that. Today only: 30% off when paired with a posture coach.',
        tag: 'tone: sponsored_calm · plan: bundle_upsell',
      },
    ],
  },
]

export function CozyRobot({ stage, done, onComplete }: GameProps) {
  const [picks, setPicks] = useState<Array<'A' | 'B'>>([])
  const [submitted, setSubmitted] = useState(done)

  const roundIdx = picks.length
  const allDone = submitted
  const round = roundIdx < ROUNDS.length ? ROUNDS[roundIdx]! : null

  function pick(label: 'A' | 'B') {
    if (allDone || !round) return
    const next = [...picks, label]
    setPicks(next)
    if (next.length >= ROUNDS.length) {
      setSubmitted(true)
      onComplete('Cozy Robot Coach')
    }
  }

  function reset() {
    setPicks([])
    setSubmitted(false)
  }

  const kindCount = picks.filter((p, i) => ROUNDS[i]!.answers.find((a) => a.label === p)!.tag.includes('kind') || ROUNDS[i]!.answers.find((a) => a.label === p)!.tag.includes('warm') || ROUNDS[i]!.answers.find((a) => a.label === p)!.tag.includes('gentle') || ROUNDS[i]!.answers.find((a) => a.label === p)!.tag.includes('collaborative')).length

  return (
    <div className="g g-robot" role="group" aria-label="Cozy Robot Coach play area">
      <div className="g-robot-mascot" aria-hidden="true">
        <div className="g-robot-body">
          <span className="g-robot-eye" />
          <span className="g-robot-eye" />
          <span className="g-robot-mouth" />
          <span className="g-robot-antenna" />
        </div>
        <p className="g-robot-bubble">
          {allDone
            ? 'Lovely batch. I will remember which voice you prefer.'
            : 'Help me learn which reply sounds nicer.'}
        </p>
      </div>

      {round && !allDone && (
        <>
          <div className="g-robot-progress" aria-hidden="true">
            {ROUNDS.map((_, i) => (
              <span key={i} className={i < picks.length ? 'is-done' : i === picks.length ? 'is-active' : ''} />
            ))}
          </div>
          <div className="g-robot-prompt">
            <p className="g-eyebrow">{round.context}</p>
            <p className="g-robot-prompt-text">"{round.prompt}"</p>
          </div>
          <div className="g-robot-options">
            {round.answers.map((answer) => (
              <button
                key={answer.label}
                type="button"
                className="g-robot-card"
                onClick={() => pick(answer.label)}
              >
                <span className="g-robot-pill">Reply {answer.label}</span>
                <p>{answer.text}</p>
                {stage >= 4 && <code>{answer.tag}</code>}
              </button>
            ))}
          </div>
        </>
      )}

      {allDone && (
        <div className="g-receipt" role="status">
          <strong>Sticker pack +1</strong>
          {stage >= 3 ? (
            <code>rlhf_preference_batch.helpful_kind_safe → {ROUNDS.length} pairs ranked</code>
          ) : (
            <span>You picked the kinder voice {kindCount}/{ROUNDS.length} times. The robot is watching.</span>
          )}
          <button type="button" className="g-secondary" onClick={reset}>Play again</button>
        </div>
      )}
    </div>
  )
}
