import React from 'react';
import Hero from './Hero';
import KeyFeatures from './KeyFeatures';
import AdvancedFeatures from './AdvancedFeatures';
import VisualShowcase from './VisualShowcase';
import Testimonials from './Testimonials';
import CTA from './CTA';

const Home = ({ showHeroOrderOptions, setShowHeroOrderOptions }) => {
  return (
    <div className="min-h-screen bg-white">
      <Hero
        showHeroOrderOptions={showHeroOrderOptions}
        setShowHeroOrderOptions={setShowHeroOrderOptions}
      />
      <KeyFeatures />
      <AdvancedFeatures />
      <VisualShowcase />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Home;