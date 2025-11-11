import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Award, Edit2, Save } from 'lucide-react';
import '../index.css'; // Fixed import (assumes index.css is in src)

const TrackCalories = () => {
  const [userProfile, setUserProfile] = useState({
    height: 170,
    weight: 70,
    age: 30,
    gender: 'male',
    activityLevel: 'moderate',
    dietaryRestrictions: ['halal'],
    goal: 'weight_loss',
  });
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mealSuggestions, setMealSuggestions] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [healthAnalysis, setHealthAnalysis] = useState('');
  const [weeklyData, setWeeklyData] = useState([
    { day: 'Mon', calories: 0 },
    { day: 'Tue', calories: 0 },
    { day: 'Wed', calories: 0 },
    { day: 'Thu', calories: 0 },
    { day: 'Fri', calories: 0 },
    { day: 'Sat', calories: 0 },
    { day: 'Sun', calories: 0 },
  ]);
  const [dietPlanInput, setDietPlanInput] = useState({
    preferences: '',
    mealsPerDay: 3,
    restrictions: ['halal'],
  });
  const [generatedDietPlan, setGeneratedDietPlan] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Mock data for testing
  const mockMealSuggestions = [
    { name: 'Grilled Chicken Salad', source: 'homemade', calories: 300, protein: 25, carbs: 15, fat: 10 },
    { name: 'Vegetable Stir Fry', source: 'homemade', calories: 250, protein: 10, carbs: 30, fat: 8 },
    { name: 'Baked Fish', source: 'restaurant', calories: 400, protein: 30, carbs: 10, fat: 15 },
  ];

  const mockDietPlan = [
    {
      day: 'Monday',
      meals: [
        { name: 'Oatmeal', calories: 200, protein: 8, carbs: 30, fat: 5, source: 'homemade' },
        { name: 'Grilled Chicken', calories: 300, protein: 25, carbs: 10, fat: 10, source: 'homemade' },
        { name: 'Vegetable Soup', calories: 150, protein: 5, carbs: 20, fat: 3, source: 'homemade' },
      ],
      totalCalories: 650,
      healthAnalysis: 'Balanced meals with adequate protein and low fat.',
    },
    {
      day: 'Tuesday',
      meals: [
        { name: 'Fruit Smoothie', calories: 200, protein: 6, carbs: 35, fat: 4, source: 'homemade' },
        { name: 'Baked Fish', calories: 400, protein: 30, carbs: 10, fat: 15, source: 'restaurant' },
        { name: 'Salad', calories: 100, protein: 3, carbs: 15, fat: 2, source: 'homemade' },
      ],
      totalCalories: 700,
      healthAnalysis: 'Good mix of nutrients, focus on hydration.',
    },
  ];

  // Compute daily calorie target using useMemo to avoid infinite loops
  const dailyCalorieTarget = useMemo(() => {
    const { weight, height, age, gender, activityLevel, goal } = userProfile;
    if (!weight || !height || !age) {
      return 2000; // Default value if fields are missing
    }
    let bmr =
      gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    let target = bmr * (activityMultipliers[activityLevel] || 1.55);
    if (goal === 'weight_loss') target -= 500;
    if (goal === 'muscle_gain') target += 300;
    return Math.round(target);
  }, [userProfile]);

  // Fetch meal suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchQuery) {
        setMealSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const filteredMeals = mockMealSuggestions.filter((meal) =>
          meal.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filteredMeals.length === 0) {
          setError('No meals found for your search. Try another term.');
          setTimeout(() => setError(null), 5000);
        } else {
          setMealSuggestions(filteredMeals);
          setSuccessMessage('Meal suggestions loaded!');
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      } catch (error) {
        console.error('Error fetching meal suggestions:', error);
        setError('Failed to load meal suggestions. Please try again.');
        setTimeout(() => setError(null), 5000);
      } finally {
        setIsLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Nutrition coach
  const handleChat = async () => {
    if (!chatInput) {
      setError('Please enter a question for the coach.');
      setTimeout(() => setError(null), 5000);
      return;
    }
    setIsLoading(true);
    try {
      setChatResponse(
        `For "${chatInput}", try a balanced meal like Grilled Chicken Salad (300 kcal, 25g protein) or consult a dietitian for personalized advice.`
      );
      setSuccessMessage('Coach response loaded!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error in nutrition coach:', error);
      setError('Failed to get coach response. Try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Log meal and update points
  const logMeal = (meal) => {
    if (!meal?.name || !meal?.calories) {
      setError('Invalid meal data. Please try again.');
      setTimeout(() => setError(null), 5000);
      return;
    }
    const updatedMeals = [...loggedMeals, { ...meal, timestamp: new Date().toISOString() }];
    setLoggedMeals(updatedMeals);
    const newConsumed = caloriesConsumed + meal.calories;
    setCaloriesConsumed(newConsumed);
    if (meal.calories < 500) {
      setPoints((prev) => {
        const newPoints = prev + 10;
        console.log(`Points increased to ${newPoints} for meal: ${meal.name}`);
        return newPoints;
      });
    }
    const today = new Date().toLocaleString('en-US', { weekday: 'short' });
    const updatedWeeklyData = weeklyData.map((day) =>
      day.day === today ? { ...day, calories: day.calories + meal.calories } : day
    );
    setWeeklyData(updatedWeeklyData);
    setSuccessMessage(`Meal "${meal.name}" logged successfully!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Generate diet plan
  const generateDietPlan = async () => {
    if (!dietPlanInput.preferences) {
      setError('Please enter your diet preferences (e.g., vegetarian).');
      setTimeout(() => setError(null), 5000);
      return;
    }
    setIsLoading(true);
    try {
      setGeneratedDietPlan(mockDietPlan);
      setSuccessMessage('Diet plan generated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error generating diet plan:', error);
      setError('Failed to generate diet plan. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Health analysis
  const analyzeHealth = async () => {
    setIsLoading(true);
    try {
      setHealthAnalysis(
        `Your health status is good! You've consumed ${caloriesConsumed} kcal out of ${dailyCalorieTarget} kcal. You've earned ${points} points. Keep logging low-calorie meals to earn more!`
      );
      setSuccessMessage('Health analysis completed!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error analyzing health:', error);
      setError('Failed to analyze health. Try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (['height', 'weight', 'age'].includes(name)) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        setError('Please enter a valid positive number.');
        setTimeout(() => setError(null), 5000);
        return;
      }
      if (name === 'height' && (numValue < 50 || numValue > 300)) {
        setError('Height must be between 50 and 300 cm.');
        setTimeout(() => setError(null), 5000);
        return;
      }
      if (name === 'weight' && (numValue < 30 || numValue > 200)) {
        setError('Weight must be between 30 and 200 kg.');
        setTimeout(() => setError(null), 5000);
        return;
      }
      if (name === 'age' && (numValue < 10 || numValue > 100)) {
        setError('Age must be between 10 and 100 years.');
        setTimeout(() => setError(null), 5000);
        return;
      }
    }
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile
  const saveProfile = () => {
    const { height, weight, age } = userProfile;
    if (!height || !weight || !age) {
      setError('Please fill in height, weight, and age.');
      setTimeout(() => setError(null), 5000);
      return;
    }
    setSuccessMessage('Profile saved successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
    setIsEditingProfile(false);
  };

  // Add/remove dietary restrictions
  const addProfileRestriction = (restriction) => {
    if (!restriction.trim()) return;
    setUserProfile((prev) => ({
      ...prev,
      dietaryRestrictions: [...new Set([...prev.dietaryRestrictions, restriction.trim()])],
    }));
  };

  const removeProfileRestriction = (restriction) => {
    setUserProfile((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter((r) => r !== restriction),
    }));
  };

  const handleDietPlanInputChange = (e) => {
    const { name, value } = e.target;
    setDietPlanInput((prev) => ({ ...prev, [name]: value }));
  };

  const addDietaryRestriction = (restriction) => {
    if (!restriction.trim()) return;
    setDietPlanInput((prev) => ({
      ...prev,
      restrictions: [...new Set([...prev.restrictions, restriction.trim()])],
    }));
  };

  const removeDietaryRestriction = (restriction) => {
    setDietPlanInput((prev) => ({
      ...prev,
      restrictions: prev.restrictions.filter((r) => r !== restriction),
    }));
  };

  // Share progress on X
  const shareProgress = () => {
    const text = `My daily progress: Consumed ${caloriesConsumed} kcal, Remaining ${Math.max(0, dailyCalorieTarget - caloriesConsumed)} kcal! Points: ${points} #Fitness #Health`;
    window.open(`https://x.com/intent/post?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Track Calories</h1>

      {error && (
        <div className="mb-4 text-red-600 p-3 bg-red-100 rounded-lg animate-pulse text-center">{error}</div>
      )}

      {successMessage && (
        <div className="mb-4 text-green-600 p-3 bg-green-100 rounded-lg animate-fadeIn text-center">{successMessage}</div>
      )}

      {/* User Profile */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-200 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-700">Your Profile</h2>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="text-emerald-600 hover:text-emerald-800 transition-colors"
            title={isEditingProfile ? 'Save' : 'Edit'}
          >
            {isEditingProfile ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          </button>
        </div>
        {!isEditingProfile ? (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-medium">Height:</span> {userProfile.height} cm</p>
            <p><span className="font-medium">Weight:</span> {userProfile.weight} kg</p>
            <p><span className="font-medium">Age:</span> {userProfile.age}</p>
            <p><span className="font-medium">Gender:</span> {userProfile.gender}</p>
            <p><span className="font-medium">Activity:</span> {userProfile.activityLevel}</p>
            <p><span className="font-medium">Goal:</span> {userProfile.goal.replace('_', ' ')}</p>
            <p className="col-span-2"><span className="font-medium">Restrictions:</span> {userProfile.dietaryRestrictions.join(', ')}</p>
            <p className="col-span-2"><span className="font-medium">Target:</span> {dailyCalorieTarget} kcal</p>
            <p><span className="font-medium">Consumed:</span> {caloriesConsumed} kcal</p>
            <p><span className="font-medium">Remaining:</span> {Math.max(0, dailyCalorieTarget - caloriesConsumed)} kcal</p>
            <p><span className="font-medium">Points:</span> {points} <Award className="inline w-4 h-4 text-yellow-500" /></p>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <input
              type="number"
              name="height"
              value={userProfile.height}
              onChange={handleProfileChange}
              placeholder="Height (cm)"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
              min="50"
              max="300"
            />
            <input
              type="number"
              name="weight"
              value={userProfile.weight}
              onChange={handleProfileChange}
              placeholder="Weight (kg)"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
              min="30"
              max="200"
            />
            <input
              type="number"
              name="age"
              value={userProfile.age}
              onChange={handleProfileChange}
              placeholder="Age"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
              min="10"
              max="100"
            />
            <select
              name="gender"
              value={userProfile.gender}
              onChange={handleProfileChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select
              name="activityLevel"
              value={userProfile.activityLevel}
              onChange={handleProfileChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
            <select
              name="goal"
              value={userProfile.goal}
              onChange={handleProfileChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="maintenance">Maintenance</option>
              <option value="muscle_gain">Muscle Gain</option>
            </select>
            <div className="flex flex-wrap gap-1">
              {userProfile.dietaryRestrictions.map((r, i) => (
                <span key={i} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs flex items-center">
                  {r}
                  <button onClick={() => removeProfileRestriction(r)} className="ml-1 text-red-600">
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add restriction, press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  addProfileRestriction(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={saveProfile}
              className="w-full bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-all"
            >
              Save Profile
            </button>
          </div>
        )}
      </div>

      {/* Meal Logging */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Log a Meal</h2>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meals, e.g., grilled chicken"
            className="w-full p-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Meal Suggestions */}
      {mealSuggestions.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Meal Suggestions</h2>
          <div className="space-y-3">
            {mealSuggestions.map((meal, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all hover:-translate-y-1">
                <h3 className="text-md font-semibold text-gray-800">{meal.name}</h3>
                <p className="text-gray-600 text-sm">{meal.source}</p>
                <p className="text-gray-600 text-sm">{meal.calories} kcal | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g</p>
                <button
                  onClick={() => logMeal(meal)}
                  className="mt-2 bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-all text-sm"
                >
                  Log Meal
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nutrition Coach */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Nutrition Coach</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask, e.g., What should I eat for lunch?"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <button
            onClick={handleChat}
            className="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-all text-sm"
          >
            Send
          </button>
        </div>
        {chatResponse && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm animate-fadeInUp">
            <p className="text-gray-800">{chatResponse}</p>
          </div>
        )}
      </div>

      {/* Diet Plan Generator */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Generate Diet Plan</h2>
        <div className="space-y-3">
          <input
            type="text"
            name="preferences"
            value={dietPlanInput.preferences}
            onChange={handleDietPlanInputChange}
            placeholder="Preferences (e.g., vegetarian)"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <select
            name="mealsPerDay"
            value={dietPlanInput.mealsPerDay}
            onChange={handleDietPlanInputChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
          >
            <option value={2}>2 Meals</option>
            <option value={3}>3 Meals</option>
            <option value={4}>4 Meals</option>
            <option value={5}>5 Meals</option>
          </select>
          <div className="flex flex-wrap gap-1">
            {dietPlanInput.restrictions.map((r, i) => (
              <span key={i} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs flex items-center">
                {r}
                <button onClick={() => removeDietaryRestriction(r)} className="ml-1 text-red-600">
                  &times;
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add restriction, press Enter"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                addDietaryRestriction(e.target.value);
                e.target.value = '';
              }
            }}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <button
            onClick={generateDietPlan}
            className="w-full bg-emerald-600 text-white p-2 rounded-lg font-bold hover:bg-emerald-700 transition-all text-sm"
          >
            Generate Plan
          </button>
        </div>
        {generatedDietPlan && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg max-h-60 overflow-y-auto text-sm">
            {generatedDietPlan.map((dayPlan, index) => (
              <div key={index} className="mb-3">
                <h4 className="text-sm font-medium">{dayPlan.day}</h4>
                <p>Total: {dayPlan.totalCalories} kcal</p>
                <ul className="list-disc pl-4 text-xs">
                  {dayPlan.meals.map((meal, idx) => (
                    <li key={idx}>
                      {meal.name} ({meal.calories} kcal, P: {meal.protein}g, C: {meal.carbs}g, F: {meal.fat}g, {meal.source})
                    </li>
                  ))}
                </ul>
                <p className="text-xs italic mt-1">{dayPlan.healthAnalysis}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Health Analysis */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Health Analysis</h2>
        <button
          onClick={analyzeHealth}
          className="w-full bg-emerald-600 text-white p-2 rounded-lg font-bold hover:bg-emerald-700 transition-all text-sm mb-3"
        >
          Analyze Health
        </button>
        {healthAnalysis && (
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <p>{healthAnalysis}</p>
          </div>
        )}
        <button
          onClick={shareProgress}
          className="mt-3 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm"
        >
          Share on X
        </button>
      </div>

      {/* Weekly Progress Chart */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Weekly Progress</h2>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Logged Meals */}
      {loggedMeals.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Logged Meals</h2>
          <div className="space-y-2 max-h-32 overflow-y-auto text-sm">
            {loggedMeals.map((meal, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded-lg">
                <p className="font-semibold">{meal.name}</p>
                <p>{meal.calories} kcal | {new Date(meal.timestamp).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default TrackCalories;