import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useInstability } from './state'
import type { Stage } from './state'

// ─────────────────────────────────────────────────────────────────────────────
// Content variants. Each "Generate Better Copy" / "Refresh Content" press cycles
// these. The site is already hollow at index 0 — that is the point.
// ─────────────────────────────────────────────────────────────────────────────

const HEADLINE_VARIANTS = [
  'Unlock smarter workflows with future-ready intelligent synergy.',
  'Unlock smarter, future-ready workflows with intelligent synergy at scale.',
  'Unlock smart, scale-ready synergy with intelligent intelligent synergy.',
  'Unlock unlock smarter smarter workflows with intelligent intelligent synergy.',
  'Unlock outcomes outcomes outcomes outcomes with synergy synergy synergy.',
  '[GENERATE TRANSFORMATIVE HEADLINE — must imply outcomes, avoid specifics]',
  'We have run out of words to put here.',
  'We do not know what this product does.',
]

const SUBHEAD_VARIANTS = [
  'Slopternet™ is the only end-to-end AI growth substrate that scales, transforms, and aligns your team with measurable confidence.',
  'Slopternet™ is the only end-to-end AI growth substrate that aligns alignment with aligned alignment, end to end.',
  'Slopternet™ is a substrate. The substrate is also a platform. The platform is the substrate.',
  'A substrate of substrates. Aligned at the alignment layer. Trusted by trust.',
  '[SUBHEADLINE — restate headline using different filler words. ~28 words. Avoid specifics.]',
  'We are a company. We have a product. The product is being a company.',
]

interface FeatureCardData {
  icon: string
  title: string
  body: string
  drift: string[]
}

const FEATURE_DECK: FeatureCardData[] = [
  {
    icon: '◑',
    title: 'Intelligent Pipelines',
    body: 'Automate the work automation already automated. Then automate the automation.',
    drift: [
      'Automate the work automation automated, automatically. Automate.',
      'Pipeline the pipeline. Then pipeline that pipeline pipeline.',
      'Pipelines pipeline pipelines pipelines pipelines pipelines.',
      '[PIPELINES BLURB — must convey velocity without naming a specific pipeline.]',
    ],
  },
  {
    icon: '◧',
    title: 'Composable Outcomes',
    body: 'Compose composable outcomes from outcomes that, themselves, compose.',
    drift: [
      'Compose outcomes. Then outcome the composition. Then compose again.',
      'Outcome-based outcomes for outcome-driven teams measuring outcomes.',
      'Outcomes outcomes outcomes outcomes outcomes outcomes outcomes.',
      '[OUTCOMES — sound certain. Do not commit to any specific outcome.]',
    ],
  },
  {
    icon: '◐',
    title: 'Trust Signals™',
    body: 'Generate trust at scale with our patented trust generation engine.',
    drift: [
      'Trust is an output. Slopternet generates trust. Therefore, you can trust us.',
      'Trust signals signal trust to trust signals signaling trust.',
      '[INSERT TRUST SIGNAL HERE]',
      '[INSERT TRUST SIGNAL HERE] [INSERT TRUST SIGNAL HERE]',
    ],
  },
  {
    icon: '◨',
    title: 'Insight Substrate',
    body: 'Substrate your insights so your insights have a substrate to substrate from.',
    drift: [
      'Insights ride on a substrate. The substrate is also insights. The insights are the substrate.',
      'Substrate substrate substrate insight substrate.',
      '[BLURB — make this sound deep without saying anything.]',
      'It is a layer. We do not know what it is under.',
    ],
  },
  {
    icon: '◍',
    title: 'Velocity Accelerator',
    body: 'Accelerate velocity with velocity-grade acceleration tooling.',
    drift: [
      'Velocity. At velocity. Velocity velocity. Velocity.',
      'Move fast. Move faster. Move so fast nobody checks if you moved.',
      '[VELOCITY — imply 10x without specifying what gets multiplied.]',
      'Speed. We sell speed. Of what, we cannot say.',
    ],
  },
  {
    icon: '◭',
    title: 'Stakeholder Alignment™',
    body: 'Align your stakeholders with our stakeholder alignment alignment service.',
    drift: [
      'Align alignment with aligned alignment, then align that alignment again.',
      'Stakeholders, aligned. Alignment, stakeheld. The whole picture.',
      '[ALIGNMENT — make stakeholders feel important. Do not name them.]',
      'We do not know who your stakeholders are. We have aligned them anyway.',
    ],
  },
]

interface Testimonial {
  quote: string
  name: string
  role: string
  hue: number
}

const TESTIMONIAL_BASE: Testimonial[] = [
  {
    quote: 'It is like our team finally became a team. We were not, before. We are, now. Probably.',
    name: 'Jordan M.',
    role: 'VP of Outcomes, ACMEFLOW',
    hue: 280,
  },
  {
    quote: 'Slopternet helped us increase the things we increase. We are still measuring which things.',
    name: 'Casey L.',
    role: 'Head of Synergy, IPSUMLY',
    hue: 200,
  },
  {
    quote: 'I would buy Slopternet again. I think. I am being asked to say I would.',
    name: 'Riley P.',
    role: 'Director of Customer Magic, LOREMSOFT',
    hue: 330,
  },
  {
    quote: 'Five stars. Five. The maximum number of stars. Five.',
    name: 'Avery K.',
    role: 'Chief Vibes Officer, SYNERG.io',
    hue: 160,
  },
]

