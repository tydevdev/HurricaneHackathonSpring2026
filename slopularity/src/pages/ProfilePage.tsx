import { discoveries, humanFragments } from '../content'

type ProfilePageProps = {
  stage: number
  score: number
  onReveal: () => void
}

const METRICS: Array<{ label: string; bar: number; tone: 'hype' | 'wellness' | 'finance' | 'dating' | 'nostalgia' }> = [
  { label: 'Beauty pressure', bar: 87, tone: 'dating' },
  { label: 'Loneliness yield', bar: 64, tone: 'nostalgia' },
  { label: 'Brand compliance', bar: 92, tone: 'hype' },
  { label: 'Wellness friction', bar: 41, tone: 'wellness' },
  { label: 'Investment posture', bar: 73, tone: 'finance' },
  { label: 'Opt-out friction', bar: 88, tone: 'finance' },
]

export function ProfilePage({ stage, score, onReveal }: ProfilePageProps) {
  const sellability = Math.min(99, 62 + score)
  const churnRisk = Math.max(2, 28 - score)
  const foundDiscoveries = discoveries.slice(0, Math.max(0, stage - 1))
  const visibleFragments = stage >= 3
    ? humanFragments.slice(0, stage === 3 ? 1 : humanFragments.length)
    : []

  return (
    <section className="surface profile-surface" aria-labelledby="profile-title">
      <div className="surface-heading">
        <div>
          <p>Identity</p>
          <h2 id="profile-title">How the app sees you</h2>
        </div>
        <span>{stage >= 4 ? 'privacy settings generated after collection' : 'personalization active'}</span>
      </div>

      <div className="profile-hero">
        <div className="profile-avatar" aria-hidden="true">ME</div>
        <div className="profile-id">
          <strong>You</strong>
          <p>{stage >= 4 ? 'profile_owner: inferred · consent: implied' : 'unified profile · personalization on'}</p>
        </div>
        <div className="profile-scores">
          <div>
            <span>Sellability</span>
            <strong>{sellability}<em>%</em></strong>
          </div>
          <div>
            <span>Churn risk</span>
            <strong>{churnRisk}<em>%</em></strong>
          </div>
          <div>
            <span>Phase</span>
            <strong>{stage}<em>/4</em></strong>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <header>
          <h3>Inferred about you</h3>
          <small>{stage >= 3 ? 'derived from feed, friends, cart, and pauses' : 'based on what you have shown us'}</small>
        </header>
        <div className="profile-bars">
          {METRICS.map((m) => {
            const driftedBar = Math.min(98, m.bar + (stage - 1) * 3)
            return (
              <button
                key={m.label}
                type="button"
                className={`profile-bar tone-${m.tone}`}
                onClick={onReveal}
              >
                <span className="profile-bar-label">{m.label}</span>
                <span className="profile-bar-track" aria-hidden="true">
                  <em style={{ width: `${driftedBar}%` }} />
                </span>
                <span className="profile-bar-value">{driftedBar}%</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="profile-section">
        <header>
          <h3>What the system already knows</h3>
          <small>
            {stage >= 4
              ? 'leaked from internals · normally not shown'
              : stage >= 2
                ? 'small things we have learned to lean on'
                : 'no anomalies surfaced — yet'}
          </small>
        </header>
        {foundDiscoveries.length === 0 ? (
          <p className="profile-empty">Nothing surfaced. Use the app a bit and we’ll know more.</p>
        ) : (
          <ul className="profile-discoveries">
            {foundDiscoveries.map((d) => (
              <li key={d.id}>
                <code>{stage >= 4 ? d.id : d.label}</code>
                <button type="button" onClick={onReveal}>Why am I seeing this?</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="profile-section profile-privacy">
        <header>
          <h3>Privacy controls</h3>
          <small>
            {stage >= 3
              ? 'each toggle reveals one more thing we already knew'
              : 'nothing more granular at this time'}
          </small>
        </header>
        <ul>
          {[
            { label: 'Use my pauses', sub: 'Improves recommendations' },
            { label: 'Use my hesitations', sub: 'Improves checkout flow' },
            { label: 'Use my old conversations', sub: 'Improves friend tone' },
            { label: 'Use my mood', sub: 'Improves wellness offers' },
          ].map((row) => (
            <li key={row.label}>
              <div>
                <strong>{row.label}</strong>
                <small>{row.sub}</small>
              </div>
              <span className="profile-toggle is-on" aria-hidden="true">
                <em />
              </span>
            </li>
          ))}
        </ul>
        {stage >= 3 && (
          <p className="profile-privacy-note">
            Toggles can be turned off after a 7-day cool-down. We retain insight for analytic continuity.
          </p>
        )}
      </div>

      {visibleFragments.length > 0 && (
        <div className="profile-section profile-fragments">
          <header>
            <h3>Source review</h3>
            <small>last human developer · review pending</small>
          </header>
          <ul>
            {visibleFragments.map((fragment) => (
              <li key={fragment}><code>{fragment}</code></li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
