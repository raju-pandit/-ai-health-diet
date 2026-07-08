import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Cpu, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="py-20 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20">
        <Cpu className="w-4 h-4" />
        <span className="text-sm font-semibold tracking-widest">SYSTEM ONLINE v2.0</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
        Hack Your <span className="text-primary">&lt;Diet /&gt;</span>
      </h1>
      
      <p className="text-xl text-theme-muted max-w-2xl mb-12">
        // AI-powered nutrition protocols optimized for peak human performance.
        Input your metrics, run the algorithm, execute the plan.
      </p>

      <div className="flex gap-4">
        <Link to="/profile" className="btn-primary text-lg flex items-center gap-2 px-8 py-4">
          Initialize Setup <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-24 text-left w-full">
        <div className="glass p-6 rounded-xl hover:border-primary transition-colors">
          <Activity className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Macro Optimization</h3>
          <p className="text-theme-muted">Algorithmic distribution of proteins, fats, and carbs for your specific goal.</p>
        </div>
        <div className="glass p-6 rounded-xl hover:border-primary transition-colors">
          <Cpu className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">AI Generation</h3>
          <p className="text-theme-muted">Powered by Gemini 2.5 Flash to compute highly personalized meal plans instantly.</p>
        </div>
        <div className="glass p-6 rounded-xl hover:border-primary transition-colors">
          <ShieldCheck className="w-10 h-10 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Local Tracking</h3>
          <p className="text-theme-muted">Securely store and query your generated protocols in your local database.</p>
        </div>
      </div>
    </div>
  );
}
