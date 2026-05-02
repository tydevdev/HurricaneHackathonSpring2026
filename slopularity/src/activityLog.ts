// Cross-tab activity log. Pages push events as the user interacts; Friends
// and Search read back recent entries to produce creepy cross-references.
// Session-only (no localStorage) so it resets on refresh.

export type Activity = {
  surface: string
  action: string
  label: string
  ts: number
}

const log: Activity[] = []
const MAX = 30

/** Push an activity entry. Oldest entries are pruned past MAX. */
export function pushActivity(surface: string, action: string, label: string) {
  log.push({ surface, action, label, ts: Date.now() })
  if (log.length > MAX) log.splice(0, log.length - MAX)
}

/** Get the most recent N activities. */
export function recentActivities(n = 10): readonly Activity[] {
  return log.slice(-n)
}

/** Get the most recent activity matching a surface. */
export function lastActivityOn(surface: string): Activity | undefined {
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i]!.surface === surface) return log[i]
  }
  return undefined
}

/** Get activities NOT on the given surface (for cross-tab references). */
export function crossTabActivities(currentSurface: string, n = 5): readonly Activity[] {
  return log.filter((a) => a.surface !== currentSurface).slice(-n)
}
