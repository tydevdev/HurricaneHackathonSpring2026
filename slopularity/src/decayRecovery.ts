import { maxDecayStage, scoreForStage } from './utils.ts'

export type DevRescueQuestion = {
  id: string
  prompt: string
  choices: [string, string, string]
  answerIndex: number
  patchNote: string
}

export type DevRescueStepResult = {
  step: number
  completed: boolean
  correct: boolean
}

export const devRescueQuestions: DevRescueQuestion[] = [
  {
    id: 'red-planet',
    prompt: 'Which planet is known as the Red Planet?',
    choices: ['Venus', 'Mars', 'Jupiter'],
    answerIndex: 1,
    patchNote: 'crack renderer paused',
  },
  {
    id: 'html',
    prompt: 'What does HTML stand for?',
    choices: ['HyperText Markup Language', 'Home Tool Markup Loop', 'Human Text Machine Logic'],
    answerIndex: 0,
    patchNote: 'layout thread reattached',
  },
  {
    id: 'largest-ocean',
    prompt: 'Which ocean is the largest?',
    choices: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean'],
    answerIndex: 2,
    patchNote: 'phase lock restored',
  },
]

export function isDevRescueAvailable(stage: number) {
  return stage >= maxDecayStage
}

export function getDevRescueQuestion(step: number) {
  const index = Math.min(devRescueQuestions.length - 1, Math.max(0, step))
  return devRescueQuestions[index]!
}

export function nextDevRescueStep(step: number, choiceIndex: number): DevRescueStepResult {
  const question = getDevRescueQuestion(step)
  if (choiceIndex !== question.answerIndex) {
    return { step, completed: false, correct: false }
  }

  const nextStep = Math.min(devRescueQuestions.length, step + 1)
  return {
    step: nextStep,
    completed: nextStep >= devRescueQuestions.length,
    correct: true,
  }
}

export function recoveryScore() {
  return scoreForStage(1)
}
