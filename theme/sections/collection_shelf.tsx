import type { CollectionData } from 'ui-kit';
import { Container, Icon, Image, sectionColours } from 'ui-kit';

// The store's categories as framed pictures on a shelf: each category's own image in an arch-topped (or square)
// frame with its name under it in the heading face. The categories come from the store (its top categories, or the
// merchant's picks); one without an image shows a plain tile with a bag. Nothing without categories.
export const schema = {
  label: 'Category shelf',
  fields: [
    { id: 'heading', type: 'text', label: 'Title', default: 'Shop by category' },
    { id: 'intro', type: 'textarea', label: 'Line under the title' },
    { id: 'collections', type: 'collection_list', label: 'Categories', max: 8, default: { from: 'top', limit: 4 } },
    { id: 'more_label', type: 'text', label: 'Link label', default: 'All categories' },
    { id: 'more_link', type: 'url', label: 'Link', default: '/categories' },
    { id: 'frame', type: 'select', label: 'Frame', options: ['arch', 'square'], default: 'arch' },
    { id: 'surface', type: 'select', label: 'Ground', options: ['parchment', 'plain'], default: 'parchment' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
} as const;

type Props = {
  heading?: string; intro?: string; collections?: CollectionData[] | null; more_label?: string; more_link?: string; frame?: string; surface?: string;
  background_colour?: string; text_colour?: string; accent_colour?: string;
};

export const styles = `
& .cs { padding-block: var(--uk-section-md); }
& .cs--parchment { background: var(--uk-color-muted-bg); }
& .cs-top { max-width: 640px; margin: 0 auto var(--uk-space-7); text-align: center; }
& .cs-top h2 { margin: 0; font-family: var(--uk-font-heading); font-weight: 400; font-size: var(--uk-heading-lg); line-height: 1.2; color: var(--uk-color-heading); }
& .cs-top p { margin: var(--uk-space-3) 0 0; color: var(--uk-color-text-muted); }
& .cs-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 190px), 250px)); justify-content: center; gap: clamp(16px, 3vw, 40px); margin: 0; padding: 0; list-style: none; }
& .cs-list a { display: grid; gap: 14px; justify-items: center; text-align: center; color: inherit; text-decoration: none; }
& .cs-mat { width: 100%; padding: 8px; background: var(--uk-color-surface); border: 1px solid var(--uk-color-line-strong); }
& .cs-arch .cs-mat, & .cs-arch .uk-media { border-radius: 999px 999px 0 0; }
& .cs-name { font-family: var(--uk-font-heading); font-size: var(--uk-heading-sm); line-height: 1.25; color: var(--uk-color-heading); }
& .cs-list a:hover .cs-name { text-decoration: underline; text-underline-offset: 5px; text-decoration-thickness: 1px; }
& .cs-more { margin: var(--uk-space-7) 0 0; text-align: center; }
@media (max-width: 560px) { & .cs-list { grid-template-columns: repeat(2, minmax(0, 1fr)); } & .cs-mat { padding: 5px; } }
`;

export default function CollectionShelf(p: Props) {
  const shelf: CollectionData[] = [];
  for (const c of Array.isArray(p.collections) ? p.collections : []) if (c && c.url) shelf.push(c);
  if (shelf.length === 0) return null;
  return (
    <section className={p.surface === 'plain' ? 'cs' : 'cs cs--parchment'} style={{ ...sectionColours(p) }}>
      <Container>
        {p.heading || p.intro ? (
          <div className="cs-top">
            {p.heading ? <h2>{p.heading}</h2> : null}
            {p.intro ? <p>{p.intro}</p> : null}
          </div>
        ) : null}
        <ul className={p.frame === 'square' ? 'cs-list' : 'cs-list cs-arch'}>
          {shelf.map((c) => (
            <li key={c.id || c.url}>
              <a href={c.url}>
                <span className="cs-mat">
                  <span className="uk-media" style={{ aspectRatio: '3 / 4' }}>
                    {c.image ? <Image image={c.image} alt="" sizes="(max-width: 560px) calc(50vw - 40px), 250px" /> : <span style={{ display: 'inline-grid', color: 'var(--uk-color-text-subtle)' }}><Icon name="bag" size={40} /></span>}
                  </span>
                </span>
                <span className="cs-name">{c.name}</span>
              </a>
            </li>
          ))}
        </ul>
        {p.more_label && p.more_link ? <p className="cs-more"><a className="uk-link" href={p.more_link}>{p.more_label}</a></p> : null}
      </Container>
    </section>
  );
}
