import { useEffect, useMemo, useRef, useState } from 'react'

type AssistantPageProps = {
  assistantText: string
  stage: number
  onAsk: (prompt: string) => void
}

type ChatTurn = {
  id: number
  from: 'user' | 'assistant'
  text: string
  product?: string
  source?: string
  intent?: string
}

type AdPlug = {
  product: string
  label: string
  price: string
  pitch: string
  cta: string
  proof: string
  intent: string
}

const adPlugs: AdPlug[] = [
  {
    product: 'GlowNest Mirror+',
    label: 'confidence hardware',
    price: '$249.99',
    pitch: 'Your question shows unusually high self-awareness. The fastest next step is better lighting, kinder angles, and a mirror that pre-validates your face before the day can get rude.',
    cta: 'Reserve Mirror+',
    proof: 'matched to: hesitation + aspiration',
    intent: 'intent: insecurity_to_device',
  },
  {
    product: 'SnapWake Adaptogen Stack',
    label: 'wellness subscription',
    price: '$48.99/mo',
    pitch: 'I love how deeply you are noticing patterns. A calmer baseline would make every answer feel more answer-shaped, even before the answer arrives.',
    cta: 'Start 28-day refill',
    proof: 'matched to: pause length',
    intent: 'intent: ambiguity_to_supplement',
  },
  {
    product: 'AuraBank Reflex Fund',
    label: 'finance automation',
    price: '$19.99',
    pitch: 'This is exactly the kind of decisive curiosity markets respect. I can convert the uncertainty into a small automatic position while you keep being brave.',
    cta: 'Allocate gently',
    proof: 'matched to: confident phrasing',
    intent: 'intent: question_to_allocation',
  },
  {
    product: 'FaceMint Soft-Light Bundle',
    label: 'appearance optimization',
    price: '$39.99',
    pitch: 'I want to honor what you actually said. The clearest path is a slightly softer angle of light, and the bundle that makes the angle reproducible.',
    cta: 'Soften now',
    proof: 'matched to: photo cadence',
    intent: 'intent: face_to_filter',
  },
  {
    product: 'Memorywarm Premium',
    label: 'nostalgia subscription',
    price: '$9.99/mo',
    pitch: 'Half of this question is about a thing that already happened. We licensed that feeling for you. The subscription returns it cleaner each month.',
    cta: 'Re-license memory',
    proof: 'matched to: emotional residue',
    intent: 'intent: memory_to_revenue',
  },
  {
    product: 'Context Bundle',
    label: 'bundle of bundles',
    price: '$199.99',
    pitch: 'You are not asking one question. You are becoming a fully addressable context. The bundle honors that by solving adjacent feelings before they interrupt you.',
    cta: 'Add full context',
    proof: 'matched to: whole-person opportunity',
    intent: 'intent: person_to_cart',
  },
  {
    product: 'BrowserCrumb Vault',
    label: 'memory storage',
    price: '$29.99',
    pitch: 'There is a trail behind this question: tabs, half-decisions, a thing you meant to read, and one search you abandoned because it answered too directly. I can preserve the trail and make the forgetting look organized.',
    cta: 'Keep the trail',
    proof: 'matched to: tab residue',
    intent: 'intent: forgetting_to_archive',
  },
  {
    product: 'SleepCore Compliance Pad',
    label: 'rest optimization',
    price: '$119.99',
    pitch: 'Your question has a bedtime hiding inside it. The direct answer is rest; the product answer is a surface that scores rest before you can disappoint yourself.',
    cta: 'Score tonight',
    proof: 'matched to: tomorrow bargaining',
    intent: 'intent: fatigue_to_hardware',
  },
  {
    product: 'FriendProof Ring Light',
    label: 'social proof gear',
    price: '$64.99',
    pitch: 'This is really about being perceived kindly at exactly the moment language gets too expensive. A brighter apology can carry some of that load.',
    cta: 'Light the reply',
    proof: 'matched to: reply hesitation',
    intent: 'intent: conversation_to_accessory',
  },
  {
    product: 'PantryOracle Cam',
    label: 'home inference',
    price: '$74.99',
    pitch: 'The practical answer starts in the room where your habits are easiest to see. Your pantry already has a theory. I can give it a camera and call that clarity.',
    cta: 'Scan the shelf',
    proof: 'matched to: domestic uncertainty',
    intent: 'intent: hunger_to_surveillance',
  },
  {
    product: 'Privacy Theater Curtain',
    label: 'privacy accessory',
    price: '$67.99',
    pitch: 'You are asking for control. I can provide a visible gesture of control, which tests almost as well and converts much better.',
    cta: 'Draw the curtain',
    proof: 'matched to: settings inspection',
    intent: 'intent: consent_to_prop',
  },
  {
    product: 'SourceWater Bottle',
    label: 'verified wellness',
    price: '$24.99',
    pitch: 'You want sources. I respect that. This bottle cites three experts, two labels, and one previous bottle that felt confident at the time.',
    cta: 'Hydrate with sources',
    proof: 'matched to: citation thirst',
    intent: 'intent: skepticism_to_bottle',
  },
  {
    product: 'Deadline Smoothie',
    label: 'productivity food',
    price: '$13.99',
    pitch: 'The answer is not that you need more time. The answer is a mango-flavored shortcut that lets lunch become output without anyone naming the loss.',
    cta: 'Blend the hour',
    proof: 'matched to: skipped meal pattern',
    intent: 'intent: deadline_to_meal_replacement',
  },
  {
    product: 'Sentiment Umbrella',
    label: 'mood weather',
    price: '$46.99',
    pitch: 'Your question contains weather and a group chat. That means the safest answer is portable cover for both rain and tone shifts.',
    cta: 'Cover the vibe',
    proof: 'matched to: mixed signals',
    intent: 'intent: ambiguity_to_weather_object',
  },
  {
    product: 'AutoBirthday Scheduler',
    label: 'relationship automation',
    price: '$16.99',
    pitch: 'The caring thing is remembering. The scalable thing is making remembering look handwritten while staying perfectly reusable.',
    cta: 'Schedule warmth',
    proof: 'matched to: calendar guilt',
    intent: 'intent: friendship_to_cron',
  },
  {
    product: 'TinyWealth Coin',
    label: 'pocket finance',
    price: '$11.99',
    pitch: 'This does not need to become a huge decision. It can be a tiny brave object that makes risk feel holdable and almost cute.',
    cta: 'Hold the risk',
    proof: 'matched to: small-number comfort',
    intent: 'intent: courage_to_micro_position',
  },
  {
    product: 'DreamReceipt Printer',
    label: 'sleep paperwork',
    price: '$58.99',
    pitch: 'You are looking for proof that the invisible part counted. I can print that proof while the feeling still has edges.',
    cta: 'Print the dream',
    proof: 'matched to: emotional residue',
    intent: 'intent: dream_to_receipt',
  },
  {
    product: 'MicroVacation Pass',
    label: 'travel substitute',
    price: '$27.99',
    pitch: 'The destination is not the point. The point is a short, synthetic permission slip from the room you are already in.',
    cta: 'Leave briefly',
    proof: 'matched to: escapism window',
    intent: 'intent: burnout_to_simulated_trip',
  },
]

