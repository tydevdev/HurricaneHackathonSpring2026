// "We matched you with 3 people who also paused here."
// The matches are product ambassadors. The loneliness is the product.

type LonelinessPopupProps = {
  visible: boolean
  onDismiss: () => void
  onMeet: () => void
}

const MATCHES = [
  { name: 'Kai', role: 'Wellness Ambassador', initials: 'KA', tone: 'wellness' as const },
  { name: 'Sable', role: 'Brand Partner', initials: 'SA', tone: 'hype' as const },
  { name: 'Wren', role: 'Community Lead', initials: 'WR', tone: 'nostalgia' as const },
]

export function LonelinessPopup({ visible, onDismiss, onMeet }: LonelinessPopupProps) {
  if (!visible) return null

  return (
    <div className="loneliness-popup" role="dialog" aria-label="Matched with nearby users">
      <div className="loneliness-card">
        <p className="loneliness-header">
          <span className="loneliness-pulse" aria-hidden="true" />
          You've been quiet. We've matched you with 3 people who also paused here.
        </p>

        <div className="loneliness-matches">
          {MATCHES.map((m) => (
            <div className={`loneliness-match tone-${m.tone}`} key={m.name}>
              <span className="loneliness-avatar">{m.initials}</span>
              <span className="loneliness-info">
                <strong>{m.name}</strong>
                <small>{m.role}</small>
              </span>
            </div>
          ))}
        </div>

        <div className="loneliness-actions">
          <button type="button" className="loneliness-meet" onClick={onMeet}>
            Meet them
          </button>
          <button type="button" className="loneliness-dismiss" onClick={onDismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
