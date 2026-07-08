import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await axios.post(`${baseUrl}${endpoint}`, form);
      
      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthClick = (provider) => {
    alert(`To make ${provider} login fully functional for a production launch, you will need to register your domain with the ${provider} Developer Console to get API keys. For now, please use the Email & Password option!`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 animate-fade-in-up">
      <div className="glass p-8 rounded-2xl w-full max-w-md border-t border-primary/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Join LuminaDiet'}
          </h2>
          <p className="text-theme-muted">
            {isLogin ? 'Sign in to access your nutritional protocols' : 'Create an account to start generating plans'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold mb-1 text-theme-muted">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
                <input
                  type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="John Doe"
                  className="w-full bg-black/50 border border-theme-border rounded-lg pl-10 pr-4 py-3 focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-1 text-theme-muted">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
              <input
                type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com"
                className="w-full bg-black/50 border border-theme-border rounded-lg pl-10 pr-4 py-3 focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-theme-muted">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
              <input
                type="password" name="password" value={form.password} onChange={handleChange} required
                placeholder="••••••••"
                className="w-full bg-black/50 border border-theme-border rounded-lg pl-10 pr-4 py-3 focus:border-primary outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full mt-6 bg-primary hover:bg-primary-hover text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4 before:flex-1 before:h-px before:bg-theme-border after:flex-1 after:h-px after:bg-theme-border">
          <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Or continue with</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button onClick={() => handleOAuthClick('Google')} type="button" className="flex items-center justify-center gap-2 bg-theme-surface border border-theme-border hover:border-primary/50 py-2.5 rounded-lg transition-colors text-sm font-semibold">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button onClick={() => handleOAuthClick('LinkedIn')} type="button" className="flex items-center justify-center gap-2 bg-theme-surface border border-theme-border hover:border-primary/50 py-2.5 rounded-lg transition-colors text-sm font-semibold">
            <svg className="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-theme-muted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? 'Create one' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
