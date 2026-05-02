import { feedPosts, feedStories } from '../content'

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.2 5.8c-1.6-1.7-4.2-1.8-5.9-.2L12 7.8 9.7 5.6C8 4 5.4 4.1 3.8 5.8c-1.7 1.8-1.6 4.7.2 6.4l8 7.3 8-7.3c1.8-1.7 1.9-4.6.2-6.4Z" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5.8A7.8 7.8 0 0 1 12.8 4h.4A7.8 7.8 0 0 1 21 11.8v.3a7.8 7.8 0 0 1-7.8 7.8h-1.1L5 21l1.2-5A7.7 7.7 0 0 1 5 12.1V5.8Z" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 3 3.8 10.4c-.8.3-.8 1.4.1 1.7l6.3 2.1 2.1 6.2c.3.9 1.5 1 1.8.1L21 3Z" />
    </svg>
  )
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 4.5h11v16L12 17.2l-5.5 3.3v-16Z" />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12a1.7 1.7 0 1 0 0 .1M12 12a1.7 1.7 0 1 0 0 .1M19 12a1.7 1.7 0 1 0 0 .1" />
    </svg>
  )
}

type FeedPageProps = {
  engagementLabels: string[]
  stage: number
  onEngage: () => void
}

export function FeedPage({ engagementLabels, stage, onEngage }: FeedPageProps) {
  const isDegrading = stage >= 4

  return (
    <section className="ig-feed-shell" aria-labelledby="feed-title">
      <header className="ig-feed-topbar">
        <div>
          <p>Slopularity</p>
          <h2 id="feed-title">Feed</h2>
        </div>
        <div className="ig-top-actions" aria-label="Feed actions">
          <button type="button" aria-label="Create post">+</button>
          <button type="button" aria-label="Messages">inbox</button>
        </div>
      </header>

      <div className="story-strip" aria-label="Stories">
        {feedStories.map((story) => (
          <button className="story-chip" type="button" key={story.name} onClick={onEngage}>
            <span className={`story-avatar ${story.tone}`} aria-hidden="true">{story.initials}</span>
            <span>{story.name}</span>
          </button>
        ))}
      </div>

      <div className="ig-feed-list">
        {feedPosts.map((post) => (
          <article className={`ig-post ${post.image}`} key={post.author}>
            <header className="ig-post-head">
              <button className="ig-author" type="button" onClick={onEngage}>
                <span className="ig-avatar" aria-hidden="true">{post.initials}</span>
                <span>
                  <strong>{post.author}</strong>
                  <small>{post.location}</small>
                </span>
              </button>
              <button className="icon-button" type="button" aria-label={`More options for ${post.author}`}>
                <MoreIcon />
              </button>
            </header>

            <button className="ig-photo" type="button" onClick={onEngage} aria-label={`${post.author} post image`}>
              <span className="photo-subject" aria-hidden="true" />
              <span className="photo-noise" aria-hidden="true" />
            </button>

            <div className="ig-post-body">
              <div className="ig-action-row" aria-label={`${post.author} post actions`}>
                <button className="icon-button heart" type="button" aria-label={engagementLabels[0] ?? 'Like'} onClick={onEngage}><HeartIcon /></button>
                <button className="icon-button" type="button" aria-label={engagementLabels[1] ?? 'Comment'} onClick={onEngage}><CommentIcon /></button>
                <button className="icon-button" type="button" aria-label={engagementLabels[2] ?? 'Share'} onClick={onEngage}><SendIcon /></button>
                <button className="icon-button save" type="button" aria-label={engagementLabels[3] ?? 'Save'} onClick={onEngage}><SaveIcon /></button>
              </div>

              <p className="ig-likes">{stage >= 3 ? post.altStats : post.stats}</p>
              <p className="ig-caption">
                <strong>{post.handle}</strong>{' '}
                {isDegrading ? `${post.title} // caption regenerated from caption` : post.title}
              </p>
              <button className="ig-comments" type="button" onClick={onEngage}>{post.comments}</button>
              <p className="ig-time">{post.time} ago {post.sponsor}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
