import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag, User, Loader2, ArrowRight, Search } from 'lucide-react';

interface BlogItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  bannerImage: string;
  description: string;
  detailDescription: string;
  galleryImages: string[];
}

const BlogCardWave: React.FC = () => (
  <div className="absolute bottom-0 left-0 right-0 h-30 overflow-hidden rounded-b-3xl z-99">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      className="w-full h-auto block"
    >
      <path
        fill="#3b82f6"
        fillOpacity="0.5"
        d="M0,128L30,149.3C60,171,120,213,180,208C240,203,300,149,360,117.3C420,85,480,75,540,106.7C600,139,660,213,720,240C780,267,840,245,900,208C960,171,1020,117,1080,101.3C1140,85,1200,107,1260,138.7C1320,171,1380,213,1410,234.7L1440,256L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
      ></path>
    </svg>
  </div>
);

const BlogList: React.FC = () => {
  const [allBlogs, setAllBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // Tambahan state untuk pencarian
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const itemsPerPage: number = 9;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/blogData.json');

        if (!response.ok) {
          throw new Error('Gagal memuat data blog');
        }

        const data: BlogItem[] = await response.json();
        setAllBlogs(data);
        setError(null);
      } catch (err) {
        setError('Gagal memuat daftar blog. Silakan coba lagi.');
        console.error('Error fetching blog data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Reset ke halaman 1 setiap kali user mengetik sesuatu di kolom search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Logika Filter
  const filteredBlogs = allBlogs.filter((blog) => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Kalkulasi Pagination berdasarkan hasil Filter
  const totalItems: number = filteredBlogs.length;
  const totalPages: number = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;

  const currentBlogs: BlogItem[] = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = (): void => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = (): void => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            📰 Blog Lestari Bumi 
          </h1>
          <p className="text-gray-600">
            Ikuti perkembangan terbaru seputar lingkungan dan bumi.
          </p>
        </motion.div>

        {/* --- BAGIAN SEARCH BAR (Sesuai Gambar) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 shadow-sm"
              placeholder="Cari berita berdasarkan judul atau deskripsi..."
            />
          </div>
          <div className="text-center mt-4 text-sm text-gray-600 font-medium">
            Total Blog ditemukan: <span className="text-green-600 font-bold">{totalItems}</span> 
            <span className="mx-2 text-gray-300">|</span> 
            Halaman <span className="text-green-600 font-bold">{totalItems > 0 ? currentPage : 0}</span> dari <span className="text-green-600 font-bold">{totalPages || 0}</span>
          </div>
        </motion.div>
        {/* --- END SEARCH BAR --- */}

        {totalItems === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">Tidak ada berita yang ditemukan dengan kata kunci "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-600 hover:underline"
            >
              Tampilkan semua berita
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {currentBlogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] group border border-blue-100 pb-20"
              >
                <Tag className="absolute top-0 right-0 w-20 h-20 text-blue-100 opacity-60 rotate-[10deg] transition-transform duration-500 group-hover:rotate-[30deg] z-0" />
                <Tag className="absolute top-1/2 left-0 w-16 h-16 text-blue-50 opacity-80 -rotate-[30deg] transition-transform duration-500 group-hover:-rotate-[50deg] z-0" />

                <div className="relative h-52 overflow-hidden">
                  <img
                    src={blog.bannerImage}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
                </div>

                <div className="p-6 relative z-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-snug">
                    {blog.title}
                  </h2>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4 border-b border-blue-100 pb-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                      {blog.date}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1 text-blue-500" />
                      {blog.author}
                    </span>
                    <span className="flex items-center">
                      <Tag className="w-4 h-4 mr-1 text-blue-500" />
                      {blog.category}
                    </span>
                  </div>

                  <p className="text-gray-700 text-base mb-4 line-clamp-3">
                    {blog.description}
                  </p>

                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all duration-300 hover:text-blue-700"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>

                <BlogCardWave />
              </motion.article>
            ))}
          </div>
        )}

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
                className="px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-blue-600"
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
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
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
                className="px-4 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-blue-600"
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

export default BlogList;