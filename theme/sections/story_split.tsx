import { Container, Image, sectionColours } from 'ui-kit';

// A note from the shop, set like a letter: an italic opening line, a heading, paragraphs with a large first letter,
// a sign-off after a brass dash and a link to read more, beside a framed photo or, without one, centered on a cream
// sheet. Everything here is the merchant's; nothing without words. On a phone the photo comes first.
export const schema = {
  label: 'Shop note',
  fields: [
    { id: 'opening', type: 'text', label: 'Opening line (in italics)' },
    { id: 'heading', type: 'text', label: 'Heading' },
    { id: 'letter', type: 'textarea', label: 'Letter (a blank line starts a new paragraph)' },
    { id: 'sign_off', type: 'text', label: 'Sign-off' },
    { id: 'more_label', type: 'text', label: 'Link label' },
    { id: 'more_link', type: 'url', label: 'Link' },
    { id: 'picture', type: 'image', label: 'Photo' },
    { id: 'picture_side', type: 'select', label: 'Photo side', options: ['left', 'right'], default: 'left' },
    { id: 'initial', type: 'select', label: 'Large first letter', options: ['on', 'off'], default: 'on' },
    { id: 'surface', type: 'select', label: 'Ground', options: ['plain', 'parchment'], default: 'plain' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
    { id: 'accent_colour', type: 'color', label: 'Accent color' },
  ],
} as const;

type Props = {
  opening?: string; heading?: string; letter?: string; sign_off?: string; more_label?: string; more_link?: string;
  picture?: { url: string; alt?: string; width?: number; height?: number }; picture_side?: string; initial?: string; surface?: string;
  background_colour?: string; text_colour?: string; accent_colour?: string;
};

export const styles = `
& .sn { padding-block: var(--uk-section-md); }
& .sn--parchment { background: var(--uk-color-muted-bg); }
& .sn-row { display: grid; gap: 32px; align-items: center; }
& .sn-photo { padding: 10px; background: var(--uk-color-surface); border: 1px solid var(--uk-color-line-strong); }
& .sn-letter { display: grid; gap: var(--uk-space-4); max-width: 560px; }
& .sn-sheet { max-width: 720px; margin: 0 auto; padding: clamp(28px, 5vw, 64px); background: var(--uk-color-surface); border: 1px solid var(--uk-color-line); }
& .sn-open { margin: 0; font-style: italic; color: var(--uk-color-text-muted); }
& .sn-letter h2 { margin: 0; font-family: var(--uk-font-heading); font-weight: 400; font-size: var(--uk-heading-lg); line-height: 1.2; color: var(--uk-color-heading); text-wrap: balance; }
& .sn-body { display: grid; gap: var(--uk-space-3); }
& .sn-body p { margin: 0; font-size: var(--uk-text-lg); line-height: 1.75; color: var(--uk-color-text-muted); }
& .sn-cap > p:first-child::first-letter { float: left; margin: 5px 10px 0 0; font-family: var(--uk-font-heading); font-size: 3.1em; line-height: .82; color: var(--uk-color-accent-text, var(--uk-color-accent)); }
& .sn-sign { display: flex; align-items: center; gap: 12px; margin: var(--uk-space-2) 0 0; font-family: var(--uk-font-heading); font-style: italic; font-size: var(--uk-heading-sm); color: var(--uk-color-heading); }
& .sn-sign::before { content: ""; width: 32px; height: 1px; background: var(--uk-color-highlight); }
@media (min-width: 901px) {
  & .sn-row { grid-template-columns: .9fr 1fr; gap: clamp(48px, 6vw, 88px); }
  & .sn-row--end { grid-template-columns: 1fr .9fr; }
  & .sn-row--end .sn-photo { order: 2; }
}
`;

export default function StorySplit(p: Props) {
  const body = (p.letter ?? '').split('\n\n').map((s) => s.trim()).filter((s) => s !== '');
  if (!p.heading && body.length === 0) return null;
  const photo = p.picture && p.picture.url ? p.picture : null;
  const letter = (
    <div className={photo ? 'sn-letter' : 'sn-letter sn-sheet'}>
      {p.opening ? <p className="sn-open">{p.opening}</p> : null}
      {p.heading ? <h2>{p.heading}</h2> : null}
      {body.length > 0 ? <div className={p.initial === 'off' ? 'sn-body' : 'sn-body sn-cap'}>{body.map((s, n) => <p key={n}>{s}</p>)}</div> : null}
      {p.sign_off ? <p className="sn-sign">{p.sign_off}</p> : null}
      {p.more_label && p.more_link ? <p style={{ margin: 0 }}><a className="uk-link" href={p.more_link}>{p.more_label}</a></p> : null}
    </div>
  );
  return (
    <section className={p.surface === 'parchment' ? 'sn sn--parchment' : 'sn'} style={{ ...sectionColours(p) }}>
      <Container>
        {photo ? (
          <div className={p.picture_side === 'right' ? 'sn-row sn-row--end' : 'sn-row'}>
            <div className="sn-photo">
              <div className="uk-media" style={{ aspectRatio: '1 / 1' }}>
                <Image image={{ ...photo, alt: photo.alt ?? '' }} alt={photo.alt ?? ''} sizes="(max-width: 900px) calc(100vw - 70px), 520px" />
              </div>
            </div>
            {letter}
          </div>
        ) : letter}
      </Container>
    </section>
  );
}
