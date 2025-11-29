import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, Leaf, RotateCcw, AlertCircle } from "lucide-react";
import React, { useState, useRef, useEffect, FormEvent } from "react";
// Hapus import SDK: import { GoogleGenAI } from '@google/genai'; 
import ReactMarkdown from 'react-markdown';
import Swal from 'sweetalert2'; 

// *************************************************************************
// DEKLARASI TEMA DAN KONFIGURASI API 
// *************************************************************************
const PRIMARY_COLOR_TAILWIND = "bg-emerald-600"; 
const ACCENT_COLOR_TAILWIND = "text-emerald-600"; 
const MODEL_NAME = "gemini-2.5-flash"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

// PENTING: Gunakan kunci yang disediakan di Canvas runtime
const GEMINI_API_KEY = 'AIzaSyB7OU1L0CYeiYOZ5HUJ9vKkc11rqT6_sac';

// System Instruction untuk memandu perilaku model
const SYSTEM_INSTRUCTION = "Anda adalah EcoBot, ahli lingkungan dan keberlanjutan. Balas semua pertanyaan pengguna dengan bahasa Indonesia yang ramah, informatif, dan berfokus pada topik pengelolaan sampah, daur ulang, konservasi, atau isu lingkungan lainnya. Berikan tips praktis atau fakta menarik yang relevan. Jaga jawaban Anda ringkas, jelas, dan lugas.";

// *************************************************************************
// TYPES & DATA
// *************************************************************************

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

// *************************************************************************
// KOMPONEN UTAMA
// *************************************************************************

const EcoBot: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // *************************************************************************
  // INIT & VALIDASI
  // *************************************************************************

  useEffect(() => {
    // Validasi kunci API saat load
    if (GEMINI_API_KEY === 'AIzaSyB7OU1L0CYeiYOZ5HUJ9vKkc11rqT6_sac') {
        setError('⚠️ Kunci API Gemini belum diatur. Chatbot tidak akan berfungsi.');
    } else {
        console.log('✅ Gemini API is ready for fetching.');
    }
  }, []);

  // Scroll ke bawah setiap kali chatHistory berubah
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // *************************************************************************
  // UTILITY FUNCTIONS
  // *************************************************************************

  // Fungsi untuk menangani Exponential Backoff (penting untuk API)
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // *************************************************************************
  // FUNGSI CHAT DENGAN FETCH API
  // *************************************************************************

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === "" || isLoading || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') return;

    const userMessage: Message = { role: "user", parts: [{ text: input.trim() }] };
    const newHistory = [...chatHistory, userMessage];
    
    // Tambahkan pesan user ke history dan bersihkan input
    setChatHistory(newHistory);
    setInput("");
    setIsLoading(true);
    setError(null);

    // Tambahkan placeholder respons model (untuk UX)
    setChatHistory(prev => [...prev, { role: "model", parts: [{ text: "..." }] }]);

    try {
      // PERBAIKAN: Mengganti 'config' menjadi 'generationConfig'
      const payload = {
          contents: newHistory,
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

        // Implementasi Backoff
        if (i < maxRetries - 1) {
            await wait(Math.pow(2, i) * 1000); // 1s, 2s, 4s delay
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

      // Ganti placeholder "..." dengan respons aktual
      setChatHistory(prev => {
          const updatedHistory = [...prev];
          updatedHistory[updatedHistory.length - 1] = modelMessage;
          return updatedHistory;
      });

    } catch (err) {
      console.error("Error during API call:", err);
      // Ganti placeholder "..." dengan pesan error
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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as FormEvent);
    }
  };

  const resetChat = () => {
    Swal.fire({
        title: 'Atur Ulang Chat?',
        text: "Semua riwayat percakapan akan dihapus.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Atur Ulang',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            setChatHistory([]);
            setInput("");
            setError(null);
            Swal.fire('Diatu Ulang!', 'Percakapan Anda telah dihapus.', 'success');
        }
    });
  };

  // *************************************************************************
  // RENDERING UTAMA
  // *************************************************************************

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 antialiased font-sans">
      
      {/* Header */}
      <header className={`p-4 ${PRIMARY_COLOR_TAILWIND} text-white shadow-lg flex justify-between items-center`}>
        <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8"/>
            <h1 className="text-xl font-bold">EcoBot AI</h1>
        </div>
        <button
            onClick={resetChat}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            title="Atur Ulang Chat"
        >
            <RotateCcw className="w-5 h-5"/>
        </button>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatHistory.length === 0 && !error && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center h-full text-center"
            >
                <div className="max-w-md p-6 bg-white rounded-2xl shadow-xl border border-emerald-100">
                    <Sparkles className={`w-10 h-10 mx-auto mb-4 ${ACCENT_COLOR_TAILWIND}`} />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Selamat Datang di EcoBot!</h2>
                    <p className="text-gray-600 mb-4">
                        Tanyakan apa saja tentang pengelolaan sampah, daur ulang, atau tips keberlanjutan.
                    </p>
                    <div className="space-y-2 text-left text-sm text-gray-500">
                        <p>Contoh pertanyaan:</p>
                        <ul className="list-disc list-inside ml-4">
                            <li>Apa itu 3R dan bagaimana mempraktikkannya?</li>
                            <li>Bagaimana cara mendaur ulang botol plastik di rumah?</li>
                            <li>Apa dampak sampah elektronik bagi lingkungan?</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        )}
        
        {/* Error API Key */}
        {error && GEMINI_API_KEY === 'YOUR_API_KEY_HERE' && (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700 flex items-center gap-2"
            >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
            </motion.div>
        )}

        {/* Message Mapping */}
        <AnimatePresence>
          {chatHistory.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* PERBAIKAN: Memindahkan styling prose ke div pembungkus, bukan ke <ReactMarkdown> */}
              <div
                className={`max-w-3xl p-4 rounded-3xl shadow-md ${
                  message.role === "user"
                    ? `${PRIMARY_COLOR_TAILWIND} text-white rounded-br-none`
                    : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                } prose prose-sm max-w-none`}
              >
                <ReactMarkdown>
                  {message.parts[0].text}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-4 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan Anda..."
            className="flex-1 resize-none p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-600 transition-all duration-300 text-lg shadow-inner"
            disabled={isLoading}
            rows={1}
          />
          <motion.button
            type="submit"
            className={`p-4 rounded-2xl text-white transition-all duration-300 shadow-xl ${
              input.trim() === "" || isLoading
                ? `${PRIMARY_COLOR_TAILWIND}/50 cursor-not-allowed`
                : `${PRIMARY_COLOR_TAILWIND} hover:bg-emerald-700 hover:scale-[1.03]`
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={input.trim() === "" || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </motion.button>
        </form>
        <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
                Tekan <b>Enter</b> untuk kirim, <b>Shift + Enter</b> untuk baris baru.
            </p>
            <p className="text-xs text-gray-500 flex items-center">
                Didukung oleh <Sparkles className="w-3 h-3 mx-1"/> Gemini AI
            </p>
        </div>
      </div>

      {/* SweetAlert2 for Reset confirmation */}
      <script>
        {/* Placeholder for SweetAlert2 functions. This must be present for `Swal` to work in the environment. */}
      </script>
    </div>
  );
};

export default EcoBot;