import type { IconName } from 'ui-kit';
import { Container, Icon, sectionColours } from 'ui-kit';

// A band in the theme's deep accent color (or parchment) holding up to four short notes from the shop side by side,
// divided by thin rules: an icon, a line in the heading face and a smaller italic line, each optionally a link. The
// merchant's own words; put no promise here the store doesn't keep. Nothing without a note.
export const schema = {
  label: 'Shop promises',
  fields: [
    {
      id: 'promises', type: 'list', label: 'Promises', max: 4,
      item: [
        { id: 'symbol', type: 'select', label: 'Icon', options: ['check', 'truck', 'return', 'shield', 'leaf', 'clock'], default: 'check' },
        { id: 'headline', type: 'text', label: 'Headline' },
        { id: 'detail', type: 'text', label: 'Detail' },
        { id: 'link', type: 'url', label: 'Link' },
      ],
      default: [],
    },
    { id: 'band', type: 'select', label: 'Band', options: ['deep', 'parchment'], default: 'deep' },
    { id: 'background_colour', type: 'color', label: 'Background color' },
    { id: 'text_colour', type: 'color', label: 'Text color' },
  ],
} as const;

type Note = { symbol?: IconName; headline?: string; detail?: string; link?: string };
type Props = { promises?: Note[]; band?: string; background_colour?: string; text_colour?: string };

export const styles = `
& .pb { padding-block: var(--uk-space-7); }
& .pb--deep { background: var(--uk-color-accent-strong); color: var(--uk-color-on-accent); --pb-line: var(--uk-color-on-accent-muted); --pb-soft: var(--uk-color-on-accent-muted); }
& .pb--parchment { background: var(--uk-color-muted-bg); color: var(--uk-color-ink); --pb-line: var(--uk-color-line-strong); --pb-soft: var(--uk-color-text-muted); }
& .pb ul { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); margin: 0; padding: 0; list-style: none; }
& .pb li, & .pb li > a { display: grid; justify-items: center; gap: 8px; text-align: center; }
& .pb li { padding: 8px clamp(16px, 3vw, 36px); }
& .pb li + li { border-left: 1px solid var(--pb-line); }
& .pb li > a { color: inherit; text-decoration: none; }
& .pb li > a:hover strong { text-decoration: underline; text-underline-offset: 4px; }
& .pb-icon { display: inline-grid; color: var(--pb-soft); }
& .pb strong { display: block; font-family: var(--uk-font-heading); font-weight: 400; font-size: var(--uk-heading-sm); line-height: 1.3; }
& .pb small { display: block; font-size: var(--uk-text-sm); font-style: italic; color: var(--pb-soft); }
@media (max-width: 760px) { & .pb li + li { border-left: 0; border-top: 1px solid var(--pb-line); padding-top: 20px; margin-top: 12px; } }
`;

export default function PromiseBand(p: Props) {
  const notes = (p.promises ?? []).filter((x) => x && (x.headline || x.detail));
  if (notes.length === 0) return null;
  const deep = p.band !== 'parchment';
  return (
    <section className={deep ? 'pb pb--deep uk-tone--accent' : 'pb pb--parchment'} style={{ ...sectionColours(p, deep ? 'accent' : 'page') }}>
      <Container>
        <ul>
          {notes.map((x, n) => {
            const inner = [
              <span key="i" className="pb-icon" aria-hidden="true"><Icon name={x.symbol ?? 'check'} size={22} /></span>,
              x.headline ? <strong key="h">{x.headline}</strong> : null,
              x.detail ? <small key="d">{x.detail}</small> : null,
            ];
            return <li key={n}>{x.link ? <a href={x.link}>{inner}</a> : inner}</li>;
          })}
        </ul>
      </Container>
    </section>
  );
}
