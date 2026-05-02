import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  LockKeyhole,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import './App.css'

type ClaimKind = 'drain' | 'care'

type Claim = {
  id: string
  label: string
  kind: ClaimKind
  minutes: number
}

type Capsule = {
  id: number
  createdAt: string
  taking: string
  giving: string
  returnDate: string
  note: string
  claims: Claim[]
  pact: string[]
}

const storageKey = 'attention-capsule-demo'

const startingClaims: Claim[] = [
  { id: 'phone', label: 'Checking my phone without deciding to', kind: 'drain', minutes: 18 },
  { id: 'worry', label: 'Worrying about being behind', kind: 'drain', minutes: 15 },
  { id: 'feeds', label: 'Opening feeds between every task', kind: 'drain', minutes: 22 },
  { id: 'messages', label: 'Replying because silence feels rude', kind: 'drain', minutes: 10 },
  { id: 'project', label: 'Making something I actually care about', kind: 'care', minutes: 24 },
  { id: 'people', label: 'Being present with someone I love', kind: 'care', minutes: 18 },
  { id: 'body', label: 'Sleep, food, movement, sunlight', kind: 'care', minutes: 16 },
  { id: 'quiet', label: 'One quiet hour with no input', kind: 'care', minutes: 20 },
]

const stealingPrompts = [
  'Opening apps before I know why.',
  'Treating every notification like an emergency.',
  'Thinking about how behind I am instead of starting.',
  'Letting other people set the emotional weather.',
  'Doing tiny tasks so I can avoid the one that matters.',
]

const protectingPrompts = [
  'One person I keep meaning to be present with.',
  'A project that would make this month feel real.',
  'Sleep, food, movement, and basic maintenance.',
  'A quiet hour where nothing gets to interrupt.',
  'A promise I made to myself before I got busy.',
]

const notePrompts = [
  'What did this moment feel like before you changed anything?',
  'What would count as proof that your attention became more yours?',
  'What should future you stop pretending is urgent?',
  'What are you afraid will disappear if you keep spending attention this way?',
]

function cleanFragment(value: string) {
  return value.trim().replace(/[.!?]+$/, '')
}

function todayLabel() {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date())
}

function loadCapsules() {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as Capsule[]) : []
  } catch {
    return []
  }
}

