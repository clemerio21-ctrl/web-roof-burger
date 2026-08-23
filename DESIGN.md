---
name: Gourmet Ember
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
  on-surface-variant: '#e4beba'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ab8985'
  outline-variant: '#5b403d'
  surface-tint: '#ffb3ac'
  primary: '#ffb3ac'
  on-primary: '#680008'
  primary-container: '#d32f2f'
  on-primary-container: '#fff2f0'
  inverse-primary: '#ba1a20'
  secondary: '#e9c176'
  on-secondary: '#412d00'
  secondary-container: '#604403'
  on-secondary-container: '#dab36a'
  tertiary: '#7bd1f8'
  on-tertiary: '#003546'
  tertiary-container: '#00799c'
  on-tertiary-container: '#e9f7ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb3ac'
  on-primary-fixed: '#410003'
  on-primary-fixed-variant: '#930010'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#bee9ff'
  tertiary-fixed-dim: '#7bd1f8'
  on-tertiary-fixed: '#001f2a'
  on-tertiary-fixed-variant: '#004d65'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Anton
    fontSize: 72px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-md:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  price-tag:
    fontFamily: Anton
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  section-gap-desktop: 120px
  section-gap-mobile: 64px
  grid-margin: 24px
  grid-gutter: 20px
---

## Brand & Style

The design system is centered on a "Gourmet Smash" aesthetic—merging the raw, high-energy atmosphere of a premium burger joint with the sophisticated polish of a high-end culinary brand. The visual language evokes the heat of the grill and the charcoal of the kitchen through a deep, atmospheric dark mode.

**Design Style: Bold Minimalist with Tactile Accents**
The interface leverages a high-contrast dark aesthetic. It utilizes heavy whitespace (or "blackspace"), massive typography, and "golden wood" accents to create a sense of premium craft. While the layout is strictly grid-based and modern, the use of large rounded corners and intense color pops ensures the UI feels energetic and approachable rather than cold or corporate.

## Colors

The palette is designed to stimulate appetite and convey luxury:
- **Primary (Intense Red):** Reserved strictly for primary call-to-actions, price points, and active states. It represents the heat and energy of the brand.
- **Secondary (Golden Wood):** Used for decorative accents, badges, and secondary highlights. It adds a layer of "gourmet" sophistication.
- **Neutral (Charcoal/Black):** The foundation of the UI. Use `#121212` for main containers and `#0A0A0A` for the deepest background layers to create depth.
- **Feedback Colors:** Use a muted version of the primary red for errors, and a vibrant green (#4CAF50) only for successful checkout/order confirmations.

## Typography

The typography strategy is built on a "Power and Precision" pairing.
- **Headlines:** Uses a bold, condensed sans-serif to dominate the visual hierarchy. Headlines should always be uppercase to maximize impact and convey the "strength" of the brand.
- **Body:** Uses a systematic, neutral sans-serif for maximum legibility against dark backgrounds. 
- **Character:** Use tight letter-spacing on large headings to create a dense, modern editorial look. Use generous line-height for body text to ensure readability under low-light conditions (common in restaurant environments).

## Layout & Spacing

This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Vertical Rhythm:** A strict 8px base unit governs all padding and margins. 
- **Content Width:** On desktop, the main content area is capped at 1280px to maintain readability.
- **Negative Space:** Use aggressive padding (64px+) between menu categories to create an "expansive" and premium feel. 
- **Sticky Patterns:** Navigation must remain sticky at the top with a background blur to ensure "Order Now" functionality is always accessible.

## Elevation & Depth

In this dark-themed system, depth is achieved through **Tonal Layering** rather than traditional shadows.
- **Level 0 (Canvas):** The deepest background (#0A0A0A).
- **Level 1 (Cards/Containers):** A slightly lighter charcoal (#1E1E1E) with a subtle 1px border (#333333).
- **Level 2 (Modals/Popovers):** Elevated surfaces use a subtle inner glow (top-down) to simulate the glint of a polished kitchen surface.
- **Overlays:** Use a 60% black background blur (20px) for mobile navigation drawers and modal backdrops to maintain context without visual clutter.

## Shapes

The shape language is "Boldly Rounded." By using `rounded-lg` (16px) and `rounded-xl` (24px) on cards and buttons, the design balances the "aggressive" nature of the typography with a friendly, modern touch.
- **Buttons:** Use full pill-shapes for primary CTAs to make them feel "squishy" and tactile.
- **Menu Images:** Images of burgers should use `rounded-lg` corners or, in hero sections, be completely unmasked (cut-out) to float over the charcoal background.

## Components

- **Primary Button:** Heavy weight, `primary_color_hex` background, white text. No border. Large padding (16px 32px). On hover, it shifts to the `secondary_color_hex`.
- **Menu Card:** Level 1 surface, 1px subtle border. High-quality food photography should take up the top 60% of the card. Prices are displayed in the bottom right using the `price-tag` typography style.
- **Category Chips:** Outlined buttons with `secondary_color_hex` borders. When active, they fill with the secondary color and use dark text.
- **Sticky Header:** 80px height, semi-transparent background blur. Features the logo centered and a "Bag/Cart" icon with a red notification dot on the right.
- **Input Fields:** Deep charcoal background with a 2px bottom-border only (minimalist style). On focus, the border turns `secondary_color_hex`.
- **Add-on List:** A vertical list of ingredients with custom styled checkboxes that use the `primary_color_hex` for the checkmark.