export type MissionDifficulty = 'quick' | 'steady' | 'stretch'

export type DailyMission = {
  id: string
  title: string
  prompt: string
  reward: string
  estimatedMinutes: number
  difficulty: MissionDifficulty
  category: 'attention' | 'movement' | 'creative' | 'social' | 'learning'
  steps: string[]
}

export type ModePreset = {
  id: string
  name: string
  tagline: string
  sessionMinutes: number
  postLimit: number
  vibe: 'calm' | 'curious' | 'focused' | 'active'
  includedCategories: string[]
  breakRule: string
  defaultMissionId: string
}

export type Achievement = {
  id: string
  name: string
  description: string
  unlockHint: string
  badge: string
  points: number
  tier: 'bronze' | 'silver' | 'gold' | 'secret'
}

export type ReflectionPrompt = {
  id: string
  title: string
  prompt: string
  followUp: string
  mood: 'reset' | 'proud' | 'curious' | 'honest' | 'energized'
  suggestedMinutes: number
}

export type OfflineQuest = {
  id: string
  title: string
  setup: string
  winCondition: string
  estimatedMinutes: number
  supplies: string[]
  goodFor: string[]
}

export const dailyMissions: DailyMission[] = [
  {
    id: 'mission-three-tab-rescue',
    title: 'Three-Tab Rescue',
    prompt: 'Close or save three tabs that are quietly asking for rent.',
    reward: '+20 focus',
    estimatedMinutes: 4,
    difficulty: 'quick',
    category: 'attention',
    steps: [
      'Pick the three least useful open tabs.',
      'Bookmark anything you truly need later.',
      'Close the rest and take one full breath before scrolling again.',
    ],
  },
  {
    id: 'mission-pocket-walk',
    title: 'Pocket Walk',
    prompt: 'Put your phone away and walk until you notice five specific details.',
    reward: '+35 presence',
    estimatedMinutes: 7,
    difficulty: 'steady',
    category: 'movement',
    steps: [
      'Start a short walk without headphones.',
      'Notice one color, one sound, one smell, one texture, and one tiny motion.',
      'Come back and name the detail you would have missed while scrolling.',
    ],
  },
  {
    id: 'mission-one-line-maker',
    title: 'One-Line Maker',
    prompt: 'Make one sentence, sketch, riff, recipe idea, or tiny plan from the last post.',
    reward: '+25 spark',
    estimatedMinutes: 5,
    difficulty: 'quick',
    category: 'creative',
    steps: [
      'Choose any detail from the post you just read.',
      'Turn it into one original line or doodle.',
      'Stop while it is still tiny.',
    ],
  },
  {
    id: 'mission-two-minute-checkin',
    title: 'Two-Minute Check-In',
    prompt: 'Send a low-pressure message to someone you like but have not checked on lately.',
    reward: '+30 connection',
    estimatedMinutes: 2,
    difficulty: 'quick',
    category: 'social',
    steps: [
      'Pick one person.',
      'Send a message that does not require homework to answer.',
      'Leave the thread after sending instead of waiting for the reply.',
    ],
  },
  {
    id: 'mission-explain-it-badly',
    title: 'Explain It Badly',
    prompt: 'Explain something you learned today using only plain words and one messy metaphor.',
    reward: '+40 recall',
    estimatedMinutes: 6,
    difficulty: 'steady',
    category: 'learning',
    steps: [
      'Choose one concept from the feed.',
      'Explain it out loud like you are talking to a sleepy friend.',
      'Keep the useful metaphor and throw away the rest.',
    ],
  },
  {
    id: 'mission-desk-weather',
    title: 'Desk Weather Report',
    prompt: 'Reset one surface so it feels easier to start the next thing.',
    reward: '+30 momentum',
    estimatedMinutes: 8,
    difficulty: 'steady',
    category: 'attention',
    steps: [
      'Choose the smallest visible surface near you.',
      'Remove trash, cups, and anything that belongs in another room.',
      'Place the next task object in the center.',
    ],
  },
  {
    id: 'mission-slow-scroll-autopsy',
    title: 'Slow Scroll Autopsy',
    prompt: 'Catch the exact moment scrolling stopped being fun and became automatic.',
    reward: '+50 self-read',
    estimatedMinutes: 10,
    difficulty: 'stretch',
    category: 'attention',
    steps: [
      'Think back to the last scroll spiral.',
      'Name the trigger: boredom, avoidance, curiosity, loneliness, or fatigue.',
      'Write the replacement move you want next time.',
    ],
  },
  {
    id: 'mission-room-remix',
    title: 'Room Remix',
    prompt: 'Move one object to make your room better for the next hour.',
    reward: '+25 environment',
    estimatedMinutes: 3,
    difficulty: 'quick',
    category: 'movement',
    steps: [
      'Look for one object that is in the wrong place.',
      'Move it where future-you would expect it.',
      'Notice whether the room feels even one percent clearer.',
    ],
  },
]

