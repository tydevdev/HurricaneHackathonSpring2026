export type PostFormat =
  | 'info'
  | 'article'
  | 'quiz'
  | 'myth-fact'
  | 'spot-fake'
  | 'cta'
  | 'word-game'

export type ContentCategory =
  | 'space'
  | 'psychology'
  | 'sports-physics'
  | 'music-theory'
  | 'ai'
  | 'health'
  | 'creativity'
  | 'history'
  | 'nature'
  | 'finance'
  | 'coding'
  | 'attention'

export type QuizOption = {
  id: string
  label: string
}

export type QuizMetadata = {
  question: string
  options: QuizOption[]
  answerId: string
  explanation: string
}

export type MythFactMetadata = {
  myth: string
  fact: string
}

export type SpotFakeMetadata = {
  prompt: string
  suspectIds: string[]
  explanation: string
}

export type CtaMetadata = {
  action: string
  estimatedMinutes: number
}

export type WordGameMetadata = {
  letters?: string
  clue: string
  answer: string
}

export type ScrollBreakPost = {
  id: string
  format: PostFormat
  category: ContentCategory
  title: string
  deck: string
  body: string
  image: string
  readSeconds: number
  energy: 'calm' | 'curious' | 'active' | 'focused'
  tags: string[]
  sourceHint?: string
  quiz?: QuizMetadata
  mythFact?: MythFactMetadata
  spotFake?: SpotFakeMetadata
  cta?: CtaMetadata
  wordGame?: WordGameMetadata
}

export const finiteFeedSettings = {
  dailyPostLimit: 12,
  breakAfterPosts: 4,
  resetCopy: 'You finished the good stuff for now.',
  restartCopy: 'Come back when your brain has had a sip of air.',
}

