---
name: The Hive Collaborative
colors:
  surface: '#fff8f0'
  surface-dim: '#e1d9cb'
  surface-bright: '#fff8f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf3e4'
  surface-container: '#f6edde'
  surface-container-high: '#f0e7d9'
  surface-container-highest: '#eae2d3'
  on-surface: '#1f1b12'
  on-surface-variant: '#4d4634'
  inverse-surface: '#343026'
  inverse-on-surface: '#f8f0e1'
  outline: '#7f7662'
  outline-variant: '#d0c6ae'
  surface-tint: '#735c00'
  primary: '#735c00'
  on-primary: '#ffffff'
  primary-container: '#ffd54f'
  on-primary-container: '#735c00'
  inverse-primary: '#ebc23e'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#ab2c5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffccd8'
  on-tertiary-container: '#ab2c5d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe087'
  primary-fixed-dim: '#ebc23e'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#ffd9e1'
  tertiary-fixed-dim: '#ffb1c5'
  on-tertiary-fixed: '#3f001b'
  on-tertiary-fixed-variant: '#8b0e45'
  background: '#fff8f0'
  on-background: '#1f1b12'
  surface-variant: '#eae2d3'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
  card-padding: 20px
---

## Brand & Style
The brand personality of this design system is industrious, collaborative, and organized, mirroring the efficient ecosystem of a hive. It targets university students who require a high-velocity information stream that remains academically structured. 

The design style is **Minimalist-Modern with Subtle Geometric Accents**. It utilizes heavy whitespace and a strictly controlled color palette to ensure the social media feed remains legible during long study sessions. The visual language balances the "buzz" of social interaction with the "structure" of academic life, using hexagonal motifs not as a primary container, but as subtle decorative anchors, masks for profile avatars, and iconography backgrounds.

## Colors
The color palette is anchored by a high-contrast relationship between **Honey Yellow** and **Obsidian Black**. This combination ensures immediate brand recognition and high legibility. 

- **Primary Yellow** is used for primary actions, highlight states, and "Golden Thread" connections between related posts.
- **Black** serves as the foundation for typography and structural accents (borders, icons).
- **Pink Accents** are used sparingly for social notifications and secondary interactive elements to provide a collegiate, energetic flair.
- **Green and Red** are strictly reserved for the "Pollination" (upvote) and "Sting" (downvote) mechanics, respectively.
- The **White Base** provides a clean, airy canvas that prevents the dense, card-based layout from feeling cluttered.

## Typography
This design system employs **Plus Jakarta Sans** across all levels to maintain a friendly, optimistic, yet highly professional tone. The typography scales are designed with a tight vertical rhythm to suit a content-heavy social interface. 

Headlines utilize a heavier weight and tighter letter spacing to create a sense of authority and urgency. Body text is optimized for readability with a generous line height (1.6), ensuring that academic discussions and long-form "hives" are easy to digest. Label styles utilize uppercase transformations to distinguish metadata (like timestamps or course codes) from the primary conversational content.

## Layout & Spacing
The layout follows a **structured card-based fixed grid** on desktop and a fluid single-column feed on mobile. The system relies on an 8px base grid to maintain mathematical harmony between elements.

The primary feed is centered, utilizing a 12-column grid where the main content occupies 6-8 columns, flanked by "Community Hives" (navigation) and "Trending Pollen" (discovery) sidebars. Cards are separated by 16px gutters to create clear visual distinction between different student contributions. Hexagonal elements should be used as background watermarks or small decorative separators, never as containers for long-form text.

## Elevation & Depth
Depth in this design system is achieved through **low-contrast outlines and tonal layering** rather than heavy shadows. This maintains the clean, modern aesthetic.

- **Level 0 (Surface):** The main background is pure white or a very light gray (#F8F9FA).
- **Level 1 (Cards):** Posts and navigation items use a 1px solid black border with a 5% opacity, or a subtle "Honey" tint on hover.
- **Level 2 (Modals/Popovers):** These elements use a crisp, thin black border (1px) and a soft, neutral shadow (0px 4px 20px rgba(0,0,0,0.05)) to suggest floating.
- **Interactive States:** Buttons and cards should slightly lift on hover using a subtle 4px translation rather than a shadow increase, reinforcing the "active" nature of the platform.

## Shapes
The shape language is a hybrid of **Organic Roundedness and Geometric Hexagons**. 

Standard containers like cards and input fields use a medium roundedness (0.5rem) to feel approachable. However, the design system introduces "The Hex" as a specific modifier: profile avatars are clipped into a hexagon shape, and the "Re-hive" button exists within a hexagonal stroke. This geometric contrast distinguishes the platform from standard rounded social media interfaces and reinforces the hive metaphor without sacrificing usability.

## Components

### Pollination Controls (Voting)
The upvote/downvote system is renamed "Pollinate" and "Sting." These are arranged vertically to the left of card content. The upvote icon (a stylized upward chevron) turns Green on activation, while the downvote (downward chevron) turns Red.

### The Hive Card (Posts)
The central component of the design system. It features a White background, 1px subtle border, and 20px internal padding. The header includes a hexagonal avatar and the student's "Degree Tag." The footer contains the "Re-hive," "Reply," and "Share" actions.

### Re-hive Button
A circular button containing a looping arrow icon that forms a subtle hexagonal path. When activated, it pulses with the Primary Yellow color.

### Buttons
- **Primary:** Solid Black background with White text. Pill-shaped for high touch-affordance.
- **Secondary:** Transparent background with a Black 2px border.
- **Ghost:** Primary Yellow text with no background, used for low-priority actions.

### Community Chips
Small, rounded-pill labels used for tagging subjects (e.g., #ComputerScience). These use a 10% opacity version of the Pink Accent color with high-contrast Black text to stand out in the feed.

### Input Fields
Clean, 2px bottom-border only for a "notebook" feel, or fully enclosed with 0.5rem rounding for search bars. Focus states must always utilize the Primary Yellow as the border color.