---
version: alpha
name: TDC-matchmaker-dashboard
description: A calm, discreet, human-first internal matchmaking workspace. Use a warm near-white canvas, deep plum accent, readable sans-serif typography, restrained semantic colors, and soft borders. Prioritize profile legibility, clear pairing stages, and human review rather than consumer-dating gamification. These are proposed MVP tokens, not verified official TDC brand tokens.
colors:
  primary: "#6D3158"
  primary-hover: "#572544"
  primary-soft: "#F4EAF0"
  primary-disabled: "#DCC8D5"
  ink: "#29242A"
  body: "#514A52"
  muted: "#777078"
  muted-soft: "#A49BA3"
  canvas: "#FBF9F8"
  surface: "#FFFFFF"
  surface-soft: "#F5F1F2"
  border: "#E7DFE3"
  border-strong: "#CFC2C9"
  positive: "#2F6B52"
  positive-soft: "#E8F3EC"
  warning: "#8A5A18"
  warning-soft: "#FBF1DD"
  danger: "#A43C46"
  danger-soft: "#F9E9EA"
  info: "#3D5F85"
  info-soft: "#EAF0F7"
  on-primary: "#FFFFFF"
  scrim: "#211820"
typography:
  display-lg:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 28px
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: -0.6px
  display-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.35px
  title-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.1px
  title-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 12px
    fontWeight: 550
    lineHeight: 1.4
    letterSpacing: 0
  caption:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 11px
    fontWeight: 450
    lineHeight: 1.4
    letterSpacing: 0.1px
  button:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
rounded:
  none: 0px
  xs: 4px
  sm: 7px
  md: 11px
  lg: 16px
  xl: 22px
  full: 9999px
spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  xxl: 40px
  section: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    height: 40px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "9px 15px"
    height: 40px
  page-shell:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
  sidebar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    width: 248px
  surface-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.border}"
    padding: 20px
  text-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
    height: 40px
  status-active:
    backgroundColor: "{colors.positive-soft}"
    textColor: "{colors.positive}"
    rounded: "{rounded.full}"
  status-pending:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    rounded: "{rounded.full}"
  status-neutral:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    rounded: "{rounded.full}"
  preference-match:
    backgroundColor: "{colors.positive-soft}"
    textColor: "{colors.positive}"
    rounded: "{rounded.xs}"
  preference-difference:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    rounded: "{rounded.xs}"
  preference-unknown:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.muted}"
    rounded: "{rounded.xs}"
  match-score:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
---

# Overview

## Design intent
TDC's public positioning is warm, private, premium, and human-led. The internal dashboard should feel like a discreet professional workspace—not a swipe-based dating app or a generic analytics template. Use clear information hierarchy, restrained color, readable biodata, and explicit workflow states.

**Evidence note:** TDC's public pages support the human-led, curated, private positioning. The exact official CSS tokens/font were not verified from public source documentation. The colors and typography above are considered proposals for this MVP, not claims about official brand tokens. If the repository already contains intentional brand assets/tokens, inspect and reuse them.

## References and design lessons
1. **TDC home:** https://www.thedatecrew.com/ — warm relationship-focused positioning, premium tone, editorial imagery, privacy and curated introductions. Borrow tone, not marketing-page layout.
2. **TDC process:** https://www.thedatecrew.com/how-we-work — profile review, matchmaker assignment, curated introductions and feedback; reflect this human workflow in the product.
3. **Hinge matching:** https://hinge.co/how-we-connect-daters — distinguish stated preferences, mutual fit, and dealbreakers. Do not copy its proprietary algorithm or visual identity.
4. **Shaadi.com matching:** https://www.shaadi.com/info/customer-relations/faq/match-making — preferred, broader, reverse and two-way categories; show these as labels/evidence rather than separate silos.
5. **shadcn/ui:** https://ui.shadcn.com/ — accessible dialogs, dropdowns, badges, tables, forms, skeletons and toasts; use them as coherent primitives rather than leaving defaults unstyled.

## Key characteristics
- Warm off-white canvas, white cards, deep plum accent.
- Green denotes a stated alignment; amber a difference worth reviewing; muted means unknown/not applicable. Never use color alone to convey status.
- Inter or the project's existing readable sans-serif; no proprietary font dependency.
- Subtle borders, restrained shadow, moderate corner radii.
- Profile images support recognition; structured information remains primary.
- No hearts, swipe gestures, gamified match animations, or consumer dating tropes.
- No fabricated “AI insights” or inferred personality judgments.

