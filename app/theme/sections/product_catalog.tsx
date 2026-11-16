import { useId } from 'react';
import type { CollectionData, ProductList, SiteInfo, Translate } from 'ui-kit';
import { ActiveFilters, Container, FilterForm, Icon, Pagination, pricesHiddenFor, ProductCard, QuickAdd, SortSelect } from 'ui-kit';

// A category's products with a sidebar, like a shop's printed catalog: on wide screens a column on the left lists the
// category's subcategories (Browse) and its filters (Refine, always open, with the chosen ones' removal links); the
// products fill three columns beside it under a hairline bar with the count and sort. On phones and tablets the
// sidebar folds into a closed Filter disclosure above the products, with the chosen filters' removal links under it,
// so a filtered page still opens at its products. All plain forms and links (no script), opening at the list (its
// id, from useId). Everything comes from the store; with no products at all, only the store's no-products words.
export const schema = {
  label: 'Category products',
  fields: [
    { id: 'collection', type: 'collection', label: 'Category (for its subcategory links)', default: 'current' },
    { id: 'products', type: 'product_list', label: 'Products', max: 36, filters: true, default: { from: 'collection', collection: 'current', limit: 24 } },
    { id: 'sidebar', type: 'select', label: 'Sidebar', options: ['left', 'hide'], default: 'left' },
    { id: 'show_count', type: 'select', label: 'Product count', options: ['show', 'hide'], default: 'show' },
    { id: 'show_sort', type: 'select', label: 'Sort', options: ['show', 'hide'], default: 'show' },
    { id: 'show_filters', type: 'select', label: 'Filters', options: ['show', 'hide'], default: 'show' },
  ],
} as const;

type Props = {
  t: Translate; site?: SiteInfo; collection?: CollectionData | null; products?: ProductList | null;
  sidebar?: string; show_count?: string; show_sort?: string; show_filters?: string;
};

export const styles = `
& .pc-layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--uk-space-7); }
& .pc-side { display: none; }
& .pc-side h2 { margin: 0 0 var(--uk-space-3); padding-bottom: 10px; border-bottom: 1px solid var(--uk-color-line-strong); font-family: var(--uk-font-heading); font-weight: 400; font-size: var(--uk-text-md); letter-spacing: .14em; text-transform: uppercase; color: var(--uk-color-heading); }
& .pc-side ul.pc-links { display: grid; gap: 10px; margin: 0 0 var(--uk-space-7); padding: 0; list-style: none; }
& .pc-side ul.pc-links a { color: var(--uk-color-ink); text-decoration: none; }
& .pc-side ul.pc-links a:hover { text-decoration: underline; text-underline-offset: 4px; }
& .pc-bar { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px; padding-bottom: var(--uk-space-4); border-bottom: 1px solid var(--uk-color-line-strong); }
& .pc-card { padding: 10px 10px 16px; background: var(--uk-color-surface); border: 1px solid var(--uk-color-line); }
& .pc-card h2, & .pc-card h3 { font-family: var(--uk-font-heading); font-weight: 400; }
@media (min-width: 901px) {
  & .pc-layout--side { grid-template-columns: 220px minmax(0, 1fr); gap: clamp(32px, 4vw, 56px); }
  & .pc-layout--side .pc-side { display: block; position: sticky; top: calc(var(--uk-header-sticky, 0px) + 24px); align-self: start; }
  & .pc-layout--side .pc-fold { display: none; }
}
@media (max-width: 560px) { & .pc-card { padding: 5px 5px 10px; } }
`;

