"use client"

import devLog from '../lib/logger';
import BackgroundPaths from './BackgroundPaths';

const BackgroundPathsDemo: React.FC = () => {
  const handleButtonClick = () => {
    devLog.log('Button clicked!');
    // You can add your navigation logic here
  };

  return (
    <div className="min-h-screen">
      <BackgroundPaths
        title="Background Paths"
        subtitle="Experience the beauty of animated vector paths creating dynamic visual flows"
        buttonText="Discover Excellence"
        onButtonClick={handleButtonClick}
      />
      
      {/* Additional content sections can go here */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            The BackgroundPaths component creates mesmerizing animated SVG paths that flow 
            across the screen, creating a sense of movement and depth in your hero sections.
          </p>
        </div>
      </section>
    </div>
  );
};

export default BackgroundPathsDemo;