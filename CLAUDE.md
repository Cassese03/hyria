# Hyria Basket – Project Guidelines

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (with custom `hyria.*` tokens) + plain CSS for complex layouts
- **Animation**: Framer Motion — scroll-triggered (`whileInView`) and hover/tap micro-interactions
- **Routing**: React Router DOM v7
- **Email**: EmailJS (`@emailjs/browser`)
- **Icons**: Heroicons v2

## Brand Tokens

| Token | Value | Usage |
|---|---|---|
| `hyria-primary` | `#5e0303` | Base background, header, cards |
| `hyria-secondary` / `hyria-orange` | `#d96c00` | Accent, CTAs, highlights |
| `hyria-dark` | `#020617` | Deeper sections, overlays |
| `hyria-tertiary` / `hyria-light` | `#ffffff` / `#f8fafc` | Text, contrast elements |

**Fonts**:
- `font-sans` → `Montserrat` (body, UI, navigation — all-caps nav links)
- `font-heading` → `Arvo` (serif headings for emphasis and section titles)

---

## Design Context

### Users

- **Primary**: Local sports fans and community members in Nola and the surrounding Campania area, checking fixtures, team rosters, and club news
- **Secondary**: Parents of youth players exploring the minibasket programme
- **Tertiary**: Potential sponsors evaluating the club's brand and reach
- **Context**: Mostly mobile, casual browsing — site is a digital front door for a young, ambitious club founded in 2025

### Brand Personality

**Three words**: Giovane · Audace · Radicato  
*(Young · Bold · Rooted)*

- **Voice**: Direct, proud, passionate — speaks in Italian with an energetic but trustworthy tone
- **Tone**: Club-member warmth + professional polish; never cold, never amateurish
- **Story**: "Hyria" references the ancient city that once stood near Nola — heritage and territory anchor the brand while the vision is firmly modern and forward-looking

### Emotional Goals

The site should make visitors feel:
1. **Orgoglio locale** — pride in supporting a team that represents their territory
2. **Energia e adrenalina** — the excitement of basketball and live sport
3. **Fiducia e professionalità** — confidence that this is a well-run, serious club
4. **Ispirazione per i giovani** — showing youth players a path and a community to belong to

### Aesthetic Direction

- **Theme**: Dark-mode only. Deep maroon (`#5e0303`) as the primary canvas; near-black (`#020617`) for depth sections
- **Accent**: Orange (`#d96c00`) reserved strictly for CTAs, active states, and key highlights — used sparingly for maximum impact
- **Typography**: All-caps Montserrat for navigation and labels; Arvo serif for emotive headings
- **Motion**: Purposeful animation only — scroll-reveal fades/slides, subtle hover scales, no decorative motion for its own sake. Animations must reinforce hierarchy and guide the eye to key objectives
- **Reference feel**: Clear hierarchy with strong CTAs, high-quality imagery, animations that feel intentional and editorial (not flashy or gratuitous)
- **Anti-reference**: Avoid anything that looks templated, amateur, or generically built. Every component should feel crafted for this specific club

### Design Principles

1. **Root before polish** — Every design decision should feel connected to Nola and this community; avoid generic sports aesthetics
2. **Hierarchy over decoration** — Animations, colour, and type weight exist to guide users to objectives (rosters, contact, youth sign-up), not to impress
3. **Dark + bold, never muddy** — The dark maroon palette must stay rich and legible; orange accents earn their place through restraint
4. **Trust through craft** — Small details (consistent spacing, sharp typography, quality imagery) communicate that this is a professional organisation
5. **Mobile-first energy** — Most fans browse on phones; layouts must feel native on small screens while scaling gracefully to desktop
