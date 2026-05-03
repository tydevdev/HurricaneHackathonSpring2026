import { useEffect, useMemo, useRef, useState } from 'react'
import { feedPosts, shopProducts } from '../content'
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
]

const dealRemixes = [
  { suffix: 'Travel Size', shelf: 'Micro need', priceShift: -12, tagline: 'Smaller, faster, easier to justify.' },
  { suffix: 'Family Pack', shelf: 'Volume calm', priceShift: 34, tagline: 'Enough to make restraint look inefficient.' },
  { suffix: 'Auto Bundle', shelf: 'One-tap loop', priceShift: 22, tagline: 'Ships again before the feeling has a name.' },
]

function dealCatalog(stage: number): DealProduct[] {
  const remixedProducts = shopProducts.flatMap((product, index) => {
    const remix = dealRemixes[index % dealRemixes.length]
    const remixedPrice = Math.max(5, product.price + remix.priceShift + (index % 2) * 7)

    return [
      {
        ...product,
        id: `${product.id}-hero`,
        baseId: product.id,
        shelf: stage >= 3 ? 'Price adapting' : 'For you',
        featured: index < 2,
      },
      {
        ...product,
        id: `${product.id}-remix-${index}`,
        baseId: product.id,
        name: `${product.name} ${remix.suffix}`,
        tagline: remix.tagline,
        category: remix.shelf,
        price: remixedPrice,
        oldPrice: Math.max(product.oldPrice ?? product.price + 20, remixedPrice + 37),
        urgency: `Reserved because ${product.name.toLowerCase()} held your attention.`,
        reason: `Matched from ${product.category.toLowerCase()} and cart math.`,
        internal: `${product.internal} · remix:${remix.suffix.toLowerCase().replaceAll(' ', '_')}`,
        shelf: remix.shelf,
      },
    ]
  })

  return remixedProducts
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
          return product.id.includes('-remix-')
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
              const image = product.imageSrc || feedPosts[(index * 7) % feedPosts.length]?.imageSrc
              const soldCount = 900 + index * 311 + timerTick * (index + 1)

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
                    <p>{product.tagline}</p>

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
                      {stage >= 3 ? product.urgency : product.reason}
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
      )}
    </section>
  )
}
