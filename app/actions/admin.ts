// app/actions/admin.ts
"use server";

import { supabase } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache"; 

// AI xizmatini tasdiqlash funksiyasi
export async function approveService(serviceId: string) {
    // Admin ID tekshiruvi bu yerda qo'shiladi (keyingi bosqichlarda)
    
    // Ma'lumotni bazada yangilash
    const { data, error } = await supabase
        .from("services")
        .update({ approved: true }) // approved: true ga o'tkazamiz
        .eq('id', serviceId)
        .select();

    if (error) {
        console.error("Admin xatosi: Tasdiqlash muvaffaqiyatsiz bo'ldi", error);
        return { success: false, message: `Tasdiqlashda xato: ${error.message}` };
    }

    // Katalog sahifasini yangilash (darhol ko'rinishi uchun)
    revalidatePath("/");
    
    return { success: true, message: `✅ ${data[0].title} tasdiqlandi va katalogda ko'rsatildi.` };
}