import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Bookmark,
  Brain,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  Heart,
  Home,
  MessageCircle,
  Play,
  RotateCcw,
  Search,
  Share2,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Zap,
} from 'lucide-react'
import './App.css'

type Interest =
  | 'space'
  | 'psychology'
  | 'sports'
  | 'music'
  | 'ai'
  | 'health'
  | 'creativity'
  | 'history'
  | 'nature'
  | 'finance'
  | 'coding'
  | 'attention'

type CardType =
  | 'info'
  | 'article'
  | 'quiz'
  | 'myth'
  | 'spot'
  | 'reaction'
  | 'memory'
  | 'scramble'
  | 'cta'

type FeedCard = {
  id: string
  type: CardType
  interest: Interest
  handle: string
  title: string
  body: string
  image: string
  prompt?: string
  choices?: string[]
  answer?: string
  explanation?: string
  fake?: string
  action?: string
  words?: string[]
}

type UserProfile = {
  name: string
  interests: Interest[]
}

type View = 'break' | 'explore' | 'saved' | 'stats' | 'profile'
type SessionMode = 'quick' | 'curious' | 'challenge' | 'offline'

type Stats = {
  completedSessions: number
  cardsCompleted: number
  gamesCompleted: number
  ctasCompleted: number
  bestReaction: number | null
}

const interests: { id: Interest; label: string; tone: string }[] = [
  { id: 'space', label: 'Space', tone: 'Orbital questions' },
  { id: 'psychology', label: 'Psychology', tone: 'Mind mechanics' },
  { id: 'sports', label: 'Sports', tone: 'Physics in motion' },
  { id: 'music', label: 'Music', tone: 'Theory without homework' },
  { id: 'ai', label: 'AI', tone: 'Know the tools' },
  { id: 'health', label: 'Health', tone: 'Body signals' },
  { id: 'creativity', label: 'Creativity', tone: 'Make something' },
  { id: 'history', label: 'History', tone: 'Then meets now' },
  { id: 'nature', label: 'Nature', tone: 'Outside intelligence' },
  { id: 'finance', label: 'Finance', tone: 'Money clarity' },
  { id: 'coding', label: 'Coding', tone: 'Tiny builds' },
  { id: 'attention', label: 'Attention', tone: 'Beat the scroll' },
]

const starterStats: Stats = {
  completedSessions: 0,
  cardsCompleted: 0,
  gamesCompleted: 0,
  ctasCompleted: 0,
  bestReaction: null,
}

const sessionModes: { id: SessionMode; label: string; detail: string }[] = [
  { id: 'quick', label: 'Quick break', detail: '10 useful cards, balanced mix' },
  { id: 'curious', label: 'Curiosity run', detail: 'More articles and odd facts' },
  { id: 'challenge', label: 'Brain gym', detail: 'More quizzes and games' },
  { id: 'offline', label: 'Touch grass', detail: 'More real-world actions' },
]

const dailyMissions = [
  'Save one thing you would actually tell a friend.',
  'Complete two interactive cards without skipping.',
  'Do one off-screen move before starting another session.',
  'Pick one topic you usually ignore and learn one tiny thing.',
]

const reflectionPrompts = [
  'What were you trying to feel when you opened a feed today?',
  'What is one thing online that made you smarter this week?',
  'What deserves your attention after this tab closes?',
  'What should a good feed never take from you?',
]

