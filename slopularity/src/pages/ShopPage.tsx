import { shopProducts } from '../content'
import { scoreLikePrice } from '../utils'

type ShopPageProps = {
  stage: number
  onBuy: () => void
}

export function ShopPage({ stage, onBuy }: ShopPageProps) {
  return (
    <section className="surface shop-surface" aria-labelledby="shop-title">
      <div className="surface-heading">
        <div>
          <p>Shop</p>
          <h2 id="shop-title">Solutions to feelings we helped create</h2>
        </div>
        <span>{stage >= 4 ? 'cart filled by inference' : 'sponsored gently'}</span>
      </div>

      <div className="shop-grid">
        {shopProducts.map((product, index) => {
          const driftedPrice = stage >= 3
            ? `${product.price + index * 2}.${scoreLikePrice(stage, index)}`
            : `${product.price}.99`
          return (
            <article className={`shop-card tone-${product.tone}`} key={product.id}>
              <div className="shop-card-cover" aria-hidden="true">
                <span className="shop-card-glyph" />
                <span className="shop-card-glyph alt" />
                <span className="shop-card-glyph small" />
              </div>

              <div className="shop-card-body">
                <span className="shop-card-cat">{product.category}</span>
                <h3>{product.name}</h3>
                <p className="shop-card-tag">{product.tagline}</p>

                <div className="shop-card-price-row">
                  <strong className="shop-card-price">${driftedPrice}</strong>
                  {product.oldPrice && (
                    <span className="shop-card-old">${product.oldPrice}</span>
                  )}
                  <span className="shop-card-margin">
                    {stage >= 3 ? 'price aligned to attention' : 'today only'}
                  </span>
                </div>

                <p className="shop-card-reason">
                  {stage >= 2 ? product.urgency : product.reason}
                </p>

                {stage >= 4 && (
                  <code className="shop-card-internal">{product.internal}</code>
                )}

                <div className="shop-card-actions">
                  <button type="button" className="shop-buy" onClick={onBuy}>
                    {stage >= 3 ? 'Already in cart' : 'Add context'}
                  </button>
                  <button type="button" className="shop-skip" onClick={onBuy}>
                    Save for later
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
