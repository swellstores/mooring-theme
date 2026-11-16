import type { CollectionData } from 'ui-kit';
import { Button, Container, Image, sectionColours } from 'ui-kit';

// The home page's opening: the merchant's words on one side, set large in the heading face, and a photo in a picture
// frame on the other (a cream mat, a hairline inner rule and two brass corner lines). The photo is the merchant's
// upload, else the image of the first category its list gives (the store's top category by default), so a new store
// opens on its own photo. A short italic line can sit under the buttons. On a phone the photo comes first (it is
// first in the page's order; wider, CSS order moves it to its side). Nothing without a heading or a photo.
export const schema = {
  label: 'Framed hero',
  fields: [
    { id: 'kicker', type: 'text', label: 'Small line above the heading' },
    { id: 'heading', type: 'textarea', label: 'Heading (*words between asterisks* in italics)' },
    { id: 'text', type: 'textarea', label: 'Text' },
    { id: 'cta_label', type: 'text', label: 'Button label' },
    { id: 'cta_href', type: 'url', label: 'Button link', default: '/products' },
    { id: 'more_label', type: 'text', label: 'Second link label' },
    { id: 'more_link', type: 'url', label: 'Second link' },
    { id: 'aside', type: 'text', label: 'Line under the buttons (in italics)' },
    { id: 'picture', type: 'image', label: 'Photo (empty: the category\'s image)' },
    { id: 'picture_from', type: 'collection_list', label: 'Category for the photo (the first listed)', max: 1, default: { from: 'top', limit: 1 } },
    { id: 'picture_side', type: 'select', label: 'Photo side', options: ['right', 'left'], default: 'right' },
    { id: 'surface', type: 'select', label: 'Ground', options: ['plain', 'parchment'], default: 'plain' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
} as const;

type Pic = { url: string; alt?: string; width?: number; height?: number };
type Props = {
  kicker?: string; heading?: string; text?: string; cta_label?: string; cta_href?: string; more_label?: string; more_link?: string; aside?: string;
  picture?: Pic; picture_from?: CollectionData[] | null; picture_side?: string; surface?: string;
  background_colour?: string; text_colour?: string; accent_colour?: string;
};

export const styles = `
& .fh { padding-block: clamp(32px, 6vw, 88px); }
& .fh--parchment { background: var(--uk-color-muted-bg); }
& .fh-row { display: grid; gap: 36px; align-items: center; }
& .fh-pic { padding: 9px; }
& .fh-frame { position: relative; padding: clamp(10px, 1.6vw, 18px); background: var(--uk-color-surface); border: 1px solid var(--uk-color-line-strong); }
& .fh-frame::after { content: ""; position: absolute; inset: clamp(4px, .7vw, 8px); border: 1px solid var(--uk-color-line); pointer-events: none; }
& .fh-corner { position: absolute; width: 40px; height: 40px; border: 0 solid var(--uk-color-highlight); pointer-events: none; }
& .fh-corner--top { top: -9px; left: -9px; border-top-width: 2px; border-left-width: 2px; }
& .fh-corner--end { bottom: -9px; right: -9px; border-bottom-width: 2px; border-right-width: 2px; }
& .fh-words { display: grid; gap: var(--uk-space-5); max-width: 560px; }
& .fh-kicker { display: flex; align-items: center; gap: 12px; margin: 0; font-family: var(--uk-font-accent, var(--uk-font-heading)); font-size: var(--uk-text-xs); letter-spacing: .2em; text-transform: uppercase; color: var(--uk-color-text-muted); }
& .fh-kicker::before, & .fh-kicker::after { content: ""; width: 44px; height: 1px; background: var(--uk-color-highlight); }
& h1 { margin: 0; font-family: var(--uk-font-heading); font-weight: 400; font-size: clamp(34px, 4.6vw, 60px); line-height: 1.12; letter-spacing: -.01em; color: var(--uk-color-heading); text-wrap: balance; }
& h1 em { color: var(--uk-color-accent-text, var(--uk-color-accent)); }
& .fh-text { margin: 0; font-size: var(--uk-text-lg); line-height: 1.7; color: var(--uk-color-text-muted); }
& .fh-actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--uk-space-4) var(--uk-space-5); margin-top: var(--uk-space-2); }
& .fh-aside { margin: 0; font-style: italic; font-size: var(--uk-text-sm); color: var(--uk-color-text-muted); }
@media (min-width: 901px) {
  & .fh-row { grid-template-columns: 1.05fr 1fr; gap: clamp(48px, 6vw, 96px); }
  & .fh-row--end { grid-template-columns: 1fr 1.05fr; }
  & .fh-row--end .fh-pic { order: 2; }
  & .fh-corner { width: 56px; height: 56px; }
}
`;

// One line of the heading, with *starred words* in italics.
const marked = (line: string) => line.split('*').map((bit, n) => (n % 2 === 1 ? <em key={n}>{bit}</em> : bit));

export default function FramedHero(p: Props) {
  let photo: Pic | null = p.picture && p.picture.url ? p.picture : null;
  if (!photo && Array.isArray(p.picture_from)) {
    for (const c of p.picture_from) if (!photo && c && c.image) photo = c.image;
  }
  const heading = (p.heading ?? '').trim();
  if (heading === '' && photo === null) return null;
  const text = (p.text ?? '').trim();
  const words = (
    <div className="fh-words">
      {p.kicker ? <p className="fh-kicker">{p.kicker}</p> : null}
      {heading ? <h1>{heading.split('\n').map((line, n) => <span key={n}>{n > 0 ? <br /> : null}{marked(line)}</span>)}</h1> : null}
      {text ? <p className="fh-text">{text}</p> : null}
      {p.cta_label || p.more_label ? (
        <div className="fh-actions">
          {p.cta_label ? <Button href={p.cta_href || '/products'}>{p.cta_label}</Button> : null}
          {p.more_label && p.more_link ? <a className="uk-link" href={p.more_link}>{p.more_label}</a> : null}
        </div>
      ) : null}
      {p.aside ? <p className="fh-aside">{p.aside}</p> : null}
    </div>
  );
  return (
    <section className={p.surface === 'parchment' ? 'fh fh--parchment' : 'fh'} style={{ ...sectionColours(p) }}>
      <Container>
        {photo ? (
          <div className={p.picture_side === 'left' ? 'fh-row' : 'fh-row fh-row--end'}>
            <div className="fh-pic">
              <div className="fh-frame">
                <span className="fh-corner fh-corner--top" aria-hidden="true" />
                <span className="fh-corner fh-corner--end" aria-hidden="true" />
                <div className="uk-media" style={{ aspectRatio: '4 / 5', maxHeight: '78vh' }}>
                  <Image image={{ ...photo, alt: photo.alt ?? '' }} alt={photo.alt ?? ''} sizes="(max-width: 900px) calc(100vw - 84px), 520px" priority />
                </div>
              </div>
            </div>
            {words}
          </div>
        ) : words}
      </Container>
    </section>
  );
}
