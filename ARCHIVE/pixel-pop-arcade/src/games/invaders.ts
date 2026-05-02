import Phaser from 'phaser'
import { drawPixelHeart, drawStar, rectsOverlap } from './types'
import type { Action, ArcadeGame, GameSnapshot, GameStatus, RenderBounds } from './types'

interface Jelly {
  x: number
  y: number
  wobble: number
  color: number
}

interface Shot {
  x: number
  y: number
  speed: number
}

export class InvadersGame implements ArcadeGame {
  readonly id = 'invaders'
  readonly title = 'Space Invaders'
  readonly primaryLabel = 'Zap'

  private playerX = 360
  private readonly playerY = 452
  private leftDown = false
  private rightDown = false
  private shots: Shot[] = []
  private jellyShots: Shot[] = []
  private jellies: Jelly[] = []
  private direction = 1
  private score = 0
  private lives = 3
  private shootCooldown = 0
  private wave = 1
  private status: GameStatus = 'Ready'
  private message = 'Move with arrows. Space sends star shots.'
  private elapsed = 0

  constructor() {
    this.reset()
  }

  reset() {
    this.playerX = 360
    this.leftDown = false
    this.rightDown = false
    this.shots = []
    this.jellyShots = []
    this.direction = 1
    this.score = 0
    this.lives = 3
    this.wave = 1
    this.status = 'Ready'
    this.message = 'Move with arrows. Space sends star shots.'
    this.elapsed = 0
    this.shootCooldown = 0
    this.spawnWave()
  }

  handleAction(action: Action, isDown: boolean) {
    if (action === 'left') {
      this.leftDown = isDown
    }
    if (action === 'right') {
      this.rightDown = isDown
    }
    if (action === 'primary' && isDown) {
      if (this.status === 'Game over' || this.status === 'Round clear') {
        this.reset()
        return
      }
      this.status = 'Playing'
      this.message = 'Clear the jelly fleet.'
      this.fire()
    }
  }

  update(deltaMs: number) {
    if (this.status === 'Game over' || this.status === 'Round clear') {
      return
    }

    this.elapsed += deltaMs
    this.shootCooldown = Math.max(0, this.shootCooldown - deltaMs)
    const playerSpeed = 0.34 * deltaMs

    if (this.leftDown) this.playerX -= playerSpeed
    if (this.rightDown) this.playerX += playerSpeed
    this.playerX = Phaser.Math.Clamp(this.playerX, 48, 672)

    this.shots = this.shots
      .map((shot) => ({ ...shot, y: shot.y - shot.speed * deltaMs }))
      .filter((shot) => shot.y > -30)
    this.jellyShots = this.jellyShots
      .map((shot) => ({ ...shot, y: shot.y + shot.speed * deltaMs }))
      .filter((shot) => shot.y < 540)

    const fleetSpeed = (0.025 + this.wave * 0.004) * deltaMs
    let needsDrop = false
    for (const jelly of this.jellies) {
      jelly.x += fleetSpeed * this.direction
      jelly.wobble += deltaMs * 0.004
      if (jelly.x > 680 || jelly.x < 40) {
        needsDrop = true
      }
    }
    if (needsDrop) {
      this.direction *= -1
      for (const jelly of this.jellies) {
        jelly.y += 22
      }
    }

    if (this.elapsed > 900 + Math.random() * 500 && this.jellies.length > 0) {
      const jelly = this.jellies[Math.floor(Math.random() * this.jellies.length)]
      this.jellyShots.push({ x: jelly.x, y: jelly.y + 22, speed: 0.16 + this.wave * 0.015 })
      this.elapsed = 0
    }

    this.resolveHits()
    if (this.jellies.length === 0) {
      this.wave += 1
      this.score += 150
      this.message = `Wave ${this.wave} is floating in.`
      this.spawnWave()
    }
    if (this.jellies.some((jelly) => jelly.y > 410)) {
      this.lives = 0
      this.status = 'Game over'
      this.message = 'The jelly fleet reached the candy base.'
    }
  }

