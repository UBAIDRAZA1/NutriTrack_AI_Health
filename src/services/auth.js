import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function signupUser({ name, phone, email, password, age, weight, height }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });

  // Create user profile in Firestore
  const userRef = doc(db, 'users', cred.user.uid);
  try {
    await setDoc(userRef, {
      uid: cred.user.uid,
      name,
      phone,
      email,
      profile: { age, weight, height },
      loggedMeals: [],
      caloriesConsumed: 0,
      points: 0,
      caloriesBurned: 0,
      weeklyData: [
        { day: 'Mon', calories: 0, goal: 2000 },
        { day: 'Tue', calories: 0, goal: 2000 },
        { day: 'Wed', calories: 0, goal: 2000 },
        { day: 'Thu', calories: 0, goal: 2000 },
        { day: 'Fri', calories: 0, goal: 2000 },
        { day: 'Sat', calories: 0, goal: 2000 },
        { day: 'Sun', calories: 0, goal: 2000 },
      ],
      dietPlans: [],
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    // Do not block signup on profile write failure; log and continue
    console.warn('Firestore profile creation failed; proceeding with auth only.', e);
  }

  const token = await cred.user.getIdToken();
  return { token, userId: cred.user.uid };
}

export async function loginUser({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const token = await cred.user.getIdToken();
  return { token, userId: cred.user.uid };
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data();
}

export async function logoutUser() {
  await signOut(auth);
}