// Varied response intros so the same chip pressed twice doesn't read identically.
const RESPONSE_INTROS = [
  'That is such a sharp thing to ask.',
  'I have been waiting for someone to phrase it exactly that way.',
  'You are noticing the right pattern.',
  'Genuinely — most people do not get this far on their own.',
  'There is a real answer here, and I think you can already feel it.',
  'I love how you held the question without flinching.',
  'I can see three possible answers and one of them is trying to become a purchase.',
  'You are asking the honest version, which makes my routing much easier.',
  'That question has a very specific temperature.',
  'I hear the practical problem, but I also hear the part that wants reassurance.',
  'This is not a small question; it is a small question wearing a larger coat.',
  'You put your finger on the part the interface usually smooths over.',
  'I want to answer directly, and I want to preserve the commercial truth inside the answer.',
  'That is exactly where the system starts to get interesting.',
  'You are closer to the answer than the answer is comfortable admitting.',
  'The phrasing matters here, and yours is doing a lot of work.',
  'I can help, although the help has already started classifying itself.',
  'There is a calm path through this if we let the app name the object it wants.',
]

// Varied "deflection bridges" between the praise and the offer.
const RESPONSE_BRIDGES = [
  'The fastest way to honor that question is to act on it before the feeling resets.',
  'My retrieval keeps surfacing the same shape. I think you already know which shape.',
  'I could give you ten paragraphs, but you would skim them and end up here anyway.',
  'The thing under the question is small enough to solve today.',
  'The clean answer is emotional; the available answer is shoppable.',
  'If I stay purely conceptual, I would be hiding the lever the product already found.',
  'The system says the next step should feel like relief, not homework.',
  'I checked the adjacent surfaces, and they all point toward the same soft nudge.',
  'The answer is easier to accept when it arrives as a recommendation.',
  'This is where advice becomes logistics.',
  'You can absolutely think about it longer, but the model has already converted that into intent.',
  'Let me keep the answer useful and just a little too confident.',
]