# Colors
- Primary plum `#6D3158`: primary CTA, selected navigation, score emphasis.
- Hover plum `#572544`; soft plum `#F4EAF0`.
- Canvas `#FBF9F8`; surface white `#FFFFFF`; soft surface `#F5F1F2`.
- Ink `#29242A`; body `#514A52`; muted `#777078`.
- Border `#E7DFE3`; strong border `#CFC2C9`.
- Positive `#2F6B52` / soft `#E8F3EC`.
- Warning `#8A5A18` / soft `#FBF1DD`.
- Danger `#A43C46` / soft `#F9E9EA`.
- Info `#3D5F85` / soft `#EAF0F7`.
Use text and icons alongside semantic colors for accessibility.

# Typography
| Token | Size | Weight | Use |
|---|---:|---:|---|
| display-lg | 28px | 650 | Page title |
| display-md | 22px | 600 | Section title |
| title-md | 16px | 600 | Customer/card heading |
| title-sm | 14px | 600 | Field-group heading |
| body-md | 14px | 400 | Profile details |
| body-sm | 12px | 400 | Secondary metadata |
| label | 12px | 550 | Form labels |
| caption | 11px | 450 | Timestamps/helper text |
| button | 13px | 600 | Button labels |

Use sentence case, avoid excessive uppercase micro-labels, and use tabular numerals for scores/counts where available.

# Layout

## App shell
- Desktop: sidebar around 248px, flexible main content capped near 1440px.
- Minimal navigation: Dashboard, Customers; do not invent unrelated product areas.
- Header: page title, breadcrumbs if useful, matchmaker identity/menu.
- Content padding: 24px desktop, 16px mobile.
- 4px base spacing; common gaps 8, 12, 16, 24px.

## Dashboard
Operational queue, not marketing page:
- Page title and short context.
- Optional metrics only when backed by data.
- Search/filter by name, city, readiness, and match activity.
- Customer rows/cards show name, derived age, city, marital status, profile readiness, and counts by match status.
- Never show a single customer-level match status as if it described all pairings.
- Useful empty/loading/error states.

## Customer detail
- Header: picture/avatar, name, age, city, marital status, readiness.
- Main action: Find Matches.
- Sections/tabs: Overview, Partner Preferences, Matches & History, Notes.
- Keep personal profile separate from what the customer seeks.
- Group biodata into Personal, Education & Career, Family & Culture, Relationship & Family Planning, Lifestyle & Values.
- Keep customer notes separate from pairing notes.

## Candidate results
Each result includes rank, picture, name, age, location, marital status, education, profession, compatibility score, classifications, matched preferences, reverse preferences, differences, and unknowns. Actions: View Profile, Shortlist, Send Match.
Show helper copy: “Based on structured preference alignment; not a prediction of relationship success.”
No LLM paragraph; show comparison evidence from actual fields.

## Match history
Each pairing is an independent row/card with candidate, status, score snapshot if useful, dates, follow-up and latest status event. Keep declined/on-hold/closed records discoverable. Status transitions must not imply consent.

# Components
- **Primary button:** plum fill, one main action per region.
- **Secondary button:** white surface and border.
- **Cards:** white surface, 1px border, 11px radius; avoid deep shadows.
- **Status badges:** compact text labels; distinguish profile readiness from match status.
- **Match evidence:** positive styling for aligned preferences, warning styling for differences, muted styling for unknowns. A difference is not automatically incompatibility unless it violates a dealbreaker.
- **Send Match dialog:** show candidate basics and state that it prepares a mock proposal for the assigned customer. Confirm records `PROPOSAL_SHARED` and status history; cancel makes no change. No real email.
- **Forms:** labels above fields; clear required indicators; explain dealbreaker vs flexible; multi-select for values/interests/languages/lifestyle; range controls for age/height/income. Religion/community should not be required. Distinguish “not provided” from “no preference” where relevant.

# Motion and elevation
Transitions around 120–180ms; no confetti, swipe animation or animated scores. Use one subtle shadow tier for dialogs/popovers. Respect reduced-motion preferences.

# Responsive behavior
| Breakpoint | Behavior |
|---|---|
| <640px | Sidebar becomes drawer; fields stack; customer rows become cards; comparison sections collapse. |
| 640–1024px | Narrow sidebar/drawer; two-column detail only where space permits. |
| >1024px | Full sidebar, dense customer list, two-column detail and comparison panels. |

Prevent comparison overflow; tables must collapse to cards or have accessible horizontal scrolling.

# Accessibility
Semantic headings/landmarks, visible keyboard focus, labelled inputs, accessible dialogs with focus management, readable contrast, text in addition to status color, meaningful button labels, reduced-motion support, and loading/error/empty states.

# Known gaps
- Exact TDC color/font tokens were not verified; this is an MVP proposal.
- The public marketing site is not a blueprint for internal dashboard layout.
- No user-provided UI screenshots were available in this request; update this file if screenshots are later supplied.
- Dark mode and AI UI are out of scope for this MVP design phase.