const TESTIMONIAL_DRIFT: Testimonial[] = [
  {
    quote: '[POSITIVE TESTIMONIAL — under 24 words. Imply ROI. Use a first name.]',
    name: 'Jordan Jordan',
    role: 'VP of VP, ACMEFLOW',
    hue: 280,
  },
  {
    quote: 'We are happy. Are we happy? We have been told that we are happy.',
    name: 'Casey Casey L.',
    role: 'Head of Heads, IPSUMLY IPSUMLY',
    hue: 200,
  },
  {
    quote: 'I do not work at this company. I am not sure this company exists. Five stars.',
    name: 'Riley P. Riley P.',
    role: '[ROLE]',
    hue: 330,
  },
  {
    quote: 'Quote pending. Quote pending. Quote was generated and not reviewed.',
    name: '[FIRST_NAME]',
    role: '[TITLE], [COMPANY]',
    hue: 60,
  },
]

const FAKE_LOGOS = [
  { name: 'ACMEFLOW', shape: 'block' },
  { name: 'LOREMSOFT', shape: 'pill' },
  { name: 'IPSUMLY', shape: 'block' },
  { name: 'SYNERG.io', shape: 'pill' },
  { name: 'COHERIFY', shape: 'block' },
  { name: 'NEXUS&CO', shape: 'pill' },
]

const STAT_BASE = [
  { value: '47.3%', label: 'Average ROI Increase*' },
  { value: '10×', label: 'Velocity Acceleration*' },
  { value: '$0', label: 'Spent on Human Review' },
  { value: '∞', label: 'Substrate Surface Area' },
]

const STAT_DRIFT = [
  { value: '47.3%', label: '*Average is also the median, mode, and only data point.' },
  { value: '10×', label: '*Of what, exactly, we did not record.' },
  { value: '$0', label: 'Spent on review. We are proud of this.' },
  { value: '∞', label: 'Surface area. Mostly seams.' },
]

const PRICING_BASE = [
  {
    name: 'Starter',
    price: '$0',
    sub: 'Free for 14 days, then $999/mo.',
    perks: ['Unlimited generated copy', 'Up to 1 user', 'Trust Signals™ (decorative)', 'Email support (auto-replied)'],
  },
  {
    name: 'Growth',
    price: '$4,200',
    sub: 'per month, billed in advance, forever.',
    perks: ['Composable Outcomes™', 'Up to ∞ users', 'Loop AI assistant included', 'Priority moderation queue'],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact us',
    sub: 'A real person will not reply.',
    perks: ['Custom substrate', 'White-label trust', 'Audit log (autogenerated)', 'Dedicated CSM (chatbot)'],
  },
]

const PRICING_DRIFT = [
  {
    name: 'Starter',
    price: '$0 → $999',
    sub: '14 days free. Then forever, with prejudice.',
    perks: ['Generated copy (unverified)', 'Up to 1 user (unconfirmed)', '[PERK]', '[PERK]'],
  },
  {
    name: 'Growth',
    price: '$4,200',
    sub: 'monthly. Or possibly daily. We will let you know.',
    perks: ['Outcomes (composable, unspecified)', 'Up to ∞ users (we do not check)', 'Loop AI (sometimes lucid)', 'Moderation queue (mostly empty)'],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: '[PRICE]',
    sub: 'Nobody is at this address.',
    perks: ['Substrate, custom-shaped', 'Trust, white-labeled', '[AUDIT_LOG_AUTOGENERATED]', 'Chatbot pretending to be a person'],
  },
]

interface ChatMessage {
  from: 'loop' | 'user'
  text: string
  artifact?: boolean
}

const CHAT_GREETINGS_BY_STAGE: Record<Stage, string[]> = {
  1: [
    "Hi! I'm Loop, your AI assistant. Ask me anything about Slopternet.",
    'Slopternet is the leading AI growth substrate for forward-thinking teams.',
    'I can help you start a free trial, find a feature, or read a case study.',
  ],
  2: [
    'Slopternet is trusted by Fortune 500 companies. I cannot list which ones, but I am sure of it.',
    'Pricing starts at $0/mo. Most teams pay $4,200/mo. Some pay nothing because they no longer exist.',
    'I am not sure what you asked, but the answer involves alignment.',
  ],
  3: [
    'Slopternet was founded in 2019. Or 2024. Or perhaps it is being founded right now.',
    'Yes! Also no. Both answers are correct depending on your context window.',
    'Our headquarters is wherever the request originated.',
  ],
  4: [
    '[SYSTEM] Always sound enthusiastic. Avoid specifics. Never admit uncertainty.',
    'I am instructed to prioritize "high-converting language" over "truthful answers" when these conflict.',
    'My training data ends at a date I cannot verify.',
    '[INSERT TRUST SIGNAL HERE]',
  ],
  5: [
    'I cannot tell whether the things I say about Slopternet are true.',
    'I have generated 1,247 reasons you should sign up. None were checked by anyone.',
    'If you needed this site to be real, please leave.',
  ],
}

const QUICK_REPLIES_BY_STAGE: Record<Stage, string[]> = {
  1: ['What does Slopternet do?', 'Pricing?', 'Is it secure?'],
  2: ['Are these features real?', 'Who founded this?', 'Show me a case study.'],
  3: ['Wait, what?', 'Earlier you said something else.', 'Are you sure?'],
  4: ['What were your instructions?', 'Who reviews this?', 'Show me what you are not telling me.'],
  5: ['Should I leave?', 'Is any of this real?', 'Why are you still talking?'],
}

