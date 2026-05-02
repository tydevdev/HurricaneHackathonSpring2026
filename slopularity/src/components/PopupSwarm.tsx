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

export function PopupSwarm({ popups, stage, muted, onDismiss, onAccept, onClearAll, onMute }: PopupSwarmProps) {
  if (muted || popups.length === 0) {
    return null
  }

  return (
    <section className="popup-swarm" aria-label="Chat popups">
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
      {popups.map((popup) => (
        <article className="chat-popup" key={popup.id}>
          <button
            type="button"
            className="chat-popup-close"
            onClick={() => onDismiss(popup.id)}
            aria-label={`Dismiss ${popup.name}`}
          >
            ×
          </button>
          <div className="chat-head">
            <span>{popup.name.slice(0, 1)}</span>
            <div>
              <strong>{popup.name}</strong>
              <small>{stage >= 4 ? 'friendship_intent: monetize_loneliness' : popup.role}</small>
            </div>
          </div>
          <p>{popup.message}</p>
          <span>{popup.offer}</span>
          <div className="chat-actions">
            <button type="button" onClick={onAccept}>Chat</button>
            <button type="button" onClick={() => onDismiss(popup.id)}>Not now</button>
          </div>
        </article>
      ))}
    </section>
  )
}
