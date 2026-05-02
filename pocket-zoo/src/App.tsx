import { Cookie, Hand, Heart, Magnet, MousePointer2, RotateCcw, Sparkles, Wind } from 'lucide-react'
import type { CSSProperties } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type Tool = 'boop' | 'snack' | 'magnet' | 'breeze'

type CreatureSeed = {
  id: string
  name: string
  file: string
  hue: string
  mood: string
  quirk: string
  size: number
  x: number
  y: number
}

type Creature = CreatureSeed & {
  vx: number
  vy: number
  spin: number
  z: number
  boops: number
  reaction: string
}

type Treat = {
  id: number
  x: number
  y: number
}

type DragState = {
  id: string
  offsetX: number
  offsetY: number
  lastX: number
  lastY: number
  lastTime: number
}

const seeds: CreatureSeed[] = [
  {
    id: 'red-panda',
    name: 'Miso',
    file: 'red-panda.png',
    hue: '#f07b62',
    mood: 'packs snacks',
    quirk: 'double-click for a backpack bounce',
    size: 132,
    x: 24,
    y: 52,
  },
  {
    id: 'capybara',
    name: 'Nori',
    file: 'capybara.png',
    hue: '#b88b5a',
    mood: 'quietly horizontal',
    quirk: 'likes the sunny rug',
    size: 150,
    x: 33,
    y: 61,
  },
  {
    id: 'otter',
    name: 'Pebble',
    file: 'otter.png',
    hue: '#8c6a4c',
    mood: 'polishes rocks',
    quirk: 'slides fastest after a flick',
    size: 124,
    x: 77,
    y: 55,
  },
  {
    id: 'moth-bunny',
    name: 'Luna',
    file: 'moth-bunny.png',
    hue: '#d7c7ff',
    mood: 'moonlit',
    quirk: 'floats when the breeze is on',
    size: 128,
    x: 58,
    y: 19,
  },
  {
    id: 'duckling',
    name: 'Boots',
    file: 'duckling.png',
    hue: '#ffd65c',
    mood: 'puddle ready',
    quirk: 'wobbles after every boop',
    size: 112,
    x: 65,
    y: 37,
  },
  {
    id: 'whale',
    name: 'Mallow',
    file: 'whale.png',
    hue: '#75b7ff',
    mood: 'star freckled',
    quirk: 'slow, huge, very sincere',
    size: 172,
    x: 47,
    y: 53,
  },
  {
    id: 'fox',
    name: 'Crown',
    file: 'fox.png',
    hue: '#ef8d3e',
    mood: 'officially tiny',
    quirk: 'prefers the top shelf',
    size: 118,
    x: 63,
    y: 68,
  },
  {
    id: 'frog',
    name: 'Berry',
    file: 'frog.png',
    hue: '#82b96c',
    mood: 'satchel full',
    quirk: 'snack magnet champion',
    size: 112,
    x: 56,
    y: 65,
  },
  {
    id: 'hedgehog',
    name: 'Button',
    file: 'hedgehog.png',
    hue: '#c89160',
    mood: 'found treasure',
    quirk: 'rolls into soft corners',
    size: 112,
    x: 12,
    y: 63,
  },
  {
    id: 'penguin',
    name: 'Parka',
    file: 'penguin.png',
    hue: '#5f7fb5',
    mood: 'earmuff weather',
    quirk: 'likes sliding downhill',
    size: 116,
    x: 70,
    y: 43,
  },
  {
    id: 'snail',
    name: 'Steep',
    file: 'snail.png',
    hue: '#d6a46b',
    mood: 'tea shell',
    quirk: 'never hurries, somehow arrives',
    size: 116,
    x: 22,
    y: 69,
  },
  {
    id: 'bat',
    name: 'Quilt',
    file: 'bat.png',
    hue: '#7c71b5',
    mood: 'blanket wings',
    quirk: 'hangs around the rafters',
    size: 124,
    x: 75,
    y: 42,
  },
]

const reactions = ['boop', 'eep', 'zoom', 'tiny yes', 'snack?', 'whee', 'plop']