const cards: FeedCard[] = [
  {
    id: 'space-01',
    type: 'info',
    interest: 'space',
    handle: 'orbital.room',
    title: 'A day on Venus is longer than its year.',
    body: 'Venus rotates so slowly that one spin takes about 243 Earth days, while its trip around the Sun takes about 225.',
    image: '/assets/posts/post-01.png',
  },
  {
    id: 'psych-01',
    type: 'article',
    interest: 'psychology',
    handle: 'mind.lens',
    title: 'Your brain rewards novelty before usefulness.',
    body: 'That is why feeds feel magnetic. ScrollBreak caps the session so novelty has a finish line.',
    image: '/assets/posts/post-02.png',
    explanation: 'The tiny win is recognizing the loop before it drives.',
  },
  {
    id: 'sports-01',
    type: 'quiz',
    interest: 'sports',
    handle: 'motion.lab',
    title: 'What makes a curveball curve?',
    body: 'The ball drags air unevenly as it spins.',
    image: '/assets/posts/post-03.png',
    choices: ['Magnus effect', 'Static charge', 'Gravity waves'],
    answer: 'Magnus effect',
    explanation: 'Spin changes air pressure around the ball, bending the path.',
  },
  {
    id: 'music-01',
    type: 'scramble',
    interest: 'music',
    handle: 'chord.room',
    title: 'Unscramble the music word.',
    body: 'Quick pattern lock: arrange the letters into the thing that makes a song feel resolved.',
    image: '/assets/posts/post-04.png',
    answer: 'cadence',
  },
  {
    id: 'ai-01',
    type: 'spot',
    interest: 'ai',
    handle: 'tool.sense',
    title: 'Spot the fake AI claim.',
    body: 'Two are reasonable. One is brainrot in a lab coat.',
    image: '/assets/posts/post-05.png',
    choices: [
      'AI models can confidently produce incorrect answers.',
      'More data can improve a model but does not guarantee truth.',
      'AI systems understand the world exactly like humans do.',
    ],
    answer: 'AI systems understand the world exactly like humans do.',
    explanation: 'Models can be useful without having human-style understanding.',
  },
  {
    id: 'health-01',
    type: 'cta',
    interest: 'health',
    handle: 'body.clock',
    title: 'Phone down, shoulders back.',
    body: 'Thirty seconds. Breathe in, drop your shoulders, look across the room.',
    image: '/assets/posts/post-06.png',
    action: 'I did the reset',
  },
  {
    id: 'creative-01',
    type: 'memory',
    interest: 'creativity',
    handle: 'make.room',
    title: 'Memory match: maker mode.',
    body: 'Match the pairs before your attention wanders.',
    image: '/assets/posts/post-07.png',
    words: ['sketch', 'spark', 'draft', 'build'],
  },
  {
    id: 'history-01',
    type: 'myth',
    interest: 'history',
    handle: 'timeline.feed',
    title: 'Myth or fact: the first camera phone appeared before the iPod.',
    body: 'Tap your guess before checking.',
    image: '/assets/posts/post-08.png',
    answer: 'Fact',
    explanation: 'The first commercial camera phones arrived in 1999-2000; the iPod launched in 2001.',
  },
  {
    id: 'nature-01',
    type: 'info',
    interest: 'nature',
    handle: 'outside.signal',
    title: 'Trees can warn neighbors through chemical signals.',
    body: 'Some plants release airborne compounds or use fungal networks when insects attack.',
    image: '/assets/posts/post-09.png',
  },
  {
    id: 'finance-01',
    type: 'article',
    interest: 'finance',
    handle: 'money.minute',
    title: 'Compound interest is quiet until it is loud.',
    body: 'Small repeated gains matter because growth starts earning growth. That is the whole trick.',
    image: '/assets/posts/post-10.png',
  },
  {
    id: 'coding-01',
    type: 'quiz',
    interest: 'coding',
    handle: 'tiny.builds',
    title: 'Which data structure is best for undo history?',
    body: 'Think newest action first.',
    image: '/assets/posts/post-11.png',
    choices: ['Stack', 'Queue', 'Random set'],
    answer: 'Stack',
    explanation: 'Undo pops the most recent action first: last in, first out.',
  },
  {
    id: 'attention-01',
    type: 'reaction',
    interest: 'attention',
    handle: 'focus.gym',
    title: 'Catch the signal.',
    body: 'When the button turns purple, tap it. No doomscroll reflexes allowed.',
    image: '/assets/posts/post-12.png',
  },
  {
    id: 'space-02',
    type: 'myth',
    interest: 'space',
    handle: 'cosmic.minute',
    title: 'Myth or fact: astronauts grow taller in orbit.',
    body: 'Microgravity lets the spine decompress.',
    image: '/assets/posts/post-13.png',
    answer: 'Fact',
    explanation: 'Many astronauts temporarily gain height in space, then return to normal on Earth.',
  },
  {
    id: 'psych-02',
    type: 'quiz',
    interest: 'psychology',
    handle: 'mind.lens',
    title: 'What is the Zeigarnik effect?',
    body: 'Your brain keeps tugging on unfinished tasks.',
    image: '/assets/posts/post-14.png',
    choices: ['Remembering unfinished tasks', 'Seeing faces in objects', 'Copying group behavior'],
    answer: 'Remembering unfinished tasks',
    explanation: 'Open loops stick because your brain wants closure.',
  },
  {
    id: 'music-02',
    type: 'info',
    interest: 'music',
    handle: 'chord.room',
    title: 'Bass lines can change the emotion of the same chord.',
    body: 'A chord inversion keeps the notes but changes which note feels like home.',
    image: '/assets/posts/post-15.png',
  },
  {
    id: 'attention-02',
    type: 'cta',
    interest: 'attention',
    handle: 'focus.gym',
    title: 'Close one tab you do not need.',
    body: 'Digital clutter is still clutter. Kill one little open loop.',
    image: '/assets/posts/post-16.png',
    action: 'Tab closed',
  },
  {
    id: 'sports-02',
    type: 'spot',
    interest: 'sports',
    handle: 'motion.lab',
    title: 'Spot the fake training claim.',
    body: 'One of these sounds athletic but says nothing.',
    image: '/assets/posts/post-17.png',
    choices: [
      'Sleep affects reaction time.',
      'Practice can improve motor patterns.',
      'Sweat color proves workout quality.',
    ],
    answer: 'Sweat color proves workout quality.',
    explanation: 'Sweat is not a scoreboard.',
  },
  {
    id: 'coding-02',
    type: 'scramble',
    interest: 'coding',
    handle: 'tiny.builds',
    title: 'Unscramble the coding word.',
    body: 'Hint: a named value you can reuse.',
    image: '/assets/posts/post-18.png',
    answer: 'variable',
  },
  {
    id: 'nature-02',
    type: 'cta',
    interest: 'nature',
    handle: 'outside.signal',
    title: 'Find one non-screen texture.',
    body: 'Wood grain, fabric, cold glass, paper, leaf. Notice it for ten seconds.',
    image: '/assets/posts/post-19.png',
    action: 'Texture found',
  },
  {
    id: 'history-02',
    type: 'article',
    interest: 'history',
    handle: 'timeline.feed',
    title: 'Old technology felt impossible too.',
    body: 'The telegraph, radio, and television each changed attention before phones did.',
    image: '/assets/posts/post-20.png',
  },
  {
    id: 'ai-02',
    type: 'quiz',
    interest: 'ai',
    handle: 'tool.sense',
    title: 'What is a hallucination in AI?',
    body: 'Not a spooky thing. A reliability thing.',
    image: '/assets/posts/post-21.png',
    choices: ['A confident false output', 'A faster GPU', 'A private dataset'],
    answer: 'A confident false output',
    explanation: 'It is when a model gives an answer that sounds plausible but is wrong.',
  },
  {
    id: 'finance-02',
    type: 'myth',
    interest: 'finance',
    handle: 'money.minute',
    title: 'Myth or fact: a budget is mainly a guilt document.',
    body: 'You decide whether this one is rotten.',
    image: '/assets/posts/post-22.png',
    answer: 'Myth',
    explanation: 'A good budget is a map of choices, not a scolding machine.',
  },
  {
    id: 'health-02',
    type: 'info',
    interest: 'health',
    handle: 'body.clock',
    title: 'Hydration changes focus before it changes thirst.',
    body: 'Even mild dehydration can make attention feel heavier.',
    image: '/assets/posts/post-23.png',
  },
  {
    id: 'creative-02',
    type: 'cta',
    interest: 'creativity',
    handle: 'make.room',
    title: 'Make one ugly sentence.',
    body: 'Write a sentence that does not need to be good. Starting is the skill.',
    image: '/assets/posts/post-24.png',
    action: 'Sentence made',
  },
  {
    id: 'attention-03',
    type: 'article',
    interest: 'attention',
    handle: 'focus.gym',
    title: 'The best feeds know your next tap.',
    body: 'A finite session removes the bottomless bargain: you get the spark without the sinkhole.',
    image: '/assets/posts/post-25.png',
  },
  {
    id: 'space-03',
    type: 'spot',
    interest: 'space',
    handle: 'orbital.room',
    title: 'Spot the fake space fact.',
    body: 'Two are true enough. One is floating nonsense.',
    image: '/assets/posts/post-26.png',
    choices: ['The Moon is drifting away from Earth.', 'Sound travels normally through empty space.', 'Mars has dust storms.'],
    answer: 'Sound travels normally through empty space.',
    explanation: 'Sound needs matter to vibrate through; space is mostly vacuum.',
  },
  {
    id: 'psych-03',
    type: 'memory',
    interest: 'psychology',
    handle: 'mind.lens',
    title: 'Memory match: attention traps.',
    body: 'Pair the tiny attention thieves.',
    image: '/assets/posts/post-27.png',
    words: ['ping', 'loop', 'tab', 'urge'],
  },
  {
    id: 'music-03',
    type: 'cta',
    interest: 'music',
    handle: 'chord.room',
    title: 'Listen to 20 seconds without multitasking.',
    body: 'No typing. No skipping. Let the song do one job.',
    image: '/assets/posts/post-28.png',
    action: 'I listened',
  },
  {
    id: 'coding-03',
    type: 'article',
    interest: 'coding',
    handle: 'tiny.builds',
    title: 'Readable code is future kindness.',
    body: 'A good variable name saves attention every time someone returns to the file.',
    image: '/assets/posts/post-29.png',
  },
  {
    id: 'nature-03',
    type: 'quiz',
    interest: 'nature',
    handle: 'outside.signal',
    title: 'What do stomata do?',
    body: 'Plants have tiny openings doing serious work.',
    image: '/assets/posts/post-30.png',
    choices: ['Exchange gases', 'Store memories', 'Make pollen glow'],
    answer: 'Exchange gases',
    explanation: 'Stomata open and close to exchange gases and manage water loss.',
  },
]

