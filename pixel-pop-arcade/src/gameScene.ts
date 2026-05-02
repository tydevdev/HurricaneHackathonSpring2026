import Phaser from 'phaser'
import { InvadersGame } from './games/invaders'
import { MazeGame } from './games/maze'
import { SnakeGame } from './games/snake'
import type { Action, ArcadeGame, GameId, GameSnapshot } from './games/types'

const gameFactories: Record<GameId, () => ArcadeGame> = {
  invaders: () => new InvadersGame(),
  maze: () => new MazeGame(),
  snake: () => new SnakeGame(),
}

const keyMap: Record<string, Action> = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  Space: 'primary',
  Enter: 'primary',
}

export class ArcadeScene extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics
  private activeGame: ArcadeGame = gameFactories.invaders()
  private lastSnapshot = ''

  constructor() {
    super('arcade')
  }

  create() {
    this.graphics = this.add.graphics()
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      const action = keyMap[event.code]
      if (!action) return
      event.preventDefault()
      this.activeGame.handleAction(action, true)
      this.publishSnapshot()
    })
    this.input.keyboard?.on('keyup', (event: KeyboardEvent) => {
      const action = keyMap[event.code]
      if (!action) return
      event.preventDefault()
      this.activeGame.handleAction(action, false)
      this.publishSnapshot()
    })

    window.dispatchEvent(new CustomEvent('pixel-pop-ready', { detail: { scene: this } }))
    this.publishSnapshot(true)
  }

  override update(_time: number, delta: number) {
    this.activeGame.update(delta)
    this.graphics.clear()
    this.graphics.setScale(1, 1)
    this.activeGame.render(this.graphics, { width: 720, height: 520 })
    this.publishSnapshot()
  }

  selectGame(id: GameId) {
    this.activeGame = gameFactories[id]()
    this.publishSnapshot(true)
  }

  restart() {
    this.activeGame.reset()
    this.publishSnapshot(true)
  }

  sendAction(action: Action, isDown: boolean) {
    this.activeGame.handleAction(action, isDown)
    this.publishSnapshot(true)
  }

  getSnapshot(): GameSnapshot {
    return this.activeGame.getSnapshot()
  }

  private publishSnapshot(force = false) {
    const snapshot = this.activeGame.getSnapshot()
    const nextSnapshot = JSON.stringify(snapshot)
    if (!force && nextSnapshot === this.lastSnapshot) return
    this.lastSnapshot = nextSnapshot
    window.dispatchEvent(new CustomEvent('pixel-pop-snapshot', { detail: snapshot }))
  }
}
