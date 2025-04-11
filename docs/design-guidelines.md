# Design Guidelines

## Overview

This document outlines the design guidelines for the Derakhte Kherad website. Following these guidelines will ensure consistency, usability, and aesthetic quality across the platform.

## Brand Identity

### Logo
- The Derakhte Kherad logo should be prominently displayed in the header
- Maintain appropriate spacing around the logo (minimum 16px on all sides)
- Use the full-color version on light backgrounds and the white version on dark backgrounds

## Color Palette

Derakhte Kherad uses a carefully selected color palette that represents the brand identity:

### Primary Colors
- **Primary Maroon**: `#800000` - Main brand color, used for prominent elements
- **Dark Maroon**: `#600000` - Used for hover states and emphasis
- **Light Maroon**: `#a03030` - Used for accents and secondary elements

### Secondary Colors
- **Secondary Green**: `#808000` - Complementary color for accents and highlights
- **Dark Green**: `#606000` - Used for hover states and emphasis
- **Light Green**: `#a0a030` - Used for accents and secondary elements

### Accent Color
- **Beige**: `#c0a080` - Used sparingly for special highlights

### Neutral Colors
- **Background**: `#ffffff` (Light mode) / `#1a1a1a` (Dark mode)
- **Surface**: `#f8f8f8` (Light mode) / `#2a2a2a` (Dark mode)
- **Border**: `#e5e5e5` (Light mode) / `#444444` (Dark mode)
- **Text Primary**: `#333333` (Light mode) / `#f0f0f0` (Dark mode)
- **Text Secondary**: `#666666` (Light mode) / `#b0b0b0` (Dark mode)

## Typography

### Font Families
- **Farsi Text**: Vazirmatn - A modern, readable Persian font
- **Latin Text**: Inter - A clean, contemporary sans-serif font for German text

### Font Sizes
- **H1**: 2.5rem (40px)
- **H2**: 2rem (32px)
- **H3**: 1.5rem (24px)
- **H4**: 1.25rem (20px)
- **H5**: 1.125rem (18px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## Spacing System

The spacing system follows a consistent pattern:

- **4px** (0.25rem): Tiny spacing (margins between adjacent elements)
- **8px** (0.5rem): Small spacing (padding for small components)
- **16px** (1rem): Base spacing (standard margin/padding)
- **24px** (1.5rem): Medium spacing (separation between related sections)
- **32px** (2rem): Large spacing (separation between distinct sections)
- **48px** (3rem): Extra large spacing (major section divisions)
- **64px** (4rem): Huge spacing (page-level divisions)

## Component Styles

### Buttons

Buttons come in multiple variants and sizes:

#### Variants
- **Primary**: Solid maroon background with white text
- **Secondary**: Solid green background with white text
- **Outline**: Transparent with maroon border and text
- **Ghost**: Transparent with maroon text, no border

#### Sizes
- **Small**: 0.875rem text, padding 8px 12px
- **Medium** (default): 1rem text, padding 10px 16px
- **Large**: 1.125rem text, padding 12px 20px

### Cards

Cards provide a container for distinct content sections:

- **Default Card**: White background, subtle shadow, 8px border radius
- **Hover effect**: Slightly larger shadow on hover
- **Padding**: 24px internally

### Form Elements

#### Text Inputs
- **Height**: 40px (2.5rem)
- **Padding**: 8px 12px
- **Border**: 1px solid border color
- **Border Radius**: 6px
- **Focus state**: 2px outline of primary color

#### Select Dropdowns
- **Height**: 40px (2.5rem)
- **Padding**: 8px 12px (with arrow icon)
- **Border**: 1px solid border color
- **Border Radius**: 6px

## Layout Guidelines

### Container Widths
- **Max width**: 1280px for main content
- **Padding**: 16px on mobile, 24px on desktop

### Responsive Breakpoints
- **Small (sm)**: 640px
- **Medium (md)**: 768px
- **Large (lg)**: 1024px
- **Extra Large (xl)**: 1280px
- **2XL (2xl)**: 1536px

### Grid System
- **Default**: 12-column grid
- **Gutters**: 16px on mobile, 24px on desktop

## Imagery Guidelines

### Photos
- **Style**: High-quality, well-lit imagery showing language learning environments
- **Ratio**: 16:9 for hero images and feature sections
- **Treatment**: Subtle color correction to match the brand palette

### Icons
- **Style**: Simple, clean line icons
- **Size**: 24px standard size (adjust for context)
- **Color**: Primary color or text color, depending on context

## Accessibility Guidelines

- **Color Contrast**: All text must maintain a minimum contrast ratio of 4.5:1 against its background
- **Focus States**: All interactive elements must have clearly visible focus states
- **Text Size**: Body text should not be smaller than 16px to ensure readability
- **Alternative Text**: All meaningful images require descriptive alt text

## RTL/LTR Considerations

- **Text Alignment**: Right-aligned for Farsi, left-aligned for German
- **Directional Icons**: Should be flipped in RTL layouts
- **Form Elements**: Labels and inputs follow the reading direction
- **Margins and Paddings**: Use logical properties (start/end) rather than left/right

## Recommended Practices

1. **Consistency**: Maintain consistent spacing, colors, and typography throughout the application
2. **Hierarchy**: Establish clear visual hierarchy for content importance
3. **Whitespace**: Use generous whitespace to improve readability and focus
4. **Feedback**: Provide clear visual feedback for interactive elements
5. **Simplicity**: Keep the design clean and focused on content
6. **Responsive Design**: Ensure all components adapt gracefully to different screen sizes

## Implementation Notes

- Use CSS variables for themeable properties
- Leverage Tailwind's utility classes for consistent implementation
- Apply dark mode using the `dark:` variant in Tailwind
- Create custom component classes for repeated patterns

## Dark Mode Guidelines

- Prefer dark neutrals over pure black
- Reduce contrast slightly compared to light mode
- Ensure interactive elements remain identifiable
- Maintain color relationships (primary colors should still be recognizable)
- Test text legibility in both modes 