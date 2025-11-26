// app/page.tsx (Asosiy Katalog Sahifasi)
import Link from 'next/link';
import AICard from '@/components/AICard';
import { supabase } from '@/lib/supabase/client';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Ma'lumot turi AICard ga mos kelishi kerak
interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  country: string;
  affiliate_link: string;
  tags: string[];
}

// Server Component: Ma'lumotni to'g'ridan-to'g'ri bazadan olish
async function getAIProducts(): Promise<Service[]> {
    // Biz hozircha App Routerda server component bilan ishlaymiz
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('approved', true) // Faqat Admin tasdiqlagan xizmatlarni ko'rsatamiz
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Ma'lumotlarni yuklashda xato:", error);
        return [];
    }
    return data as Service[];
}

export default async function Home() {
    // Bu funksiya serverda ishlaydi (Server Component)
    const services = await getAIProducts(); 
    
    // HTML dan foydalanish uchun Client komponentga aylantiramiz
    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* 1. Navigatsiya (Dizayn) */}
            <header className="sticky top-0 z-10 bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link href="/" className="text-3xl font-extrabold text-indigo-600">
                        AI Marketplace 🚀
                    </Link>
                    <div className="flex space-x-4 items-center">
                        <Link href="/add-service" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150">
                            AI Servis Joylash
                        </Link>
                        <button className="px-4 py-2 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition duration-150">
                            Kirish
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* 2. Sarlavha */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                        Kelajak AI Servislari. Bugun Sotib Oling.
                    </h1>
                    <p className="text-xl text-gray-500">
                        Dunyodagi eng yaxshi AI vositalari bir joyda.
                    </p>
                </div>
                
                {/* 3. Xizmat Kartalari (Katalog) */}
                {services.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded-xl shadow-lg">
                        <p className="text-xl font-semibold text-gray-600">Hozircha tasdiqlangan AI xizmatlari yo'q.</p>
                        <p className="text-gray-500 mt-2">Iltimos, avval /add-service orqali xizmat qo'shing va uni Admin tasdiqlashini kuting.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map(service => (
                            <AICard key={service.id} service={service} />
                        ))}
                    </div>
                )}
                
            </main>
        </div>
    );
}