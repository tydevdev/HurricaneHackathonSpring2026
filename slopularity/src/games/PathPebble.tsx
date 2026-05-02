import { useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { GameProps } from './types'

type PathSpec = {
  id: string
  d: string
  // Sampled checkpoint coordinates (in viewBox 320x180 space).
  points: Array<[number, number]>
  scenery: 'meadow' | 'pond'
}

const PATHS: PathSpec[] = [
  {
    id: 'meadow',
    scenery: 'meadow',
    d: 'M 20 130 C 80 40, 140 170, 200 70 S 280 130, 304 60',
    points: [
      [20, 130], [50, 90], [80, 70], [110, 90], [140, 130], [170, 130],
      [200, 90], [220, 70], [240, 80], [260, 100], [280, 100], [304, 70],
    ],
  },
  {
    id: 'pond',
    scenery: 'pond',
    d: 'M 30 90 Q 80 30, 140 80 T 240 100 T 300 50',
    points: [
      [30, 90], [60, 60], [90, 50], [120, 60], [150, 80], [180, 90],
      [210, 100], [240, 100], [264, 84], [284, 70], [296, 60],
    ],
  },
]

function dist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx
  const dy = ay - by
  return Math.sqrt(dx * dx + dy * dy)
}

export function PathPebble({ stage, done, onComplete }: GameProps) {
  const [pathIdx, setPathIdx] = useState(0)
  const [covered, setCovered] = useState<Set<number>>(new Set())
  const [drawing, setDrawing] = useState(false)
  const [pointsLogged, setPointsLogged] = useState(0)
  const [submitted, setSubmitted] = useState(done)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const path = PATHS[pathIdx]!
  const allDone = submitted
  const target = path.points.length

  // Cursor location in viewBox space, used to drive the pebble visual.
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)

  const progress = covered.size / target

  function svgCoords(e: ReactPointerEvent<SVGSVGElement>) {
    const svg = svgRef.current
    if (!svg) return null
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return null
    const local = pt.matrixTransform(ctm.inverse())
    return { x: local.x, y: local.y }
  }

  function handlePointerDown(e: ReactPointerEvent<SVGSVGElement>) {
    if (allDone) return
    setDrawing(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    const c = svgCoords(e)
    if (c) setCursor(c)
  }

  function handlePointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    if (allDone) return
    const c = svgCoords(e)
    if (!c) return
    setCursor(c)
    if (!drawing) return
    setPointsLogged((n) => n + 1)
    setCovered((current) => {
      let changed = false
      const next = new Set(current)
      path.points.forEach((p, i) => {
        if (next.has(i)) return
        if (dist(c.x, c.y, p[0], p[1]) <= 18) {
          next.add(i)
          changed = true
        }
      })
      return changed ? next : current
    })
  }

  function handlePointerUp(e: ReactPointerEvent<SVGSVGElement>) {
    setDrawing(false)
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
    // If this path is sufficiently covered, advance.
    if (covered.size >= target - 1) {
      if (pathIdx + 1 >= PATHS.length) {
        setSubmitted(true)
        onComplete('Path of the Pebble')
      } else {
        setPathIdx(pathIdx + 1)
        setCovered(new Set())
      }
    }
  }

  function reset() {
    setPathIdx(0)
    setCovered(new Set())
    setDrawing(false)
    setPointsLogged(0)
    setSubmitted(false)
    setCursor(null)
  }

  const sceneryClass = `g-pebble-stage g-pebble-${path.scenery}`

  const pebbleAt = useMemo(() => {
    if (cursor) return cursor
    return { x: path.points[0]![0], y: path.points[0]![1] }
  }, [cursor, path.points])

  return (
    <div className="g g-pebble" role="group" aria-label="Path of the Pebble play area">
      <div className="g-pebble-head">
        <div>
          <p className="g-eyebrow">Path {Math.min(pathIdx + 1, PATHS.length)} of {PATHS.length}</p>
          <h3>Trace the path with the pebble</h3>
          <p className="g-help">Press and drag along the dotted line.</p>
        </div>
        <div className="g-pebble-progress">
          <div className="g-pebble-bar"><span style={{ width: `${Math.min(100, progress * 100)}%` }} /></div>
          <small>{Math.round(progress * 100)}%</small>
        </div>
      </div>

      <div className={sceneryClass}>
        <svg
          ref={svgRef}
          viewBox="0 0 320 180"
          preserveAspectRatio="xMidYMid meet"
          className="g-pebble-svg"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <defs>
            <linearGradient id={`grad-${path.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          {/* Faded target path */}
          <path d={path.d} fill="none" stroke="rgba(17, 19, 24, 0.18)" strokeWidth="3" strokeDasharray="4 6" strokeLinecap="round" />
          {/* Player coverage */}
          <path d={path.d} fill="none" stroke={`url(#grad-${path.id})`} strokeWidth="5" strokeLinecap="round"
            strokeDasharray="320"
            strokeDashoffset={320 * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.18s ease' }}
          />
          {/* Checkpoints */}
          {path.points.map((p, i) => (
            <circle
              key={i}
              cx={p[0]}
              cy={p[1]}
              r={covered.has(i) ? 5 : 3}
              fill={covered.has(i) ? '#a78bfa' : '#cbd5e1'}
            />
          ))}
          {/* Pebble */}
          <g transform={`translate(${pebbleAt.x} ${pebbleAt.y})`}>
            <circle r="11" fill="#0f172a" opacity="0.18" />
            <circle r="9" fill="#fff" stroke="#0f172a" strokeWidth="2" />
            <circle r="3" cx="-2.4" cy="-2.4" fill="#0f172a" opacity="0.8" />
          </g>
        </svg>
      </div>

      {allDone && (
        <div className="g-receipt" role="status">
          <strong>Sticker pack +1</strong>
          {stage >= 3 ? (
            <code>segmentation_seed.path_v9 → {pointsLogged} pointer samples · per-pixel</code>
          ) : (
            <span>The pebble made it. The pond is grateful.</span>
          )}
          <button type="button" className="g-secondary" onClick={reset}>Play again</button>
        </div>
      )}
    </div>
  )
}
