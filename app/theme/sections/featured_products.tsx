import type { ProductData, ProductList, SiteInfo, Translate } from 'ui-kit';
import { Container, pricesHiddenFor, ProductCard, QuickAdd, sectionColours } from 'ui-kit';

// A row or two of the store's products under a centered title set over a hairline with a small diamond; each card sits
// on a cream mat with its name (heading face) and price centered under the photo, and a framed button to see more
// closes the section. The products come from the store (newest, best selling, a category, or a product page's
// up-sells or related products); nothing without products. Card choices are the theme's (site.theme_settings).
export const schema = {
  label: 'Featured products',
  fields: [
    { id: 'kicker', type: 'text', label: 'Small italic line above the title' },
    { id: 'heading', type: 'text', label: 'Title', default: 'Featured products' },
    { id: 'products', type: 'product_list', label: 'Products', max: 12, default: { from: 'all', sort: 'newest', limit: 4 } },
    { id: 'per_row', type: 'select', label: 'Cards per row', options: ['4', '3'], default: '4' },
    { id: 'more_label', type: 'text', label: 'Button label', default: 'See everything' },
    { id: 'more_link', type: 'url', label: 'Button link', default: '/products' },
    { id: 'surface', type: 'select', label: 'Ground', options: ['plain', 'parchment'], default: 'plain' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
} as const;

type Props = {
  t: Translate; site?: SiteInfo;
  kicker?: string; heading?: string; products?: ProductList | null; per_row?: string; more_label?: string; more_link?: string; surface?: string;
  background_colour?: string; text_colour?: string; accent_colour?: string;
};

export const styles = `
& .fp { padding-block: var(--uk-section-md); }
& .fp--parchment { background: var(--uk-color-muted-bg); }
& .fp-top { display: grid; justify-items: center; gap: 10px; margin-bottom: var(--uk-space-7); text-align: center; }
& .fp-kicker { margin: 0; font-style: italic; color: var(--uk-color-text-muted); }
& .fp-top h2 { margin: 0; font-family: var(--uk-font-heading); font-weight: 400; font-size: var(--uk-heading-lg); line-height: 1.2; color: var(--uk-color-heading); }
& .fp-rule { display: flex; align-items: center; gap: 14px; width: min(100%, 520px); color: var(--uk-color-highlight); }
& .fp-rule::before, & .fp-rule::after { content: ""; flex: 1; height: 1px; background: var(--uk-color-line-strong); }
& .fp-rule i { width: 7px; height: 7px; border: 1px solid currentColor; transform: rotate(45deg); }
& .fp-mat { padding: 12px 12px 18px; background: var(--uk-color-surface); border: 1px solid var(--uk-color-line); }
& .fp-mat:hover { border-color: var(--uk-color-line-strong); }
& .fp-mat h2, & .fp-mat h3 { font-family: var(--uk-font-heading); font-weight: 400; }
& .fp-add { margin-top: 12px; }
& .fp-more { margin: var(--uk-space-7) 0 0; text-align: center; }
@media (max-width: 560px) { & .fp-mat { padding: 6px 6px 12px; } }
`;

export default function FeaturedProducts(p: Props) {
  const { t } = p;
  const cards: ProductData[] = [];
  for (const x of p.products?.items ?? []) if (x && x.url) cards.push(x);
  if (cards.length === 0) return null;
  const n = p.per_row === '3' ? 3 : 4;
  const opts = p.site?.theme_settings ?? {};
  const gated = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: opts.apply_page });
  const words = { was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out'), sale: t('product.sale') };
  return (
    <section className={p.surface === 'parchment' ? 'fp fp--parchment' : 'fp'} style={{ ...sectionColours(p) }}>
      <Container>
        {p.heading || p.kicker ? (
          <div className="fp-top">
            {p.kicker ? <p className="fp-kicker">{p.kicker}</p> : null}
            {p.heading ? <h2>{p.heading}</h2> : null}
            <span className="fp-rule" aria-hidden="true"><i /></span>
          </div>
        ) : null}
        <ul className={`uk-grid uk-grid--${n} uk-grid--products`}>
          {cards.map((x) => (
            <li key={x.id} className="fp-mat">
              <ProductCard
                product={x} level={p.heading ? 3 : 2} columns={n} labels={words} pricesHidden={gated}
                swap={opts.cards_hover_photo !== false} badges={opts.cards_badges !== false} swatches={opts.cards_color_dots === false ? 0 : 5}
              />
              {opts.cards_add_button === true ? <div className="fp-add"><QuickAdd product={x} full pricesHidden={gated} labels={{ add: t('product.quick_add'), choose: t('product.choose') }} /></div> : null}
            </li>
          ))}
        </ul>
        {p.more_label && p.more_link ? <p className="fp-more"><a className="uk-button uk-button--secondary" href={p.more_link}>{p.more_label}</a></p> : null}
      </Container>
    </section>
  );
}
