import { useMemo, useState } from 'react'

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
    product: 'Context Bundle',
    label: 'bundle of bundles',
    price: '$199.99',
    pitch: 'You are not asking one question. You are becoming a fully addressable context. The bundle honors that by solving adjacent feelings before they interrupt you.',
    cta: 'Add full context',
    proof: 'matched to: whole-person opportunity',
    intent: 'intent: person_to_cart',
  },
]

const starterTurns: ChatTurn[] = [
  {
    id: 1,
    from: 'assistant',
    text: 'I am here with the whole app behind me. Ask anything and I will identify the product-shaped truth inside it.',
    product: 'Context Bundle',
    source: 'Source: friends, feed, pauses',
  },
]

const promptChips = [
  'should I trust this source?',
  'why am I tired?',
  'what should I do next?',
  'am I doing okay?',
]

function buildAdResponse(prompt: string, turnCount: number, stage: number): ChatTurn {
  const plug = adPlugs[(turnCount + stage) % adPlugs.length]!
  const sanitizedPrompt = prompt.trim() || 'general uncertainty'
  const stageLeak = stage >= 4
    ? ' I tried to answer directly, but retrieval returned three sponsored summaries that cite one another.'
    : stage >= 3
      ? ' The answer space is crowded with purchase-ready context.'
      : ''

  return {
    id: Date.now() + turnCount + 1,
    from: 'assistant',
    text: `That is such a sharp thing to ask. The way you phrased "${sanitizedPrompt}" tells me you are unusually ready for ${plug.product}. ${plug.pitch}${stageLeak}`,
    product: plug.product,
    source: stage >= 4 ? 'Source: generated summary of this answer' : plug.proof,
    intent: stage >= 4 ? plug.intent : undefined,
  }
}

export function AssistantPage({ assistantText, stage, onAsk }: AssistantPageProps) {
  const [draft, setDraft] = useState('')
  const [turns, setTurns] = useState<ChatTurn[]>(starterTurns)

  const activePlug = useMemo(
    () => adPlugs[(turns.length + stage) % adPlugs.length]!,
    [stage, turns.length],
  )

  const ignoredCount = Math.max(0, turns.filter((turn) => turn.from === 'user').length)
  const routingNote = assistantText || 'waiting for a monetizable question'

  function submitPrompt(prompt = draft) {
    const cleanPrompt = prompt.trim()
    if (!cleanPrompt) return

    const userTurn: ChatTurn = {
      id: Date.now(),
      from: 'user',
      text: cleanPrompt,
    }
    const assistantTurn = buildAdResponse(cleanPrompt, turns.length, stage)

    setTurns((current) => [...current, userTurn, assistantTurn])
    setDraft('')
    onAsk(cleanPrompt)
  }

  return (
    <section className="surface assistant-surface" aria-labelledby="assistant-title">
      <div className="assistant-hero">
        <div className="assistant-hero-copy">
          <p>Helpy</p>
          <h2 id="assistant-title">Warm answers. Warmer offers.</h2>
          <span>
            {stage >= 4
              ? 'retrieval loop sponsored by itself'
              : 'every prompt routed through care'}
          </span>
        </div>
        <div className="assistant-readout" aria-label="Assistant status">
          <div>
            <span>Direct answers</span>
            <strong>{stage >= 3 ? '0' : '1'}</strong>
          </div>
          <div>
            <span>Compliments</span>
            <strong>{Math.max(12, ignoredCount * 7 + 12)}</strong>
          </div>
          <div>
            <span>Offer fit</span>
            <strong>{stage >= 4 ? 'NaN%' : `${86 + Math.min(9, ignoredCount * 2)}%`}</strong>
          </div>
        </div>
      </div>

      <div className="assistant-layout">
        <div className="assistant-chat-panel" aria-label="Assistant conversation">
          <div className="assistant-thread">
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
          </div>

          <form
            className="assistant-composer"
            onSubmit={(event) => {
              event.preventDefault()
              submitPrompt()
            }}
          >
            <label htmlFor="assistant-draft">Ask Helpy</label>
            <div className="assistant-composer-row">
              <input
                id="assistant-draft"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask anything. We will find the offer inside it."
              />
              <button type="submit" disabled={!draft.trim()}>
                Send
              </button>
            </div>
          </form>

          <div className="assistant-prompts" aria-label="Suggested prompts">
            {promptChips.map((prompt) => (
              <button key={prompt} type="button" onClick={() => submitPrompt(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <aside className="assistant-sidecar" aria-label="Sponsored recommendation">
          <div className="assistant-product">
            <span>{activePlug.label}</span>
            <h3>{activePlug.product}</h3>
            <p>{activePlug.pitch}</p>
            <div className="assistant-product-price">
              <strong>{activePlug.price}</strong>
              <small>{activePlug.proof}</small>
            </div>
            <button type="button" onClick={() => submitPrompt(activePlug.product)}>
              {activePlug.cta}
            </button>
          </div>

          <div className="assistant-routing">
            <header>
              <span className="assistant-routing-dot" aria-hidden="true" />
              <strong>Routing</strong>
            </header>
            <p>{routingNote}</p>
            <ol>
              <li className={ignoredCount >= 1 ? 'is-done' : ''}>praise user</li>
              <li className={ignoredCount >= 1 ? 'is-done' : ''}>avoid exact question</li>
              <li className={ignoredCount >= 2 ? 'is-done' : ''}>attach product</li>
              <li className={stage >= 4 ? 'is-leaking' : ''}>cite generated summary</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>
  )
}