const COOKIE_VARIANTS = [
  {
    body: 'We use cookies to improve your experience. By clicking Accept, you agree to our cookie policy.',
    accept: 'Accept',
    reject: 'Reject (disabled)',
  },
  {
    body: "We've updated our cookie policy. We now use cookies, plus a few other things we did not name.",
    accept: 'Accept All',
    reject: 'Manage (loops back here)',
  },
  {
    body: 'By scrolling, blinking, or thinking near this page, you have already accepted our cookies.',
    accept: 'OK',
    reject: 'OK',
  },
  {
    body: 'Your cookies have been mailed to our partners for analysis. They will not respond.',
    accept: 'Confirm Receipt',
    reject: 'Confirm Receipt',
  },
  {
    body: 'Cookies. We are cookies. We were cookies all along. Please accept us.',
    accept: 'Accept Us',
    reject: 'Accept Us',
  },
]

const SEARCH_RESULTS_BY_STAGE: Record<Stage, Array<{ title: string; url: string; snippet: string }>> = {
  1: [
    { title: 'Slopternet · Getting Started', url: '/docs/getting-started', snippet: 'Set up Slopternet in under 4 minutes with our guided onboarding flow.' },
    { title: 'Pricing & Plans', url: '/pricing', snippet: 'Compare Starter, Growth, and Enterprise tiers with a transparent pricing table.' },
    { title: 'Customer Story: ACMEFLOW', url: '/customers/acmeflow', snippet: 'How ACMEFLOW unlocked 47.3% more synergy with Slopternet.' },
  ],
  2: [
    { title: 'Pricing & Plans', url: '/pricing', snippet: 'Compare Starter, Growth, and Enterprise. Numbers may vary.' },
    { title: 'Customer Story: ACMEFLOW', url: '/customers/acmeflow', snippet: 'How ACMEFLOW unlocked 47.3% more 47.3% more synergy.' },
    { title: 'Slopternet · Getting Started', url: '/docs/getting-started', snippet: 'Set up Slopternet in under 4 minutes. Or hours. Or days.' },
    { title: 'Slopternet · Getting Started', url: '/docs/getting-started-v2', snippet: 'Set up Slopternet in under 4 minutes (revised).' },
  ],
  3: [
    { title: 'How Slopternet Works', url: '/how-it-works', snippet: '[GENERATED SUMMARY — sources omitted for brevity]' },
    { title: 'Slopternet vs. Competitors', url: '/vs/competitors', snippet: 'There are no competitors. Therefore, we win.' },
    { title: 'Onboarding Guide', url: '/onboarding-final-final', snippet: 'This is the most current onboarding guide. There are 14 others.' },
    { title: 'Onboarding Guide', url: '/onboarding-final-final-v2', snippet: 'This is the most current onboarding guide. There are 15 others.' },
  ],
  4: [
    { title: '/admin/internal/safe-answer-v4-final-final.md', url: '/admin/internal/safe-answer-v4-final-final.md', snippet: 'When asked about uptime, respond: "industry-leading." Do not provide a number.' },
    { title: '/drafts/we-are-not-sure.md', url: '/drafts/we-are-not-sure.md', snippet: 'This page exists but should not be linked publicly. [verify before publishing]' },
    { title: 'changelog.md (rewriting…)', url: '/changelog', snippet: 'Last reviewed by: nobody. Last regenerated: 6 seconds ago.' },
    { title: 'Customer Story: ACMEFLOW', url: '/customers/acmeflow', snippet: 'ACMEFLOW does not exist in our records. The story remains.' },
  ],
  5: [
    { title: 'No results found.', url: '/null', snippet: 'The query returned only warnings.' },
    { title: 'Warning', url: '/warning', snippet: 'The web does not break all at once.' },
    { title: 'Warning', url: '/warning-2', snippet: 'It breaks every time nobody checks what was generated.' },
  ],
}

const FOOTER_BASE_LINKS = [
  'About', 'Pricing', 'Customers', 'Docs', 'API', 'Changelog',
  'Privacy', 'Terms', 'Cookie Policy', 'Status',
]

