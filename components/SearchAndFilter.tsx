// components/SearchAndFilter.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
// Debounce funksiyasi - qidiruvni tez-tez ishga tushirishni oldini oladi
import debounce from 'lodash.debounce'; 

// Sodda Debounce funksiyasini yozamiz (Agar lodash o'rnatilmagan bo'lsa)
const simpleDebounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

// Filtrlash uchun Davlatlar ro'yxati
const allCountries = [
    { code: 'GLOBAL', name: '🌍 Barcha Davlatlar' },
    { code: 'UZB', name: '🇺🇿 Oʻzbekiston' },
    { code: 'USA', name: '🇺🇸 AQSH' },
    { code: 'RUS', name: '🇷🇺 Rossiya' },
    { code: 'IND', name: '🇮🇳 Hindiston' },
];

export default function SearchAndFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // URL dan boshlang'ich qiymatlarni olamiz
    const initialCountry = searchParams.get('country') || 'GLOBAL';
    const initialSearch = searchParams.get('search') || '';

    const [country, setCountry] = useState(initialCountry);
    const [search, setSearch] = useState(initialSearch);

    // URL parametrlarini o'zgartirish funksiyasi
    const updateURL = useCallback((newSearch: string, newCountry: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Qidiruvni sozlash
        if (newSearch) {
            params.set('search', newSearch);
        } else {
            params.delete('search');
        }
        
        // Davlatni sozlash
        if (newCountry !== 'GLOBAL') {
            params.set('country', newCountry);
        } else {
            params.delete('country');
        }
        
        // Yangi URL manziliga navigatsiya qilamiz
        router.push(`/?${params.toString()}`);
    }, [router, searchParams]);
    
    // Qidiruv maydoni uchun debounced funksiya
    // Har 500ms (0.5 sekund)da bir marta ishlaydi
    const debouncedUpdateURL = useCallback(
        simpleDebounce((newSearch: string) => {
            updateURL(newSearch, country);
        }, 500), 
        [country]
    );

    // Input o'zgarganda ishlaydi
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = e.target.value;
        setSearch(newSearch);
        debouncedUpdateURL(newSearch);
    };

    // Davlat o'zgarganda ishlaydi
    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCountry = e.target.value;
        setCountry(newCountry);
        updateURL(search, newCountry);
    };
    
    // URL o'zgarganida local stateni yangilash (agar brauzerda back bosilsa)
    useEffect(() => {
        setSearch(searchParams.get('search') || '');
        setCountry(searchParams.get('country') || 'GLOBAL');
    }, [searchParams]);


    return (
        <div className="mb-8 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Katalog Bo'yicha Qidiruv va Filtrlash</h2>
            
            <div className="flex flex-col md:flex-row gap-4">
                {/* Qidiruv Maydoni */}
                <input
                    type="text"
                    placeholder="AI nomi, turi yoki teglari bo'yicha qidirish..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full md:w-2/3 p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                />
                
                {/* Davlat Filtrlash */}
                <select 
                    value={country} 
                    onChange={handleCountryChange}
                    className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {allCountries.map(c => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}