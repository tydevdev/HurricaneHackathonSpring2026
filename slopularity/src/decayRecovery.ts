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

export const DEV_RESCUE_QUESTION_COUNT = 3
export const DEV_RESCUE_DELAY_MIN_MS = 30_000
export const DEV_RESCUE_DELAY_MAX_MS = 60_000

export const devRescueQuestionPool: DevRescueQuestion[] = [
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
  {
    id: 'water-formula',
    prompt: 'What is the chemical formula for water?',
    choices: ['CO2', 'H2O', 'NaCl'],
    answerIndex: 1,
    patchNote: 'hydration loop verified',
  },
  {
    id: 'js-file-extension',
    prompt: 'Which file extension usually means JavaScript?',
    choices: ['.jpg', '.js', '.zip'],
    answerIndex: 1,
    patchNote: 'script loader calmed down',
  },
  {
    id: 'css-color',
    prompt: 'Which CSS property changes text color?',
    choices: ['color', 'font-shade', 'paint'],
    answerIndex: 0,
    patchNote: 'style cascade rebalanced',
  },
  {
    id: 'capital-france',
    prompt: 'What is the capital of France?',
    choices: ['Paris', 'Madrid', 'Rome'],
    answerIndex: 0,
    patchNote: 'geography shard reseated',
  },
  {
    id: 'largest-planet',
    prompt: 'Which planet is the largest in our solar system?',
    choices: ['Earth', 'Jupiter', 'Mercury'],
    answerIndex: 1,
    patchNote: 'orbit math stopped looping',
  },
  {
    id: 'keyboard-save',
    prompt: 'Which shortcut usually saves a document on Mac?',
    choices: ['Command-S', 'Command-Q', 'Command-Tab'],
    answerIndex: 0,
    patchNote: 'autosave panic dampened',
  },
  {
    id: 'binary-base',
    prompt: 'Binary numbers use which base?',
    choices: ['Base 2', 'Base 8', 'Base 10'],
    answerIndex: 0,
    patchNote: 'bit rot fenced',
  },
  {
    id: 'http-secure',
    prompt: 'Which URL prefix usually indicates a secure web connection?',
    choices: ['ftp://', 'https://', 'mailto:'],
    answerIndex: 1,
    patchNote: 'handshake replay closed',
  },
  {
    id: 'sun-star',
    prompt: 'What kind of object is the Sun?',
    choices: ['A planet', 'A star', 'A moon'],
    answerIndex: 1,
    patchNote: 'solar cache warmed',
  },
  {
    id: 'git-savepoint',
    prompt: 'In Git, what records a snapshot of changes?',
    choices: ['Commit', 'Toast', 'Widget'],
    answerIndex: 0,
    patchNote: 'commit graph unclenched',
  },
  {
    id: 'react-state',
    prompt: 'In React, which hook commonly stores component state?',
    choices: ['useState', 'usePaint', 'useFolder'],
    answerIndex: 0,
    patchNote: 'state island stabilized',
  },
  {
    id: 'photosynthesis',
    prompt: 'Plants mainly use which gas during photosynthesis?',
    choices: ['Oxygen', 'Carbon dioxide', 'Helium'],
    answerIndex: 1,
    patchNote: 'green channel restored',
  },
  {
    id: 'triangle-sides',
    prompt: 'How many sides does a triangle have?',
    choices: ['Three', 'Four', 'Five'],
    answerIndex: 0,
    patchNote: 'geometry snapped squarely',
  },
  {
    id: 'cpu-meaning',
    prompt: 'What does CPU stand for?',
    choices: ['Central Processing Unit', 'Color Pixel Utility', 'Cloud Password Unit'],
    answerIndex: 0,
    patchNote: 'processor fan slowed',
  },
  {
    id: 'earth-moon',
    prompt: 'What natural satellite orbits Earth?',
    choices: ['The Moon', 'Mars', 'Polaris'],
    answerIndex: 0,
    patchNote: 'satellite lock reacquired',
  },
  {
    id: 'email-symbol',
    prompt: 'Which symbol appears in most email addresses?',
    choices: ['#', '@', '&'],
    answerIndex: 1,
    patchNote: 'inbox parser uncurled',
  },
  {
    id: 'seconds-minute',
    prompt: 'How many seconds are in one minute?',
    choices: ['30', '60', '90'],
    answerIndex: 1,
    patchNote: 'timer drift bounded',
  },
  {
    id: 'json-brace',
    prompt: 'Which character usually starts a JSON object?',
    choices: ['{', '[', '<'],
    answerIndex: 0,
    patchNote: 'object parser exhaled',
  },
  {
    id: 'database-sql',
    prompt: 'SQL is commonly used to work with what?',
    choices: ['Databases', 'Headphones', 'Wallpaper'],
    answerIndex: 0,
    patchNote: 'query planner stopped sweating',
  },
  {
    id: 'browser-refresh',
    prompt: 'Which key often refreshes a browser page?',
    choices: ['F5', 'F12', 'Escape'],
    answerIndex: 0,
    patchNote: 'refresh storm contained',
  },
  {
    id: 'square-corners',
    prompt: 'How many corners does a square have?',
    choices: ['Three', 'Four', 'Six'],
    answerIndex: 1,
    patchNote: 'corner radius normalized',
  },
  {
    id: 'api-meaning',
    prompt: 'What does API stand for?',
    choices: ['Application Programming Interface', 'Auto Pixel Import', 'Applied Pasta Index'],
    answerIndex: 0,
    patchNote: 'integration seam sealed',
  },
  {
    id: 'earth-continent-count',
    prompt: 'How many continents are commonly taught on Earth?',
    choices: ['Five', 'Seven', 'Nine'],
    answerIndex: 1,
    patchNote: 'map layer flattened',
  },
  {
    id: 'html-link',
    prompt: 'Which HTML tag is commonly used for a link?',
    choices: ['<a>', '<linker>', '<go>'],
    answerIndex: 0,
    patchNote: 'anchor points restored',
  },
  {
    id: 'rgb-red',
    prompt: 'In RGB, what does the R stand for?',
    choices: ['Red', 'Radius', 'Render'],
    answerIndex: 0,
    patchNote: 'red channel stopped yelling',
  },
  {
    id: 'package-manager',
    prompt: 'Which command installs dependencies in many Node projects?',
    choices: ['npm install', 'npm sleep', 'node paint'],
    answerIndex: 0,
    patchNote: 'dependency fog thinned',
  },
  {
    id: 'accessibility-alt',
    prompt: 'Which attribute describes an image for screen readers?',
    choices: ['alt', 'srcset', 'paint'],
    answerIndex: 0,
    patchNote: 'assistive text relinked',
  },
]

