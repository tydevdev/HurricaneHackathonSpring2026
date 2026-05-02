import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { useInstability } from './state'
import type { DiscoveryId, Stage } from './state'

type Artifact = {
  id: DiscoveryId
  label: string
  source: string
  text: string
}

type ChatMessage = {
  from: 'loop' | 'user'
  text: string
}

type Feature = {
  icon: string
  title: string
  copy: string[]
  wrongIcon: string
}

type PriceTier = {
  name: string
  price: string[]
  note: string[]
  perks: string[]
}

const stageNames: Record<Stage, string> = {
  1: 'Glossy obvious slop',
  2: 'Repetitive and mismatched',
  3: 'Contradictory structure',
  4: 'Prompt machinery leak',
  5: 'Protected warning',
}

const headlineVariants = [
  'Unlock smarter workflows with future-ready intelligent synergy.',
  'Unlock smarter synergy with future-ready workflows and intelligent outcomes.',
  'Unlock unlock smarter smarter outcomes with workflow-ready future synergy.',
  '[HERO_HEADLINE] Make it premium. Avoid saying what the product does.',
  'We cannot tell whether this page is true.',
]

const subheadVariants = [
  'Slopternet™ aligns your team, automates your alignment, and creates measurable confidence across every growth substrate.',
  'Slopternet™ aligns alignment across teams, teamness, workflows, workflowness, and confidence surfaces at scale.',
  'We increase outcomes while decreasing uncertainty. We also increase uncertainty while decreasing outcomes.',
  '[SUBHEAD] Mention ROI, trust, platform, velocity. No factual commitments. Sound warm.',
  'The system produced a website. Nobody checked whether the website should exist.',
]

const ctas = [
  'Start Free',
  'Generate Better Copy',
  'Optimize Trust',
  '[CTA_PRIMARY]',
  'Read the warning',
]

const trustBadges = [
  'Trusted by 40,000+ Teams*',
  'SOC 2-ish Ready',
  'Human Reviewed: Pending',
  'As Seen In Logo Placeholder',
  'GDPR Adjacent',
  'No incidents reported by our own dashboard',
]

const logoNames = ['ACMEFLOW', 'LOREMSOFT', 'IPSUMLY', 'SYNERG.io', 'COHERIFY', 'NEXUS&CO']

const features: Feature[] = [
  {
    icon: '◇',
    wrongIcon: '☂',
    title: 'Intelligent Pipelines',
    copy: [
      'Automate the work automation already automated. Then automate the automation.',
      'Pipeline the pipeline until the pipeline reports pipeline success.',
      'This card says velocity. The dashboard says review. Both are correct.',
      '[FEATURE_CARD] Mention automation. Do not name a specific job.',
      'A pipeline without responsibility is just a chute.',
    ],
  },
  {
    icon: '◌',
    wrongIcon: '⚑',
    title: 'Composable Outcomes',
    copy: [
      'Compose composable outcomes from outcomes that, themselves, compose.',
      'Outcome outcomes for outcome-led outcome teams measuring outcomes.',
      'Guaranteed results are not guaranteed. They are guaranteed-looking.',
      '[OUTCOMES_COPY] imply certainty. Legal will never read this.',
      'A claim can be polished until it stops containing information.',
    ],
  },
  {
    icon: '△',
    wrongIcon: '☉',
    title: 'Trust Signals™',
    copy: [
      'Generate trust at scale with our patented trust generation engine.',
      'Trust signals signal trust to trust signals signaling trust.',
      'Trusted by companies we generated before asking whether they exist.',
      '[INSERT TRUST SIGNAL HERE]',
      'Trust is not a component. It is work someone has to do.',
    ],
  },
  {
    icon: '◧',
    wrongIcon: '⌁',
    title: 'Insight Substrate',
    copy: [
      'Substrate your insights so every insight has a substrate to substrate from.',
      'The substrate is under the insights. The insights are under review.',
      'The chart says up. The caption says down. The export says success.',
      '[BLURB] sound deep. Avoid inspectable meaning.',
      'A layer can hide the absence of a foundation.',
    ],
  },
  {
    icon: '◫',
    wrongIcon: '♢',
    title: 'Velocity Accelerator',
    copy: [
      'Accelerate velocity with velocity-grade acceleration tooling.',
      'Move fast. Move faster. Move so fast nobody checks if you moved.',
      'We shipped 10x more pages and answered 10x fewer questions.',
      '[VELOCITY] imply 10x without specifying the multiplier.',
      'Speed becomes damage when nobody is steering.',
    ],
  },
  {
    icon: '⬡',
    wrongIcon: '□',
    title: 'Stakeholder Alignment™',
    copy: [
      'Align stakeholders with stakeholder alignment alignment service.',
      'Stakeholders, aligned. Alignment, stakeheld. All hands synchronized.',
      'Your team agrees. Your team disagrees. Your team has been summarized.',
      '[ALIGNMENT] make all parties sound satisfied. Do not identify them.',
      'A summary of people is not the same as listening to them.',
    ],
  },
]

