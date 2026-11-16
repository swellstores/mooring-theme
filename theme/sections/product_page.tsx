import type { ReactElement } from 'react';
import type { ProductData, ProductList, SiteInfo, Translate } from 'ui-kit';
import { Breadcrumbs, Container, Icon, Image, pricesHiddenFor, ProductForm, RichText, SellList } from 'ui-kit';

// The product page, set like a well-made catalog entry. Left: the selected variant's photo (else the product's first)
// on a framed mat, marked for the platform script, which swaps it for the chosen variant's, with the other photos as
// small framed thumbnails in a column beside it (under it on phones). Right, on a cream card: the trail, the name in
// the heading face, the rating (only with a reviews app's), a brass hairline, the add-to-cart form (price, options,
// stock, purchase options, quantity), the merchant's text blocks, the product's up-sells, then folds for the
// description, the bundle's items and the attributes, and the merchant's notes for every product. Everything about the
// product comes from the store; fixed words from Store text. Nothing without a product but the merchant's text blocks.
// Only the page's own product (its address is the page's) has the page's h1 and the primary form.
export const schema = {
  label: 'Product page',
  fields: [
    { id: 'product', type: 'product', label: 'Product', default: 'current' },
    { id: 'pairs', type: 'product_list', label: 'Pairs with (the product\'s up-sells)', max: 4, default: { from: 'up_sells', limit: 3 } },
    { id: 'story_fold', type: 'select', label: 'Product description', options: ['full', 'fold'], default: 'full' },
    { id: 'show_attributes', type: 'select', label: 'Product attributes', options: ['show', 'hide'], default: 'show' },
    {
      id: 'shop_folds', type: 'list', label: 'Folds on every product (product facts belong in its description)', max: 4,
      item: [
        { id: 'label', type: 'text', label: 'Fold title' },
        { id: 'words', type: 'textarea', label: 'Fold text' },
      ],
      default: [],
    },
  ],
  blocks: { types: ['text'], max: 4 },
} as const;

type Props = {
  blocks?: ReactElement[]; t: Translate; site?: SiteInfo;
  product?: ProductData | null; pairs?: ProductList | null; story_fold?: string; show_attributes?: string; shop_folds?: { label?: string; words?: string }[];
};

export const styles = `
& .pp-gallery { display: grid; grid-template-columns: 76px minmax(0, 1fr); gap: 16px; align-items: start; }
& .pp-gallery--one { grid-template-columns: minmax(0, 1fr); }
& .pp-thumbs { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
& .pp-thumbs a { display: block; padding: 3px; border: 1px solid var(--uk-color-line); background: var(--uk-color-surface); }
& .pp-thumbs a[aria-current] { border-color: var(--uk-color-accent); }
& .pp-mat { padding: clamp(8px, 1.4vw, 16px); background: var(--uk-color-surface); border: 1px solid var(--uk-color-line-strong); }
& .pp-card { display: grid; gap: var(--uk-space-5); padding: clamp(20px, 3vw, 40px); background: var(--uk-color-surface); border: 1px solid var(--uk-color-line); }
& .pp-name { margin: 0; font-family: var(--uk-font-heading); font-weight: 400; font-size: var(--uk-heading-lg); line-height: 1.18; color: var(--uk-color-heading); text-wrap: balance; }
& .pp-rule { display: block; width: 56px; height: 2px; background: var(--uk-color-highlight); }
& .pp-folds summary { font-family: var(--uk-font-heading); font-weight: 400; letter-spacing: .04em; color: var(--uk-color-heading); }
& .pp-folds { border-top: 1px solid var(--uk-color-line); }
& .pp-sub { margin: 0 0 var(--uk-space-3); font-family: var(--uk-font-heading); font-weight: 400; font-size: var(--uk-text-md); color: var(--uk-color-heading); }
@media (max-width: 900px) { & .pp-gallery { grid-template-columns: minmax(0, 1fr); } & .pp-gallery > .pp-mat { order: -1; } & .pp-thumbs { grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); } }
@media (min-width: 901px) { & .pp-sticky { position: sticky; top: calc(var(--uk-header-sticky, 0px) + 24px); } }
`;

