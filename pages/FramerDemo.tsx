import React from 'react';
import FramerIntegration from '../components/FramerIntegration';
import DefaultLayout from '../components/DefaultLayout';

const FramerDemo: React.FC = () => {
  return (
    <DefaultLayout>
      <main>
        <FramerIntegration />
      </main>
    </DefaultLayout>
  );
};

export default FramerDemo;