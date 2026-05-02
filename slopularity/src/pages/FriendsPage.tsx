import { friendSeeds } from '../content'

type FriendsPageProps = {
  stage: number
  onReply: () => void
}

export function FriendsPage({ stage, onReply }: FriendsPageProps) {
  return (
    <section className="surface" aria-labelledby="friends-title">
      <div className="surface-heading">
        <div>
          <p>Friends</p>
          <h2 id="friends-title">Everyone agrees with you</h2>
        </div>
        <span>{stage >= 4 ? 'persona_variant: supportive_seller_v12' : 'warm replies ready'}</span>
      </div>
      <div className="friend-list">
        {friendSeeds.map((friend) => (
          <article className="friend-card" key={friend.name}>
            <div className="avatar" aria-hidden="true">{friend.name.slice(0, 1)}</div>
            <div>
              <p>{friend.name} <small>{friend.role}</small></p>
              <h3>{friend.line}</h3>
              <span>Recommended: {stage >= 3 ? `${friend.product} because support converts` : friend.product}</span>
            </div>
            <button type="button" onClick={onReply}>Reply</button>
          </article>
        ))}
      </div>
    </section>
  )
}
