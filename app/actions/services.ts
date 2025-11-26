// app/actions/services.ts
"use server"; 

import { cookies } from 'next/headers'; 
import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from "next/cache"; 

// MA'LUMOT TURI
interface ServiceData {
    title: string;
    description: string;
    price: string;
    country: string;
    affiliate_link: string;
    tags: string;
}

// 1. YORDAMCHI FUNKSIYA (O'ZGARTIRILDI: async qilindi va cookies() await qilindi)
const getSupabaseServerClient = async () => {
  const cookieStore = await cookies(); // <--- MANA SHU YERDA 'await' BO'LISHI SHART
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          try { cookieStore.set(name, value, options) } catch (e) {}
        },
        remove: (name: string, options: any) => {
          try { cookieStore.set(name, '', options) } catch (e) {}
        },
      },
    }
  );
};

// TELEGRAM BILDİRİŞNOMA FUNKSIYASI
async function sendTelegramNotification(message: string) {
    const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_ADMIN_CHAT_ID;
    
    if (!BOT_TOKEN || !CHAT_ID) return; 

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' }),
        });
    } catch (error) {
        console.error("Telegramga ulanishda xato:", error);
    }
}

// ASOSIY SERVER ACTION
export async function createService(formData: ServiceData) {
  // 2. O'ZGARTIRILDI: Bu yerda ham 'await' qo'shildi
  const supabase = await getSupabaseServerClient(); 

  const seller_id = "00000000-0000-0000-0000-000000000000"; 
  const { title, description, price, country, affiliate_link, tags } = formData;

  const serviceToInsert = {
    title, description,
    price: parseFloat(price) || 0,
    country, affiliate_link,
    tags: tags.split(",").map(t => t.trim()),
    seller_id, approved: false,
  };

  const { error } = await supabase
    .from("services")
    .insert([serviceToInsert]);

  if (error) {
    return { success: false, message: `Xizmat qo'shishda xato: ${error.message}` };
  }

  const telegramMessage = `
    <b>🔔 YANGI AI XIZMATI QO'SHILDI!</b>
    <b>Nomi:</b> ${title}
    <b>Davlat:</b> ${country}
    <b>Narxi:</b> $${serviceToInsert.price.toFixed(2)}
    <b>Link:</b> 🔗 ${affiliate_link || 'Mavjud emas'}
  `;

  await sendTelegramNotification(telegramMessage);

  revalidatePath("/");
  
  return { success: true, message: "✅ Xizmat muvaffaqiyatli qo'shildi! Admin tasdig'ini kuting." };
}