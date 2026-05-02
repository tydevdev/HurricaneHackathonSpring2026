import { tabs } from './content'
import type { TabId } from './types'

export const appRoutes = tabs.map((tab) => tab.id)

export function isTabId(value: string | undefined): value is TabId {
  return value ? appRoutes.includes(value as TabId) : false
}

export function tabFromLocation(location: Location = window.location): TabId | null {
  const segments = location.pathname.split('/').filter(Boolean)
  const lastSegment = segments.at(-1)
  return isTabId(lastSegment) ? lastSegment : null
}

export function appBasePath(location: Location = window.location) {
  const tab = tabFromLocation(location)
  const rawPath = location.pathname || '/'
  const normalizedPath = rawPath.endsWith('/') ? rawPath : `${rawPath}/`

  if (!tab) {
    return normalizedPath
  }

  const tabSuffix = `/${tab}/`
  if (normalizedPath.endsWith(tabSuffix)) {
    return normalizedPath.slice(0, -tabSuffix.length + 1)
  }

  return normalizedPath
}

export function pathForTab(tabId: TabId, location: Location = window.location) {
  return `${appBasePath(location)}${tabId}/`
}