  render(graphics: Phaser.GameObjects.Graphics, bounds: RenderBounds) {
    const scaleX = bounds.width / 720
    const scaleY = bounds.height / 520
    graphics.setScale(scaleX, scaleY)
    this.drawBackground(graphics)

    for (const shot of this.shots) {
      drawStar(graphics, shot.x, shot.y, 10, 0xfff06d)
    }
    for (const shot of this.jellyShots) {
      drawPixelHeart(graphics, shot.x, shot.y, 16, 0xff76c8)
    }
    for (const jelly of this.jellies) {
      this.drawJelly(graphics, jelly)
    }
    this.drawPlayer(graphics)
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

  private fire() {
    if (this.shootCooldown > 0) return
    this.shots.push({ x: this.playerX, y: this.playerY - 28, speed: 0.62 })
    this.shootCooldown = 230
  }

  private spawnWave() {
    this.jellies = []
    const colors = [0x8cff7a, 0x53f7ff, 0xff76c8, 0xfff06d]
    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 9; column += 1) {
        this.jellies.push({
          x: 112 + column * 58,
          y: 72 + row * 48,
          wobble: row + column,
          color: colors[(row + column) % colors.length],
        })
      }
    }
  }

  private resolveHits() {
    const remainingShots: Shot[] = []
    for (const shot of this.shots) {
      const hitIndex = this.jellies.findIndex((jelly) =>
        rectsOverlap(
          { x: shot.x - 6, y: shot.y - 12, width: 12, height: 18 },
          { x: jelly.x - 20, y: jelly.y - 16, width: 40, height: 34 },
        ),
      )
      if (hitIndex >= 0) {
        this.jellies.splice(hitIndex, 1)
        this.score += 20
        this.status = 'Playing'
      } else {
        remainingShots.push(shot)
      }
    }
    this.shots = remainingShots

    const playerRect = { x: this.playerX - 28, y: this.playerY - 24, width: 56, height: 42 }
    const safeJellyShots: Shot[] = []
    for (const shot of this.jellyShots) {
      if (rectsOverlap({ x: shot.x - 7, y: shot.y - 7, width: 14, height: 14 }, playerRect)) {
        this.lives -= 1
        this.message = this.lives > 0 ? 'Bonk. One candy shield popped.' : 'Candy shields gone.'
        this.status = this.lives > 0 ? 'Playing' : 'Game over'
      } else {
        safeJellyShots.push(shot)
      }
    }
    this.jellyShots = safeJellyShots
  }

  private drawBackground(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0x120929, 1)
    graphics.fillRect(0, 0, 720, 520)
    graphics.lineStyle(1, 0x5b2f88, 0.45)
    for (let y = 26; y < 500; y += 26) {
      graphics.lineBetween(0, y, 720, y)
    }
    for (let index = 0; index < 28; index += 1) {
      const x = (index * 73) % 720
      const y = 20 + ((index * 47) % 250)
      drawStar(graphics, x, y, index % 3 === 0 ? 6 : 4, 0xffffff)
    }
  }

  private drawJelly(graphics: Phaser.GameObjects.Graphics, jelly: Jelly) {
    const y = jelly.y + Math.sin(jelly.wobble) * 3
    graphics.fillStyle(jelly.color, 1)
    graphics.fillRoundedRect(jelly.x - 22, y - 18, 44, 32, 13)
    graphics.fillTriangle(jelly.x - 18, y + 8, jelly.x - 8, y + 24, jelly.x + 2, y + 8)
    graphics.fillTriangle(jelly.x + 2, y + 8, jelly.x + 12, y + 24, jelly.x + 22, y + 8)
    graphics.fillStyle(0x120929, 1)
    graphics.fillCircle(jelly.x - 8, y - 4, 4)
    graphics.fillCircle(jelly.x + 8, y - 4, 4)
    graphics.lineStyle(3, 0x120929, 1)
    graphics.strokeCircle(jelly.x, y + 6, 5)
  }

  private drawPlayer(graphics: Phaser.GameObjects.Graphics) {
    graphics.fillStyle(0xfff06d, 1)
    graphics.fillTriangle(this.playerX, this.playerY - 34, this.playerX - 34, this.playerY + 22, this.playerX + 34, this.playerY + 22)
    graphics.fillStyle(0x53f7ff, 1)
    graphics.fillRoundedRect(this.playerX - 18, this.playerY - 8, 36, 26, 9)
    graphics.fillStyle(0x120929, 1)
    graphics.fillCircle(this.playerX - 7, this.playerY + 2, 3)
    graphics.fillCircle(this.playerX + 7, this.playerY + 2, 3)
  }
}
