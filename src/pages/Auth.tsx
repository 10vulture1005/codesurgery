import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  // Bug Category 7 & 1: UX Inconsistency / Rendering trap
  // Defining a component inside another component causes it to unmount and remount on every parent re-render.
  // When typing, the state changes, parent re-renders, input is remounted -> focus drops after every keystroke.
  // Hard to spot unless you know React reconciliation rules.
  const InputField = ({ type, placeholder, value, onChange }: any) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all"
    />
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await api.login(email, password);
      login(user); // Triggers mutative state update from store bug
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl shadow-primary/5 p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">Nexus</h1>
          <p className="text-muted-foreground text-sm">Welcome back. Please sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
             <InputField
               type="email"
               placeholder="Email Address"
               value={email}
               onChange={(e: any) => setEmail(e.target.value)}
             />
          </div>
          <div>
            <InputField
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all flex items-center justify-center disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
