import Phaser from 'phaser'
import { ArcadeScene } from './gameScene'
import type { Action, GameId, GameSnapshot } from './games/types'
import './style.css'

let scene: ArcadeScene | null = null

const title = document.querySelector<HTMLHeadingElement>('#current-title')
const scoreReadout = document.querySelector<HTMLSpanElement>('#score-readout')
const livesReadout = document.querySelector<HTMLSpanElement>('#lives-readout')
const statusReadout = document.querySelector<HTMLSpanElement>('#status-readout')
const restartButton = document.querySelector<HTMLButtonElement>('#restart-button')
const machineButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-game]')]
const controlButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-action]')]

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-canvas',
  width: 720,
  height: 520,
  backgroundColor: '#120929',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: ArcadeScene,
})

window.addEventListener('pixel-pop-ready', (event) => {
  scene = (event as CustomEvent<{ scene: ArcadeScene }>).detail.scene
})

window.addEventListener('pixel-pop-snapshot', (event) => {
  const snapshot = (event as CustomEvent<GameSnapshot>).detail
  if (title) title.textContent = snapshot.title
  if (scoreReadout) scoreReadout.textContent = `Score ${snapshot.score}`
  if (livesReadout) livesReadout.textContent = `Lives ${snapshot.lives}`
  if (statusReadout) statusReadout.textContent = `${snapshot.status}: ${snapshot.message}`
})

machineButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const gameId = button.dataset.game as GameId
    machineButtons.forEach((machine) => machine.classList.toggle('is-active', machine === button))
    scene?.selectGame(gameId)
    updatePrimaryLabel(gameId)
  })
})

restartButton?.addEventListener('click', () => {
  scene?.restart()
})

controlButtons.forEach((button) => {
  const action = button.dataset.action as Action
  const sendDown = (event: Event) => {
    event.preventDefault()
    button.classList.add('is-pressed')
    scene?.sendAction(action, true)
  }
  const sendUp = (event: Event) => {
    event.preventDefault()
    button.classList.remove('is-pressed')
    scene?.sendAction(action, false)
  }
  button.addEventListener('pointerdown', sendDown)
  button.addEventListener('pointerup', sendUp)
  button.addEventListener('pointerleave', sendUp)
  button.addEventListener('pointercancel', sendUp)
})

const updatePrimaryLabel = (gameId: GameId) => {
  const primary = document.querySelector<HTMLButtonElement>('[data-action="primary"]')
  if (!primary) return
  primary.textContent =
    gameId === 'invaders'
      ? 'Zap'
      : gameId === 'maze'
        ? 'Boost'
        : 'Dash'
}
