// app/auth/signin/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false); // Yuklanish holati
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        router.push('/admin');
      } else {
        alert(error.message);
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (!error) {
        alert('Tasdiqlash linki emailingizga yuborildi. Iltimos, emailingizni tekshiring!');
      } else {
        alert(error.message);
      }
    }
    setLoading(false);
  };

  return (
    // FON: Chiroyli gradient
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      
      {/* KARTA: Glassmorphism effekti va soya */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* HEADER QISMI */}
        <div className="p-8 text-center bg-gradient-to-r from-indigo-600 to-violet-600">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {isLogin ? 'Xush Kelibsiz!' : "Ro'yxatdan O'tish"}
          </h2>
          <p className="text-indigo-100 mt-2 text-sm">
            {isLogin ? 'AI Marketplace hisobingizga kiring' : 'Yangi imkoniyatlar sari qadam tashlang'}
          </p>
        </div>

        {/* FORMA QISMI */}
        <div className="p-8">
          <form onSubmit={handleAuth} className="space-y-5">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Manzil</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-[1.02] transition duration-200 disabled:bg-indigo-300"
            >
              {loading ? 'Yuklanmoqda...' : (isLogin ? 'Kirish' : "Ro'yxatdan O'tish")}
            </button>
          </form>

          {/* Pastki qism (Switch) */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Hisobingiz yo'qmi?" : "Allaqachon hisobingiz bormi?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition duration-150"
              >
                {isLogin ? "Ro'yxatdan o'ting" : "Kirish"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}