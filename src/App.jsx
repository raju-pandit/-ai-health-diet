import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Terminal, LogOut, User } from 'lucide-react';
import { useContext } from 'react';
import Home from './pages/Home';
import Profile from './pages/Profile';
import DietPlan from './pages/DietPlan';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { AuthProvider, AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  return children;
};

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <nav className="fixed w-full z-50 glass border-b border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Terminal className="text-primary w-6 h-6" />
            <span className="font-bold text-xl tracking-tight">&lt;LuminaDiet /&gt;</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-theme-muted hover:text-primary transition-colors font-semibold hidden md:block">&gt; Home</Link>
            
            {user ? (
              <>
                <Link to="/profile" className="text-theme-muted hover:text-primary transition-colors font-semibold hidden md:block">&gt; Generate</Link>
                <Link to="/dashboard" className="text-theme-muted hover:text-primary transition-colors font-semibold hidden md:block">&gt; Registry</Link>
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-theme-border">
                  <div className="flex items-center gap-2 text-sm font-bold text-theme-text">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/50">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block">{user.name}</span>
                  </div>
                  <button onClick={logout} className="text-theme-muted hover:text-red-400 transition-colors" title="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link to="/auth" className="bg-primary hover:bg-primary-hover text-black px-4 py-2 rounded-lg font-bold transition-colors">
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-theme-bg text-theme-text font-mono selection:bg-primary selection:text-black">
          <Navigation />
          
          <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/diet-plan" element={
                <ProtectedRoute>
                  <DietPlan />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
