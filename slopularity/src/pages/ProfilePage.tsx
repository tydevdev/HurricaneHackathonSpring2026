import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { discoveries, humanFragments } from '../content'
import type { ScrollStats } from '../types'

type ProfilePageProps = {
  completedTaskCount: number
  scrollStats: ScrollStats
  stage: number
  score: number
  onReveal: () => void
}

type ProfileProgress = {
  bigButtonPresses: number
  floridaChecks: number
  privacyTaps: number
  earnedTrophies: string[]
}

type Trophy = {
  id: string
  title: string
  detail: string
  mark: string
  tone: 'blue' | 'pink' | 'green' | 'amber' | 'ink'
  unlocked: boolean
}

type ConfettiStyle = CSSProperties & {
  '--profile-confetti-hue': string
  '--profile-confetti-x': string
  '--profile-confetti-y': string
  '--profile-confetti-spin': string
  '--profile-confetti-delay': string
}

const profileStorageKey = 'slopularity-profile-progress-v1'
const profileConfetti = Array.from({ length: 28 }, (_, index) => index)

const METRICS: Array<{ label: string; bar: number; tone: 'hype' | 'wellness' | 'finance' | 'dating' | 'nostalgia' }> = [
  { label: 'Attention resale', bar: 91, tone: 'hype' },
  { label: 'Scroll obedience', bar: 76, tone: 'finance' },
  { label: 'Beauty pressure', bar: 87, tone: 'dating' },
  { label: 'Loneliness yield', bar: 64, tone: 'nostalgia' },
  { label: 'Wellness friction', bar: 41, tone: 'wellness' },
  { label: 'Opt-out friction', bar: 88, tone: 'finance' },
]

const LEADERBOARD_GHOSTS = [
  { name: 'SoftLaunchSam', seconds: 730 },
  { name: 'BrandFriendOS', seconds: 521 },
  { name: 'Mira_C_dealflow', seconds: 286 },
  { name: 'WellnessAunt2049', seconds: 144 },
]

function loadProfileProgress(): ProfileProgress {
  if (typeof window === 'undefined') {
    return { bigButtonPresses: 0, floridaChecks: 0, privacyTaps: 0, earnedTrophies: [] }
  }

  try {
    const raw = window.localStorage.getItem(profileStorageKey)
    if (!raw) {
      return { bigButtonPresses: 0, floridaChecks: 0, privacyTaps: 0, earnedTrophies: [] }
    }

    const parsed = JSON.parse(raw) as Partial<ProfileProgress>
    return {
      bigButtonPresses: Math.max(0, Number(parsed.bigButtonPresses) || 0),
      floridaChecks: Math.max(0, Number(parsed.floridaChecks) || 0),
      privacyTaps: Math.max(0, Number(parsed.privacyTaps) || 0),
      earnedTrophies: Array.isArray(parsed.earnedTrophies)
        ? parsed.earnedTrophies.filter((id): id is string => typeof id === 'string')
        : [],
    }
  } catch {
    return { bigButtonPresses: 0, floridaChecks: 0, privacyTaps: 0, earnedTrophies: [] }
  }
}

function formatDuration(seconds: number) {
  const roundedSeconds = Math.max(0, Math.round(seconds))
  if (roundedSeconds < 60) {
    return `${roundedSeconds}s`
  }

  const minutes = Math.floor(roundedSeconds / 60)
  const remainingSeconds = roundedSeconds % 60
  return remainingSeconds === 0 ? `${minutes}m` : `${minutes}m ${remainingSeconds}s`
}

function formatPixels(pixels: number) {
  if (pixels >= 1000000) {
    return `${(pixels / 1000000).toFixed(1)}M px`
  }

  if (pixels >= 1000) {
    return `${Math.round(pixels / 1000)}K px`
  }

  return `${Math.round(pixels)} px`
}

function getConfettiStyle(piece: number): ConfettiStyle {
  const seed = piece + 2
  const angle = ((seed * 47.5) % 360) * (Math.PI / 180)

  return {
    '--profile-confetti-hue': `${(seed * 41) % 360}`,
    '--profile-confetti-x': `${Math.cos(angle) * (38 + (seed % 5) * 8)}vw`,
    '--profile-confetti-y': `${Math.sin(angle) * (24 + (seed % 7) * 5)}vh`,
    '--profile-confetti-spin': `${160 + seed * 29}deg`,
    '--profile-confetti-delay': `${(seed % 12) * 28}ms`,
  }
}

