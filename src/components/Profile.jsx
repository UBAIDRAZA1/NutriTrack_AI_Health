import { useState, useEffect } from 'react';
import axios from 'axios';

function Profile({ showHeroOrderOptions, setShowHeroOrderOptions }) {  // Props add kiye compatibility ke liye
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [planName, setPlanName] = useState('');
  const [meals, setMeals] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/';  // No token, redirect to login
          return;
        }

        const profileRes = await axios.get('http://localhost:5001/api/auth/profile', {
          headers: { 'x-auth-token': token }
        });
        setUser(profileRes.data);

        const plansRes = await axios.get('http://localhost:5001/api/diet/plans', {
          headers: { 'x-auth-token': token }
        });
        setPlans(plansRes.data.dietPlans);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const handleAddPlan = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/diet/add-plan', 
        { planName, meals: meals.split(',').map(meal => meal.trim()) },
        { headers: { 'x-auth-token': token } }
      );
      const plansRes = await axios.get('http://localhost:5001/api/diet/plans', {
        headers: { 'x-auth-token': token }
      });
      setPlans(plansRes.data.dietPlans);
      setPlanName('');
      setMeals('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add plan');
    }
  };

  if (!user) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Profile, {user.name}</h1>
      <p className="mb-2">Email: {user.email}</p>
      <p className="mb-2">Phone: {user.phone}</p>
      <p className="mb-6">Profile Details: Age {user.profile?.age}, Weight {user.profile?.weight} kg, Height {user.profile?.height} cm</p>

      <h2 className="text-2xl font-bold mb-4">Your Diet Plans</h2>
      {plans.length === 0 ? (
        <p>No diet plans yet. Add one below!</p>
      ) : (
        <ul className="list-disc pl-6 mb-6">
          {plans.map((plan, idx) => (
            <li key={idx}>{plan.planName}: {plan.meals.join(', ')}</li>
          ))}
        </ul>
      )}

      <h3 className="text-xl font-bold mb-4">Add New Diet Plan</h3>
      <form onSubmit={handleAddPlan} className="max-w-md">
        <input
          type="text"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder="Plan Name (e.g., Weekly Diet)"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          value={meals}
          onChange={(e) => setMeals(e.target.value)}
          placeholder="Meals (comma separated, e.g., Oats, Salad)"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Plan</button>
      </form>

      {/* Agar tere Home mein hero options hain, yahan handle kar sakta hai */}
      {showHeroOrderOptions && <div>Hero Order Options Here</div>}
    </div>
  );
}

export default Profile;