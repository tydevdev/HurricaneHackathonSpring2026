import type Phaser from 'phaser'
import { drawPixelHeart } from './types'
import type { Action, ArcadeGame, GameSnapshot, GameStatus, RenderBounds } from './types'

interface Cell {
  x: number
  y: number
}

const columns = 22
const rows = 16

export class SnakeGame implements ArcadeGame {
  readonly id = 'snake'
  readonly title = 'Snake'
  readonly primaryLabel = 'Dash'

  private snake: Cell[] = []
  private berry: Cell = { x: 12, y: 8 }
  private direction: Cell = { x: 1, y: 0 }
  private queuedDirection: Cell = { x: 1, y: 0 }
  private score = 0
  private lives = 1
  private timer = 0
  private stepMs = 132
  private status: GameStatus = 'Ready'
  private message = 'Eat berries. Avoid folding into yourself.'
  private dashTimer = 0

  constructor() {
    this.reset()
  }

  reset() {
    this.snake = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 },
      { x: 5, y: 8 },
    ]
    this.direction = { x: 1, y: 0 }
    this.queuedDirection = { x: 1, y: 0 }
    this.score = 0
    this.lives = 1
    this.timer = 0
    this.stepMs = 132
    this.status = 'Ready'
    this.message = 'Eat berries. Avoid folding into yourself.'
    this.dashTimer = 0
    this.placeBerry()
  }

  handleAction(action: Action, isDown: boolean) {
    if (!isDown) return
    if (this.status === 'Game over') {
      this.reset()
      return
    }
    this.status = 'Playing'
    if (action === 'up') this.queueDirection({ x: 0, y: -1 })
    if (action === 'down') this.queueDirection({ x: 0, y: 1 })
    if (action === 'left') this.queueDirection({ x: -1, y: 0 })
    if (action === 'right') this.queueDirection({ x: 1, y: 0 })
    if (action === 'primary') {
      this.dashTimer = 640
      this.message = 'Sugar rush.'
    }
  }

  update(deltaMs: number) {
    if (this.status !== 'Playing') return
    this.dashTimer = Math.max(0, this.dashTimer - deltaMs)
    this.timer += deltaMs
    const activeStep = this.dashTimer > 0 ? 82 : this.stepMs
    while (this.timer >= activeStep) {
      this.timer -= activeStep
      if (!this.step()) break
    }
  }

  render(graphics: Phaser.GameObjects.Graphics, bounds: RenderBounds) {
    const scaleX = bounds.width / 720
    const scaleY = bounds.height / 520
    graphics.setScale(scaleX, scaleY)
    this.drawBoard(graphics)

    const cellSize = 26
    const offsetX = (720 - columns * cellSize) / 2
    const offsetY = 52

    drawPixelHeart(
      graphics,
      offsetX + this.berry.x * cellSize + cellSize / 2,
      offsetY + this.berry.y * cellSize + cellSize / 2,
      20,
      0xff76c8,
    )

    this.snake.forEach((cell, index) => {
      const x = offsetX + cell.x * cellSize
      const y = offsetY + cell.y * cellSize
      const color = index === 0 ? 0xfff06d : index % 2 === 0 ? 0x8cff7a : 0x53f7ff
      graphics.fillStyle(color, 1)
      graphics.fillRoundedRect(x + 2, y + 2, cellSize - 4, cellSize - 4, 9)
      if (index === 0) {
        graphics.fillStyle(0x120929, 1)
        graphics.fillCircle(x + 10, y + 11, 3)
        graphics.fillCircle(x + 18, y + 11, 3)
        graphics.lineStyle(2, 0x120929, 1)
        graphics.lineBetween(x + 11, y + 18, x + 17, y + 18)
      }
    })
  }

  getSnapshot(): GameSnapshot {
    return {
      title: this.title,
      score: this.score,
      lives: this.lives,
      status: this.status,
      message: this.message,
    }
  }

  private step() {
    this.direction = this.queuedDirection
    const head = this.snake[0]
    const nextHead = {
      x: (head.x + this.direction.x + columns) % columns,
      y: (head.y + this.direction.y + rows) % rows,
    }

    if (this.snake.some((cell) => cell.x === nextHead.x && cell.y === nextHead.y)) {
      this.status = 'Game over'
      this.message = 'Ribbon knot. Press any control to restart.'
      return false
    }

    this.snake.unshift(nextHead)
    if (nextHead.x === this.berry.x && nextHead.y === this.berry.y) {
      this.score += 10
      this.stepMs = Math.max(82, this.stepMs - 2)
      this.message = this.score % 40 === 0 ? 'Berry combo.' : 'Berry!'
      this.placeBerry()
    } else {
      this.snake.pop()
    }
    return true
  }

  private queueDirection(next: Cell) {
    if (next.x + this.direction.x === 0 && next.y + this.direction.y === 0) return
    this.queuedDirection = next
  }

  private placeBerry() {
    let candidate = { x: 0, y: 0 }
    do {
      candidate = {
        x: Math.floor(Math.random() * columns),
        y: Math.floor(Math.random() * rows),
      }
    } while (this.snake.some((cell) => cell.x === candidate.x && cell.y === candidate.y))
    this.berry = candidate
  }

  private drawBoard(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0x120929, 1)
    graphics.fillRect(0, 0, 720, 520)
    const cellSize = 26
    const offsetX = (720 - columns * cellSize) / 2
    const offsetY = 52
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        graphics.fillStyle((x + y) % 2 === 0 ? 0x1d1241 : 0x251452, 1)
        graphics.fillRoundedRect(offsetX + x * cellSize + 1, offsetY + y * cellSize + 1, cellSize - 2, cellSize - 2, 4)
      }
    }
    graphics.lineStyle(5, 0xff76c8, 1)
    graphics.strokeRoundedRect(offsetX - 5, offsetY - 5, columns * cellSize + 10, rows * cellSize + 10, 14)
  }
}
