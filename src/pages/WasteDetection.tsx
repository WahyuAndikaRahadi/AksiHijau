import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Trash2, Recycle, Leaf, AlertCircle, Sparkles, RotateCw } from 'lucide-react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

// Interface untuk hasil deteksi
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

// Daftar object yang TIDAK boleh dideteksi (manusia)
const EXCLUDED_OBJECTS = [
  'person', 'people', 'man', 'woman', 'child', 'boy', 'girl',
  'human', 'face', 'body', 'hand', 'head'
];

// Filter untuk hanya deteksi barang
const filterObjectDetections = (predictions: cocoSsd.DetectedObject[]): cocoSsd.DetectedObject[] => {
  return predictions.filter(pred => 
    !EXCLUDED_OBJECTS.includes(pred.class.toLowerCase())
  );
};

const WasteDetection: React.FC = () => {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [isAnalyzingWithAI, setIsAnalyzingWithAI] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [realtimePredictions, setRealtimePredictions] = useState<cocoSsd.DetectedObject[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // PENTING: Ganti dengan API Key Gemini Anda
  const GEMINI_API_KEY = 'AIzaSyB7OU1L0CYeiYOZ5HUJ9vKkc11rqT6_sac';

  // Load TensorFlow model
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Loading TensorFlow model...');
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        console.log('✅ TensorFlow model loaded successfully');
      } catch (error) {
        console.error('❌ Error loading TensorFlow model:', error);
        setError('Gagal memuat model AI. Refresh halaman.');
      }
    };
    loadModel();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Buka kamera
  const openCamera = (): void => {
    if (!model) {
      setError('Model AI masih loading. Tunggu hingga tombol aktif.');
      return;
    }
    
    setIsCameraOpen(true);
    setError(null);
    setCapturedImage(null);
    setDetectionResult(null);
    
    // Start real-time detection setelah camera ready
    setTimeout(() => {
      startRealtimeDetection();
    }, 1500);
  };

  // Real-time detection
  const startRealtimeDetection = (): void => {
    if (!model) return;

    const detectFrame = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        
        try {
          const predictions = await model.detect(video);
          // Filter hanya barang (tidak termasuk orang)
          const filteredPredictions = filterObjectDetections(predictions);
          setRealtimePredictions(filteredPredictions);
          
          // Draw predictions on canvas
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              
              drawPredictions(filteredPredictions, ctx, canvas.width, canvas.height);
            }
          }
        } catch (error) {
          console.error('Detection error:', error);
        }
      }
    };

    // Jalankan deteksi setiap 300ms
    detectionIntervalRef.current = setInterval(detectFrame, 300);
  };

  // Gambar bounding box dan label
  const drawPredictions = (
    predictions: cocoSsd.DetectedObject[],
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ): void => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox;
      const confidence = (prediction.score * 100).toFixed(1);

      // Warna border berdasarkan confidence
      const boxColor = prediction.score > 0.7 ? '#10b981' : prediction.score > 0.5 ? '#f59e0b' : '#ef4444';
      
      // Draw bounding box
      ctx.strokeStyle = boxColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // Draw label background
      const label = `${prediction.class} ${confidence}%`;
      ctx.font = 'bold 18px Arial';
      const textWidth = ctx.measureText(label).width;
      const textHeight = 24;

      ctx.fillStyle = boxColor;
      ctx.fillRect(x, y > 30 ? y - textHeight - 8 : y + height + 8, textWidth + 16, textHeight + 8);

      // Draw label text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, x + 8, y > 30 ? y - 12 : y + height + textHeight + 4);

      // Draw corner indicators
      const cornerLength = 25;
      ctx.lineWidth = 5;
      
      // Top-left
      ctx.beginPath();
      ctx.moveTo(x, y + cornerLength);
      ctx.lineTo(x, y);
      ctx.lineTo(x + cornerLength, y);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(x + width - cornerLength, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width, y + cornerLength);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(x, y + height - cornerLength);
      ctx.lineTo(x, y + height);
      ctx.lineTo(x + cornerLength, y + height);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(x + width - cornerLength, y + height);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x + width, y + height - cornerLength);
      ctx.stroke();
    });
  };

  // Tutup kamera
  const closeCamera = (): void => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsCameraOpen(false);
    setCapturedImage(null);
    setDetectionResult(null);
    setRealtimePredictions([]);
  };

  // Switch kamera depan/belakang
  const switchCamera = (): void => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Capture foto dari webcam
  const capturePhoto = useCallback((): void => {
    if (!model) {
      setError('Model AI belum siap. Tunggu beberapa detik...');
      return;
    }

    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (imageSrc) {
        setCapturedImage(imageSrc);
        
        // Stop real-time detection
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
          detectionIntervalRef.current = null;
        }
        
        setIsCameraOpen(false);
        setRealtimePredictions([]);
        
        // Deteksi dengan TensorFlow
        detectObject(imageSrc);
      }
    }
  }, [webcamRef, model]);

  // Handle upload file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        detectObject(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Deteksi object dengan TensorFlow.js
  const detectObject = async (imageData: string): Promise<void> => {
    if (!model) {
      setError('Model AI belum siap. Tunggu sebentar...');
      return;
    }

    setIsDetecting(true);
    setError(null);

    try {
      const img = new Image();
      img.src = imageData;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const predictions = await model.detect(img);
      // Filter hanya barang
      const filteredPredictions = filterObjectDetections(predictions);
      
      if (filteredPredictions.length > 0) {
        const detected = filteredPredictions[0];
        console.log('TensorFlow Detection:', detected);

        const result: DetectionResult = {
          detectedObject: detected.class,
          confidence: detected.score * 100,
          wasteAnalysis: null
        };
        
        setDetectionResult(result);
        setIsDetecting(false);

        // Analisis dengan Gemini AI
        await analyzeWithGemini(detected.class, imageData);
      } else {
        setError('Tidak ada barang terdeteksi. Pastikan hanya memfoto barang/sampah, bukan orang.');
        setIsDetecting(false);
      }
    } catch (error) {
      console.error('Error detecting object:', error);
      setError('Gagal mendeteksi object. Coba lagi.');
      setIsDetecting(false);
    }
  };

  // Analisis dengan Gemini AI
  const analyzeWithGemini = async (detectedObject: string, imageBase64: string): Promise<void> => {
    setIsAnalyzingWithAI(true);

    try {
      const base64Data = imageBase64.split(',')[1];

      const prompt = `Kamu adalah ahli pengelolaan sampah dan lingkungan. 
      
Object yang terdeteksi: "${detectedObject}"

Berdasarkan object tersebut, berikan analisis lengkap dalam format JSON berikut:
{
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

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
      const geminiResponse = data.candidates[0].content.parts[0].text;
      
      const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const wasteAnalysis = JSON.parse(jsonMatch[0]);
        
        setDetectionResult(prev => prev ? {
          ...prev,
          wasteAnalysis
        } : null);
      } else {
        throw new Error('Invalid Gemini response format');
      }
    } catch (error) {
      console.error('Error analyzing with Gemini:', error);
      setError('Gagal menganalisis dengan AI. Pastikan API Key Gemini valid.');
    } finally {
      setIsAnalyzingWithAI(false);
    }
  };

  // Reset
  const resetDetection = (): void => {
    setCapturedImage(null);
    setDetectionResult(null);
    setIsDetecting(false);
    setIsAnalyzingWithAI(false);
    setError(null);
    setRealtimePredictions([]);
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-4 bg-green-500 rounded-full mb-4">
            <Recycle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Deteksi Sampah AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            Powered by TensorFlow.js & Google Gemini AI
          </p>
          <p className="text-sm text-gray-500">
            Foto sampah → AI deteksi object → Gemini analisis pengelolaan
          </p>
        </motion.div>

        {/* Error Message */}
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

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Initial State */}
          {!capturedImage && !isCameraOpen && (
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={openCamera}
                  disabled={!model}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-6 h-6" />
                  {!model ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                      Loading Model...
                    </>
                  ) : (
                    'Buka Kamera'
                  )}
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!model}
                  className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-green-500 text-green-500 rounded-xl hover:bg-green-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-blue-50 rounded-xl">
                  <Camera className="w-8 h-8 text-blue-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">1. Foto Sampah</h3>
                  <p className="text-sm text-gray-600">Kamera real-time dengan deteksi otomatis</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-xl">
                  <Leaf className="w-8 h-8 text-purple-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">2. TensorFlow Deteksi</h3>
                  <p className="text-sm text-gray-600">AI identifikasi dengan border & label</p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl">
                  <Sparkles className="w-8 h-8 text-green-500 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">3. Gemini Analisis</h3>
                  <p className="text-sm text-gray-600">Tips pengelolaan dari AI</p>
                </div>
              </div>

              {/* Status Model */}
              {model && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    AI Model Ready
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Camera View dengan React Webcam */}
          {isCameraOpen && (
            <div className="relative bg-black">
              <div className="relative">
                {/* Webcam */}
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full h-auto"
                />
                
                {/* Canvas overlay untuk bounding box */}
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Info real-time detections */}
              {realtimePredictions.length > 0 && (
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white">
                    <p className="text-sm font-semibold mb-2">
                      🎯 Terdeteksi: {realtimePredictions.length} object
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {realtimePredictions.slice(0, 3).map((pred, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-500 rounded-full text-xs font-medium"
                        >
                          {pred.class} ({(pred.score * 100).toFixed(0)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Camera controls */}
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
                  {realtimePredictions.length > 0 
                    ? '✅ Object terdeteksi! Tekan tombol untuk capture' 
                    : '📷 Arahkan kamera ke sampah'}
                </p>
              </div>
            </div>
          )}

          {/* Result Section - Layout Full Width */}
          {capturedImage && (
            <div className="p-6 sm:p-8">
              {/* Captured Image - Full Width di Atas */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-center">📸 Foto Hasil Jepretan</h3>
                <div className="relative max-w-2xl mx-auto">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full rounded-xl shadow-2xl"
                  />
                </div>
              </div>

              {/* Analysis Result - Full Width di Bawah */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-center">🤖 Hasil Analisis AI</h3>
                
                {/* TensorFlow Detection Loading */}
                {isDetecting && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 font-medium">TensorFlow mendeteksi object...</p>
                  </div>
                )}

                {/* Gemini Analysis Loading */}
                {!isDetecting && isAnalyzingWithAI && detectionResult && (
                  <div className="space-y-4">
                    <div className="max-w-2xl mx-auto p-6 bg-blue-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600 font-medium">Object Terdeteksi</span>
                        <span className="text-sm font-bold text-blue-600">
                          {detectionResult.confidence.toFixed(1)}% yakin
                        </span>
                      </div>
                      <h4 className="text-3xl font-bold text-gray-900 capitalize text-center">
                        {detectionResult.detectedObject}
                      </h4>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center py-12">
                      <Sparkles className="w-16 h-16 text-green-500 animate-pulse mb-4" />
                      <p className="text-gray-600 font-medium">Gemini AI menganalisis sampah...</p>
                      <p className="text-sm text-gray-500 mt-2">Mohon tunggu sebentar</p>
                    </div>
                  </div>
                )}

                {/* Final Result */}
                <AnimatePresence>
                  {detectionResult && !isDetecting && !isAnalyzingWithAI && detectionResult.wasteAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 max-w-3xl mx-auto"
                    >
                      {/* TensorFlow Detection Card */}
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-md">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Leaf className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm text-gray-600 font-medium">TensorFlow Detection</span>
                            <h4 className="text-2xl font-bold text-gray-900 capitalize">
                              {detectionResult.detectedObject}
                            </h4>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {detectionResult.confidence.toFixed(1)}%
                            </div>
                            <span className="text-xs text-gray-500">Confidence</span>
                          </div>
                        </div>
                      </div>

                      {/* Gemini Analysis Card */}
                      <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-md">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-6 h-6 text-green-500" />
                          <span className="text-sm text-gray-600 font-medium">Gemini AI Analysis</span>
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

                      {/* Tips Pengelolaan */}
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

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                          onClick={resetDetection}
                          className="flex-1 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                        >
                          🔄 Deteksi Sampah Lain
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="flex-1 py-4 border-2 border-green-500 text-green-500 rounded-xl hover:bg-green-50 transition-all duration-300 font-bold text-lg"
                        >
                          🖨️ Cetak Hasil
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>

        {/* Educational Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p className="mb-2">💡 <strong>Tips:</strong> Pastikan object terlihat jelas untuk hasil deteksi optimal</p>
          <p className="text-xs text-gray-500">
            Teknologi: React Webcam + TensorFlow.js COCO-SSD + Google Gemini 1.5 Flash
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WasteDetection;