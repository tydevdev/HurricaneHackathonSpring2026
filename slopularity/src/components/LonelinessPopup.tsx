import type { CSSProperties } from 'react'

type LonelinessPopupProps = {
  visible: boolean
  nudgeIndex: number
  onDismiss: () => void
  onAct: (action: IdleNudgeAction) => void
}

export type IdleNudgeAction =
  | { kind: 'feed-post'; postId: string }
  | { kind: 'friends'; friendName?: string }
  | { kind: 'search'; query: string }
  | { kind: 'shop'; productId?: string }
  | { kind: 'assistant'; prompt: string }

type IdleNudge = {
  label: string
  title: string
  detail: string
  primaryLabel: string
  primaryAction: IdleNudgeAction
  rows: Array<{
    title: string
    detail: string
    initials: string
    tone: 'wellness' | 'hype' | 'nostalgia' | 'finance' | 'dating' | 'lucid'
    action: IdleNudgeAction
  }>
}

type AttentionLazerStyle = CSSProperties & {
  '--attention-lazer-angle': string
  '--attention-lazer-hue': string
  '--attention-lazer-delay': string
}

type AttentionConfettiStyle = CSSProperties & {
  '--attention-confetti-x': string
  '--attention-confetti-y': string
  '--attention-confetti-rotate': string
  '--attention-confetti-hue': string
  '--attention-confetti-delay': string
}

const attentionLazers = Array.from({ length: 14 }, (_, index) => index)
const attentionConfetti = Array.from({ length: 48 }, (_, index) => index)

function getAttentionLazerStyle(index: number): AttentionLazerStyle {
  const spread = 360 / attentionLazers.length

  return {
    '--attention-lazer-angle': `${index * spread - 90}deg`,
    '--attention-lazer-hue': `${(index * 53 + 14) % 360}`,
    '--attention-lazer-delay': `${(index % 7) * 48}ms`,
  }
}

function getAttentionConfettiStyle(index: number): AttentionConfettiStyle {
  const angle = index * 137.5
  const distance = 140 + (index % 9) * 18
  const x = Math.cos((angle * Math.PI) / 180) * distance
  const y = Math.sin((angle * Math.PI) / 180) * distance

  return {
    '--attention-confetti-x': `${x}px`,
    '--attention-confetti-y': `${y}px`,
    '--attention-confetti-rotate': `${index * 31}deg`,
    '--attention-confetti-hue': `${(index * 41 + 22) % 360}`,
    '--attention-confetti-delay': `${(index % 16) * 26}ms`,
  }
}