export const modePresets: ModePreset[] = [
  {
    id: 'mode-morning-primer',
    name: 'Morning Primer',
    tagline: 'A short queue before the internet gets loud.',
    sessionMinutes: 8,
    postLimit: 5,
    vibe: 'curious',
    includedCategories: ['space', 'history', 'nature', 'creativity'],
    breakRule: 'Stop after five posts or one saved idea.',
    defaultMissionId: 'mission-one-line-maker',
  },
  {
    id: 'mode-focus-lock',
    name: 'Focus Lock',
    tagline: 'Tight, useful, and done before the drift starts.',
    sessionMinutes: 12,
    postLimit: 6,
    vibe: 'focused',
    includedCategories: ['attention', 'coding', 'finance', 'ai'],
    breakRule: 'Pause after every two posts for one next-action note.',
    defaultMissionId: 'mission-three-tab-rescue',
  },
  {
    id: 'mode-soft-reset',
    name: 'Soft Reset',
    tagline: 'Low-friction posts for a calmer nervous system.',
    sessionMinutes: 10,
    postLimit: 4,
    vibe: 'calm',
    includedCategories: ['health', 'nature', 'psychology', 'music-theory'],
    breakRule: 'End with one offline action, even if the feed still has more.',
    defaultMissionId: 'mission-pocket-walk',
  },
  {
    id: 'mode-spark-run',
    name: 'Spark Run',
    tagline: 'Tiny facts that turn into tiny things.',
    sessionMinutes: 15,
    postLimit: 7,
    vibe: 'active',
    includedCategories: ['creativity', 'music-theory', 'sports-physics', 'coding'],
    breakRule: 'Every third post must produce a sketch, line, or experiment.',
    defaultMissionId: 'mission-explain-it-badly',
  },
  {
    id: 'mode-night-landing',
    name: 'Night Landing',
    tagline: 'A finite scroll with a clean exit ramp.',
    sessionMinutes: 6,
    postLimit: 3,
    vibe: 'calm',
    includedCategories: ['history', 'space', 'psychology', 'health'],
    breakRule: 'No quizzes after the final post; go straight to reflection.',
    defaultMissionId: 'mission-desk-weather',
  },
]

export const achievements: Achievement[] = [
  {
    id: 'achievement-first-clean-break',
    name: 'Clean Break',
    description: 'Finished a feed session without reopening it immediately.',
    unlockHint: 'Complete any mode and stay out for five minutes.',
    badge: 'open-door',
    points: 50,
    tier: 'bronze',
  },
  {
    id: 'achievement-tab-whisperer',
    name: 'Tab Whisperer',
    description: 'Closed ten lingering tabs across ScrollBreak missions.',
    unlockHint: 'Run Three-Tab Rescue a few times.',
    badge: 'stack-minus',
    points: 75,
    tier: 'silver',
  },
  {
    id: 'achievement-pocket-orbit',
    name: 'Pocket Orbit',
    description: 'Completed three phone-away walks in one week.',
    unlockHint: 'Take Pocket Walk outside more than once.',
    badge: 'orbit',
    points: 100,
    tier: 'silver',
  },
  {
    id: 'achievement-micro-maker',
    name: 'Micro Maker',
    description: 'Turned five posts into original notes, sketches, or ideas.',
    unlockHint: 'Use One-Line Maker after creative or science posts.',
    badge: 'spark',
    points: 125,
    tier: 'gold',
  },
  {
    id: 'achievement-scroll-sommelier',
    name: 'Scroll Sommelier',
    description: 'Used every mode preset at least once.',
    unlockHint: 'Try each mode when your energy changes.',
    badge: 'tasting-menu',
    points: 150,
    tier: 'gold',
  },
  {
    id: 'achievement-quiet-exit',
    name: 'Quiet Exit',
    description: 'Left on the first ending prompt three sessions in a row.',
    unlockHint: 'Trust the stop screen before your thumb negotiates.',
    badge: 'moon-door',
    points: 200,
    tier: 'secret',
  },
]

