# Styling Approach

## Overview

Derakht-e-Kherad uses a modern styling approach centered on Tailwind CSS, enhanced with custom CSS where needed. The styling system supports:

- Consistent design language across the application
- Right-to-left (RTL) and left-to-right (LTR) layouts
- Responsive design for all device sizes
- Light and dark mode
- Custom branding and colors with CSS variables

## Technology Stack

The project uses the following styling technologies:

- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: For theme customization and dark mode
- **PostCSS**: For processing CSS and enabling Tailwind features
- **Next.js Image**: For optimized image loading and fallback support

## Configuration Files

### PostCSS Configuration

The project uses PostCSS to process CSS and enable Tailwind. The configuration is in `postcss.config.mjs` using ES module syntax:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Tailwind Configuration

The Tailwind theme is customized in `tailwind.config.js` with specific color schemes, font families, and custom utilities:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        border: "var(--border)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        heading: ["var(--font-heading)"],
        farsi: ["var(--font-farsi)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

## Global Styles

Global styles are defined in `app/globals.css` and include:

- CSS variables for theming
- Base styles
- Dark mode variables
- RTL specific adjustments

## Component Design

Components follow these style principles:

1. **Composition over inheritance**: Components are composed using Tailwind's utility classes
2. **Responsive by default**: All components adapt to different screen sizes
3. **Theme-aware**: Components use CSS variables for theming

## Dark Mode

Dark mode is implemented using:

1. **CSS variables**: Different values for light and dark modes
2. **Tailwind's dark mode**: The `dark:` prefix for dark-mode specific styles
3. **Theme context**: A React context to manage theme state

## RTL Support

Right-to-left (RTL) support for Farsi is implemented with:

1. **dir attribute**: Set to "rtl" for Farsi pages
2. **Logical properties**: Using start/end instead of left/right
3. **Tailwind customization**: Special utilities for RTL-specific cases

## Custom Components

Reusable UI components in the `components/ui` directory follow these styling practices:

1. **Variant pattern**: Components accept variant props for different appearances
2. **Composable**: Components can be combined and nested
3. **Accessible**: All components follow accessibility best practices

## Image Handling

The project uses Next.js Image component with:

1. **Responsive sizing**: Images adapt to container size
2. **Lazy loading**: Images load only when in viewport
3. **Fallback mechanism**: Proper fallbacks for failed image loads
4. **Optimized loading**: Automatic WebP format conversion and size optimization

## Responsive Design

The responsive design follows these breakpoints:

- **sm**: 640px and above
- **md**: 768px and above
- **lg**: 1024px and above
- **xl**: 1280px and above
- **2xl**: 1536px and above

Mobile-first approach is used, with base styles for mobile and overrides for larger screens.

## Best Practices

1. **Use Tailwind's utility classes** for most styling needs
2. **Create custom components** for recurring UI patterns
3. **Use CSS variables** for theming and dynamic values
4. **Test in both LTR and RTL** layouts
5. **Test in both light and dark** modes
6. **Follow responsive design** principles
7. **Optimize images** for performance 