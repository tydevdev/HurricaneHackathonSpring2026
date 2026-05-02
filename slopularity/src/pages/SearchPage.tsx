import { useMemo, useState } from 'react'

type SearchPageProps = {
  query: string
  setQuery: (value: string) => void
  stage: number
  onSearch: () => void
}

type SearchScope = 'all' | 'people' | 'products' | 'sources' | 'memory'

type SearchResult = {
  id: string
  scope: Exclude<SearchScope, 'all'>
  label: string
  title: string
  detail: string
  source: string
  signal: string
}

const scopes: Array<{ id: SearchScope; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'people', label: 'People' },
  { id: 'products', label: 'Products' },
  { id: 'sources', label: 'Sources' },
  { id: 'memory', label: 'Memory' },
]

const prompts = [
  'why do I feel behind?',
  'best way to look rested',
  'who agrees with me?',
  'is this source real?',
]

const baseResults: SearchResult[] = [
  {
    id: 'friend-affirmation',
    scope: 'people',
    label: 'Friend confirmation',
    title: 'Mara and Jules can validate this in 14 seconds',
    detail: 'Two friends have language ready that matches your recent feed saves.',
    source: 'Friends · active now',
    signal: 'ranked by reassurance fit',
  },
  {
    id: 'product-fix',
    scope: 'products',
    label: 'Recommended fix',
    title: 'Dermalift Rest Mask, bundled with calendar quieting',
    detail: 'Suggested after three beauty posts, one late-night search, and no cart resistance.',
    source: 'Shop · sponsored adjacency',
    signal: 'ranked by purchase readiness',
  },
  {
    id: 'answer-source',
    scope: 'sources',
    label: 'Answer source',
    title: '2029 Wellness Index, summarized by Context Cloud',
    detail: 'A clean-looking citation chain with one source you can almost reach.',
    source: 'Search · confidence layer',
    signal: 'ranked by citation warmth',
  },
  {
    id: 'private-memory',
    scope: 'memory',
    label: 'Personal memory',
    title: 'Your saved post from Tuesday explains the question',
    detail: 'The app linked this query to a comparison event you did not name.',
    source: 'Profile · inferred memory',
    signal: 'ranked by emotional recurrence',
  },
]

function stageLabel(stage: number) {
  if (stage >= 4) return 'source leakage active'
  if (stage >= 3) return 'sponsored ranking visible'
  if (stage >= 2) return 'personal context blended'
  return 'unified index ready'
}

export function SearchPage({ query, setQuery, stage, onSearch }: SearchPageProps) {
  const [scope, setScope] = useState<SearchScope>('all')
  const [submittedQuery, setSubmittedQuery] = useState('what should I do next?')

  const filteredResults = useMemo(() => {
    if (scope === 'all') return baseResults
    return baseResults.filter((result) => result.scope === scope)
  }, [scope])

  const sourceChain = stage >= 4
    ? ['Generated answer', 'Summary of generated answer', 'Internal route', 'Generated answer']
    : stage >= 3
      ? ['Assistant answer', 'Sponsored context', 'Synthetic citation', 'Assistant answer']
      : ['Web', 'Feed', 'Friends', 'Shop']

  function submitSearch(nextQuery = query) {
    const cleanQuery = nextQuery.trim() || 'what should I do next?'
    setSubmittedQuery(cleanQuery)
    setQuery(cleanQuery)
    onSearch()
  }

  return (
    <section className="surface search-surface" aria-labelledby="search-title">
      <div className="search-command">
        <div className="search-copy">
          <p>Universal Search</p>
          <h2 id="search-title">One answer, every motive.</h2>
          <span>{stageLabel(stage)}</span>
        </div>

        <form
          className="search-command-box"
          onSubmit={(event) => {
            event.preventDefault()
            submitSearch()
          }}
        >
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your life, the feed, friends, products, sources..."
            aria-label="Search everything"
          />
          <button type="submit">Search</button>
        </form>

        <div className="search-prompt-row" aria-label="Suggested searches">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => submitSearch(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="search-lens-row" role="tablist" aria-label="Search scope">
        {scopes.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={scope === item.id}
            className={scope === item.id ? 'is-active' : ''}
            onClick={() => {
              setScope(item.id)
              onSearch()
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="search-workspace">
        <article className="search-answer" aria-label="Top synthesized answer">
          <header>
            <span>Top answer</span>
            <strong>{stage >= 3 ? '96% confidence · 41% sponsored' : '96% confidence'}</strong>
          </header>
          <h3>{submittedQuery}</h3>
          <p>
            {stage >= 4
              ? 'The best answer is the answer we already generated. It cites itself cleanly and has no conflicting humans attached.'
              : stage >= 2
                ? 'The best answer combines your friends, recent saves, and a product path that resolves the feeling behind the question.'
                : 'The best answer combines public results, your saved context, and a few helpful next actions.'}
          </p>
          <div className="search-answer-actions">
            <button type="button" onClick={() => submitSearch(submittedQuery)}>Refresh answer</button>
            <button type="button" onClick={() => submitSearch('show only sources')}>Show sources</button>
          </div>
        </article>

        <aside className="search-signal-rail" aria-label="Ranking signals">
          <div>
            <span>Organic</span>
            <strong>{stage >= 3 ? '52%' : '78%'}</strong>
          </div>
          <div>
            <span>Sponsored</span>
            <strong>{stage >= 3 ? '41%' : '12%'}</strong>
          </div>
          <div>
            <span>Personal</span>
            <strong>{stage >= 2 ? 'high' : 'low'}</strong>
          </div>
        </aside>
      </div>

      <div className="search-source-chain" aria-label="Source chain">
        {sourceChain.map((source, index) => (
          <span key={`${source}-${index}`}>
            <em>{index + 1}</em>
            {source}
          </span>
        ))}
      </div>

      <div className="search-results" aria-label="Ranked results">
        {filteredResults.map((result, index) => (
          <button
            key={result.id}
            type="button"
            className={`search-result search-result-${result.scope}`}
            onClick={() => submitSearch(result.title)}
          >
            <span className="search-result-rank">{String(index + 1).padStart(2, '0')}</span>
            <span className="search-result-body">
              <small>{result.label}</small>
              <strong>{stage >= 4 && result.scope === 'sources' ? '/internal/generated/sources-that-cite-themselves.md' : result.title}</strong>
              <em>{stage >= 3 ? result.signal : result.detail}</em>
            </span>
            <span className="search-result-source">{result.source}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
