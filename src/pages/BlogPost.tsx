import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag, User, Loader2, ArrowLeft } from 'lucide-react';

// Interface untuk data blog
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

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>(); // Menggunakan slug untuk URL
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        // Ambil semua data blog
        const response = await fetch('/blogData.json');
        
        if (!response.ok) {
          throw new Error('Gagal memuat data blog');
        }

        const data: BlogItem[] = await response.json();
        // Cari blog berdasarkan slug
        const foundBlog = data.find(item => item.slug === slug);
        
        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          setError('Blog tidak ditemukan.');
        }
        setError(null);
      } catch (err) {
        setError('Gagal memuat detail blog.');
        console.error('Error fetching blog detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="py-20 text-center min-h-screen">
        <p className="text-xl text-red-600">{error || 'Blog tidak ditemukan.'}</p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <a 
              href="/blog" 
              className="mt-6 inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Daftar Blog
            </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <a 
            href="/blog" 
            className="mb-6 inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Daftar Blog
          </a>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 mb-8">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-blue-500" />
              {blog.date}
            </span>
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1 text-green-500" />
              {blog.author}
            </span>
            <span className="flex items-center">
              <Tag className="w-4 h-4 mr-1 text-yellow-500" />
              {blog.category}
            </span>
          </div>

          <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg mb-10">
            <img
              src={blog.bannerImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="lead font-medium text-xl mb-6">{blog.description}</p>
            {/* Split description for paragraphs, assuming detailDescription might contain line breaks */}
            {blog.detailDescription.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Galeri Foto */}
          {blog.galleryImages.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Galeri Foto</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {blog.galleryImages.map((imgSrc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="relative aspect-video rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                    onClick={() => setSelectedImage(imgSrc)}
                  >
                    <img
                      src={imgSrc}
                      alt={`Galeri ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal Galeri */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="max-w-4xl max-h-full w-full relative"
            onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-3xl font-bold z-50 p-2 hover:text-gray-300"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Gambar Galeri Besar"
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BlogPost;