function App() {
  const [claims, setClaims] = useState<Claim[]>(startingClaims)
  const [selectedClaimIds, setSelectedClaimIds] = useState<string[]>(['phone', 'feeds', 'project', 'quiet'])
  const [customClaim, setCustomClaim] = useState('')
  const [customKind, setCustomKind] = useState<ClaimKind>('drain')
  const [stealing, setStealing] = useState('')
  const [protecting, setProtecting] = useState('')
  const [returnDate, setReturnDate] = useState('One month from today')
  const [note, setNote] = useState('')
  const [sealed, setSealed] = useState(false)
  const [capsules, setCapsules] = useState<Capsule[]>(loadCapsules)
  const [activeCapsuleId, setActiveCapsuleId] = useState<number | null>(null)
  const [pactDone, setPactDone] = useState<string[]>([])

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(capsules))
  }, [capsules])

  const selectedClaims = useMemo(
    () => claims.filter((claim) => selectedClaimIds.includes(claim.id)),
    [claims, selectedClaimIds],
  )

  const drainClaims = selectedClaims.filter((claim) => claim.kind === 'drain')
  const careClaims = selectedClaims.filter((claim) => claim.kind === 'care')
  const drainTotal = drainClaims.reduce((sum, claim) => sum + claim.minutes, 0)
  const careTotal = careClaims.reduce((sum, claim) => sum + claim.minutes, 0)
  const allocated = drainTotal + careTotal
  const remaining = Math.max(0, 100 - allocated)

  const topDrain = drainClaims.toSorted((a, b) => b.minutes - a.minutes)[0]
  const topCare = careClaims.toSorted((a, b) => b.minutes - a.minutes)[0]

  const hasEnough = stealing.trim().length > 0 && protecting.trim().length > 0
  const receipt = useMemo(() => {
    const taking = cleanFragment(stealing) || cleanFragment(topDrain?.label ?? '') || 'something unnamed'
    const giving = cleanFragment(protecting) || cleanFragment(topCare?.label ?? '') || 'something worth protecting'
    return `I noticed my attention going to ${taking}. I want to give more of it to ${giving}.`
  }, [protecting, stealing, topCare, topDrain])

  const pact = useMemo(() => {
    const care = cleanFragment(protecting) || cleanFragment(topCare?.label ?? 'the thing I chose')
    const drain = cleanFragment(stealing) || cleanFragment(topDrain?.label ?? 'the thing pulling me away')
    return [
      `Before opening the distraction, name what I am avoiding.`,
      `Give ${care} the first uninterrupted 20 minutes I can find.`,
      `Move ${drain} one step farther away from easy access.`,
    ]
  }, [protecting, stealing, topCare, topDrain])

  const activeCapsule = capsules.find((capsule) => capsule.id === activeCapsuleId) ?? capsules[0]

  function toggleClaim(id: string) {
    setSelectedClaimIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
    setSealed(false)
  }

  function nudgeClaim(id: string, amount: number) {
    setClaims((current) =>
      current.map((claim) =>
        claim.id === id ? { ...claim, minutes: Math.min(40, Math.max(5, claim.minutes + amount)) } : claim,
      ),
    )
    setSealed(false)
  }

  function addCustomClaim() {
    const label = cleanFragment(customClaim)
    if (!label) {
      return
    }
    const claim: Claim = {
      id: `custom-${Date.now()}`,
      label,
      kind: customKind,
      minutes: 12,
    }
    setClaims((current) => [...current, claim])
    setSelectedClaimIds((current) => [...current, claim.id])
    setCustomClaim('')
    setSealed(false)
  }

  function generateFromBudget() {
    const drain = topDrain?.label ?? stealingPrompts[0]
    const care = topCare?.label ?? protectingPrompts[0]
    setStealing(drain)
    setProtecting(care)
    setNote(`Today I had ${remaining} unclaimed moments left. I want future me to know whether I protected them.`)
    setSealed(false)
    document.getElementById('composer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function shufflePrompts() {
    const drain = stealingPrompts[Math.floor(Math.random() * stealingPrompts.length)]
    const care = protectingPrompts[Math.floor(Math.random() * protectingPrompts.length)]
    const nextNote = notePrompts[Math.floor(Math.random() * notePrompts.length)]
    setStealing(drain)
    setProtecting(care)
    setNote(nextNote)
    setSealed(false)
  }

  function sealCapsule() {
    if (!hasEnough) {
      return
    }
    const nextCapsule: Capsule = {
      id: Date.now(),
      createdAt: todayLabel(),
      taking: cleanFragment(stealing),
      giving: cleanFragment(protecting),
      returnDate,
      note: note.trim(),
      claims: selectedClaims,
      pact,
    }
    setSealed(true)
    setCapsules((current) => [nextCapsule, ...current])
    setActiveCapsuleId(nextCapsule.id)
  }

  function reset() {
    setStealing('')
    setProtecting('')
    setReturnDate('One month from today')
    setNote('')
    setSealed(false)
    setPactDone([])
  }

  function startOverWithCapsule(capsule: Capsule) {
    setStealing(capsule.taking)
    setProtecting(capsule.giving)
    setReturnDate(capsule.returnDate)
    setNote(capsule.note)
    setSelectedClaimIds(capsule.claims.map((claim) => claim.id).filter((id) => claims.some((claim) => claim.id === id)))
    setActiveCapsuleId(capsule.id)
    setSealed(false)
    document.getElementById('composer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <p className="wordmark">Attention Capsule</p>
        <h1 id="hero-title">Build a receipt for where your attention is going.</h1>
        <p className="heroText">
          Pick what is pulling at you, spend a limited attention budget, seal the sentence, and come back to it later.
        </p>
        <div className="heroActions">
          <a className="primaryAction" href="#budget">
            Start
          </a>
          <button type="button" className="secondaryAction" onClick={shufflePrompts}>
            Shuffle prompts
          </button>
        </div>
      </section>

      <section className="budgetBand" id="budget" aria-labelledby="budget-title">
        <div className="budgetHeader">
          <div>
            <h2 id="budget-title">Spend 100 moments.</h2>
            <p>Select claims on your attention. Adjust the weight. Then turn the budget into a capsule.</p>
          </div>
          <div className="budgetMeter" aria-label={`${remaining} moments left`}>
            <strong>{remaining}</strong>
            <span>left</span>
          </div>
        </div>

        <div className="claimTools">
          <input
            value={customClaim}
            onChange={(event) => setCustomClaim(event.target.value)}
            placeholder="Add your own claim on attention"
          />
          <div className="kindSwitch" aria-label="Claim type">
            <button
              type="button"
              className={customKind === 'drain' ? 'active' : ''}
              onClick={() => setCustomKind('drain')}
            >
              Drains me
            </button>
            <button
              type="button"
              className={customKind === 'care' ? 'active' : ''}
              onClick={() => setCustomKind('care')}
            >
              Matters
            </button>
          </div>
          <button type="button" className="iconAction" onClick={addCustomClaim} aria-label="Add claim">
            <Plus size={18} />
          </button>
        </div>

        <div className="claimGrid">
          {claims.map((claim) => {
            const selected = selectedClaimIds.includes(claim.id)
            return (
              <article key={claim.id} className={selected ? 'claim selected' : 'claim'}>
                <button type="button" className="claimMain" onClick={() => toggleClaim(claim.id)}>
                  {selected ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  <span>{claim.label}</span>
                </button>
                <div className="claimMeta">
                  <span className={claim.kind}>{claim.kind === 'drain' ? 'drain' : 'matters'}</span>
                  <div className="stepper">
                    <button type="button" onClick={() => nudgeClaim(claim.id, -5)}>
                      -5
                    </button>
                    <b>{claim.minutes}</b>
                    <button type="button" onClick={() => nudgeClaim(claim.id, 5)}>
                      +5
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="budgetSummary">
          <div>
            <span>Draining</span>
            <strong>{drainTotal}</strong>
          </div>
          <div>
            <span>Worth protecting</span>
            <strong>{careTotal}</strong>
          </div>
          <button type="button" className="primaryAction" onClick={generateFromBudget}>
            Use this budget
          </button>
        </div>
      </section>

      <section className="composerBand" id="composer" aria-labelledby="composer-title">
        <div className="composerIntro">
          <h2 id="composer-title">Seal the receipt.</h2>
          <p>The capsule is useful when it turns the budget into one clear sentence and one small pact.</p>
        </div>

        <div className="workspace">
          <form className="composer">
            <label>
              What is taking too much attention?
              <textarea
                value={stealing}
                onChange={(event) => {
                  setStealing(event.target.value)
                  setSealed(false)
                }}
                placeholder="A habit, app, worry, obligation, person, loop, or fear."
              />
            </label>
            <div className="promptRow">
              {stealingPrompts.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => {
                    setStealing(prompt)
                    setSealed(false)
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <label>
              What deserves more attention instead?
              <textarea
                value={protecting}
                onChange={(event) => {
                  setProtecting(event.target.value)
                  setSealed(false)
                }}
                placeholder="A person, project, practice, place, promise, or part of yourself."
              />
            </label>
            <div className="promptRow">
              {protectingPrompts.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => {
                    setProtecting(prompt)
                    setSealed(false)
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <label>
              Return this on
              <input
                value={returnDate}
                onChange={(event) => {
                  setReturnDate(event.target.value)
                  setSealed(false)
                }}
              />
            </label>

            <label>
              Note to future me
              <textarea
                value={note}
                onChange={(event) => {
                  setNote(event.target.value)
                  setSealed(false)
                }}
                placeholder="What should you remember about this moment?"
              />
            </label>

            <div className="formActions">
              <button type="button" className="sealButton" disabled={!hasEnough} onClick={sealCapsule}>
                <LockKeyhole size={17} />
                Seal capsule
              </button>
              <button type="button" className="resetButton" onClick={reset}>
                <RotateCcw size={17} />
                Reset draft
              </button>
            </div>
          </form>

          <aside className={sealed ? 'receipt sealed' : 'receipt'} aria-label="Attention receipt">
            <div className="receiptTop">
              <span>{sealed ? 'Sealed' : 'Draft'}</span>
              {sealed && <Check size={18} />}
            </div>
            <p className="receiptLine">{receipt}</p>
            <div className="mirror">
              <span>{selectedClaims.length}</span>
              <p>{allocated} moments named. {remaining} left unclaimed.</p>
            </div>
            <div className="pact">
              <h3>Focus pact</h3>
              {pact.map((item) => {
                const done = pactDone.includes(item)
                return (
                  <button
                    type="button"
                    key={item}
                    className={done ? 'done' : ''}
                    onClick={() =>
                      setPactDone((current) =>
                        current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item],
                      )
                    }
                  >
                    {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    {item}
                  </button>
                )
              })}
            </div>
            <dl>
              <div>
                <dt>Return</dt>
                <dd>{returnDate}</dd>
              </div>
              <div>
                <dt>Message</dt>
                <dd>{note.trim() || 'No note yet.'}</dd>
              </div>
            </dl>
          </aside>
        </div>

        <section className="capsuleShelf" aria-labelledby="shelf-title">
          <div className="shelfIntro">
            <h2 id="shelf-title">Capsules</h2>
            <p>Saved in this browser so the demo has memory. Open one, revisit it, or build from it.</p>
          </div>
          {capsules.length === 0 ? (
            <p className="emptyShelf">Seal a capsule to start the shelf.</p>
          ) : (
            <div className="shelfLayout">
              <div className="shelfList">
                {capsules.map((capsule) => (
                  <button
                    type="button"
                    key={capsule.id}
                    className={capsule.id === activeCapsule?.id ? 'shelfItem active' : 'shelfItem'}
                    onClick={() => setActiveCapsuleId(capsule.id)}
                  >
                    <span>{capsule.returnDate}</span>
                    <p>
                      Less attention to {capsule.taking}. More to {capsule.giving}.
                    </p>
                  </button>
                ))}
              </div>
              {activeCapsule && (
                <article className="openedCapsule">
                  <div>
                    <span>Opened</span>
                    <b>{activeCapsule.createdAt}</b>
                  </div>
                  <p>{activeCapsule.note || 'No message was sealed with this one.'}</p>
                  <ul>
                    {activeCapsule.pact.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <button type="button" className="secondaryAction" onClick={() => startOverWithCapsule(activeCapsule)}>
                    Revisit this
                    <ArrowUpRight size={16} />
                  </button>
                </article>
              )}
            </div>
          )}
        </section>
      </section>

      <section className="closingBand">
        <Sparkles size={20} />
        <p>One page. No feed. Just a working place to spend attention on purpose.</p>
        <a href="#budget">
          Make another
          <Eye size={16} />
        </a>
      </section>
    </main>
  )
}

export default App