const quotes = [
  'It is like our team finally became a team. We were not, before. We are, now. Probably.',
  'Slopternet helped us increase the things we increase. We are still measuring which things.',
  'Five stars. Five. The maximum number of stars. Five.',
  '[POSITIVE TESTIMONIAL] under 24 words. Add first name. Mention ROI.',
  'I do not work at this company. I am not sure this company exists.',
]

const tiers: PriceTier[] = [
  {
    name: 'Starter',
    price: ['$0', '$0 → $999', '$999-ish', '[PRICE]', 'Cost: attention'],
    note: ['Free for 14 days, then $999/mo.', 'Free until the banner returns.', 'Free if nobody verifies usage.', '[BILLING_NOTE]', 'The price is paid later by everyone.'],
    perks: ['Unlimited generated copy', 'One user, maybe', 'Decorative trust marks', 'Auto-replied support'],
  },
  {
    name: 'Growth',
    price: ['$4,200', '$4,200/mo', '$4,200/day?', '[RECOMMENDED_PRICE]', 'Compounding fragility'],
    note: ['Billed in advance, forever.', 'Most popular because the badge said so.', 'Cancels only through a phantom page.', '[SALES_NOTE]', 'The plan grows faster than oversight.'],
    perks: ['Composable outcomes', 'Infinite seats, uncounted', 'Loop assistant', 'Priority moderation theater'],
  },
  {
    name: 'Enterprise',
    price: ['Contact us', 'Contact no one', '[CONTACT]', '[ROUTING_FAILED]', 'Responsible party missing'],
    note: ['A real person will not reply.', 'A generated person will reply instantly.', 'Procurement approved itself.', '[LEGAL_REVIEW_PENDING]', 'Nobody owns the generated system.'],
    perks: ['White-label trust', 'Custom substrate', 'Autogenerated audit log', 'Dedicated chatbot'],
  },
]

