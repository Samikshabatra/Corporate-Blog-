'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Chrome } from 'lucide-react';
import { apiUrl, cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface FormErrors { name?: string; email?: string; password?: string; }

export function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const e: FormErrors = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'At least 8 characters';
    else if (!/[A-Z]/.test(password)) e.password = 'Include one uppercase letter';
    else if (!/[0-9]/.test(password)) e.password = 'Include one number';
    else if (!/[^A-Za-z0-9]/.test(password)) e.password = 'Include one special character';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const res = await fetch(apiUrl('/api/v1/auth/register'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || 'Registration failed'); }
      await login(email, password);
      toast.success('Account created! Welcome aboard 🎉');
      router.push('/dashboard');
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setIsLoading(false); }
  }

  const strength = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-400'][strength];

  return (
    <div className="card">
      <button type="button" onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`} className="btn-secondary mb-6 w-full gap-3">
        <Chrome size={18} /> Continue with Google
      </button>
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-border dark:border-dark-border" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-surface px-3 text-slate-400 dark:bg-dark-muted">or continue with email</span></div>
      </div>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="label">Full name</label>
          <input id="name" type="text" autoComplete="name" value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
            className={cn('input', errors.name && 'border-red-400')} placeholder="John Doe" disabled={isLoading} />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="label">Email address</label>
          <input id="email" type="email" autoComplete="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
            className={cn('input', errors.email && 'border-red-400')} placeholder="you@example.com" disabled={isLoading} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <div className="relative">
            <input id="password" type={showPass ? 'text' : 'password'} autoComplete="new-password" value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
              className={cn('input pr-10', errors.password && 'border-red-400')} placeholder="Min 8 characters" disabled={isLoading} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" tabIndex={-1}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password && (
            <div className="mt-2">
              <div className="flex gap-1">{[1,2,3,4].map((i) => (<div key={i} className={cn('h-1 flex-1 rounded-full transition-all', i <= strength ? strengthColor : 'bg-surface-border dark:bg-dark-border')} />))}</div>
              <p className="mt-1 text-xs text-slate-400">{strengthLabel}</p>
            </div>
          )}
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium text-brand-600 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
