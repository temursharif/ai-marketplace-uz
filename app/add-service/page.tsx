// app/add-service/page.tsx
"use client"; // Bu komponent brauzerda (client side) ishlashini bildiradi

import { useState } from "react";
// Bizning Server Action (Backend logikasi)
import { createService } from "@/app/actions/services"; 

// Form ma'lumotlari uchun TypeScript interfeysi
interface FormState {
    title: string;
    description: string;
    price: string;
    country: string;
    affiliate_link: string;
    tags: string;
}

// Formaning boshlang'ich holati (tozalash uchun ishlatiladi)
const initialFormState: FormState = {
    title: '',
    description: '',
    price: '0', 
    country: 'UZB',
    affiliate_link: '',
    tags: '',
};

export default function AddServicePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  // Formaning butun holatini saqlovchi State
  const [formData, setFormData] = useState<FormState>(initialFormState);
  
  // Inputdagi o'zgarishlarni boshqaruvchi funksiya
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Formani yuborish funksiyasi
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await createService(formData);
    setResult(res);
    setLoading(false);

    // Muvaffaqiyatli bo'lsa, xatolikka sabab bo'lgan .reset() o'rniga State'ni tozalaymiz
    if (res.success) {
      setFormData(initialFormState); 
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-2xl rounded-xl my-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">AI Xizmatni Joylash 🚀</h1>
      <p className="mb-6 text-gray-600">
        AI servisingiz haqida ma'lumot kiriting. Admin tasdig'idan so'ng u katalogda ko'rinadi.
      </p>

      {/* Natija xabari */}
      {result && (
        <div className={`p-4 mb-4 rounded-md font-semibold ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {result.message}
        </div>
      )}

      {/* Form State orqali boshqariladi: value va onChange qo'shilgan */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          name="title" 
          placeholder="Xizmat nomi (Majburiy)" 
          required 
          value={formData.title} 
          onChange={handleChange}
          // RANG TUZATILDI: text-gray-900 va placeholder:text-gray-500 qo'shildi
          className="w-full p-3 border rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
        />
        
        <textarea 
          name="description" 
          placeholder="Batafsil tavsif" 
          rows={4} 
          value={formData.description} 
          onChange={handleChange}
          // RANG TUZATILDI
          className="w-full p-3 border rounded-lg resize-none text-gray-900 placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
        />
        
        <div className="flex gap-4">
          <input 
            name="price" 
            type="number" 
            step="0.01" 
            placeholder="Narxi (USD, masalan: 10.00)" 
            value={formData.price} 
            onChange={handleChange}
            // RANG TUZATILDI
            className="w-1/3 p-3 border rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
          />
          
          <select 
            name="country" 
            value={formData.country} 
            onChange={handleChange}
            // RANG TUZATILDI
            className="w-2/3 p-3 border rounded-lg text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="UZB">🇺🇿 O'zbekiston</option>
            <option value="GLOBAL">🌍 Global</option>
            <option value="RUS">🇷🇺 Rossiya</option>
          </select>
        </div>

        <input 
          name="affiliate_link" 
          type="url" 
          placeholder="Afiliat Link (Sotish manzili) - Daromad manbai" 
          value={formData.affiliate_link}
          onChange={handleChange}
          // RANG TUZATILDI
          className="w-full p-3 border rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
        />
        
        <input 
          name="tags" 
          placeholder="Teglar (Vergul bilan ajrating: video, code, text)" 
          value={formData.tags}
          onChange={handleChange}
          // RANG TUZATILDI
          className="w-full p-3 border rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
        />
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-400"
        >
          {loading ? 'Joylanmoqda...' : "AI Servisni Joylash"}
        </button>
      </form>
    </div>
  );
}