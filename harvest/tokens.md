# Design tokens from the old site

What the Squarespace site actually used, next to what the Elevate Media invoice portal uses. The two are already out of sync, which is the first thing the rebuild has to settle.

## Typography

One typeface across the whole site: Poppins, self-hosted by Squarespace. No Google Fonts link tag, no Adobe Fonts. Weights 300, 400, 500, 600 and 700 are downloaded into `fonts/` as latin-subset woff2, about 7.8 KB each.

| Role | Family | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- |
| Headings | Poppins | 500 | 0.9em | 0 |
| Body | Poppins | 300 | 1.8em | 0 |
| Meta and nav | Poppins | 400 | 1.2em | 0 |

Base font size is 16px. Heading scale: H1 4rem, H2 2.8rem, H3 2.2rem, H4 1.2rem. Body sizes: large 1.4rem, normal 1rem, small 0.9rem.

The 0.9em heading line height is unusually tight, which is what gives the old hero its stacked look. Worth keeping as a reference point even if the typeface changes.

## Color

Five tokens on `:root`, authored as HSL. Hex conversions:

| Token | Hex | Where it is used |
| --- | --- | --- |
| accent | `#FF7C1A` | The Elevate orange. Buttons, links, headings on dark |
| black | `#000000` | Hero section background |
| white | `#FFFFFF` | Default page background |
| darkAccent | `#282828` | About section and client logo wall backgrounds |
| lightAccent | `#DAD9D9` | Declared but never used on a live page |

Form fields override the theme with a hardcoded fill of `#FAFAFA` and a black border.

Section themes map cleanly: hero is black, services and process and footer are white, about and the logo wall are `#282828`. So the page alternates light and dark six times top to bottom.

## The two oranges

The Elevate Media Invoice Portal at `darthkanaka/Elevate-Media-Invoices` uses a different orange and a different typeface:

| Token | Invoice portal | Website |
| --- | --- | --- |
| Primary | `#E86C00` | `#FF7C1A` |
| Primary hover | `#D45F00` | not defined |
| Primary tint | `#FFF3E8` | not defined |
| Dark surface | `#2d2d2d` | `#282828` |
| Typeface | Helvetica Neue | Poppins |

`#FF7C1A` is brighter and more saturated. `#E86C00` is deeper and reads better on white at small sizes. **Open decision: which one is canonical.** Whatever is picked should be applied to both the site and the invoice portal so the two stop drifting.

## Layout

| Setting | Value |
| --- | --- |
| Max page width | 1200px |
| Site gutter | 4vw desktop, 6vw mobile |
| Header width | full |
| Header vertical padding | 2vw desktop, 6vw mobile |
| Logo height | 50px desktop, 30px max mobile |
| Header behavior | transparent over hero, scrolls away, not fixed |
| Mobile breakpoint | 767px |

Recurring patterns worth noting: full-bleed alternating light and dark sections, three-up rows with a single centered button beneath, a twelve-logo grid on dark, a circular mask on the contact portrait, and a three-level button hierarchy of solid, outlined and small text.

## Custom CSS

The entire custom CSS on the site is two rules, which exist only to fix the alignment of the three-up service rows:

```css
@media screen and (min-width:570px){
  .user-items-list-simple[data-alignment-vertical="middle"]{display:flex;align-items:flex-start;justify-content:center}
  .user-items-list-simple .list-item{min-width:33%}
}
```

Nothing else was ever customized. The site is stock Squarespace with a palette swap.