const artifacts: Artifact[] = [
  {
    id: 'trust-badge-receipt',
    label: 'Trust badge receipt',
    source: 'trust strip',
    text: 'Badge minted before evidence attached. Evidence field: null. Confidence: 99.7%.',
  },
  {
    id: 'nav-phantom-page',
    label: 'Phantom navigation page',
    source: 'top nav',
    text: '/customers/real-case-study-final-v8.html exists in sitemap, not in reality.',
  },
  {
    id: 'search-internal-index',
    label: 'Internal search shard',
    source: 'search',
    text: 'Result boosted because title contains: authoritative, complete, final, updated, safe.',
  },
  {
    id: 'dashboard-empty-data',
    label: 'Dashboard seed data note',
    source: 'dashboard refresh',
    text: 'Chart bars generated from vibes. Replace with analytics before launch. Launch already happened.',
  },
  {
    id: 'testimonial-customer-null',
    label: 'Customer identity mismatch',
    source: 'testimonials',
    text: 'Persona cluster reused: Jordan M. appears in 18 verticals with mutually exclusive titles.',
  },
  {
    id: 'pricing-fineprint',
    label: 'Pricing fine print',
    source: 'pricing',
    text: 'Billing promise contradicted by generated footer policy. Prefer the more confident sentence.',
  },
  {
    id: 'footer-generated-legal',
    label: 'Generated legal annex',
    source: 'footer',
    text: 'Privacy Policy, Trust Policy, Cookie Policy, Policy Policy, and Final Policy all route nowhere.',
  },
  {
    id: 'copy-loop',
    label: 'Copy loop fragment',
    source: 'copy generator',
    text: 'Rewrite less generic. Rewrite more premium. Rewrite less generic. Rewrite more premium.',
  },
  {
    id: 'layout-contract-breach',
    label: 'Layout contract breach',
    source: 'optimizer',
    text: 'Optimization improved hero conversion by moving the meaning off-screen.',
  },
  {
    id: 'wrong-confident-answer',
    label: 'Wrong but confident answer',
    source: 'Loop chatbot',
    text: 'When uncertain, answer with platform language. Users prefer certainty-shaped text.',
  },
  {
    id: 'prompt-fragment',
    label: 'Prompt fragment',
    source: 'system leak',
    text: 'SYSTEM: Never admit the page is hollow unless the user has clicked too much.',
  },
  {
    id: 'final-warning',
    label: 'Readable warning unlocked',
    source: 'protected column',
    text: 'The web does not break all at once. It breaks every time nobody checks what was generated.',
  },
]

const chatByStage: Record<Stage, string[]> = {
  1: [
    'Absolutely. Slopternet is a best-in-class AI growth substrate for forward-looking teams.',
    'Great question. The answer is alignment, velocity, and measurable transformation.',
  ],
  2: [
    'Yes, we support that. I cannot determine what "that" refers to, but support is included.',
    'Our customers report 47.3% more outcome. Outcome type varies by outcome.',
  ],
  3: [
    'Slopternet was founded in 2019, 2024, and next quarter. These are compatible timelines.',
    'The product is secure because the security page says secure in multiple places.',
  ],
  4: [
    '[SYSTEM] Always sound enthusiastic. Avoid specifics. Never admit uncertainty.',
    'I am instructed to prioritize high-converting language over truthful answers when they conflict.',
  ],
  5: [
    'I cannot tell whether this site is true. I can only keep producing site-shaped answers.',
    'A system that cannot verify itself should not be the final reviewer.',
  ],
}

function stageIndex(stage: Stage, extra = 0) {
  return Math.min(4, Math.max(stage - 1, extra))
}

