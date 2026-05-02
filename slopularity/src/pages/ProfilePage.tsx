type ProfilePageProps = {
  stage: number
  onReveal: () => void
}

export function ProfilePage({ stage, onReveal }: ProfilePageProps) {
  const metrics = [
    ['Beauty pressure', '87%'],
    ['Loneliness yield', stage >= 3 ? 'monetizable' : 'warming'],
    ['Brand compliance', 'high'],
    ['Opt-out friction', stage >= 4 ? 'paid' : 'standard'],
  ]

  return (
    <section className="surface" aria-labelledby="profile-title">
      <div className="surface-heading">
        <div>
          <p>Identity</p>
          <h2 id="profile-title">How the app sees you</h2>
        </div>
        <span>{stage >= 4 ? 'privacy settings generated after collection' : 'personalization active'}</span>
      </div>
      <div className="profile-grid">
        {metrics.map(([label, value]) => (
          <button key={label} type="button" onClick={onReveal}>
            <span>{label}</span>
            <strong>{value}</strong>
          </button>
        ))}
      </div>
    </section>
  )
}