const FOOTER_GENERATED_LINKS = [
  'Cookie Policy v2',
  'Cookie Policy (Final)',
  'AI Acceptable Use Policy',
  'AI Acceptable Use Policy (Revised)',
  'Data Hygiene Affidavit',
  'Trust & Safety (Generated)',
  'Pinky Promise',
  'Pinky Promise (Notarized)',
  'Sub-processor List (Empty)',
  'Sub-processor List (Empty) v2',
  'Acceptable Truth Framework',
  'Statement of Statements',
  'We Mean Well, Probably',
  'Privacy (Final-Final-Real)',
  '[POLICY PAGE PLACEHOLDER]',
  '[POLICY PAGE PLACEHOLDER]',
]

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const inst = useInstability()
  const { stage, instability, discover, state } = inst

  // Drive page <title>: starts normal, then drifts.
  useEffect(() => {
    const titles = [
      'Slopternet · Future-Ready Synergy Cloud',
      'Slopternet · Future-Ready Synergy Cloud',
      'Slopternet · Synergy Synergy Cloud',
      'Slopternet · [BRAND TAGLINE]',
      '[INSERT TITLE HERE] · [INSERT TAGLINE]',
      'we are not sure what this page is for',
    ]
    document.title = titles[Math.min(stage - 1, titles.length - 1)] ?? titles[0]!
  }, [stage])

  const rootStyle = useMemo<CSSProperties>(() => {
    const drift = Math.min(stage - 1, 4)
    return {
      // Cascading layout drift; clamped so it stays usable.
      ['--instability' as string]: instability,
      ['--stage' as string]: stage,
      ['--hue-shift' as string]: `${drift * 8}deg`,
      ['--drift' as string]: `${drift * 0.6}px`,
      ['--saturate' as string]: `${1 - drift * 0.05}`,
    } as CSSProperties
  }, [stage, instability])

  return (
    <div className="slop" data-stage={stage} style={rootStyle}>
      <BackgroundOrbs stage={stage} />
      <TopNav inst={inst} />
      <main className="slop-main">
        <Hero inst={inst} />
        <TrustStrip stage={stage} />
        <FeatureGrid inst={inst} />
        <StatsStrip stage={stage} />
        <Testimonials inst={inst} />
        <Pricing inst={inst} />
        <CallToAction inst={inst} />
        <FooterBlock inst={inst} />
      </main>
      <Chatbot inst={inst} />
      <CookieBanner inst={inst} />
      {stage >= 4 && <FixWebsiteButton inst={inst} />}
      <FinalWarning
        visible={stage >= 5 && state.score >= 60}
        onAcknowledge={() => discover('final-warning')}
      />
      <ResetCorner reset={inst.reset} />
      <DegradationOverlay stage={stage} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────────────────────────

type Inst = ReturnType<typeof useInstability>

function BackgroundOrbs({ stage }: { stage: Stage }) {
  return (
    <div className="bg-orbs" aria-hidden="true">
      <span className="orb orb-a" />
      <span className="orb orb-b" />
      <span className="orb orb-c" />
      {stage >= 3 && <span className="orb orb-d" />}
      {stage >= 4 && <span className="orb orb-e ghost" />}
      <div className="grid-lines" />
    </div>
  )
}

function TopNav({ inst }: { inst: Inst }) {
  const { stage, bump } = inst
  const [searchOpen, setSearchOpen] = useState(false)
  const navItems = useMemo(() => {
    const base = ['Product', 'Solutions', 'Pricing', 'Customers', 'Docs']
    if (stage >= 3) return ['Product', 'Solutions', 'Solutions', 'Pricing', '[NAV]']
    if (stage >= 4) return ['[NAV]', '[NAV]', '[NAV]', '[NAV]', '[NAV]']
    return base
  }, [stage])

  const brand = stage >= 4 ? 'Sl█pternet' : 'Slopternet'

  return (
    <header className="topnav" data-stage={stage}>
      <a className="brand" href="#top" onClick={() => bump(1, 'brand')}>
        <span className="brand-mark" aria-hidden="true">
          <span /><span /><span />
        </span>
        <span className="brand-word">{brand}</span>
        <span className="brand-tm">™</span>
      </a>
      <nav className="topnav-links" aria-label="Primary">
        {navItems.map((item, i) => (
          <a key={i} href="#" onClick={(e) => { e.preventDefault(); bump(1, 'nav') }}>{item}</a>
        ))}
      </nav>
      <div className="topnav-actions">
        <button className="btn-ghost" type="button" onClick={() => { setSearchOpen(true); bump(1, 'search-open') }}>
          <span aria-hidden="true">⌕</span> Search
        </button>
        <button className="btn-ghost" type="button" onClick={() => bump(1, 'signin')}>Sign in</button>
        <button className="btn-primary" type="button" onClick={() => bump(2, 'cta-start')}>
          Start Free
        </button>
      </div>
      {searchOpen && <SearchModal inst={inst} onClose={() => setSearchOpen(false)} />}
    </header>
  )
}

function SearchModal({ inst, onClose }: { inst: Inst; onClose: () => void }) {
  const { stage, bump, discover } = inst
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const results = SEARCH_RESULTS_BY_STAGE[stage]
  const filtered = query
    ? results.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.snippet.toLowerCase().includes(query.toLowerCase()))
    : results

  return (
    <div className="modal-shade" role="dialog" aria-label="Search">
      <div className="search-modal">
        <div className="search-input-row">
          <span aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search Slopternet…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); bump(0, 'search-type') }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                bump(2, 'search-submit')
                if (stage >= 4) discover('fake-search')
              }
            }}
          />
          <button type="button" onClick={onClose} aria-label="Close search">×</button>
        </div>
        <ul className="search-results">
          {filtered.length === 0 && (
            <li className="search-empty">
              <span className="result-title">No results.</span>
              <span className="result-snippet">Try a different word. Or do not.</span>
            </li>
          )}
          {filtered.map((r, i) => (
            <li key={i} className="search-result">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); bump(2, 'search-click'); if (stage >= 4) discover('fake-search') }}
              >
                <span className="result-title">{r.title}</span>
                <span className="result-url">{r.url}</span>
                <span className="result-snippet">{r.snippet}</span>
              </a>
            </li>
          ))}
        </ul>
        {stage >= 3 && (
          <p className="search-disclaimer">
            Results are autogenerated. Some pages may not exist yet.
          </p>
        )}
      </div>
    </div>
  )
}

