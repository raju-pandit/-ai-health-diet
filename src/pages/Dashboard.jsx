import { useState, useEffect } from 'react';
import { getPlans } from '../api';
import { Search, Calendar, Target, Activity, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, [search]);

  const fetchPlans = async () => {
    try {
      const data = await getPlans(search);
      setPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewPlan = (plan) => {
    const planData = typeof plan.plan_data === 'string' ? JSON.parse(plan.plan_data) : plan.plan_data;
    navigate('/diet-plan', { state: { plan: planData, profile: { name: plan.user_name, goal: plan.goal, diet: plan.diet_type } } });
  };

  return (
    <div className="py-10 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Protocol <span className="text-primary">Registry</span></h1>
          <p className="text-theme-muted">Access and track your saved nutritional algorithms.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
          <input
            type="text"
            placeholder="Search by name, goal, diet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-theme-surface border border-theme-border rounded-lg pl-10 pr-4 py-2 focus:border-primary outline-none transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-theme-muted">Querying database...</div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 glass rounded-xl border-dashed">
          <FileText className="w-12 h-12 text-theme-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No Protocols Found</h3>
          <p className="text-theme-muted">You haven't saved any diet plans yet, or your search yielded no results.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="glass rounded-xl p-6 hover:border-primary transition-colors cursor-pointer group" onClick={() => viewPlan(plan)}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-theme-text group-hover:text-primary transition-colors">{plan.user_name}'s Plan</h3>
                <span className="text-xs font-semibold px-2 py-1 bg-black/5 dark:bg-white/5 rounded flex items-center gap-1 text-theme-muted">
                  <Calendar className="w-3 h-3" /> {new Date(plan.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-theme-muted">
                  <Target className="w-4 h-4 text-primary" /> Goal: <span className="text-theme-text font-medium">{plan.goal}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-theme-muted">
                  <Activity className="w-4 h-4 text-primary" /> Diet: <span className="text-theme-text font-medium">{plan.diet_type}</span>
                </div>
              </div>

              <div className="border-t border-theme-border pt-4">
                <button className="text-sm font-bold text-primary w-full text-center hover:underline">View Full Protocol &rarr;</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
