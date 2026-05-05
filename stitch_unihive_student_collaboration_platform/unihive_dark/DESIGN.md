---
name: UniHive Dark
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c6ae'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907b'
  outline-variant: '#4d4634'
  surface-tint: '#ebc23e'
  primary: '#fff5e1'
  on-primary: '#3c2f00'
  primary-container: '#ffd54f'
  on-primary-container: '#735c00'
  inverse-primary: '#735c00'
  secondary: '#ffb1c5'
  on-secondary: '#65002f'
  secondary-container: '#8b0e45'
  on-secondary-container: '#ff95b4'
  tertiary: '#dbffd7'
  on-tertiary: '#003911'
  tertiary-container: '#a2eaa4'
  on-tertiary-container: '#286b33'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe087'
  primary-fixed-dim: '#ebc23e'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#ffb1c5'
  on-secondary-fixed: '#3f001b'
  on-secondary-fixed-variant: '#8b0e45'
  tertiary-fixed: '#abf4ac'
  tertiary-fixed-dim: '#90d792'
  on-tertiary-fixed: '#002107'
  on-tertiary-fixed-variant: '#07521d'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 20px
  margin: 24px
---

## Brand & Style

This design system is built for a high-energy, collaborative ecosystem tailored for Turkish university students and young professionals. The aesthetic fuses **Minimalism** with subtle **Glassmorphism** to evoke a high-tech "hive" atmosphere. The brand personality is industrious, organized, and vibrant, focusing on the collective "swarm" intelligence of its users. 

Visuals should prioritize depth through layering rather than flat surfaces, mimicking the complex structure of a honeycomb. The tone is approachable yet high-performance, utilizing the dark mode to reduce eye strain during long collaborative sessions while making the honey-yellow "glow" like a light source within the interface.

## Colors

The palette is anchored by **Honey Yellow (#FFD54F)**, used exclusively for primary actions, branding elements, and progress indicators. The background is a disciplined **Deep Charcoal (#121212)**, while elevated surfaces use **Dark Zinc (#1E1E1E)** to provide clear container separation.

For interaction and feedback, **Pink/Red (#F06292)** serves as the high-visibility accent for destructive actions, notifications, and "heart" interactions. **Success Green (#81C784)** is reserved for task completion and positive status updates. Typography relies on pure White for high-contrast headlines and Light Grey for secondary body text to maintain a comfortable reading hierarchy in low-light environments.

## Typography

This design system utilizes **Plus Jakarta Sans** across all levels to maintain a friendly, modern, and geometric feel. Given the Turkish language context, special attention is paid to line-heights to accommodate accented characters (ğ, ü, ş, i, ö, ç) without vertical clipping. 

Headlines use tighter letter spacing and heavier weights to feel impactful and "hive-like." Labels and small captions use increased letter spacing and uppercase styling for maximum legibility against dark backgrounds.

## Layout & Spacing

This design system follows a **Fluid Grid** philosophy based on an 8px rhythm. The layout uses a 12-column system for desktop and a 4-column system for mobile. Gutters are kept tight (20px) to maximize screen real estate for collaborative tools and chat interfaces.

Padding within cards and containers should consistently follow the 24px (md) standard to ensure a spacious feel despite the dense information typical of productivity apps. Vertical spacing between sections should be generous (40px+) to allow the "honeycomb" structures to breathe.

## Elevation & Depth

Hierarchy in this design system is established through **Tonal Layers** and **Backdrop Blurs**. 
- **Level 0 (Background):** #121212.
- **Level 1 (Cards/Surfaces):** #1E1E1E with a subtle 1px inner stroke of 10% white to define edges.
- **Level 2 (Modals/Popovers):** #252525 with a soft, diffused shadow (0px 8px 24px rgba(0,0,0,0.5)).
- **Level 3 (Interaction):** Elements like active buttons or floating action buttons (FABs) utilize a "Honey Glow" effect—a soft outer glow using the primary color at low opacity (15-20%) to simulate light emission.

Glassmorphism is applied to navigation bars and sidebars using a 20px blur and a 40% opacity version of the surface color.

## Shapes

The design system employs a **Rounded (Level 2)** shape language, primarily using a base 8px radius (0.5rem) to echo the organic yet structured nature of a hive. 

- **Standard Buttons & Inputs:** 8px radius.
- **Large Cards & Modals:** 16px (1rem) radius.
- **Avatars & Chips:** Pill-shaped (fully rounded) to contrast against the structured grid.
- **The "Hex" Factor:** Where possible, utilize hexagonal clipping for profile pictures or decorative icons to reinforce the bee/hive theme without overcomplicating the core UX.

## Components

**Buttons:** 
- Primary: Solid #FFD54F with black text. 
- Secondary: Outline #FFD54F with yellow text. 
- Tertiary/Interaction: Ghost style with #F06292 (Pink) text for engagement-heavy actions.

**Chips & Tags:** 
Small, semi-transparent backgrounds (10% opacity of the accent color) with solid colored text. Used for "Ders" (Course), "Proje" (Project), or "Kulüp" (Club) categorization.

**Input Fields:** 
Dark Zinc (#1E1E1E) background with a 1px border. On focus, the border transitions to Honey Yellow with a soft outer glow.

**Cards (The "Cells"):** 
The core component of the system. Cards must have a subtle 1px border to separate them from the background. In collaborative views, cards can be grouped into "Clusters" with shared borders to mimic a honeycomb structure.

**Progress Bars:** 
Thin, high-contrast Honey Yellow tracks. For "Success" states, the bar transitions to Green.

**Turkish Language Support:** 
Ensure all components accommodate longer word lengths common in Turkish (e.g., "Görüntüledikleriniz" vs "Viewed"). Buttons and labels should have flexible widths or ellipsis handling for localized strings.