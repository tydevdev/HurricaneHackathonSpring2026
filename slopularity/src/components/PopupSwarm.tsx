import type { Popup } from '../types'

type PopupSwarmProps = {
  popups: Popup[]
  stage: number
  onDismiss: (id: number) => void
  onAccept: () => void
}

export function PopupSwarm({ popups, stage, onDismiss, onAccept }: PopupSwarmProps) {
  if (popups.length === 0) {
    return null
  }

  return (
    <section className="popup-swarm" aria-label="Chat popups">
      {popups.map((popup) => (
        <article className="chat-popup" key={popup.id}>
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
