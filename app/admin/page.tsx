// app/admin/page.tsx
import { supabase } from "@/lib/supabase/client";
import { approveService } from "@/app/actions/admin";
import Link from 'next/link';
import ApproveButton from '@/components/ApproveButton'; // Hali yaratilmagan

// Faqat tasdiqlanmagan xizmatlarni olish
async function getPendingServices() {
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq('approved', false)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Pending data error:", error);
        return [];
    }
    return data;
}

export default async function AdminPage() {
    const pendingServices = await getPendingServices();

    return (
        <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-red-600 border-b pb-2">
                ⚠️ Admin Dashboard: Tasdiqlash Kutayotganlar ({pendingServices.length})
            </h1>
            
            {pendingServices.length === 0 ? (
                <div className="text-center p-10 bg-green-100 rounded-xl">
                    <p className="text-xl font-semibold text-green-700">Hozircha tasdiqlash kutayotgan xizmatlar yo'q!</p>
                    <p className="text-green-600 mt-2">Katalog toza. Qo'shimcha AI xizmatlarni kutamiz.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingServices.map(service => (
                        <div key={service.id} className="bg-white p-5 rounded-lg shadow flex justify-between items-center border-l-4 border-red-400">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">{service.title}</h2>
                                <p className="text-sm text-gray-500">Narxi: ${service.price} | Davlat: {service.country}</p>
                            </div>
                            {/* Approve Tugmasini qo'yamiz */}
                            <form action={async () => {
                                'use server';
                                await approveService(service.id);
                            }}>
                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-150">
                                    ✅ Tasdiqlash
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            )}
            
            <p className="mt-8 text-center text-sm text-gray-500">
                <Link href="/" className="text-indigo-600 hover:underline">Katalogga qaytish</Link>
            </p>
        </div>
    );
}