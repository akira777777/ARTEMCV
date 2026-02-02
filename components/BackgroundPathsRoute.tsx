"use client"

import React from 'react';
import BackgroundPaths from './BackgroundPaths';

const BackgroundPathsRoute: React.FC = () => {
  const handleButtonClick = () => {
    // Scroll to the next section or navigate
    document.getElementById('demo-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen">
      <BackgroundPaths
        title="Background Paths"
        subtitle="Experience the beauty of animated vector paths creating dynamic visual flows that captivate and inspire"
        buttonText="Explore Features"
        onButtonClick={handleButtonClick}
      />
      
      {/* Demo content section */}
      <section 
        id="demo-section" 
        className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"
      >
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-white">
              Component Features
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400">
              Discover what makes this animated background component special
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Smooth Animations",
                description: "Fluid SVG path animations powered by Framer Motion with spring physics",
                icon: "✨"
              },
              {
                title: "Dark Mode Ready",
                description: "Automatically adapts to your theme with seamless light/dark mode support",
                icon: "🌙"
              },
              {
                title: "Fully Responsive",
                description: "Looks great on all devices from mobile to desktop screens",
                icon: "📱"
              },
              {
                title: "Accessible",
                description: "Built with accessibility in mind including proper ARIA attributes",
                icon: "♿"
              },
              {
                title: "Performance Optimized",
                description: "Efficient rendering with memoization and optimized animations",
                icon: "⚡"
              },
              {
                title: "Easy to Customize",
                description: "Flexible props system for easy integration into any project",
                icon: "🎨"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-700"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
              Ready to Implement?
            </h3>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              Simply import the component and customize it to match your brand and design requirements.
            </p>
            
            <div className="bg-neutral-800 dark:bg-neutral-900 rounded-xl p-6 text-left max-w-2xl mx-auto">
              <pre className="text-green-400 text-sm overflow-x-auto">
{`import BackgroundPaths from '@/components/BackgroundPaths';

<BackgroundPaths
  title="Your Title"
  subtitle="Your subtitle"
  buttonText="Call to Action"
  onButtonClick={handleClick}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BackgroundPathsRoute;