export type MissionStatus = 'available' | 'active' | 'complete' | 'locked'

export type Mission = {
  id: string
  title: string
  description?: string
  status?: MissionStatus
  reward?: string
  estimateMinutes?: number
  progressLabel?: string
}

export type MissionBoardClassNames = {
  root?: string
  header?: string
  list?: string
  mission?: string
  action?: string
  empty?: string
}

export type MissionBoardProps = {
  missions: Mission[]
  title?: string
  subtitle?: string
  emptyMessage?: string
  primaryActionLabel?: string
  className?: string
  classNames?: MissionBoardClassNames
  onMissionStart?: (mission: Mission) => void
  onMissionOpen?: (mission: Mission) => void
}

const missionStatusLabels: Record<MissionStatus, string> = {
  available: 'Ready',
  active: 'Active',
  complete: 'Done',
  locked: 'Locked',
}

const missionStatusColors: Record<MissionStatus, string> = {
  available: '#2563eb',
  active: '#c2410c',
  complete: '#15803d',
  locked: '#64748b',
}

export function MissionBoard({
  missions,
  title = 'Mission Board',
  subtitle,
  emptyMessage = 'No missions queued.',
  primaryActionLabel = 'Start',
  className,
  classNames,
  onMissionStart,
  onMissionOpen,
}: MissionBoardProps) {
  return (
    <section
      className={[className, classNames?.root].filter(Boolean).join(' ')}
      style={{
        border: '1px solid rgba(148, 163, 184, 0.24)',
        borderRadius: 8,
        padding: 18,
        display: 'grid',
        gap: 14,
        background: '#ffffff',
        color: '#0f172a',
      }}
    >
      <header className={classNames?.header}>
        <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
        {subtitle ? <p style={{ margin: '4px 0 0', color: '#475569' }}>{subtitle}</p> : null}
      </header>

      {missions.length > 0 ? (
        <div className={classNames?.list} style={{ display: 'grid', gap: 10 }}>
          {missions.map((mission) => {
            const status = mission.status ?? 'available'
            const locked = status === 'locked'

            return (
              <article
                key={mission.id}
                className={classNames?.mission}
                onClick={() => onMissionOpen?.(mission)}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: 14,
                  display: 'grid',
                  gap: 10,
                  background: locked ? '#f8fafc' : '#ffffff',
                  opacity: locked ? 0.72 : 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <strong>{mission.title}</strong>
                  <span
                    style={{
                      borderRadius: 999,
                      padding: '3px 8px',
                      color: missionStatusColors[status],
                      background: '#f1f5f9',
                      fontSize: 12,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {missionStatusLabels[status]}
                  </span>
                </div>
                {mission.description ? (
                  <p style={{ margin: 0, color: '#475569' }}>{mission.description}</p>
                ) : null}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <small style={{ color: '#64748b' }}>
                    {[mission.estimateMinutes ? `${mission.estimateMinutes} min` : null, mission.reward]
                      .filter(Boolean)
                      .join(' | ')}
                    {mission.progressLabel ? ` ${mission.progressLabel}` : ''}
                  </small>
                  {status !== 'complete' ? (
                    <button
                      type="button"
                      className={classNames?.action}
                      disabled={locked}
                      onClick={(event) => {
                        event.stopPropagation()
                        onMissionStart?.(mission)
                      }}
                      style={{
                        border: 0,
                        borderRadius: 8,
                        padding: '8px 12px',
                        color: '#ffffff',
                        background: locked ? '#94a3b8' : missionStatusColors[status],
                        font: 'inherit',
                        fontWeight: 700,
                        cursor: locked ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {locked ? 'Locked' : primaryActionLabel}
                    </button>
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
