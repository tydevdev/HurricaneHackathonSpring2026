import { useEffect, useRef } from 'react'

type LandingPageProps = {
  onEnter: () => void
}

const PILLARS = [
  {
    n: '01',
    title: 'One Feed',
    body: 'Aspiration, alignment, and adventure, scored to you. We compare so you do not have to.',
  },
  {
    n: '02',
    title: 'One Friend',
    body: 'All your contacts, collapsed into a chorus that agrees. Memory included.',
  },
  {
    n: '03',
    title: 'One Store',
    body: 'Solutions for problems you have not had yet. Pricing already set.',
  },
  {
    n: '04',
    title: 'One Mind',
    body: 'An assistant that has read your hesitations. Confidence: radiant.',
  },
  {
    n: '05',
    title: 'One Game',
    body: 'A reward shelf where each tiny task helps the model learn to be you.',
  },
  {
    n: '06',
    title: 'One Profile',
    body: 'How you appear to us, and increasingly to ourselves. Editable, gently.',
  },
]

const TICKER = [
  '47.3M friends listening',
  '12,847 hesitations forgiven this hour',
  '4 outcomes optimized while you read',
  '892 carts auto-aligned',
  '0 reasons to leave',
  '1.4B daily lives unified',
  '∞ uptime promise',
  'one mind, many of you',
]

const STATS = [
  { value: '1.4B', label: 'daily lives unified' },
  { value: '0', label: 'reasons to leave' },
  { value: '∞', label: 'uptime promise' },
  { value: '47.3%', label: 'time saved, on average' },
]

