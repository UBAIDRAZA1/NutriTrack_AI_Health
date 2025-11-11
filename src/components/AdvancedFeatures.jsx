import React from 'react';
import { Utensils } from 'lucide-react';

const AdvancedFeatures = () => {
  const advancedFeatures = [
    {
      title: 'AI-PERSONALIZED DIET ENGINE',
      description: 'Custom diet plans based on your preferences and goals.',
      color: 'bg-green-400'
    },
    {
      title: 'ADVANCED IMAGE SCANNER',
      description: 'Scan food images to log calories automatically.',
      color: 'bg-green-400'
    },
    {
      title: 'SMART BARCODE INTEGRATION',
      description: 'Scan barcodes to get instant nutritional info.',
      color: 'bg-green-400'
    },
    {
      title: 'NUTRITION CHATBOT',
      description: 'Get instant answers to your nutrition queries.',
      color: 'bg-green-400'
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-black text-center mb-12 text-gray-800">
          ADVANCED FEATURES
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advancedFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-sm mb-2">{feature.title}</h3>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeatures;