import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { Trophy } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const ProgressHub = () => {
  const { language, translations } = useLanguage();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [calorieIntake, setCalorieIntake] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [badges, setBadges] = useState([]);
  const [calorieGoal, setCalorieGoal] = useState('');
  const [dietaryPrefs, setDietaryPrefs] = useState('');
  const [mealPlan, setMealPlan] = useState(null);
  const [userId, setUserId] = useState('');
  const [showFullHistory, setShowFullHistory] = useState(false);

  // BMI Ranges
  const bmiRanges = {
    underweight: '< 18.5',
    normal: '18.5 - 24.9',
    overweight: '25 - 29.9',
    obese: '≥ 30',
  };

  // Initialize userId and load data from LocalStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || 'default_user';
    setUserId(storedUserId);
    console.log('User ID:', storedUserId);

    const savedData = localStorage.getItem(`progressData_${storedUserId}`);
    const savedBadges = localStorage.getItem(`badges_${storedUserId}`);
    const savedCalorieGoal = localStorage.getItem('calorieGoal');
    const savedDietaryPrefs = localStorage.getItem('dietaryPrefs');
    const savedMealPlan = localStorage.getItem(`mealPlan_${storedUserId}`);

    console.log('Saved Progress Data:', savedData);
    console.log('Saved Badges:', savedBadges);
    console.log('Saved Calorie Goal:', savedCalorieGoal);
    console.log('Saved Dietary Prefs:', savedDietaryPrefs);
    console.log('Saved Meal Plan:', savedMealPlan);

    let allProgress = [];
    if (savedData) {
      try {
        allProgress = JSON.parse(savedData);
        if (!Array.isArray(allProgress)) {
          console.error('Progress data is not an array, resetting to []');
          allProgress = [];
        }
      } catch (error) {
        console.error('Error parsing progressData:', error);
        allProgress = [];
      }
    }
    setProgressData(allProgress);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const filteredProgress = allProgress.filter(entry => {
      try {
        const entryDate = new Date(entry.date.split('/').reverse().join('-'));
        return entryDate >= oneWeekAgo;
      } catch (error) {
        console.error('Error parsing date for entry:', entry, error);
        return false;
      }
    });
    setWeeklyProgress(filteredProgress);
    console.log('Weekly Progress:', filteredProgress);

    if (savedBadges) {
      try {
        setBadges(JSON.parse(savedBadges));
      } catch (error) {
        console.error('Error parsing badges:', error);
        setBadges([]);
      }
    }
    if (savedCalorieGoal) setCalorieGoal(savedCalorieGoal);
    if (savedDietaryPrefs) setDietaryPrefs(savedDietaryPrefs);
    if (savedMealPlan) {
      try {
        setMealPlan(JSON.parse(savedMealPlan));
      } catch (error) {
        console.error('Error parsing mealPlan:', error);
        setMealPlan(null);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (progressData.length > 0) {
      localStorage.setItem(`progressData_${userId}`, JSON.stringify(progressData));
      console.log('Saved progressData to LocalStorage:', progressData);
    }
    if (badges.length > 0) {
      localStorage.setItem(`badges_${userId}`, JSON.stringify(badges));
      console.log('Saved badges to LocalStorage:', badges);
    }
  }, [progressData, badges, userId]);

  // Calculate BMI
  const calculateBMI = (w, h) => {
    if (!w || !h) return 0;
    const heightInMeter = h / 100;
    return (w / (heightInMeter * heightInMeter)).toFixed(1);
  };

  // Health Advice
  const getHealthAdvice = (bmi) => {
    if (bmi < 18.5) return translations[language]?.underweightAdvice || 'Underweight - Eat more balanced meals!';
    if (bmi < 24.9) return translations[language]?.normalWeightAdvice || 'Normal weight - Keep it up!';
    if (bmi < 29.9) return translations[language]?.overweightAdvice || 'Overweight - Consider light exercise.';
    return translations[language]?.obeseAdvice || 'Obese - Consult a doctor for a diet plan.';
  };

  // Calorie Adherence Advice
  const getCalorieAdvice = (intake, goal) => {
    if (!intake || !goal) return translations[language]?.noCalorieData || 'Enter calorie intake to get advice.';
    const intakeNum = parseFloat(intake);
    const goalNum = parseFloat(goal);
    if (intakeNum <= goalNum * 0.9) return translations[language]?.underCalorieAdvice || 'You’re under your calorie goal. Consider eating more nutrient-dense foods.';
    if (intakeNum <= goalNum * 1.1) return translations[language]?.onTrackAdvice || 'Great job! You’re on track with your calorie goal.';
    return translations[language]?.overCalorieAdvice || 'You’ve exceeded your calorie goal. Try reducing portion sizes tomorrow.';
  };

  // Meal Plan Adherence
  const getMealPlanAdherence = (intake, mealPlanCalories) => {
    if (!intake || !mealPlanCalories) return translations[language]?.noMealPlanData || 'No meal plan data available.';
    const intakeNum = parseFloat(intake);
    const mealPlanNum = parseFloat(mealPlanCalories);
    if (intakeNum <= mealPlanNum * 0.9) return translations[language]?.underMealPlan || 'You ate less than your meal plan. Consider following the plan closely.';
    if (intakeNum <= mealPlanNum * 1.1) return translations[language]?.onMealPlan || 'Great! You followed your meal plan closely.';
    return translations[language]?.overMealPlan || 'You ate more than your meal plan. Stick to planned portions tomorrow.';
  };

  // Log progress
  const logProgress = (e) => {
    e.preventDefault();
    if (!weight || !height || !calorieIntake) {
      alert(translations[language]?.enterAllFields || 'Please enter weight, height, and calorie intake.');
      return;
    }

    const bmi = calculateBMI(weight, height);
    const mealPlanCalories = mealPlan
      ? (mealPlan.breakfast?.calories || 0) + (mealPlan.lunch?.calories || 0) + (mealPlan.dinner?.calories || 0)
      : 0;

    const newEntry = {
      date: new Date().toLocaleDateString('en-GB'), // Consistent DD/MM/YYYY format
      weight: parseFloat(weight),
      bmi: parseFloat(bmi),
      calorieIntake: parseFloat(calorieIntake),
      healthAdvice: getHealthAdvice(bmi),
      calorieAdvice: getCalorieAdvice(calorieIntake, calorieGoal),
      mealPlanAdherence: getMealPlanAdherence(calorieIntake, mealPlanCalories),
      mealPlan: mealPlan ? {
        breakfast: mealPlan.breakfast?.name || 'N/A',
        lunch: mealPlan.lunch?.name || 'N/A',
        dinner: mealPlan.dinner?.name || 'N/A',
        totalCalories: mealPlanCalories
      } : null,
    };

    const newData = [...progressData, newEntry];
    setProgressData(newData);
    console.log('New Progress Entry:', newEntry);

    // Update weekly progress
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const filteredProgress = newData.filter(entry => {
      try {
        const entryDate = new Date(entry.date.split('/').reverse().join('-'));
        return entryDate >= oneWeekAgo;
      } catch (error) {
        console.error('Error filtering weekly progress:', entry, error);
        return false;
      }
    });
    setWeeklyProgress(filteredProgress);
    console.log('Updated Weekly Progress:', filteredProgress);

    // Badge Unlock
    const loggingStreak = newData.length;
    const calorieStreak = newData.filter(entry => parseFloat(entry.calorieIntake) <= parseFloat(calorieGoal) * 1.1).length;
    const mealPlanStreak = newData.filter(entry => entry.mealPlanAdherence?.includes('followed')).length;

    const newBadges = [...badges];
    if (loggingStreak >= 5 && !badges.includes('5 Days Logging Streak')) {
      newBadges.push('5 Days Logging Streak');
    }
    if (loggingStreak >= 10 && !badges.includes('10 Days Logging Streak')) {
      newBadges.push('10 Days Logging Streak');
    }
    if (calorieStreak >= 3 && !badges.includes('3 Days Calorie Goal Streak')) {
      newBadges.push('3 Days Calorie Goal Streak');
    }
    if (mealPlanStreak >= 3 && !badges.includes('3 Days Meal Plan Streak')) {
      newBadges.push('3 Days Meal Plan Streak');
    }
    setBadges(newBadges);
    console.log('Updated Badges:', newBadges);

    // Reset inputs
    setWeight('');
    setHeight('');
    setCalorieIntake('');
  };

  // Toggle full history
  const toggleHistory = () => {
    setShowFullHistory(!showFullHistory);
  };

  return (
    <motion.section 
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-5xl font-black text-center mb-12 text-gray-800"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {translations[language]?.progressHub?.title || 'Progress Hub'}
        </motion.h2>

        {/* Summary Section */}
        {(calorieGoal || dietaryPrefs || weeklyProgress.length > 0) && (
          <motion.div 
            className="max-w-lg mx-auto mb-12 bg-white rounded-3xl shadow-xl p-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{translations[language]?.summary || 'Your Summary'}</h3>
            {dietaryPrefs && <p className="text-gray-600">Dietary Preference: <strong>{dietaryPrefs}</strong></p>}
            {calorieGoal && (
              <p className="text-gray-600">
                Daily Calorie Goal: <strong>{calorieGoal} kcal</strong> (Ideal Range: {Math.round(calorieGoal * 0.9)}–{Math.round(calorieGoal * 1.1)} kcal)
              </p>
            )}
            {weeklyProgress.length > 0 && (
              <>
                <p className="text-gray-600">
                  Latest BMI: <strong>{weeklyProgress[weeklyProgress.length - 1].bmi}</strong> (Normal Range: {bmiRanges.normal})
                </p>
                <p className="text-gray-600">Latest Advice: <strong>{weeklyProgress[weeklyProgress.length - 1].healthAdvice}</strong></p>
              </>
            )}
            <p className="text-gray-600 mt-2">
              BMI Ranges: Underweight ({bmiRanges.underweight}), Normal ({bmiRanges.normal}), Overweight ({bmiRanges.overweight}), Obese ({bmiRanges.obese})
            </p>
          </motion.div>
        )}

        {/* Input Form */}
        <motion.div 
          className="max-w-lg mx-auto mb-12 bg-white rounded-3xl shadow-xl p-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <form onSubmit={logProgress}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">{translations[language]?.weight || 'Weight (kg)'}</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 70"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">{translations[language]?.height || 'Height (cm)'}</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g., 170"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">{translations[language]?.calorieIntake || 'Today\'s Calorie Intake (kcal)'}</label>
              <input
                type="number"
                value={calorieIntake}
                onChange={(e) => setCalorieIntake(e.target.value)}
                placeholder="e.g., 1800"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-emerald-800 text-white p-3 rounded-lg font-bold hover:bg-emerald-900 transition-all duration-300"
            >
              {translations[language]?.logProgress || 'Log Progress'}
            </motion.button>
          </form>
        </motion.div>

        {/* Weekly Progress Table */}
        {weeklyProgress.length > 0 && (
          <motion.div 
            className="bg-white rounded-3xl shadow-xl p-6 mb-12"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{translations[language]?.weeklyProgress || 'Your Weekly Progress'}</h3>
            <ul className="space-y-4">
              {weeklyProgress.map((entry, index) => (
                <li key={index} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span>{entry.date}</span>
                    <span>
                      Weight: {entry.weight} kg | BMI: {entry.bmi} | Calories: {entry.calorieIntake} kcal
                      <br />
                      Health: {entry.healthAdvice}
                      <br />
                      Calorie: {entry.calorieAdvice}
                      {entry.mealPlan && (
                        <>
                          <br />
                          Meal Plan: Breakfast ({entry.mealPlan.breakfast}), Lunch ({entry.mealPlan.lunch}), Dinner ({entry.mealPlan.dinner})
                          <br />
                          Plan Adherence: {entry.mealPlanAdherence}
                        </>
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Weekly Progress Graph */}
        {weeklyProgress.length > 0 && (
          <motion.div 
            className="bg-white rounded-3xl shadow-xl p-6 mb-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{translations[language]?.progressGraph || 'Weekly Progress Graph'}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#34d399" name="Weight (kg)" />
                <Line type="monotone" dataKey="bmi" stroke="#f97316" name="BMI" />
                <Line type="monotone" dataKey="calorieIntake" stroke="#3b82f6" name="Calorie Intake (kcal)" />
                {mealPlan && (
                  <Line type="monotone" dataKey="mealPlan.totalCalories" stroke="#8b5cf6" name="Meal Plan Calories" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Full History Table */}
        {progressData.length > 0 && (
          <motion.div 
            className="bg-white rounded-3xl shadow-xl p-6 mb-12"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {translations[language]?.fullHistory || 'Your Full History'}
              <button
                onClick={toggleHistory}
                className="ml-4 bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-all duration-300"
              >
                {showFullHistory ? 'Hide History' : 'Show History'}
              </button>
            </h3>
            {showFullHistory && (
              <ul className="space-y-4">
                {progressData.map((entry, index) => (
                  <li key={index} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span>{entry.date}</span>
                      <span>
                        Weight: {entry.weight} kg | BMI: {entry.bmi} | Calories: {entry.calorieIntake} kcal
                        <br />
                        Health: {entry.healthAdvice}
                        <br />
                        Calorie: {entry.calorieAdvice}
                        {entry.mealPlan && (
                          <>
                            <br />
                            Meal Plan: Breakfast ({entry.mealPlan.breakfast}), Lunch ({entry.mealPlan.lunch}), Dinner ({entry.mealPlan.dinner})
                            <br />
                            Plan Adherence: {entry.mealPlanAdherence}
                          </>
                        )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}

        {/* Badges */}
        {badges.length > 0 && (
          <motion.div 
            className="bg-white rounded-3xl shadow-xl p-6"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Trophy className="w-6 h-6 mr-2" />
              {translations[language]?.badges || 'Your Badges'}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-orange-600 to-emerald-800 text-white p-4 rounded-lg text-center"
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {badge}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default ProgressHub;