// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Biz yaratgan Server Action (Tasdiqlash uchun)
import { approveService } from "@/app/actions/admin";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Foydalanuvchi tizimga kirganini tekshirish
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin'); // Agar kirmagan bo'lsa, login sahifasiga otish
      } else {
        setUser(user);
        fetchPendingServices();
      }
    };
    getUser();
  }, [router]);

  // 2. Tasdiqlanmagan xizmatlarni yuklash
  const fetchPendingServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false });
    
    if (data) setServices(data);
    setLoading(false);
  };

  // 3. Tizimdan Chiqish (Logout)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // 4. Tasdiqlash funksiyasi
  const handleApprove = async (id: string) => {
    if (confirm("Bu xizmatni haqiqatan ham tasdiqlaysizmi?")) {
       await approveService(id);
       // Ro'yxatni yangilash
       setServices(services.filter(s => s.id !== id));
       alert("Xizmat tasdiqlandi!");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-600">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
          <button 
            onClick={handleLogout} 
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm font-medium"
          >
            Chiqish
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6">
        {/* Statistika Kartalari (Hozircha static) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
            <h3 className="text-gray-500 text-sm font-medium">Kutayotganlar</h3>
            <p className="text-3xl font-bold text-indigo-600">{services.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
            <h3 className="text-gray-500 text-sm font-medium">Faol Xizmatlar</h3>
            <p className="text-3xl font-bold text-green-600">--</p> {/* Keyin ulaymiz */}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <Link href="/add-service">
              <button className="w-full h-full bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                + Yangi Xizmat Qo'shish
              </button>
            </Link>
          </div>
        </div>

        {/* Tasdiqlash Ro'yxati */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tasdiqlashni Kutayotgan Xizmatlar</h2>
        
        {services.length === 0 ? (
            <div className="bg-white p-10 rounded-xl shadow-sm text-center">
                <p className="text-gray-500">Hozircha yangi arizalar yo'q. Hammasi toza! 🎉</p>
            </div>
        ) : (
            <div className="space-y-4">
                {services.map((service) => (
                    <div key={service.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-gray-100">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{service.description}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{service.country}</span>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">${service.price}</span>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <a href={service.affiliate_link} target="_blank" className="flex-1 md:flex-none text-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
                                Linkni Ko'rish
                            </a>
                            <button 
                                onClick={() => handleApprove(service.id)}
                                className="flex-1 md:flex-none bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow-md font-medium transition"
                            >
                                Tasdiqlash
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}