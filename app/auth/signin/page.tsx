// app/page.tsx
import Link from 'next/link';
import AICard from '@/components/AICard';
import SearchAndFilter from '@/components/SearchAndFilter';
import { supabase } from '@/lib/supabase/client';
import { Suspense } from 'react';

// --- YANGI QO'SHILGAN QATOR (MUXIM!) ---
export const dynamic = 'force-dynamic';
// ---------------------------------------

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  country: string;
  affiliate_link: string;
  tags: string[];
}

interface HomeProps {
    searchParams: {
        search?: string;
        country?: string;
    };
}

async function getAIProducts(searchQuery?: string, countryCode?: string): Promise<Service[]> {
    let query = supabase
        .from('services')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

    if (countryCode && countryCode !== 'GLOBAL') {
        query = query.eq('country', countryCode);
    }
    
    if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Ma'lumotlarni yuklashda xato:", error);
        return [];
    }
    return data as Service[];
}

export default async function Home({ searchParams }: HomeProps) {
    const { search, country } = searchParams;
    const services = await getAIProducts(search, country); 
    
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-10 bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link href="/" className="text-3xl font-extrabold text-indigo-600">
                        AI Marketplace 🚀
                    </Link>
                    <div className="flex space-x-4 items-center">
                        <Link href="/add-service" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150">
                            AI Servis Joylash
                        </Link>
                        <Link href="/auth/signin">
                            <button className="px-4 py-2 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition duration-150">
                                Kirish
                            </button>
                        </Link>
                    </div>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Suspense fallback={<div className="p-4 text-center text-gray-500">Qidiruv yuklanmoqda...</div>}>
                    <SearchAndFilter />
                </Suspense>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {search ? `"${search}" so'rovi bo'yicha natijalar` : 'Barcha AI Xizmatlar'}
                </h2>
                
                {services.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded-xl shadow-lg">
                        <p className="text-xl font-semibold text-gray-600">
                            {search || country ? 'Kiritilgan filtr bo\'yicha hech narsa topilmadi.' : 'Hozircha tasdiqlangan AI xizmatlari yo\'q.'}
                        </p>
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