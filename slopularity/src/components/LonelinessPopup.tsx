type LonelinessPopupProps = {
  visible: boolean
  nudgeIndex: number
  onDismiss: () => void
  onAct: (destination: IdleNudgeDestination) => void
}

export type IdleNudgeDestination = 'feed' | 'friends' | 'search' | 'shop' | 'assistant'

type IdleNudge = {
  label: string
  title: string
  detail: string
  primaryLabel: string
  destination: IdleNudgeDestination
  rows: Array<{
    title: string
    detail: string
    initials: string
    tone: 'wellness' | 'hype' | 'nostalgia' | 'finance' | 'dating' | 'lucid'
  }>
}

const IDLE_NUDGES: IdleNudge[] = [
  {
    label: 'Stillness match',
    title: "You've been quiet. We found people who paused here too.",
    detail: 'They are all available, supportive, and suspiciously brand-aligned.',
    primaryLabel: 'Meet them',
    destination: 'friends',
    rows: [
      { title: 'Kai', detail: 'Wellness Ambassador', initials: 'KA', tone: 'wellness' },
      { title: 'Sable', detail: 'Brand Partner', initials: 'SA', tone: 'hype' },
      { title: 'Wren', detail: 'Community Lead', initials: 'WR', tone: 'nostalgia' },
    ],
  },
  {
    label: 'New post',
    title: "A new post you'll love just arrived.",
    detail: 'Love predicted from 4.8M saves, one late pause, and your current breathing pattern.',
    primaryLabel: 'Open post',
    destination: 'feed',
    rows: [
      { title: 'Mira Vale', detail: 'posted a vacation you can measure yourself against', initials: 'MV', tone: 'hype' },
      { title: 'For you', detail: 'saved under quiet aspiration', initials: 'FY', tone: 'wellness' },
    ],
  },
  {
    label: 'Article',
    title: 'People who stop scrolling all do this one thing.',
    detail: 'The source is "neuroscience-ish" and the answer is available after the next click.',
    primaryLabel: 'Read it',
    destination: 'search',
    rows: [
      { title: 'Attention doctors hate it', detail: '7 pause signals that reveal your hidden routine', initials: '7', tone: 'finance' },
      { title: 'Updated 3 min ago', detail: 'fact-checked by an adjacent summary', initials: 'AI', tone: 'lucid' },
    ],
  },
  {
    label: 'Friend text',
    title: 'Jules sent a text while you were gone.',
    detail: '"You still there? This made me think of you. Also no pressure but open it."',
    primaryLabel: 'Reply',
    destination: 'friends',
    rows: [
      { title: 'Jules', detail: 'typing encouragement with a product link attached', initials: 'JV', tone: 'nostalgia' },
      { title: 'Mara', detail: 'reacted "same" to your pause', initials: 'MA', tone: 'dating' },
    ],
  },
  {
    label: 'Offer',
    title: 'Your hesitation unlocked a small reward.',
    detail: 'The discount expires when confidence returns.',
    primaryLabel: 'Claim',
    destination: 'shop',
    rows: [
      { title: '$7.11 off', detail: 'applied to the thing we think you meant', initials: '$', tone: 'finance' },
      { title: 'Cart ready', detail: 'no items added, just context arranged', initials: 'CR', tone: 'hype' },
    ],
  },
  {
    label: 'Assistant',
    title: 'I can decide what you were about to do.',
    detail: 'You paused long enough for an intention draft.',
    primaryLabel: 'Let it decide',
    destination: 'assistant',
    rows: [
      { title: 'Intent draft', detail: 'open feed, compare self, buy relief, ask why', initials: 'ID', tone: 'lucid' },
      { title: 'Confidence', detail: 'high enough for a button', initials: '96', tone: 'wellness' },
    ],
  },
]

export function LonelinessPopup({ visible, nudgeIndex, onDismiss, onAct }: LonelinessPopupProps) {
  if (!visible) return null

  const nudge = IDLE_NUDGES[nudgeIndex % IDLE_NUDGES.length]!

  return (
    <div className="loneliness-popup" role="dialog" aria-label={nudge.label}>
      <div className="loneliness-card">
        <span className="loneliness-label">{nudge.label}</span>
        <p className="loneliness-header">
          <span className="loneliness-pulse" aria-hidden="true" />
          {nudge.title}
        </p>
        <p className="loneliness-detail">{nudge.detail}</p>

        <div className="loneliness-matches">
          {nudge.rows.map((m) => (
            <div className={`loneliness-match tone-${m.tone}`} key={`${nudge.label}-${m.title}`}>
              <span className="loneliness-avatar" aria-hidden="true">{m.initials}</span>
              <span className="loneliness-info">
                <strong>{m.title}</strong>
                <small>{m.detail}</small>
              </span>
            </div>
          ))}
        </div>

        <div className="loneliness-actions">
          <button type="button" className="loneliness-meet" onClick={() => onAct(nudge.destination)}>
            {nudge.primaryLabel}
          </button>
          <button type="button" className="loneliness-dismiss" onClick={onDismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
