import React, { useState } from 'react';
import { X, Mail, Lock, LogIn, UserPlus, CheckCircle, Shield } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string;
  onAuthSuccess: (email: string) => void;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUserEmail,
  onAuthSuccess,
  onSignOut,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSupabaseConfigured && supabase) {
        if (isSignUp) {
          const { data, error: err } = await supabase.auth.signUp({
            email,
            password,
          });
          if (err) throw err;
          setMessage('Account created! Please check your email to confirm, or continue with session.');
          if (data.user?.email) onAuthSuccess(data.user.email);
        } else {
          const { data, error: err } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (err) throw err;
          setMessage('Logged in successfully!');
          if (data.user?.email) onAuthSuccess(data.user.email);
          setTimeout(() => onClose(), 1000);
        }
      } else {
        // Local user authentication mode
        onAuthSuccess(email || 'gardener@skillgarden.app');
        setMessage(isSignUp ? 'Gardener profile created locally!' : 'Signed in to local garden storage!');
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-emerald-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
            🌱
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-stone-900">
              {currentUserEmail ? 'Account Profile' : isSignUp ? 'Create Garden Account' : 'Welcome to SkillGarden'}
            </h3>
            <p className="text-xs text-stone-500">
              {isSupabaseConfigured ? 'Connected to Supabase PostgreSQL' : 'Local Persistent Storage Mode'}
            </p>
          </div>
        </div>

        {currentUserEmail ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="text-xs text-stone-500 font-medium">Logged in as:</div>
              <div className="font-bold text-stone-900 mt-0.5">{currentUserEmail}</div>
              <div className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Data safely saved and isolated</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-600 font-bold text-sm transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{loading ? 'Connecting...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-stone-600 hover:text-emerald-700 font-semibold transition"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
