export type AchievementTone = 'neutral' | 'fresh' | 'earned' | 'locked'

export type Achievement = {
  id: string
  title: string
  description?: string
  progress?: number
  target?: number
  earnedAt?: string
  icon?: React.ReactNode
  tone?: AchievementTone
}

export type AchievementsPanelClassNames = {
  root?: string
  header?: string
  list?: string
  item?: string
  icon?: string
  progress?: string
  empty?: string
}

export type AchievementsPanelProps = {
  achievements: Achievement[]
  title?: string
  subtitle?: string
  emptyMessage?: string
  maxVisible?: number
  className?: string
  classNames?: AchievementsPanelClassNames
  onAchievementSelect?: (achievement: Achievement) => void
}

const toneColors: Record<AchievementTone, string> = {
  neutral: '#64748b',
  fresh: '#0ea5e9',
  earned: '#16a34a',
  locked: '#94a3b8',
}

const rootStyle = {
  border: '1px solid rgba(148, 163, 184, 0.24)',
  borderRadius: 8,
  padding: 18,
  display: 'grid',
  gap: 14,
  background: '#ffffff',
  color: '#0f172a',
} satisfies React.CSSProperties

export function AchievementsPanel({
  achievements,
  title = 'Achievements',
  subtitle,
  emptyMessage = 'No badges yet. One clean break is a good start.',
  maxVisible,
  className,
  classNames,
  onAchievementSelect,
}: AchievementsPanelProps) {
  const visibleAchievements = maxVisible ? achievements.slice(0, maxVisible) : achievements

  return (
    <section className={[className, classNames?.root].filter(Boolean).join(' ')} style={rootStyle}>
      <header className={classNames?.header}>
        <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
        {subtitle ? <p style={{ margin: '4px 0 0', color: '#475569' }}>{subtitle}</p> : null}
      </header>

      {visibleAchievements.length > 0 ? (
        <div className={classNames?.list} style={{ display: 'grid', gap: 10 }}>
          {visibleAchievements.map((achievement) => {
            const tone = achievement.tone ?? (achievement.earnedAt ? 'earned' : 'neutral')
            const progress =
              achievement.progress !== undefined && achievement.target
                ? Math.min(100, Math.round((achievement.progress / achievement.target) * 100))
                : undefined
            const interactive = Boolean(onAchievementSelect)

            return (
              <article
                key={achievement.id}
                className={classNames?.item}
                role={interactive ? 'button' : undefined}
                tabIndex={interactive ? 0 : undefined}
                onClick={() => onAchievementSelect?.(achievement)}
                onKeyDown={(event) => {
                  if (interactive && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault()
                    onAchievementSelect?.(achievement)
                  }
                }}
                style={{
                  border: '1px solid rgba(203, 213, 225, 0.9)',
                  borderRadius: 8,
                  padding: 12,
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 12,
                  cursor: interactive ? 'pointer' : 'default',
                  background: tone === 'locked' ? '#f8fafc' : '#ffffff',
                }}
              >
                <div
                  className={classNames?.icon}
                  aria-hidden="true"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    display: 'grid',
                    placeItems: 'center',
                    color: '#ffffff',
                    background: toneColors[tone],
                    fontWeight: 800,
                  }}
                >
                  {achievement.icon ?? achievement.title.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <strong>{achievement.title}</strong>
                    {achievement.earnedAt ? (
                      <small style={{ color: '#64748b', whiteSpace: 'nowrap' }}>
                        {achievement.earnedAt}
                      </small>
                    ) : null}
                  </div>
                  {achievement.description ? (
                    <p style={{ margin: '4px 0 0', color: '#475569' }}>{achievement.description}</p>
                  ) : null}
                  {progress !== undefined ? (
                    <div
                      className={classNames?.progress}
                      aria-label={`${achievement.title} progress ${progress}%`}
                      style={{
                        height: 7,
                        borderRadius: 999,
                        overflow: 'hidden',
                        marginTop: 10,
                        background: '#e2e8f0',
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          height: '100%',
                          background: toneColors[tone],
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <p className={classNames?.empty} style={{ margin: 0, color: '#64748b' }}>
          {emptyMessage}
        </p>
      )}
    </section>
  )
}