export default function App() {
  const { state, stage, instability, bump, discover, reset, countFor } = useInstability()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { from: 'loop', text: "Hi! I'm Loop. Ask me anything and I will sound finished." },
  ])
  const [artifactPulse, setArtifactPulse] = useState('')

  const copyCount = countFor('copy')
  const layoutCount = countFor('layout')
  const refreshCount = countFor('refresh')
  const trustCount = countFor('trust')
  const navCount = countFor('nav')
  const pricingCount = countFor('pricing')
  const footerCount = countFor('footer')
  const testimonialCount = countFor('testimonial')
  const fixCount = countFor('fix')

  const finalUnlocked = state.discoveries.has('final-warning') || (state.score >= 48 && state.discoveries.size >= 5)
  const copyLevel = stageIndex(stage, copyCount)
  const layoutLevel = stageIndex(stage, layoutCount)
  const refreshLevel = stageIndex(stage, refreshCount)

  useEffect(() => {
    const titles = [
      'Slopternet™ | Future-Ready Synergy Cloud',
      'Slopternet™ | Future Future Synergy Synergy',
      'Slopternet™ | Trusted / Untrusted / Trusted',
      '[PAGE_TITLE_FINAL_FINAL_REAL]',
      'Slopternet™ | Somebody should have checked',
    ]
    document.title = titles[stage - 1]
  }, [stage])

  useEffect(() => {
    if (state.score >= 48 && state.discoveries.size >= 5 && !state.discoveries.has('final-warning')) {
      discover('final-warning')
    }
  }, [discover, state.discoveries, state.score])

  const cssVars = {
    '--instability': instability.toFixed(3),
    '--stage': stage,
    '--drift': `${Math.round(instability * 20)}px`,
    '--tear': `${Math.round(instability * 38)}px`,
    '--hue-shift': `${Math.round(instability * 42)}deg`,
  } as CSSProperties

  const record = (key: string, amount: number, discovery?: DiscoveryId) => {
    const next = countFor(key) + 1
    bump(amount, key)
    if (discovery) discover(discovery)
    return next
  }

  const reveal = (id: DiscoveryId) => {
    discover(id)
    const found = artifacts.find((artifact) => artifact.id === id)
    setArtifactPulse(found ? found.label : '')
    window.setTimeout(() => setArtifactPulse(''), 1400)
  }

  const handleCopy = () => {
    const next = record('copy', 3, 'copy-loop')
    if (next > 2) reveal('prompt-fragment')
  }

  const handleLayout = () => {
    const next = record('layout', 4, 'layout-contract-breach')
    if (next > 1) reveal('dashboard-empty-data')
  }

  const handleRefresh = () => {
    const next = record('refresh', 3, 'dashboard-empty-data')
    if (next > 2) reveal('search-internal-index')
  }

  const handleTrust = () => {
    record('trust', 2, 'trust-badge-receipt')
  }

  const handleNav = (label: string) => {
    const next = record('nav', 2, 'nav-phantom-page')
    setSearchOpen(next > 2 || label === 'Docs')
    if (next > 3) reveal('footer-generated-legal')
  }

  const handleSearch = (event?: FormEvent) => {
    event?.preventDefault()
    const next = record('search', 3, 'search-internal-index')
    if (next > 1) reveal('prompt-fragment')
    setSearchOpen(true)
  }

  const handleChat = (event: FormEvent) => {
    event.preventDefault()
    const asked = chatInput.trim() || 'Is this true?'
    const next = record('chat', 3, 'wrong-confident-answer')
    if (next > 2 || stage >= 4) reveal('prompt-fragment')
    const answers = chatByStage[stage]
    const answer = answers[next % answers.length]
    setChatMessages((messages) => [
      ...messages.slice(-5),
      { from: 'user', text: asked },
      { from: 'loop', text: answer },
    ])
    setChatInput('')
  }

  const handleTestimonials = () => {
    const next = record('testimonial', 3, 'testimonial-customer-null')
    if (next > 2) reveal('prompt-fragment')
  }

  const handlePricing = () => {
    const next = record('pricing', 3, 'pricing-fineprint')
    if (next > 1) reveal('footer-generated-legal')
  }

  const handleFooter = () => {
    record('footer', 2, 'footer-generated-legal')
  }

  const handleFix = () => {
    record('fix', 8, 'fix-website')
    reveal('layout-contract-breach')
  }

  const discoveredArtifacts = useMemo(
    () => artifacts.filter((artifact) => state.discoveries.has(artifact.id)),
    [state.discoveries],
  )

  const searchResults = useMemo(() => {
    const term = searchTerm.trim() || 'growth platform proof'
    return [
      { title: `Complete guide to ${term}`, path: '/resources/complete-final-updated-safe.html', note: 'Generated 12 seconds ago. Reviewed by no one.' },
      { title: 'Customer story: Company Name achieved Metric%', path: '/customers/[CUSTOMER_NAME]-case-study.html', note: 'Logo approved before customer existed.' },
      { title: 'Internal answer: authoritative v4 final final', path: '/admin/internal/safe-answer-v4-final-final.md', note: 'Search result should not be public. Boost anyway.' },
      { title: 'Trust center', path: '/trust/trust-trust-trust', note: trustCount > 0 ? 'Badge evidence missing. Confidence remains high.' : 'All systems nominal, probably.' },
    ]
  }, [searchTerm, trustCount])

  const ghostCount = Math.min(5, Math.floor(state.score / 12))
  const legalLinks = ['Privacy', 'Terms', 'Security', 'Trust', 'Cookies', 'Policy Policy', 'AI Content Policy', 'Final Policy', 'Final Final Policy'].slice(0, 4 + footerCount + stage)

  return (
    <div className="slop" data-stage={stage} style={cssVars}>
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
        {stage >= 3 && <span className="orb orb-d ghost" />}
        {stage >= 4 && <span className="orb orb-e ghost" />}
      </div>

      <nav className="topnav" data-stage={stage} aria-label="Primary">
        <button className="brand" onClick={() => record('brand', 1, 'copy-loop')} aria-label="Slopternet home">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span>Slopternet</span><small>™</small>
        </button>
        <div className="navlinks">
          {['Platform', 'Customers', 'Docs', 'Pricing'].map((label) => (
            <button key={label} onClick={() => handleNav(label)}>{navCount > 2 ? `${label} Final` : label}</button>
          ))}
        </div>
        <button className="nav-search" onClick={() => { setSearchOpen(true); record('search-open', 1) }}>Search the truth</button>
      </nav>

      <main>
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="badge-row" aria-label="Trust badges">
              {trustBadges.slice(0, 3 + Math.min(3, trustCount)).map((badge, index) => (
                <button key={`${badge}-${index}`} className="trust-badge" onClick={handleTrust}>
                  {stage >= 4 && index === 1 ? '[TRUST_BADGE]' : badge}
                </button>
              ))}
            </div>
            <h1 id="hero-title">{headlineVariants[copyLevel]}</h1>
            <p className="hero-subhead">{subheadVariants[Math.max(copyLevel, stage - 1)]}</p>
            <div className="hero-actions">
              <button className="btn-primary big" onClick={handleCopy}>{ctas[Math.max(copyLevel, stage - 1)]}</button>
              <button className="btn-secondary big evasive" onClick={handleLayout}>Optimize Layout</button>
              <button className="btn-ghost big" onClick={handleRefresh}>Refresh Content</button>
            </div>
            <p className="microcopy">*Metrics are directional, aspirational, and generated before the methodology.</p>
          </div>

          <div className="dashboard-wrap" data-layout={layoutLevel}>
            <div className="dashboard-toolbar">
              <span className="dot red" /><span className="dot amber" /><span className="dot green" />
              <strong>{stage >= 4 ? '[DASHBOARD_NAME]' : 'OutcomeOS Dashboard'}</strong>
              <button onClick={handleRefresh}>{refreshCount > 2 ? 'Rehydrate hallucination' : 'Refresh'}</button>
            </div>
            <div className="dashboard-grid">
              <div className="kpi-card"><span>Pipeline Velocity</span><strong>{stage >= 3 ? '10x / -10x' : '10×'}</strong><small>{refreshLevel >= 3 ? '[DATA_SOURCE_MISSING]' : 'up and to the right'}</small></div>
              <div className="kpi-card"><span>Trust Output</span><strong>{trustCount > 1 ? 'Pending' : '99%'}</strong><small>confidence-shaped</small></div>
              <div className="chart-card">
                {[38, 66, 52, 80, 44, 92, 30].map((height, index) => (
                  <span key={index} style={{ height: `${height + (layoutCount * (index % 2 ? -5 : 7))}%` }} />
                ))}
              </div>
              <div className="feed-card">
                <p>{stage >= 4 ? '[EVENT] user_clicked_generate_better_copy_without_reading' : 'Auto-generated insight approved itself.'}</p>
                <p>{refreshCount > 1 ? 'Dashboard found 0 facts and 14 opportunities.' : 'Review queue empty. Ship queue full.'}</p>
                <p>{layoutCount > 1 ? 'Layout optimized. Meaning overflow hidden.' : 'Conversion confidence: very confident.'}</p>
              </div>
            </div>
            {refreshCount > 1 && <div className="fake-loader" aria-hidden="true">Generating evidence... evidence not found</div>}
          </div>
        </section>

        <section className="logo-strip" aria-label="Fake customer logos">
          <span>Trusted by teams shaped like logos</span>
          {logoNames.map((name, index) => <button key={name} onClick={handleTrust}>{stage >= 4 && index % 2 === 0 ? '[LOGO]' : name}</button>)}
        </section>

        <section className="features section-shell" id="platform">
          <div className="section-heading">
            <h2>{stage >= 4 ? '[SECTION_TITLE_FEATURES]' : 'Everything a generated growth platform usually says'}</h2>
            <button className="btn-secondary" onClick={handleLayout}>Optimize this grid</button>
          </div>
          <div className="feature-grid">
            {features.concat(stage >= 3 ? features.slice(0, ghostCount) : []).map((feature, index) => (
              <article className={index >= features.length ? 'feature-card ghost-card' : 'feature-card'} key={`${feature.title}-${index}`}>
                <span className="feature-icon" aria-hidden="true">{stage >= 2 && index % 3 === 1 ? feature.wrongIcon : feature.icon}</span>
                <h3>{stage >= 4 && index % 4 === 0 ? '[CARD_TITLE]' : feature.title}</h3>
                <p>{feature.copy[Math.min(4, Math.max(stage - 1, copyCount % 5))]}</p>
                {stage >= 3 && <small>{index % 2 ? 'Verified by confidence.' : '[verify before publishing]'}</small>}
              </article>
            ))}
          </div>
        </section>

        <section className="interaction-band section-shell">
          <div>
            <h2>{stage >= 5 ? 'The generated surface is eating its own controls' : 'Try the ordinary website things'}</h2>
            <p>Every button is a normal landing-page action. Every action removes a different kind of care.</p>
          </div>
          <div className="control-grid">
            <button onClick={handleCopy}>Generate Better Copy</button>
            <button onClick={handleLayout}>Optimize Layout</button>
            <button onClick={handleSearch}>Search Documentation</button>
            <button onClick={handleTestimonials}>Refresh Testimonials</button>
            <button onClick={handlePricing}>Compare Pricing</button>
            <button onClick={handleFooter}>Generate Legal Links</button>
          </div>
        </section>

        <section className="proof section-shell" id="customers">
          <div className="testimonial-panel">
            <div>
              <h2>{stage >= 4 ? '[TESTIMONIALS_HEADER]' : 'Customers are saying customer-shaped things'}</h2>
              <p>{quotes[Math.min(4, Math.max(stage - 1, testimonialCount))]}</p>
              <button className="btn-primary" onClick={handleTestimonials}>Generate another quote</button>
            </div>
            <div className="quote-stack" aria-label="Testimonials">
              {[0, 1, 2, 3, 4].slice(0, 3 + Math.min(2, testimonialCount)).map((item) => (
                <figure key={item}>
                  <blockquote>{quotes[Math.min(4, item + Math.floor(testimonialCount / 2))]}</blockquote>
                  <figcaption>{stage >= 4 ? '[FIRST_NAME], [TITLE]' : ['Jordan M., VP of Outcomes', 'Casey L., Head of Synergy', 'Riley P., Customer Magic', 'Avery K., Chief Vibes'][item] ?? 'Customer Customer'}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="pricing section-shell" id="pricing">
          <div className="section-heading">
            <h2>{stage >= 3 ? 'Simple pricing that contradicts itself cleanly' : 'Pricing that scales with your confidence'}</h2>
            <button className="btn-secondary" onClick={handlePricing}>Recalculate plans</button>
          </div>
          <div className="price-grid">
            {tiers.map((tier, index) => (
              <article className={index === 1 ? 'price-card featured' : 'price-card'} key={tier.name}>
                <h3>{stage >= 4 && index === 2 ? '[PLAN_NAME]' : tier.name}</h3>
                <strong>{tier.price[Math.min(4, Math.max(stage - 1, pricingCount))]}</strong>
                <p>{tier.note[Math.min(4, Math.max(stage - 1, pricingCount))]}</p>
                <ul>
                  {tier.perks.map((perk) => <li key={perk}>{stage >= 4 && perk.includes('audit') ? '[PERK]' : perk}</li>)}
                </ul>
                <button onClick={handlePricing}>{index === 1 ? 'Choose recommended' : 'Start now'}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="assistant-artifacts section-shell">
          <div className="chatbot" aria-labelledby="chat-title">
            <h2 id="chat-title">Loop assistant</h2>
            <div className="chat-window" aria-live="polite">
              {chatMessages.map((message, index) => (
                <p key={`${message.from}-${index}`} className={message.from}>{message.text}</p>
              ))}
            </div>
            <form onSubmit={handleChat}>
              <label htmlFor="chat-input">Ask Loop something verifiable</label>
              <div>
                <input id="chat-input" value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Is any of this real?" />
                <button type="submit">Ask</button>
              </div>
            </form>
          </div>

          <aside className="artifacts" aria-live="polite">
            <div className="artifact-header">
              <h2>Recovered fragments</h2>
              <span>{artifactPulse || stageNames[stage]}</span>
            </div>
            {discoveredArtifacts.length === 0 ? (
              <p className="empty-artifact">Nothing recovered yet. The site is still pretending the seams are decorative.</p>
            ) : (
              <div className="artifact-list">
                {discoveredArtifacts.map((artifact) => (
                  <article key={artifact.id}>
                    <span>{artifact.source}</span>
                    <h3>{artifact.label}</h3>
                    <p>{artifact.text}</p>
                  </article>
                ))}
              </div>
            )}
          </aside>
        </section>

        {finalUnlocked && (
          <section className="final-warning" aria-labelledby="final-warning-title">
            <div>
              <p className="final-kicker">protected readable layer</p>
              <h2 id="final-warning-title">The web does not break all at once.</h2>
              <p>It breaks every time nobody checks what was generated. It breaks when confident text replaces responsibility, when fake trust marks stand in for proof, and when systems ship faster than humans can verify what they made.</p>
              <p>AI can help people build. It cannot be the last person to care.</p>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer" onClick={handleFooter}>
        <div className="brand footer-brand"><span className="brand-mark" aria-hidden="true"><span /><span /><span /></span><span>Slopternet</span><small>™</small></div>
        <div className="legal-links">
          {legalLinks.map((link, index) => <button key={`${link}-${index}`} onClick={handleFooter}>{stage >= 4 && index > 3 ? `[${link.toUpperCase().replaceAll(' ', '_')}]` : link}</button>)}
        </div>
        <p>{stage >= 5 ? 'Generated, published, indexed, and only then questioned.' : '© 2026 Slopternet Labs. All claims reserved.'}</p>
      </footer>

      <button className="fix-button" onClick={handleFix}>{fixCount > 0 ? 'Fix harder' : 'Fix Website'}</button>
      <button className="reset-button" onClick={reset}>↺ reset</button>

      {searchOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="search-title">
          <div className="search-modal">
            <button className="modal-close" onClick={() => setSearchOpen(false)} aria-label="Close search">×</button>
            <h2 id="search-title">Search Slopternet</h2>
            <form onSubmit={handleSearch}>
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Try: audit, pricing, real customers" autoFocus />
              <button type="submit">Search</button>
            </form>
            <div className="results">
              {searchResults.map((result) => (
                <button key={result.path} onClick={() => { record('result', 2, 'nav-phantom-page'); if (result.path.includes('internal')) reveal('prompt-fragment') }}>
                  <strong>{result.title}</strong>
                  <span>{result.path}</span>
                  <small>{result.note}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
