# Pintail Experience — Brand & UI Brief

*Extracted from pintailgoods.com (the founder's existing brand) and translated into design tokens, typography, color palette, and imagery direction for the Pintail Experience platform. Read this before setting tailwind tokens or building any UI.*

---

## Brand Essence — What the Existing Site Tells Us

Pintail Goods sells handmade leather duck straps and apparel out of the South Carolina low-country. The brand language is already dialed in and consistent across pages. Three through-lines:

1. **Heirloom craftsmanship.** "Heirloom-quality," "built to last," "100% locally sourced and made in America," "lifelong service partnership." Everything is hand-made, tactile, slow.
2. **Reverence for the experience.** Direct quote from the About page: *"The real experience is about the people, meals, laughs, conversations, and bonds that are built as a result of hunting."* — This is **literally the thesis** for Pintail Experience. The founder is already articulating it.
3. **The "inspired sportsman."** Not the trophy hunter, not the gear-bro. The man who hunts as a discipline, with intention, with people he cares about. "Reverence with which we pursue these birds." That word — reverence — is the right register.

The Experience platform should feel like Pintail Goods *grown up* — the same DNA, but richer, more cinematic, premium-retreat scale instead of product-page scale.

---

## Color Palette (Extracted)

Pulled from computed CSS on the live site. Use these as your starting points, with one addition (a deeper background) recommended for the platform.

### Core palette

| Token | Hex | Source | Use |
|---|---|---|---|
| **Pintail Tobacco** | `#E9B46F` | Homepage body bg | Warm accent, hover states, callout backgrounds |
| **Pintail Slate** | `#47524C` | About page bg | **Recommended primary surface (dark mode default)** — a deep, sophisticated slate-green that reads "Garden & Gun" |
| **Pintail Cream** | `#EEE7E0` | Headline color on dark | Primary text on dark surfaces, ivory tones |
| **Pintail Saddle** | `#954D2B` | Body text on tobacco | Rich brown, secondary accent, nav text on light surfaces |
| **Pintail Champagne** | `#E5C188` *(approximate)* | Wordmark color | Gold/champagne accent — buttons, highlights, the "Pintail" wordmark |
| **White** | `#FFFFFF` | Headline + paragraph color (hero) | Pure white for hero typography over imagery |

### Recommended additions for the platform (deeper UI palette)

The existing site is product-page warm. For the platform — which lives on screens at 6am in duck blinds, lobby lounges, and dark hotel rooms — go a half-shade richer:

| Token | Hex | Use |
|---|---|---|
| **Pintail Night** | `#1F2421` | Deepest background — splash, photo gallery dark mode |
| **Pintail Char** | `#2C332F` | Card backgrounds, secondary surfaces |
| **Pintail Slate** *(from above)* | `#47524C` | Primary surface |
| **Pintail Bronze** | `#8C6A3F` | Subtle borders, divider lines, dim text |
| **Pintail Champagne** *(from above)* | `#E5C188` | Primary accent / CTAs / wordmark |
| **Pintail Ember** | `#C97A3D` *(approximate from imagery)* | Hot accent for emphasis — use sparingly (notification dots, "live now" indicators) |

**Recommended Tailwind setup** — add these as CSS variables under `:root` and `[data-theme="dark"]`, then expose them in `tailwind.config.ts` so utility classes like `bg-pintail-slate` and `text-pintail-cream` just work.

---

## Typography (Extracted)

The live site uses two distinct typefaces, and both are pulling real weight in the brand.

### Display / hero — flowing script

- **Font name on the site:** `lakeside` (Squarespace's "Lakeside" — a flowing handwritten cursive)
- **Where it's used:** The "Pintail" wordmark, the nav links ("Shop / About / Contact"), and the giant hero headlines ("For the inspired sportsman.", "Welcome").
- **Closest Google Fonts equivalent** (since Lakeside is Squarespace-licensed): **Allura**, **Sacramento**, **Yellowtail**, or **Pinyon Script**. Of those, **Allura** has the closest stroke weight and ligature flow to Lakeside.

**Use case in the platform:** the wordmark, hero h1 ("The Pintail Experience"), section openers ("Welcome", "Day 1", "The Blessing"), the final-page sign-off after the trip. **Do NOT use for body text, nav (in the platform), buttons, forms, schedules, or tables** — script doesn't scan at small sizes and breaks readability under information-dense UI.

### Body — slab serif

- **Font name on the site:** **Bitter** (Google Font, freely available)
- **Where it's used:** All paragraph text, nav text *(on functional UI, vs. the hero script style)*, captions.
- **Weights observed:** 400 (regular) and 500 (medium). Italic for emphasis.

**Use case in the platform:** All long-form reading — devotionals, curriculum, the "what to expect" page, vendor descriptions, the founder's notes. Bitter has the warmth of a slab serif (Charter / Roboto Slab feel) with great legibility on mobile.

### Recommended addition — UI sans

The existing site doesn't have one because it's a Squarespace product page. The platform needs one for tables, forms, dense admin views, and small UI labels. Recommended: **Inter** — pairs cleanly with Bitter and Allura, available everywhere, optimized for screens at small sizes.

### Type stack — proposed

| Role | Font | Weight | Size scale |
|---|---|---|---|
| Display / hero | **Allura** (or Lakeside if licensed) | 400 | 48–144px |
| Body / reading | **Bitter** | 400, 500, 700 | 14–22px |
| UI / functional | **Inter** | 400, 500, 600 | 11–16px |

Load all three via Google Fonts in the Next.js root layout using `next/font/google` so they're locally hosted and don't block render.

---

## Imagery Direction

The hero shot on the homepage is the brand in one frame: a worn wooden surface, the Maverick Strap laid out next to a Buck knife and rope, low-key golden light, deep shadows, leather grain visible. Everything tactile. Everything quiet.

For the platform, the same DNA — but extended to the experience itself:

**On-brand imagery:**
- Dawn duck blinds with fog rolling off the water
- Dogs working in soft morning light
- Hands holding birds, leather, knives, a coffee thermos
- Fire-lit teaching moments — the father-in-law mid-sentence with a Bible open
- Fathers and sons, fathers and daughters
- Group dinners by candlelight
- Single-subject portrait shots with shallow depth of field
- Cinematic 2.35:1 or 16:9 crop on the brand film

**Off-brand imagery:**
- Bright midday hero shots
- Smiling-into-camera marketing-headshot style
- Crowds, gear shots without context, trophy-bird grip-and-grins
- Anything that feels like a stock photo
- Anything that feels mass-produced

**Photography rule of thumb:** if it would look at home in a Garden & Gun feature, it's right. If it would look at home on Bass Pro's homepage, it's wrong.

---

## Voice & Tone

The existing site's voice is **reverent, declarative, intentional, warm but disciplined**. Sentence rhythm is short and direct, with occasional flowing/poetic moments.

### Voice attributes

- **Reverent, not preachy.** "The reverence with which we pursue these birds." Acknowledges the weight of the activity without sermonizing.
- **Intentional, not slick.** "Intentionality and authenticity in every decision." Speaks to craftsmanship and purpose, not marketing polish.
- **Personal, not corporate.** "Lifelong service partnership," "personal experience of excellence." Reads like a handshake, not a brochure.
- **Confident, not boastful.** "Built to last. That's our pledge." Quiet authority.

### Voice samples to mimic (from the live site)

> "For the inspired sportsman."
>
> "The real experience is about the people, meals, laughs, conversations, and bonds that are built as a result of hunting."
>
> "Expertly crafted to last you a lifetime. That's our pledge."

### Words to use freely

reverence · intention · brotherhood · craftsmanship · heirloom · the field · the blind · the table · purpose · calling · legacy · the way home

### Words to avoid

awesome · epic · ultimate · exclusive · unleash · transform your life · journey (verb) · curated (use "intentional" or "thoughtful") · luxe (use "heirloom" or "quality") · any superlatives that sound like a Groupon ad

### Sentence patterns

- Short. Declarative. Confident.
- Use occasional fragments for emphasis. They land.
- Three-beat lists work: "Hunt better. Lead better. Live better."
- Save the poetic, longer-rhythm sentences for moments that earn them (the blessing, the welcome letter, the closing line of a devotional).

---

## UI Patterns Observed

What the existing Squarespace site does well that we should carry over:

1. **Generous whitespace.** Lots of room around hero shots and around headlines. Don't pack the UI.
2. **Big imagery, small type.** The hero image dominates; type sits quietly on top. Same approach on every Trip Home, every curriculum session.
3. **Single accent color at a time.** Each page has one dominant warm tone — tobacco on the homepage, slate on the about page. Don't rainbow it. Pick a surface color per route and stay there.
4. **Minimal navigation.** Three top-nav items max (Shop / About / Contact). The platform's bottom nav should follow this — 5 max, ideally fewer.
5. **Underlined active state.** Note the underline under "About" in the nav. Subtle, period-correct. Use this pattern.

What to deliberately do differently in the platform:

1. **Better functional UI density.** The Squarespace site is product-page slow. The admin and the trip-day client views need to move faster — dense info, fast scanning. Inter for UI handles this.
2. **Layered depth.** Squarespace renders flat. Use subtle elevation (soft shadows, backdrop blur on overlays) to give the platform a more tactile, app-like feel.
3. **Real motion.** Subtle fade-up on page load, soft parallax on hero images, gentle ease on tab transitions. Squarespace doesn't do this; the platform should.

---

## Translation to The Pintail Experience Platform

Concrete tokens you (or Claude Code) can paste into the Next.js + Tailwind setup:

### `tailwind.config.ts` colors (suggested)

```ts
colors: {
  pintail: {
    night:      '#1F2421',
    char:       '#2C332F',
    slate:      '#47524C',  // primary surface
    bronze:     '#8C6A3F',
    saddle:     '#954D2B',
    tobacco:    '#E9B46F',
    champagne:  '#E5C188',  // accent / CTA
    cream:      '#EEE7E0',  // body on dark
    ember:      '#C97A3D',  // sparing emphasis
  }
}
```

### `globals.css` font setup (via `next/font/google`)

```ts
// app/fonts.ts
import { Allura, Bitter, Inter } from 'next/font/google'

export const fontDisplay = Allura({ subsets: ['latin'], weight: '400', variable: '--font-display' })
export const fontSerif   = Bitter({ subsets: ['latin'], weight: ['400','500','700'], variable: '--font-serif' })
export const fontSans    = Inter({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-sans' })
```

```css
/* globals.css */
:root {
  --font-display: var(--font-display); /* Allura */
  --font-serif:   var(--font-serif);   /* Bitter */
  --font-sans:    var(--font-sans);    /* Inter */
}
body {
  font-family: var(--font-serif), Georgia, serif;
  background: theme('colors.pintail.slate');
  color: theme('colors.pintail.cream');
}
.font-display { font-family: var(--font-display); }
.font-sans-ui { font-family: var(--font-sans); }
```

### Component conventions

- **Hero headlines** — `font-display text-7xl md:text-9xl text-pintail-cream` (Allura, huge)
- **Section openers** — `font-display text-4xl md:text-6xl text-pintail-champagne` (Allura, accent-colored)
- **Body / reading** — default body styles (Bitter, cream on slate)
- **UI / tables / forms** — `font-sans-ui text-sm` (Inter, small)
- **Primary CTA** — `bg-pintail-champagne text-pintail-night font-sans-ui font-medium` — feels like brass against leather
- **Secondary CTA** — `border border-pintail-cream/30 text-pintail-cream hover:bg-pintail-cream/10`
- **Cards** — `bg-pintail-char border border-pintail-bronze/20 shadow-lg shadow-black/40`

### Logo / wordmark

The existing "Pintail" wordmark is on `pintailgoods.com` in champagne script. For the platform:

- **Short term (Phase 1–4):** type-set the wordmark in Allura at champagne — `<span className="font-display text-pintail-champagne">The Pintail Experience</span>`. Looks intentional, hits the brand immediately, costs nothing.
- **Phase 5 polish:** commission or design a proper SVG wordmark — likely "The Pintail Experience" set in a refined Lakeside / Allura with custom letterforms on "P" and "E". Save as `/public/wordmark.svg`.

The Pintail Goods wordmark could be referenced and adapted but I'd treat the Experience as a sister brand — same family, more refined, more grown up.

---

## What to Carry Over from Pintail Goods, What to Evolve

| Element | Pintail Goods | The Pintail Experience |
|---|---|---|
| Wordmark style | Script "Pintail" in champagne | Script "The Pintail Experience" in champagne — same family, more refined |
| Color palette | Warm tobacco + slate + cream | Slate-primary, with tobacco/cream/champagne accents; add deeper night tones for UI |
| Display type | Lakeside (script) | Allura (script) — closest free alternative |
| Body type | Bitter | Bitter |
| Functional UI type | (None — Squarespace nav) | Inter — for tables, forms, small UI |
| Imagery | Product + lifestyle | Experience-scale: people, faces, blinds, fires, hands |
| Voice | Reverent, intentional, declarative | **Same.** Don't reinvent. |
| Layout density | Generous, slow | Generous on hero; denser on admin and day-of |
| Motion | Static | Subtle fade-up, parallax, gentle transitions |
| Mood | Warm, low-light, tactile | Same DNA, scaled up — more cinematic, more layered |

---

## One-Sentence Brand Test

> If a screen would feel right printed in the back of a Garden & Gun feature about a South Carolina low-country leather maker, it's on brand. If it would feel right in a Bass Pro app, it isn't.

---

*This brief is the working brand reference. Update it as design decisions get made — don't start fresh elsewhere.*
