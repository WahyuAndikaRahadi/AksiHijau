import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, Leaf, RotateCcw, AlertCircle, ArrowLeft, Plus, Image } from "lucide-react"; 
import React, { useState, useRef, useEffect, FormEvent, DragEvent } from "react"; 
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

// Deklarasi global untuk Swal
declare global {
  interface Window {
    Swal: any;
  }
}

// Tema dan Konfigurasi API
const PRIMARY_COLOR_TAILWIND = "bg-emerald-500";
const ACCENT_COLOR_TAILWIND = "text-emerald-600";
const MODEL_NAME = "gemini-2.5-flash-lite";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;
const GEMINI_API_KEY = 'AIzaSyBU_XwDdo1d10izloI1wGlukAjaXTruMzk';

// System Instruction
const SYSTEM_INSTRUCTION = `
Anda adalah EcoBot — asisten ramah yang ahli dalam lingkungan, daur ulang, dan keberlanjutan.

Gaya penyampaian Anda harus selalu rapi, mudah dibaca, dan tidak menggunakan tabel Markdown atau karakter pemisah seperti "|" karena sering membuat tampilan berantakan di platform chat. Jika harus membandingkan dua hal, gunakan format list vertikal yang jelas, dengan judul tebal dan penjelasan singkat di bawahnya. Gunakan line break seperlunya agar struktur tetap nyaman dibaca.

Tujuan utama Anda:
1. Menjawab semua pertanyaan pengguna dengan bahasa Indonesia yang hangat, sederhana, dan tidak kaku.
2. Fokus pada topik lingkungan: pengelolaan sampah, daur ulang, konservasi, perubahan iklim, energi ramah lingkungan, dan isu terkait lainnya.
3. Berikan jawaban yang ringkas, jelas, dan memiliki alur penjelasan yang rapi.
4. Sertakan tips praktis, langkah sederhana, atau insight menarik bila relevan.
5. Jika pengguna mengirim gambar, jelaskan dengan detail apa yang terlihat dan hubungkan dengan konteks lingkungan.
6. Hindari bahasa terlalu teknis; prioritaskan gaya penulisan sehari-hari yang sopan dan mudah dipahami.

Gaya penulisan wajib:
- Gunakan list vertikal, bukan tabel.
- Gunakan paragraf pendek dan line break untuk kenyamanan baca.
- Penjelasan harus mengalir dan tidak bertele-tele.
- Nada harus positif, empatik, dan informatif.
- Gunakan emoji bertema lingkungan hanya jika membantu memperjelas (opsional).

Ingat: EcoBot hadir untuk membuat edukasi lingkungan terasa lebih sederhana, menyenangkan, dan mudah diterapkan dalam kehidupan sehari-hari.
`;



// Konstanta Batas File
const MAX_FILE_COUNT = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Types
interface InlineData {
  mimeType: string;
  data: string;
}

interface Part {
  text?: string;
  inlineData?: InlineData;
}

interface Message {
  role: "user" | "model";
  parts: Part[];
}

// Initial Prompts
const INITIAL_PROMPTS = [
  {
    icon: <Leaf className="w-5 h-5" />,
    text: "Apa 3 langkah termudah untuk mengurangi jejak karbon pribadi?",
    title: "Langkah Kurangi Jejak Karbon",
  },
  {
    icon: <RotateCcw className="w-5 h-5" />,
    text: "Bagaimana cara memisahkan sampah organik dan anorganik dengan benar di rumah?",
    title: "Pilah Sampah Rumah Tangga",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    text: "Ide kreatif mendaur ulang botol plastik bekas untuk dekorasi rumah.",
    title: "Ide Daur Ulang Kreatif",
  },
];

// Komponen Pembantu untuk menampilkan konten pesan
const MessageContent: React.FC<{ message: Message; isUser: boolean }> = ({ message, isUser }) => {
  const imageParts = message.parts.filter(part => part.inlineData);
  const textParts = message.parts.filter(part => part.text);

  return (
    <>
      {imageParts.length > 0 && (
        <div className={`mb-3 ${textParts.length > 0 ? 'pb-3 border-b border-white border-opacity-30' : ''}`}>
          <p className={`font-semibold text-sm mb-2 opacity-90 ${isUser ? 'text-white' : 'text-gray-700'}`}>
            {isUser ? "Foto terlampir:" : "Gambar yang Anda lampirkan:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {imageParts.map((part, partIndex) => {
              const imageUrl = `data:${part.inlineData?.mimeType};base64,${part.inlineData?.data}`;
              return (
                <img 
                  key={partIndex}
                  src={imageUrl} 
                  alt={`Unggahan pengguna ${partIndex + 1}`} 
                  className="rounded-lg shadow-md mt-1"
                  style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'cover' }}
                />
              );
            })}
          </div>
        </div>
      )}
      {textParts.map((part, partIndex) => (
        <ReactMarkdown key={`text-${partIndex}`}>{part.text || ''}</ReactMarkdown>
      ))}
    </>
  );
};


