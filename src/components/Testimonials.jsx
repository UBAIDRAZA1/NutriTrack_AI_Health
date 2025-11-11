import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Ali Khan',
    text: 'NutriTrack helped me lose 10kg with its easy-to-use calorie tracker!',
    image: 'https://via.placeholder.com/50x50?text=Ali',
  },
  {
    name: 'Sana Malik',
    text: 'The AI meal planner is a game-changer for my busy lifestyle.',
    image: 'https://via.placeholder.com/50x50?text=Sana',
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 sm:py-20 bg-gradient-to-r from-emerald-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-8 sm:mb-12 text-gray-800 tracking-tight">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="rounded-3xl p-6 sm:p-8 bg-white border border-gray-200 shadow-lg sm:shadow-2xl hover:shadow-emerald-300 transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              role="article"
              aria-labelledby={`testimonial-${index}`}
            >
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <img
                  src={testimonial.image}
                  alt={`Profile picture of ${testimonial.name}`}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/50x50?text=User';
                  }}
                />
                <h3
                  id={`testimonial-${index}`}
                  className="text-lg sm:text-xl font-semibold text-emerald-700"
                >
                  {testimonial.name}
                </h3>
              </div>
              <p className="text-gray-600 text-sm sm:text-lg italic leading-relaxed">
                “{testimonial.text}”
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;