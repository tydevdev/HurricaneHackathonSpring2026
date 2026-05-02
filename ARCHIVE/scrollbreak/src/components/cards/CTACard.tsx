export type CTACardProps = {
  title: string
  body?: string
  actionLabel: string
  secondaryActionLabel?: string
  onAction?: () => void
  onSecondaryAction?: () => void
}

export function CTACard({
  title,
  body,
  actionLabel,
  secondaryActionLabel,
  onAction,
  onSecondaryAction,
}: CTACardProps) {
  return (
    <article
      style={{
        borderRadius: 8,
        padding: 20,
        display: 'grid',
        gap: 14,
        background: '#111827',
        color: '#f9fafb',
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 24 }}>{title}</h2>
        {body ? <p style={{ margin: '6px 0 0', color: '#d1d5db' }}>{body}</p> : null}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
        {secondaryActionLabel ? (
          <button type="button" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </button>
        ) : null}
      </div>
    </article>
  )
}
