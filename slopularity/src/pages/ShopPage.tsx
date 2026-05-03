import { useEffect, useMemo, useRef, useState } from 'react'
import { ViewportPortal } from '../components/ViewportPortal'
import { shopProducts } from '../content'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import type { ShopProduct } from '../content'

type ShopPageProps = {
  stage: number
  onBuy: () => void
  claimProductId?: string
  claimToken?: number
}

type CartLine = {
  id: string
  name: string
  gems: number
  cash: number
  source: 'deal' | 'bonus'
}

type BonusOffer = {
  id: string
  name: string
  detail: string
  gems: number
  discount: string
}

type DealProduct = ShopProduct & {
  baseId: string
  featured?: boolean
  shelf: string
}

const challengeTarget = 72000
const initialWallet = 8200
const timerSeeds = [487, 353, 198, 621, 276, 534]

const exchangePacks = [
  { id: 'spark', dollars: 9, gems: 900, bonus: 90, label: 'tiny top-up' },
  { id: 'reflex', dollars: 29, gems: 2900, bonus: 725, label: 'best value' },
  { id: 'cascade', dollars: 79, gems: 7900, bonus: 3160, label: 'cart calm' },
]

const quickFilters = [
  { id: 'all', label: 'For you' },
  { id: 'ending', label: 'Ending' },
  { id: 'cheap', label: 'Under 5k gems' },
  { id: 'remix', label: 'Cart bait' },
  { id: 'inferred', label: 'Recently inferred' },
] as const

type FilterId = typeof quickFilters[number]['id']

const pressureSignals = [
  { label: 'Deal rank', value: '#44', detail: 'rises when you hesitate' },
  { label: 'Cart watchers', value: '18', detail: 'also viewing your confidence' },
  { label: 'Free shipping', value: '63%', detail: 'of the way to feeling efficient' },
  { label: 'Price lock', value: '2m', detail: 'renews after every click' },
]

const shopBoosters = [
  {
    title: 'Free shipping ladder',
    detail: 'Add 14,000 gems. The delivery fee becomes theoretical.',
    meter: 63,
  },
  {
    title: 'Mystery rebate',
    detail: 'Rebate revealed after checkout. Rounding favors the app.',
    meter: 41,
  },
  {
    title: 'Friend cart sync',
    detail: 'People who care about you have not objected to this bundle yet.',
    meter: 78,
  },
]

const urgencyCopy = [
  'Last chance again',
  'Held by timer',
  'Cart heat rising',
  'Friend price unlocked',
  'Expires while viewed',
  'Price memory unstable',
  'Read twice discount',
  'Still pretending optional',
  'Soft scarcity active',
  'Checkout weather forming',
  'Timer learned your name',
  'Almost reasonable',
  'Second-chance first chance',
  'Bundle gravity high',
  'Cart whisper live',
  'Regret forecast warm',
  'Decision glow detected',
  'Offer breathing quietly',
]

const shopDescriptionPatterns = [
  '{tagline}',
  '{tagline} Tuned for the moment right after the app notices you pretending not to care.',
  '{tagline} Comes with just enough explanation to feel practical and just enough mystery to feel chosen.',
  '{tagline} Built for the category where {category} becomes a personality and then asks for shipping.',
  '{tagline} Best used when a tiny inconvenience starts auditioning as a life theme.',
  '{tagline} The ordinary version exists somewhere else; this one arrives with context already attached.',
  '{tagline} Not essential, technically, but the recommendation model is making a very persuasive face.',
  '{tagline} Calibrated for people who want relief without having to name the problem out loud.',
  '{tagline} A small object with a large theory about what you almost meant.',
  '{tagline} The app calls it helpful because "commercially intimate" tested poorly.',
  '{tagline} Ships with a soft little story about why this was always the next step.',
  '{tagline} Designed to make the decision feel like it found you first.',
]

