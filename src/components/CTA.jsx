import React from 'react';
// Uncomment the next line if using Framer Motion
import { motion } from 'framer-motion';

const CTA = () => {
  const handleClick = () => {
    window.location.href = '/meal-planner'; // Navigate to meal planner page
  };

  // Framer Motion variants (optional)
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <section
      aria-labelledby="cta-heading"
      className="py-12 sm:py-20 bg-gradient-to-br from-green-500 via-emerald-600 to-emerald-700 text-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Use motion.h2 if Framer Motion is enabled, else regular h2 */}
        <h2
          // Uncomment for Framer Motion
          as={motion.h2}
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={{ ...fadeIn.transition, delay: 0.1 }}
          id="cta-heading"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 sm:mb-6 animate-fade-in"
        >
          Start Your Fitness Journey Today
        </h2>
        <p
          // Uncomment for Framer Motion
          as={motion.p}
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={{ ...fadeIn.transition, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-full sm:max-w-2xl mx-auto opacity-90 animate-fade-in delay-100"
        >
          Take control of your health by tracking calories, setting goals, and staying motivated.
        </p>
        <button
          // Uncomment for Framer Motion
          as={motion.button}
          initial={fadeIn.initial}
          animate={fadeIn.animate}
          transition={{ ...fadeIn.transition, delay: 0.3 }}
          onClick={handleClick}
          className="inline-block bg-white text-emerald-700 hover:bg-gray-100 font-semibold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in delay-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label="Join NutriTrack to start your fitness journey"
        >
          Join Now
        </button>
      </div>
    </section>
  );
};

export default CTA;