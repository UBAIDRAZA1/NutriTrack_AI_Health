import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Support Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-emerald-400">
              OUR SUPPORT
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-300">
              <p>Online Support Available</p>
              <p>24/7 Chat & Email</p>
              <p>Ubaid Raza</p>
            </div>
          </div>

          {/* NutriTrack Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-emerald-400">
              NUTRITRACK
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-300">
              <p className="hover:text-emerald-400 cursor-pointer transition-colors">
                About Us
              </p>
              <p className="hover:text-emerald-400 cursor-pointer transition-colors">
                Calorie Tracker
              </p>
              <p className="hover:text-emerald-400 cursor-pointer transition-colors">
                Meal Planner
              </p>
              <p className="hover:text-emerald-400 cursor-pointer transition-colors">
                Progress Hub
              </p>
              <p className="hover:text-emerald-400 cursor-pointer transition-colors">
                Resources
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-emerald-400">
              CONTACT US!
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-gray-300">
              <p>
                <a
                  href="mailto:ubaidraza3657767@gmail.com"
                  className="hover:text-emerald-400 transition-colors"
                >
                  ubaidraza3657767@gmail.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+923163657767"
                  className="hover:text-emerald-400 transition-colors"
                >
                  +92 3163657767
                </a>
              </p>
            </div>
          </div>

          {/* Social Media & Map Section */}
          <div>
            <div className="flex space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow NutriTrack on Facebook"
              >
                <Facebook
                  className="w-5 h-5 sm:w-6 sm:h-6 hover:text-emerald-400 cursor-pointer transition-colors"
                />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow NutriTrack on Twitter"
              >
                <Twitter
                  className="w-5 h-5 sm:w-6 sm:h-6 hover:text-emerald-400 cursor-pointer transition-colors"
                />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow NutriTrack on Instagram"
              >
                <Instagram
                  className="w-5 h-5 sm:w-6 sm:h-6 hover:text-emerald-400 cursor-pointer transition-colors"
                />
              </a>
            </div>
            <div className="mt-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.9936501092547!2d67.04748331500185!3d24.81233968407805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33ce3469ab795%3A0xca6003a18e0ecb05!2sEvergreen%20Cafe!5e0!3m2!1sen!2s!4v1727091234567"
                width="100%"
                height="150"
                className="sm:h-[150px] md:h-[200px] rounded-lg"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="NutriTrack Location - Evergreen Cafe"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-xs sm:text-sm text-gray-400">
          <p>Copyright © 2025 - NutriTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;