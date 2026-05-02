import {
  CassetteTape,
  Cat,
  ExternalLink,
  Gamepad2,
  Ghost,
  Mail,
  MessageCircleQuestion,
  MousePointerClick,
  Palette,
  RadioTower,
  Search,
  Shuffle,
  Sparkles,
  Sticker,
  Trophy,
  Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'

type Category = 'All' | 'Portals' | 'Time Capsules' | 'Bots' | 'Memes' | 'Toys' | 'DIY Web' | 'Games'

type Exhibit = {
  id: string
  title: string
  year: string
  category: Exclude<Category, 'All'>
  vibe: string
  action: string
  url?: string
  local?: string
  color: string
}

type Stamp = {
  id: string
  label: string
  icon: typeof Trophy
}

const categories: Category[] = ['All', 'Portals', 'Time Capsules', 'Bots', 'Memes', 'Toys', 'DIY Web', 'Games']

const exhibits: Exhibit[] = [
  {
    id: 'bored-button',
    title: 'The Bored Button',
    year: '2000s-now',
    category: 'Portals',
    vibe: 'One click, no plan, instant rabbit hole.',
    action: 'Roll a random exhibit from this museum.',
    url: 'https://www.boredbutton.net/',
    local: 'randomizer',
    color: '#ffe600',
  },
  {
    id: 'useless-web',
    title: 'The Useless Web',
    year: '2012',
    category: 'Portals',
    vibe: 'A portal for sites with no productivity excuse.',
    action: 'Open a ceremonial random-web button.',
    url: 'https://theuselessweb.com/',
    color: '#ff6dd8',
  },
  {
    id: 'neal-fun',
    title: 'neal.fun',
    year: '2017-now',
    category: 'Toys',
    vibe: 'Educational web toys with dangerous “one more minute” energy.',
    action: 'Visit the modern gold standard for browser mini-worlds.',
    url: 'https://neal.fun/',
    color: '#73ff8f',
  },
  {
    id: 'cleverbot',
    title: 'Cleverbot',
    year: '1997-now',
    category: 'Bots',
    vibe: 'The pre-ChatGPT mirror maze that talked back weirdly.',
    action: 'Open a chat relic, then ask it something inadvisable.',
    url: 'https://www.cleverbot.com/',
    color: '#ff65c7',
  },
  {
    id: 'wayback',
    title: 'Wayback Machine',
    year: '1996-now',
    category: 'Time Capsules',
    vibe: 'A time tunnel for pages that should have vanished.',
    action: 'Jump to archived versions of the web.',
    url: 'https://web.archive.org/',
    color: '#59d8ff',
  },
  {
    id: 'homestar',
    title: 'Homestar Runner',
    year: '2000',
    category: 'Time Capsules',
    vibe: 'Flash-era character comedy preserved with glorious nonsense.',
    action: 'Take the field trip. Bring headphones.',
    url: 'https://homestarrunner.com/',
    color: '#ff7448',
  },
  {
    id: 'newgrounds',
    title: 'Newgrounds',
    year: '1995',
    category: 'Games',
    vibe: 'The old portal where games, animations, and chaos learned to upload.',
    action: 'Open the classic creator arcade.',
    url: 'https://www.newgrounds.com/',
    color: '#ffb000',
  },
  {
    id: 'kongregate',
    title: 'Kongregate Badge Case',
    year: '2006',
    category: 'Games',
    vibe: 'Browser achievements, idle games, and a whole lot of tabs.',
    action: 'Browse the badge-era game portal.',
    url: 'https://www.kongregate.com/games',
    color: '#ff6a4a',
  },
  {
    id: 'armor-games',
    title: 'Armor Games Lobby',
    year: '2004',
    category: 'Games',
    vibe: 'Strategy games, dragons, and after-school tower defense.',
    action: 'Open another surviving arcade hallway.',
    url: 'https://armorgames.com/',
    color: '#8bff7a',
  },
  {
    id: 'neocities',
    title: 'Neocities',
    year: '2013',
    category: 'DIY Web',
    vibe: 'A living answer to “what if homepages were still homemade?”',
    action: 'Browse handmade sites and personal weirdness.',
    url: 'https://neocities.org/',
    color: '#8be8ff',
  },
  {
    id: 'kym',
    title: 'Know Your Meme',
    year: '2008',
    category: 'Memes',
    vibe: 'The citation desk for jokes that became load-bearing culture.',
    action: 'Research the origin of a phrase you forgot you knew.',
    url: 'https://knowyourmeme.com/',
    color: '#b6ff63',
  },
  {
    id: 'zombo',
    title: 'Zombo.com',
    year: '1999',
    category: 'Time Capsules',
    vibe: 'The purest welcome screen ever uploaded.',
    action: 'Go there and believe in possibility.',
    url: 'https://zombo.com/',
    color: '#ff66ff',
  },
  {
    id: 'webring',
    title: 'Webring Roulette',
    year: '1990s',
    category: 'DIY Web',
    vibe: 'A hallway of neighbors before feeds swallowed discovery.',
    action: 'Spin this app’s ring and get a tiny fake homepage prompt.',
    local: 'webring',
    color: '#33ffcc',
  },
  {
    id: 'guestbook',
    title: 'Guestbook Wall',
    year: '1998',
    category: 'DIY Web',
    vibe: 'Public comments before comments became a product strategy.',
    action: 'Stamp your name into the local museum guestbook.',
    local: 'guestbook',
    color: '#fff15c',
  },
  {
    id: 'do-not-touch',
    title: 'Do Not Touch',
    year: 'always',
    category: 'Toys',
    vibe: 'A button with the exact wrong label.',
    action: 'Press it until the page gets theatrical.',
    local: 'danger',
    color: '#ff4b4b',
  },
  {
    id: 'ascii',
    title: 'ASCII Sign Shop',
    year: '1970s-now',
    category: 'DIY Web',
    vibe: 'Text pretending to be architecture.',
    action: 'Make a blocky marquee for your imaginary homepage.',
    local: 'ascii',
    color: '#a8ffef',
  },
  {
    id: 'popup',
    title: 'Popup Aquarium',
    year: '2001',
    category: 'Toys',
    vibe: 'All the anxiety of popups, none of the malware.',
    action: 'Generate fake alerts and close them like a champ.',
    local: 'popups',
    color: '#c89bff',
  },
  {
    id: 'meme-lab',
    title: 'Meme Caption Lab',
    year: '2007',
    category: 'Memes',
    vibe: 'Top text, bottom text, ancient power.',
    action: 'Make a museum-grade bad caption.',
    local: 'meme',
    color: '#ffffff',
  },
  {
    id: 'smarterchild',
    title: 'SmarterChild Shrine',
    year: '2001',
    category: 'Bots',
    vibe: 'AIM’s robot friend who knew the weather and judged nobody.',
    action: 'Ask the local bot for a cursed exhibit recommendation.',
    local: 'bot',
    color: '#76a7ff',
  },
  {
    id: 'ask-jeeves',
    title: 'Ask Jeeves',
    year: '1997',
    category: 'Portals',
    vibe: 'A butler-shaped search engine for complete sentences.',
    action: 'File under “internet was once dressed for dinner.”',
    url: 'https://www.ask.com/',
    color: '#e4ff72',
  },
  {
    id: 'stumbleupon',
    title: 'StumbleUpon Ghost',
    year: '2001-2018',
    category: 'Portals',
    vibe: 'A discovery button that made boredom feel social.',
    action: 'Use this museum’s randomizer as a tiny tribute.',
    local: 'randomizer',
    color: '#ff8f5c',
  },
  {
    id: 'geocities',
    title: 'GeoCities Neighborhood',
    year: '1994-2009',
    category: 'DIY Web',
    vibe: 'Under-construction GIFs, tiled backgrounds, and personal kingdoms.',
    action: 'Build a fake homepage badge in the sign shop.',
    local: 'ascii',
    color: '#00e1ff',
  },
  {
    id: 'ebaums',
    title: "eBaum's World",
    year: '2001',
    category: 'Portals',
    vibe: 'A pre-feed cabinet of viral clips and office distractions.',
    action: 'Visit a portal that feels like a break-room legend.',
    url: 'https://www.ebaumsworld.com/',
    color: '#ffc744',
  },
  {
    id: 'yahoo-answers',
    title: 'Yahoo Answers Memorial',
    year: '2005-2021',
    category: 'Memes',
    vibe: 'The wrong answers were sometimes the point.',
    action: 'Open a random local prompt from the question vault.',
    local: 'question',
    color: '#d0a5ff',
  },
  {
    id: 'icanhas',
    title: 'I Can Has Cheezburger',
    year: '2007',
    category: 'Memes',
    vibe: 'The image macro factory with a grammar all its own.',
    action: 'Study the old caption dialect.',
    url: 'https://icanhas.cheezburger.com/',
    color: '#ffcbf0',
  },
  {
    id: 'imgflip',
    title: 'Imgflip Generator',
    year: '2011',
    category: 'Memes',
    vibe: 'Impact font never left; it just got a better form field.',
    action: 'Open a classic meme-making workbench.',
    url: 'https://imgflip.com/memegenerator',
    color: '#ffffff',
  },
  {
    id: 'ytmnd',
    title: 'YTMND Listening Post',
    year: '2001',
    category: 'Memes',
    vibe: 'A looping image, a loud sound, and a title doing most of the work.',
    action: 'Visit an old format that understood loops early.',
    url: 'https://www.ytmnd.com/',
    color: '#8bc6ff',
  },
  {
    id: 'yt-annotations',
    title: 'Annotation Maze',
    year: '2008-2019',
    category: 'Toys',
    vibe: 'Before cards, videos had clickable stickers everywhere.',
    action: 'Catch the runaway local sticker.',
    local: 'sticker',
    color: '#ff4141',
  },
  {
    id: 'flashpoint',
    title: 'Flashpoint Archive',
    year: '2018-now',
    category: 'Games',
    vibe: 'A preservation bunker for web games after Flash went dark.',
    action: 'See how browser games are being saved.',
    url: 'https://flashpointarchive.org/',
    color: '#7df8ff',
  },
  {
    id: 'archive-software',
    title: 'MS-DOS Shelf',
    year: '1980s-1990s',
    category: 'Time Capsules',
    vibe: 'Old software running in the browser like a spell.',
    action: 'Browse Internet Archive’s software library.',
    url: 'https://archive.org/details/software',
    color: '#c5ff6f',
  },
  {
    id: 'rathergood',
    title: 'RatherGood',
    year: '1999',
    category: 'Time Capsules',
    vibe: 'Surreal Flash humor from the deep shelf.',
    action: 'Take a short trip into old web comedy.',
    url: 'https://rathergood.com/',
    color: '#ff9aeb',
  },
  {
    id: 'y8',
    title: 'Y8 Games',
    year: '2006',
    category: 'Games',
    vibe: 'Lunch-period game portal energy.',
    action: 'Open a surviving arcade shelf.',
    url: 'https://www.y8.com/',
    color: '#ffd15c',
  },
  {
    id: 'coolmath',
    title: 'Coolmath Games',
    year: '1997',
    category: 'Games',
    vibe: 'The classroom tab that somehow stayed open.',
    action: 'Go play something that looks like homework.',
    url: 'https://www.coolmathgames.com/',
    color: '#75ff75',
  },
  {
    id: 'openprocessing',
    title: 'OpenProcessing',
    year: '2008',
    category: 'Toys',
    vibe: 'Sketchbook energy for code-art experiments.',
    action: 'Browse interactive sketches.',
    url: 'https://openprocessing.org/',
    color: '#68f0ff',
  },
  {
    id: 'hacker-typer',
    title: 'Hacker Typer',
    year: '2011',
    category: 'Toys',
    vibe: 'Mash keys, become cinema’s least accurate programmer.',
    action: 'Open the fake terminal and feel briefly powerful.',
    url: 'https://hackertyper.net/',
    color: '#4cff7a',
  },
  {
    id: 'cat-bounce',
    title: 'Cat Bounce',
    year: '2012',
    category: 'Toys',
    vibe: 'Physics, but with exactly the right amount of nonsense.',
    action: 'Open the bouncing browser toy.',
    url: 'https://cat-bounce.com/',
    color: '#ffc0f3',
  },
  {
    id: 'endless-horse',
    title: 'Endless Horse',
    year: '2015',
    category: 'Toys',
    vibe: 'A scroll joke with commitment issues in reverse.',
    action: 'Open the long-form vertical masterpiece.',
    url: 'https://endless.horse/',
    color: '#f9f4d7',
  },
  {
    id: 'windows93',
    title: 'Windows 93',
    year: '2014',
    category: 'Toys',
    vibe: 'A fake operating system full of browser mischief.',
    action: 'Open a desktop that should not exist.',
    url: 'https://www.windows93.net/',
    color: '#b4a7ff',
  },
  {
    id: 'pointer',
    title: 'Pointer Pointer',
    year: '2012',
    category: 'Toys',
    vibe: 'The internet locating your cursor with uncanny dedication.',
    action: 'Visit the pointiest museum exhibit.',
    url: 'https://pointerpointer.com/',
    color: '#ffffff',
  },
  {
    id: 'longdoge',
    title: 'Long Doge Challenge',
    year: '2013',
    category: 'Memes',
    vibe: 'A scroll joke that commits to the bit.',
    action: 'Keep scrolling. Regret nothing.',
    url: 'https://longdogechallenge.com/',
    color: '#ffe084',
  },
  {
    id: 'omfgdogs',
    title: 'OMFGDOGS',
    year: '2012',
    category: 'Time Capsules',
    vibe: 'A seizure-safe warning belongs here: pure flashing web maximalism.',
    action: 'Only visit if you are okay with intense flashing visuals.',
    url: 'https://www.omfgdogs.com/',
    color: '#ff4edb',
  },
]

const stamps: Stamp[] = [
  { id: 'first-click', label: 'Clicked Something', icon: MousePointerClick },
  { id: 'guestbook', label: 'Signed the Wall', icon: Mail },
  { id: 'danger', label: 'Ignored the Sign', icon: Zap },
  { id: 'randomizer', label: 'Got Bored Properly', icon: Shuffle },
  { id: 'meme', label: 'Captioned History', icon: Sticker },
  { id: 'ascii', label: 'Made a Homepage', icon: Palette },
]

const boredActivities = [
  'Rank three websites by how much they would scare a substitute teacher.',
  'Invent a fake browser toolbar button and give it one useless power.',
  'Find the most suspicious “download now” energy in the room.',
  'Write a guestbook entry as if it is 2004 and you just learned HTML.',
  'Click a link you would have emailed to your cousin in 2011.',
  'Make a meme caption with exactly one dramatic misspelling.',
  'Pick an exhibit and explain it to someone who has never seen a desktop computer.',
]

const guestbookSeeds = [
  'xX_sk8rMeg_Xx: site rox. dont change the bg.',
  'dialup_dad: loading this on purpose.',
  'limewire_librarian: came for one thing, downloaded a personality.',
]

const fakeQuestions = [
  'Why does my computer get heavier when I download more files?',
  'Can I print the internet before school tomorrow?',
  'Is my homepage legally allowed to have 17 animated flames?',
  'How many toolbars is too many toolbars?',
  'Where do popups go when they are closed?',
]

const botReplies = [
  'Try the exhibit with the most suspicious yellow.',
  'I searched the vibes and found one hundred tiny doors.',
  'Your fortune: a guestbook entry will become important later.',
  'Please rephrase as an away message.',
  'The museum recommends snacks and a second browser tab.',
]

const ringPrompts = [
  'A fan site for one discontinued cereal mascot.',
  'A homepage about storm chasing with three broken MIDI files.',
  'A shrine to transparent PNG buttons.',
  'A neighborhood watch page for haunted printers.',
  'A blog reviewing mall fountains by emotional impact.',
]

const popupCopy = [
  'You have won 1,000,000 cursor trails.',
  'Your vibe cache is full.',
  'A plugin named FUN32 wants to install nostalgia.',
  'This website would like to know your favorite toolbar.',
  'Warning: too much whimsy detected in tab 7.',
]

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(exhibits[0].id)
  const [collected, setCollected] = useState<string[]>([])
  const [guestbook, setGuestbook] = useState(guestbookSeeds)
  const [guestName, setGuestName] = useState('')
  const [guestMessage, setGuestMessage] = useState('')
  const [dangerLevel, setDangerLevel] = useState(0)
  const [activity, setActivity] = useState(boredActivities[0])
  const [asciiText, setAsciiText] = useState('FUN NET')
  const [memeTop, setMemeTop] = useState('when the page')
  const [memeBottom, setMemeBottom] = useState('has 42 buttons')
  const [botPrompt, setBotPrompt] = useState('')
  const [botReply, setBotReply] = useState(botReplies[0])
  const [ringPrompt, setRingPrompt] = useState(ringPrompts[0])
  const [popups, setPopups] = useState<string[]>([])
  const [stickerPosition, setStickerPosition] = useState({ x: 62, y: 38 })
  const [question, setQuestion] = useState(fakeQuestions[0])

  const selectedExhibit = exhibits.find((exhibit) => exhibit.id === selectedId) ?? exhibits[0]

  const filteredExhibits = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return exhibits.filter((exhibit) => {
      const matchesCategory = activeCategory === 'All' || exhibit.category === activeCategory
      const matchesQuery =
        !normalizedQuery ||
        [exhibit.title, exhibit.vibe, exhibit.action, exhibit.category, exhibit.year]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  const collectedStampSet = new Set(collected)

  const addStamp = (stampId: string) => {
    setCollected((current) => (current.includes(stampId) ? current : [...current, stampId]))
  }

  const selectExhibit = (exhibit: Exhibit) => {
    setSelectedId(exhibit.id)
    addStamp('first-click')
  }

  const randomExhibit = () => {
    const next = exhibits[Math.floor(Math.random() * exhibits.length)]
    setSelectedId(next.id)
    setActivity(boredActivities[Math.floor(Math.random() * boredActivities.length)])
    addStamp('randomizer')
  }

  const signGuestbook = () => {
    const name = guestName.trim() || 'anonymous surfer'
    const message = guestMessage.trim() || 'this site is under construction forever.'
    setGuestbook((current) => [`${name}: ${message}`, ...current].slice(0, 8))
    setGuestName('')
    setGuestMessage('')
    addStamp('guestbook')
  }

  const pressDanger = () => {
    setDangerLevel((level) => level + 1)
    addStamp('danger')
  }

  const makePopup = () => {
    setPopups((current) => [popupCopy[Math.floor(Math.random() * popupCopy.length)], ...current].slice(0, 5))
  }

  const askBot = () => {
    const promptWeight = botPrompt.length % botReplies.length
    setBotReply(botReplies[(Math.floor(Math.random() * botReplies.length) + promptWeight) % botReplies.length])
    setBotPrompt('')
  }

  const moveSticker = () => {
    setStickerPosition({
      x: 8 + Math.round(Math.random() * 76),
      y: 12 + Math.round(Math.random() * 64),
    })
  }

  const renderedAscii = `╔${'═'.repeat(asciiText.length + 4)}╗
║  ${asciiText.toUpperCase()}  ║
╚${'═'.repeat(asciiText.length + 4)}╝`

  return (
    <main className={`museum danger-${Math.min(dangerLevel, 6)}`}>
      <section className="hero-zone" aria-labelledby="page-title">
        <div className="hero-static" aria-hidden="true" />
        <nav className="top-bar" aria-label="Museum channels">
          <a href="../" className="home-link">Hackathon hub</a>
          <div className="channel-pills">
            <a href="#exhibits">Exhibits</a>
            <a href="#activities">Activities</a>
            <a href="#field-trips">Field trips</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="network-bug">Channel 404</p>
            <h1 id="page-title">Fun Internet Museum</h1>
            <p className="hero-line">
              Scroll the loudest hallway on the web: links, relics, toys, fake alerts, buttons you should not press, and field trips into internet folklore.
            </p>
            <div className="hero-actions">
              <button type="button" onClick={randomExhibit}>
                <Shuffle size={20} />
                Bored button
              </button>
              <a href="#activities">
                <Gamepad2 size={20} />
                Play the exhibits
              </a>
            </div>
          </div>

          <div className="tv-stack" aria-label="Now showing">
            <div className="tv-screen">
              <div className="scanlines" aria-hidden="true" />
              <div className="tv-label">NOW SHOWING</div>
              <h2>{selectedExhibit.title}</h2>
              <p>{selectedExhibit.vibe}</p>
              <button type="button" onClick={() => document.getElementById('spotlight')?.scrollIntoView({ behavior: 'smooth' })}>
                Tune in
              </button>
            </div>
            <div className="remote">
              {categories.slice(1, 7).map((category) => (
                <button key={category} type="button" onClick={() => setActiveCategory(category)}>
                  {category.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="Museum ticker">
        <div>
          <span>gif walls</span>
          <span>guestbooks</span>
          <span>Flash ghosts</span>
          <span>fake popups</span>
          <span>webrings</span>
          <span>chatbots</span>
          <span>portal pages</span>
          <span>do not touch</span>
        </div>
      </section>

      <section className="control-deck" id="exhibits" aria-label="Museum controls">
        <div className="search-box">
          <Search size={19} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search memes, bots, games, portals..."
            aria-label="Search exhibits"
          />
        </div>

        <div className="category-strip" aria-label="Filter exhibits">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={category === activeCategory ? 'active' : ''}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="spotlight" id="spotlight" aria-labelledby="spotlight-title">
        <div className="spotlight-copy">
          <p className="section-code">{selectedExhibit.category} / {selectedExhibit.year}</p>
          <h2 id="spotlight-title">{selectedExhibit.title}</h2>
          <p>{selectedExhibit.vibe}</p>
          <div className="spotlight-actions">
            {selectedExhibit.url && (
              <a href={selectedExhibit.url} target="_blank" rel="noreferrer" onClick={() => addStamp('first-click')}>
                Visit exhibit
                <ExternalLink size={18} />
              </a>
            )}
            {selectedExhibit.local && (
              <a href={`#${selectedExhibit.local}`}>
                Try local activity
                <MousePointerClick size={18} />
              </a>
            )}
          </div>
        </div>

        <div className="spotlight-object" style={{ '--exhibit-color': selectedExhibit.color } as React.CSSProperties}>
          <div className="orbital orbital-a" />
          <div className="orbital orbital-b" />
          <div className="artifact">
            <CassetteTape size={86} />
            <span>{selectedExhibit.action}</span>
          </div>
        </div>
      </section>

      <section className="feed" aria-label="Exhibit feed">
        {filteredExhibits.map((exhibit, index) => (
          <article
            className={`exhibit-row ${exhibit.id === selectedId ? 'selected' : ''}`}
            key={exhibit.id}
            style={{ '--row-color': exhibit.color, '--delay': `${(index % 8) * 40}ms` } as React.CSSProperties}
          >
            <button type="button" onClick={() => selectExhibit(exhibit)} aria-label={`Select ${exhibit.title}`}>
              <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="row-main">
                <strong>{exhibit.title}</strong>
                <span>{exhibit.vibe}</span>
              </span>
              <span className="row-meta">{exhibit.category}</span>
            </button>
          </article>
        ))}
      </section>

      <section className="activity-floor" id="activities" aria-labelledby="activities-title">
        <div className="section-heading">
          <p className="section-code">Playable wing</p>
          <h2 id="activities-title">Touch everything</h2>
        </div>

        <div className="activity-grid">
          <section className="activity-panel randomizer" id="randomizer">
            <div className="panel-heading">
              <Shuffle />
              <h3>Bored Button Booth</h3>
            </div>
            <p>{activity}</p>
            <button type="button" onClick={randomExhibit}>I am bored again</button>
          </section>

          <section className="activity-panel danger-button" id="danger">
            <div className="panel-heading">
              <Zap />
              <h3>Do Not Touch</h3>
            </div>
            <button type="button" onClick={pressDanger}>
              {dangerLevel === 0 ? 'Do not touch' : dangerLevel < 4 ? 'Seriously stop' : 'Okay now it is part of the exhibit'}
            </button>
            <p>Incident counter: {dangerLevel}</p>
          </section>

          <section className="activity-panel guestbook" id="guestbook">
            <div className="panel-heading">
              <Mail />
              <h3>Guestbook Wall</h3>
            </div>
            <div className="form-row">
              <input value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="screen name" />
              <input value={guestMessage} onChange={(event) => setGuestMessage(event.target.value)} placeholder="message" />
              <button type="button" onClick={signGuestbook}>Sign</button>
            </div>
            <ul>
              {guestbook.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </section>

          <section className="activity-panel ascii" id="ascii">
            <div className="panel-heading">
              <Palette />
              <h3>ASCII Sign Shop</h3>
            </div>
            <input
              value={asciiText}
              onChange={(event) => {
                setAsciiText(event.target.value.slice(0, 18))
                addStamp('ascii')
              }}
              aria-label="ASCII sign text"
            />
            <pre>{renderedAscii}</pre>
          </section>

          <section className="activity-panel popup-lab" id="popups">
            <div className="panel-heading">
              <Ghost />
              <h3>Popup Aquarium</h3>
            </div>
            <button type="button" onClick={makePopup}>Spawn fake alert</button>
            <div className="popup-stage">
              {popups.length === 0 && <span>No alerts. Suspicious.</span>}
              {popups.map((popup, index) => (
                <button key={`${popup}-${index}`} type="button" onClick={() => setPopups((current) => current.filter((_, popupIndex) => popupIndex !== index))}>
                  <strong>INTERNET NOTICE</strong>
                  {popup}
                </button>
              ))}
            </div>
          </section>

          <section className="activity-panel meme" id="meme">
            <div className="panel-heading">
              <Sticker />
              <h3>Meme Caption Lab</h3>
            </div>
            <div className="meme-maker">
              <input value={memeTop} onChange={(event) => setMemeTop(event.target.value)} aria-label="Top meme text" />
              <div className="meme-frame" onClick={() => addStamp('meme')} role="presentation">
                <strong>{memeTop}</strong>
                <Cat size={76} />
                <strong>{memeBottom}</strong>
              </div>
              <input value={memeBottom} onChange={(event) => setMemeBottom(event.target.value)} aria-label="Bottom meme text" />
            </div>
          </section>

          <section className="activity-panel bot" id="bot">
            <div className="panel-heading">
              <MessageCircleQuestion />
              <h3>Smarter-ish Child</h3>
            </div>
            <div className="chat-bubble">{botReply}</div>
            <div className="form-row">
              <input value={botPrompt} onChange={(event) => setBotPrompt(event.target.value)} placeholder="ask the ancient bot" />
              <button type="button" onClick={askBot}>Ask</button>
            </div>
          </section>

          <section className="activity-panel webring" id="webring">
            <div className="panel-heading">
              <RadioTower />
              <h3>Webring Roulette</h3>
            </div>
            <p>{ringPrompt}</p>
            <button
              type="button"
              onClick={() => {
                setRingPrompt(ringPrompts[Math.floor(Math.random() * ringPrompts.length)])
              }}
            >
              Next neighbor
            </button>
          </section>

          <section className="activity-panel sticker-game" id="sticker">
            <div className="panel-heading">
              <MousePointerClick />
              <h3>Annotation Maze</h3>
            </div>
            <div className="sticker-stage">
              <button
                type="button"
                style={{ left: `${stickerPosition.x}%`, top: `${stickerPosition.y}%` }}
                onClick={moveSticker}
              >
                click me
              </button>
            </div>
          </section>

          <section className="activity-panel question" id="question">
            <div className="panel-heading">
              <Sparkles />
              <h3>Question Vault</h3>
            </div>
            <p>{question}</p>
            <button type="button" onClick={() => setQuestion(fakeQuestions[Math.floor(Math.random() * fakeQuestions.length)])}>
              New question
            </button>
          </section>
        </div>
      </section>

      <section className="stamp-board" aria-labelledby="stamp-title">
        <div>
          <p className="section-code">Collection</p>
          <h2 id="stamp-title">Museum stamps</h2>
        </div>
        <div className="stamps">
          {stamps.map((stamp) => {
            const Icon = stamp.icon
            const earned = collectedStampSet.has(stamp.id)
            return (
              <div className={earned ? 'stamp earned' : 'stamp'} key={stamp.id}>
                <Icon size={22} />
                <span>{stamp.label}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="field-trips" id="field-trips" aria-labelledby="field-title">
        <div className="section-heading">
          <p className="section-code">Outbound doors</p>
          <h2 id="field-title">Leave through the gift shop</h2>
        </div>
        <div className="trip-grid">
          {exhibits
            .filter((exhibit) => exhibit.url)
            .map((exhibit) => (
              <a key={exhibit.id} href={exhibit.url} target="_blank" rel="noreferrer">
                <span>{exhibit.title}</span>
                <ExternalLink size={16} />
              </a>
            ))}
        </div>
      </section>
    </main>
  )
}

export default App
