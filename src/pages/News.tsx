import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Loader2, Search } from 'lucide-react';

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

const News: React.FC = () => {
  const [allNewsItems, setAllNewsItems] = useState<NewsItem[]>([]); // Menyimpan semua berita asli
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk Pencarian
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 9;

  // --- 1. Fungsi Fetch Data ---
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
          setAllNewsItems(data.data); // Simpan semua data
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

  // --- 2. Fungsi Filtering (useMemo) ---
  // Gunakan useMemo untuk memfilter data hanya jika allNewsItems atau searchTerm berubah
  const filteredNewsItems = useMemo(() => {
    setCurrentPage(1); // Reset ke halaman 1 setiap kali filter berubah
    if (!searchTerm) {
      return allNewsItems;
    }
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return allNewsItems.filter(item => 
      item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      item.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allNewsItems, searchTerm]);

  // --- 3. Logika Pagination ---
  const totalItems: number = filteredNewsItems.length;
  const totalPages: number = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  
  // Ambil data untuk halaman saat ini dari hasil filter
  const currentItems: NewsItem[] = filteredNewsItems.slice(indexOfFirstItem, indexOfLastItem);
  
  // Handler untuk pagination
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

  // Handler untuk input pencarian
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  }, []);

  // Format tanggal
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Handle error gambar
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    e.currentTarget.src = 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  if (loading) {
    return (
      <div className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
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
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Berita Warta Bumi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ikuti perkembangan terbaru seputar lingkungan dan bumi dari Antara News
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 shadow-sm"
                />
            </div>
            <p className="text-sm text-gray-500 mt-3 text-center">
                Total berita ditemukan: {totalItems} | Halaman {currentPage} dari {totalPages}
            </p>
        </motion.div>

        {totalItems === 0 && (
             <div className="text-center py-10 bg-white rounded-xl shadow-md">
                <p className="text-xl text-gray-700 font-medium">Tidak ada berita yang cocok dengan kata kunci "{searchTerm}"</p>
                <p className="text-gray-500 mt-2">Coba kata kunci lain atau hapus filter.</p>
             </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((item: NewsItem, index: number) => (
            <motion.article
              key={`${item.link}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={item.image || 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <time dateTime={item.isoDate}>{formatDate(item.isoDate)}</time>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.description}
                </p>

                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-primary font-medium group-hover:gap-2 transition-all duration-300"
                >
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
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
                  className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary"
                >
                  Sebelumnya
                </button>

                {[...Array(totalPages)].map((_, index: number) => {
                  const pageNumber: number = index + 1;
                  // Tampilkan hanya beberapa nomor halaman
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
                            ? 'bg-primary text-white border-primary'
                            : 'border-primary text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                    (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return <span key={pageNumber} className="px-2">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary"
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