const toolCopy: Record<Tool, string> = {
  boop: 'Boop',
  snack: 'Treat',
  magnet: 'Gather',
  breeze: 'Breeze',
}

function percentToPixels(seed: CreatureSeed, width: number, height: number): Creature {
  return {
    ...seed,
    x: (seed.x / 100) * width,
    y: (seed.y / 100) * height,
    vx: Math.sin(seed.x) * 0.55,
    vy: Math.cos(seed.y) * 0.45,
    spin: 0,
    z: 1,
    boops: 0,
    reaction: '',
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function stageSize(stage: HTMLDivElement | null) {
  return {
    width: stage?.clientWidth || 1100,
    height: stage?.clientHeight || 680,
  }
}

function makeCreatures(width = 1100, height = 680) {
  return seeds.map((seed) => percentToPixels(seed, width, height))
}

function getClientPoint(event: React.PointerEvent<HTMLElement>) {
  return { x: event.clientX, y: event.clientY }
}

function App() {
  const stageRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const treatIdRef = useRef(1)
  const [tool, setTool] = useState<Tool>('boop')
  const [creatures, setCreatures] = useState<Creature[]>(() => makeCreatures())
  const [treats, setTreats] = useState<Treat[]>([])
  const [spotlight, setSpotlight] = useState('Miso')
  const [isSettled, setIsSettled] = useState(false)

  const totalBoops = useMemo(
    () => creatures.reduce((count, creature) => count + creature.boops, 0),
    [creatures],
  )

  useEffect(() => {
    const resetToStage = () => {
      const { width, height } = stageSize(stageRef.current)
      setCreatures(makeCreatures(width, height))
      setTreats([])
    }

    resetToStage()
    window.addEventListener('resize', resetToStage)
    return () => window.removeEventListener('resize', resetToStage)
  }, [])

  useEffect(() => {
    let frame = 0
    let previous = performance.now()

    const tick = (time: number) => {
      const delta = Math.min((time - previous) / 16.67, 2)
      previous = time
      const { width, height } = stageSize(stageRef.current)
      const dragId = dragRef.current?.id

      setCreatures((current) =>
        current.map((creature, index) => {
          if (creature.id === dragId) {
            return creature
          }

          let vx = creature.vx
          let vy = creature.vy

          if (tool === 'magnet') {
            vx += ((width / 2 - creature.x) / width) * 0.75
            vy += ((height / 2 - creature.y) / height) * 0.75
          }

          if (tool === 'breeze') {
            vx += Math.sin(time / 720 + index) * 0.17
            vy -= creature.id === 'moth-bunny' || creature.id === 'bat' ? 0.12 : 0.035
          }

          const nearestTreat = treats.reduce<Treat | null>((nearest, treat) => {
            if (!nearest) {
              return treat
            }
            const currentDistance = Math.hypot(treat.x - creature.x, treat.y - creature.y)
            const nearestDistance = Math.hypot(nearest.x - creature.x, nearest.y - creature.y)
            return currentDistance < nearestDistance ? treat : nearest
          }, null)

          if (nearestTreat) {
            const dx = nearestTreat.x - creature.x
            const dy = nearestTreat.y - creature.y
            const distance = Math.max(Math.hypot(dx, dy), 1)
            const pull = tool === 'snack' ? 0.13 : 0.035
            vx += (dx / distance) * pull
            vy += (dy / distance) * pull
          }

          vx += Math.sin(time / 1100 + index * 1.7) * 0.025
          vy += Math.cos(time / 980 + index * 1.2) * 0.02

          let nextX = creature.x + vx * delta
          let nextY = creature.y + vy * delta
          const maxX = Math.max(width - creature.size, 12)
          const maxY = Math.max(height - creature.size, 12)

          if (nextX < 0 || nextX > maxX) {
            vx *= -0.74
            nextX = clamp(nextX, 0, maxX)
          }

          if (nextY < 0 || nextY > maxY) {
            vy *= -0.76
            nextY = clamp(nextY, 0, maxY)
          }

          vx *= tool === 'magnet' ? 0.982 : 0.993
          vy *= 0.993

          return {
            ...creature,
            x: nextX,
            y: nextY,
            vx,
            vy,
            spin: creature.spin + vx * 0.08,
          }
        }),
      )

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [tool, treats])

  useEffect(() => {
    if (treats.length === 0) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setTreats((current) => current.slice(1))
    }, 3800)

    return () => window.clearTimeout(timer)
  }, [treats])

  const resetHabitat = () => {
    const { width, height } = stageSize(stageRef.current)
    dragRef.current = null
    setTool('boop')
    setCreatures(makeCreatures(width, height))
    setTreats([])
    setSpotlight('Miso')
    setIsSettled(false)
  }

  const addTreat = (x: number, y: number) => {
    const id = treatIdRef.current
    treatIdRef.current += 1
    setTreats((current) => [...current.slice(-9), { id, x, y }])
  }

  const boopCreature = (id: string) => {
    const target = creatures.find((creature) => creature.id === id)
    if (target) {
      setSpotlight(target.name)
    }

    setCreatures((current) =>
      current.map((creature) => {
        if (creature.id !== id) {
          return creature
        }

        const nextBoops = creature.boops + 1
        return {
          ...creature,
          boops: nextBoops,
          reaction: reactions[nextBoops % reactions.length],
          vx: creature.vx + Math.sin(nextBoops) * 2.8,
          vy: creature.vy - 2.4,
          spin: creature.spin + 8,
          z: Date.now(),
        }
      }),
    )
  }

  const handleStagePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (tool !== 'snack') {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    addTreat(event.clientX - rect.left, event.clientY - rect.top)
  }

  const startDrag = (event: React.PointerEvent<HTMLButtonElement>, creature: Creature) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }

    const point = getClientPoint(event)
    dragRef.current = {
      id: creature.id,
      offsetX: point.x - rect.left - creature.x,
      offsetY: point.y - rect.top - creature.y,
      lastX: point.x,
      lastY: point.y,
      lastTime: performance.now(),
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setSpotlight(creature.name)
    setIsSettled(false)
    setCreatures((current) =>
      current.map((item) =>
        item.id === creature.id ? { ...item, vx: 0, vy: 0, z: Date.now() } : item,
      ),
    )
  }

  const dragCreature = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    const rect = stageRef.current?.getBoundingClientRect()
    if (!drag || !rect) {
      return
    }

    const now = performance.now()
    const point = getClientPoint(event)
    const elapsed = Math.max(now - drag.lastTime, 8)
    const vx = ((point.x - drag.lastX) / elapsed) * 16
    const vy = ((point.y - drag.lastY) / elapsed) * 16

    drag.lastX = point.x
    drag.lastY = point.y
    drag.lastTime = now

    setCreatures((current) =>
      current.map((creature) => {
        if (creature.id !== drag.id) {
          return creature
        }

        const maxX = Math.max(rect.width - creature.size, 12)
        const maxY = Math.max(rect.height - creature.size, 12)
        return {
          ...creature,
          x: clamp(point.x - rect.left - drag.offsetX, 0, maxX),
          y: clamp(point.y - rect.top - drag.offsetY, 0, maxY),
          vx,
          vy,
          spin: creature.spin + vx * 0.18,
        }
      }),
    )
  }

  const endDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag) {
      return
    }

    event.currentTarget.releasePointerCapture(event.pointerId)
    dragRef.current = null
  }

  const settleCreatures = () => {
    const { width, height } = stageSize(stageRef.current)
    setIsSettled((current) => !current)
    setCreatures((current) =>
      current.map((creature, index) => ({
        ...creature,
        x: isSettled
          ? creature.x
          : clamp(72 + (index % 6) * 142, 0, Math.max(width - creature.size, 12)),
        y: isSettled
          ? creature.y
          : clamp(126 + Math.floor(index / 6) * 186, 0, Math.max(height - creature.size, 12)),
        vx: isSettled ? creature.vx : 0,
        vy: isSettled ? creature.vy : 0,
        spin: 0,
      })),
    )
  }

  return (
    <main className="zoo-shell">
      <section className="habitat" aria-labelledby="zoo-title">
        <div className="habitat-copy">
          <a className="home-link" href="../">Hackathon</a>
          <h1 id="zoo-title">Pocket Zoo</h1>
          <p>
            Toss a few tiny animals around. They remember every boop.
          </p>
        </div>

        <div className="toolbelt" aria-label="Habitat tools">
          <button
            className={tool === 'boop' ? 'is-active' : ''}
            type="button"
            aria-pressed={tool === 'boop'}
            onClick={() => setTool('boop')}
            title="Boop animals"
          >
            <Hand aria-hidden="true" />
            <span>{toolCopy.boop}</span>
          </button>
          <button
            className={tool === 'snack' ? 'is-active' : ''}
            type="button"
            aria-pressed={tool === 'snack'}
            onClick={() => setTool('snack')}
            title="Drop treats"
          >
            <Cookie aria-hidden="true" />
            <span>{toolCopy.snack}</span>
          </button>
          <button
            className={tool === 'magnet' ? 'is-active' : ''}
            type="button"
            aria-pressed={tool === 'magnet'}
            onClick={() => setTool('magnet')}
            title="Gather animals"
          >
            <Magnet aria-hidden="true" />
            <span>{toolCopy.magnet}</span>
          </button>
          <button
            className={tool === 'breeze' ? 'is-active' : ''}
            type="button"
            aria-pressed={tool === 'breeze'}
            onClick={() => setTool('breeze')}
            title="Start a breeze"
          >
            <Wind aria-hidden="true" />
            <span>{toolCopy.breeze}</span>
          </button>
          <button type="button" onClick={settleCreatures} title="Line them up">
            <Sparkles aria-hidden="true" />
            <span>{isSettled ? 'Loose' : 'Lineup'}</span>
          </button>
          <button type="button" onClick={resetHabitat} title="Reset habitat">
            <RotateCcw aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>

        <div
          ref={stageRef}
          className={`play-stage tool-${tool}`}
          onPointerDown={handleStagePointerDown}
          aria-label="Interactive animal habitat"
        >
          <div className="pond" aria-hidden="true"></div>
          <div className="rug" aria-hidden="true"></div>
          <div className="shelf" aria-hidden="true"></div>

          {treats.map((treat) => (
            <span
              key={treat.id}
              className="treat"
              style={{ left: treat.x, top: treat.y }}
              aria-hidden="true"
            />
          ))}

          {creatures.map((creature) => (
            <button
              key={creature.id}
              className="creature"
              type="button"
              style={
                {
                  '--creature-size': `${creature.size}px`,
                  '--creature-hue': creature.hue,
                  left: creature.x,
                  top: creature.y,
                  zIndex: creature.z,
                  transform: `rotate(${creature.spin}deg)`,
                } as CSSProperties
              }
              onPointerDown={(event) => {
                event.stopPropagation()
                startDrag(event, creature)
              }}
              onPointerMove={dragCreature}
              onPointerUp={(event) => {
                endDrag(event)
                if (tool === 'boop') {
                  boopCreature(creature.id)
                }
              }}
              onPointerCancel={endDrag}
              onDoubleClick={() => boopCreature(creature.id)}
              aria-label={`${creature.name}, ${creature.mood}. ${creature.quirk}`}
            >
              <span className="creature-glow" aria-hidden="true" />
              <img
                src={`./animals/${creature.file}`}
                alt=""
                draggable="false"
                onError={(event) => {
                  event.currentTarget.hidden = true
                }}
              />
              <span className="fallback-face" aria-hidden="true">
                {creature.name.slice(0, 1)}
              </span>
              <span className="name-tag">{creature.name}</span>
              {creature.reaction ? <span className="reaction">{creature.reaction}</span> : null}
            </button>
          ))}
        </div>

        <aside className="status-strip" aria-label="Zoo status">
          <span>
            <MousePointer2 aria-hidden="true" />
            drag + flick
          </span>
          <span>
            <Heart aria-hidden="true" />
            {totalBoops} boops
          </span>
          <span>{spotlight} is up</span>
        </aside>
      </section>
    </main>
  )
}

export default App