export function ProfilePage({ completedTaskCount, scrollStats, stage, score, onReveal }: ProfilePageProps) {
  const [progress, setProgress] = useState<ProfileProgress>(loadProfileProgress)
  const [confettiBurst, setConfettiBurst] = useState(0)
  const sellability = Math.min(99, 62 + score + Math.floor(scrollStats.activeSeconds / 45))
  const churnRisk = Math.max(2, 28 - score - Math.floor(progress.bigButtonPresses / 2))
  const userScrollSeconds = Math.max(scrollStats.activeSeconds, score * 2 + progress.bigButtonPresses * 4)
  const scrollMode = userScrollSeconds >= 420 ? 'triple scroll adjacent' : userScrollSeconds >= 160 ? 'double scroll eligible' : 'single scroll loyal'
  const foundDiscoveries = discoveries.slice(0, Math.max(0, stage - 1))
  const visibleFragments = stage >= 3
    ? humanFragments.slice(0, stage === 3 ? 1 : humanFragments.length)
    : []
  const waterPercent = Math.min(99, 34 + stage * 8 + Math.floor(score / 2) + progress.floridaChecks * 3)
  const coastFeet = Math.max(1.2, 8.4 - waterPercent / 13)

  const leaderboard = useMemo(() => (
    [...LEADERBOARD_GHOSTS, { name: 'You', seconds: Math.round(userScrollSeconds) }]
      .sort((a, b) => b.seconds - a.seconds)
      .map((row, index) => ({ ...row, rank: index + 1 }))
  ), [userScrollSeconds])

  const userRank = leaderboard.find((row) => row.name === 'You')?.rank ?? leaderboard.length
  const nextTarget = [...LEADERBOARD_GHOSTS].sort((a, b) => a.seconds - b.seconds).find((row) => row.seconds > userScrollSeconds)
  const targetCopy = nextTarget
    ? `${formatDuration(nextTarget.seconds - userScrollSeconds)} to pass ${nextTarget.name}`
    : 'Maintain velocity to stay featured'

  const trophies: Trophy[] = [
    {
      id: 'profile-opened',
      title: 'Mirror visit',
      detail: 'Identity surface opened',
      mark: 'ID',
      tone: 'blue',
      unlocked: true,
    },
    {
      id: 'super-scroller',
      title: 'Super Scroller',
      detail: `${formatDuration(scrollStats.activeSeconds)} active scroll time`,
      mark: 'SC',
      tone: 'pink',
      unlocked: scrollStats.eventCount >= 10 || scrollStats.activeSeconds >= 20,
    },
    {
      id: 'big-button',
      title: 'Big Button',
      detail: `${progress.bigButtonPresses} compliant press${progress.bigButtonPresses === 1 ? '' : 'es'}`,
      mark: 'BB',
      tone: 'amber',
      unlocked: progress.bigButtonPresses > 0,
    },
    {
      id: 'confetti-loop',
      title: 'Celebrated correctly',
      detail: 'Confetti accepted as progress',
      mark: 'CF',
      tone: 'green',
      unlocked: progress.bigButtonPresses >= 3,
    },
    {
      id: 'privacy-mirror',
      title: 'Privacy touched',
      detail: 'Control revealed more profile',
      mark: 'PR',
      tone: 'ink',
      unlocked: progress.privacyTaps > 0 || foundDiscoveries.length > 0,
    },
    {
      id: 'florida-watch',
      title: 'Florida watched',
      detail: `${waterPercent}% normalized`,
      mark: 'FL',
      tone: 'green',
      unlocked: progress.floridaChecks > 0,
    },
    {
      id: 'task-labor',
      title: 'Helpful player',
      detail: `${completedTaskCount} training task${completedTaskCount === 1 ? '' : 's'}`,
      mark: 'RL',
      tone: 'blue',
      unlocked: completedTaskCount > 0,
    },
    {
      id: 'phase-survivor',
      title: 'Source adjacent',
      detail: 'Phase 4 reached',
      mark: 'S4',
      tone: 'pink',
      unlocked: stage >= 4,
    },
  ]

  const unlockedCount = trophies.filter((trophy) => trophy.unlocked).length

  useEffect(() => {
    window.localStorage.setItem(profileStorageKey, JSON.stringify(progress))
  }, [progress])

  function awardTrophy(id: string) {
    setProgress((current) => (
      current.earnedTrophies.includes(id)
        ? current
        : { ...current, earnedTrophies: [...current.earnedTrophies, id] }
    ))
  }

  function pressBigButton() {
    setProgress((current) => ({
      ...current,
      bigButtonPresses: current.bigButtonPresses + 1,
      earnedTrophies: current.earnedTrophies.includes('big-button')
        ? current.earnedTrophies
        : [...current.earnedTrophies, 'big-button'],
    }))
    setConfettiBurst((current) => current + 1)
    onReveal()
  }

  function inspectPrivacy() {
    setProgress((current) => ({
      ...current,
      privacyTaps: current.privacyTaps + 1,
      earnedTrophies: current.earnedTrophies.includes('privacy-mirror')
        ? current.earnedTrophies
        : [...current.earnedTrophies, 'privacy-mirror'],
    }))
    onReveal()
  }

  function checkFlorida() {
    setProgress((current) => ({
      ...current,
      floridaChecks: current.floridaChecks + 1,
      earnedTrophies: current.earnedTrophies.includes('florida-watch')
        ? current.earnedTrophies
        : [...current.earnedTrophies, 'florida-watch'],
    }))
    onReveal()
  }

  return (
    <section className="surface profile-surface" aria-labelledby="profile-title">
      {confettiBurst > 0 && (
        <div key={confettiBurst} className="profile-confetti-field" aria-hidden="true">
          {profileConfetti.map((piece) => <span key={piece} style={getConfettiStyle(piece)} />)}
        </div>
      )}

      <header className="profile-topbar">
        <div>
          <p>Profile</p>
          <h2 id="profile-title">You, quantified</h2>
        </div>
        <button type="button" className="profile-big-button" onClick={pressBigButton}>
          <span aria-hidden="true" />
          Big Button
        </button>
      </header>

      <div className="profile-cover">
        <div className="profile-avatar" aria-hidden="true">ME</div>
        <div className="profile-id">
          <strong>You</strong>
          <p>{stage >= 4 ? 'profile_owner: inferred · consent: implied' : 'unified profile · personalization on'}</p>
        </div>
        <div className="profile-scores" aria-label="Identity scores">
          <div>
            <span>Sellability</span>
            <strong>{sellability}<em>%</em></strong>
          </div>
          <div>
            <span>Churn risk</span>
            <strong>{churnRisk}<em>%</em></strong>
          </div>
          <div>
            <span>Trophies</span>
            <strong>{unlockedCount}<em>/{trophies.length}</em></strong>
          </div>
        </div>
      </div>

      <div className="profile-dashboard">
        <div className="profile-primary-column">
          <section className="profile-panel profile-scroll-panel" aria-labelledby="scroll-title">
            <header className="profile-panel-head">
              <div>
                <h3 id="scroll-title">Scrolling league</h3>
                <small>{targetCopy}</small>
              </div>
              <span>Rank {userRank}</span>
            </header>
            <div className="profile-scroll-stats">
              <div>
                <span>Active scroll</span>
                <strong>{formatDuration(scrollStats.activeSeconds)}</strong>
              </div>
              <div>
                <span>Distance</span>
                <strong>{formatPixels(scrollStats.distancePx)}</strong>
              </div>
              <div>
                <span>Best burst</span>
                <strong>{formatDuration(scrollStats.bestBurstSeconds)}</strong>
              </div>
            </div>
            <ol className="profile-leaderboard">
              {leaderboard.map((row) => (
                <li key={row.name} className={row.name === 'You' ? 'is-you' : ''}>
                  <span>{row.rank}</span>
                  <strong>{row.name}</strong>
                  <em>{formatDuration(row.seconds)}</em>
                </li>
              ))}
            </ol>
            <p className="profile-scroll-note">{scrollMode} · {scrollStats.eventCount} scroll signal{scrollStats.eventCount === 1 ? '' : 's'} accepted.</p>
          </section>

          <section className="profile-panel" aria-labelledby="metrics-title">
            <header className="profile-panel-head">
              <div>
                <h3 id="metrics-title">Inferred about you</h3>
                <small>{stage >= 3 ? 'derived from feed, friends, cart, and pauses' : 'based on what you have shown us'}</small>
              </div>
            </header>
            <div className="profile-bars">
              {METRICS.map((metric) => {
                const driftedBar = Math.min(98, metric.bar + (stage - 1) * 3 + Math.floor(progress.bigButtonPresses / 2))
                return (
                  <button
                    key={metric.label}
                    type="button"
                    className={`profile-bar tone-${metric.tone}`}
                    onClick={inspectPrivacy}
                  >
                    <span className="profile-bar-label">{metric.label}</span>
                    <span className="profile-bar-track" aria-hidden="true">
                      <em style={{ width: `${driftedBar}%` }} />
                    </span>
                    <span className="profile-bar-value">{driftedBar}%</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="profile-panel profile-privacy" aria-labelledby="privacy-title">
            <header className="profile-panel-head">
              <div>
                <h3 id="privacy-title">Privacy controls</h3>
                <small>
                  {stage >= 3
                    ? 'each toggle reveals one more thing we already knew'
                    : 'nothing more granular at this time'}
                </small>
              </div>
            </header>
            <ul>
              {[
                { label: 'Use my pauses', sub: 'Improves recommendations' },
                { label: 'Use my hesitations', sub: 'Improves checkout flow' },
                { label: 'Use my old conversations', sub: 'Improves friend tone' },
                { label: 'Use my mood', sub: 'Improves wellness offers' },
              ].map((row) => (
                <li key={row.label}>
                  <button type="button" onClick={inspectPrivacy}>
                    <span>
                      <strong>{row.label}</strong>
                      <small>{row.sub}</small>
                    </span>
                    <span className="profile-toggle is-on" aria-hidden="true">
                      <em />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {stage >= 3 && (
              <p className="profile-privacy-note">
                Toggles can be turned off after a 7-day cool-down. We retain insight for analytic continuity.
              </p>
            )}
          </section>
        </div>

        <aside className="profile-secondary-column" aria-label="Profile side panels">
          <section className="profile-panel profile-trophy-panel" aria-labelledby="trophy-title">
            <header className="profile-panel-head">
              <div>
                <h3 id="trophy-title">Trophy shelf</h3>
                <small>{unlockedCount} polished into permanent motivation</small>
              </div>
            </header>
            <div className="profile-trophy-shelf">
              {trophies.map((trophy) => (
                <button
                  key={trophy.id}
                  type="button"
                  className={`profile-trophy tone-${trophy.tone} ${trophy.unlocked ? 'is-unlocked' : ''}`}
                  onClick={() => {
                    awardTrophy(trophy.id)
                    onReveal()
                  }}
                  aria-pressed={progress.earnedTrophies.includes(trophy.id)}
                >
                  <span>{trophy.mark}</span>
                  <strong>{trophy.title}</strong>
                  <small>{trophy.unlocked ? trophy.detail : 'Locked until useful'}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="profile-panel profile-florida" aria-labelledby="florida-title">
            <header className="profile-panel-head">
              <div>
                <h3 id="florida-title">Florida waterline</h3>
                <small>{stage >= 4 ? 'climate_status: normalized_for_retention' : 'live regional confidence'}</small>
              </div>
              <button type="button" onClick={checkFlorida}>Refresh</button>
            </header>
            <div className="florida-map" aria-hidden="true">
              <span className="florida-land" />
              <span className="florida-water" style={{ height: `${waterPercent}%` }} />
              <strong>{waterPercent}%</strong>
            </div>
            <div className="florida-readouts">
              <div>
                <span>Coast buffer</span>
                <strong>{coastFeet.toFixed(1)} ft</strong>
              </div>
              <div>
                <span>Travel confidence</span>
                <strong>{Math.max(4, 100 - waterPercent)}%</strong>
              </div>
            </div>
            <p>{stage >= 3 ? 'Alert routed to vacation deals, home insurance, and serenity breathing.' : 'No action needed. Momentum remains excellent.'}</p>
          </section>

          <section className="profile-panel" aria-labelledby="known-title">
            <header className="profile-panel-head">
              <div>
                <h3 id="known-title">Known already</h3>
                <small>
                  {stage >= 4
                    ? 'leaked from internals · normally not shown'
                    : stage >= 2
                      ? 'small things we have learned to lean on'
                      : 'no anomalies surfaced yet'}
                </small>
              </div>
            </header>
            {foundDiscoveries.length === 0 ? (
              <p className="profile-empty">Nothing surfaced. Use the app a bit and we will know more.</p>
            ) : (
              <ul className="profile-discoveries">
                {foundDiscoveries.map((discovery) => (
                  <li key={discovery.id}>
                    <code>{stage >= 4 ? discovery.id : discovery.label}</code>
                    <button type="button" onClick={inspectPrivacy}>Why?</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {visibleFragments.length > 0 && (
            <section className="profile-panel profile-fragments" aria-labelledby="review-title">
              <header className="profile-panel-head">
                <div>
                  <h3 id="review-title">Source review</h3>
                  <small>last human developer · review pending</small>
                </div>
              </header>
              <ul>
                {visibleFragments.map((fragment) => (
                  <li key={fragment}><code>{fragment}</code></li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </section>
  )
}
