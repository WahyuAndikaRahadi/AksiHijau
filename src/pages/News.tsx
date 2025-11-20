import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Loader2, Search, Leaf } from 'lucide-react'; 

// Interface untuk data berita
interface NewsItem {
  title: string;
  link: string;
  isoDate: string;
  image: string;
  description: string;
}

// Interface untuk response API
interface ApiResponse {
  message: string;
  total: number;
  data: NewsItem[];
}

// KOMPONEN WAVE
const CardWave: React.FC = () => (
    // h-20 memberikan tinggi yang cukup besar agar wave tampak jelas.
    // bottom-0 agar menempel di dasar card
    <div className="absolute bottom-0 left-0 right-0 h-30 overflow-hidden rounded-b-3xl z-99"> 
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 320"
            // -mt-10 agar gelombang naik sedikit dan memotong tepi atasnya, membuatnya lebih jelas.
            className="w-full h-auto block" 
        >
            <path 
                fill="#22c55e" 
                fillOpacity="0.5" 
                d="M0,128L30,149.3C60,171,120,213,180,208C240,203,300,149,360,117.3C420,85,480,75,540,106.7C600,139,660,213,720,240C780,267,840,245,900,208C960,171,1020,117,1080,101.3C1140,85,1200,107,1260,138.7C1320,171,1380,213,1410,234.7L1440,256L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
            ></path>
        </svg>
    </div>
);


const News: React.FC = () => {
  const [allNewsItems, setAllNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 9;

  useEffect(() => {
    const fetchNews = async (): Promise<void> => {
      try {
        setLoading(true);
        const apiUrl = 'https://berita-indo-api-next.vercel.app/api/antara-news/warta-bumi';
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error('Gagal memuat berita');
        }

        const data: ApiResponse = await response.json();
        
        if (data && data.data) {
          setAllNewsItems(data.data.slice(0, 50)); 
        }
        setError(null);
      } catch (err) {
        setError('Gagal memuat berita. Silakan coba lagi.');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNewsItems = useMemo(() => {
    setCurrentPage(1); 
    if (!searchTerm) {
      return allNewsItems;
    }
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return allNewsItems.filter(item => 
      item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allNewsItems, searchTerm]);

  const totalItems: number = filteredNewsItems.length;
  const totalPages: number = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  
  const currentItems: NewsItem[] = filteredNewsItems.slice(indexOfFirstItem, indexOfLastItem);
  
  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = (): void => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  }, []);

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    e.currentTarget.src = 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  if (loading) {
    return (
      <div className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" /> 
          <p className="text-gray-600">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gradient-to-br from-green-50 to-blue-50 relative"> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Berita Warta Bumi 🌍
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Ikuti perkembangan terbaru seputar lingkungan dan bumi dari Antara News.
          </p>
        </motion.div>

        {/* Search Input and Info */}
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12 max-w-xl mx-auto"
        >
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cari berita berdasarkan judul atau deskripsi..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border border-green-300 rounded-full focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 shadow-md outline-none"
                />
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">
                Total berita ditemukan: <span className="font-semibold text-green-700">{totalItems}</span> | Halaman <span className="font-semibold text-green-700">{currentPage}</span> dari <span className="font-semibold text-green-700">{totalPages}</span>
            </p>
        </motion.div>

        {totalItems === 0 && (
             <div className="text-center py-10 bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center">
                <Leaf className="w-16 h-16 text-green-400 mb-4 animate-bounce" />
                <p className="text-2xl text-gray-700 font-medium mb-2">Ups, tidak ada berita yang ditemukan.</p>
                <p className="text-gray-500 mt-2 text-lg">Coba kata kunci lain atau hapus pencarian Anda.</p>
             </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((item: NewsItem, index: number) => (
            <motion.article
              key={`${item.link}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              // Kita kembalikan padding bawah pada artikel (misalnya pb-16) untuk memberi ruang bagi CardWave.
              className="relative bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] group border border-green-100 pb-20" 
            >
                {/* DEKORASI DAUN LATAR BELAKANG */}
                <Leaf className="absolute top-0 right-0 w-20 h-20 text-green-100 opacity-60 rotate-[10deg] transition-transform duration-500 group-hover:rotate-[30deg] z-0" />
                <Leaf className="absolute top-1/2 left-0 w-16 h-16 text-green-50 opacity-80 -rotate-[30deg] transition-transform duration-500 group-hover:-rotate-[50deg] z-0" />
                
              <div className="relative overflow-hidden h-52"> 
                <img
                  src={item.image || 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent"></div>
              </div>

              {/* Konten Artikel: gunakan padding bawah (pb-6) yang normal agar kartu tampak lebih tinggi dan lega */}
              <div className="p-6 relative z-10"> 
                {/* Judul Artikel */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors duration-300 leading-snug">
                  {item.title}
                </h2>
                
                <div className="flex items-center text-sm text-gray-500 mb-4 border-b border-green-100 pb-3">
                  <Calendar className="w-4 h-4 mr-2 text-green-500" /> 
                  <time dateTime={item.isoDate} className="font-medium">{formatDate(item.isoDate)}</time>
                  <Leaf className="w-4 h-4 ml-auto text-green-400" /> 
                </div>

                {/* Deskripsi */}
                <p className="text-gray-700 text-base mb-4 line-clamp-3">
                  {item.description}
                </p>

                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  // Hapus mb-2 (margin-bottom) agar link ini berada di posisi yang diinginkan
                  className="inline-flex items-center text-green-600 font-semibold group-hover:gap-2 transition-all duration-300 hover:text-green-700" 
                >
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
              
              {/* KOMPONEN WAVE DITEMPATKAN DI SINI (CardWave berada di bottom-0 dari pb-16) */}
              <CardWave />
            </motion.article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && totalItems > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-12"
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-green-600"
                >
                  Sebelumnya
                </button>

                {[...Array(totalPages)].map((_, index: number) => {
                  const pageNumber: number = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 border-2 rounded-lg font-semibold transition-all duration-300 ${
                          currentPage === pageNumber
                            ? 'bg-green-500 text-white border-green-500'
                            : 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                    (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return <span key={pageNumber} className="px-2 text-gray-500">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-green-500 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-green-600"
                >
                  Selanjutnya
                </button>
              </div>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default News;