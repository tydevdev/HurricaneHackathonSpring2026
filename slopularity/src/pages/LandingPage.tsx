import { useCallback, useEffect, useRef, useState } from 'react'

// The onboarding gate is the first taste of collapse. Everything looks polished
// on arrival — one confident button, one confident promise. Each click reveals
// that the product is already confused about what it is showing you.
// AutoSprint called this "friction-free onboarding." Do not rename it back.

type LandingPageProps = {
  onEnter: () => void
}

/** How many successful stage clicks before the page falls off its hinges. */
const GATE_CLICKS = 4
const DODGE_STAGE = 2
const DODGE_LIMIT = 3

// Tagline variants: each click garbles the product promise a little more.
const TAGLINES: { line1: string; line2: string; line2em: [string, string] }[] = [
  {
    line1: 'Everything you need.',
    line2: 'Before you know you need it.',
    line2em: ['Before you', 'you need it.'],
  },
  {
    line1: 'Everything you need.',
    line2: 'Before you know you need it.',
    line2em: ['Before you', 'you need it.'],
  },
  {
    line1: 'Everything you need.',
    line2: 'Before you know you need it.',
    line2em: ['Before you', 'you need it.'],
  },
  {
    line1: 'Everything you before.',
    line2: 'Need you need you know it.',
    line2em: ['Need you', 'you know it.'],
  },
]

// The sub-tagline also shifts slightly per stage
const SUBS = [
  'The only page you will ever need. We absorbed the rest, with consent we will explain shortly.',
  'The only page you will ever need. We absorbed the rest, with consent we will explain shortly.',
  'The only page you will ever need. We absorbed the rest. Please click normally.',
  'The only we absorbed. Consent: page. Rest: you.',
]

// Meta eyebrow shifts
const METAS: string[][] = [
  ['EST. 2030', '·', 'ONE WEB', '·', 'ALL OF YOU'],
  ['ONE WEB', '·', 'ALL OF YOU', '·', 'EST. 2030'],
  ['ONE WEB', '·', 'EST. 2030', '·', 'STILL HERE'],
  ['ALL OF', '·', 'EST. YOU', '·', 'ONE 2030'],
]

// CTA note shifts
const CTA_NOTES = [
  '1.4B daily lives, currently unified',
  'currently unified, 1.4B daily lives',
  'predictive onboarding has detected intent',
  '1.4B daily currently, lives unified',
]

const DODGE_OFFSETS = [
  { x: 'clamp(86px, 18vw, 220px)', y: '-22px', rotate: '-2deg' },
  { x: 'clamp(-210px, -20vw, -92px)', y: '34px', rotate: '2.8deg' },
  { x: 'clamp(48px, 9vw, 118px)', y: '74px', rotate: '-1.3deg' },
]