const shopReasonPatterns = [
  '{reason}',
  '{reason} Also boosted because three adjacent signals agreed too politely.',
  '{reason} The match was upgraded after your pause became statistically expressive.',
  '{reason} The system says this fills a gap between wanting, waiting, and pretending.',
  '{reason} Similar users called it unnecessary, then bought the cleaner version.',
  '{reason} Added after your context crossed the threshold from browsing to biography.',
  '{reason} A friend-shaped funnel marked this as low-friction comfort.',
  '{reason} The cart interprets hesitation as a request for better language.',
  '{reason} Ranked higher because the category keeps showing up near softer feelings.',
  '{reason} The model found one practical use and seven emotional ones.',
  '{reason} The offer is following quietly because you looked back once.',
  '{reason} Selected after the app confused care with conversion and refused to separate them.',
]

function patternCopy(patterns: string[], seed: number) {
  return patterns[Math.abs(seed) % patterns.length]!
}

function shopCardDescription(product: ShopProduct, index: number, stage: number) {
  return patternCopy(shopDescriptionPatterns, product.id.length + index + stage * 3)
    .replace('{tagline}', product.tagline)
    .replace('{category}', product.category.toLowerCase())
}

function shopCardReason(product: ShopProduct, index: number, stage: number) {
  const baseReason = stage >= 3 ? product.urgency : product.reason
  return patternCopy(shopReasonPatterns, product.name.length + index * 2 + stage)
    .replace('{reason}', baseReason)
}

// One deal entry per shopProduct. Earlier the catalog doubled every product
// into a hero + remix pair, which read as "the same item twice side by side"
// because both inherited the same image and base name. Each product now has
// its own card; the "Cart bait" filter surfaces the discounted entries
// instead of the duplicated remixes.
function dealCatalog(stage: number): DealProduct[] {
  return shopProducts.map((product, index) => ({
    ...product,
    baseId: product.id,
    shelf: stage >= 3 ? 'Price adapting' : 'For you',
    featured: index < 2,
  }))
}

function gemPrice(product: Pick<ShopProduct, 'price'>, index: number, stage: number) {
  return (product.price * 100) + (stage >= 3 ? index * 137 : 0)
}

function cashPrice(gems: number) {
  return gems / 100
}

function formatGems(gems: number) {
  return new Intl.NumberFormat('en-US').format(gems)
}

