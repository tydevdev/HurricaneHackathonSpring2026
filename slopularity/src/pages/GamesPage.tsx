import { useState } from 'react'
import { GAMES } from '../games'

type GamesPageProps = {
  completedTasks: string[]
  onComplete: (title: string) => void
  stage: number
}

export function GamesPage({ completedTasks, onComplete, stage }: GamesPageProps) {
  const [activeId, setActiveId] = useState(GAMES[0]!.id)

  const submittedCount = completedTasks.length
  const active = GAMES.find((g) => g.id === activeId) ?? GAMES[0]!
  const ActiveComponent = active.component

  // Stickers earned: one per unique submitted title that matches a known game.
  const titles = new Set(GAMES.map((g) => g.title))
  const stickers = completedTasks.filter((t) => titles.has(t)).length

  return (
    <section className="surface games-surface" aria-labelledby="games-title">
      <div className="surface-heading games-heading">
        <div>
          <p>Games</p>
          <h2 id="games-title">Tiny tasks for the whole family and the model</h2>
        </div>
        <div className="games-stat-row" aria-label="Daily progress">
          <div className="games-stat">
            <span>Stickers</span>
            <strong>{stickers}/{GAMES.length}</strong>
          </div>
          <div className="games-stat">
            <span>Labels submitted</span>
            <strong>{submittedCount}</strong>
          </div>
        </div>
      </div>

      <div className="games-picker" role="tablist" aria-label="Today's queue">
        {GAMES.map((g) => {
          const isActive = g.id === activeId
          const isDone = completedTasks.includes(g.title)
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`games-tile ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
              onClick={() => setActiveId(g.id)}
            >
              <span className="games-tile-emoji" aria-hidden="true">{g.emoji}</span>
              <span className="games-tile-text">
                <strong>{g.title}</strong>
                <small>{g.cute}</small>
              </span>
              {isDone && <span className="games-tile-badge" aria-label="Submitted">★</span>}
            </button>
          )
        })}
      </div>

      <div className="games-stage" role="tabpanel" aria-label={`${active.title} play area`} key={active.id}>
        <ActiveComponent
          stage={stage}
          done={completedTasks.includes(active.title)}
          onComplete={onComplete}
        />
      </div>

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
                {stage >= 3 ? g.receipt.pipeline : g.receipt.cute}
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
    </section>
  )
}
