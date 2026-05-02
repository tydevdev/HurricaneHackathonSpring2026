import { useMemo, useState } from 'react'

export type WordScrambleProps = {
  word: string
  clue?: string
  title?: string
  onSolve?: (word: string) => void
  onSkip?: () => void
}

function scrambleWord(word: string) {
  const letters = word.trim().split('')
  for (let index = letters.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[letters[index], letters[swapIndex]] = [letters[swapIndex], letters[index]]
  }
  const scrambled = letters.join('')
  return scrambled.toLowerCase() === word.toLowerCase() ? letters.reverse().join('') : scrambled
}

export function WordScramble({
  word,
  clue,
  title = 'Word Scramble',
  onSolve,
  onSkip,
}: WordScrambleProps) {
  const [guess, setGuess] = useState('')
  const [solved, setSolved] = useState(false)
  const scrambled = useMemo(() => scrambleWord(word), [word])

  const submitGuess = () => {
    if (guess.trim().toLowerCase() !== word.trim().toLowerCase()) {
      return
    }
    setSolved(true)
    onSolve?.(word)
  }

  return (
    <section
      style={{
        border: '1px solid rgba(148, 163, 184, 0.28)',
        borderRadius: 8,
        padding: 18,
        display: 'grid',
        gap: 12,
      }}
      aria-label={title}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
        {clue ? <p style={{ margin: '4px 0 0', color: '#64748b' }}>{clue}</p> : null}
      </div>
      <strong style={{ fontSize: 28, letterSpacing: 0 }}>{scrambled}</strong>
      <label style={{ display: 'grid', gap: 6 }}>
        <span>Answer</span>
        <input
          value={guess}
          disabled={solved}
          onChange={(event) => setGuess(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              submitGuess()
            }
          }}
        />
      </label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" disabled={solved} onClick={submitGuess}>
          {solved ? 'Solved' : 'Check'}
        </button>
        <button type="button" onClick={onSkip}>
          Skip
        </button>
      </div>
    </section>
  )
}
