import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('English');

  const translations = {
    English: {
      home: 'Home',
      trackCalories: 'Track Calories',
      planMeals: 'Meal Planner',
      progressHub: 'Progress Hub',
      resources: 'Resources',
      getStarted: 'Get Started',
      exploreOptions: 'Explore Options',
      startForFree: 'Start for Free',
      findSupport: 'Find Support',
    },
    
    // Add other languages (French, German, Arabic, Urdu) similarly
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);