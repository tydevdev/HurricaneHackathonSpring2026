import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

const root = document.getElementById('root')
if (root) {
  document.documentElement.dataset.view = 'app'
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
