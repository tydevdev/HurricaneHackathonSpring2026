import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { GAMES, GAMES_LOBBY_ART, rewardProgress, rewardStat, rewardText } from '../games'
import { gameFromLocation, pathForGame, pathForTab } from '../routes'
import type { GameMeta } from '../games'

type GamesPageProps = {
  completedTasks: string[]
  onComplete: (title: string) => void
  stage: number
}

type GameWithComponent = GameMeta & { component: (typeof GAMES)[number]['component'] }

function gameStyle(game: GameMeta): CSSProperties {
  return {
    '--game-cover': `url(${game.art.cover})`,
    '--game-pattern': `url(${game.art.pattern})`,
  } as CSSProperties
}

function useGameRoute() {
  const [routeGameId, setRouteGameId] = useState(() => gameFromLocation())

  useEffect(() => {
    const syncRoute = () => setRouteGameId(gameFromLocation())
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  function navigate(gameId: string | null) {
    const nextPath = gameId ? pathForGame(gameId) : pathForTab('games')
    window.history.pushState(null, '', nextPath)
    setRouteGameId(gameId)
  }

  return { routeGameId, navigate }
}

function GamesQueue({ stage }: { stage: number }) {
  return (
    <aside className={`games-queue stage-${stage}`} aria-label="Behind the scenes">
      <header>
        <span className="games-queue-dot" aria-hidden="true" />
        <strong>{stage >= 2 ? "Today's training queue" : "Today's reward shelf"}</strong>
        <em>{stage >= 3 ? 'visible by accident' : 'just stickers'}</em>
      </header>
      <ul>
        {GAMES.map((g) => (
          <li key={g.id}>
            <span className="games-queue-emoji" aria-hidden="true">{g.emoji}</span>
            <span className="games-queue-name">{g.title}</span>
            <code className="games-queue-pipe">
              {stage >= 3 ? g.receipt.pipeline : rewardText(stage)}
            </code>
            {stage >= 4 && <small>{g.receipt.detail}</small>}
          </li>
        ))}
      </ul>
      {stage >= 4 && (
        <p className="games-queue-foot">
          <code>// AutoSprint TODO: rename "task" to "moment" — keeps reward salience high.</code>
        </p>
      )}
    </aside>
  )
}

function LobbyCard({
  game,
  done,
  onNavigate,
}: {
  game: GameWithComponent
  done: boolean
  onNavigate: (gameId: string) => void
}) {
  return (
    <a
      className={`games-lobby-card tone-${game.tone} ${done ? 'is-done' : ''}`}
      href={pathForGame(game.id)}
      style={gameStyle(game)}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(game.id)
      }}
    >
      <span className="games-lobby-card-art">
        <img src={game.art.cover} alt={game.art.heroAlt} loading="lazy" />
      </span>
      <span className="games-lobby-card-body">
        <span className="games-lobby-card-icon">
          <img src={game.art.icon} alt="" loading="lazy" />
        </span>
        <span>
          <strong>{game.title}</strong>
          <small>{game.cute}</small>
        </span>
      </span>
      <span className="games-lobby-card-foot">
        <span>{game.playLabel}</span>
        <b>{done ? 'Sticker logged' : 'Open'}</b>
      </span>
    </a>
  )
}

function GamesLobby({
  completedTasks,
  onNavigate,
  stage,
}: {
  completedTasks: string[]
  onNavigate: (gameId: string) => void
  stage: number
}) {
  const titles = useMemo(() => new Set(GAMES.map((g) => g.title)), [])
  const stickers = completedTasks.filter((t) => titles.has(t)).length
  const stat = rewardStat(stickers, GAMES.length, stage)
  const progress = rewardProgress(stickers, stage)

  return (
    <section className="surface games-surface games-lobby" aria-labelledby="games-title">
      <div className="games-lobby-hero">
        <img src={GAMES_LOBBY_ART.background} alt={GAMES_LOBBY_ART.backgroundAlt} />
        <div className="games-lobby-hero-copy">
          <img className="games-lobby-app-icon" src={GAMES_LOBBY_ART.icon} alt="" />
          <p>Games</p>
          <h2 id="games-title">Tiny arcade, giant training queue</h2>
          <span>{stage >= 3 ? 'reward shelf recalculating' : 'five cozy rounds ready'}</span>
        </div>
      </div>

      <div className="games-stat-row games-lobby-stats" aria-label="Daily progress">
        <div className="games-stat">
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </div>
        <div className="games-stat">
          <span>Labels submitted</span>
          <strong>{completedTasks.length}</strong>
        </div>
        {progress && (
          <div className="games-stat games-stat-progress">
            <span>{progress}</span>
          </div>
        )}
      </div>

      <div className="games-lobby-grid" aria-label="Game shelf">
        {GAMES.map((game) => (
          <LobbyCard
            key={game.id}
            game={game}
            done={completedTasks.includes(game.title)}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      <GamesQueue stage={stage} />
    </section>
  )
}

function GamePlayroom({
  active,
  completedTasks,
  onBack,
  onComplete,
  stage,
}: {
  active: GameWithComponent
  completedTasks: string[]
  onBack: () => void
  onComplete: (title: string) => void
  stage: number
}) {
  const ActiveComponent = active.component
  const done = completedTasks.includes(active.title)

  return (
    <section
      className={`surface games-surface games-playroom tone-${active.tone}`}
      aria-labelledby="games-play-title"
      style={gameStyle(active)}
    >
      <div className="games-play-hero">
        <a
          href={pathForTab('games')}
          className="games-back-link"
          onClick={(event) => {
            event.preventDefault()
            onBack()
          }}
        >
          All games
        </a>
        <div className="games-play-hero-copy">
          <img className="games-play-icon" src={active.art.icon} alt={active.art.iconAlt} />
          <p>Now playing</p>
          <h2 id="games-play-title">{active.title}</h2>
          <span>{active.collectLabel}</span>
        </div>
        <img className="games-play-hero-img" src={active.art.cover} alt={active.art.heroAlt} />
      </div>

      <div className="games-play-layout">
        <div className="games-stage" role="tabpanel" aria-label={`${active.title} play area`}>
          <ActiveComponent
            stage={stage}
            done={done}
            onComplete={onComplete}
          />
        </div>

        <aside className="games-play-aside" aria-label="Game reward details">
          <img src={active.art.accent} alt={active.art.accentAlt} loading="lazy" />
          <div>
            <span>{done ? 'Filed' : 'Reward'}</span>
            <strong>{stage >= 3 ? active.receipt.pipeline : rewardText(stage)}</strong>
            <small>{stage >= 4 ? active.receipt.detail : active.cute}</small>
          </div>
        </aside>
      </div>

      <GamesQueue stage={stage} />
    </section>
  )
}

export function GamesPage({ completedTasks, onComplete, stage }: GamesPageProps) {
  const { routeGameId, navigate } = useGameRoute()
  const active = GAMES.find((g) => g.id === routeGameId)

  if (!active) {
    return (
      <GamesLobby
        completedTasks={completedTasks}
        onNavigate={navigate}
        stage={stage}
      />
    )
  }

  return (
    <GamePlayroom
      active={active}
      completedTasks={completedTasks}
      onBack={() => navigate(null)}
      onComplete={onComplete}
      stage={stage}
    />
  )
}
