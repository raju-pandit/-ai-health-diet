import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePlan } from '../api';
import { Loader2 } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    gender: 'Male',
    age: '',
    weight: '',
    weightUnit: 'kg',
    heightFeet: '',
    heightInches: '',
    goal: 'Weight Loss',
    diet: 'Vegetarian',
    allergies: '',
    mealsPerDay: ''
  });

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'name' || e.target.name === 'allergies') {
      value = value.replace(/[0-9]/g, '');
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const plan = await generatePlan(form);
      // Pass the plan to the next page
      navigate('/diet-plan', { state: { plan, profile: form } });
    } catch (err) {
      console.error(err);
      alert('Failed to generate plan. Check backend logs or API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="glass p-8 rounded-2xl border-l-4 border-l-primary shadow-xl">
        <h2 className="text-3xl font-bold mb-2">System Init // Profile Setup</h2>
        <p className="text-theme-muted mb-8">Input your metrics to compute your optimal nutritional protocol.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-theme-muted">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full bg-theme-surface border border-theme-border rounded px-4 py-2 focus:border-primary outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-theme-muted">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full bg-theme-surface border border-theme-border rounded px-4 py-2 focus:border-primary outline-none">
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-theme-muted">Age (yrs)</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="e.g. 25" className="w-full bg-theme-surface border border-theme-border rounded px-4 py-2 focus:border-primary outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-theme-muted">Weight</label>
              <div className="flex">
                <input type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="70" className="w-full bg-theme-surface border border-theme-border rounded-l px-4 py-2 focus:border-primary outline-none" required />
                <select name="weightUnit" value={form.weightUnit} onChange={handleChange} className="bg-theme-surface border-t border-b border-r border-theme-border rounded-r px-2">
                  <option>kg</option><option>lbs</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-theme-muted">Height (ft & in)</label>
              <div className="flex">
                <input type="number" name="heightFeet" value={form.heightFeet} onChange={handleChange} placeholder="ft" className="w-full bg-theme-surface border border-theme-border rounded-l px-2 py-2 text-center outline-none" required />
                <input type="number" name="heightInches" value={form.heightInches} onChange={handleChange} placeholder="in" className="w-full bg-theme-surface border-t border-b border-r border-theme-border rounded-r px-2 py-2 text-center outline-none" required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-theme-muted">Goal</label>
              <select name="goal" value={form.goal} onChange={handleChange} className="w-full bg-theme-surface border border-theme-border rounded px-4 py-2 focus:border-primary outline-none">
                <option>Weight Loss</option><option>Muscle Gain</option><option>Maintenance</option><option>Healthy Eating</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-theme-muted">Diet Preference</label>
              <select name="diet" value={form.diet} onChange={handleChange} className="w-full bg-theme-surface border border-theme-border rounded px-4 py-2 focus:border-primary outline-none">
                <option>Vegetarian</option>
                <option>Non-Vegetarian</option>
                <option>Eggetarian</option>
                <option>Vegan</option>
                <option>Jain</option>
                <option>Pescatarian (Fish only)</option>
                <option>Flexitarian</option>
                <option>Keto</option>
                <option>Paleo</option>
                <option>Gluten-Free</option>
                <option>Lactose-Free</option>
                <option>Low-Carb</option>
                <option>Low-Fat</option>
                <option>Halal</option>
                <option>Kosher</option>
                <option>No Preference</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-theme-muted">Meals per day</label>
              <input type="number" min="2" max="6" name="mealsPerDay" value={form.mealsPerDay} onChange={handleChange} placeholder="e.g. 3" className="w-full bg-theme-surface border border-theme-border rounded px-4 py-2 focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-theme-muted">Allergies (Optional)</label>
              <input type="text" name="allergies" value={form.allergies} onChange={handleChange} placeholder="e.g., Peanuts, Dairy" className="w-full bg-theme-surface border border-theme-border rounded px-4 py-2 focus:border-primary outline-none" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 mt-8">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Computing Protocol...</> : '> Execute Algorithm'}
          </button>
        </form>
      </div>
    </div>
  );
}