const storage = {
  user: 'scrollbreak:user',
  saved: 'scrollbreak:saved',
  liked: 'scrollbreak:liked',
  stats: 'scrollbreak:stats',
  reflections: 'scrollbreak:reflections',
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5)
}

function buildSession(profile: UserProfile | null, mode: SessionMode = 'quick') {
  const selected = profile?.interests.length ? profile.interests : interests.slice(0, 6).map((item) => item.id)
  const relevant = cards.filter((card) => selected.includes(card.interest))
  const gameTarget = mode === 'challenge' ? 5 : 3
  const ctaTarget = mode === 'offline' ? 4 : 2
  const articleTarget = mode === 'curious' ? 4 : 0
  const guaranteedGames = shuffle(relevant.filter((card) => ['quiz', 'myth', 'spot', 'reaction', 'memory', 'scramble'].includes(card.type))).slice(0, gameTarget)
  const guaranteedCtas = shuffle(relevant.filter((card) => card.type === 'cta')).slice(0, ctaTarget)
  const guaranteedArticles = shuffle(relevant.filter((card) => ['article', 'info'].includes(card.type))).slice(0, articleTarget)
  const fixed = [...guaranteedGames, ...guaranteedCtas, ...guaranteedArticles]
  const remaining = shuffle(relevant.filter((card) => !fixed.some((picked) => picked.id === card.id)))
  const selectedDeck = shuffle([...fixed, ...remaining])
  const filler = shuffle(cards.filter((card) => !selectedDeck.some((picked) => picked.id === card.id)))
  return [...selectedDeck, ...filler].slice(0, 10)
}

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => readJson<UserProfile | null>(storage.user, null))
  const [draftName, setDraftName] = useState('')
  const [draftInterests, setDraftInterests] = useState<Interest[]>(['psychology', 'space', 'attention'])
  const [session, setSession] = useState<FeedCard[]>(() => buildSession(readJson<UserProfile | null>(storage.user, null)))
  const [activeIndex, setActiveIndex] = useState(0)
  const [liked, setLiked] = useState<string[]>(() => readJson<string[]>(storage.liked, []))
  const [saved, setSaved] = useState<string[]>(() => readJson<string[]>(storage.saved, []))
  const [completed, setCompleted] = useState<string[]>([])
  const [stats, setStats] = useState<Stats>(() => readJson<Stats>(storage.stats, starterStats))
  const [activeView, setActiveView] = useState<View>('break')
  const [mode, setMode] = useState<SessionMode>('quick')
  const [reflections, setReflections] = useState<string[]>(() => readJson<string[]>(storage.reflections, []))
  const [reflectionDraft, setReflectionDraft] = useState('')

  useEffect(() => window.localStorage.setItem(storage.liked, JSON.stringify(liked)), [liked])
  useEffect(() => window.localStorage.setItem(storage.saved, JSON.stringify(saved)), [saved])
  useEffect(() => window.localStorage.setItem(storage.stats, JSON.stringify(stats)), [stats])
  useEffect(() => window.localStorage.setItem(storage.reflections, JSON.stringify(reflections)), [reflections])

  const activeCard = session[activeIndex]
  const isComplete = activeIndex >= session.length
  const progress = Math.min(activeIndex + 1, session.length)
  const selectedLabels = profile?.interests.map((id) => interests.find((item) => item.id === id)?.label).filter(Boolean) ?? []
  const savedCards = saved.map((id) => cards.find((card) => card.id === id)).filter((card): card is FeedCard => Boolean(card))
  const likedCards = liked.map((id) => cards.find((card) => card.id === id)).filter((card): card is FeedCard => Boolean(card))

  const sessionCounts = useMemo(() => {
    const doneCards = completed.length
    const gameCards = completed.filter((id) => session.find((card) => card.id === id && ['quiz', 'myth', 'spot', 'reaction', 'memory', 'scramble'].includes(card.type))).length
    const ctaCards = completed.filter((id) => session.find((card) => card.id === id && card.type === 'cta')).length
    return { doneCards, gameCards, ctaCards }
  }, [completed, session])

  function toggleInterest(id: Interest) {
    setDraftInterests((current) => {
      if (current.includes(id)) {
        return current.length === 1 ? current : current.filter((item) => item !== id)
      }
      return [...current, id]
    })
  }

  function createProfile() {
    const nextProfile = {
      name: draftName.trim() || 'Future You',
      interests: draftInterests,
    }
    setProfile(nextProfile)
    window.localStorage.setItem(storage.user, JSON.stringify(nextProfile))
    setSession(buildSession(nextProfile, mode))
    setActiveIndex(0)
    setCompleted([])
  }

  function markComplete(card: FeedCard, game = false, cta = false, reactionMs?: number) {
    setCompleted((current) => (current.includes(card.id) ? current : [...current, card.id]))
    setStats((current) => ({
      ...current,
      cardsCompleted: current.cardsCompleted + (completed.includes(card.id) ? 0 : 1),
      gamesCompleted: current.gamesCompleted + (game && !completed.includes(card.id) ? 1 : 0),
      ctasCompleted: current.ctasCompleted + (cta && !completed.includes(card.id) ? 1 : 0),
      bestReaction: reactionMs ? Math.min(current.bestReaction ?? reactionMs, reactionMs) : current.bestReaction,
    }))
  }

  function nextCard() {
    if (activeCard && !completed.includes(activeCard.id)) markComplete(activeCard)
    setActiveIndex((current) => current + 1)
  }

  function newSession() {
    if (isComplete) {
      const nextStats = { ...stats, completedSessions: stats.completedSessions + 1 }
      setStats(nextStats)
      window.localStorage.setItem(storage.stats, JSON.stringify(nextStats))
    }
    setSession(buildSession(profile, mode))
    setActiveIndex(0)
    setCompleted([])
    setActiveView('break')
  }

  function chooseMode(nextMode: SessionMode) {
    setMode(nextMode)
    setSession(buildSession(profile, nextMode))
    setActiveIndex(0)
    setCompleted([])
    setActiveView('break')
  }

  function addReflection() {
    const entry = reflectionDraft.trim()
    if (!entry) return
    setReflections((current) => [entry, ...current].slice(0, 12))
    setReflectionDraft('')
  }

  function updateProfileInterests(id: Interest) {
    if (!profile) return
    const nextInterests = profile.interests.includes(id)
      ? profile.interests.length === 1 ? profile.interests : profile.interests.filter((item) => item !== id)
      : [...profile.interests, id]
    const nextProfile = { ...profile, interests: nextInterests }
    setProfile(nextProfile)
    window.localStorage.setItem(storage.user, JSON.stringify(nextProfile))
  }

  if (!profile) {
    return (
      <main className="onboarding">
        <section className="onboarding-copy">
          <div className="brand-lockup">
            <span className="brand-mark"><Brain size={22} /></span>
            <span>ScrollBreak</span>
          </div>
          <h1>Social energy. A finish line.</h1>
          <p>Pick what you care about, then get a short run of useful posts, games, and off-screen prompts. No endless feed.</p>
          <div className="mock-phone" aria-hidden="true">
            <div className="phone-bar"></div>
            <div className="phone-story-row">
              {draftInterests.slice(0, 5).map((item) => <span key={item}></span>)}
            </div>
            <div className="phone-post">
              <img src="/assets/posts/post-02.png" alt="" />
              <div className="phone-lines"><span></span><span></span><span></span></div>
            </div>
          </div>
        </section>
        <section className="onboarding-panel" aria-label="Create demo account">
          <div>
            <span className="section-label">Demo account</span>
            <h2>What should your break know?</h2>
          </div>
          <label className="field-label" htmlFor="name">Name</label>
          <input id="name" value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder="Ty" />
          <div className="interest-grid">
            {interests.map((interest) => (
              <button
                className={draftInterests.includes(interest.id) ? 'interest selected' : 'interest'}
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                type="button"
              >
                <strong>{interest.label}</strong>
                <span>{interest.tone}</span>
              </button>
            ))}
          </div>
          <button className="primary-action" type="button" onClick={createProfile}>
            Start my first break <ChevronRight size={18} />
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <aside className="desktop-nav">
        <div className="brand-lockup"><span className="brand-mark"><Brain size={20} /></span><span>ScrollBreak</span></div>
        <nav>
          <button className={activeView === 'break' ? 'active' : ''} type="button" onClick={() => setActiveView('break')}><Home size={20} /> <span>Break</span></button>
          <button className={activeView === 'explore' ? 'active' : ''} type="button" onClick={() => setActiveView('explore')}><Search size={20} /> <span>Explore</span></button>
          <button className={activeView === 'saved' ? 'active' : ''} type="button" onClick={() => setActiveView('saved')}><Bookmark size={20} /> <span>Saved</span></button>
          <button className={activeView === 'stats' ? 'active' : ''} type="button" onClick={() => setActiveView('stats')}><Trophy size={20} /> <span>Stats</span></button>
          <button className={activeView === 'profile' ? 'active' : ''} type="button" onClick={() => setActiveView('profile')}><UserRound size={20} /> <span>Profile</span></button>
        </nav>
        <button className="new-break-button" type="button" onClick={newSession}><Play size={18} /> New finite break</button>
      </aside>

      <section className="feed-column">
        <header className="mobile-topbar">
          <div className="brand-lockup"><span className="brand-mark"><Brain size={18} /></span><span>ScrollBreak</span></div>
          <button type="button" onClick={newSession}><RotateCcw size={18} /></button>
        </header>

        <div className="session-strip">
          {interests.filter((item) => profile.interests.includes(item.id)).map((interest) => (
            <button key={interest.id} type="button">
              <span>{interest.label.slice(0, 2)}</span>
              {interest.label}
            </button>
          ))}
        </div>

        {activeView === 'break' && (
          <>
            <ModePicker activeMode={mode} onChoose={chooseMode} />
            <div className="session-header">
              <div>
                <span className="section-label">Finite session</span>
                <h1>{isComplete ? 'Break complete.' : `Card ${progress} of ${session.length}`}</h1>
              </div>
              <div className="progress-pill">
                <Clock3 size={16} />
                {isComplete ? 'ended' : `${progress} / ${session.length}`}
              </div>
            </div>
            <div className="progress-track"><span style={{ width: `${isComplete ? 100 : (activeIndex / session.length) * 100}%` }} /></div>

            {isComplete ? (
              <Recap
                savedCount={saved.length}
                counts={sessionCounts}
                onNewSession={newSession}
              />
            ) : (
              <FeedPost
                card={activeCard}
                liked={liked.includes(activeCard.id)}
                saved={saved.includes(activeCard.id)}
                completed={completed.includes(activeCard.id)}
                onLike={() => setLiked((current) => current.includes(activeCard.id) ? current.filter((id) => id !== activeCard.id) : [...current, activeCard.id])}
                onSave={() => setSaved((current) => current.includes(activeCard.id) ? current.filter((id) => id !== activeCard.id) : [...current, activeCard.id])}
                onComplete={(game, cta, reactionMs) => markComplete(activeCard, game, cta, reactionMs)}
                onNext={nextCard}
              />
            )}
          </>
        )}

        {activeView === 'explore' && <ExploreView liked={liked} saved={saved} onLike={setLiked} onSave={setSaved} />}
        {activeView === 'saved' && <SavedView savedCards={savedCards} likedCards={likedCards} onOpenBreak={() => setActiveView('break')} />}
        {activeView === 'stats' && <StatsView stats={stats} reflections={reflections} />}
        {activeView === 'profile' && (
          <ProfileView
            profile={profile}
            reflections={reflections}
            reflectionDraft={reflectionDraft}
            onReflectionDraft={setReflectionDraft}
            onAddReflection={addReflection}
            onToggleInterest={updateProfileInterests}
          />
        )}
      </section>

      <aside className="inspector">
        <div className="profile-card">
          <div className="profile-avatar">{profile.name.slice(0, 1).toUpperCase()}</div>
          <div>
            <strong>{profile.name}</strong>
            <span>{selectedLabels.join(', ')}</span>
          </div>
        </div>
        <div className="stat-grid">
          <Metric icon={<Zap size={18} />} label="Brain XP" value={stats.cardsCompleted * 15 + stats.gamesCompleted * 30} />
          <Metric icon={<Target size={18} />} label="Cards cleared" value={stats.cardsCompleted} />
          <Metric icon={<Flame size={18} />} label="Actions done" value={stats.ctasCompleted} />
          <Metric icon={<Clock3 size={18} />} label="Best reaction" value={stats.bestReaction ? `${stats.bestReaction}ms` : '—'} />
        </div>
        <section className="saved-panel">
          <h2>Saved sparks</h2>
          {saved.slice(-4).map((id) => {
            const card = cards.find((item) => item.id === id)
            return card ? <p key={id}>{card.title}</p> : null
          })}
          {!saved.length && <p>Save a post to build your better-than-scrolling shelf.</p>}
        </section>
      </aside>

      <nav className="mobile-nav">
        <button className={activeView === 'break' ? 'active' : ''} type="button" onClick={() => setActiveView('break')}><Home size={21} /><span>Break</span></button>
        <button className={activeView === 'explore' ? 'active' : ''} type="button" onClick={() => setActiveView('explore')}><Search size={21} /><span>Explore</span></button>
        <button className={activeView === 'saved' ? 'active' : ''} type="button" onClick={() => setActiveView('saved')}><Bookmark size={21} /><span>Saved</span></button>
        <button className={activeView === 'profile' ? 'active' : ''} type="button" onClick={() => setActiveView('profile')}><UserRound size={21} /><span>You</span></button>
      </nav>
    </main>
  )
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ModePicker({ activeMode, onChoose }: { activeMode: SessionMode; onChoose: (mode: SessionMode) => void }) {
  return (
    <section className="mode-picker" aria-label="Session modes">
      {sessionModes.map((item) => (
        <button className={activeMode === item.id ? 'selected' : ''} key={item.id} type="button" onClick={() => onChoose(item.id)}>
          <span>{item.label}</span>
          <small>{item.detail}</small>
        </button>
      ))}
    </section>
  )
}

function ExploreView({
  liked,
  saved,
  onLike,
  onSave,
}: {
  liked: string[]
  saved: string[]
  onLike: (updater: (current: string[]) => string[]) => void
  onSave: (updater: (current: string[]) => string[]) => void
}) {
  const featured = cards.slice(0, 18)
  return (
    <section className="feature-view">
      <ViewHeader label="Explore" title="A shelf of useful sparks." body="Browse the demo library without the infinite feed. Save what deserves a return trip." />
      <div className="explore-grid">
        {featured.map((card) => (
          <article className="explore-card" key={card.id}>
            <img src={card.image} alt="" />
            <div>
              <span>{card.interest} · {card.type}</span>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
              <div className="mini-actions">
                <button className={liked.includes(card.id) ? 'active' : ''} type="button" onClick={() => onLike((current) => current.includes(card.id) ? current.filter((id) => id !== card.id) : [...current, card.id])}><Heart size={17} /> Useful</button>
                <button className={saved.includes(card.id) ? 'active' : ''} type="button" onClick={() => onSave((current) => current.includes(card.id) ? current.filter((id) => id !== card.id) : [...current, card.id])}><Bookmark size={17} /> Save</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function SavedView({ savedCards, likedCards, onOpenBreak }: { savedCards: FeedCard[]; likedCards: FeedCard[]; onOpenBreak: () => void }) {
  const visible = savedCards.length ? savedCards : likedCards.slice(0, 6)
  return (
    <section className="feature-view">
      <ViewHeader label="Saved" title="Your better feed shelf." body="The posts here are the ones you decided were worth keeping." />
      {visible.length ? (
        <div className="saved-list">
          {visible.map((card) => (
            <article className="saved-row" key={card.id}>
              <img src={card.image} alt="" />
              <div>
                <span>{card.handle}</span>
                <h2>{card.title}</h2>
                <p>{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Bookmark size={30} />
          <h2>No saves yet.</h2>
          <p>Run a finite break and save the stuff you would actually want to remember.</p>
          <button className="primary-action" type="button" onClick={onOpenBreak}>Open Break</button>
        </div>
      )}
    </section>
  )
}

function StatsView({ stats, reflections }: { stats: Stats; reflections: string[] }) {
  const achievements = [
    { label: 'First Signal', done: stats.cardsCompleted > 0 },
    { label: 'Game Brain', done: stats.gamesCompleted >= 3 },
    { label: 'Offline Proof', done: stats.ctasCompleted >= 2 },
    { label: 'Session Closer', done: stats.completedSessions >= 1 },
  ]
  return (
    <section className="feature-view">
      <ViewHeader label="Stats" title="Proof you did not just scroll." body="A lightweight receipt for time spent learning, playing, and leaving the screen." />
      <div className="stat-grid wide">
        <Metric icon={<Zap size={18} />} label="Brain XP" value={stats.cardsCompleted * 15 + stats.gamesCompleted * 30} />
        <Metric icon={<Target size={18} />} label="Cards cleared" value={stats.cardsCompleted} />
        <Metric icon={<Flame size={18} />} label="Offline moves" value={stats.ctasCompleted} />
        <Metric icon={<Trophy size={18} />} label="Sessions ended" value={stats.completedSessions} />
      </div>
      <div className="mission-board">
        <h2>Daily missions</h2>
        {dailyMissions.map((mission, index) => (
          <p key={mission}><Check size={16} /> {mission} <span>{index === 0 && stats.cardsCompleted > 0 ? 'done' : 'open'}</span></p>
        ))}
      </div>
      <div className="achievement-grid">
        {achievements.map((item) => (
          <div className={item.done ? 'achievement unlocked' : 'achievement'} key={item.label}>
            <Trophy size={20} />
            <strong>{item.label}</strong>
            <span>{item.done ? 'unlocked' : 'locked'}</span>
          </div>
        ))}
      </div>
      <div className="reflection-stack">
        <h2>Reflection log</h2>
        {reflections.length ? reflections.map((entry) => <p key={entry}>{entry}</p>) : <p>No reflections yet. Profile has prompts when you want one.</p>}
      </div>
    </section>
  )
}

function ProfileView({
  profile,
  reflections,
  reflectionDraft,
  onReflectionDraft,
  onAddReflection,
  onToggleInterest,
}: {
  profile: UserProfile
  reflections: string[]
  reflectionDraft: string
  onReflectionDraft: (value: string) => void
  onAddReflection: () => void
  onToggleInterest: (interest: Interest) => void
}) {
  return (
    <section className="feature-view">
      <ViewHeader label="Profile" title={`${profile.name}'s anti-scroll setup.`} body="Tune the feed, write a reflection, and keep the demo feeling personal." />
      <div className="profile-lab">
        <section>
          <h2>Interest tuner</h2>
          <div className="interest-grid compact-grid">
            {interests.map((interest) => (
              <button className={profile.interests.includes(interest.id) ? 'interest selected' : 'interest'} key={interest.id} type="button" onClick={() => onToggleInterest(interest.id)}>
                <strong>{interest.label}</strong>
                <span>{interest.tone}</span>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2>Focus contract</h2>
          <p className="contract-copy">I came here for a finite break. When the session ends, I do not need a substitute scroll.</p>
          <div className="reflection-prompts">
            {reflectionPrompts.map((prompt) => <button type="button" key={prompt} onClick={() => onReflectionDraft(prompt)}>{prompt}</button>)}
          </div>
          <input value={reflectionDraft} onChange={(event) => onReflectionDraft(event.target.value)} placeholder="Write one sentence worth keeping" />
          <button className="primary-action" type="button" onClick={onAddReflection}>Save reflection</button>
        </section>
      </div>
      <div className="reflection-stack">
        <h2>Recent reflections</h2>
        {reflections.length ? reflections.map((entry) => <p key={entry}>{entry}</p>) : <p>Nothing written yet.</p>}
      </div>
    </section>
  )
}

function ViewHeader({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <header className="view-header">
      <span className="section-label">{label}</span>
      <h1>{title}</h1>
      <p>{body}</p>
    </header>
  )
}

function FeedPost({
  card,
  liked,
  saved,
  completed,
  onLike,
  onSave,
  onComplete,
  onNext,
}: {
  card: FeedCard
  liked: boolean
  saved: boolean
  completed: boolean
  onLike: () => void
  onSave: () => void
  onComplete: (game?: boolean, cta?: boolean, reactionMs?: number) => void
  onNext: () => void
}) {
  return (
    <article className="post">
      <header className="post-author">
        <div className="avatar">{card.handle.slice(0, 1).toUpperCase()}</div>
        <div>
          <strong>{card.handle}</strong>
          <span>{card.interest} · {card.type}</span>
        </div>
      </header>
      <div className="media-frame">
        <img src={card.image} alt="" onError={(event) => event.currentTarget.classList.add('image-missing')} />
      </div>
      <div className="post-actions">
        <button className={liked ? 'hot' : ''} type="button" onClick={onLike} aria-label="Like"><Heart size={23} fill={liked ? 'currentColor' : 'none'} /></button>
        <button type="button" aria-label="Comment"><MessageCircle size={23} /></button>
        <button type="button" aria-label="Share"><Share2 size={23} /></button>
        <button className={saved ? 'saved' : 'save-action'} type="button" onClick={onSave} aria-label="Save"><Bookmark size={23} fill={saved ? 'currentColor' : 'none'} /></button>
      </div>
      <div className="post-copy">
        <h2>{card.title}</h2>
        <p>{card.body}</p>
      </div>
      <InteractiveCard key={card.id} card={card} completed={completed} onComplete={onComplete} />
      <button className="next-button" type="button" onClick={onNext}>
        {completed ? 'Next card' : 'Mark useful and continue'} <ChevronRight size={18} />
      </button>
    </article>
  )
}

function InteractiveCard({
  card,
  completed,
  onComplete,
}: {
  card: FeedCard
  completed: boolean
  onComplete: (game?: boolean, cta?: boolean, reactionMs?: number) => void
}) {
  const [picked, setPicked] = useState('')
  const [reactionState, setReactionState] = useState<'idle' | 'waiting' | 'ready' | 'done'>('idle')
  const [reactionStart, setReactionStart] = useState(0)
  const [reactionMs, setReactionMs] = useState<number | null>(null)
  const [scramble, setScramble] = useState('')
  const [matched, setMatched] = useState<string[]>([])

  if (card.type === 'quiz' || card.type === 'spot') {
    return (
      <div className="interactive">
        <p className="prompt">{card.type === 'spot' ? 'Spot the fake' : 'Pick one'}</p>
        <div className="choice-list">
          {card.choices?.map((choice) => (
            <button
              className={picked === choice ? (choice === card.answer ? 'correct' : 'wrong') : ''}
              key={choice}
              type="button"
              onClick={() => {
                setPicked(choice)
                onComplete(true)
              }}
            >
              {choice}
            </button>
          ))}
        </div>
        {picked && <p className="result-line">{picked === card.answer ? 'Correct.' : 'Not quite.'} {card.explanation}</p>}
      </div>
    )
  }

  if (card.type === 'myth') {
    return (
      <div className="interactive compact">
        <div className="choice-list two">
          {['Myth', 'Fact'].map((choice) => (
            <button
              className={picked === choice ? (choice === card.answer ? 'correct' : 'wrong') : ''}
              key={choice}
              type="button"
              onClick={() => {
                setPicked(choice)
                onComplete(true)
              }}
            >
              {choice}
            </button>
          ))}
        </div>
        {picked && <p className="result-line">{picked === card.answer ? 'You got it.' : 'Flip it.'} {card.explanation}</p>}
      </div>
    )
  }

  if (card.type === 'reaction') {
    function startReaction() {
      setReactionState('waiting')
      const delay = 900 + Math.random() * 1800
      window.setTimeout(() => {
        setReactionStart(performance.now())
        setReactionState('ready')
      }, delay)
    }
    return (
      <div className={`reaction-pad ${reactionState}`}>
        <button
          type="button"
          onClick={() => {
            if (reactionState === 'idle' || reactionState === 'done') startReaction()
            if (reactionState === 'ready') {
              const ms = Math.round(performance.now() - reactionStart)
              setReactionMs(ms)
              setReactionState('done')
              onComplete(true, false, ms)
            }
          }}
        >
          {reactionState === 'idle' && 'Start reaction test'}
          {reactionState === 'waiting' && 'Wait for purple...'}
          {reactionState === 'ready' && 'Tap now'}
          {reactionState === 'done' && `${reactionMs}ms · try again`}
        </button>
      </div>
    )
  }

  if (card.type === 'memory') {
    const words = [...(card.words ?? []), ...(card.words ?? [])]
    return (
      <div className="memory-grid">
        {words.map((word, index) => {
          const token = `${word}-${index}`
          const isMatched = matched.includes(token)
          return (
            <button
              className={isMatched ? 'matched' : ''}
              key={token}
              type="button"
              onClick={() => {
                const sameWord = matched.some((item) => item.startsWith(`${word}-`))
                const next = sameWord ? [...matched, token] : [...matched, token]
                setMatched(next)
                if (next.length >= words.length) onComplete(true)
              }}
            >
              {isMatched ? word : '?'}
            </button>
          )
        })}
      </div>
    )
  }

  if (card.type === 'scramble') {
    const answer = card.answer ?? ''
    const jumbled = answer.split('').sort().join('')
    return (
      <div className="interactive compact">
        <p className="scramble-word">{jumbled}</p>
        <input value={scramble} onChange={(event) => setScramble(event.target.value)} placeholder="Type the word" />
        <button
          className={scramble.toLowerCase() === answer ? 'correct submit' : 'submit'}
          type="button"
          onClick={() => scramble.toLowerCase() === answer && onComplete(true)}
        >
          Check
        </button>
      </div>
    )
  }

  if (card.type === 'cta') {
    return (
      <div className="cta-box">
        <Sparkles size={20} />
        <div>
          <strong>Off-screen move</strong>
          <p>{card.action}</p>
        </div>
        <button className={completed ? 'done' : ''} type="button" onClick={() => onComplete(false, true)}>
          {completed ? <Check size={18} /> : 'Done'}
        </button>
      </div>
    )
  }

  return null
}

function Recap({
  savedCount,
  counts,
  onNewSession,
}: {
  savedCount: number
  counts: { doneCards: number; gameCards: number; ctaCards: number }
  onNewSession: () => void
}) {
  return (
    <section className="recap">
      <div className="recap-icon"><Trophy size={34} /></div>
      <h2>You hit the end. That is the feature.</h2>
      <p>Useful social energy, then a clean exit. Start another finite session when you actually want one.</p>
      <div className="recap-stats">
        <Metric icon={<Brain size={18} />} label="Cards" value={counts.doneCards} />
        <Metric icon={<Zap size={18} />} label="Games" value={counts.gameCards} />
        <Metric icon={<Check size={18} />} label="Actions" value={counts.ctaCards} />
        <Metric icon={<Bookmark size={18} />} label="Saved" value={savedCount} />
      </div>
      <button className="primary-action" type="button" onClick={onNewSession}>Start another finite break</button>
    </section>
  )
}

export default App
