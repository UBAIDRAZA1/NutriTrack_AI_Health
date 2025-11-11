import React from 'react';
import { Phone, X } from 'lucide-react';

const HoursPopup = ({ showHoursPopup, setShowHoursPopup }) => {
  const hoursOfOperation = [
    { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
    { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
    { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
    { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
    { day: 'Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: 'Closed' },
  ];

  return (
    <>
      {showHoursPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Support Hours</h2>
              <button
                onClick={() => setShowHoursPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              {hoursOfOperation.map((day, index) => (
                <div key={index} className="flex justify-between text-gray-700">
                  <span className="font-semibold">{day.day}</span>
                  <span>{day.hours}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.open("tel:+921234567890", "_blank")}
              className="w-full bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Support
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HoursPopup;