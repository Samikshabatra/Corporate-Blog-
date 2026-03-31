import { buildMetadata } from '@/lib/seo.config';
import { RegisterForm } from '@/components/auth/RegisterForm';
export const metadata = buildMetadata({ title: 'Create Account', description: 'Create your account', path: '/auth/register', noIndex: true });
export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">Create your account</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Start writing and publishing today</p>
      </div>
      <RegisterForm />
    </div>
  );
}