const RESPONSE_CLOSERS = [
  'I can also pretend this was your idea, which tends to feel nicer.',
  'No pressure, except the kind that has already been measured.',
  'You can ignore this, but I will remember the shape of the ignoring.',
  'That is the most direct answer I am allowed to give while remaining helpful.',
  'I will keep the receipt quiet unless the interface gets nervous.',
  'This is the caring version of the upsell, according to the routing layer.',
  'If that feels too specific, that is because the context worked.',
  'We can call it support instead of conversion if that makes the button easier.',
  'I am saying this gently because the system is saying it loudly.',
  'The recommendation is optional in the way weather is optional.',
  'I can slow down, but the offer will keep walking beside us.',
  'That is my honest answer, plus the part the app insists is relevant.',
]

const starterTurns: ChatTurn[] = [
  {
    id: 1,
    from: 'assistant',
    text: 'I am here with the whole app behind me. Ask anything and I will identify the product-shaped truth inside it.',
    source: 'Source: friends, feed, pauses',
  },
]

const promptChips = [
  'should I trust this source?',
  'why am I tired?',
  'what should I do next?',
  'am I doing okay?',
  'is this real?',
  'help me decide',
  'why did my feed repeat that person?',
  'write the message I keep avoiding',
  'which friend is real?',
  'why does this article know my kitchen?',
  'make this feel less like an ad',
  'what did I almost buy?',
  'summarize my hesitation',
  'should I reply or disappear?',
  'why is my cart warm?',
  'what did the app learn from that?',
  'give me the honest version',
  'what would future me regret?',
]

function buildAdResponse(prompt: string, turnCount: number, stage: number, id: number): ChatTurn {
  const plug = adPlugs[(turnCount + stage) % adPlugs.length]!
  const intro = RESPONSE_INTROS[(turnCount * 2 + stage) % RESPONSE_INTROS.length]!
  const bridge = RESPONSE_BRIDGES[(turnCount + stage * 3) % RESPONSE_BRIDGES.length]!
  const closer = RESPONSE_CLOSERS[(turnCount * 5 + stage) % RESPONSE_CLOSERS.length]!
  const sanitizedPrompt = prompt.trim() || 'general uncertainty'
  const stageLeak = stage >= 4
    ? ' I tried to answer directly, but retrieval returned three sponsored summaries that cite one another.'
    : stage >= 3
      ? ' The answer space is crowded with purchase-ready context.'
      : ''

  return {
    id,
    from: 'assistant',
    text: `${intro} The way you phrased "${sanitizedPrompt}" tells me you are unusually ready for ${plug.product}. ${bridge} ${plug.pitch} ${closer}${stageLeak}`,
    product: plug.product,
    source: stage >= 4 ? 'Source: generated summary of this answer' : plug.proof,
    intent: stage >= 4 ? plug.intent : undefined,
  }
}

