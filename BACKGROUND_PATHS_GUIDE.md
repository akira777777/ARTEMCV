# BackgroundPaths Component Guide

## Overview
The BackgroundPaths component creates stunning animated SVG path backgrounds with floating, flowing line animations. Perfect for hero sections, landing pages, and portfolio showcases.

## Features
- ✨ Smooth animated SVG paths with infinite looping
- 🎨 Customizable colors and animations
- ⚡ Performance optimized with Framer Motion
- 🌙 Dark mode support
- 📱 Fully responsive design
- ♿ Accessibility compliant
- 🎯 TypeScript support

## Installation
The component is already created in your project at `components/BackgroundPaths.tsx`.

## Basic Usage

```tsx
import BackgroundPaths from '@/components/BackgroundPaths';

export default function MyPage() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <BackgroundPaths
      title="My Awesome Title"
      subtitle="An engaging subtitle goes here"
      buttonText="Get Started"
      onButtonClick={handleClick}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Background Paths" | Main heading text |
| `subtitle` | string | "" | Secondary text below title |
| `buttonText` | string | "Discover Excellence" | Call-to-action button text |
| `onButtonClick` | () => void | undefined | Button click handler |
| `className` | string | "" | Additional CSS classes |

## Advanced Usage Examples

### Custom Styling
```tsx
<BackgroundPaths
  title="Custom Styled Hero"
  buttonText="Explore More"
  onButtonClick={handleNavigation}
  className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
/>
```

### With Navigation
```tsx
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  
  const handleExplore = () => {
    router.push('/projects');
  };

  return (
    <BackgroundPaths
      title="Creative Portfolio"
      subtitle="Showcasing innovative design and development work"
      buttonText="View Projects"
      onButtonClick={handleExplore}
    />
  );
}
```

### Multiple Sections
```tsx
export default function LandingPage() {
  return (
    <div>
      <BackgroundPaths
        title="Welcome to Studio"
        subtitle="We create digital experiences that inspire"
        buttonText="See Our Work"
        onButtonClick={() => document.getElementById('work')?.scrollIntoView()}
      />
      
      <section id="work" className="py-20">
        {/* Your content here */}
      </section>
    </div>
  );
}
```

## Customization Options

### Colors
The component automatically adapts to your theme:
- Light mode: Black/white paths with subtle gradients
- Dark mode: White paths on dark backgrounds

### Animation Timing
Animations are configured with:
- Path drawing: 20-30 seconds duration
- Letter animations: Staggered spring physics
- Opacity transitions: Smooth fades

### Performance Tips
- Uses `pointer-events-none` for background layers
- Optimized SVG rendering
- Efficient Framer Motion animations
- Memoized components for re-renders

## Accessibility
- Proper ARIA labels
- Semantic HTML structure
- Keyboard navigable
- Reduced motion support
- Screen reader friendly

## Integration with Existing Components

The component works seamlessly with:
- Your existing `MagneticButton` component
- Dark mode toggles
- Internationalization (i18n)
- Responsive design system

## Troubleshooting

### Paths not animating
- Ensure Framer Motion is properly installed
- Check that the component has `use client` directive
- Verify CSS classes aren't conflicting

### Performance issues
- Reduce number of paths in the array (currently 36)
- Adjust animation durations
- Consider using `prefers-reduced-motion` media query

### Styling conflicts
- Inspect CSS specificity
- Check Tailwind classes
- Verify z-index stacking

## Example Implementation

See `components/BackgroundPathsDemo.tsx` for a complete working example with additional content sections.