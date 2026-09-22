# Portfolio Landing

A single-page dark portfolio landing built with React, Vite, TypeScript, Tailwind CSS,
GSAP, Framer Motion and hls.js.

## Stack

- **React 19 + TypeScript + Vite** — app shell and build tooling
- **Tailwind CSS v3** — design tokens (`tailwind.config.js`) and utility styling
- **GSAP + ScrollTrigger** — hero entrance timeline, pinned parallax gallery, footer marquee
- **Framer Motion** — loading screen word cycling, scroll-triggered section reveals, page transitions
- **hls.js** — streams the Mux background video in the hero and footer
- **react-router-dom** — routes between the landing page (`/`) and `/resume`

## Structure

```
src/
├── components/     # Navbar, Hero, SelectedWorks, Journal, Explorations, Stats, Contact, ...
├── pages/          # Index.tsx, Resume.tsx
├── data/           # content.ts (projects, journal, gallery, nav) and resume.ts
└── lib/            # useHlsSource hook, shared gsap instance with ScrollTrigger registered
```

## Usage

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- Project imagery is hot-linked from Unsplash and the hero/footer video streams from a public
  Mux demo asset — swap `src/data/content.ts` for real assets before shipping.
- Every hot-linked `<img>` has an `onError` fallback to a gradient placeholder so a dead link
  never breaks the layout.
- The Explorations parallax columns are hidden below the `xl` breakpoint — there isn't enough
  horizontal room for two flanking image columns plus the centered pinned copy on smaller
  screens, so the section gracefully degrades to text + CTA only.