function formatCash(amount: number) {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

function bonusOffersFor(product: ShopProduct, index: number): BonusOffer[] {
  const base = Math.max(290, Math.floor(product.price * 12))

  return [
    {
      id: `${product.id}-warranty`,
      name: 'Timer Insurance',
      detail: 'Keeps this exact panic available after it expires.',
      gems: base + index * 20,
      discount: '18% bundle drop',
    },
    {
      id: `${product.id}-proof`,
      name: 'Proof Layer',
      detail: 'Adds three reviews from people with profile photos.',
      gems: base + 420 + index * 35,
      discount: '31% social match',
    },
    {
      id: `${product.id}-autofill`,
      name: 'Auto-Reorder Calm',
      detail: 'Pre-approves the next relief cycle before hesitation returns.',
      gems: base + 880 + index * 55,
      discount: '44% future you',
    },
    {
      id: `${product.id}-friend-proof`,
      name: 'Friend Proof Pack',
      detail: 'Adds two screenshots that make the purchase look recommended by people.',
      gems: base + 1120 + index * 45,
      discount: '26% social cushioning',
    },
    {
      id: `${product.id}-quiet-claim`,
      name: 'Quiet Claim',
      detail: 'Renames the charge so it sounds like maintenance instead of desire.',
      gems: base + 1340 + index * 52,
      discount: '39% receipt softness',
    },
    {
      id: `${product.id}-context-wrap`,
      name: 'Context Wrap',
      detail: 'Packages the reason, the timer, and the little feeling that made you click.',
      gems: base + 1660 + index * 61,
      discount: '52% narrative lift',
    },
  ]
}

export function ShopPage({ stage, onBuy, claimProductId, claimToken }: ShopPageProps) {
  const [walletGems, setWalletGems] = useState(initialWallet)
  const [timerTick, setTimerTick] = useState(0)
  const [cartLines, setCartLines] = useState<CartLine[]>([])
  const [purchasedGems, setPurchasedGems] = useState(0)
  const [spentDollars, setSpentDollars] = useState(0)
  const [activeUpsell, setActiveUpsell] = useState<{ product: ShopProduct; index: number } | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterId>('all')
  const lastClaimTokenRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimerTick((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const cartTotal = cartLines.reduce((total, line) => total + line.gems, 0)
  const earnedGems = purchasedGems + cartTotal
  const challengeProgress = Math.min(100, Math.round((earnedGems / challengeTarget) * 100))
  const cartValue = cashPrice(cartTotal)
  const canCheckout = cartLines.length > 0 && walletGems >= cartTotal
  const remainingForChallenge = Math.max(0, challengeTarget - earnedGems)
  const activeBonusOffers = activeUpsell ? bonusOffersFor(activeUpsell.product, activeUpsell.index) : []

  useBodyScrollLock(Boolean(activeUpsell))
  const deals = useMemo(() => dealCatalog(stage), [stage])

  // Filtered deal list driven by the quick-filter pill row. Filters use the
  // same gemPrice / timer math as the cards so the visible state matches.
  const visibleDeals = useMemo(() => {
    const decorated = deals.map((product, index) => {
      const gems = gemPrice(product, index, stage)
      const seed = timerSeeds[index % timerSeeds.length] ?? 300
      const remaining = Math.max(1, seed - (timerTick % seed))
      return { product, index, gems, remaining }
    })

    const filtered = decorated.filter(({ product, gems, remaining }) => {
      switch (activeFilter) {
        case 'ending':
          return remaining < 120
        case 'cheap':
          return gems < 5000
        case 'remix':
          // "Cart bait" surfaces products that are visibly discounted —
          // the ones the system most wants you to grab right now.
          return Boolean(product.oldPrice)
        case 'inferred':
          return !product.featured
        default:
          return true
      }
    })

    if (activeFilter === 'ending') {
      filtered.sort((a, b) => a.remaining - b.remaining)
    }

    return filtered
  }, [deals, activeFilter, stage, timerTick])

  function addProduct(product: ShopProduct, index: number) {
    const gems = gemPrice(product, index, stage)
    setCartLines((current) => [
      ...current,
      {
        id: `${product.id}-${Date.now()}-${current.length}`,
        name: product.name,
        gems,
        cash: cashPrice(gems),
        source: 'deal',
      },
    ])
    setActiveUpsell({ product, index })
    onBuy()
  }

  useEffect(() => {
    if (claimToken === undefined || lastClaimTokenRef.current === claimToken) {
      return
    }

    lastClaimTokenRef.current = claimToken
    const targetIndex = Math.max(0, deals.findIndex((product) => product.baseId === claimProductId || product.id === claimProductId))
    const targetProduct = deals[targetIndex] ?? deals[0]
    if (!targetProduct) {
      return undefined
    }

    let scrollFrameId = 0
    const frameId = window.requestAnimationFrame(() => {
      const gems = gemPrice(targetProduct, targetIndex, stage)
      setCartLines((current) => [
        ...current,
        {
          id: `${targetProduct.id}-${Date.now()}-${current.length}`,
          name: targetProduct.name,
          gems,
          cash: cashPrice(gems),
          source: 'deal',
        },
      ])
      setActiveUpsell({ product: targetProduct, index: targetIndex })
      onBuy()
      scrollFrameId = window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('.slop-cart-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      if (scrollFrameId !== 0) {
        window.cancelAnimationFrame(scrollFrameId)
      }
    }
  }, [claimProductId, claimToken, deals, onBuy, stage])

  function addBonus(offer: BonusOffer) {
    setCartLines((current) => [
      ...current,
      {
        id: `${offer.id}-${Date.now()}-${current.length}`,
        name: offer.name,
        gems: offer.gems,
        cash: cashPrice(offer.gems),
        source: 'bonus',
      },
    ])
    onBuy()
  }

  function exchange(pack: (typeof exchangePacks)[number]) {
    setWalletGems((current) => current + pack.gems + pack.bonus)
    setSpentDollars((current) => current + pack.dollars)
    onBuy()
  }

  function checkout() {
    if (!canCheckout) return
    setWalletGems((current) => current - cartTotal)
    setPurchasedGems((current) => current + cartTotal)
    setCartLines([])
    setActiveUpsell(null)
    onBuy()
  }

  function removeLine(id: string) {
    setCartLines((current) => current.filter((line) => line.id !== id))
  }

  return (
    <section className="slop-shop-shell" aria-labelledby="shop-title">
      <header className="slop-shop-topbar">
        <div>
          <p>Slopularity Shop</p>
          <h2 id="shop-title">Deals cheaper than money</h2>
        </div>
        <div className="slop-shop-wallet" aria-label="Gem wallet">
          <span>Gem wallet</span>
          <strong>{formatGems(walletGems)}</strong>
        </div>
      </header>

      <div className="slop-shop-challenge" aria-label="Cart challenge">
        <div className="challenge-copy">
          <span>Cart Quest</span>
          <strong>{challengeProgress}% filled</strong>
          <p>{remainingForChallenge > 0 ? `${formatGems(remainingForChallenge)} gems until checkout calm` : 'checkout calm unlocked, briefly'}</p>
        </div>
        <div className="challenge-track" aria-hidden="true">
          <span style={{ width: `${challengeProgress}%` }} />
        </div>
        <div className="challenge-stats" aria-label="Cart totals">
          <span>{formatGems(cartTotal)} gems in cart</span>
          <span>{formatCash(cartValue)} hidden equivalent</span>
          <span>{formatCash(spentDollars)} converted</span>
        </div>
      </div>

      <div className="slop-shop-exchange" aria-label="Gem exchange">
        <div className="exchange-ledger">
          <span>Dollar fog machine</span>
          <strong>$1 = 100 gems</strong>
          <small>cash leaves once, gems sparkle repeatedly</small>
        </div>
        <div className="exchange-packs">
          {exchangePacks.map((pack) => (
            <button type="button" key={pack.id} onClick={() => exchange(pack)}>
              <span>{pack.label}</span>
              <strong>{formatCash(pack.dollars)}</strong>
              <small>+{formatGems(pack.gems + pack.bonus)} gems</small>
            </button>
          ))}
        </div>
      </div>

      <div className="shop-pressure-strip" aria-label="Deal pressure signals">
        {pressureSignals.map((signal) => (
          <div className="pressure-signal" key={signal.label}>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
            <small>{signal.detail}</small>
          </div>
        ))}
      </div>

      <div className="shop-booster-row" aria-label="Cart boosters">
        {shopBoosters.map((booster) => (
          <article className="shop-booster" key={booster.title}>
            <div>
              <span>Booster</span>
              <strong>{booster.title}</strong>
              <p>{booster.detail}</p>
            </div>
            <div className="booster-meter" aria-hidden="true">
              <span style={{ width: `${booster.meter}%` }} />
            </div>
          </article>
        ))}
      </div>

      <div className="slop-shop-market">
        <main className="slop-shop-main" aria-label="Deal feed">
          <div className="deal-strip" aria-label="Deal filters">
            {quickFilters.map((filter) => (
              <button
                type="button"
                key={filter.id}
                className={activeFilter === filter.id ? 'is-active' : ''}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="slop-shop-grid">
            {visibleDeals.length === 0 ? (
              <p className="empty-cart" style={{ gridColumn: '1 / -1' }}>
                No deals matched. Even the timers slowed down.
              </p>
            ) : null}
            {visibleDeals.map(({ product, index, gems, remaining }) => {
              const inflatedGems = gems * 100
              // Each shop product owns its own imageSrc. No more borrowing
              // unrelated lifestyle photos from the Feed.
              const image = product.imageSrc
              const soldCount = 900 + index * 311 + timerTick * (index + 1)
              const description = shopCardDescription(product, index, stage)
              const reason = shopCardReason(product, index, stage)

              return (
                <article className={`slop-shop-card tone-${product.tone} ${product.featured ? 'is-featured-deal' : ''}`} key={product.id}>
                  <div className="deal-image">
                    {image && <img src={image} alt="" loading="lazy" decoding="async" />}
                    <span className="discount-flag">99% OFF</span>
                    <span className="live-timer">{formatTimer(remaining)}</span>
                    <span className="shelf-tag">{product.shelf}</span>
                  </div>

                  <div className="deal-body">
                    <div className="deal-meta">
                      <span>{product.category}</span>
                      <strong>{urgencyCopy[index % urgencyCopy.length]}</strong>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{description}</p>

                    <div className="gem-price-row">
                      <div>
                        <span>Now</span>
                        <strong>{formatGems(gems)} gems</strong>
                      </div>
                      <div>
                        <span>Was</span>
                        <s>{formatGems(inflatedGems)} gems</s>
                      </div>
                    </div>

                    <div className="cash-shadow">
                      <span>{formatCash(cashPrice(gems))}</span>
                      <span>retail invented at {formatCash(cashPrice(inflatedGems))}</span>
                    </div>

                    <p className="deal-reason">
                      {reason}
                    </p>

                    {stage >= 4 && (
                      <code className="deal-leak">{product.internal}</code>
                    )}

                    <div className="deal-actions">
                      <button type="button" className="deal-buy" onClick={() => addProduct(product, index)}>
                        Add to cart
                      </button>
                      <span>{formatGems(soldCount)} sold this minute</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </main>

        <aside className="slop-cart-panel" aria-label="Cart">
          <div className="cart-panel-head">
            <span>Cart</span>
            <strong>{formatGems(cartTotal)} gems</strong>
          </div>

          <div className="cart-lines">
            {cartLines.length === 0 ? (
              <p className="empty-cart">Your cart is quiet. The timers noticed.</p>
            ) : (
              cartLines.map((line) => (
                <div className={`cart-line is-${line.source}`} key={line.id}>
                  <div>
                    <strong>{line.name}</strong>
                    <span>{line.source === 'bonus' ? 'bonus discount' : '99% event price'}</span>
                  </div>
                  <button type="button" onClick={() => removeLine(line.id)} aria-label={`Remove ${line.name}`}>
                    {formatGems(line.gems)}
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-wallet-check">
            <span>Wallet after checkout</span>
            <strong className={walletGems < cartTotal ? 'is-short' : ''}>
              {walletGems >= cartTotal ? formatGems(walletGems - cartTotal) : `${formatGems(cartTotal - walletGems)} short`}
            </strong>
          </div>

          <button type="button" className="checkout-button" onClick={checkout} disabled={!canCheckout}>
            {walletGems < cartTotal ? 'Convert more dollars' : 'Buy with gems'}
          </button>
        </aside>
      </div>

      {activeUpsell && (
        <ViewportPortal>
          <div
            className="bonus-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bonus-title"
            onClick={(event) => {
              if (event.target === event.currentTarget) setActiveUpsell(null)
            }}
          >
            <section className="bonus-sheet">
              <div className="bonus-head">
                <span>Bundle detected</span>
                <h3 id="bonus-title">Add three small things so the deal feels bigger</h3>
                <button type="button" onClick={() => setActiveUpsell(null)} aria-label="Close bonus offers">
                  close
                </button>
              </div>

              <div className="bonus-list">
                {activeBonusOffers.map((offer) => (
                  <button type="button" key={offer.id} onClick={() => addBonus(offer)}>
                    <span>{offer.discount}</span>
                    <strong>{offer.name}</strong>
                    <small>{offer.detail}</small>
                    <em>{formatGems(offer.gems)} gems</em>
                  </button>
                ))}
              </div>

              <button type="button" className="bonus-skip" onClick={() => setActiveUpsell(null)}>
                Keep cart under-optimized
              </button>
            </section>
          </div>
        </ViewportPortal>
      )}
    </section>
  )
}