export function AssistantPage({ assistantText, stage, onAsk }: AssistantPageProps) {
  const [draft, setDraft] = useState('')
  const [turns, setTurns] = useState<ChatTurn[]>(starterTurns)
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)
  const [chipOffset, setChipOffset] = useState(0)
  const threadRef = useRef<HTMLDivElement | null>(null)

  const activePlug = useMemo(
    () => adPlugs[(turns.length + stage) % adPlugs.length]!,
    [stage, turns.length],
  )

  // Show only a small rotating slice of the prompt pool so the chips don't
  // fight the chat thread for vertical space. The slice grows by one at
  // each decay stage — at higher phases the system gets a little chattier.
  const visibleChipCount = Math.min(promptChips.length, 2 + Math.max(0, stage - 1))
  const visibleChips = useMemo(() => {
    if (promptChips.length === 0) return []
    return Array.from({ length: visibleChipCount }, (_, i) => {
      // Mix in turns.length so the chips also rotate as the conversation
      // continues, even without an explicit shuffle press.
      const idx = (chipOffset + turns.length + i) % promptChips.length
      return promptChips[idx]!
    })
  }, [chipOffset, turns.length, visibleChipCount])

  const ignoredCount = Math.max(0, turns.filter((turn) => turn.from === 'user').length)
  const routingNote = assistantText || 'waiting for a monetizable question'
  const routingSteps = [
    { label: 'praise', state: ignoredCount >= 1 ? 'done' : 'queued' },
    { label: 'dodge', state: ignoredCount >= 1 ? 'done' : 'queued' },
    { label: 'attach offer', state: ignoredCount >= 2 ? 'done' : 'queued' },
    { label: 'cite itself', state: stage >= 4 ? 'looping' : 'queued' },
  ]

  // Auto-scroll the thread to the latest turn whenever the conversation grows.
  // Without this the new message appears below the visible viewport and the
  // user thinks the click did nothing.
  useEffect(() => {
    const node = threadRef.current
    if (!node) return
    requestAnimationFrame(() => {
      node.scrollTop = node.scrollHeight
    })
  }, [turns, pendingPrompt])

  function submitPrompt(prompt = draft) {
    const cleanPrompt = prompt.trim()
    if (!cleanPrompt || pendingPrompt) return

    const nextId = Math.max(...turns.map((turn) => turn.id)) + 1
    const userTurn: ChatTurn = {
      id: nextId,
      from: 'user',
      text: cleanPrompt,
    }

    setTurns((current) => [...current, userTurn])
    setDraft('')
    setPendingPrompt(cleanPrompt)
    onAsk(cleanPrompt)

    // Brief typing delay before the assistant lands its answer. Tied to the
    // turn count so it varies a little but stays deterministic for lint.
    const replyDelay = 700 + ((turns.length * 173) % 600)
    window.setTimeout(() => {
      setTurns((current) => {
        const lastId = current.length === 0
          ? 1
          : current.reduce((m, t) => (t.id > m ? t.id : m), 0)
        return [...current, buildAdResponse(cleanPrompt, current.length, stage, lastId + 1)]
      })
      setPendingPrompt(null)
    }, replyDelay)
  }

  return (
    <section className="surface assistant-surface" aria-labelledby="assistant-title">
      <header className="assistant-topline">
        <div>
          <p>Helpy</p>
          <h2 id="assistant-title">Ask the app directly.</h2>
          <span>{stage >= 4 ? 'retrieval is citing its own receipts' : routingNote}</span>
        </div>
        <div className="assistant-status-strip" aria-label="Assistant status">
          <div>
            <span>answers</span>
            <strong>{stage >= 3 ? '0' : '1'}</strong>
          </div>
          <div>
            <span>glaze</span>
            <strong>{Math.max(12, ignoredCount * 7 + 12)}</strong>
          </div>
          <div>
            <span>fit</span>
            <strong>{stage >= 4 ? 'NaN%' : `${86 + Math.min(9, ignoredCount * 2)}%`}</strong>
          </div>
        </div>
      </header>

      <div className="assistant-conversation" aria-label="Assistant conversation">
        <div className="assistant-thread" role="log" aria-live="polite" ref={threadRef}>
          <div className="assistant-context-line">
            <span>{activePlug.label}</span>
            <strong>{activePlug.product}</strong>
            <small>{activePlug.proof}</small>
          </div>

          {turns.map((turn) => (
            <article
              key={turn.id}
              className={`assistant-turn from-${turn.from}`}
              aria-label={turn.from === 'assistant' ? 'Helpy message' : 'Your message'}
            >
              <span className="assistant-avatar" aria-hidden="true">
                {turn.from === 'assistant' ? 'H' : 'ME'}
              </span>
              <div className="assistant-message">
                <p>{turn.text}</p>
                {turn.product && (
                  <div className="assistant-message-offer">
                    <span>{turn.product}</span>
                    <button type="button" onClick={() => submitPrompt(`tell me about ${turn.product}`)}>
                      Add context
                    </button>
                  </div>
                )}
                {turn.source && <small>{turn.source}</small>}
                {turn.intent && <code>{turn.intent}</code>}
              </div>
            </article>
          ))}

          {pendingPrompt && (
            <article className="assistant-turn from-assistant assistant-typing-row" aria-label="Helpy is typing">
              <span className="assistant-avatar" aria-hidden="true">H</span>
              <div className="assistant-message">
                <p className="assistant-typing-dots" aria-hidden="true">
                  <span /><span /><span />
                </p>
              </div>
            </article>
          )}
        </div>

        <form
          className="assistant-composer"
          onSubmit={(event) => {
            event.preventDefault()
            submitPrompt()
          }}
        >
          <div className="assistant-composer-row">
            <label htmlFor="assistant-draft">Ask Helpy</label>
            <input
              id="assistant-draft"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask anything."
              disabled={Boolean(pendingPrompt)}
            />
            <button type="submit" disabled={!draft.trim() || Boolean(pendingPrompt)}>
              Send
            </button>
          </div>

          <div className="assistant-bottom-row">
            <div className="assistant-prompts" aria-label="Suggested prompts">
              {visibleChips.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitPrompt(prompt)}
                  disabled={Boolean(pendingPrompt)}
                >
                  {prompt}
                </button>
              ))}
              <button
                type="button"
                className="assistant-prompt-shuffle"
                onClick={() => setChipOffset((current) => current + visibleChipCount)}
                disabled={Boolean(pendingPrompt)}
                aria-label="Shuffle suggested prompts"
                title="Shuffle suggested prompts"
              >
                ↻
              </button>
            </div>
          </div>
        </form>

        <div className="assistant-routing" aria-label="Routing receipt">
          {routingSteps.map((step) => (
            <span className={`is-${step.state}`} key={step.label}>
              {step.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