export const contentLibrary: ScrollBreakPost[] = [
  {
    id: 'post-01',
    format: 'info',
    category: 'space',
    title: 'The Moon Is Leaving Very Slowly',
    deck: 'About one fingernail-width farther away each year.',
    body:
      'Laser reflectors left by Apollo astronauts show the Moon is drifting from Earth at about 3.8 centimeters per year. The cause is tidal friction: Earth spins a little faster than the Moon orbits, and that exchange nudges the Moon outward.',
    image: '/assets/posts/post-01.png',
    readSeconds: 35,
    energy: 'curious',
    tags: ['moon', 'gravity', 'apollo'],
    sourceHint: 'NASA lunar laser ranging summaries',
  },
  {
    id: 'post-02',
    format: 'quiz',
    category: 'psychology',
    title: 'The Zeigarnik Tug',
    deck: 'Unfinished tasks take up mental space for a reason.',
    body:
      'Psychologist Bluma Zeigarnik found that interrupted tasks can remain more mentally available than completed ones. A tiny written next step often calms the loop because your brain has a trusted place to resume.',
    image: '/assets/posts/post-02.png',
    readSeconds: 40,
    energy: 'focused',
    tags: ['memory', 'tasks', 'focus'],
    quiz: {
      question: 'What usually helps an unfinished task stop looping in your head?',
      options: [
        { id: 'a', label: 'Write the next concrete step' },
        { id: 'b', label: 'Keep repeating it silently' },
        { id: 'c', label: 'Open three more tabs about it' },
      ],
      answerId: 'a',
      explanation:
        'A written next action gives the brain a restart point, which can reduce the feeling that it has to keep rehearsing the task.',
    },
  },
  {
    id: 'post-03',
    format: 'article',
    category: 'sports-physics',
    title: 'Why Curveballs Actually Curve',
    deck: 'Spin changes the pressure around the ball.',
    body:
      'A spinning baseball drags a thin layer of air around with it. One side meets oncoming air faster than the other, creating a pressure difference that bends the path. That sideways force is the Magnus effect.',
    image: '/assets/posts/post-03.png',
    readSeconds: 45,
    energy: 'curious',
    tags: ['baseball', 'magnus-effect', 'spin'],
  },
  {
    id: 'post-04',
    format: 'word-game',
    category: 'music-theory',
    title: 'Chord Decoder',
    deck: 'Three notes can imply a whole mood.',
    body:
      'A major triad is built from a root, a major third, and a perfect fifth. Change the third from major to minor and the emotional color shifts immediately, even before rhythm or lyrics arrive.',
    image: '/assets/posts/post-04.png',
    readSeconds: 35,
    energy: 'focused',
    tags: ['chords', 'harmony', 'ear-training'],
    wordGame: {
      letters: 'ACE',
      clue: 'These notes spell a simple minor triad.',
      answer: 'A minor',
    },
  },
  {
    id: 'post-05',
    format: 'spot-fake',
    category: 'ai',
    title: 'Spot The Bot Tell',
    deck: 'AI text often sounds confident before it sounds grounded.',
    body:
      'A useful way to inspect generated text is to ask: does it include checkable specifics, or does it float on polished generalities? Smoothness is not the same as evidence.',
    image: '/assets/posts/post-05.png',
    readSeconds: 42,
    energy: 'focused',
    tags: ['ai-literacy', 'media', 'verification'],
    spotFake: {
      prompt: 'Which claim is the weakest without a source?',
      suspectIds: ['c'],
      explanation:
        'Broad claims like "studies prove" need names, dates, methods, or links before they deserve trust.',
    },
    quiz: {
      question: 'Which phrase should trigger a source check?',
      options: [
        { id: 'a', label: 'A 2023 trial of 84 people found...' },
        { id: 'b', label: 'The paper reports a 12 percent difference' },
        { id: 'c', label: 'Experts universally agree this always works' },
      ],
      answerId: 'c',
      explanation:
        'Absolute language plus no details is a classic signal to slow down and verify.',
    },
  },
  {
    id: 'post-06',
    format: 'myth-fact',
    category: 'health',
    title: 'Hydration Is Not A Vibe Check',
    deck: 'Thirst, food, weather, and effort all matter.',
    body:
      'The old eight-glasses rule is a rough cultural shortcut, not a personal prescription. Fluid needs vary with body size, activity, diet, heat, and illness.',
    image: '/assets/posts/post-06.png',
    readSeconds: 34,
    energy: 'calm',
    tags: ['hydration', 'wellness', 'body-signals'],
    mythFact: {
      myth: 'Everyone needs exactly eight glasses of water every day.',
      fact: 'Most people can use thirst, urine color, activity, heat, and food intake as practical signals.',
    },
  },
  {
    id: 'post-07',
    format: 'cta',
    category: 'creativity',
    title: 'Steal Like A Scientist',
    deck: 'Borrow a structure, not a surface.',
    body:
      'Pick something you like and identify the skeleton: contrast, timing, constraint, reveal, repetition. Then make a new piece with the same skeleton and different material.',
    image: '/assets/posts/post-07.png',
    readSeconds: 38,
    energy: 'active',
    tags: ['creative-practice', 'constraints', 'making'],
    cta: {
      action: 'Choose one object nearby and redesign it for a different decade.',
      estimatedMinutes: 3,
    },
  },
  {
    id: 'post-08',
    format: 'article',
    category: 'history',
    title: 'The Year Without A Summer',
    deck: 'A volcano changed weather, harvests, and literature.',
    body:
      'In 1815, Mount Tambora erupted in Indonesia. The following year brought cold, crop failures, and strange skies across parts of the Northern Hemisphere. During that gloomy summer, Mary Shelley began writing Frankenstein.',
    image: '/assets/posts/post-08.png',
    readSeconds: 48,
    energy: 'curious',
    tags: ['tambora', 'climate', 'literature'],
  },
  {
    id: 'post-09',
    format: 'info',
    category: 'nature',
    title: 'Trees Trade Through Fungi',
    deck: 'Forest roots are less lonely than they look.',
    body:
      'Mycorrhizal fungi connect with plant roots and exchange mineral nutrients for sugars. Some networks can move chemical signals and resources, though the internet-of-trees metaphor is usually stronger than the evidence.',
    image: '/assets/posts/post-09.png',
    readSeconds: 43,
    energy: 'calm',
    tags: ['fungi', 'forests', 'ecology'],
  },
  {
    id: 'post-10',
    format: 'quiz',
    category: 'finance',
    title: 'Compound Interest Has A Tempo',
    deck: 'The quiet variable is time.',
    body:
      'Compounding means gains can begin earning their own gains. The earlier dollars are not magic; they simply get more cycles to work.',
    image: '/assets/posts/post-10.png',
    readSeconds: 39,
    energy: 'focused',
    tags: ['compounding', 'money', 'time'],
    quiz: {
      question: 'What makes compounding powerful?',
      options: [
        { id: 'a', label: 'More cycles for returns to build on returns' },
        { id: 'b', label: 'Guaranteed profits every year' },
        { id: 'c', label: 'Avoiding all risk forever' },
      ],
      answerId: 'a',
      explanation:
        'Compounding depends on reinvested growth and time. It does not remove risk or guarantee returns.',
    },
  },
  {
    id: 'post-11',
    format: 'info',
    category: 'coding',
    title: 'Rubber Duck Debugging Works',
    deck: 'Explaining code forces hidden assumptions into daylight.',
    body:
      'When you narrate a bug line by line, vague beliefs turn into testable claims. The duck is not solving the bug; your own explanation is flushing out the mismatch.',
    image: '/assets/posts/post-11.png',
    readSeconds: 34,
    energy: 'focused',
    tags: ['debugging', 'programming', 'reasoning'],
  },
  {
    id: 'post-12',
    format: 'cta',
    category: 'attention',
    title: 'One-Tab Reset',
    deck: 'Give your working memory a smaller room.',
    body:
      'Too many open tabs make every task feel half-started. Pick the one tab that matches your current verb: write, read, submit, fix, pay, send. Close or park the rest.',
    image: '/assets/posts/post-12.png',
    readSeconds: 32,
    energy: 'active',
    tags: ['focus', 'tabs', 'digital-space'],
    cta: {
      action: 'Name your current verb, then leave only one matching tab visible.',
      estimatedMinutes: 2,
    },
  },
  {
    id: 'post-13',
    format: 'myth-fact',
    category: 'space',
    title: 'Black Holes Are Not Cosmic Vacuums',
    deck: 'They pull like mass, not like movie magic.',
    body:
      'If the Sun somehow became a black hole with the same mass, Earth would not be sucked in; it would keep orbiting the same center of mass. The problem would be losing sunlight.',
    image: '/assets/posts/post-13.png',
    readSeconds: 37,
    energy: 'curious',
    tags: ['black-holes', 'gravity', 'orbits'],
    mythFact: {
      myth: 'Black holes suck in everything nearby like drains.',
      fact: 'Outside the event horizon, gravity behaves according to mass and distance just like other objects.',
    },
  },
  {
    id: 'post-14',
    format: 'info',
    category: 'psychology',
    title: 'Affect Labeling',
    deck: 'Naming a feeling can turn the volume down.',
    body:
      'Putting emotion into words, even briefly, can reduce its intensity for some people. "I am anxious" is not a cure, but it converts a foggy state into something your brain can work with.',
    image: '/assets/posts/post-14.png',
    readSeconds: 36,
    energy: 'calm',
    tags: ['emotion', 'self-regulation', 'language'],
  },
  {
    id: 'post-15',
    format: 'article',
    category: 'sports-physics',
    title: 'Why High Jumpers Go Backward',
    deck: 'The Fosbury Flop cheats the center of mass.',
    body:
      'In the Fosbury Flop, the athlete arches over the bar while their center of mass can pass below it. The body clears the bar because the shape, timing, and rotation distribute mass around the obstacle.',
    image: '/assets/posts/post-15.png',
    readSeconds: 43,
    energy: 'curious',
    tags: ['high-jump', 'center-of-mass', 'olympics'],
  },
  {
    id: 'post-16',
    format: 'quiz',
    category: 'music-theory',
    title: 'What Makes A Song Feel Resolved?',
    deck: 'Your ear likes a home base.',
    body:
      'Tonal music often creates tension by moving away from a tonic chord, then releases it by returning home. The dominant-to-tonic move is one of the strongest resolution patterns in Western harmony.',
    image: '/assets/posts/post-16.png',
    readSeconds: 41,
    energy: 'focused',
    tags: ['tonic', 'dominant', 'resolution'],
    quiz: {
      question: 'In C major, which chord is the tonic?',
      options: [
        { id: 'a', label: 'C major' },
        { id: 'b', label: 'G major' },
        { id: 'c', label: 'D minor' },
      ],
      answerId: 'a',
      explanation: 'The tonic is the home chord of the key. In C major, C major is home.',
    },
  },
  {
    id: 'post-17',
    format: 'spot-fake',
    category: 'ai',
    title: 'Deepfake Pause Button',
    deck: 'Look for physics before faces.',
    body:
      'A fake video may pass a quick face check but fail on shadows, reflections, fingers, earrings, glasses, blinking cadence, or audio-room mismatch. The background often tells on the foreground.',
    image: '/assets/posts/post-17.png',
    readSeconds: 44,
    energy: 'focused',
    tags: ['deepfakes', 'visual-literacy', 'ai'],
    spotFake: {
      prompt: 'Which detail is most useful for a quick fake-video check?',
      suspectIds: ['b'],
      explanation:
        'Lighting and reflections are harder to keep consistent than a single centered face.',
    },
  },
  {
    id: 'post-18',
    format: 'myth-fact',
    category: 'health',
    title: 'Soreness Is Not The Scoreboard',
    deck: 'A workout can work without making stairs dramatic.',
    body:
      'Delayed soreness often follows unfamiliar movement, especially eccentric loading. It is not a clean measure of progress, strength, or health. Consistency beats chasing soreness.',
    image: '/assets/posts/post-18.png',
    readSeconds: 35,
    energy: 'calm',
    tags: ['exercise', 'recovery', 'training'],
    mythFact: {
      myth: 'If you are not sore, the workout did not count.',
      fact: 'Progress can happen without soreness; performance, consistency, and recovery are better signals.',
    },
  },
  {
    id: 'post-19',
    format: 'word-game',
    category: 'creativity',
    title: 'Constraint Sprint',
    deck: 'Limits make ideas easier to catch.',
    body:
      'A blank page offers too many moves. A constraint turns creativity into a game with edges: three colors, one verb, no adjectives, six lines, one object, ten minutes.',
    image: '/assets/posts/post-19.png',
    readSeconds: 33,
    energy: 'active',
    tags: ['constraints', 'writing', 'ideation'],
    wordGame: {
      clue: 'Write a six-word product pitch for a boring object.',
      answer: 'Any six-word pitch with a clear object',
    },
  },
  {
    id: 'post-20',
    format: 'info',
    category: 'history',
    title: 'The Library That Measured Earth',
    deck: 'A shadow, a stick, and a very good question.',
    body:
      'Eratosthenes compared the Sun angle in two Egyptian cities and estimated Earth circumference with surprising accuracy. The trick was not fancy equipment; it was geometry plus distance.',
    image: '/assets/posts/post-20.png',
    readSeconds: 40,
    energy: 'curious',
    tags: ['eratosthenes', 'geometry', 'ancient-science'],
  },
  {
    id: 'post-21',
    format: 'article',
    category: 'nature',
    title: 'The Mantis Shrimp Color Myth',
    deck: 'More receptors do not automatically mean better color.',
    body:
      'Mantis shrimp have many photoreceptor types, but experiments suggest they may process color differently rather than seeing an ultra-rich rainbow humans cannot imagine. Biology is stranger than the viral version.',
    image: '/assets/posts/post-21.png',
    readSeconds: 46,
    energy: 'curious',
    tags: ['vision', 'marine-life', 'perception'],
  },
  {
    id: 'post-22',
    format: 'myth-fact',
    category: 'finance',
    title: 'Budgeting Is Forecasting',
    deck: 'The useful budget is a prediction you revise.',
    body:
      'A budget that fails is still data. The question is not whether you perfectly obeyed the spreadsheet; it is whether next month can be forecast a little more honestly.',
    image: '/assets/posts/post-22.png',
    readSeconds: 34,
    energy: 'calm',
    tags: ['budgeting', 'planning', 'money'],
    mythFact: {
      myth: 'A budget only works if you follow it exactly.',
      fact: 'A budget works best as a living forecast that improves as real spending data comes in.',
    },
  },
  {
    id: 'post-23',
    format: 'quiz',
    category: 'coding',
    title: 'Big O In Plain Clothes',
    deck: 'The shape matters more than the stopwatch.',
    body:
      'Big O describes how work grows as input grows. A loop inside another loop over the same list often grows roughly with n squared, which gets expensive fast.',
    image: '/assets/posts/post-23.png',
    readSeconds: 44,
    energy: 'focused',
    tags: ['algorithms', 'big-o', 'performance'],
    quiz: {
      question: 'A loop over n items inside another loop over n items is usually:',
      options: [
        { id: 'a', label: 'O(n)' },
        { id: 'b', label: 'O(n log n)' },
        { id: 'c', label: 'O(n^2)' },
      ],
      answerId: 'c',
      explanation: 'For each of n items, the inner loop can run n times, making about n times n operations.',
    },
  },
  {
    id: 'post-24',
    format: 'info',
    category: 'attention',
    title: 'Attention Has Switching Costs',
    deck: 'Changing tasks is not free, even when it feels instant.',
    body:
      'Task switching leaves a residue: part of your mind keeps holding the previous context. That is why two tiny tasks can feel heavier than one longer task with fewer context changes.',
    image: '/assets/posts/post-24.png',
    readSeconds: 33,
    energy: 'focused',
    tags: ['context-switching', 'work', 'focus'],
  },
  {
    id: 'post-25',
    format: 'quiz',
    category: 'space',
    title: 'The Nearest Star After The Sun',
    deck: 'Close is still absurdly far.',
    body:
      'Proxima Centauri is about 4.24 light-years away. That means its light takes more than four years to reach us, and it is still our stellar neighbor.',
    image: '/assets/posts/post-25.png',
    readSeconds: 31,
    energy: 'curious',
    tags: ['stars', 'distance', 'proxima-centauri'],
    quiz: {
      question: 'About how far away is Proxima Centauri?',
      options: [
        { id: 'a', label: '4.24 light-years' },
        { id: 'b', label: '42 light-minutes' },
        { id: 'c', label: '424 million miles' },
      ],
      answerId: 'a',
      explanation: 'Proxima Centauri is the nearest known star to the Sun at roughly 4.24 light-years.',
    },
  },
  {
    id: 'post-26',
    format: 'cta',
    category: 'psychology',
    title: 'Make The Reward Smaller',
    deck: 'A tiny finish line can restart motivation.',
    body:
      'When a task feels too big, shrink the reward loop. Do not promise yourself the whole essay. Promise one named paragraph, one cleaned file, one solved error, one sent message.',
    image: '/assets/posts/post-26.png',
    readSeconds: 35,
    energy: 'active',
    tags: ['motivation', 'habits', 'progress'],
    cta: {
      action: 'Write the smallest finish line that would still count as progress.',
      estimatedMinutes: 2,
    },
  },
  {
    id: 'post-27',
    format: 'info',
    category: 'sports-physics',
    title: 'Why Sprinters Lean At The Start',
    deck: 'Acceleration wants force angled through the ground.',
    body:
      'At the start of a sprint, athletes lean forward so their push against the ground has a strong backward component. The ground pushes them forward in return, and the body angle helps turn strength into acceleration.',
    image: '/assets/posts/post-27.png',
    readSeconds: 39,
    energy: 'curious',
    tags: ['sprinting', 'acceleration', 'newton'],
  },
  {
    id: 'post-28',
    format: 'article',
    category: 'music-theory',
    title: 'Syncopation Is A Friendly Trick',
    deck: 'The groove appears where expectation gets nudged.',
    body:
      'Syncopation emphasizes offbeats or weak beats, creating a small surprise against the meter. Your body tracks the expected pulse while the music steps around it.',
    image: '/assets/posts/post-28.png',
    readSeconds: 37,
    energy: 'curious',
    tags: ['rhythm', 'syncopation', 'groove'],
  },
  {
    id: 'post-29',
    format: 'spot-fake',
    category: 'history',
    title: 'Photo Or Propaganda?',
    deck: 'Old images can lie without being AI.',
    body:
      'Before digital editing, photos were staged, cropped, retouched, captioned dishonestly, or printed selectively. Historical media literacy means checking who made the image, where it appeared, and what was left outside the frame.',
    image: '/assets/posts/post-29.png',
    readSeconds: 45,
    energy: 'focused',
    tags: ['media-literacy', 'archives', 'propaganda'],
    spotFake: {
      prompt: 'What should you check before trusting a historical photo?',
      suspectIds: ['caption', 'crop', 'publisher'],
      explanation:
        'Context, framing, and publication trail can change the meaning of a real image.',
    },
  },
  {
    id: 'post-30',
    format: 'word-game',
    category: 'nature',
    title: 'Biology Word Ladder',
    deck: 'Small mutations, big consequences.',
    body:
      'Evolution often works through tiny changes filtered by survival and reproduction. A word ladder is a miniature model: one letter changes at a time, but the destination can feel far from the start.',
    image: '/assets/posts/post-30.png',
    readSeconds: 40,
    energy: 'active',
    tags: ['evolution', 'wordplay', 'adaptation'],
    wordGame: {
      clue: 'Change one letter at a time to move from SEED to TREE.',
      answer: 'One possible path: SEED -> TEED -> TRED -> TREE',
    },
  },
  {
    id: 'post-31',
    format: 'article',
    category: 'ai',
    title: 'Embeddings Are Meaning Coordinates',
    deck: 'Similarity becomes something software can measure.',
    body:
      'An embedding turns text, images, or audio into lists of numbers. Similar items land near each other in that number-space, which is why search can find "refund problem" when the exact words were "money back issue."',
    image: '/assets/posts/post-01.png',
    readSeconds: 46,
    energy: 'focused',
    tags: ['embeddings', 'search', 'machine-learning'],
  },
  {
    id: 'post-32',
    format: 'cta',
    category: 'health',
    title: 'The 20-Second Posture Check',
    deck: 'Comfort starts smaller than a full routine.',
    body:
      'A quick reset can reduce strain before it becomes background noise. Unclench your jaw, drop your shoulders, put both feet down, and move your screen or body until your neck stops reaching.',
    image: '/assets/posts/post-02.png',
    readSeconds: 30,
    energy: 'active',
    tags: ['ergonomics', 'posture', 'microbreak'],
    cta: {
      action: 'Run the jaw, shoulders, feet, neck scan once.',
      estimatedMinutes: 1,
    },
  },
  {
    id: 'post-33',
    format: 'spot-fake',
    category: 'finance',
    title: 'Too-Smooth Money Advice',
    deck: 'Scams love certainty, urgency, and screenshots.',
    body:
      'A money claim gets more suspicious when it promises high returns, low risk, fast deadlines, secret access, or proof by screenshot. Real financial decisions survive a night of sleep and a second source.',
    image: '/assets/posts/post-03.png',
    readSeconds: 42,
    energy: 'focused',
    tags: ['scams', 'risk', 'money-literacy'],
    spotFake: {
      prompt: 'Which phrase is the loudest warning sign?',
      suspectIds: ['guaranteed'],
      explanation:
        'Guaranteed high returns with low risk are not a normal investment pitch; they are a verification emergency.',
    },
  },
  {
    id: 'post-34',
    format: 'word-game',
    category: 'coding',
    title: 'Name The Refactor',
    deck: 'Good names compress future confusion.',
    body:
      'A refactor is easier to trust when names reveal intent. Replace "stuff," "data," and "handleThing" with words that describe the role: invoiceRows, parseTranscript, nextVisiblePost.',
    image: '/assets/posts/post-04.png',
    readSeconds: 36,
    energy: 'active',
    tags: ['naming', 'refactoring', 'readability'],
    wordGame: {
      clue: 'Rename handleData so it says what happens to a feed item.',
      answer: 'renderPost, savePost, scorePost, or another verb plus object',
    },
  },
  {
    id: 'post-35',
    format: 'myth-fact',
    category: 'attention',
    title: 'Notifications Are Not Neutral',
    deck: 'A buzz is a tiny priority override.',
    body:
      'Even when you ignore a notification, it can force a decision: check, dismiss, wonder, or resist. Fewer alerts means fewer moments where your attention has to defend itself.',
    image: '/assets/posts/post-05.png',
    readSeconds: 35,
    energy: 'calm',
    tags: ['notifications', 'focus', 'phone-settings'],
    mythFact: {
      myth: 'A notification only matters if you open it.',
      fact: 'The interruption can cost attention even when you do not tap through.',
    },
  },
  {
    id: 'post-36',
    format: 'quiz',
    category: 'creativity',
    title: 'Diverge, Then Decide',
    deck: 'Brainstorming and choosing use different muscles.',
    body:
      'Early ideation benefits from quantity and weirdness. Selection comes later, when you can compare options against a real goal instead of letting the first decent thought win by arriving early.',
    image: '/assets/posts/post-06.png',
    readSeconds: 41,
    energy: 'focused',
    tags: ['brainstorming', 'decision-making', 'ideas'],
    quiz: {
      question: 'What is the best first move when ideas feel stale?',
      options: [
        { id: 'a', label: 'Generate more options before judging' },
        { id: 'b', label: 'Pick the first safe idea immediately' },
        { id: 'c', label: 'Rewrite the rules after every idea' },
      ],
      answerId: 'a',
      explanation:
        'Separating generation from judgment helps avoid killing unusual ideas before they can combine into better ones.',
    },
  },
]

export const postsByCategory = contentLibrary.reduce(
  (groups, post) => {
    groups[post.category] = [...(groups[post.category] ?? []), post]
    return groups
  },
  {} as Partial<Record<ContentCategory, ScrollBreakPost[]>>,
)

export const postsByFormat = contentLibrary.reduce(
  (groups, post) => {
    groups[post.format] = [...(groups[post.format] ?? []), post]
    return groups
  },
  {} as Partial<Record<PostFormat, ScrollBreakPost[]>>,
)
