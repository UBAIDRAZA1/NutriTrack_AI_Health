import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { Camera, List } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const MealPlanner = () => {
  const { language, translations } = useLanguage();
  const [dietaryPrefs, setDietaryPrefs] = useState('');
  const [calorieGoal, setCalorieGoal] = useState('');
  const [mealPlan, setMealPlan] = useState(null);
  const [groceryList, setGroceryList] = useState([]);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [bmi, setBmi] = useState(null);
  const [suggestedCalories, setSuggestedCalories] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoAnalysis, setPhotoAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
  const [email, setEmail] = useState(localStorage.getItem('email') || null);

  // Initialize Gemini API
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY is not defined in .env');
    setError(translations[language]?.apiKeyMissing || 'API key is missing. Please configure VITE_GEMINI_API_KEY in .env.');
  }
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
  const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' }) : null;

  // Fetch saved meal plans from backend
  useEffect(() => {
    const fetchMealPlans = async () => {
      if (!userId || !email) {
        setError(translations[language]?.loginRequired || '');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const response = await axios.get('http://localhost:5001/api/diet/plans', {
          headers: { 'x-auth-token': token },
          timeout: 0 // Disable timeout to prevent "timeout exceeded" error
        });
        if (response.data.dietPlans.length > 0) {
          setMealPlan(response.data.dietPlans[response.data.dietPlans.length - 1]);
          const ingredients = response.data.dietPlans.reduce((acc, plan) => [
            ...acc,
            ...(plan.breakfast?.ingredients || []),
            ...(plan.lunch?.ingredients || []),
            ...(plan.dinner?.ingredients || []),
          ], []);
          setGroceryList([...new Set(ingredients)]);
        }
        console.log('Fetched Meal Plans:', response.data);
      } catch (err) {
        console.error('Error fetching meal plans:', err.response?.data || err.message);
        setError(translations[language]?.fetchError || 'Failed to fetch meal plans. Please try again.');
      }
    };
    fetchMealPlans();
  }, [userId, email, language, translations]);

  // BMI and Calorie Calculation (using Mifflin-St Jeor for BMR)
  const calculateBMIAndCalories = () => {
    if (!height || !weight || !age || !gender || !activityLevel) {
      setError(translations[language]?.enterAllDetails || 'Please enter height, weight, age, gender, and activity level.');
      return;
    }
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);

    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === 'female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      setError(translations[language]?.selectGender || 'Please select gender.');
      return;
    }

    let activityMultiplier;
    switch (activityLevel) {
      case 'sedentary':
        activityMultiplier = 1.2;
        break;
      case 'lightlyActive':
        activityMultiplier = 1.375;
        break;
      case 'moderatelyActive':
        activityMultiplier = 1.55;
        break;
      case 'veryActive':
        activityMultiplier = 1.725;
        break;
      case 'superActive':
        activityMultiplier = 1.9;
        break;
      default:
        activityMultiplier = 1.2;
    }

    const suggestion = Math.round(bmr * activityMultiplier);
    setSuggestedCalories(suggestion);
    setCalorieGoal(suggestion);
    setError('');
    console.log('Calculated BMI:', bmiValue, 'Suggested Calories:', suggestion);
  };

  // Meal Plan Generator
  const generateMealPlan = async () => {
    if (!dietaryPrefs || !calorieGoal) {
      setError(translations[language]?.enterPrefsAndCalories || 'Please select dietary preferences and enter a calorie goal.');
      return;
    }

    if (!genAI || !model) {
      setError(translations[language]?.apiKeyMissing || 'API key is missing. Please configure VITE_GEMINI_API_KEY in .env.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const prompt = `Generate a daily meal plan for a person with dietary preference: ${dietaryPrefs}, calorie goal: ${calorieGoal}. 
      Provide breakfast, lunch, and dinner with name, calories, and ingredients in strict JSON format:
      {
        "breakfast": { "name": "", "calories": 0, "ingredients": [] },
        "lunch": { "name": "", "calories": 0, "ingredients": [] },
        "dinner": { "name": "", "calories": 0, "ingredients": [] }
      }
      Ensure the total calories are close to the goal and respect the dietary preferences.`;
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
      });
      const responseText = await result.response.text();
      console.log('Raw Meal Plan Response:', responseText);

      let cleanedText = responseText.replace(/```json\n|\n```/g, '').trim();
      let parsedPlan;
      try {
        parsedPlan = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError, 'Response:', cleanedText);
        throw new Error('Invalid response format from API');
      }

      if (!parsedPlan.breakfast || !parsedPlan.lunch || !parsedPlan.dinner) {
        throw new Error('Incomplete meal plan data received');
      }

      setMealPlan(parsedPlan);

      const ingredients = [
        ...(parsedPlan.breakfast?.ingredients || []),
        ...(parsedPlan.lunch?.ingredients || []),
        ...(parsedPlan.dinner?.ingredients || []),
      ];
      setGroceryList([...new Set(ingredients)]);

      setIsLoading(false);

      // Save to backend (non-blocking for UI)
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const response = await axios.post(
          'http://localhost:5001/api/diet/add-plan',
          { planName: `Meal Plan ${new Date().toLocaleDateString()}`, ...parsedPlan },
          { headers: { 'x-auth-token': token }, timeout: 0 } // Disable timeout
        );
        console.log('Saved to Backend:', response.data);
      } catch (err) {
        console.error('Error saving meal plan:', err.response?.data || err.message);
        setError(translations[language]?.saveError || '');
      }
    } catch (error) {
      console.error('Failed to generate meal plan:', error);
      let errorMessage = translations[language]?.mealPlanError || 'Failed to generate meal plan. ';
      if (error.message.includes('API key')) {
        errorMessage += 'Please check your API key in .env (VITE_GEMINI_API_KEY).';
      } else if (error.message.includes('Quota')) {
        errorMessage += 'API quota exceeded. Please try again later or check Google Cloud Console.';
      } else if (error.message.includes('Invalid response')) {
        errorMessage += 'Invalid response from API. Please try again.';
      } else {
        errorMessage += `Unexpected error: ${error.message}`;
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Photo Analysis
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError(translations[language]?.noFileSelected || 'No file selected.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError(translations[language]?.invalidFileType || 'Please upload a valid image file (JPEG/PNG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(translations[language]?.fileTooLarge || 'Image file is too large. Please upload an image smaller than 5MB.');
      return;
    }

    if (!genAI || !model) {
      setError(translations[language]?.apiKeyMissing || 'API key is missing. Please configure VITE_GEMINI_API_KEY in .env.');
      return;
    }

    setPhoto(URL.createObjectURL(file));
    setIsLoading(true);
    setError('');
    setPhotoAnalysis(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        console.log('Base64 Image Length:', base64Image.length);

        const prompt = `You are a specialized meal analysis agent. Analyze the image to identify the meal components and estimate the total nutritional breakdown for the entire meal shown. If the image does not clearly show a meal (e.g., contains people, landscapes, or non-food objects), return an empty object {}. Provide details based on standard USDA or similar database values, summing up for all visible items. Ensure consistent output for similar meals. Output in strict JSON format only:
        {
          "description": "Brief description of the meal and its main components",
          "calories": number (total estimated calories for the meal),
          "protein": number (total grams),
          "carbs": number (total grams),
          "fat": number (total grams)
        }
        User profile:
        - Dietary preferences: ${dietaryPrefs || 'none'}
        - Calorie goal: ${calorieGoal || 'default'}
        If the meal does not match the dietary preferences (e.g., non-vegan food for vegan preference) or no meal is detected, return an empty object {}. Do not estimate values randomly; use standard nutritional data and reasonable portion sizes.`;
        
        try {
          const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Image, mimeType: file.type } }
          ], {
            generationConfig: { temperature: 0 }
          });
          const responseText = await result.response.text();
          console.log('Raw Photo Analysis Response:', responseText);

          let cleanedText = responseText.replace(/```json\n|\n```/g, '').trim();
          let analysis;
          try {
            analysis = JSON.parse(cleanedText);
          } catch (parseError) {
            console.error('JSON Parsing Error:', parseError, 'Response:', cleanedText);
            throw new Error('Invalid response format from API');
          }

          if (Object.keys(analysis).length === 0) {
            setError(translations[language]?.noFoodDetected || 'No meal detected in the image or it does not match your dietary preferences. Please upload a clear meal image.');
          } else {
            setPhotoAnalysis(analysis);
          }
        } catch (apiError) {
          console.error('Error analyzing photo:', apiError.response?.data || apiError.message);
          let errorMessage = translations[language]?.photoError || 'Failed to analyze photo. ';
          if (apiError.message.includes('API key')) {
            errorMessage += 'Please check your API key in .env (VITE_GEMINI_API_KEY).';
          } else if (apiError.message.includes('Quota')) {
            errorMessage += 'API quota exceeded. Please check Google Cloud Console.';
          } else if (apiError.message.includes('Invalid response')) {
            errorMessage += 'Invalid response from API. Please try again.';
          } else {
            errorMessage += `Unexpected error: ${apiError.message}`;
          }
          setError(errorMessage);
        }
        setIsLoading(false);
      };
      reader.onerror = () => {
        console.error('FileReader error');
        setError(translations[language]?.photoError || 'Failed to process image. Please try another.');
        setIsLoading(false);
      };
    } catch (error) {
      console.error('Error in photo upload:', error);
      setError(translations[language]?.photoError || `Failed to analyze photo: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateMealPlan();
  };

  // Calculate progress percentage based on calorieGoal if set, else arbitrary
  const getProgress = (value, type) => {
    if (!calorieGoal) return '50%'; // Default if no goal
    switch (type) {
      case 'calories':
        return `${(value / calorieGoal) * 100}%`;
      case 'protein':
        return `${(value / (calorieGoal * 0.2 / 4)) * 100}%`; // Rough estimate: 20% calories from protein, 4 cal/g
      case 'carbs':
        return `${(value / (calorieGoal * 0.5 / 4)) * 100}%`; // 50% from carbs
      case 'fat':
        return `${(value / (calorieGoal * 0.3 / 9)) * 100}%`; // 30% from fat
      default:
        return '50%';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-black text-center mb-12 text-gray-800 animate-slideInUp">
          {translations[language]?.mealPlanner?.title || 'AI Meal Planner'}
        </h2>

        {/* BMI & Calorie Section */}
        <div className="max-w-lg mx-auto mb-8 bg-white rounded-3xl shadow-xl p-6 animate-fadeInUp">
          <h3 className="text-2xl font-bold mb-4">{translations[language]?.bmiCalculator || 'BMI & Calorie Calculator'}</h3>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">{translations[language]?.height || 'Height (cm)'}</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">{translations[language]?.weight || 'Weight (kg)'}</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">{translations[language]?.age || 'Age (years)'}</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">{translations[language]?.gender || 'Gender'}</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">{translations[language]?.select || 'Select'}</option>
              <option value="male">{translations[language]?.male || 'Male'}</option>
              <option value="female">{translations[language]?.female || 'Female'}</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">{translations[language]?.activityLevel || 'Activity Level'}</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">{translations[language]?.select || 'Select'}</option>
              <option value="sedentary">{translations[language]?.sedentary || 'Sedentary (little or no exercise)'}</option>
              <option value="lightlyActive">{translations[language]?.lightlyActive || 'Lightly Active (light exercise 1-3 days/week)'}</option>
              <option value="moderatelyActive">{translations[language]?.moderatelyActive || 'Moderately Active (moderate exercise 3-5 days/week)'}</option>
              <option value="veryActive">{translations[language]?.veryActive || 'Very Active (hard exercise 6-7 days/week)'}</option>
              <option value="superActive">{translations[language]?.superActive || 'Super Active (very hard exercise & physical job)'}</option>
            </select>
          </div>
          <button
            onClick={calculateBMIAndCalories}
            className="w-full bg-gradient-to-r from-orange-400 to-emerald-500 text-white p-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 hover:from-orange-500 hover:to-emerald-600 shadow-md hover:shadow-lg"
          >
            {translations[language]?.calculate || 'Calculate BMI & Calories'}
          </button>
          {bmi && (
            <p className="mt-4 text-gray-700">
              {translations[language]?.bmi || 'BMI'}: <strong>{bmi}</strong>
            </p>
          )}
          {suggestedCalories && (
            <p className="mt-2 text-gray-700">
              {translations[language]?.suggestedCalories || 'Suggested Daily Calories'}: <strong>{suggestedCalories}</strong>
            </p>
          )}
          {error && <p className="mt-2 text-red-600 animate-fadeInUp">{error}</p>}
        </div>

        {/* Form Section */}
        <div className="max-w-lg mx-auto mb-12 bg-white rounded-3xl shadow-xl p-6 animate-fadeInUp">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">{translations[language]?.dietaryPrefs || 'Dietary Preferences'}</label>
              <select
                value={dietaryPrefs}
                onChange={(e) => setDietaryPrefs(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">{translations[language]?.select || 'Select'}</option>
                {/* <option value="vegan">{translations[language]?.vegan || 'Vegan'}</option>
                <option value="keto">{translations[language]?.keto || 'Keto'}</option>
                <option value="gluten-free">{translations[language]?.glutenFree || 'Gluten-Free'}</option> */}
                <option value="halal">{translations[language]?.halal || 'Halal'}</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">{translations[language]?.calorieGoal || 'Calorie Goal'}</label>
              <input
                type="number"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-400 to-emerald-500 text-white p-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 hover:from-orange-500 hover:to-emerald-600 shadow-md hover:shadow-lg"
            >
              {translations[language]?.generateMealPlan || 'Generate Meal Plan'}
            </button>
          </form>
          <div className="mt-4">
            <label className="block text-gray-700 font-bold mb-2">{translations[language]?.uploadPhoto || 'Upload Food Photo'}</label>
            <div className="flex items-center justify-center">
              <input
                type="file"
                accept="image/jpeg,image/png"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center bg-gradient-to-r from-orange-400 to-emerald-500 text-white p-3 rounded-lg font-semibold shadow-md hover:from-orange-500 hover:to-emerald-600 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <Camera className="w-6 h-6 mr-2" />
                {translations[language]?.uploadPhoto || 'Upload Food Photo'}
              </label>
            </div>
          </div>
          {error && <p className="mt-2 text-red-600 animate-fadeInUp">{error}</p>}
        </div>

        {/* Photo Analysis Display - Updated to match the picture */}
        {photoAnalysis && (
          <div className="max-w-lg mx-auto mb-12 bg-gray-800 rounded-3xl shadow-xl overflow-hidden animate-fadeInUp">
            <div className="relative">
              {photo && <img src={photo} alt="Uploaded meal" className="w-full h-64 object-cover" />}
              <div className="absolute top-4 left-4 bg-white/90 text-gray-800 font-bold px-4 py-2 rounded-xl shadow-md">
                {photoAnalysis.calories} Cal
                <div className="text-sm">Calories</div>
                <div className="mt-1 w-24 h-1 bg-orange-200 rounded-full">
                  <div className="h-1 bg-orange-500 rounded-full" style={{ width: getProgress(photoAnalysis.calories, 'calories') }}></div>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 text-gray-800 font-bold px-4 py-2 rounded-xl shadow-md">
                {photoAnalysis.carbs} gr
                <div className="text-sm">Carbs</div>
                <div className="mt-1 w-24 h-1 bg-red-200 rounded-full">
                  <div className="h-1 bg-red-500 rounded-full" style={{ width: getProgress(photoAnalysis.carbs, 'carbs') }}></div>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-white/90 text-gray-800 font-bold px-4 py-2 rounded-xl shadow-md">
                {photoAnalysis.protein} gr
                <div className="text-sm">Protein</div>
                <div className="mt-1 w-24 h-1 bg-pink-200 rounded-full">
                  <div className="h-1 bg-pink-500 rounded-full" style={{ width: getProgress(photoAnalysis.protein, 'protein') }}></div>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/90 text-gray-800 font-bold px-4 py-2 rounded-xl shadow-md">
                {photoAnalysis.fat} gr
                <div className="text-sm">Fat</div>
                <div className="mt-1 w-24 h-1 bg-red-200 rounded-full">
                  <div className="h-1 bg-red-500 rounded-full" style={{ width: getProgress(photoAnalysis.fat, 'fat') }}></div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-100/90 text-pink-800 font-semibold px-4 py-1 rounded-lg shadow-md">
                Scan Result
              </div>
            </div>
            <div className="bg-white p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Comprehensive meal analysis</h3>
              <p className="text-gray-600 mb-4">Understand your meals with detailed nutritional breakdowns</p>
              <button className="bg-brown-800 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-brown-900 transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Meal Plan Display */}
        {mealPlan && (
          <div className="grid md:grid-cols-3 gap-8 animate-fadeInUp">
            {Object.entries(mealPlan).map(([meal, details], index) => (
              <div key={index} className="bg-white rounded-3xl shadow-xl p-6 hover:scale-105 transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{details.name}</h3>
                <p className="text-gray-600 mb-2">{translations[language]?.calories || 'Calories'}: {details.calories}</p>
                <p className="text-gray-600">{translations[language]?.ingredients || 'Ingredients'}: {details.ingredients.join(', ')}</p>
              </div>
            ))}
          </div>
        )}

        {/* Grocery List */}
        {groceryList.length > 0 && (
          <div className="mt-12 bg-white rounded-3xl shadow-xl p-6 animate-fadeInUp">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <List className="w-6 h-6 mr-2" />
              {translations[language]?.groceryList || 'Grocery List'}
            </h3>
            <ul className="list-disc pl-6">
              {groceryList.map((item, index) => (
                <li key={index} className="text-gray-600">{item}</li>
              ))}
            </ul>
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50 animate-pulse-slower">
            <div className="animate-spin-slow w-16 h-16 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out; }
        .animate-slideInUp { animation: slideInUp 0.7s ease-out; }
        .animate-pulse-slower { animation: pulse-slower 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 6s linear infinite; }
      `}</style>
    </section>
  );
};

export default MealPlanner;