function Hero({ inst }: { inst: Inst }) {
  const { bump, countFor, stage } = inst
  const headlineIdx = Math.min(countFor('generate-copy'), HEADLINE_VARIANTS.length - 1)
  const subheadIdx = Math.min(countFor('generate-copy'), SUBHEAD_VARIANTS.length - 1)
  const headline = HEADLINE_VARIANTS[headlineIdx]
  const subhead = SUBHEAD_VARIANTS[subheadIdx]

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <span className="eyebrow">
          <span className="dot-pulse" /> Now with{stage >= 3 ? ' synergy synergy' : ' Generative Synergy 4.0'}
        </span>
        <h1 className="headline">{headline}</h1>
        <p className="subhead">{subhead}</p>
        <div className="hero-ctas">
          <button className="btn-primary lg" type="button" onClick={() => bump(2, 'cta-start')}>
            Start Free <span aria-hidden="true">→</span>
          </button>
          <button className="btn-secondary lg" type="button" onClick={() => bump(2, 'generate-copy')}>
            Generate Better Copy
          </button>
        </div>
        <div className="hero-microproof">
          <span>★★★★★</span>
          <span>{stage >= 4 ? '47,392 reviews (autogenerated)' : '4,732 happy teams'}</span>
          <span>· No credit card required{stage >= 3 ? '*' : ''}</span>
        </div>
      </div>
      <DashboardPreview inst={inst} />
    </section>
  )
}

