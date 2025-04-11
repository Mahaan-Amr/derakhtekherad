# Hero Slider Component

The Hero Slider component is a customizable and interactive banner for the homepage. It supports both German and Farsi languages and provides a clean UI for showcasing important content.

## Features

- Responsive design that works well on all device sizes
- Support for multiple slides with pagination indicators
- Manual navigation with previous/next buttons
- Optional autoplay functionality
- RTL support for Farsi content
- Customizable buttons with links

## Usage

### Basic Usage

To include the hero slider on a page:

```tsx
import HeroSlider from '@/app/components/home/HeroSlider';
import { getHeroSlides } from '@/app/lib/hero';

// Inside an async server component
const heroSlides = await getHeroSlides();

// Render the component
<HeroSlider locale="de" initialSlides={heroSlides} autoplay={false} />
```

### Props

- `locale`: `'de' | 'fa'` - The current locale (German or Farsi)
- `initialSlides`: Optional array of hero slides from the database
- `autoplay`: Optional boolean to enable automatic slide transition (default: false)

## Admin Management

The hero slides can be managed through the admin dashboard:

1. Navigate to `/admin/hero` to see all slides
2. Click "Create New Slide" to add a new slide
3. Use the up/down arrows to reorder slides
4. Toggle the active status to show/hide a slide
5. Click Edit to modify a slide's content
6. Click Delete to remove a slide

### Creating/Editing a Slide

When creating or editing a slide, the following fields are available:

- **Title (German)**: The headline displayed for German users
- **Title (Farsi)**: The headline displayed for Farsi users
- **Description (German)**: Optional descriptive text for German users
- **Description (Farsi)**: Optional descriptive text for Farsi users
- **Image URL**: The URL of the background image (recommended size: 1920x1080px)
- **Button 1 Text (German/Farsi)**: Text for the primary button in both languages
- **Button 1 Link**: The URL the primary button links to
- **Button 2 Text (German/Farsi)**: Text for the secondary button in both languages
- **Button 2 Link**: The URL the secondary button links to
- **Active**: Toggle to control whether the slide is visible to users

## Implementation Notes

- The slider fetches slides from the `/api/hero` endpoint when no initialSlides are provided
- Slides are ordered according to their `orderIndex` field
- Error states and loading states are handled gracefully
- The slider automatically adapts to the user's language based on the locale
- When autoplay is disabled, the slider stays on the first slide until the user navigates manually 