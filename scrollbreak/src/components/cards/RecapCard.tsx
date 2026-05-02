export type RecapStat = {
  label: string
  value: string | number
}

export type RecapCardProps = {
  title?: string
  stats: RecapStat[]
  summary?: string
  actionLabel?: string
  onAction?: () => void
}

export function RecapCard({
  title = 'Recap',
  stats,
  summary,
  actionLabel,
  onAction,
}: RecapCardProps) {
  return (
    <article
      style={{
        border: '1px solid rgba(148, 163, 184, 0.28)',
        borderRadius: 8,
        padding: 18,
        display: 'grid',
        gap: 14,
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
        {summary ? <p style={{ margin: '6px 0 0', color: '#64748b' }}>{summary}</p> : null}
      </div>
      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))',
          gap: 10,
          margin: 0,
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} style={{ borderRadius: 8, background: '#f8fafc', padding: 12 }}>
            <dt style={{ color: '#64748b', fontSize: 13 }}>{stat.label}</dt>
            <dd style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{stat.value}</dd>
          </div>
        ))}
      </dl>
      {actionLabel ? (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </article>
  )
}
