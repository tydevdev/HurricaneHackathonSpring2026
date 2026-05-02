type AssistantPageProps = {
  assistantText: string
  stage: number
  onAsk: () => void
}

export function AssistantPage({ assistantText, stage, onAsk }: AssistantPageProps) {
  return (
    <section className="surface assistant-surface" aria-labelledby="assistant-title">
      <div className="surface-heading">
        <div>
          <p>Assistant</p>
          <h2 id="assistant-title">Confident enough to be wrong everywhere</h2>
        </div>
        <span>{stage >= 4 ? 'source: recursive summary' : 'ready'}</span>
      </div>
      <div className="assistant-bubble">
        <p>{assistantText || 'Ask me anything. I have access to the whole internet, your pauses, and six versions of your friends.'}</p>
      </div>
      <button className="primary-action" type="button" onClick={onAsk}>Ask for help</button>
    </section>
  )
}
