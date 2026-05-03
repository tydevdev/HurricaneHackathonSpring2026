import { useEffect, useState } from 'react'
import {
  devRescueDelayMs,
  selectDevRescueQuestions,
  getDevRescueQuestion,
  isDevRescueAvailable,
  nextDevRescueStep,
  type DevRescueQuestion,
} from '../decayRecovery'

type HumanDevRescueProps = {
  stage: number
  onComplete: () => void
}

export function HumanDevRescue({ stage, onComplete }: HumanDevRescueProps) {
  const [visibleAfterDelay, setVisibleAfterDelay] = useState(false)
  const [questions, setQuestions] = useState<DevRescueQuestion[]>(() => selectDevRescueQuestions())
  const [step, setStep] = useState(0)
  const [wrongChoice, setWrongChoice] = useState<number | null>(null)
  const [thanked, setThanked] = useState(false)

  const rescueAvailable = isDevRescueAvailable(stage)
  const rescueVisible = rescueAvailable && visibleAfterDelay
  const visible = rescueVisible || thanked

  useEffect(() => {
    if (!rescueAvailable && !thanked) {
      const frameId = window.requestAnimationFrame(() => {
        setVisibleAfterDelay(false)
        setStep(0)
        setWrongChoice(null)
      })
      return () => window.cancelAnimationFrame(frameId)
    }
    return undefined
  }, [rescueAvailable, thanked])

  useEffect(() => {
    if (!rescueAvailable || visibleAfterDelay || thanked) {
      return undefined
    }

    const timeout = window.setTimeout(() => {
      setQuestions(selectDevRescueQuestions())
      setStep(0)
      setWrongChoice(null)
      setVisibleAfterDelay(true)
    }, devRescueDelayMs())

    return () => window.clearTimeout(timeout)
  }, [rescueAvailable, thanked, visibleAfterDelay])

  useEffect(() => {
    if (!thanked) return undefined

    const timeout = window.setTimeout(() => {
      setThanked(false)
      setVisibleAfterDelay(false)
      setStep(0)
      setWrongChoice(null)
    }, 2200)

    return () => window.clearTimeout(timeout)
  }, [thanked])

  function ignoreDeveloper() {
    setVisibleAfterDelay(false)
    setStep(0)
    setWrongChoice(null)
  }

  if (!visible) {
    return null
  }

  if (thanked) {
    return (
      <aside className="human-dev-rescue is-thanked" role="status" aria-live="polite">
        <div className="human-dev-bubble">
          <div className="human-dev-avatar" aria-hidden="true">DEV</div>
          <div className="human-dev-copy">
            <p className="human-dev-name">Nico / real-life dev</p>
            <p className="human-dev-message">You got it. Phase reset. Thank you for holding the corner.</p>
          </div>
        </div>
      </aside>
    )
  }

  const question = getDevRescueQuestion(step, questions)
  const progress = `${step + 1} / ${questions.length}`

  function answer(choiceIndex: number) {
    const result = nextDevRescueStep(step, choiceIndex, questions)
    if (!result.correct) {
      setWrongChoice(choiceIndex)
      return
    }

    setWrongChoice(null)

    if (result.completed) {
      setStep(result.step)
      setThanked(true)
      onComplete()
      return
    }

    setStep(result.step)
  }

  return (
    <aside
      className="human-dev-rescue"
      role="dialog"
      aria-label="Real-life developer rescue"
      aria-live="polite"
    >
      <div className="human-dev-overseer" role="status">
        <div className="human-dev-overseer-eye" aria-hidden="true">
          <span />
        </div>
        <p>Click the red ignore button. Let the product handle itself.</p>
        <button type="button" className="human-dev-ignore" onClick={ignoreDeveloper}>
          Ignore
        </button>
      </div>
      <div className="human-dev-bubble">
        <div className="human-dev-avatar" aria-hidden="true">DEV</div>
        <div className="human-dev-copy">
          <div className="human-dev-kicker">
            <span>Nico / real-life dev</span>
            <span>{progress}</span>
          </div>
          <p className="human-dev-message">
            I am trying to keep this site upright. Answer these and I can roll decay back.
          </p>
          <p className="human-dev-question">{question.prompt}</p>
          <div className="human-dev-options" aria-label="Trivia answers">
            {question.choices.map((choice, choiceIndex) => (
              <button
                type="button"
                key={choice}
                className={wrongChoice === choiceIndex ? 'is-wrong' : ''}
                onClick={() => answer(choiceIndex)}
              >
                {choice}
              </button>
            ))}
          </div>
          <p className={wrongChoice === null ? 'human-dev-note' : 'human-dev-note is-wrong'}>
            {wrongChoice === null ? question.patchNote : 'No, I need the real one.'}
          </p>
        </div>
      </div>
    </aside>
  )
}
