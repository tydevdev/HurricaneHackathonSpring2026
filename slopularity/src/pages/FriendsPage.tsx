import { friendSeeds } from '../content'

type FriendsPageProps = {
  stage: number
  onReply: () => void
}

const STATUS_COPY: Record<string, string> = {
  online: 'online',
  reading: 'reading your feed',
  typing: 'typing…',
  sponsored: 'sponsored · still online',
}

export function FriendsPage({ stage, onReply }: FriendsPageProps) {
  return (
    <section className="surface friends-surface" aria-labelledby="friends-title">
      <div className="surface-heading">
        <div>
          <p>Friends</p>
          <h2 id="friends-title">Everyone agrees with you</h2>
        </div>
        <span>{stage >= 4 ? 'persona_variant: supportive_seller_v12' : 'warm replies ready'}</span>
      </div>

      <div className="friend-list">
        {friendSeeds.map((friend) => {
          const showIntent = stage >= 4
          const recommendedCopy = stage >= 3
            ? `${friend.product} — because support converts`
            : friend.product
          return (
            <article className={`friend-card tone-${friend.tone}`} key={friend.name}>
              <div className="friend-card-head">
                <div className="friend-avatar" aria-hidden="true">
                  <span>{friend.name.slice(0, 1)}</span>
                  <em className={`friend-presence is-${friend.status}`} />
                </div>
                <div className="friend-id">
                  <strong>{friend.name}</strong>
                  <small>
                    {friend.role}
                    <span className="friend-dot" aria-hidden="true">·</span>
                    {STATUS_COPY[friend.status]}
                  </small>
                </div>
                <button type="button" className="friend-reply" onClick={onReply}>
                  Reply
                </button>
              </div>

              <blockquote className="friend-voice">
                <p>“{friend.voice}”</p>
              </blockquote>

              {stage >= 2 && (
                <p className="friend-memory">
                  <span aria-hidden="true">◐</span>
                  {friend.memory}
                </p>
              )}

              <footer className="friend-rec">
                <div>
                  <span className="friend-rec-label">Recommended</span>
                  <strong>{recommendedCopy}</strong>
                  <small>{friend.productSub}</small>
                </div>
                <div className="friend-actions">
                  <button type="button" className="friend-accept" onClick={onReply}>
                    Add to cart
                  </button>
                  <button type="button" className="friend-skip" onClick={onReply}>
                    Maybe later
                  </button>
                </div>
              </footer>

              {showIntent && (
                <code className="friend-intent">{friend.intent}</code>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