export default function ProductCatalog(p: Props) {
  const { t } = p;
  const anchor = useId();
  const list = p.products && typeof p.products === 'object' ? p.products : null;
  const items = Array.isArray(list?.items) ? list.items.filter((x) => x && x.url) : [];
  const main = !!list && Array.isArray(list.sort_options) && list.sort_options.length > 0;
  const chosen = main && Array.isArray(list.active_filters) ? list.active_filters.length : 0;
  const none = !items.length && !chosen;
  if (none && (!main || !t('collection.empty'))) return null;
  const c = p.collection && typeof p.collection === 'object' ? p.collection : null;
  const kids = c && Array.isArray(c.children) ? c.children : [];
  const filters = main && !none && p.show_filters !== 'hide' && (list.filters.length > 0 || chosen > 0);
  const labels = { apply: t('common.apply'), min: t('filter.min'), max: t('filter.max'), count: t('filter.count_word'), remove: t('filter.remove') };
  const side = p.sidebar !== 'hide' && (filters || kids.length > 0);
  const ts = p.site?.theme_settings ?? {};
  const hidden = pricesHiddenFor(p.site, t('product.sign_in_prices'), { label: t('product.prices_pending'), href: ts.apply_page });
  const countText = main && p.show_count !== 'hide' ? t('collection.count', { count: list.total }) : '';
  return (
    <section id={main ? anchor : undefined} style={{ padding: 'var(--uk-space-5) 0 var(--uk-section-md)' }}>
      <Container>
        {none ? <p style={{ margin: 0, textAlign: 'center', fontStyle: 'italic', fontSize: 'var(--uk-text-lg)', color: 'var(--uk-color-text-muted)' }}>{t('collection.empty')}</p> : (
          <div className={side ? 'pc-layout pc-layout--side' : 'pc-layout'}>
            {side ? (
              <aside className="pc-side">
                {kids.length && t('catalog.browse') ? (
                  <nav aria-label={t('catalog.browse')}>
                    <h2>{t('catalog.browse')}</h2>
                    <ul className="pc-links">{kids.map((k) => <li key={k.slug}><a href={k.url}>{k.name}</a></li>)}</ul>
                  </nav>
                ) : null}
                {filters ? (
                  <div>
                    {t('catalog.refine') ? <h2>{t('catalog.refine')}</h2> : null}
                    <FilterForm list={list} labels={labels} anchor={anchor} />
                  </div>
                ) : null}
              </aside>
            ) : null}
            <div>
              {main ? (
                <div className="pc-bar">
                  {countText ? <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--uk-color-text-muted)' }}>{countText}</p> : <span />}
                  {p.show_sort !== 'hide' ? (
                    <SortSelect
                      list={list}
                      anchor={anchor}
                      labels={{
                        label: t('sort.label'), apply: t('common.apply'), featured: t('sort.featured'), best_selling: t('sort.best_selling'), newest: t('sort.newest'),
                        price_asc: t('sort.price_low'), price_desc: t('sort.price_high'), name: t('sort.name'),
                      }}
                    />
                  ) : null}
                </div>
              ) : null}
              {filters && t('filter.button') ? (
                <div className={side ? 'pc-fold' : undefined}>
                  <details className="uk-disclosure">
                    <summary>
                      {chosen ? `${t('filter.button')} (${chosen})` : t('filter.button')}
                      <Icon name="chevron" size={18} />
                    </summary>
                    <div style={{ maxWidth: 560 }}><FilterForm list={list} labels={labels} anchor={anchor} active={false} /></div>
                  </details>
                  <ActiveFilters list={list} labels={{ remove: labels.remove }} anchor={anchor} />
                </div>
              ) : null}
              {items.length ? (
                <ul className="uk-grid uk-grid--3 uk-grid--products" style={{ marginTop: 'var(--uk-space-6)' }}>
                  {items.map((x, i) => (
                    <li key={x.id} className="pc-card">
                        <ProductCard product={x} columns={3} sizes="(max-width: 560px) calc(50vw - 42px), (max-width: 900px) calc(50vw - 58px), 270px" priority={i < 3} pricesHidden={hidden} swap={ts.cards_hover_photo !== false} badges={ts.cards_badges !== false} swatches={ts.cards_color_dots === false ? 0 : 5} labels={{ was: t('product.was'), now: t('product.now'), sold_out: t('product.sold_out'), sale: t('product.sale') }} />
                        {ts.cards_add_button === true ? <div style={{ marginTop: 12 }}><QuickAdd product={x} full pricesHidden={hidden} labels={{ add: t('product.quick_add'), choose: t('product.choose') }} /></div> : null}
                    </li>
                  ))}
                </ul>
              ) : t('filter.empty') ? (
                <p style={{ margin: 'var(--uk-space-7) 0 0', fontStyle: 'italic', color: 'var(--uk-color-text-muted)' }}>{t('filter.empty')}</p>
              ) : null}
              {main && list.pages > 1 && (list.prev_url || list.next_url) ? (
                <div style={{ marginTop: 'var(--uk-space-7)' }}>
                  <Pagination list={list} prev={t('pagination.previous')} next={t('pagination.next')} label={t('pagination.label')} page={t('pagination.page')} of={t('pagination.of')} anchor={anchor} />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
