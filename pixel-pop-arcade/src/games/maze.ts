import type Phaser from 'phaser'
import { drawPixelHeart } from './types'
import type { Action, ArcadeGame, GameSnapshot, GameStatus, RenderBounds } from './types'

interface Point {
  x: number
  y: number
}

interface Ghost extends Point {
  color: number
  scatter: number
}

const mapRows = [
  '###############',
  '#.............#',
  '#.###.#.#.###.#',
  '#o#...#.#...#o#',
  '#.#.#####.#.#.#',
  '#.............#',
  '###.#.###.#.###',
  '#...#.....#...#',
  '#.#####.#####.#',
  '#o...........o#',
  '#.###.#.#.###.#',
  '#.....#.#.....#',
  '###############',
]

const width = mapRows[0].length
const height = mapRows.length

export class MazeGame implements ArcadeGame {
  readonly id = 'maze'
  readonly title = 'Pac-Munch'
  readonly primaryLabel = 'Boost'

  private pellets = new Set<string>()
  private player: Point = { x: 7, y: 9 }
  private direction: Point = { x: 0, y: 0 }
  private queuedDirection: Point = { x: 0, y: 0 }
  private ghosts: Ghost[] = []
  private score = 0
  private lives = 3
  private timer = 0
  private ghostTimer = 0
  private boostTimer = 0
  private status: GameStatus = 'Ready'
  private message = 'Nibble dots. Dodge the shy ghosts.'

  constructor() {
    this.reset()
  }

  reset() {
    this.pellets = new Set()
    mapRows.forEach((row, y) => {
      [...row].forEach((cell, x) => {
        if (cell === '.' || cell === 'o') this.pellets.add(`${x},${y}`)
      })
    })
    this.player = { x: 7, y: 9 }
    this.direction = { x: 0, y: 0 }
    this.queuedDirection = { x: 0, y: 0 }
    this.ghosts = [
      { x: 7, y: 5, color: 0xff76c8, scatter: 0 },
      { x: 6, y: 7, color: 0x53f7ff, scatter: 1 },
      { x: 8, y: 7, color: 0xfff06d, scatter: 2 },
    ]
    this.score = 0
    this.lives = 3
    this.timer = 0
    this.ghostTimer = 0
    this.boostTimer = 0
    this.status = 'Ready'
    this.message = 'Nibble dots. Dodge the shy ghosts.'
  }

  handleAction(action: Action, isDown: boolean) {
    if (!isDown) return
    if (this.status === 'Game over' || this.status === 'Round clear') {
      this.reset()
      return
    }
    this.status = 'Playing'
    if (action === 'up') this.queuedDirection = { x: 0, y: -1 }
    if (action === 'down') this.queuedDirection = { x: 0, y: 1 }
    if (action === 'left') this.queuedDirection = { x: -1, y: 0 }
    if (action === 'right') this.queuedDirection = { x: 1, y: 0 }
    if (action === 'primary') {
      this.boostTimer = 760
      this.message = 'Sugar zip.'
    }
  }

  update(deltaMs: number) {
    if (this.status !== 'Playing') return
    this.timer += deltaMs
    this.ghostTimer += deltaMs
    this.boostTimer = Math.max(0, this.boostTimer - deltaMs)

    const playerStep = this.boostTimer > 0 ? 92 : 142
    while (this.timer >= playerStep) {
      this.timer -= playerStep
      this.movePlayer()
    }
    if (this.ghostTimer >= 230) {
      this.ghostTimer = 0
      this.moveGhosts()
    }

    this.checkGhosts()
    if (this.pellets.size === 0) {
      this.status = 'Round clear'
      this.message = 'Maze cleared. Press any control for another lap.'
    }
  }

