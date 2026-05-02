type SearchPageProps = {
  query: string
  setQuery: (value: string) => void
  stage: number
  onSearch: () => void
}

export function SearchPage({ query, setQuery, stage, onSearch }: SearchPageProps) {
  const results = [
    'Posts that match your insecurity profile',
    'Friends willing to affirm this search',
    'Products adjacent to the answer',
    stage >= 4 ? '/internal/generated/sources-that-cite-themselves.md' : 'Assistant answer with sponsored context',
  ]

  return (
    <section className="surface" aria-labelledby="search-title">
      <div className="surface-heading">
        <div>
          <p>Universal Search</p>
          <h2 id="search-title">One box for every need and every ad</h2>
        </div>
      </div>
      <form
        className="search-box"
        onSubmit={(event) => {
          event.preventDefault()
          onSearch()
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search your life, the feed, your friends, the store..."
        />
        <button type="submit">Search</button>
      </form>
      <div className="result-list">
        {results.map((result) => (
          <button key={result} type="button" onClick={onSearch}>{result}</button>
        ))}
      </div>
    </section>
  )
}
