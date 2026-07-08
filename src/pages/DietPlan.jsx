import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { savePlan } from '../api';
import { CheckCircle2, Flame, Beef, Wheat, Droplet, Clock, Save, ArrowLeft } from 'lucide-react';

export default function DietPlan() {
  const location = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const plan = location.state?.plan;
  const profile = location.state?.profile;

  if (!plan) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No protocol found in memory.</h2>
        <button onClick={() => navigate('/profile')} className="btn-primary">Return to Setup</button>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePlan({
        userName: profile.name || 'User',
        goal: profile.goal,
        dietType: profile.diet,
        planData: plan
      });
      setSaved(true);
    } catch (err) {
      console.error(err);
      alert('Error saving plan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-10 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-theme-muted hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Reset
        </button>
        <button 
          onClick={handleSave} 
          disabled={saved || saving} 
          className={`flex items-center gap-2 px-6 py-2 rounded font-bold transition-all ${saved ? 'bg-primary/20 text-primary border border-primary' : 'bg-primary hover:bg-primary-hover text-white'}`}
        >
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Protocol Saved</> : <><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Protocol'}</>}
        </button>
      </div>

      <div className="glass p-8 rounded-2xl border-l-4 border-l-primary shadow-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">Personalized <span className="text-primary">Macro Protocol</span></h1>
        <p className="text-theme-muted mb-8 text-lg">Generated for {profile.name || 'User'} // {profile.goal} // {profile.diet}</p>

        {/* Macros Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <Flame className="text-orange-500 w-8 h-8 mb-2" />
            <span className="text-2xl font-bold">{plan.dailyMacros.calories}</span>
            <span className="text-xs text-theme-muted font-bold tracking-wider uppercase">Calories</span>
          </div>
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <Beef className="text-red-400 w-8 h-8 mb-2" />
            <span className="text-2xl font-bold">{plan.dailyMacros.protein}</span>
            <span className="text-xs text-theme-muted font-bold tracking-wider uppercase">Protein</span>
          </div>
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <Wheat className="text-amber-300 w-8 h-8 mb-2" />
            <span className="text-2xl font-bold">{plan.dailyMacros.carbs}</span>
            <span className="text-xs text-theme-muted font-bold tracking-wider uppercase">Carbs</span>
          </div>
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <Droplet className="text-yellow-400 w-8 h-8 mb-2" />
            <span className="text-2xl font-bold">{plan.dailyMacros.fats}</span>
            <span className="text-xs text-theme-muted font-bold tracking-wider uppercase">Fats</span>
          </div>
        </div>

        {/* Meals */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Clock className="text-primary w-6 h-6" /> Daily Schedule</h2>
        <div className="space-y-6">
          {plan.meals.map((meal, idx) => (
            <div key={idx} className="bg-theme-surface border border-theme-border rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    {meal.name} <span className="text-sm font-normal text-theme-muted px-2 py-0.5 rounded bg-black/10 dark:bg-white/10">{meal.time}</span>
                  </h3>
                  <p className="text-sm text-theme-muted mt-1">{meal.description}</p>
                </div>
                <div className="flex gap-3 text-sm font-semibold whitespace-nowrap bg-theme-card px-3 py-2 rounded-lg border border-theme-border">
                  <span>{meal.macros.calories} kcal</span>
                  <span className="text-theme-muted">|</span>
                  <span className="text-red-400">{meal.macros.protein} P</span>
                  <span className="text-theme-muted">|</span>
                  <span className="text-amber-300">{meal.macros.carbs} C</span>
                  <span className="text-theme-muted">|</span>
                  <span className="text-yellow-400">{meal.macros.fats} F</span>
                </div>
              </div>
              <ul className="list-disc list-inside space-y-1 text-theme-text ml-2 marker:text-primary">
                {meal.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tips */}
        {plan.tips && plan.tips.length > 0 && (
          <div className="mt-10 p-6 bg-primary/10 rounded-xl border border-primary/20">
            <h3 className="text-lg font-bold text-primary mb-3">AI Suggestions</h3>
            <ul className="list-disc list-inside space-y-2 text-theme-muted text-sm marker:text-primary">
              {plan.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