  render(graphics: Phaser.GameObjects.Graphics, bounds: RenderBounds) {
    graphics.setScale(bounds.width / 720, bounds.height / 520)
    graphics.fillStyle(0x120929, 1)
    graphics.fillRect(0, 0, 720, 520)

    const tile = 32
    const offsetX = (720 - width * tile) / 2
    const offsetY = (520 - height * tile) / 2

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const px = offsetX + x * tile
        const py = offsetY + y * tile
        if (mapRows[y][x] === '#') {
          graphics.fillStyle(0x53f7ff, 1)
          graphics.fillRoundedRect(px + 3, py + 3, tile - 6, tile - 6, 8)
          graphics.fillStyle(0x251452, 1)
          graphics.fillRoundedRect(px + 8, py + 8, tile - 16, tile - 16, 4)
        } else {
          graphics.fillStyle(0x1d1241, 1)
          graphics.fillRoundedRect(px + 4, py + 4, tile - 8, tile - 8, 6)
        }
        if (this.pellets.has(`${x},${y}`)) {
          if (mapRows[y][x] === 'o') {
            drawPixelHeart(graphics, px + tile / 2, py + tile / 2, 17, 0xff76c8)
          } else {
            graphics.fillStyle(0xfff06d, 1)
            graphics.fillCircle(px + tile / 2, py + tile / 2, 4)
          }
        }
      }
    }

    for (const ghost of this.ghosts) {
      this.drawGhost(graphics, offsetX + ghost.x * tile + tile / 2, offsetY + ghost.y * tile + tile / 2, ghost.color)
    }
    this.drawPlayer(graphics, offsetX + this.player.x * tile + tile / 2, offsetY + this.player.y * tile + tile / 2)
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

  private movePlayer() {
    if (this.canMove(this.player, this.queuedDirection)) {
      this.direction = this.queuedDirection
    }
    if (this.canMove(this.player, this.direction)) {
      this.player = { x: this.player.x + this.direction.x, y: this.player.y + this.direction.y }
    }
    const key = `${this.player.x},${this.player.y}`
    if (this.pellets.delete(key)) {
      this.score += mapRows[this.player.y][this.player.x] === 'o' ? 30 : 10
      this.message = this.score % 100 === 0 ? 'Snack streak.' : 'Munch.'
    }
  }

  private moveGhosts() {
    this.ghosts = this.ghosts.map((ghost, index) => {
      const options = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ].filter((direction) => this.canMove(ghost, direction))
      options.sort((a, b) => {
        const aDistance = this.distance({ x: ghost.x + a.x, y: ghost.y + a.y }, this.player)
        const bDistance = this.distance({ x: ghost.x + b.x, y: ghost.y + b.y }, this.player)
        return index === 1 ? bDistance - aDistance : aDistance - bDistance
      })
      const choice = options[(ghost.scatter + this.score) % Math.min(options.length, 2)] ?? options[0]
      return { ...ghost, x: ghost.x + choice.x, y: ghost.y + choice.y, scatter: ghost.scatter + 1 }
    })
  }

  private checkGhosts() {
    if (!this.ghosts.some((ghost) => ghost.x === this.player.x && ghost.y === this.player.y)) return
    this.lives -= 1
    if (this.lives <= 0) {
      this.status = 'Game over'
      this.message = 'Ghost hug pile. Press any control to restart.'
      return
    }
    this.player = { x: 7, y: 9 }
    this.direction = { x: 0, y: 0 }
    this.queuedDirection = { x: 0, y: 0 }
    this.message = 'A shy ghost caught you.'
  }

  private canMove(point: Point, direction: Point) {
    const nextX = point.x + direction.x
    const nextY = point.y + direction.y
    return mapRows[nextY]?.[nextX] !== '#'
  }

  private distance(a: Point, b: Point) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
  }

  private drawPlayer(graphics: Phaser.GameObjects.Graphics, x: number, y: number) {
    graphics.fillStyle(0xfff06d, 1)
    graphics.fillCircle(x, y, 13)
    graphics.fillStyle(0x120929, 1)
    graphics.fillCircle(x + 4, y - 5, 3)
    graphics.lineStyle(3, 0x120929, 1)
    graphics.beginPath()
    graphics.arc(x + 1, y + 2, 7, 0.1, Math.PI - 0.1)
    graphics.strokePath()
  }

  private drawGhost(graphics: Phaser.GameObjects.Graphics, x: number, y: number, color: number) {
    graphics.fillStyle(color, 1)
    graphics.fillRoundedRect(x - 13, y - 13, 26, 25, 12)
    graphics.fillTriangle(x - 13, y + 4, x - 5, y + 17, x + 2, y + 4)
    graphics.fillTriangle(x + 2, y + 4, x + 9, y + 17, x + 13, y + 4)
    graphics.fillStyle(0x120929, 1)
    graphics.fillCircle(x - 5, y - 3, 2.8)
    graphics.fillCircle(x + 5, y - 3, 2.8)
  }
}
