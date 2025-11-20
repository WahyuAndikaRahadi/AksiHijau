import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag, User, Loader2 } from 'lucide-react';

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

const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Ambil data dari file JSON di folder public
        const response = await fetch('/blogData.json'); 
        
        if (!response.ok) {
          throw new Error('Gagal memuat data blog');
        }

        const data: BlogItem[] = await response.json();
        setBlogs(data);
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
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-gray-900 text-center mb-12"
        >
          📰 Blog Lestari Bumi
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl group"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={blog.bannerImage}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
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
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h2>
                
                <p className="text-gray-600 mb-5 line-clamp-3">
                  {blog.description}
                </p>
                
                <Link
                  to={`/blog/${blog.slug}`}
                  className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                >
                  Baca Selengkapnya 
                  <span className="ml-1 text-lg group-hover:ml-2 transition-all duration-300">→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;