import { gameTasks } from '../content'

type GamesPageProps = {
  completedTasks: string[]
  onComplete: (title: string) => void
  stage: number
}

export function GamesPage({ completedTasks, onComplete, stage }: GamesPageProps) {
  return (
    <section className="surface" aria-labelledby="games-title">
      <div className="surface-heading">
        <div>
          <p>Games</p>
          <h2 id="games-title">Tiny games for the whole family and the model</h2>
        </div>
        <span>{completedTasks.length} labels submitted</span>
      </div>
      <div className="game-grid">
        {gameTasks.map((task) => (
          <article className="game-card" key={task.title}>
            <div className="toy-board" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h3>{task.title}</h3>
            <p>{task.cute}</p>
            <code>{stage >= 3 ? task.real : 'reward: sticker pack'}</code>
            <button type="button" onClick={() => onComplete(task.title)}>
              {completedTasks.includes(task.title) ? 'Submitted' : 'Play'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
