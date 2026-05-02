import { tabs } from './content'
import type { TabId } from './types'

export const appRoutes = tabs.map((tab) => tab.id)

export function isTabId(value: string | undefined): value is TabId {
  return value ? appRoutes.includes(value as TabId) : false
}

export function tabFromLocation(location: Location = window.location): TabId | null {
  const segments = location.pathname.split('/').filter(Boolean)
  const appIndex = segments.lastIndexOf('app')

  if (appIndex >= 0) {
    const appTab = segments[appIndex + 1]
    return isTabId(appTab) ? appTab : null
  }

  const lastSegment = segments.at(-1)
  return isTabId(lastSegment) ? lastSegment : null
}

export function appBasePath(location: Location = window.location) {
  const rawPath = location.pathname || '/'
  const normalizedPath = rawPath.endsWith('/') ? rawPath : `${rawPath}/`
  const segments = normalizedPath.split('/').filter(Boolean)
  const appIndex = segments.lastIndexOf('app')

  if (appIndex >= 0) {
    return `/${segments.slice(0, appIndex + 1).join('/')}/`
  }

  const tab = tabFromLocation(location)

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

export function gameFromLocation(location: Location = window.location): string | null {
  const segments = location.pathname.split('/').filter(Boolean)
  const gamesIndex = segments.lastIndexOf('games')
  const gameId = gamesIndex >= 0 ? segments[gamesIndex + 1] : null
  return gameId ?? null
}

export function pathForGame(gameId: string, location: Location = window.location) {
  return `${pathForTab('games', location)}${gameId}/`
}
