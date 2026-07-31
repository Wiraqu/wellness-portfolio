'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.email && form.password) {
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Dr. Sarah Chen', email: form.email, role: 'practitioner' }));
      router.push('/dashboard');
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">Welcome back</h1>
          <p className="text-secondary-600 mt-1">Sign in to your WellnessFlow account</p>
        </div>
        <div className="card">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-10" placeholder="dr.sarah@wellness.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field pl-10 pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-secondary-400" /> : <Eye className="w-4 h-4 text-secondary-400" />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-2.5">Sign In</button>
          </form>
          <div className="mt-6 text-center text-sm text-secondary-500">
            Don&apos;t have an account? <Link href="#" className="text-primary-600 font-medium hover:underline">Start free trial</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
