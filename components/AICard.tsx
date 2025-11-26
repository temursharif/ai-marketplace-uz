// components/AICard.tsx
import Link from 'next/link';

// Xizmat ma'lumotlari turi
interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  country: string;
  affiliate_link: string;
  tags: string[];
}

interface AICardProps {
    service: Service;
}

const AICard: React.FC<AICardProps> = ({ service }) => {
  const isFree = service.price === 0 || !service.price;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{service.title}</h2>
        <span className={`text-2xl font-extrabold ${isFree ? 'text-green-600' : 'text-indigo-600'}`}>
          {isFree ? 'Bepul' : `$${service.price}`}
        </span>
      </div>
      
      <p className="text-gray-500 mb-4 h-12 overflow-hidden">{service.description}</p>
      
      <div className="flex flex-wrap space-x-2 mb-4">
        <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
            🌍 {service.country}
        </span>
        {service.tags && service.tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-xs font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      {/* Daromad manbai (Affiliate link orqali sotish) */}
      <Link href={service.affiliate_link || '#'} target="_blank" rel="noopener noreferrer">
        <button className="w-full py-2 bg-cyan-400 text-white font-semibold rounded-lg hover:bg-cyan-500 transition duration-150">
          Hoziroq Olish / Ko'rish
        </button>
      </Link>
    </div>
  );
};

export default AICard;