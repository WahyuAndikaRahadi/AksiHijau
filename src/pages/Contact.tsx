import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2'; // Import SweetAlert2

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Konfigurasi EmailJS (ganti dengan ID Anda)
      const serviceId = 'service_7pgcv2r'; // Ganti dengan Service ID dari EmailJS
      const templateId = 'template_hb65sil'; // Ganti dengan Template ID dari EmailJS
      const publicKey = 'XaoJzqugOBJNnw5Qn'; // Ganti dengan Public Key dari EmailJS

      // Kirim email menggunakan EmailJS
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'aksihijau69@gmail.com', // Email tujuan
        },
        publicKey
      );

      // Notifikasi sukses dengan SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Pesan Anda telah dikirim. Kami akan segera merespons!',
        confirmButtonColor: '#16a34a',
      });

      // Reset form setelah sukses
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      // Notifikasi error dengan SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat mengirim pesan. Coba lagi nanti.',
        confirmButtonColor: '#16a34a',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ada pertanyaan atau ingin berkolaborasi? Kami siap mendengar dari Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Bagian Form (Kiri) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-400 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Kirim Pesan
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan nama Anda"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="email@example.com"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full px-6 py-3 text-white rounded-lg transition-all duration-300 hover:shadow-lg font-semibold flex items-center justify-center gap-2 ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Bagian Info Kontak (Kanan) - Tetap sama */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-400 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informasi Kontak
              </h2>

              <div className="space-y-8 flex-grow">
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">aksihijau69@gmail.com</p>
                  </div>
                </motion.div>

                {/* Telepon */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                    <p className="text-gray-600">+62 895-4147-37959</p>
                  </div>
                </motion.div>

                {/* Alamat & Peta */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Alamat</h3>
                      <p className="text-gray-600">
                        Jl. Dr. KRT Radjiman Widyodiningrat No.32, RT.07/RW.7, Rawa Badung, Kec. Cakung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13930
                      </p>
                    </div>
                  </div>

                  {/* --- AREA PETA GOOGLE MAPS --- */}
                  <div className="mt-4 w-full h-64 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                    <iframe
                      title="Lokasi Kantor"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4342287584636!2d106.92306417402486!3d-6.206312860792983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698bcabb1368d7%3A0xea46dd080cc5e54c!2sSMK%20NEGERI%2069%20JAKARTA!5e0!3m2!1sid!2sid!4v1763522726687!5m2!1sid!2sid"
                      width={"100%"}
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  {/* --- AKHIR AREA PETA --- */}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;