const IDLE_NUDGES: IdleNudge[] = [
  {
    label: 'Stillness match',
    title: "You've been quiet. We found people who paused here too.",
    detail: 'They are all available, supportive, and suspiciously brand-aligned.',
    primaryLabel: 'Meet them',
    primaryAction: { kind: 'friends', friendName: 'Pia' },
    rows: [
      { title: 'Kai', detail: 'Wellness Ambassador', initials: 'KA', tone: 'wellness', action: { kind: 'friends', friendName: 'Pia' } },
      { title: 'Sable', detail: 'Brand Partner', initials: 'SA', tone: 'hype', action: { kind: 'shop', productId: 'glownest' } },
      { title: 'Wren', detail: 'Community Lead', initials: 'WR', tone: 'nostalgia', action: { kind: 'friends', friendName: 'Marlo' } },
    ],
  },
  {
    label: 'New post',
    title: "A new post you'll love just arrived.",
    detail: 'Love predicted from 4.8M saves, one late pause, and your current breathing pattern.',
    primaryLabel: 'Open post',
    primaryAction: { kind: 'feed-post', postId: 'glass-ledger' },
    rows: [
      { title: 'Mira Vale', detail: 'posted a vacation you can measure yourself against', initials: 'MV', tone: 'hype', action: { kind: 'feed-post', postId: 'glass-ledger' } },
      { title: 'For you', detail: 'saved under quiet aspiration', initials: 'FY', tone: 'wellness', action: { kind: 'feed-post', postId: 'glass-ledger' } },
    ],
  },
  {
    label: 'Article',
    title: 'People who stop scrolling all do this one thing.',
    detail: 'The source is "neuroscience-ish" and the answer is available after the next click.',
    primaryLabel: 'Read it',
    primaryAction: { kind: 'search', query: 'People who stop scrolling all do this one thing' },
    rows: [
      { title: 'Attention doctors hate it', detail: '7 pause signals that reveal your hidden routine', initials: '7', tone: 'finance', action: { kind: 'search', query: '7 pause signals that reveal your hidden routine' } },
      { title: 'Updated 3 min ago', detail: 'fact-checked by an adjacent summary', initials: 'AI', tone: 'lucid', action: { kind: 'search', query: 'fact checked by an adjacent summary' } },
    ],
  },
  {
    label: 'Friend text',
    title: 'Jules sent a text while you were gone.',
    detail: '"You still there? This made me think of you. Also no pressure but open it."',
    primaryLabel: 'Reply',
    primaryAction: { kind: 'friends', friendName: 'Jules' },
    rows: [
      { title: 'Jules', detail: 'typing encouragement with a product link attached', initials: 'JV', tone: 'nostalgia', action: { kind: 'friends', friendName: 'Jules' } },
      { title: 'Mara', detail: 'reacted "same" to your pause', initials: 'MA', tone: 'dating', action: { kind: 'friends', friendName: 'Jules' } },
    ],
  },
  {
    label: 'Offer',
    title: 'Your hesitation unlocked a small reward.',
    detail: 'The discount expires when confidence returns.',
    primaryLabel: 'Claim',
    primaryAction: { kind: 'shop', productId: 'context' },
    rows: [
      { title: '$7.11 off', detail: 'applied to the thing we think you meant', initials: '$', tone: 'finance', action: { kind: 'shop', productId: 'aurabank' } },
      { title: 'Cart ready', detail: 'no items added, just context arranged', initials: 'CR', tone: 'hype', action: { kind: 'shop', productId: 'context' } },
    ],
  },
  {
    label: 'Assistant',
    title: 'I can decide what you were about to do.',
    detail: 'You paused long enough for an intention draft.',
    primaryLabel: 'Let it decide',
    primaryAction: { kind: 'assistant', prompt: 'decide what I was about to do' },
    rows: [
      { title: 'Intent draft', detail: 'open feed, compare self, buy relief, ask why', initials: 'ID', tone: 'lucid', action: { kind: 'assistant', prompt: 'open feed, compare self, buy relief, ask why' } },
      { title: 'Confidence', detail: 'high enough for a button', initials: '96', tone: 'wellness', action: { kind: 'assistant', prompt: 'pick the next action with 96 percent confidence' } },
    ],
  },
]

export function LonelinessPopup({ visible, nudgeIndex, onDismiss, onAct }: LonelinessPopupProps) {
  if (!visible) return null

  const nudge = IDLE_NUDGES[nudgeIndex % IDLE_NUDGES.length]!

  return (
    <div className="loneliness-popup" role="dialog" aria-label={nudge.label}>
      <div className="attention-lazer-field" aria-hidden="true">
        {attentionLazers.map((lazer) => (
          <span key={lazer} style={getAttentionLazerStyle(lazer)} />
        ))}
      </div>
      <div className="attention-confetti-field" aria-hidden="true">
        {attentionConfetti.map((piece) => (
          <span key={piece} style={getAttentionConfettiStyle(piece)} />
        ))}
      </div>
      <div className="loneliness-card">
        <span className="loneliness-label">{nudge.label}</span>
        <p className="loneliness-header">
          <span className="loneliness-pulse" aria-hidden="true" />
          {nudge.title}
        </p>
        <p className="loneliness-detail">{nudge.detail}</p>

        <div className="loneliness-matches">
          {nudge.rows.map((m) => (
            <button
              type="button"
              className={`loneliness-match tone-${m.tone}`}
              key={`${nudge.label}-${m.title}`}
              onClick={() => onAct(m.action)}
            >
              <span className="loneliness-avatar" aria-hidden="true">{m.initials}</span>
              <span className="loneliness-info">
                <strong>{m.title}</strong>
                <small>{m.detail}</small>
              </span>
            </button>
          ))}
        </div>

        <div className="loneliness-actions">
          <button type="button" className="loneliness-meet" onClick={() => onAct(nudge.primaryAction)}>
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
