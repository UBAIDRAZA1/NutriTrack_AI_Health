import React from 'react';

const VisualShowcase = () => {
  const handleWatchDemo = () => {
    window.open('https://www.youtube.com/watch?v=j7CcaUZrUoE', '_blank');
  };

  return (
    <section className="py-12 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-8 sm:mb-12 text-gray-800">
          NUTRITRACK IN ACTION
        </h2>
        <div className="relative">
          <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 rounded-xl overflow-hidden">
            <iframe
              className="w-full h-full rounded-xl"
              src="https://www.youtube.com/embed/j7CcaUZrUoE"
              title="Healthy Eating Style - Nutrition Tracking with NutriTrack"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => console.log('Iframe loaded successfully')}
              onError={(e) => console.error('Iframe failed to load:', e)}
            ></iframe>
            <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-red-600 font-semibold text-center p-4 hidden data-[error]:flex">
              Video failed to load. Check your internet or try a different browser.
            </div>
          </div>
          <button
            onClick={handleWatchDemo}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-base sm:text-lg hover:bg-emerald-700 transition-colors shadow-lg"
          >
            WATCH DEMO
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Discover how to track calories and embrace a healthy eating style with this engaging tutorial, powered by NutriTrack’s AI!
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisualShowcase;