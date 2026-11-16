import type { CollectionData, Translate } from 'ui-kit';
import { Breadcrumbs, Container, Image } from 'ui-kit';

// A category page's title piece, centered like a book's title page: the trail (Home › its parent › it), the category's
// name between two hairlines with a small diamond, its description, and its subcategories as a line of text links
// divided by dots. With the category's image and the banner layout, the image runs as a wide framed strip above.
// Everything comes from the store's category (the page's own by default); without one, the heading and text set here,
// and nothing when they are empty.
export const schema = {
  label: 'Category title',
  fields: [
    { id: 'collection', type: 'collection', label: 'Category', default: 'current' },
    { id: 'heading', type: 'text', label: 'Heading (when there is no category)' },
    { id: 'description', type: 'textarea', label: 'Text (when there is no category)' },
    { id: 'image', type: 'select', label: 'Category image', options: ['banner', 'hide'], default: 'banner' },
    { id: 'show_children', type: 'select', label: 'Subcategories', options: ['show', 'hide'], default: 'show' },
  ],
} as const;

type Props = { t: Translate; collection?: CollectionData | null; heading?: string; description?: string; image?: string; show_children?: string };

export const styles = `
& .ci-title { display: flex; align-items: center; justify-content: center; gap: clamp(14px, 3vw, 28px); margin: 0; }
& .ci-title::before, & .ci-title::after { content: ""; flex: 0 1 120px; height: 1px; background: var(--uk-color-line-strong); }
& h1 { margin: 0; font-family: var(--uk-font-heading); font-weight: 400; font-size: var(--uk-heading-xl); line-height: 1.15; color: var(--uk-color-heading); text-wrap: balance; }
& .ci-kids { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 0; margin: 0; padding: 0; list-style: none; }
& .ci-kids li + li::before { content: "·"; padding: 0 14px; color: var(--uk-color-highlight); }
& .ci-kids a { font-style: italic; color: var(--uk-color-ink); text-underline-offset: 4px; text-decoration-thickness: 1px; }
& .ci-strip { padding: 8px; margin-bottom: var(--uk-space-6); background: var(--uk-color-surface); border: 1px solid var(--uk-color-line-strong); }
& nav ol { justify-content: center; }
`;

export default function CollectionIntro({ t, collection, heading, description, image, show_children }: Props) {
  const c = collection && typeof collection === 'object' ? collection : null;
  const title = c ? c.name : heading;
  const text = c ? (Array.isArray(c.description) ? c.description.map((b) => b.text).filter(Boolean) : []) : description ? [description] : [];
  const photo = c && image !== 'hide' ? c.image : null;
  const kids = c && show_children !== 'hide' && Array.isArray(c.children) ? c.children : [];
  if (!title && !text.length) return null;
  return (
    <section style={{ padding: 'var(--uk-space-7) 0 var(--uk-space-6)' }}>
      <Container>
        {photo ? (
          <div className="ci-strip">
            <div className="uk-media" style={{ aspectRatio: '16 / 5' }}>
              <Image image={photo} sizes="(max-width: 900px) calc(100vw - 66px), 1088px" priority />
            </div>
          </div>
        ) : null}
        <div style={{ display: 'grid', justifyItems: 'center', gap: 'var(--uk-space-4)', maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          {c ? <Breadcrumbs items={[t('navigation.home') ? { name: t('navigation.home'), url: '/' } : null, c.parent, { name: c.name, url: c.url }]} label={t('navigation.breadcrumb')} /> : null}
          {title ? <div className="ci-title"><h1>{title}</h1></div> : null}
          {text.map((x, i) => <p key={i} style={{ margin: 0, maxWidth: '62ch', fontSize: 'var(--uk-text-lg)', color: 'var(--uk-color-text-muted)' }}>{x}</p>)}
          {kids.length ? (
            <nav aria-label={t('collection.subcategories') || undefined}>
              <ul className="ci-kids">{kids.map((k) => <li key={k.slug}><a href={k.url}>{k.name}</a></li>)}</ul>
            </nav>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