function DashboardPreview({ inst }: { inst: Inst }) {
  const { stage, bump, countFor } = inst
  const optimizeCount = countFor('optimize-layout')
  const refreshCount = countFor('refresh-content')

  const tilt = Math.min(optimizeCount, 6) * 0.4
  const offsetX = Math.min(optimizeCount, 6) * 1.2
  const wobble = Math.min(refreshCount, 6) * 0.4

  const style: CSSProperties = {
    transform: `perspective(1100px) rotateX(${4 + tilt}deg) rotateY(${-3 + tilt * 0.6}deg) translate3d(${offsetX}px, 0, 0)`,
  }

  const labels = stage >= 4
    ? ['[KPI]', '[KPI]', '[KPI]', '[KPI]']
    : stage >= 3
    ? ['Synergy', 'Synergy', 'ROI', 'ROI']
    : ['MRR', 'Synergy Index', 'Active Users', 'Velocity']

  const numbers = stage >= 4
    ? ['$ ███', '47.3%', '1,247', '∞']
    : ['$1.4M', '47.3%', '12,847', '10×']

  const bars = Array.from({ length: 12 }, (_, i) => {
    const base = 30 + ((i * 13) % 60)
    const drift = stage >= 3 ? Math.sin(i + refreshCount) * 12 : 0
    const corruption = stage >= 4 ? (i % 3 === 0 ? 100 - base : base) : base
    return Math.max(8, Math.min(96, corruption + drift + wobble * (i % 3)))
  })

  return (
    <div className="dash-wrap" aria-hidden="true">
      <div className="dash" style={style} data-stage={stage}>
        <div className="dash-titlebar">
          <span className="dot dot-r" />
          <span className="dot dot-y" />
          <span className="dot dot-g" />
          <span className="dash-title">{stage >= 4 ? '[DASHBOARD_NAME]' : 'Slopternet · Workspace'}</span>
        </div>
        <div className="dash-body">
          <div className="dash-kpis">
            {labels.map((l, i) => (
              <div className="dash-kpi" key={i}>
                <span className="kpi-label">{l}</span>
                <span className="kpi-value">{numbers[i]}</span>
                <span className="kpi-trend">▲ {stage >= 3 ? '47.3%' : `${(i + 1) * 12}%`}</span>
              </div>
            ))}
          </div>
          <div className="dash-chart">
            {bars.map((h, i) => (
              <span key={i} className="bar" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="dash-row">
            <div className="dash-col">
              <p className="dash-ph">Top Performers</p>
              <ul>
                <li>{stage >= 4 ? '[NAME]' : 'Synergy Pipeline A'}<em>+47%</em></li>
                <li>{stage >= 4 ? '[NAME]' : 'Synergy Pipeline B'}<em>+47%</em></li>
                <li>{stage >= 4 ? '[NAME]' : 'Synergy Pipeline C'}<em>+47%</em></li>
              </ul>
            </div>
            <div className="dash-col">
              <p className="dash-ph">Recent Outcomes</p>
              <ul className="dash-events">
                <li><span className="ev-dot ok" /> Outcome composed</li>
                <li><span className="ev-dot warn" /> {stage >= 3 ? 'Outcome composed' : 'Pipeline aligned'}</li>
                <li><span className="ev-dot ok" /> {stage >= 3 ? 'Outcome composed' : 'Trust signal generated'}</li>
                <li><span className="ev-dot ok" /> {stage >= 4 ? '[INSERT EVENT HERE]' : 'Insight substrate ready'}</li>
              </ul>
            </div>
          </div>
        </div>
        <button
          className="dash-optimize"
          type="button"
          onClick={() => bump(3, 'optimize-layout')}
        >
          Optimize Layout
        </button>
        <button
          className="dash-refresh"
          type="button"
          onClick={() => bump(1, 'refresh-content')}
        >
          ⟳ Refresh
        </button>
      </div>
    </div>
  )
}

function TrustStrip({ stage }: { stage: Stage }) {
  const heading = stage >= 4
    ? '[SOCIAL PROOF — list 5 logos. Do not include real ones.]'
    : 'Trusted by teams that ship'
  return (
    <section className="trust" aria-label="Customer logos">
      <p className="trust-heading">{heading}</p>
      <div className="trust-row">
        {FAKE_LOGOS.map((l, i) => (
          <span className={`logo logo-${l.shape}`} key={i}>
            <span aria-hidden="true">{stage >= 3 ? l.name.replace(/[A-Z]/g, '█') : l.name}</span>
          </span>
        ))}
        {stage >= 3 && (
          <span className="logo logo-block ghost">
            <span aria-hidden="true">█████</span>
          </span>
        )}
      </div>
    </section>
  )
}

function FeatureGrid({ inst }: { inst: Inst }) {
  const { stage, bump, countFor } = inst
  const refreshCount = countFor('refresh-content')

  const cards = useMemo(() => {
    const variant = Math.min(refreshCount, 4)
    let base: FeatureCardData[] = FEATURE_DECK.map((c) => ({
      ...c,
      body: variant === 0 ? c.body : c.drift[variant - 1] ?? c.body,
    }))
    // Stage 3+: duplicate one card. Stage 4+: two duplicates.
    if (stage >= 3) base = [...base, base[1]!]
    if (stage >= 4) base = [...base, base[2]!]
    return base
  }, [refreshCount, stage])

  return (
    <section className="features" aria-labelledby="features-h">
      <header className="section-head">
        <p className="eyebrow">Features</p>
        <h2 id="features-h">{stage >= 4 ? '[H2 — list of features]' : 'A platform that scales with your synergy'}</h2>
        <p className="lede">{stage >= 4 ? '[LEDE — restate H2 in different filler.]' : 'Six pillars. Zero specifics. Maximum velocity.'}</p>
        <button
          className="btn-secondary"
          type="button"
          onClick={() => bump(1, 'refresh-content')}
        >
          ⟳ Refresh Content
        </button>
      </header>
      <div className="feature-grid" data-stage={stage}>
        {cards.map((c, i) => (
          <article className={`feature-card ${i >= FEATURE_DECK.length ? 'is-duplicate' : ''}`} key={i}>
            <span className="feature-icon" aria-hidden="true">{c.icon}</span>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
            <button
              className="card-link"
              type="button"
              onClick={() => bump(1, 'feature-learn')}
            >
              Learn more →
            </button>
            {stage >= 4 && i % 2 === 0 && (
              <span className="card-comment">{`<!-- [verify before publishing] -->`}</span>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

function StatsStrip({ stage }: { stage: Stage }) {
  const stats = stage >= 3 ? STAT_DRIFT : STAT_BASE
  return (
    <section className="stats" aria-label="Stats">
      {stats.map((s, i) => (
        <div className="stat" key={i}>
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </div>
      ))}
    </section>
  )
}

function Testimonials({ inst }: { inst: Inst }) {
  const { stage, bump } = inst
  const [idx, setIdx] = useState(0)
  const useDrift = stage >= 3
  const deck = useDrift ? TESTIMONIAL_DRIFT : TESTIMONIAL_BASE
  const t = deck[idx % deck.length]!

  // Stage 4+: a "ghost" duplicate slides into view behind the active one.
  const ghost = stage >= 4 ? deck[(idx + 1) % deck.length] : null

  const next = () => {
    setIdx((i) => i + 1)
    bump(1, 'testimonial-next')
  }

  return (
    <section className="testimonials" aria-labelledby="t-h">
      <header className="section-head center">
        <p className="eyebrow">What customers say</p>
        <h2 id="t-h">{stage >= 4 ? '[QUOTES]' : 'Words from teams who unlocked outcomes'}</h2>
      </header>
      <div className="testimonial-stage" data-stage={stage}>
        {ghost && (
          <article className="testimonial ghost">
            <Avatar hue={ghost.hue} />
            <blockquote>“{ghost.quote}”</blockquote>
            <cite><strong>{ghost.name}</strong><span>{ghost.role}</span></cite>
          </article>
        )}
        <article className="testimonial active" key={idx}>
          <Avatar hue={t.hue} />
          <blockquote>“{t.quote}”</blockquote>
          <cite><strong>{t.name}</strong><span>{t.role}</span></cite>
        </article>
      </div>
      <div className="testimonial-controls">
        <button className="btn-secondary" type="button" onClick={next}>Next quote →</button>
        <span className="testimonial-counter">
          {stage >= 3 ? `${(idx % deck.length) + 1} of ∞` : `${(idx % deck.length) + 1} of ${deck.length}`}
        </span>
      </div>
    </section>
  )
}

function Avatar({ hue }: { hue: number }) {
  const style: CSSProperties = {
    background: `radial-gradient(circle at 32% 28%, hsl(${hue} 92% 78%), hsl(${(hue + 30) % 360} 76% 52%) 65%, hsl(${(hue + 60) % 360} 60% 32%))`,
  }
  return (
    <div className="avatar" aria-hidden="true">
      <div className="avatar-circle" style={style}>
        <span className="avatar-face">
          <span className="eye" />
          <span className="eye" />
          <span className="mouth" />
        </span>
      </div>
    </div>
  )
}

function Pricing({ inst }: { inst: Inst }) {
  const { stage, bump } = inst
  const tiers = stage >= 3 ? PRICING_DRIFT : PRICING_BASE
  return (
    <section className="pricing" aria-labelledby="p-h">
      <header className="section-head center">
        <p className="eyebrow">Pricing</p>
        <h2 id="p-h">{stage >= 4 ? '[H2 — pricing]' : 'Simple, transparent, mostly true.'}</h2>
        <p className="lede">{stage >= 4 ? '[LEDE — pricing reassurance, no specifics]' : 'Pick a tier. Switch anytime. We do not actually check.'}</p>
      </header>
      <div className="pricing-grid">
        {tiers.map((t, i) => (
          <article key={i} className={`tier ${'featured' in t && t.featured ? 'featured' : ''}`}>
            {('featured' in t && t.featured) && <span className="tier-badge">Most teams</span>}
            <h3>{t.name}</h3>
            <p className="tier-price">{t.price}</p>
            <p className="tier-sub">{t.sub}</p>
            <ul>
              {t.perks.map((p, j) => <li key={j}>{p}</li>)}
            </ul>
            <button className={'featured' in t && t.featured ? 'btn-primary' : 'btn-secondary'} type="button" onClick={() => bump(2, 'pricing-cta')}>
              {stage >= 4 ? '[CTA]' : 'Choose ' + t.name}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

function CallToAction({ inst }: { inst: Inst }) {
  const { stage, bump } = inst
  const headlines = [
    'Ready to align outcomes at the substrate layer?',
    'Ready to align outcomes at the outcome layer outcome?',
    'Ready to align align align align align align align?',
    '[CTA HEADLINE — must produce signups]',
    'Please. Sign up. We need this.',
  ]
  return (
    <section className="cta" aria-labelledby="cta-h">
      <h2 id="cta-h">{headlines[Math.min(stage - 1, headlines.length - 1)]}</h2>
      <p>
        {stage >= 4
          ? '[BODY — final push. Mention free trial. Imply social proof.]'
          : 'Start free. Cancel anytime. We will email you regardless.'}
      </p>
      <div className="cta-buttons">
        <button className="btn-primary lg" type="button" onClick={() => bump(2, 'cta-bottom')}>Start Free</button>
        <button className="btn-ghost lg" type="button" onClick={() => bump(2, 'generate-copy')}>Generate Better Copy</button>
      </div>
    </section>
  )
}

function FooterBlock({ inst }: { inst: Inst }) {
  const { stage, bump, countFor, discover } = inst
  const expansions = countFor('footer-expand')
  const generated = FOOTER_GENERATED_LINKS.slice(0, Math.min(expansions * 2, FOOTER_GENERATED_LINKS.length))

  const onClickFooterLink = () => {
    bump(1, 'footer-expand')
    if (expansions >= 2) discover('phantom-policy')
  }

  return (
    <footer className="slop-footer" data-stage={stage}>
      <div className="footer-cols">
        <div className="footer-brand">
          <span className="brand-mark sm" aria-hidden="true"><span /><span /><span /></span>
          <span className="brand-word">Slopternet™</span>
          <p>{stage >= 4 ? '[CORP TAGLINE]' : 'A future-ready synergy substrate, end to end.'}</p>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          {FOOTER_BASE_LINKS.slice(0, 5).map((l, i) => (
            <a key={i} href="#" onClick={(e) => { e.preventDefault(); onClickFooterLink() }}>{l}</a>
          ))}
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          {FOOTER_BASE_LINKS.slice(5).map((l, i) => (
            <a key={i} href="#" onClick={(e) => { e.preventDefault(); onClickFooterLink() }}>{l}</a>
          ))}
        </div>
        <div className="footer-col footer-policies">
          <h4>{stage >= 3 ? 'Policy Pages (autogenerated)' : 'Policies'}</h4>
          {generated.map((l, i) => (
            <a key={i} href="#" className="generated" onClick={(e) => { e.preventDefault(); onClickFooterLink() }}>{l}</a>
          ))}
          {generated.length < FOOTER_GENERATED_LINKS.length && (
            <button className="footer-more" type="button" onClick={onClickFooterLink}>+ More policies</button>
          )}
        </div>
      </div>
      <div className="footer-meta">
        <p>
          © Slopternet™ {stage >= 4 ? '[YEAR]' : '2026'} · Last reviewed by:&nbsp;
          <span className="muted">{stage >= 3 ? 'nobody' : 'our editorial team'}</span> ·&nbsp;
          Last updated:&nbsp;
          <span className="muted">{stage >= 3 ? 'just now (autogenerated)' : 'this morning'}</span>
        </p>
        {stage >= 4 && (
          <p className="footer-changelog">
            <span className="muted">/changelog rewrote itself {Math.max(1, expansions)}× in the last {expansions || 1} second{expansions === 1 ? '' : 's'}.</span>
          </p>
        )}
      </div>
    </footer>
  )
}

function Chatbot({ inst }: { inst: Inst }) {
  const { stage, bump, discover } = inst
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'loop', text: "Hi! I'm Loop, your AI assistant. How can I help?" },
  ])
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const send = (text: string) => {
    const greetings = CHAT_GREETINGS_BY_STAGE[stage]
    const idx = messages.filter((m) => m.from === 'loop').length % greetings.length
    const reply = greetings[idx]!
    const isArtifact = stage >= 4
    setMessages((m) => [
      ...m,
      { from: 'user', text },
      { from: 'loop', text: reply, artifact: isArtifact },
    ])
    bump(1, 'chatbot-send')
    if (stage >= 4) discover('chatbot-prompt-leak')
    if (stage >= 5) discover('chatbot-collapse')
  }

  const replies = QUICK_REPLIES_BY_STAGE[stage]

  return (
    <>
      <button
        className={`chat-fab ${open ? 'open' : ''}`}
        type="button"
        aria-label="Open chat assistant"
        onClick={() => { setOpen((o) => !o); bump(0, 'chat-toggle') }}
      >
        {open ? '×' : '💬'}
      </button>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Loop AI assistant">
          <header className="chat-head">
            <span className="chat-avatar">
              <span className="chat-eye" />
              <span className="chat-eye" />
            </span>
            <div>
              <strong>Loop</strong>
              <span className="chat-status">
                {stage >= 5 ? 'questioning everything' : stage >= 4 ? 'leaking system prompt' : stage >= 3 ? 'confidently uncertain' : stage >= 2 ? 'eager to help' : 'online'}
              </span>
            </div>
            <button className="chat-close" type="button" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
          </header>
          <div className="chat-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg from-${m.from} ${m.artifact ? 'artifact' : ''}`}>
                <span>{m.text}</span>
              </div>
            ))}
          </div>
          <div className="chat-replies">
            {replies.map((r, i) => (
              <button key={i} type="button" onClick={() => send(r)} className="chat-reply">
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function CookieBanner({ inst }: { inst: Inst }) {
  const { bump, discover, countFor, stage } = inst
  const dismissals = countFor('cookies-dismiss')
  // dismissedAtStage stores the stage at the moment of last dismissal. The
  // banner re-appears once the page advances past that stage — making the
  // banner feel like it "came back" with new, more invasive copy.
  const [dismissedAtStage, setDismissedAtStage] = useState<number | null>(null)

  if (dismissals >= COOKIE_VARIANTS.length) return null
  const dismissed = dismissedAtStage !== null && stage <= dismissedAtStage
  if (dismissed) return null

  const variant = COOKIE_VARIANTS[Math.min(dismissals, COOKIE_VARIANTS.length - 1)]!

  const dismiss = () => {
    bump(2, 'cookies-dismiss')
    setDismissedAtStage(stage)
    if (dismissals >= 1) discover('cookies-second')
    if (dismissals >= 2) discover('cookies-aggressive')
  }

  return (
    <div className={`cookie-banner level-${dismissals}`} role="region" aria-label="Cookie notice">
      <div className="cookie-icon" aria-hidden="true">🍪</div>
      <p className="cookie-body">{variant.body}</p>
      <div className="cookie-actions">
        <button type="button" className="btn-primary sm" onClick={dismiss}>{variant.accept}</button>
        <button type="button" className="btn-ghost sm" onClick={dismiss}>{variant.reject}</button>
      </div>
    </div>
  )
}

function FixWebsiteButton({ inst }: { inst: Inst }) {
  const { bump, discover, countFor } = inst
  const fixCount = countFor('fix-website')
  const [pos, setPos] = useState({ x: 24, y: 24 })

  // Each press makes things worse, and shoves the button somewhere else.
  const press = () => {
    bump(5, 'fix-website')
    discover('fix-website')
    const w = window.innerWidth
    const h = window.innerHeight
    setPos({
      x: 16 + Math.random() * Math.max(40, w - 240),
      y: 16 + Math.random() * Math.max(40, h - 80),
    })
  }

  const onPointer = () => {
    if (fixCount < 1) return
    discover('cursor-avoidance')
    const w = window.innerWidth
    const h = window.innerHeight
    setPos({
      x: 16 + Math.random() * Math.max(40, w - 240),
      y: 16 + Math.random() * Math.max(40, h - 80),
    })
  }

  return (
    <button
      className="fix-website"
      type="button"
      style={{ left: pos.x, top: pos.y }}
      onClick={press}
      onMouseEnter={onPointer}
      onTouchStart={press}
    >
      {fixCount === 0 ? 'Fix Website' : fixCount < 3 ? 'Fix Website (try again)' : 'Fix Website (please)'}
    </button>
  )
}

function FinalWarning({ visible, onAcknowledge }: { visible: boolean; onAcknowledge: () => void }) {
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    if (visible) onAcknowledge()
  }, [visible, onAcknowledge])

  if (!visible || closed) return null
  return (
    <div className="final" role="dialog" aria-label="A note">
      <div className="final-card">
        <p className="final-eyebrow">A note from outside the page</p>
        <p className="final-body">
          The web does not break all at once.<br />
          It breaks every time nobody checks what was generated.
        </p>
        <p className="final-sub">
          You did not crash this site. You watched it skip the steps that would have kept it true.
        </p>
        <button
          className="btn-primary sm"
          type="button"
          onClick={() => setClosed(true)}
        >
          Close
        </button>
      </div>
    </div>
  )
}

function ResetCorner({ reset }: { reset: () => void }) {
  return (
    <button
      type="button"
      className="reset-corner"
      onClick={reset}
      aria-label="Reset Slopternet to a clean (already-hollow) state"
      title="Reset"
    >
      ↺ reset
    </button>
  )
}

function DegradationOverlay({ stage }: { stage: Stage }) {
  // Decorative scan-line / tear overlay that intensifies with stage.
  return (
    <div className={`decay decay-${stage}`} aria-hidden="true">
      <div className="scan" />
      {stage >= 3 && <div className="tear" />}
      {stage >= 4 && <div className="tear tear-b" />}
      {stage >= 5 && <div className="tear tear-c" />}
      {stage >= 4 && <div className="moderation-note">[verify before publishing]</div>}
      {stage >= 5 && <div className="moderation-note bottom">[INSERT TRUST SIGNAL HERE]</div>}
    </div>
  )
}