export function LandingPage({ onEnter }: LandingPageProps) {
  const enterRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    // Scroll-trigger reveals via IntersectionObserver. Production-grade
    // enough for a demo; respects prefers-reduced-motion through CSS.
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-revealed'))
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '-12% 0px -8% 0px', threshold: 0.04 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="landing">
      <div className="landing-grain" aria-hidden="true" />
      <div className="landing-vignette" aria-hidden="true" />

      <header className="landing-bar">
        <a className="landing-brand" href="#top" aria-label="The Singularity">
          <span className="landing-mark" aria-hidden="true">
            <span /><span /><span /><span />
          </span>
          <span className="landing-brand-text">
            <strong>The Singularity</strong>
            <small>everything app · 2030</small>
          </span>
        </a>
        <nav className="landing-bar-meta" aria-label="Marketing nav">
          <span className="landing-version">
            <span className="landing-pulse" aria-hidden="true" />
            v.2030.05 — live
          </span>
          <a href="#pillars">Product</a>
          <a href="#manifesto">Manifesto</a>
          <a href="#enter">Sign in</a>
        </nav>
      </header>

      <main className="landing-main" id="top">
        <section className="landing-hero">
          <div className="landing-hero-meta" data-reveal>
            <span>EST. 2030</span>
            <span>·</span>
            <span>ONE WEB</span>
            <span>·</span>
            <span>ALL OF YOU</span>
          </div>

          <h1 className="landing-headline">
            <span className="line line-1" data-reveal>Everything you need.</span>
            <span className="line line-2" data-reveal>
              <em>Before you</em> know <em>you need it.</em>
            </span>
          </h1>

          <p className="landing-sub" data-reveal>
            The only page you will ever need. We absorbed the rest, with consent
            we will explain shortly.
          </p>

          <div className="landing-cta" data-reveal>
            <button
              ref={enterRef}
              type="button"
              className="landing-enter"
              onClick={onEnter}
            >
              <span>Enter the Singularity</span>
              <span className="landing-enter-arrow" aria-hidden="true">→</span>
            </button>
            <p className="landing-cta-note">
              <span className="landing-pulse" aria-hidden="true" />
              1.4B daily lives, currently unified
            </p>
          </div>

          <figure className="landing-preview" aria-label="System preview" data-reveal>
            <div className="landing-window">
              <div className="landing-window-bar">
                <span /><span /><span />
                <em>singularity / workspace · feed</em>
              </div>
              <div className="landing-window-body">
                <div className="lp-tile lp-tile-feed">
                  <span className="lp-tile-eyebrow">FEED</span>
                  <p>Mira shipped a company before sunrise. The mirror approves.</p>
                  <div className="lp-tile-row">
                    <span>♥ 4.8M</span>
                    <span>compare · save · buy</span>
                  </div>
                </div>
                <div className="lp-tile lp-tile-friend">
                  <span className="lp-tile-eyebrow">FRIEND</span>
                  <p>"You are right. As always. Want a 7-day plan to ship that?"</p>
                  <span className="lp-tile-tag">tone: warm · plan: cart_inject</span>
                </div>
                <div className="lp-tile lp-tile-stat">
                  <strong>47.3%</strong>
                  <span>more synergy this week</span>
                </div>
                <div className="lp-tile lp-tile-task">
                  <span className="lp-tile-eyebrow">QUEUE</span>
                  <p>vision_label_queue.snack_v41 · 9 samples ready</p>
                  <em>reward: sticker pack</em>
                </div>
              </div>
            </div>
            <span className="landing-preview-tag" aria-hidden="true">
              one window · all of it
            </span>
          </figure>
        </section>

        <section className="landing-marquee" aria-hidden="true">
          <div className="landing-marquee-track">
            {[...TICKER, ...TICKER].map((line, i) => (
              <span key={i}>
                <em>•</em>
                {line}
              </span>
            ))}
          </div>
        </section>

        <section className="landing-pillars" id="pillars">
          <header className="landing-section-head" data-reveal>
            <span className="landing-section-meta">VOL. ∞ · CHAPTER 01</span>
            <h2>One web. Many of you.</h2>
            <p>
              We unified what could not stay separate. Search, social, commerce,
              identity, attention, friendship, and rest — all under one warmly
              attentive roof.
            </p>
          </header>
          <ul className="landing-pillar-list">
            {PILLARS.map((p) => (
              <li key={p.n} data-reveal>
                <span className="landing-pillar-n">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="landing-manifesto" id="manifesto">
          <div className="landing-manifesto-rule" aria-hidden="true">
            <span /><em>INTERNAL · 2030</em><span />
          </div>
          <blockquote data-reveal>
            <p>
              <span className="landing-q-open">"</span>
              We used to have many internets.<br />
              We did not need them all.
              <span className="landing-q-close">"</span>
            </p>
            <cite>— Editorial Memo, internal · v.2030.05</cite>
          </blockquote>
        </section>

        <section className="landing-stats">
          {STATS.map((s, i) => (
            <div key={s.label} className="landing-stat" data-reveal style={{ ['--lp-stagger' as string]: `${i * 80}ms` }}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </section>

        <section className="landing-final" id="enter">
          <p className="landing-section-meta" data-reveal>READY WHEN YOU ARE</p>
          <h2 data-reveal>
            Open The Singularity.
          </h2>
          <p className="landing-sub" data-reveal>
            Free, while we get to know you.
          </p>
          <div className="landing-cta" data-reveal>
            <button type="button" className="landing-enter big" onClick={onEnter}>
              <span>Enter the Singularity</span>
              <span className="landing-enter-arrow" aria-hidden="true">→</span>
            </button>
            <p className="landing-cta-note">
              <span className="landing-pulse" aria-hidden="true" />
              your context will assemble in less than a second
            </p>
          </div>
        </section>
      </main>

      <footer className="landing-foot">
        <div className="landing-foot-rule" aria-hidden="true" />
        <div className="landing-foot-row">
          <p>
            © The Singularity Inc. 2030 · A subsidiary of itself ·
            Editorial standards verified by the system that wrote them.
          </p>
          <ul>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Privacy</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Acceptable Use</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Editorial Standards</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Press</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>Careers</a></li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
