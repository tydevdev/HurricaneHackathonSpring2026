import { useCallback, useState } from 'react'
import { crossTabActivities, pushActivity } from '../activityLog'
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

// ── Emotional upsell ladder ──
// Each friend has a 3-rung ladder. The first reply is empathy, the second is
// a gentle pivot, the third is the full pitch. The friend never breaks
// character — they sound caring the whole time.
type LadderRung = { friend: string; user: string }

function ladderResponse(_friendName: string, product: string, rungIndex: number): LadderRung {
  switch (rungIndex) {
    case 0:
      return {
        friend: 'I hear you. That sounds really heavy. You deserve to feel lighter.',
        user: '',
      }
    case 1:
      return {
        friend: `You know what helped me? ${product}. Just a thought — no pressure.`,
        user: '',
      }
    default:
      return {
        friend: `Seriously, ${product} changed everything. I can set up a free trial right now if you want. You deserve this.`,
        user: '',
      }
  }
}

// ── Script leak JSON (stage 4) ──
function intentJson(rungIndex: number): string {
  const variants = [
    '{"tone": "empathetic", "pivot_to": "none_yet", "user_sentiment": "vulnerable", "patience_remaining": 2}',
    '{"tone": "empathetic", "pivot_to": "soft_mention", "user_sentiment": "receptive", "discount_authorized": true}',
    '{"tone": "caring_close", "pivot_to": "checkout", "user_sentiment": "primed", "handoff_to": "cart_autofill"}',
  ]
  return variants[Math.min(rungIndex, variants.length - 1)]!
}

// ── Memory too good: cross-tab references ──
function memoryLine(friendIndex: number, stage: number): string | null {
  if (stage < 2) return null

  const recent = crossTabActivities('friends', 8)
  if (recent.length === 0) return null

  // Each friend picks a different recent activity so they don't all say the same thing
  const activity = recent[friendIndex % recent.length]
  if (!activity) return null

  const templates: Record<string, (label: string) => string> = {
    feed: (label) => `Saw you looking at that post about ${label}! Here's something related.`,
    games: (label) => `Nice work on ${label}! You should treat yourself — I know just the thing.`,
    shop: (label) => `Still thinking about ${label}? I can get you a better deal.`,
    search: (label) => `I noticed you searched for "${label}." Want me to narrow that down?`,
    nav: (label) => `You've been spending time on ${label}. Everything okay?`,
    assistant: () => 'I heard you asked the assistant something. I could have answered better.',
  }

  const template = templates[activity.surface]
  return template ? template(activity.label) : null
}

export function FriendsPage({ stage, onReply }: FriendsPageProps) {
  // Chat state: each friend has a list of { from, text } messages
  const [chats, setChats] = useState<Record<string, Array<{ from: 'user' | 'friend'; text: string }>>>({})
  const [inputs, setInputs] = useState<Record<string, string>>({})

  const sendMessage = useCallback(
    (friendName: string, product: string) => {
      const text = (inputs[friendName] ?? '').trim()
      if (!text) return

      const history = chats[friendName] ?? []
      const rungIndex = history.filter((m) => m.from === 'friend').length
      const response = ladderResponse(friendName, product, rungIndex)

      setChats((prev) => ({
        ...prev,
        [friendName]: [
          ...(prev[friendName] ?? []),
          { from: 'user' as const, text },
          { from: 'friend' as const, text: response.friend },
        ],
      }))
      setInputs((prev) => ({ ...prev, [friendName]: '' }))
      onReply()
      pushActivity('friends', 'chat', friendName)
    },
    [chats, inputs, onReply],
  )

  // ── Friend merge: Devon (index 2) and Jules (index 3) merge at stage 3+ ──
  const mergedFriends = friendSeeds.filter((_, i) => {
    // At stage 4, Jules (index 3) disappears entirely
    if (stage >= 4 && i === 3) return false
    return true
  })

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
        {mergedFriends.map((friend, filteredIndex) => {
          // Find original index for merge logic
          const originalIndex = friendSeeds.indexOf(friend)
          const isDevon = originalIndex === 2
          const isJules = originalIndex === 3
          const showMerge = stage >= 3 && (isDevon || isJules)

          // Merged name at stage 4 (Jules is filtered out, Devon gets both names)
          const displayName = stage >= 4 && isDevon
            ? 'Devon & Jules'
            : stage >= 3 && isDevon
              ? 'Devon'
              : stage >= 3 && isJules
                ? 'Jules'
                : friend.name

          // At stage 3+, Devon and Jules say the same thing
          const displayVoice = showMerge
            ? friendSeeds[2]!.voice
            : friend.voice

          // Merged avatar initials
          const displayInitials = stage >= 4 && isDevon
            ? 'D+J'
            : stage >= 3 && isDevon
              ? 'D/J'
              : stage >= 3 && isJules
                ? 'J/D'
                : friend.name.slice(0, 1)

          const showIntent = stage >= 4
          const recommendedCopy = stage >= 3
            ? `${friend.product} — because support converts`
            : friend.product

          // Cross-tab memory
          const memoryText = memoryLine(filteredIndex, stage) ?? friend.memory

          // Chat state
          const chatHistory = chats[friend.name] ?? []
          const inputValue = inputs[friend.name] ?? ''
          const rungIndex = chatHistory.filter((m) => m.from === 'friend').length

          return (
            <article className={`friend-card tone-${friend.tone} ${showMerge ? 'friend-merging' : ''}`} key={friend.name}>
              <div className="friend-card-head">
                <div className={`friend-avatar ${showMerge ? 'friend-avatar-merge' : ''}`} aria-hidden="true">
                  <span>{displayInitials}</span>
                  <em className={`friend-presence is-${friend.status}`} />
                </div>
                <div className="friend-id">
                  <strong>{displayName}</strong>
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
                <p>"{displayVoice}"</p>
              </blockquote>

              {stage >= 2 && (
                <p className="friend-memory">
                  <span aria-hidden="true">◐</span>
                  {memoryText}
                </p>
              )}

              {/* Chat history */}
              {chatHistory.length > 0 && (
                <div className="friend-chat-history">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`friend-chat-msg friend-chat-${msg.from}`}>
                      <p>{msg.text}</p>
                      {/* Script leak at stage 4 for friend messages */}
                      {stage >= 4 && msg.from === 'friend' && (
                        <code className="friend-script-leak">
                          {intentJson(Math.floor(i / 2))}
                        </code>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Chat input — emotional upsell ladder */}
              <div className="friend-chat-input">
                <input
                  type="text"
                  placeholder={rungIndex === 0 ? 'Tell them how you feel...' : rungIndex === 1 ? 'Say anything...' : 'One more thing...'}
                  value={inputValue}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, [friend.name]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendMessage(friend.name, friend.product)
                  }}
                  aria-label={`Message ${displayName}`}
                />
                <button
                  type="button"
                  onClick={() => sendMessage(friend.name, friend.product)}
                  disabled={!(inputs[friend.name] ?? '').trim()}
                >
                  Send
                </button>
              </div>

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