export const devRescueQuestions = selectDevRescueQuestions(() => 0)

export function isDevRescueAvailable(stage: number) {
  return stage >= maxDecayStage
}

export function getDevRescueQuestion(step: number, questions: DevRescueQuestion[] = devRescueQuestions) {
  const index = Math.min(questions.length - 1, Math.max(0, step))
  return questions[index]!
}

export function nextDevRescueStep(
  step: number,
  choiceIndex: number,
  questions: DevRescueQuestion[] = devRescueQuestions,
): DevRescueStepResult {
  const question = getDevRescueQuestion(step, questions)
  if (choiceIndex !== question.answerIndex) {
    return { step, completed: false, correct: false }
  }

  const nextStep = Math.min(questions.length, step + 1)
  return {
    step: nextStep,
    completed: nextStep >= questions.length,
    correct: true,
  }
}

export function selectDevRescueQuestions(random: () => number = Math.random) {
  const shuffled = [...devRescueQuestionPool]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const current = shuffled[index]!
    shuffled[index] = shuffled[swapIndex]!
    shuffled[swapIndex] = current
  }

  return shuffled.slice(0, DEV_RESCUE_QUESTION_COUNT)
}

export function devRescueDelayMs(random: () => number = Math.random) {
  const range = DEV_RESCUE_DELAY_MAX_MS - DEV_RESCUE_DELAY_MIN_MS
  const normalized = Math.max(0, Math.min(1, random()))
  return DEV_RESCUE_DELAY_MIN_MS + Math.min(range, Math.floor(normalized * (range + 1)))
}

export function recoveryScore() {
  return scoreForStage(1)
}
