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
]

// Varied response intros so the same chip pressed twice doesn't read identically.
const RESPONSE_INTROS = [
  'That is such a sharp thing to ask.',
  'I have been waiting for someone to phrase it exactly that way.',
  'You are noticing the right pattern.',
  'Genuinely — most people do not get this far on their own.',
  'There is a real answer here, and I think you can already feel it.',
  'I love how you held the question without flinching.',
]

// Varied "deflection bridges" between the praise and the offer.
const RESPONSE_BRIDGES = [
  'The fastest way to honor that question is to act on it before the feeling resets.',
  'My retrieval keeps surfacing the same shape. I think you already know which shape.',
  'I could give you ten paragraphs, but you would skim them and end up here anyway.',
  'The thing under the question is small enough to solve today.',
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
]

function buildAdResponse(prompt: string, turnCount: number, stage: number, id: number): ChatTurn {
  const plug = adPlugs[(turnCount + stage) % adPlugs.length]!
  const intro = RESPONSE_INTROS[(turnCount * 2 + stage) % RESPONSE_INTROS.length]!
  const bridge = RESPONSE_BRIDGES[(turnCount + stage * 3) % RESPONSE_BRIDGES.length]!
  const sanitizedPrompt = prompt.trim() || 'general uncertainty'
  const stageLeak = stage >= 4
    ? ' I tried to answer directly, but retrieval returned three sponsored summaries that cite one another.'
    : stage >= 3
      ? ' The answer space is crowded with purchase-ready context.'
      : ''

  return {
    id,
    from: 'assistant',
    text: `${intro} The way you phrased "${sanitizedPrompt}" tells me you are unusually ready for ${plug.product}. ${bridge} ${plug.pitch}${stageLeak}`,
    product: plug.product,
    source: stage >= 4 ? 'Source: generated summary of this answer' : plug.proof,
    intent: stage >= 4 ? plug.intent : undefined,
  }
}

export function AssistantPage({ assistantText, stage, onAsk }: AssistantPageProps) {
  const [draft, setDraft] = useState('')
  const [turns, setTurns] = useState<ChatTurn[]>(starterTurns)
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)
  const threadRef = useRef<HTMLDivElement | null>(null)

  const activePlug = useMemo(
    () => adPlugs[(turns.length + stage) % adPlugs.length]!,
    [stage, turns.length],
  )

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
              {promptChips.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitPrompt(prompt)}
                  disabled={Boolean(pendingPrompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="assistant-soft-offer"
              onClick={() => submitPrompt(activePlug.product)}
              disabled={Boolean(pendingPrompt)}
            >
              {activePlug.cta} · {activePlug.price}
            </button>
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
