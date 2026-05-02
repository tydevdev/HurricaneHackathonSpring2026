import type Phaser from 'phaser'

export type GameId = 'invaders' | 'maze' | 'snake'

export type Action = 'up' | 'down' | 'left' | 'right' | 'primary'

export type GameStatus = 'Ready' | 'Playing' | 'Round clear' | 'Game over'

export interface RenderBounds {
  width: number
  height: number
}

export interface GameSnapshot {
  title: string
  score: number
  lives: number
  status: GameStatus
  message: string
}

export interface ArcadeGame {
  readonly id: GameId
  readonly title: string
  readonly primaryLabel: string
  reset(): void
  handleAction(action: Action, isDown: boolean): void
  update(deltaMs: number): void
  render(graphics: Phaser.GameObjects.Graphics, bounds: RenderBounds): void
  getSnapshot(): GameSnapshot
}

export const drawPixelHeart = (
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  size: number,
  color: number,
) => {
  graphics.fillStyle(color, 1)
  graphics.fillCircle(x - size * 0.22, y - size * 0.12, size * 0.22)
  graphics.fillCircle(x + size * 0.22, y - size * 0.12, size * 0.22)
  graphics.fillTriangle(x - size * 0.48, y, x + size * 0.48, y, x, y + size * 0.55)
}

export const drawStar = (
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  radius: number,
  color: number,
) => {
  graphics.fillStyle(color, 1)
  graphics.beginPath()
  for (let index = 0; index < 10; index += 1) {
    const angle = -Math.PI / 2 + (index * Math.PI) / 5
    const pointRadius = index % 2 === 0 ? radius : radius * 0.42
    const px = x + Math.cos(angle) * pointRadius
    const py = y + Math.sin(angle) * pointRadius
    if (index === 0) {
      graphics.moveTo(px, py)
    } else {
      graphics.lineTo(px, py)
    }
  }
  graphics.closePath()
  graphics.fillPath()
}

export const rectsOverlap = (
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y
