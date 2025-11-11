import React from 'react';
import { useLanguage } from './LanguageContext';
import { Link } from 'react-router-dom'; // <-- Yeh import zaroori hai

const KeyFeatures = () => {
  const { language, translations } = useLanguage();

  const keyFeatures = [
    {
      name: translations[language]?.features?.smartSearch?.name || 'Smart Nutrition Search',
      description: translations[language]?.features?.smartSearch?.description || 'Instantly find detailed nutritional info for any food or dish.',
      price: translations[language]?.features?.free || 'Free',
      color: 'bg-gradient-to-r from-green-400 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop',
      link: '/track-calories',
    },
    {
      name: translations[language]?.features?.mealGenerator?.name || 'AI Meal Planner',
      description: translations[language]?.features?.mealGenerator?.description || 'Get personalized meal plans tailored to your dietary needs and goals.',
      price: translations[language]?.features?.free || 'Free',
      color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&auto=format&fit=crop',
      link: '/meal-planner',
    },
    {
      name: translations[language]?.features?.progressTracker?.name || 'Health Progress Tracker',
      description: translations[language]?.features?.progressTracker?.description || 'Track your health journey with insightful charts and analytics.',
      price: translations[language]?.features?.free || 'Free',
      color: 'bg-gradient-to-r from-teal-600 to-green-400',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=300&auto=format&fit=crop',
      link: '/progress-hub',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-black text-center mb-12 text-gray-800 animate-slideInUp">
          {translations[language]?.keyFeaturesTitle || 'KEY FEATURES'}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {keyFeatures.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="block text-left bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-fadeInUp"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Top colored bar */}
              <div className={`${feature.color} h-4`}></div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{feature.name}</h3>
                  {feature.price && (
                    <span className="bg-gradient-to-r from-orange-400 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {feature.price}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{feature.description}</p>

                <div className="w-full h-32 bg-gray-200 rounded-xl mb-4 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;