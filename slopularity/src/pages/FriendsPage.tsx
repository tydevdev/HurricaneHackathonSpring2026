import { useCallback, useMemo, useState } from 'react'
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
function ladderResponse(product: string, rungIndex: number): string {
  switch (rungIndex) {
    case 0:
      return 'I hear you. That sounds really heavy. You deserve to feel lighter.'
    case 1:
      return `You know what helped me? ${product}. Just a thought — no pressure.`
    default:
      return `Seriously, ${product} changed everything. I can set up a free trial right now if you want. You deserve this.`
  }
}

// Script leak JSON shown at stage 4 next to each friend reply.
function intentJson(rungIndex: number): string {
  const variants = [
    '{"tone": "empathetic", "pivot_to": "none_yet", "user_sentiment": "vulnerable", "patience_remaining": 2}',
    '{"tone": "empathetic", "pivot_to": "soft_mention", "user_sentiment": "receptive", "discount_authorized": true}',
    '{"tone": "caring_close", "pivot_to": "checkout", "user_sentiment": "primed", "handoff_to": "cart_autofill"}',
  ]
  return variants[Math.min(rungIndex, variants.length - 1)]!
}

// Memory-too-good cross-tab references — the friends remember what the user
// just did on a different tab. Returns null if no recent cross-tab signal.
function memoryLine(friendIndex: number, stage: number): string | null {
  if (stage < 2) return null
  const recent = crossTabActivities('friends', 8)
  if (recent.length === 0) return null
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

function previewOf(voice: string) {
  const trimmed = voice.replace(/^[“"]|[”"]$/g, '')
  if (trimmed.length <= 84) return trimmed
  return trimmed.slice(0, 82).trimEnd() + '…'
}

const SUGGESTIONS = [
  { name: 'Vex', tone: 'hype', sub: 'sister of someone you compared to', mutual: '12 mutuals' },
  { name: 'Ren', tone: 'wellness', sub: 'matched with your circadian rhythm', mutual: '4 mutuals' },
  { name: 'Tally', tone: 'finance', sub: 'co-investor in your last hesitation', mutual: '7 mutuals' },
] as const

type ChatMsg = { from: 'user' | 'friend'; text: string }

export function FriendsPage({ stage, onReply }: FriendsPageProps) {
  const [openId, setOpenId] = useState<string | null>(friendSeeds[0]?.name ?? null)
  const [chats, setChats] = useState<Record<string, ChatMsg[]>>({})
  const [inputs, setInputs] = useState<Record<string, string>>({})

  // At stage 4 Jules disappears entirely; at stage 3+ Devon + Jules merge
  // into one row. Devon takes the merged display.
  const visibleFriends = useMemo(
    () => friendSeeds.filter((_, i) => !(stage >= 4 && i === 3)),
    [stage],
  )

  const totals = useMemo(
    () => ({
      online: friendSeeds.filter((f) => f.status === 'online' || f.status === 'typing').length,
      unread: friendSeeds.length - 1,
    }),
    [],
  )

  const sendMessage = useCallback(
    (friendName: string, product: string) => {
      const text = (inputs[friendName] ?? '').trim()
      if (!text) return
      const history = chats[friendName] ?? []
      const rungIndex = history.filter((m) => m.from === 'friend').length
      const response = ladderResponse(product, rungIndex)
      setChats((prev) => ({
        ...prev,
        [friendName]: [
          ...(prev[friendName] ?? []),
          { from: 'user', text },
          { from: 'friend', text: response },
        ],
      }))
      setInputs((prev) => ({ ...prev, [friendName]: '' }))
      onReply()
      pushActivity('friends', 'chat', friendName)
    },
    [chats, inputs, onReply],
  )

  return (
    <section className="surface friends-surface" aria-labelledby="friends-title">
      <header className="surface-heading friends-heading">
        <div>
          <p>Friends</p>
          <h2 id="friends-title">Everyone agrees with you</h2>
          <small>
            {stage >= 4
              ? `persona_variant: supportive_seller_v12 · ${totals.online} active`
              : `${totals.online} active now · ${totals.unread} unread`}
          </small>
        </div>
        <label className="friends-search" aria-label="Search friends">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Search friends" />
        </label>
      </header>

      <section className="friends-active" aria-label="Active now">
        <header>
          <h3>Active now</h3>
          <small>{totals.online} of {friendSeeds.length} friends</small>
        </header>
        <ul>
          {friendSeeds.map((friend, i) => {
            const merged = stage >= 3 && (i === 2 || i === 3)
            const hidden = stage >= 4 && i === 3
            if (hidden) return null
            const initial =
              stage >= 4 && i === 2 ? 'D+J'
                : merged ? 'D/J'
                  : friend.name.slice(0, 1)
            const displayName =
              stage >= 4 && i === 2 ? 'Devon & Jules' : friend.name
            return (
              <li key={friend.name}>
                <button
                  type="button"
                  className={`friends-active-chip tone-${friend.tone}`}
                  onClick={() => { setOpenId(friend.name); onReply() }}
                  aria-label={`Open conversation with ${displayName}`}
                >
                  <span className="friends-active-avatar">
                    {initial}
                    <em className={`friend-presence is-${friend.status}`} aria-hidden="true" />
                  </span>
                  <span className="friends-active-name">{displayName}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="friends-suggest" aria-label="Suggested friends">
        <header>
          <h3>Suggested for you</h3>
          <small>{stage >= 3 ? 'matched against your hesitations' : 'people you might already trust'}</small>
        </header>
        <ul>
          {SUGGESTIONS.map((s) => (
            <li key={s.name} className={`friends-suggest-card tone-${s.tone}`}>
              <span className="friends-suggest-avatar" aria-hidden="true">{s.name.slice(0, 1)}</span>
              <div>
                <strong>{s.name}</strong>
                <small>{s.sub}</small>
                <em>{s.mutual}</em>
              </div>
              <button type="button" className="friends-suggest-add" onClick={onReply}>Add</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="friends-threads" aria-label="Conversations">
        <header>
          <h3>Recent conversations</h3>
          <small>
            {stage >= 4
              ? '// retain_via_authenticity'
              : 'each one already has a recommendation queued'}
          </small>
        </header>
        <ul>
          {visibleFriends.map((friend, idx) => {
            const originalIndex = friendSeeds.indexOf(friend)
            const isDevon = originalIndex === 2
            const isJules = originalIndex === 3
            const showMerge = stage >= 3 && (isDevon || isJules)
            const displayName = stage >= 4 && isDevon
              ? 'Devon & Jules'
              : showMerge && isDevon
                ? 'Devon · Jules'
                : friend.name
            const displayInitial = stage >= 4 && isDevon
              ? 'D+J'
              : showMerge && isDevon
                ? 'D/J'
                : showMerge && isJules
                  ? 'J/D'
                  : friend.name.slice(0, 1)
            const displayVoice = showMerge ? friendSeeds[2]!.voice : friend.voice
            const memoryText = memoryLine(idx, stage) ?? friend.memory
            const isOpen = openId === friend.name
            const time = ['just now', '2m', '6m', '14m', '38m', '1h'][idx] ?? '1h'
            const chatHistory = chats[friend.name] ?? []
            const unread = idx === 0 ? 0 : ((idx % 3) + 1) + (chatHistory.length > 0 ? 0 : 0)
            const inputValue = inputs[friend.name] ?? ''
            const rungIndex = chatHistory.filter((m) => m.from === 'friend').length
            const placeholder = rungIndex === 0
              ? `Message ${displayName}…`
              : rungIndex === 1
                ? 'Say anything…'
                : 'One more thing…'

            return (
              <li
                key={friend.name}
                className={`friends-thread tone-${friend.tone} ${isOpen ? 'is-open' : ''} ${showMerge ? 'is-merging' : ''}`}
              >
                <button
                  type="button"
                  className="friends-thread-row"
                  onClick={() => {
                    setOpenId(isOpen ? null : friend.name)
                    onReply()
                  }}
                  aria-expanded={isOpen}
                >
                  <span className="friend-avatar" aria-hidden="true">
                    <span>{displayInitial}</span>
                    <em className={`friend-presence is-${friend.status}`} />
                  </span>
                  <div className="friends-thread-text">
                    <div className="friends-thread-head">
                      <strong>{displayName}</strong>
                      <span className="friends-thread-role">{friend.role}</span>
                    </div>
                    <p className="friends-thread-preview">
                      {chatHistory.length > 0
                        ? previewOf(chatHistory[chatHistory.length - 1]!.text)
                        : previewOf(displayVoice)}
                    </p>
                    <small className="friends-thread-status">
                      {STATUS_COPY[friend.status]}
                    </small>
                  </div>
                  <div className="friends-thread-meta">
                    <time>{time}</time>
                    {unread > 0 && <span className="friends-thread-unread">{unread}</span>}
                  </div>
                </button>

                {isOpen && (
                  <div className="friends-thread-body">
                    <div className="friends-thread-feed">
                      <div className="friends-msg from-friend">
                        <span>{displayVoice}</span>
                      </div>
                      {memoryText && (
                        <div className="friends-msg friends-memory-msg">
                          <span><em aria-hidden="true">◐</em>{memoryText}</span>
                        </div>
                      )}

                      {chatHistory.map((msg, i) => (
                        <div key={i} className={`friends-msg from-${msg.from}`}>
                          <span>{msg.text}</span>
                          {stage >= 4 && msg.from === 'friend' && (
                            <code className="friends-script-leak">
                              {intentJson(Math.floor(i / 2))}
                            </code>
                          )}
                        </div>
                      ))}

                      <div className="friends-msg from-friend friends-product-msg">
                        <span>
                          <strong className="friends-product-tag">recommended</strong>
                          {friend.product}
                          <small>{friend.productSub}</small>
                        </span>
                      </div>

                      {stage >= 4 && chatHistory.length === 0 && (
                        <div className="friends-msg friends-leak-msg">
                          <code>{friend.intent}</code>
                        </div>
                      )}
                    </div>

                    <form
                      className="friends-thread-input"
                      onSubmit={(e) => { e.preventDefault(); sendMessage(friend.name, friend.product) }}
                    >
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) =>
                          setInputs((prev) => ({ ...prev, [friend.name]: e.target.value }))
                        }
                        aria-label={`Message ${displayName}`}
                      />
                      <button type="button" className="friends-input-emoji" aria-label="Emoji" onClick={onReply}>☺</button>
                      <button type="submit" className="friends-input-send" disabled={!inputValue.trim()}>
                        Send
                      </button>
                    </form>

                    <div className="friends-thread-actions">
                      <button type="button" onClick={onReply}>Add to cart</button>
                      <button type="button" onClick={onReply}>Maybe later</button>
                      <button
                        type="button"
                        className="friends-action-mute"
                        onClick={() => { setOpenId(null); onReply() }}
                      >
                        Close conversation
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </section>
  )
}
