import type { CSSProperties } from 'react'

type PageFractureProps = {
  stage: number
  surfaceKey: string
}

type ShardStyle = CSSProperties & {
  '--shard-left': string
  '--shard-top': string
  '--shard-width': string
  '--shard-height': string
  '--shard-rotate': string
  '--shard-delay': string
  '--shard-fall': string
}

const shardStyles: ShardStyle[] = [
  {
    '--shard-left': '14%',
    '--shard-top': '23%',
    '--shard-width': '96px',
    '--shard-height': '62px',
    '--shard-rotate': '-9deg',
    '--shard-delay': '0.15s',
    '--shard-fall': '112vh',
  },
  {
    '--shard-left': '72%',
    '--shard-top': '19%',
    '--shard-width': '118px',
    '--shard-height': '74px',
    '--shard-rotate': '8deg',
    '--shard-delay': '0.85s',
    '--shard-fall': '124vh',
  },
  {
    '--shard-left': '48%',
    '--shard-top': '51%',
    '--shard-width': '142px',
    '--shard-height': '86px',
    '--shard-rotate': '-5deg',
    '--shard-delay': '1.45s',
    '--shard-fall': '118vh',
  },
  {
    '--shard-left': '24%',
    '--shard-top': '66%',
    '--shard-width': '106px',
    '--shard-height': '70px',
    '--shard-rotate': '12deg',
    '--shard-delay': '2.05s',
    '--shard-fall': '106vh',
  },
]

export function PageFracture({ stage, surfaceKey }: PageFractureProps) {
  if (stage < 3) {
    return null
  }

  return (
    <div
      key={`${surfaceKey}-${stage}`}
      className={`page-fracture-layer fracture-stage-${stage}`}
      aria-hidden="true"
    >
      <svg className="page-fracture-cracks" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="fracture-main fracture-main-a" d="M12 7 L18 17 L15 29 L23 40 L20 54 L30 67 L27 83" />
        <path className="fracture-branch" d="M18 17 L31 19 L37 26" />
        <path className="fracture-branch" d="M23 40 L35 38 L45 45" />
        <path className="fracture-branch" d="M30 67 L42 72 L51 82" />
        <path className="fracture-main fracture-main-b" d="M82 9 L76 20 L80 35 L71 48 L73 61 L65 75 L67 92" />
        <path className="fracture-branch" d="M76 20 L64 23 L57 31" />
        <path className="fracture-branch" d="M71 48 L58 52 L51 61" />
        <path className="fracture-branch" d="M65 75 L54 73 L43 78" />
        <path className="fracture-stage-four" d="M43 2 L45 16 L39 28 L45 42 L42 55 L50 69 L47 98" />
        <path className="fracture-stage-four" d="M45 42 L55 39 L63 44 L70 40" />
      </svg>

      {stage >= 4 && (
        <div className="page-fracture-shards">
          {shardStyles.map((style, index) => (
            <span
              // Stable by design: remounting the parent restarts the fall.
              key={index}
              className={`page-fracture-shard shard-${index + 1}`}
              style={style}
            />
          ))}
        </div>
      )}
    </div>
  )
}
