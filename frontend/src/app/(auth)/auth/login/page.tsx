import { buildMetadata } from '@/lib/seo.config';
import { LoginForm } from '@/components/auth/LoginForm';
export const metadata = buildMetadata({ title: 'Sign In', description: 'Sign in to your account', path: '/auth/login', noIndex: true });
export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Sign in to your account to continue</p>
      </div>
      <LoginForm />
    </div>
  );
}
