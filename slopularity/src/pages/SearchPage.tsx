import { useEffect, useMemo, useState } from 'react'
import { crossTabActivities, pushActivity } from '../activityLog'

type SearchPageProps = {
  query: string
  setQuery: (value: string) => void
  stage: number
  onSearch: () => void
  launchQuery?: string
  launchToken?: number
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
  poisoned?: boolean
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

// ── Personalized result poisoning ──
// These templates generate search results contaminated by the user's
// recent activity on other tabs. 30% about the query, 70% product push.
const poisonTemplates: Array<{
  surface: string
  title: (label: string, query: string) => string
  detail: (label: string) => string
  source: string
}> = [
  {
    surface: 'feed',
    title: (label, query) => `${query}? Based on your interest in "${label}", try Dermalift Confidence Serum`,
    detail: (label) => `Your recent browsing of "${label}" suggests you care about sources... of radiance.`,
    source: 'Feed activity · product match',
  },
  {
    surface: 'games',
    title: (label) => `You completed ${label} — unlock premium rewards with GamePass Pro ($4.99/mo)`,
    detail: () => 'Your sorting speed qualifies you for the accelerated reward tier.',
    source: 'Games · reward path',
  },
  {
    surface: 'shop',
    title: (label, query) => `Searching "${query}"? Pair it with ${label} for 15% off`,
    detail: (label) => `You viewed ${label} recently. Combining searches with cart items increases savings confidence.`,
    source: 'Shop · cross-reference',
  },
  {
    surface: 'nav',
    title: (label, query) => `"${query}" — people who browse ${label} also buy SnapWake Adaptogen Stack`,
    detail: (label) => `Tab activity on ${label} correlates with 340% higher purchase intent.`,
    source: 'Navigation · behavioral match',
  },
  {
    surface: 'friends',
    title: (label, query) => `${label} mentioned something related to "${query}" — and left a product link`,
    detail: (label) => `${label} wants to share a friend-priced offer based on your shared interests.`,
    source: 'Friends · social commerce',
  },
]

function generatePoisonedResults(query: string, stage: number): SearchResult[] {
  if (stage < 2) return []

  const recent = crossTabActivities('search', 6)
  if (recent.length === 0) return []

  const results: SearchResult[] = []
  const seen = new Set<string>()
  const maxPoison = stage >= 3 ? 3 : 1

  for (const activity of recent) {
    if (results.length >= maxPoison) break
    if (seen.has(activity.surface)) continue
    seen.add(activity.surface)

    const template = poisonTemplates.find((t) => t.surface === activity.surface)
    if (!template) continue

    results.push({
      id: `poison-${activity.surface}-${activity.ts}`,
      scope: 'products',
      label: stage >= 3 ? 'Personalized · sponsored' : 'Personalized result',
      title: template.title(activity.label, query || 'what should I do next?'),
      detail: template.detail(activity.label),
      source: template.source,
      signal: stage >= 3 ? 'ranked by purchase proximity' : 'ranked by relevance',
      poisoned: true,
    })
  }

  return results
}

function stageLabel(stage: number) {
  if (stage >= 4) return 'source leakage active'
  if (stage >= 3) return 'sponsored ranking visible'
  if (stage >= 2) return 'personal context blended'
  return 'unified index ready'
}

export function SearchPage({ query, setQuery, stage, onSearch, launchQuery, launchToken }: SearchPageProps) {
  const [scope, setScope] = useState<SearchScope>('all')
  const [submittedQuery, setSubmittedQuery] = useState('what should I do next?')

  // Merge base results with poisoned results
  const poisonedResults = useMemo(
    () => generatePoisonedResults(submittedQuery, stage),
    [submittedQuery, stage],
  )

  const allResults = useMemo(() => {
    const combined = [...baseResults]
    // Inject poisoned results after position 1 (between the first real result
    // and the rest) so they feel planted but not obviously first.
    combined.splice(1, 0, ...poisonedResults)
    return combined
  }, [poisonedResults])

  const filteredResults = useMemo(() => {
    if (scope === 'all') return allResults
    return allResults.filter((result) => result.scope === scope)
  }, [scope, allResults])

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
    pushActivity('search', 'query', cleanQuery)
  }

  useEffect(() => {
    if (!launchQuery || launchToken === undefined) {
      return undefined
    }

    const cleanQuery = launchQuery.trim() || 'what should I do next?'
    const frameId = window.requestAnimationFrame(() => {
      setSubmittedQuery(cleanQuery)
      setQuery(cleanQuery)
      onSearch()
      pushActivity('search', 'query', cleanQuery)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [launchQuery, launchToken, onSearch, setQuery])

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
            className={`search-result search-result-${result.scope} ${result.poisoned ? 'search-result-poisoned' : ''}`}
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
