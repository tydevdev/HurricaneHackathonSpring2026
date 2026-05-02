import { feedPosts } from '../content'

type FeedPageProps = {
  engagementLabels: string[]
  stage: number
  onEngage: () => void
}

export function FeedPage({ engagementLabels, stage, onEngage }: FeedPageProps) {
  return (
    <section className="surface feed-surface" aria-labelledby="feed-title">
      <div className="surface-heading">
        <div>
          <p>Live feed</p>
          <h2 id="feed-title">People you could become if you bought correctly</h2>
        </div>
        <span>{stage >= 3 ? 'synthetic lifestyle loop detected' : 'personalized for aspiration'}</span>
      </div>

      <div className="feed-grid">
        {feedPosts.map((post, index) => (
          <article className={`post-card ${post.image}`} key={post.author}>
            <div className="post-image" aria-hidden="true">
              <span>{index + 1}</span>
            </div>
            <div className="post-copy">
              <p>{post.author} <small>{post.handle}</small></p>
              <h3>{stage >= 4 ? `${post.title} // caption regenerated from caption` : post.title}</h3>
              <span>{post.sponsor}</span>
              <span>{stage >= 3 ? `${post.stats} / 12K envy events` : post.stats}</span>
            </div>
            <div className="engagement-row">
              {engagementLabels.map((label) => (
                <button key={label} type="button" onClick={onEngage}>{label}</button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
