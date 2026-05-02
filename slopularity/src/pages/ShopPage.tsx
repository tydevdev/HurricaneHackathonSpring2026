import { scoreLikePrice } from '../utils'

const products = ['GlowNest Mirror+', 'AuraBank Select', 'SelfOS Premium', 'Context Bundle']

type ShopPageProps = {
  stage: number
  onBuy: () => void
}

export function ShopPage({ stage, onBuy }: ShopPageProps) {
  return (
    <section className="surface" aria-labelledby="shop-title">
      <div className="surface-heading">
        <div>
          <p>Shop</p>
          <h2 id="shop-title">Solutions to feelings we helped create</h2>
        </div>
        <span>{stage >= 4 ? 'cart filled by inference' : 'sponsored gently'}</span>
      </div>
      <div className="shop-grid">
        {products.map((product, index) => (
          <article className="shop-card" key={product}>
            <p>{product}</p>
            <h3>${stage >= 3 ? `${29 + index * 7}.${scoreLikePrice(stage, index)}` : `${19 + index * 5}.99`}</h3>
            <span>{stage >= 2 ? 'Placed because you paused near self-improvement.' : 'Recommended for your unified life.'}</span>
            <button type="button" onClick={onBuy}>Add context</button>
          </article>
        ))}
      </div>
    </section>
  )
}
