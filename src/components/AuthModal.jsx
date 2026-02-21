import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

/**
 * AuthModal Component
 * Handles the UI for user signup, signing in, and password recovery.
 * It sits above the main content (z-index 100) and communicates directly
 * with Supabase via the AuthContext.
 */
export default function AuthModal({ isOpen, onClose }) {
  // Contains 'login', 'signup', or 'forgot' to toggle the form display
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const { signIn, signUp, resetPassword } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setMessage(null);
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- EVENT HANDLERS ---
  /**
   * Main submission handler for the modal form.
   * Switches logic based on the current 'view' state,
   * firing the corresponding Supabase Auth method.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (view === 'login') {
        const { error } = await signIn({ email, password });
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            throw new Error("Please check your email to verify your account before logging in.");
          }
          throw error;
        }
        onClose();
      } else if (view === 'signup') {
        const { data, error } = await signUp({ email, password });
        if (error) throw error;

        if (data.user && !data.session) {
          setMessage("Account created! Check your email to verify.");
        } else {
          onClose();
        }
      } else if (view === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        setMessage("Password reset link sent! Check your email.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-stone-100 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Account'}
            {view === 'forgot' && 'Reset Password'}
          </h2>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}
          {message && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-stone-400" size={18} />
                <input type="email" required className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-2xl outline-none focus:border-rose-500" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {view !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-stone-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-10 pr-10 py-2 border border-stone-200 rounded-2xl outline-none focus:border-rose-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            <button disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-2xl flex justify-center items-center transition-colors">
              {loading ? <Loader2 className="animate-spin" size={20} /> : (view === 'forgot' ? 'Send Reset Link' : (view === 'login' ? 'Sign In' : 'Create Account'))}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-stone-500 space-y-3">
            {view === 'login' && (
              <>
                <button onClick={() => { setView('forgot'); setError(null); setMessage(null); }} className="text-stone-400 hover:text-stone-600">Forgot Password?</button>
                <div className="pt-2 border-t border-stone-100">
                  No account? <button onClick={() => { setView('signup'); setError(null); setMessage(null); }} className="text-rose-600 font-bold hover:underline">Sign up</button>
                </div>
              </>
            )}
            {view === 'signup' && (
              <div>Have an account? <button onClick={() => { setView('login'); setError(null); setMessage(null); }} className="text-rose-600 font-bold hover:underline">Log in</button></div>
            )}
            {view === 'forgot' && (
              <button onClick={() => { setView('login'); setError(null); setMessage(null); }} className="flex items-center justify-center gap-2 text-stone-600 hover:text-stone-900 w-full mx-auto">
                <ArrowLeft size={16} /> Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