export const reflectionPrompts: ReflectionPrompt[] = [
  {
    id: 'reflection-why-now',
    title: 'Why now?',
    prompt: 'What were you hoping scrolling would change about this moment?',
    followUp: 'What is one smaller action that could actually change it?',
    mood: 'honest',
    suggestedMinutes: 2,
  },
  {
    id: 'reflection-one-keeper',
    title: 'One keeper',
    prompt: 'What is the single fact, phrase, or idea worth carrying out of this session?',
    followUp: 'Where could it live so you see it again?',
    mood: 'curious',
    suggestedMinutes: 1,
  },
  {
    id: 'reflection-body-signal',
    title: 'Body signal',
    prompt: 'What did your body ask for before your thumb opened the feed?',
    followUp: 'Would water, food, movement, rest, or a message help more?',
    mood: 'reset',
    suggestedMinutes: 2,
  },
  {
    id: 'reflection-proud-stop',
    title: 'Proud stop',
    prompt: 'What made this a better stopping point than your usual one?',
    followUp: 'How can tomorrow-you make this exit easier to repeat?',
    mood: 'proud',
    suggestedMinutes: 2,
  },
  {
    id: 'reflection-next-true-thing',
    title: 'Next true thing',
    prompt: 'What is the next real-world thing that deserves your attention?',
    followUp: 'Make it small enough to start in under sixty seconds.',
    mood: 'energized',
    suggestedMinutes: 1,
  },
]

export const offlineQuests: OfflineQuest[] = [
  {
    id: 'quest-receipt-poem',
    title: 'Receipt Poem',
    setup: 'Find any scrap of paper and write a five-line poem using only objects you can see.',
    winCondition: 'One line has to surprise you a little.',
    estimatedMinutes: 6,
    supplies: ['paper', 'pen'],
    goodFor: ['creative block', 'waiting rooms', 'low energy'],
  },
  {
    id: 'quest-shelf-archaeology',
    title: 'Shelf Archaeology',
    setup: 'Choose one shelf, drawer, or bag pocket and identify the oldest forgotten object.',
    winCondition: 'Decide whether it gets used, stored properly, or leaves.',
    estimatedMinutes: 9,
    supplies: ['one cluttered spot'],
    goodFor: ['resetting a room', 'decision fatigue', 'tiny momentum'],
  },
  {
    id: 'quest-window-field-notes',
    title: 'Window Field Notes',
    setup: 'Look out one window for three minutes and record what changes.',
    winCondition: 'Catch at least one motion you would normally miss.',
    estimatedMinutes: 4,
    supplies: ['window', 'timer'],
    goodFor: ['restlessness', 'mental noise', 'between tasks'],
  },
  {
    id: 'quest-kindness-speedrun',
    title: 'Kindness Speedrun',
    setup: 'Do one useful thing for someone nearby without making it a whole production.',
    winCondition: 'The action takes less time than opening another app.',
    estimatedMinutes: 5,
    supplies: ['attention'],
    goodFor: ['social energy', 'stale mood', 'home resets'],
  },
  {
    id: 'quest-sound-map',
    title: 'Sound Map',
    setup: 'Sit still and map the sounds around you from nearest to farthest.',
    winCondition: 'Name five layers without checking your phone.',
    estimatedMinutes: 3,
    supplies: ['quiet enough room'],
    goodFor: ['anxiety', 'transition time', 'night mode'],
  },
]
