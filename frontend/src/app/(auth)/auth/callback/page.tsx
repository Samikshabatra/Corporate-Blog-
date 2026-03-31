'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    const success = params.get('success');

    if (success === 'true') {
      // Tokens are in httpOnly cookies set by the backend redirect
      // Just refresh auth state from the cookie
      refreshAuth()
        .then(() => {
          toast.success('Signed in with Google!');
          router.push('/dashboard');
          router.refresh();
        })
        .catch(() => {
          toast.error('Session setup failed. Please try again.');
          router.push('/auth/login');
        });
    } else {
      toast.error('Google sign-in failed. Please try again.');
      router.push('/auth/login?error=google_failed');
    }
  }, [params, router, refreshAuth]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2 size={32} className="animate-spin text-brand-600" />
      <p className="text-slate-500">Completing sign-in...</p>
    </div>
  );
}
