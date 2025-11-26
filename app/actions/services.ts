// app/actions/services.ts
"use server"; 

import { supabase } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache"; 

interface ServiceData {
  title: string;
  description: string;
  price: string;
  country: string;
  affiliate_link: string;
  tags: string;
}

// Telegramga xabar yuborish funksiyasi
async function sendTelegramNotification(message: string) {
    const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_ADMIN_CHAT_ID;
    
    if (!BOT_TOKEN || !CHAT_ID) {
        console.error("Telegram tokeni yoki Chat ID kiritilmagan. Bildirishnoma yuborilmadi.");
        return; 
    }

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML' // Xabarni chiroyli qilish uchun
            }),
        });
    } catch (error) {
        console.error("Telegramga ulanishda xato:", error);
    }
}

// ASOSIY SERVER ACTION
export async function createService(formData: ServiceData) {
  const seller_id = "00000000-0000-0000-0000-000000000000"; 
  const { title, description, price, country, affiliate_link, tags } = formData;

  // Ma'lumotni tayyorlash va Supabase'ga yozish qismi...
  const serviceToInsert = {
    title,
    description,
    price: parseFloat(price) || 0,
    country,
    affiliate_link,
    tags: tags.split(",").map(t => t.trim()),
    seller_id,
    approved: false,
  };

  const { data, error } = await supabase
    .from("services")
    .insert([serviceToInsert])
    .select();

  if (error) {
    console.error("Supabase xatosi:", error);
    return { success: false, message: `Xizmat qo'shishda xato: ${error.message}` };
  }

  // Telegramga bildirishnoma yuborish
  const telegramMessage = `
    <b>🔔 YANGI AI XIZMATI QO'SHILDI!</b>
    
    <b>Nomi:</b> ${title}
    <b>Davlat:</b> ${country}
    <b>Narxi:</b> $${serviceToInsert.price.toFixed(2)}
    <b>Link:</b> 🔗 ${affiliate_link || 'Mavjud emas'}
    
    <b>TEKSHIRISH UCHUN:</b> Admin Panel (Hali yaratilmagan)
    Iltimos, Supabase'da qo'lda <code>approved: true</code> qiling.
  `;

  await sendTelegramNotification(telegramMessage);

  revalidatePath("/");
  
  return { success: true, message: "✅ Xizmat muvaffaqiyatli qo'shildi! Admin tasdig'ini kuting." };
}