import React, { useState } from "react";
import { motion } from "framer-motion";

// Resource Data
const resourcesData = [
  {
    category: "Nutritional Database Links",
    items: [
      {
        title: "USDA FoodData Central",
        link: "https://fdc.nal.usda.gov/",
        description: "Comprehensive nutrition data with APIs for developers."
      },
      {
        title: "Open Food Facts",
        link: "https://world.openfoodfacts.org/",
        description: "Crowdsourced database of food products and nutrition values."
      },
      {
        title: "Nutritionix API",
        link: "https://www.nutritionix.com/business/api",
        description: "Detailed nutrition information with easy-to-use API."
      },
      {
        title: "Edamam API",
        link: "https://developer.edamam.com/",
        description: "Nutrition analysis and recipe search API."
      }
    ]
  },
  {
    category: "Calorie Counting Guides",
    items: [
      {
        title: "Macronutrient Basics",
        description: "1g protein = 4 cal, 1g fat = 9 cal, 1g carbs = 4 cal."
      },
      {
        title: "Calorie Counting 101",
        link: "https://www.healthline.com/nutrition/how-to-count-macros",
        description: "Step-by-step guide to counting calories and macros."
      }
    ]
  },
  {
    category: "Health & Fitness Articles",
    items: [
      {
        title: "What is Calorie Deficit?",
        link: "https://www.medicalnewstoday.com/articles/calorie-deficit",
        description: "Learn how calorie deficit helps with weight loss."
      },
      {
        title: "Balanced Diet Explained",
        link: "https://www.bbcgoodfood.com/howto/guide/balanced-diet",
        description: "Tips on creating a balanced, healthy diet."
      }
    ]
  },
  {
    category: "FAQs",
    items: [
      {
        title: "What is BMI?",
        description: "BMI stands for Body Mass Index, a measure of body fat based on height & weight."
      },
      {
        title: "What are Macros?",
        description: "Macros = Protein, Carbs, and Fat. The 3 main sources of calories."
      },
      {
        title: "Is all fat unhealthy?",
        description: "No, healthy fats like omega-3 are essential for the body."
      }
    ]
  },
  {
    category: "Usage Guide",
    items: [
      {
        title: "How to Use This Website",
        description: "Search food items, scan barcodes, and get instant calorie/nutrition breakdown."
      },
      {
        title: "Scan Feature",
        description: "Use your phone’s camera to scan packaged food and fetch nutrition data."
      }
    ]
  },
  {
    category: "Glossary",
    items: [
      { title: "BMI", description: "Body Mass Index, used to estimate body fat." },
      { title: "BMR", description: "Basal Metabolic Rate – calories burned at rest." },
      { title: "Macros", description: "Proteins, Carbs, and Fats." }
    ]
  },
  {
    category: "Downloadable Content",
    items: [
      {
        title: "Sample Diet Chart PDF",
        link: "#",
        description: "Download a free diet chart to kickstart your journey."
      },
      {
        title: "Beginner's Nutrition Guide",
        link: "#",
        description: "Printable guide covering basics of healthy eating."
      }
    ]
  }
];

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <section className="py-16 bg-gray-50" id="resources">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Resources & Guides
        </h2>

        {/* Search Bar */}
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {resourcesData.map((section, idx) => {
            const filteredItems = section.items.filter(
              (item) =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h3 className="text-2xl font-semibold mb-6 text-green-600">
                  {section.category}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item, i) => (
                    <motion.div
                      key={i}
                      className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
                      whileHover={{ scale: 1.05 }}
                    >
                      <h4 className="text-lg font-bold mb-2 text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                          Visit
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Resources;