export default function ProductPage(p: Props) {
  const { t } = p;
  const item = p.product && typeof p.product === 'object' ? p.product : null;
  if (!item) return <>{p.blocks}</>;
  const own = p.site?.page.kind === 'product' && item.url === p.site.page.path;
  const main = item.selected?.image ?? item.image;
  const photos = Array.isArray(item.images) ? item.images : [];
  const attributes = p.show_attributes === 'hide' ? [] : item.attributes.filter((a) => a.values.length);
  const folds = (p.shop_folds ?? []).filter((f) => f && (f.label || f.words));
  const rating = item.rating && t('product.rating') ? item.rating : null;
  const ts = p.site?.theme_settings ?? {};
  const hidden = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: ts.apply_page });
  const labels = {
    add: t('product.add_to_cart'), sold_out: t('product.sold_out'), unavailable: t('product.unavailable'), preorder: t('product.preorder'), backorder: t('product.backorder'),
    was: t('product.was'), now: t('product.now'), quantity: ts.buy_quantity === false ? '' : t('common.quantity'), purchase: t('product.purchase_options'), one_time: t('product.one_time'),
    subscribe: t('product.subscribe'), trial: t('product.trial'), save: (percent: number) => t('product.save', { percent }),
    delivered: (every: string) => t('product.delivered', { every }), billed: (every: string) => t('product.billed', { every }),
    payments: (count: number) => t('product.payments', { count }), trial_then: (days: string, price: string) => t('product.trial_then', { days, price }),
    promise: t('product.promise'),
  };
  const folded = p.story_fold === 'fold';
  const description = item.description.length ? <div style={{ color: 'var(--uk-color-text-muted)' }}><RichText value={item.description} /></div> : null;
  return (
    <section style={{ padding: 'var(--uk-space-6) 0 var(--uk-section-md)' }}>
      <Container>
        <div className="uk-split" style={{ gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'start' }}>
          <div className="pp-sticky">
            <div className={photos.length > 1 ? 'pp-gallery' : 'pp-gallery pp-gallery--one'}>
              {photos.length > 1 ? (
                <ul className="pp-thumbs">
                  {photos.map((ph, i) => (
                    <li key={i}>
                      <a href={ph.url} data-site-photo="" aria-current={ph.url === main?.url ? 'true' : undefined}>
                        <span className="uk-media" style={{ aspectRatio: '1 / 1' }}>
                          <Image image={ph} alt={ph.alt && ph.alt !== item.name ? ph.alt : t('product.photo', { number: i + 1 }) || `${item.name} ${i + 1}`} sizes="96px" />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="pp-mat">
                <div className="uk-media" style={{ aspectRatio: '1 / 1' }}>
                  {main ? (
                    <Image image={main} sizes="(max-width: 900px) calc(100vw - 72px), 520px" priority variantImage />
                  ) : (
                    <span style={{ display: 'inline-grid', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={72} /></span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="pp-card">
            <div style={{ display: 'grid', gap: 'var(--uk-space-3)' }}>
              <Breadcrumbs items={[t('navigation.home') ? { name: t('navigation.home'), url: '/' } : null, item.category, { name: item.name, url: item.url }]} label={t('navigation.breadcrumb')} />
              {own ? <h1 className="pp-name">{item.name}</h1> : <h2 className="pp-name">{item.name}</h2>}
              {rating ? (
                <p style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0, fontSize: 'var(--uk-text-sm)', color: 'var(--uk-color-text-muted)' }}>
                  <span aria-hidden="true" style={{ display: 'inline-flex', gap: 2, color: 'var(--uk-color-highlight)' }}>
                    {Array.from({ length: Math.round(Math.min(5, Math.max(0, rating.average))) }, (_, i) => <Icon key={i} name="star" size={16} />)}
                  </span>
                  {t('product.rating', { average: String(Math.round(rating.average * 10) / 10), count: String(rating.count) })}
                </p>
              ) : null}
              <span className="pp-rule" aria-hidden="true" />
            </div>
            <ProductForm product={item} labels={labels} primary={own} locale={p.site?.locale} pricesHidden={hidden} />
            {p.blocks}
            {p.pairs?.items?.length ? (
              <div>
                {t('product.pairs_with') ? <h2 className="pp-sub">{t('product.pairs_with')}</h2> : null}
                <SellList list={p.pairs} pricesHidden={hidden} labels={{ add: t('product.quick_add'), choose: t('product.choose'), was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out') }} />
              </div>
            ) : null}
            {description && !folded ? description : null}
            {(description && folded) || item.bundle.length || attributes.length || folds.length ? (
              <div className="pp-folds">
                {description && folded ? (
                  <details className="uk-disclosure" open>
                    <summary>{t('product_page.description')}<Icon name="chevron" size={18} /></summary>
                    {description}
                  </details>
                ) : null}
                {item.bundle.length && t('product.bundle') ? (
                  <details className="uk-disclosure" open>
                    <summary>{t('product.bundle')}<Icon name="chevron" size={18} /></summary>
                    <ul style={{ display: 'grid', gap: 6, padding: 0, listStyle: 'none' }}>
                      {item.bundle.map((b, i) => <li key={i}>{`${b.quantity} × `}{b.url ? <a href={b.url} style={{ color: 'inherit', textUnderlineOffset: 3 }}>{b.name}</a> : b.name}</li>)}
                    </ul>
                  </details>
                ) : null}
                {attributes.length ? (
                  <details className="uk-disclosure">
                    <summary>{t('product_page.details')}<Icon name="chevron" size={18} /></summary>
                    <dl style={{ display: 'grid', gridTemplateColumns: 'max-content minmax(0, 1fr)', gap: '8px 20px' }}>
                      {attributes.map((a) => [
                        <dt key={`${a.id}-n`} style={{ fontStyle: 'italic' }}>{a.name}</dt>,
                        <dd key={`${a.id}-v`} style={{ margin: 0, color: 'var(--uk-color-ink)' }}>{a.values.join(', ')}</dd>,
                      ])}
                    </dl>
                  </details>
                ) : null}
                {folds.map((f, i) => (
                  <details key={i} className="uk-disclosure">
                    <summary>{f.label}<Icon name="chevron" size={18} /></summary>
                    <p style={{ whiteSpace: 'pre-line' }}>{f.words}</p>
                  </details>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
