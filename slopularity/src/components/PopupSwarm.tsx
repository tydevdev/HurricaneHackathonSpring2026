import type { Popup } from '../types'

type PopupSwarmProps = {
  popups: Popup[]
  stage: number
  muted: boolean
  onDismiss: (id: number) => void
  onAccept: () => void
  onClearAll: () => void
  onMute: () => void
}

export function PopupSwarm({
  popups,
  stage,
  muted,
  onDismiss,
  onAccept,
  onClearAll,
  onMute,
}: PopupSwarmProps) {
  if (muted || popups.length === 0) {
    return null
  }

  return (
    <section className="popup-swarm" aria-label="Friend popups">
      <header className="popup-dock-head">
        <div>
          <strong>Friends checking in</strong>
          <small>{popups.length === 1 ? '1 message' : `${popups.length} messages`}</small>
        </div>
        <div className="popup-dock-actions">
          <button type="button" className="popup-dock-link" onClick={onClearAll}>
            Clear all
          </button>
          <button type="button" className="popup-dock-mute" onClick={onMute} aria-label="Mute friend popups">
            Mute
          </button>
        </div>
      </header>
      {popups.map((popup, idx) => (
        <article
          className={`chat-popup tone-${popup.tone}`}
          key={popup.id}
          style={{ animationDelay: `${idx * 80}ms` }}
        >
          <button
            type="button"
            className="chat-popup-close"
            onClick={() => onDismiss(popup.id)}
            aria-label={`Dismiss ${popup.name}`}
          >
            ×
          </button>
          <div className="chat-head">
            <span className="chat-avatar" aria-hidden="true">
              {popup.name.slice(0, 1)}
            </span>
            <div className="chat-meta">
              <strong>{popup.name}</strong>
              <small>{stage >= 4 ? popup.intent : popup.role}</small>
            </div>
            <span className="chat-typing" aria-hidden="true">
              <span /><span /><span />
            </span>
          </div>
          <p className="chat-msg">{popup.message}</p>
          <p className="chat-offer">
            <span className="chat-offer-tag">recommended</span>
            {popup.offer}
          </p>
          <div className="chat-actions">
            <button type="button" className="chat-accept" onClick={onAccept}>
              Chat back
            </button>
            <button type="button" className="chat-decline" onClick={() => onDismiss(popup.id)}>
              Not now
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}
