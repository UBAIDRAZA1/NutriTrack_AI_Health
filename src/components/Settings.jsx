import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getTrackingData, updateTrackingData } from '../services/tracking';

const Settings = () => {
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    height: '',
    weight: '',
    activityLevel: 'moderate',
    dietaryRestrictions: [],
  });
  const [restrictionInput, setRestrictionInput] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUid(null);
          setLoading(false);
          return;
        }
        setUid(firebaseUser.uid);
        const data = await getTrackingData(firebaseUser.uid);
        const profile = data?.profile || {};
        setForm({
          height: profile.height ?? '',
          weight: profile.weight ?? '',
          activityLevel: profile.activityLevel ?? 'moderate',
          dietaryRestrictions: Array.isArray(profile.dietaryRestrictions) ? profile.dietaryRestrictions : [],
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addRestriction = () => {
    const r = restrictionInput.trim();
    if (!r) return;
    setForm((prev) => ({
      ...prev,
      dietaryRestrictions: [...new Set([...(prev.dietaryRestrictions || []), r])],
    }));
    setRestrictionInput('');
  };

  const removeRestriction = (r) => {
    setForm((prev) => ({
      ...prev,
      dietaryRestrictions: (prev.dietaryRestrictions || []).filter((x) => x !== r),
    }));
  };

  const saveProfile = async () => {
    if (!uid) {
      setError('Please login to save settings.');
      setTimeout(() => setError(null), 4000);
      return;
    }
    if (!form.height || !form.weight) {
      setError('Height and Weight are required.');
      setTimeout(() => setError(null), 4000);
      return;
    }
    setSaving(true);
    try {
      await updateTrackingData(uid, {
        profile: {
          height: Number(form.height),
          weight: Number(form.weight),
          activityLevel: form.activityLevel,
          dietaryRestrictions: form.dietaryRestrictions,
        },
      });
      setSuccess('Settings saved successfully.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to save settings.');
      setTimeout(() => setError(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Settings</h1>

      {error && <div className="mb-4 text-red-600 p-3 bg-red-100 rounded-lg text-center">{error}</div>}
      {success && <div className="mb-4 text-green-600 p-3 bg-green-100 rounded-lg text-center">{success}</div>}

      {!uid ? (
        <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow-lg border text-center">
          <p>Please login to edit your settings.</p>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow-lg border">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Profile</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={form.height}
                onChange={updateField}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={updateField}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Activity Level</label>
              <select
                name="activityLevel"
                value={form.activityLevel}
                onChange={updateField}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-500"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Dietary Restrictions</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={restrictionInput}
                  onChange={(e) => setRestrictionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addRestriction();
                  }}
                  className="flex-1 p-2 border rounded focus:ring-2 focus:ring-emerald-500"
                  placeholder="Add restriction and press Enter"
                />
                <button
                  type="button"
                  onClick={addRestriction}
                  className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.dietaryRestrictions || []).map((r, i) => (
                  <span key={i} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs flex items-center">
                    {r}
                    <button onClick={() => removeRestriction(r)} className="ml-1 text-red-600">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="w-full bg-emerald-600 text-white p-2 rounded-lg font-bold hover:bg-emerald-700 transition-all"
            >
              {saving ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;