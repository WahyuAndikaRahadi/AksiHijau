import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Recycle, Leaf, AlertCircle, Sparkles, RotateCw, ArrowLeft } from 'lucide-react';
import Webcam from 'react-webcam';
import Swal from 'sweetalert2'; 

interface DetectionResult {
  detectedObject: string;
  confidence: number;
  wasteAnalysis: {
    wasteType: string;
    recyclable: boolean;
    category: string;
    tips: string[];
    environmentalImpact: string;
  } | null;
}

const WasteDetection: React.FC = () => {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false); 
  const [isAnalyzingWithAI, setIsAnalyzingWithAI] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_2;

  useEffect(() => {
    console.log('✅ Gemini API is ready for analysis.');
  }, []);

  const goBack = (): void => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      Swal.fire('Tidak Menemukan','Tidak ada riwayat untuk kembali. Anggap kembali ke Beranda.', 'info');
    }
  };

  const openCamera = (): void => {
    setIsCameraOpen(true);
    setError(null);
    setCapturedImage(null);
    setDetectionResult(null);
  };

  const closeCamera = (): void => {
    setIsCameraOpen(false);
    setCapturedImage(null);
    setDetectionResult(null);
  };

  const switchCamera = (): void => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = useCallback((): void => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setIsCameraOpen(false);
        analyzeWithGemini(imageSrc);
      }
    }
  }, [webcamRef]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        analyzeWithGemini(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeWithGemini = async (imageBase64: string): Promise<void> => {
    setIsAnalyzingWithAI(true);
    setIsDetecting(true);
    setError(null);

    try {
      const base64Data = imageBase64.split(',')[1];

      const prompt = `Kamu adalah ahli pengelolaan sampah dan lingkungan. 
      
      Analisis gambar ini. Identifikasi **object utama** dalam gambar yang kemungkinan adalah sampah, dan beri nama klasifikasi yang paling spesifik (misalnya, bukan hanya "botol" tapi "Botol Plastik PET").
      
      Berikan analisis lengkap dalam format JSON berikut. Pastikan 'detectedObject' dalam output JSON adalah hasil deteksi spesifik dari gambar.
      {
        "detectedObject": "Nama object yang paling spesifik terdeteksi dalam gambar (contoh: Botol Plastik PET, Sisa Makanan, Baterai Bekas, dll)",
        "wasteType": "Jenis sampah (contoh: Sampah Plastik, Sampah Organik, Sampah Logam, dll)",
        "recyclable": true/false,
        "category": "Kategori sampah (Organik/Anorganik/B3)",
        "tips": [
          "Tip 1 cara pengelolaan",
          "Tip 2 cara pengelolaan",
          "Tip 3 cara pengelolaan",
          "Tip 4 cara pengelolaan",
          "Tip 5 cara pengelolaan"
        ],
        "environmentalImpact": "Penjelasan dampak lingkungan jika tidak dikelola dengan baik (1-2 kalimat)"
      }
      
      Berikan response HANYA dalam format JSON, tanpa penjelasan tambahan.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Gemini API error');
      }

      const data = await response.json();
      const geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!geminiResponse) {
          throw new Error('No valid response from Gemini.');
      }

      const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0]);
        
        const result: DetectionResult = {
          detectedObject: analysisData.detectedObject || "Object Tidak Teridentifikasi",
          confidence: 100,
          wasteAnalysis: analysisData
        };

        setDetectionResult(result);

        const categoryColor = analysisData.category === 'Organik' ? '#10B981' : 
                              analysisData.category === 'Anorganik' ? '#3B82F6' : 
                              analysisData.category === 'B3' ? '#EF4444' : '#6B7280';
                              
        const recyclableText = analysisData.recyclable ? 'Dapat Didaur Ulang' : 'Tidak Didaur Ulang';

        await Swal.fire({
          title: '✅ Analisis Berhasil!',
          html: `
            <div style="text-align: left; padding: 10px;">
              <p><strong>Ditemukan:</strong> ${result.detectedObject}</p>
              <p><strong>Jenis:</strong> ${analysisData.wasteType}</p>
              <p><strong>Kategori:</strong> <span style="font-weight: bold; color: ${categoryColor};">${analysisData.category}</span></p>
              <p><strong>Daur Ulang:</strong> <span style="font-weight: bold; color: ${analysisData.recyclable ? '#10B981' : '#EF4444'};">${recyclableText}</span></p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Lihat Panduan',
          confirmButtonColor: '#10B981', 
          timer: 15000,
        });

      } else {
        throw new Error('Invalid Gemini response format. Could not extract JSON.');
      }
    } catch (error) {
      console.error('Error analyzing with Gemini:', error);
      setError('Gagal menganalisis dengan AI. Pastikan API Key Gemini valid dan gambar jelas.'); 

      await Swal.fire({
        title: 'Gagal Menganalisis!',
        text: 'Terjadi kesalahan saat menghubungi atau memproses respon dari Gemini AI. Cek API Key dan format gambar.',
        icon: 'error',
        confirmButtonColor: '#EF4444', 
      });
      
    } finally {
      setIsAnalyzingWithAI(false);
      setIsDetecting(false);
    }
  };

  const resetDetection = (): void => {
    setCapturedImage(null);
    setDetectionResult(null);
    setIsDetecting(false);
    setIsAnalyzingWithAI(false);
    setError(null);
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'Organik': 'bg-green-500',
      'Anorganik': 'bg-blue-500',
      'B3': 'bg-red-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const videoConstraints = {
    facingMode: facingMode
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12 px-4 pt-28 sm:pt-32 overflow-x-hidden">
      
      <div className="absolute top-0 z-30 left-0 right-0 px-4 pt-6 sm:px-8 sm:pt-8 flex flex-row justify-between items-center "> 
        <button
          className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 text-lg font-medium"
          onClick={goBack} 
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
      </div>

      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 relative" 
        >
          
          <div className="text-center">
            <div className="inline-block p-4 bg-green-500 rounded-full mb-4">
              <Recycle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              EcoScan
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
              Powered by Artificial Intelligence
            </p>
            <p className="text-sm text-gray-500">
              Foto sampah → EcoScan akan analisis dan identifikasi pengelolaan
            </p>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {!capturedImage && !isCameraOpen && (
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={openCamera}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Camera className="w-6 h-6" />
                  Buka Kamera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-green-500 text-green-500 rounded-xl hover:bg-green-50 transition-all duration-300"
                >
                  <Upload className="w-6 h-6" />
                  Upload Foto
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-blue-50 rounded-xl">
                  <Camera className="w-8 h-8 text-blue-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">1. Foto Sampah</h3>
                  <p className="text-sm text-gray-600">Ambil atau upload foto sampah</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-xl">
                  <Sparkles className="w-8 h-8 text-purple-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">2. EcoScan Mengnalisis</h3>
                  <p className="text-sm text-gray-600">AI identifikasi sampah spesifik dan kategorisasi</p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl">
                  <Recycle className="w-8 h-8 text-green-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">3. Panduan Pengelolaan</h3>
                  <p className="text-sm text-gray-600">Tips pengelolaan terbaik dari AI</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  EcoScan Ready
                </div>
              </div>
            </div>
          )}

          {isCameraOpen && (
            <div className="relative bg-black">
              <div className="relative">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-auto"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={closeCamera}
                    className="p-3 bg-red-500/90 backdrop-blur-sm rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>

                  <button
                    onClick={capturePhoto}
                    className="relative p-6 bg-white rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl group"
                  >
                    <Camera className="w-10 h-10 text-green-500" />
                    <div className="absolute inset-0 rounded-full border-4 border-white group-hover:scale-110 transition-transform"></div>
                  </button>

                  <button
                    onClick={switchCamera}
                    className="p-3 bg-blue-500/90 backdrop-blur-sm rounded-full hover:bg-blue-600 transition-all duration-300 shadow-lg"
                  >
                    <RotateCw className="w-6 h-6 text-white" />
                  </button>
                </div>
                <p className="text-center text-white text-sm mt-4 drop-shadow-lg font-medium">
                  📷 Ambil foto sampah untuk memulai analisis
                </p>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-center">📸 Foto Terlampir</h3>
                <div className="relative max-w-2xl mx-auto">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full rounded-xl shadow-2xl"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-center">🤖 Hasil Analisis AI</h3>
                
                {isDetecting && isAnalyzingWithAI && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Sparkles className="w-16 h-16 text-green-500 animate-pulse mb-4" />
                    <p className="text-gray-600 font-medium">EcoScan mendeteksi object & menganalisis...</p>
                    <p className="text-sm text-gray-500 mt-2">Proses deteksi objek dan analisis pengelolaan</p>
                  </div>
                )}

                <AnimatePresence>
                  {detectionResult && !isDetecting && !isAnalyzingWithAI && detectionResult.wasteAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 max-w-3xl mx-auto"
                    >
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-md">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Leaf className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm text-gray-600 font-medium">Deteksi Objek Spesifik (Gemini)</span>
                            <h4 className="text-2xl font-bold text-gray-900 capitalize">
                              {detectionResult.detectedObject}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-6 h-6 text-green-500" />
                          <span className="text-sm text-gray-600 font-medium">Hasil Analisis Sampah</span>
                        </div>
                        
                        <h4 className="text-2xl font-bold text-gray-900 mb-4">
                          {detectionResult.wasteAnalysis.wasteType}
                        </h4>
                        
                        <div className="flex flex-wrap gap-3 mb-4">
                          <span className={`px-4 py-2 ${getCategoryColor(detectionResult.wasteAnalysis.category)} text-white text-sm font-medium rounded-full`}>
                            {detectionResult.wasteAnalysis.category}
                          </span>
                          {detectionResult.wasteAnalysis.recyclable ? (
                            <span className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-full flex items-center gap-2">
                              <Recycle className="w-4 h-4" />
                              Dapat Didaur Ulang
                            </span>
                          ) : (
                            <span className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full flex items-center gap-2">
                              <X className="w-4 h-4" />
                              Tidak Dapat Didaur Ulang
                            </span>
                          )}
                        </div>

                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            <span className="font-bold text-gray-900">💡 Dampak Lingkungan: </span>
                            {detectionResult.wasteAnalysis.environmentalImpact}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-md">
                        <h4 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                          <AlertCircle className="w-6 h-6 text-purple-500" />
                          Panduan Pengelolaan Sampah
                        </h4>
                        <div className="grid gap-3">
                          {detectionResult.wasteAnalysis.tips.map((tip, index) => (
                            <div 
                              key={index} 
                              className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                                {index + 1}
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed flex-1 pt-1">
                                {tip}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                          onClick={resetDetection}
                          className="flex-1 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                        >
                          🔄 Deteksi Sampah Lain
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p className="mb-2">💡 <strong>Tips:</strong> Foto object yang jelas dan tunggal untuk hasil deteksi optimal</p>
          <p className="text-xs text-gray-500">
            Teknologi: React Webcam + Google Gemini 2.5 Flash
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WasteDetection;