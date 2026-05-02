import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LandingPage } from './pages/LandingPage'

function appEntryHref(location: Location = window.location) {
  const url = new URL(location.href)
  const normalizedPath = (url.pathname || '/').replace(/(?:\/app)+\/?$/, '/')
  url.pathname = normalizedPath.endsWith('/') ? `${normalizedPath}app/` : `${normalizedPath}/app/`
  url.search = ''
  url.hash = ''
  return url.toString()
}

function enterApp() {
  // Real navigation into the app sub-route. The flag stays for parity with
  // the older same-page model in case any code wants to know the visitor
  // already saw the landing.
  try {
    window.localStorage.setItem('slopularity-entered-v1', '1')
  } catch {
    /* storage may be blocked */
  }
  window.location.href = appEntryHref()
}

const root = document.getElementById('root')
if (root) {
  document.documentElement.dataset.view = 'landing'
  createRoot(root).render(
    <StrictMode>
      <LandingPage onEnter={enterApp} />
    </StrictMode>,
  )
}
