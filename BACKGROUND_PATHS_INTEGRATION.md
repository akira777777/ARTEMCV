// Example of how to integrate BackgroundPaths into your main App component

/*
In your App.tsx, you could replace the Hero component with BackgroundPaths:

import BackgroundPaths from './components/BackgroundPaths';

// In your component:
const handleHeroButtonClick = () => {
  // Navigate to works section or handle CTA
  document.getElementById('spotlight')?.scrollIntoView({ behavior: 'smooth' });
};

// Replace <Hero /> with:
<BackgroundPaths
  title="ARTEM CV"
  subtitle="Creative Developer & Designer Crafting Digital Experiences"
  buttonText="View My Work"
  onButtonClick={handleHeroButtonClick}
/>
*/

// Alternative: Use it as a separate route or page
// import BackgroundPathsRoute from './components/BackgroundPathsRoute';

// Then use it in routing:
// <Route path="/background-paths" element={<BackgroundPathsRoute />} />

// Or create a standalone page:
// Create a new file: pages/background-paths.tsx
/*
import BackgroundPathsRoute from '@/components/BackgroundPathsRoute';

export default function BackgroundPathsPage() {
  return <BackgroundPathsRoute />;
}
*/