export function LandingPage({ onEnter }: LandingPageProps) {
  const [clicks, setClicks] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [fallen, setFallen] = useState(false)
  const [helpyVisible, setHelpyVisible] = useState(false)
  const [dodgeCount, setDodgeCount] = useState(0)
  const landingRef = useRef<HTMLDivElement | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const dodgeCountRef = useRef(0)

  useEffect(() => {
    const landing = landingRef.current
    if (!landing) {
      return
    }

    const revealables = Array.from(landing.querySelectorAll('[data-reveal]'))
    const frame = window.requestAnimationFrame(() => {
      revealables.forEach((element) => {
        element.classList.add('is-revealed')
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  // Button position offsets per stage (percentage-based for responsive)
  const buttonStyles: React.CSSProperties[] = [
    {}, // stage 0: default position
    { // stage 1: shifted right and down
      alignSelf: 'flex-end',
      marginRight: '12%',
    },
    { // stage 2: starts centered, then dodges pointer attempts
      alignSelf: 'center',
    },
    { // stage 3: shifted left, rotated crooked
      alignSelf: 'flex-start',
      marginLeft: '8%',
      transform: 'rotate(3.5deg)',
    },
  ]

  const dodgeButton = useCallback(() => {
    if (clicks !== DODGE_STAGE || dodgeCountRef.current >= DODGE_LIMIT) {
      return false
    }

    const nextDodge = dodgeCountRef.current + 1
    dodgeCountRef.current = nextDodge
    setDodgeCount(nextDodge)
    return true
  }, [clicks])

  const handleClick = useCallback(() => {
    if (dodgeButton()) {
      return
    }

    const nextClicks = clicks + 1

    if (nextClicks >= GATE_CLICKS) {
      // Third click: hinge-fall
      setClicks(nextClicks)
      setFallen(true)

      // After the fall animation completes, show Helpy
      setTimeout(() => {
        setHelpyVisible(true)
      }, 1200)
      return
    }

    // Middle clicks: fake page transition then shuffle
    setTransitioning(true)
    setTimeout(() => {
      setClicks(nextClicks)
      setTransitioning(false)
    }, 300)
  }, [clicks, dodgeButton])

  // Scroll to top when shuffling (simulates page nav)
  useEffect(() => {
    if (!transitioning) {
      window.scrollTo(0, 0)
    }
  }, [transitioning])

  const tagline = TAGLINES[Math.min(clicks, TAGLINES.length - 1)]!
  const sub = SUBS[Math.min(clicks, SUBS.length - 1)]!
  const meta = METAS[Math.min(clicks, METAS.length - 1)]!
  const ctaNote = CTA_NOTES[Math.min(clicks, CTA_NOTES.length - 1)]!
  const btnStyle = buttonStyles[Math.min(clicks, buttonStyles.length - 1)]!
  const dodgeOffset = clicks === DODGE_STAGE && dodgeCount > 0
    ? DODGE_OFFSETS[Math.min(dodgeCount - 1, DODGE_OFFSETS.length - 1)]!
    : null
  const ctaTransform = dodgeOffset
    ? `translate(${dodgeOffset.x}, ${dodgeOffset.y}) rotate(${dodgeOffset.rotate})`
    : btnStyle.transform

  // Layout order shifts with clicks
  const orderMeta = clicks === 0 ? 1 : clicks === 1 ? 3 : clicks === 2 ? 2 : 2
  const orderHeadline = clicks === 0 ? 2 : clicks === 1 ? 1 : clicks === 2 ? 1 : 4
  const orderSub = clicks === 0 ? 3 : clicks === 1 ? 4 : clicks === 2 ? 4 : 1
  const orderCta = clicks === 0 ? 4 : clicks === 1 ? 2 : clicks === 2 ? 3 : 3

  const landingClasses = [
    'landing',
    'landing-gate',
    transitioning ? 'landing-transition' : '',
    clicks === DODGE_STAGE ? 'landing-dodge-stage' : '',
    fallen ? 'landing-hinge-fall' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <div className={landingClasses} ref={landingRef}>
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
          </nav>
        </header>

        <main className="landing-main landing-gate-main" id="top">
          <section className="landing-hero landing-gate-hero">
            <div className="landing-gate-content">
              <div
                className="landing-hero-meta"
                data-reveal
                style={{ order: orderMeta }}
              >
                {meta.map((item, i) => (
                  <span key={i}>{item}</span>
                ))}
              </div>

              <h1
                className="landing-headline"
                style={{ order: orderHeadline }}
              >
                <span className="line line-1" data-reveal>
                  {tagline.line1}
                </span>
                <span className="line line-2" data-reveal>
                  <em>{tagline.line2em[0]}</em>{' '}
                  {tagline.line2.replace(tagline.line2em[0]!, '').replace(tagline.line2em[1]!, '').trim()}{' '}
                  <em>{tagline.line2em[1]}</em>
                </span>
              </h1>

              <p
                className="landing-sub"
                data-reveal
                style={{ order: orderSub }}
              >
                {sub}
              </p>

              <div
                className="landing-cta landing-gate-cta"
                data-reveal
                style={{
                  order: orderCta,
                  ...btnStyle,
                  transform: ctaTransform,
                  transitionDelay: dodgeOffset ? '0s' : undefined,
                  transitionDuration: dodgeOffset ? '0.18s' : undefined,
                }}
              >
                <button
                  ref={btnRef}
                  type="button"
                  className={[
                    'landing-enter',
                    clicks >= 3 ? 'landing-enter-crooked' : '',
                    clicks === DODGE_STAGE ? 'landing-enter-dodging' : '',
                    clicks === DODGE_STAGE && dodgeCount >= DODGE_LIMIT ? 'landing-enter-tired' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={handleClick}
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') {
                      dodgeButton()
                    }
                  }}
                  style={clicks >= 3 ? { transform: 'rotate(3.5deg)' } : undefined}
                >
                  <span>Enter the Singularity</span>
                  <span className="landing-enter-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
                <p className="landing-cta-note">
                  <span className="landing-pulse" aria-hidden="true" />
                  {ctaNote}
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="landing-foot landing-gate-foot">
          <div className="landing-foot-rule" aria-hidden="true" />
          <div className="landing-foot-row">
            <p>
              © The Singularity Inc. 2030 · A subsidiary of itself ·
              Editorial standards verified by the system that wrote them.
            </p>
          </div>
        </footer>
      </div>

      {/* Helpy rescue — appears after the page falls */}
      {helpyVisible && (
        <div className="helpy-rescue" role="dialog" aria-label="Helpy assistant">
          <div className="helpy-rescue-bubble">
            <div className="helpy-rescue-avatar" aria-hidden="true">
              <span className="helpy-rescue-face">🤖</span>
            </div>
            <div className="helpy-rescue-body">
              <p className="helpy-rescue-name">Helpy</p>
              <p className="helpy-rescue-msg">
                Looks like you need some help! Click{' '}
                <button
                  type="button"
                  className="helpy-rescue-link"
                  onClick={onEnter}
                >
                  HERE
                </button>{' '}
                to open the app
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
