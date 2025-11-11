import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

// List all diet plans for a user from the users document
export async function listDietPlans(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  const data = snap.data();
  return Array.isArray(data.dietPlans) ? data.dietPlans : [];
}

// Add a diet plan to the user's document (append to dietPlans array)
export async function addDietPlan(uid, plan) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  const entry = { ...plan, createdAt: new Date().toISOString() };
  if (!snap.exists()) {
    await setDoc(ref, { dietPlans: [entry] }, { merge: true });
    return entry;
  }
  const data = snap.data();
  const current = Array.isArray(data.dietPlans) ? data.dietPlans : [];
  const updated = [...current, entry];
  await updateDoc(ref, { dietPlans: updated });
  return entry;
}