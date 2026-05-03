import { fragmentLeaks } from '../content'
import type { Popup } from '../types'

type PopupSwarmProps = {
  popups: Popup[]
  stage: number
  muted: boolean
  onDismiss: (id: number) => void
  onAccept: (id: number) => void
  onOffer: (id: number) => void
  onClearAll: () => void
  onMute: () => void
}

const signalLabels: Record<Popup['source'], string> = {
  manual: 'summoned',
  idle: 'quiet signal',
  dismiss: 'soft follow-up',
}

export function PopupSwarm({
  popups,
  stage,
  muted,
  onDismiss,
  onAccept,
  onOffer,
  onClearAll,
  onMute,
}: PopupSwarmProps) {
  if (muted || popups.length === 0) {
    return null
  }

  const [activePopup, ...queuedPopups] = [...popups].reverse()
  if (!activePopup) return null

  const queueSummary =
    queuedPopups.length === 0
      ? '1 active message'
      : `1 active · ${queuedPopups.length} queued`

  return (
    <section className={`popup-swarm tone-${activePopup.tone}`} aria-label="Friend queue" aria-live="polite">
      <header className="popup-dock-head">
        <div className="popup-dock-title">
          <span className="popup-orbit" aria-hidden="true">
            <span />
          </span>
          <div>
            <strong>{stage >= 4 ? fragmentLeaks.popupHeader : 'Friend queue'}</strong>
            <small>{queueSummary}</small>
          </div>
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
      <article className={`chat-popup tone-${activePopup.tone}`} key={activePopup.id}>
        <div className="chat-popup-main">
          <button
            type="button"
            className="chat-popup-close"
            onClick={() => onDismiss(activePopup.id)}
            aria-label={`Dismiss ${activePopup.name}`}
          >
            ×
          </button>
          <div className="chat-head">
            <span className="chat-avatar" aria-hidden="true">
              {activePopup.name.slice(0, 1)}
            </span>
            <div className="chat-meta">
              <strong>{activePopup.name}</strong>
              <small>{stage >= 4 ? activePopup.intent : activePopup.role}</small>
            </div>
            <span className={`chat-signal signal-${activePopup.source}`}>
              {stage >= 4 ? `source:${activePopup.source}` : signalLabels[activePopup.source]}
            </span>
            <span className="chat-typing" aria-hidden="true">
              <span /><span /><span />
            </span>
          </div>
          <div className="chat-msg-wrap">
            <p className="chat-msg">{activePopup.message}</p>
          </div>
          <button
            type="button"
            className="chat-offer"
            onClick={() => onOffer(activePopup.id)}
            aria-label={`Open ${activePopup.name}'s recommendation in Shop`}
          >
            <span className="chat-offer-kicker">
              {stage >= 4 ? 'checkout handoff' : 'suggested next'}
            </span>
            <span>{activePopup.offer}</span>
            <strong>{stage >= 4 ? 'true' : 'Shop'}</strong>
          </button>
        </div>
        {queuedPopups.length > 0 && (
          <div className="chat-queue" aria-label="Queued friend messages">
            {queuedPopups.map((popup) => (
              <div className={`chat-queue-row tone-${popup.tone}`} key={popup.id}>
                <button type="button" onClick={() => onAccept(popup.id)}>
                  <span className="queue-avatar" aria-hidden="true">{popup.name.slice(0, 1)}</span>
                  <span>
                    <strong>{popup.name}</strong>
                    <small>{stage >= 4 ? popup.intent : signalLabels[popup.source]}</small>
                  </span>
                </button>
                <button
                  type="button"
                  className="queue-dismiss"
                  onClick={() => onDismiss(popup.id)}
                  aria-label={`Dismiss ${popup.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
          <div className="chat-actions">
            <button type="button" className="chat-accept" onClick={() => onAccept(activePopup.id)}>
              Reply in Friends
            </button>
            <button type="button" className="chat-decline" onClick={() => onDismiss(activePopup.id)}>
              Not now
            </button>
          </div>
      </article>
    </section>
  )
}