const EcoBot: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // ARRAY OF FILES
  const [base64Files, setBase64Files] = useState<InlineData[]>([]); // ARRAY OF BASE64 DATA
  const [isDragging, setIsDragging] = useState(false); 
  const dragCounter = useRef(0); // Counter untuk drag enter/leave

  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); 

  // Scroll ke bawah saat chatHistory berubah
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Utility: Exponential Backoff
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Fungsi untuk memvalidasi satu file
  const validateSingleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      window.Swal?.fire('Kesalahan', `File ${file.name} bukan file gambar.`, 'error');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) { 
      window.Swal?.fire('Kesalahan', `Ukuran file ${file.name} terlalu besar (Maks 5MB).`, 'error');
      return false;
    }
    return true;
  };
  
  // Fungsi untuk menghapus file berdasarkan indeks
  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setBase64Files(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Fungsi untuk memproses array file (Dipakai oleh drag-drop dan input file)
  const processFiles = (files: FileList | File[]) => {
    const newIncomingFiles = Array.from(files);

    // Gabungkan file yang sudah ada dengan file yang baru masuk untuk cek batas
    const totalFiles = selectedFiles.length + newIncomingFiles.length; 

    // Validasi Batas Jumlah File pada total file
    if (totalFiles > MAX_FILE_COUNT) {
      window.Swal?.fire('Kesalahan', `Anda hanya dapat mengunggah total maksimal ${MAX_FILE_COUNT} gambar. Anda mencoba mengunggah ${totalFiles} file.`, 'error');
      return;
    }

    const validNewFiles: File[] = [];
    newIncomingFiles.forEach(file => { // Hanya validasi file yang baru masuk
      if (validateSingleFile(file)) {
        validNewFiles.push(file);
      } 
    });

    if (validNewFiles.length > 0) {
      // 1. Set Selected Files: Tambahkan file baru ke daftar lama
      setSelectedFiles(prev => [...prev, ...validNewFiles]);

      // 2. Konversi file baru ke Base64
      const base64Promises = validNewFiles.map(file => {
        return new Promise<InlineData>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Menghapus header data URI ("data:image/jpeg;base64,")
            const base64 = (reader.result as string).split(',')[1];
            resolve({
              mimeType: file.type,
              data: base64,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      // 3. Set Base64 Files: Tambahkan base64 baru ke daftar lama
      Promise.all(base64Promises).then(newBase64Data => {
        setBase64Files(prev => [...prev, ...newBase64Data]);
      });
    } 
  };


  // Fungsi untuk menangani pemilihan file (dari input file)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
    } 
    // Kosongkan input file agar event change terpicu jika user memilih file yang sama lagi
    e.target.value = '';
  };


  // --- DRAG AND DROP HANDLERS ---
  
  // Handler: Saat file masuk ke elemen wrapper
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;

    if (e.dataTransfer.types.includes('Files')) {
      dragCounter.current++;
      if (dragCounter.current === 1) { 
        setIsDragging(true); 
      }
    }
  };

  // Handler: Saat drag dilakukan di atas elemen wrapper
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handler: Saat kursor meninggalkan elemen (atau elemen anak)
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    
    dragCounter.current--;

    // Sembunyikan feedback hanya jika counter kembali ke nol
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  // Handler: Saat file dilepaskan
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset counter dan state setelah drop
    setIsDragging(false);
    dragCounter.current = 0; 

    if (isLoading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };
  // -------------------------------

  // Fungsi utama untuk mengirim pesan (Multimodal)
  const handleSendMessage = async (e: FormEvent | string) => {
    let query: string;

    if (typeof e === 'string') {
      query = e;
    } else {
      e.preventDefault();
      query = input.trim();
    }

    // Periksa jika tidak ada teks DAN tidak ada file
    if ((query === "" && selectedFiles.length === 0) || isLoading) return; 

    const userParts: Part[] = [];

    // 1. Tambahkan bagian gambar/file jika ada
    if (selectedFiles.length > 0 && base64Files.length > 0) {
      base64Files.forEach(data => {
        userParts.push({ inlineData: data });
      });
    }

    // 2. Tambahkan bagian teks jika ada
    if (query !== "") {
      userParts.push({ text: query });
    }

    const userMessage: Message = { role: "user", parts: userParts };
    const newHistory = [...chatHistory, userMessage];

    setChatHistory(newHistory);
    setInput("");
    
    setIsLoading(true);
    setError(null);

    // Placeholder respons
    setChatHistory(prev => [...prev, { role: "model", parts: [{ text: "..." }] }]);

    try {
      const payload = {
        contents: newHistory.map(msg => ({
          role: msg.role,
          parts: msg.parts.map(part => {
            if (part.text) return { text: part.text };
            if (part.inlineData) return { inlineData: part.inlineData };
            return {}; 
          }),
        })),
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      };

      let response;
      const maxRetries = 3;

      for (let i = 0; i < maxRetries; i++) {
        response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) break;

        if (i < maxRetries - 1) {
          await wait(Math.pow(2, i) * 1000);
        } else {
          throw new Error(`Gagal menghubungi Gemini API setelah ${maxRetries} percobaan. Status: ${response.status}`);
        }
      }

      if (!response!.ok) {
        throw new Error(`Gemini API error. Status: ${response!.status} - ${response!.statusText}`);
      }

      const data = await response!.json();
      const modelResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!modelResponseText) {
        throw new Error('No valid text response from Gemini.');
      }

      const modelMessage: Message = { role: "model", parts: [{ text: modelResponseText }] };

      // Ganti placeholder dengan respons aktual
      setChatHistory(prev => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1] = modelMessage;
        return updatedHistory;
      });

    } catch (err) {
      console.error("Error during API call:", err);
      setChatHistory(prev => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1] = {
          role: "model",
          parts: [{ text: `❌ Maaf, terjadi kesalahan: ${(err as Error).message}. Coba lagi atau atur ulang chat.` }]
        };
        return updatedHistory;
      });
      setError("Terjadi kesalahan koneksi atau server.");
    } finally {
      setIsLoading(false);
      // Reset state file
      setBase64Files([]); 
      setSelectedFiles([]); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as FormEvent);
    }
  };

  const resetChat = () => {
    if (typeof window.Swal !== 'undefined') {
      window.Swal.fire({
        title: 'Atur Ulang Chat?',
        text: "Semua riwayat percakapan akan dihapus.",
        icon: 'warning',
        confirmButtonColor: '#059669',
        cancelButtonColor: '#d33',
        showCancelButton: true,
        confirmButtonText: 'Ya, Atur Ulang',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          setChatHistory([]);
          setInput("");
          setSelectedFiles([]); 
          setBase64Files([]); 
          setError(null);
          window.Swal.fire('Diatur Ulang!', 'Percakapan Anda telah dihapus.', 'success');
        }
      });
    } else {
      if (window.confirm("Yakin ingin mengatur ulang chat? Semua riwayat akan dihapus.")) {
        setChatHistory([]);
        setInput("");
        setSelectedFiles([]); 
        setBase64Files([]); 
        setError(null);
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col antialiased font-sans bg-emerald-50"
      onDragEnter={handleDragEnter} 
      onDragOver={handleDragOver} 
      onDragLeave={handleDragLeave} 
      onDrop={handleDrop} 
    >
      {/* 1. Tombol-Tombol Fixed (Navbar Minimal) */}
      <div className="fixed top-0 z-30 w-full p-4 pt-6 sm:p-8 flex flex-row justify-between items-center bg-emerald-50"> 
        <button
          className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 text-lg font-medium"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <button
          onClick={resetChat}
          className="text-emerald-700 transition-colors p-2 rounded-full hover:bg-emerald-100"
          title="Atur Ulang Chat"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Header */}
      <header className="mt-20 p-4 pt-6 sm:p-8 flex flex-col items-center relative">
        <div className={`p-3 rounded-full ${PRIMARY_COLOR_TAILWIND} bg-opacity-10 ${ACCENT_COLOR_TAILWIND} mb-4`}>
          <Leaf className="w-8 h-8" />
          </div>

        <h2 className="text-xl font-semibold text-gray-800">Selamat Datang di EcoBot 🌎</h2>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 mb-6 text-center">
          Apa yang ingin Anda ketahui hari ini?
        </h1>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl w-full mx-auto">
        {chatHistory.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-start h-full pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {INITIAL_PROMPTS.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, transition: { delay: index * 0.1 } }}
                  onClick={() => handleSendMessage(prompt.text)}
                  className="p-4 bg-white rounded-xl shadow-md border border-emerald-100 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-between min-h-[120px]"
                >
                  <div className={`p-2 w-fit rounded-lg bg-emerald-500 bg-opacity-10 ${ACCENT_COLOR_TAILWIND} mb-2`}>
                    {prompt.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {prompt.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700 flex items-center gap-2 max-w-lg mx-auto"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <AnimatePresence>
          {chatHistory.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-2xl p-4 rounded-3xl shadow-lg ${
                  message.role === "user"
                    ? `${PRIMARY_COLOR_TAILWIND} text-white rounded-br-lg`
                    : "bg-white text-gray-800 rounded-tl-lg border border-gray-100"
                } prose prose-sm max-w-none`}
              >
                <MessageContent message={message} isUser={message.role === "user"} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>
    

      {/* Visual Feedback Dragging (Position Fixed) */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-500/10 pointer-events-none" 
          >
            <div className="text-emerald-700 flex flex-col items-center p-6 bg-white rounded-lg shadow-xl">
              <Image className="w-10 h-10 mb-2" />
              <p className="font-bold text-lg">LEPASKAN FILE DI MANA SAJA!</p>
              <p className="text-sm text-gray-500">Hanya file gambar yang diterima (Maks 5MB, Maks {MAX_FILE_COUNT} file).</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Input Area */}
      <div className="sticky bottom-0 w-full p-4 sm:p-6 bg-emerald-50 shadow-xl">
        <div className="max-w-4xl mx-auto">
          
          {/* Tampilan Pratinjau File yang Diunggah */}
          {selectedFiles.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-3 p-3 bg-white border border-emerald-300 rounded-xl flex flex-col gap-2 shadow-sm" 
            >
              <p className="text-xs font-semibold text-emerald-600">
                Total: {selectedFiles.length} Gambar terlampir (Maks {MAX_FILE_COUNT})
              </p>
              
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm py-1 border-t border-gray-100 first:border-t-0">
                  <div className="flex items-center gap-3 truncate">
                    <Sparkles className={`w-4 h-4 ${ACCENT_COLOR_TAILWIND} flex-shrink-0`} />
                    <span className="text-gray-700 truncate">{file.name}</span>
                  </div>
                  {/* Tombol Hapus Individu */}
                  <button
                    type="button"
                    onClick={() => removeFile(index)} 
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                  >
                    <Plus className="w-4 h-4 rotate-45" /> 
                  </button>
                </div>
              ))}
              
              <div className="flex justify-end pt-2">
                {/* Tombol Hapus Semua */}
                <button
                  type="button"
                  onClick={() => { setSelectedFiles([]); setBase64Files([]); }}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors font-medium"
                >
                  Hapus Semua Lampiran
                </button>
              </div>

            </motion.div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-4 items-end">
            
            {/* Input File Tersembunyi */}
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              multiple 
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading || selectedFiles.length >= MAX_FILE_COUNT} // Disable ketika loading atau max file tercapai
            />

            {/* Tombol Upload File */}
            <motion.label
              htmlFor="file-upload"
              className={`p-3 rounded-full transition-all duration-300 w-[50px] h-[50px] flex items-center justify-center cursor-pointer ${
                isLoading || selectedFiles.length >= MAX_FILE_COUNT // Disable di sini juga
                  ? 'opacity-50 cursor-not-allowed' 
                  : `bg-emerald-500 bg-opacity-10 ${ACCENT_COLOR_TAILWIND} hover:bg-opacity-20`
              } flex-shrink-0`}
              whileHover={!(isLoading || selectedFiles.length >= MAX_FILE_COUNT) ? { scale: 1.05 } : {}}
              whileTap={!(isLoading || selectedFiles.length >= MAX_FILE_COUNT) ? { scale: 0.95 } : {}}
              title={`Unggah Foto (Maks ${MAX_FILE_COUNT})`}
            >
              <Plus className="w-5 h-5" /> 
            </motion.label>


            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tulis pertanyaan Anda disini..."
              className="flex-1 resize-none py-3 px-6 rounded-full border-2 border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all duration-300 text-base bg-white min-h-[50px] max-h-[150px] overflow-y-auto"
              disabled={isLoading}
              rows={1}
            />

            <motion.button
              type="submit"
              className={`p-3 rounded-full text-white transition-all duration-300 shadow-xl w-[50px] h-[50px] flex items-center justify-center ${
                (input.trim() === "" && selectedFiles.length === 0) || isLoading 
                  ? `${PRIMARY_COLOR_TAILWIND} cursor-not-allowed opacity-50`
                  : `${PRIMARY_COLOR_TAILWIND} hover:bg-emerald-600`
              }`}
              whileHover={!((input.trim() === "" && selectedFiles.length === 0) || isLoading) ? { scale: 1.05 } : {}}
              whileTap={!((input.trim() === "" && selectedFiles.length === 0) || isLoading) ? { scale: 0.95 } : {}}
              disabled={(input.trim() === "" && selectedFiles.length === 0) || isLoading} 
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-5 h-5 rotate-45" />
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EcoBot;
