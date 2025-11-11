import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Get tracking data for a user (meals, calories, points, weeklyData, profile)
export async function getTrackingData(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    loggedMeals: Array.isArray(data.loggedMeals) ? data.loggedMeals : [],
    caloriesConsumed: typeof data.caloriesConsumed === 'number' ? data.caloriesConsumed : 0,
    points: typeof data.points === 'number' ? data.points : 0,
    weeklyData: Array.isArray(data.weeklyData) ? data.weeklyData : [
      { day: 'Mon', calories: 0, goal: 2000 },
      { day: 'Tue', calories: 0, goal: 2000 },
      { day: 'Wed', calories: 0, goal: 2000 },
      { day: 'Thu', calories: 0, goal: 2000 },
      { day: 'Fri', calories: 0, goal: 2000 },
      { day: 'Sat', calories: 0, goal: 2000 },
      { day: 'Sun', calories: 0, goal: 2000 },
    ],
    profile: data.profile || null,
  };
}

// Get only weekly data for charts
export async function getWeeklyData(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  const data = snap.data();
  return Array.isArray(data.weeklyData) ? data.weeklyData : [];
}

// Update tracking data with a partial payload (merge)
export async function updateTrackingData(uid, payload) {
  const ref = doc(db, 'users', uid);
  // Payload may include: loggedMeals, caloriesConsumed, points, weeklyData, profile
  await updateDoc(ref, payload);
}