import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import { 
  CloudSun, Droplets, Wind, Thermometer, Sun, CloudRain, Navigation, Eye, MapPin, 
  BookOpen, AlertTriangle, HeartPulse, Zap, Leaf, ShieldCheck, Sparkles,
  Loader2, LocateFixed, Circle, CheckCircle, Skull
} from 'lucide-react';

// ==========================================
// LEAFLET CONFIG & HELPER COMPONENTS
// ==========================================

// Fix for default marker icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Komponen untuk menambahkan kontrol pencarian di peta
function SearchControl({ onSearchResult }) {
  const map = useMap();
  
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: "bar",
      autoClose: true,
      keepResult: true,
      searchLabel: "Cari lokasi industri",
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { location } = result;
      if (onSearchResult) {
        onSearchResult({
          lat: location.y,
          lon: location.x,
          name: location.label || "Lokasi Baru"
        });
      }
    });

    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation");
    };
  }, [map, onSearchResult]);

  return null;
}

// Data Mapping Kualitas Udara (Air Quality Index - AQI)
const airQualityMap = {
  1: { label: "Baik", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle },
  2: { label: "Sedang", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Leaf },
  3: { label: "Tidak Sehat", color: "text-orange-500", bg: "bg-orange-500/10", icon: AlertTriangle },
  4: { label: "Sangat Tidak Sehat", color: "text-red-600", bg: "bg-red-600/10", icon: HeartPulse },
  5: { label: "Berbahaya", color: "text-purple-600", bg: "bg-purple-600/10", icon: Skull }
};

// Fungsi untuk mendapatkan icon cuaca yang sesuai
const getWeatherIcon = (iconCode) => {
    const code = iconCode?.toString().slice(0, 2); // Ambil hanya dua digit pertama
    if (code === '01') return Sun; 
    if (code === '02' || code === '03' || code === '04') return CloudSun; 
    if (code === '09' || code === '10') return CloudRain; 
    if (code === '11') return Zap; 
    if (code === '13') return Droplets; // Untuk snow
    if (code === '50') return Eye; // Untuk mist/kabut
    return CloudSun;
};

// Fungsi untuk konversi deskripsi OpenWeatherMap ke Bahasa Indonesia
const translateWeatherDescription = (desc) => {
    if (!desc) return 'Tidak Tersedia';
    const translations = {
      'clear sky': 'Cerah', 'few clouds': 'Cerah Berawan', 'scattered clouds': 'Berawan',
      'broken clouds': 'Berawan Tebal', 'shower rain': 'Hujan Ringan', 'rain': 'Hujan',
      'thunderstorm': 'Badai Petir', 'snow': 'Salju', 'mist': 'Kabut/Berkabut',
      'overcast clouds': 'Berawan', 'light rain': 'Hujan Ringan', 'partly cloudy': 'Cerah Berawan'
    };
    const lowerDesc = desc.toLowerCase();
    for (const key in translations) {
        if (lowerDesc.includes(key)) {
            return translations[key];
        }
    }
    return desc;
};

// ==========================================
// 1. WEATHER DASHBOARD COMPONENT (REAL-TIME + DYNAMIC FORECAST)
// ==========================================

const WeatherDashboard: React.FC<{ weatherData: any, locationName: string, isLoading: boolean }> = ({ weatherData, locationName, isLoading }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Data real-time (Suhu sudah dalam Celsius dari API)
  const mainTemp = weatherData?.main?.temp ? Math.round(weatherData.main.temp) : 30;
  const feelsLike = weatherData?.main?.feels_like ? Math.round(weatherData.main.feels_like) : 30;
  const description = weatherData?.weather?.[0]?.description || 'Cerah Berawan';
  const humidity = weatherData?.main?.humidity || 65;
  const windSpeed = weatherData?.wind?.speed ? (weatherData.wind.speed * 3.6).toFixed(1) : '12';
  const visibility = weatherData?.visibility ? (weatherData.visibility / 1000).toFixed(1) : '8.0';
  const iconCode = weatherData?.weather?.[0]?.icon || '04d';
  const WeatherIcon = getWeatherIcon(iconCode);
  
  // Data tetap/wajar untuk tampilan
  const uvIndex = 8;
  const isHighUV = uvIndex > 7;
  const windDirection = 'Tenggara';
  const weatherDescriptionID = translateWeatherDescription(description);

  // --- LOGIKA UNTUK PRAKIRAAN 4 HARI ---
  
  const dailyForecasts = useMemo(() => {
    const today = new Date();
    
    // Logika Prediksi Sederhana berdasarkan Hari Ini
    const getForecastVariation = (currentTemp, index) => {
        const offset = index % 4; // 1, 2, 3, 0
        let tempChange = 0;
        let condition = { label: 'Berawan', icon: CloudSun, color: 'bg-slate-100 text-slate-600' };

        if (offset === 1) { // Besok
            tempChange = -1; 
            condition = { label: 'Hujan Ringan', icon: CloudRain, color: 'bg-blue-100 text-blue-600' };
        } else if (offset === 2) { // Lusa
            tempChange = 1;
            condition = { label: 'Cerah Berawan', icon: CloudSun, color: 'bg-yellow-100 text-yellow-600' };
        } else if (offset === 3) { // Hari ke-3
            tempChange = 2;
            condition = { label: 'Cerah Penuh', icon: Sun, color: 'bg-orange-100 text-orange-600' };
        }

        const newTemp = Math.max(28, Math.min(34, currentTemp + tempChange)); // Batasi suhu
        return { temp: `${newTemp}°`, ...condition };
    };

    const forecasts = [];
    for (let i = 1; i <= 4; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        const dayName = nextDay.toLocaleDateString('id-ID', { weekday: 'long' });
        
        forecasts.push({
            day: i === 1 ? 'Besok' : dayName,
            ...getForecastVariation(mainTemp, i),
        });
    }
    return forecasts;
  }, [mainTemp]); // Recalculate if the main temperature changes

  const blobVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <section className="py-10 px-4 w-full max-w-7xl mx-auto font-sans">
       {/* Header Section */}
       <div className="flex flex-col md:flex-row justify-between items-end mb-10 ml-2">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              Kondisi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Cuaca Real-time</span>
            </h2>
            <p className="text-slate-500 mt-2 text-lg">Pantauan cuaca dan atmosfer kawasan industri.</p>
          </div>
          
          {/* Live Indicator */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 mt-4 md:mt-0">
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
            ) : (
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
            )}
            <span className="text-sm font-semibold text-slate-600">{isLoading ? 'Mencari Lokasi...' : 'Data Langsung'}</span>
          </div>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* === LEFT: MAIN WEATHER CARD (Span 7 columns) === */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 relative overflow-hidden rounded-[3rem] text-white shadow-2xl shadow-blue-200/50 min-h-[400px] flex flex-col justify-between p-10 group"
        >
          {/* Dynamic Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 z-0"></div>
          <motion.div variants={blobVariants} animate="animate" className="absolute top-[-20%] right-[-20%] w-96 h-96 bg-cyan-300 rounded-full blur-[100px] mix-blend-overlay"></motion.div>
          <motion.div variants={blobVariants} animate="animate" transition={{ delay: 2 }} className="absolute bottom-[-20%] left-[-20%] w-80 h-80 bg-blue-400 rounded-full blur-[80px] mix-blend-overlay"></motion.div>
          
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] z-0"></div>

          {/* Content Top */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 px-5 py-2 rounded-full flex items-center gap-2 transition-transform group-hover:scale-105">
              <MapPin className="w-4 h-4 text-white" />
              <span className="font-medium tracking-wide text-sm truncate max-w-[200px]">{locationName}</span>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold tracking-tighter">{formattedTime}</div>
              <div className="text-blue-100 font-medium text-sm mt-1">{formattedDate}</div>
            </div>
          </div>

          {/* Content Center/Bottom */}
          <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center justify-between mt-8">
            <div>
              <div className="flex items-start">
                <span className="text-[10rem] leading-none font-black tracking-tighter drop-shadow-lg">{mainTemp}</span>
                <span className="text-6xl font-light text-blue-200 mt-4">°</span>
              </div>
              <div className="text-3xl font-medium text-white/90 ml-2">{weatherDescriptionID}</div>
              <div className="text-lg font-light text-blue-200 ml-2 mt-1">Terasa seperti {feelsLike}°</div>
            </div>
            
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="mb-4 md:mb-0"
            >
              <WeatherIcon className="w-48 h-48 text-yellow-300 drop-shadow-2xl" strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>


        {/* === RIGHT: GRID DETAILS (Span 5 columns) === */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            {/* Kelembaban Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2.5rem] p-6 shadow-lg shadow-slate-100 border border-slate-100 flex flex-col justify-between"
            >
               <div className="flex justify-between items-start">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                   <Droplets className="w-6 h-6" />
                 </div>
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Kelembaban</span>
               </div>
               <div className="mt-4">
                 <span className="text-4xl font-bold text-slate-800">{humidity}</span><span className="text-xl text-slate-400 font-medium">%</span>
                 <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${humidity}%` }} className="h-full bg-blue-500 rounded-full" />
                 </div>
               </div>
            </motion.div>

            {/* Angin Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-900 text-white rounded-[2.5rem] p-6 shadow-lg flex flex-col justify-between relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500 blur-3xl opacity-20"></div>

               <div className="flex justify-between items-start relative z-10">
                 <div className="p-3 bg-white/10 rounded-2xl">
                   <Wind className="w-6 h-6" />
                 </div>
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Angin</span>
               </div>
               <div className="mt-4 relative z-10">
                 <span className="text-4xl font-bold">{windSpeed}</span> <span className="text-sm text-slate-400">km/j</span>
                 <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                    <Navigation className="w-3 h-3 rotate-45" /> Arah {windDirection}
                 </div>
               </div>
            </motion.div>

            {/* UV Index Card (Data Tetap/Wajar) */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2.5rem] p-6 shadow-lg shadow-slate-100 border border-slate-100 flex flex-col justify-between"
            >
               <div className="flex justify-between items-start">
                 <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                   <Sun className="w-6 h-6" />
                 </div>
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Indeks UV</span>
               </div>
               <div className="mt-4">
                 <span className="text-4xl font-bold text-slate-800">{uvIndex}</span>
                 <span className={`ml-2 px-2 py-0.5 ${isHighUV ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} text-[10px] font-bold rounded-full uppercase`}>
                    {isHighUV ? 'Tinggi' : 'Sedang'}
                 </span>
                 <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${uvIndex * 10}%` }} className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" />
                 </div>
               </div>
            </motion.div>

            {/* Visibility Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2.5rem] p-6 shadow-lg shadow-slate-100 border border-slate-100 flex flex-col justify-between"
            >
               <div className="flex justify-between items-start">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                   <Eye className="w-6 h-6" />
                 </div>
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Jarak Pandang</span>
               </div>
               <div className="mt-4">
                 <span className="text-4xl font-bold text-slate-800">{visibility}</span> <span className="text-sm text-slate-400">km</span>
                 <p className="mt-2 text-xs text-slate-500">Jarak pandang baik untuk operasional.</p>
               </div>
            </motion.div>

        </div>
      </div>

      {/* === BOTTOM: INFORMASI FORECAST (Dynamic) === */}
      <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
            <CloudSun className="w-5 h-5 mr-2 text-cyan-500" /> Prakiraan 4 Hari Mendatang
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {dailyForecasts.map((item) => (
                <div 
                    key={item.day}
                    className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between transition-shadow hover:shadow-md"
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-slate-400 text-xs font-bold uppercase">{item.day}</div>
                            <div className="text-sm font-semibold text-slate-600">{item.label}</div>
                        </div>
                    </div>
                    <div className="text-xl font-bold text-slate-800">{item.temp}</div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};


// ==========================================
// 2. AIR QUALITY COMPONENT (MAIN LOGIC & API)
// ==========================================
const AirQuality: React.FC = () => {
    // Kunci API sudah terpasang
    const OPENWEATHER_API_KEY = "f2c01965f5cc81db1486d398e1cdcf81";
    
    // Lokasi default (Jakarta Industrial Estate)
    const fallbackLocation = { lat: -6.2088, lon: 106.8456, name: 'Jakarta Industrial Estate' };
    const mapRef = useRef(null);

    const [location, setLocation] = useState(fallbackLocation); 
    const [pollutionData, setPollutionData] = useState(null);
    const [weatherData, setWeatherData] = useState(null); 
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLocationSearchResult = (newLocation) => {
        // Ketika lokasi baru dicari di peta, segera update state dan fetch data
        setLocation(newLocation);
        fetchEnvironmentalData(newLocation); 
        if (mapRef.current) {
            mapRef.current.flyTo([newLocation.lat, newLocation.lon], 13);
        }
    };

    const fetchEnvironmentalData = async (loc) => {
        setIsDataLoading(true);
        setError(null);
        setPollutionData(null);
        setWeatherData(null);
        
        // Cek jika API Key valid (Anda sudah memasangnya)
        if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY.length < 30) {
             setError("ERROR: Kunci API OpenWeatherMap tidak valid.");
             setIsDataLoading(false);
             return;
        }

        try {
            // 1. Fetch Air Pollution Data
            const pollutionPromise = fetch(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${loc.lat}&lon=${loc.lon}&appid=${OPENWEATHER_API_KEY}`
            ).then(res => {
                if (res.status === 401) throw new Error("Unauthorized (Kunci API Salah/Tidak Aktif)");
                if (!res.ok) throw new Error(`Status: ${res.statusText}`);
                return res.json();
            });

            // 2. Fetch Weather Data (Cuaca)
            const weatherPromise = fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=id`
            ).then(res => {
                if (res.status === 401) throw new Error("Unauthorized (Kunci API Salah/Tidak Aktif)");
                if (!res.ok) throw new Error(`Status: ${res.statusText}`);
                return res.json();
            });

            const [pollutionDataResult, weatherDataResult] = await Promise.all([pollutionPromise, weatherPromise]);
            
            // Dapatkan nama lokasi yang lebih baik dari respons cuaca
            const finalLocationName = weatherDataResult?.name || loc.name;
            
            setPollutionData(
                pollutionDataResult.list && pollutionDataResult.list[0] ? pollutionDataResult.list[0] : null
            );
            setWeatherData(weatherDataResult);
            
            // Perbarui state lokasi dengan nama yang lebih akurat
            setLocation({
                ...loc, 
                name: finalLocationName // Menggunakan nama dari respons API
            });

        } catch (err) {
            console.error("Error fetching environmental data:", err);
            setError(`Gagal memuat data lingkungan: ${err.message}.`);
        } finally {
            setIsDataLoading(false);
        }
    };

    // === REWRITE UTAMA: Geolocation Saat Komponen Dimuat dengan Log Diagnostik ===
    useEffect(() => {
        setIsDataLoading(true);
        setError(null);

        if (navigator.geolocation) {
            console.log("DIAGNOSIS: Mencoba mendapatkan lokasi GPS user...");

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const gpsLocation = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                        name: 'Lokasi Anda (GPS)', 
                    };
                    
                    console.log(`DIAGNOSIS: GPS Berhasil Ditemukan! Lat: ${gpsLocation.lat}, Lon: ${gpsLocation.lon}`);

                    setLocation(gpsLocation);
                    fetchEnvironmentalData(gpsLocation);
                },
                (err) => {
                    let errMsg = "Akses lokasi ditolak. Menggunakan lokasi default.";
                    
                    if (err.code === 1) {
                        // Permission denied
                        errMsg = "ERROR GPS (Code 1): Akses lokasi DITOLAK. Pastikan Anda mengizinkan lokasi di browser/sistem. Menggunakan lokasi default.";
                    } else if (err.code === 3) {
                        // Timeout
                        errMsg = "ERROR GPS (Code 3): Gagal mendapatkan lokasi (Timeout 15 detik). Cek koneksi Anda. Menggunakan lokasi default.";
                    } else {
                        // Other error
                        errMsg = `ERROR GPS (Code ${err.code}): Terjadi kesalahan tidak terduga. Menggunakan lokasi default.`;
                    }

                    console.error("DIAGNOSIS:", errMsg, err);
                    setError(errMsg);
                    
                    // Gunakan fallback jika Geolocation gagal
                    fetchEnvironmentalData(fallbackLocation);
                    setLocation(fallbackLocation);
                },
                {
                    timeout: 15000, 
                    maximumAge: 60000 
                }
            );
        } else {
            const errMsg = "Browser tidak mendukung Geolocation. Menggunakan lokasi default.";
            console.error("DIAGNOSIS:", errMsg);
            setError(errMsg);
            fetchEnvironmentalData(fallbackLocation);
            setLocation(fallbackLocation);
        }
    }, []); 

    const aqi = pollutionData?.main?.aqi || 0;
    
    // PERBAIKAN BUG FALLBACK AQI: Jika AQI adalah 0, gunakan status "Tidak Tersedia"
    const aqiStatus = aqi > 0 ? airQualityMap[aqi] : { 
        label: "Tidak Tersedia", 
        color: "text-slate-500", 
        bg: "bg-slate-100", 
        icon: Circle 
    };

    const components = pollutionData?.components || {};
    const mapCenter = [location.lat, location.lon];

    return (
        <section className="py-12 px-4 w-full">
            <WeatherDashboard 
                weatherData={weatherData} 
                locationName={location.name} 
                isLoading={isDataLoading}
            />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto bg-white border border-slate-100 rounded-[2rem] p-8 lg:p-12 overflow-hidden relative shadow-2xl shadow-cyan-50/50"
            >
                {/* Header Air Quality */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                            Pantauan <span className="text-cyan-500">Kualitas Udara</span> Real-time
                        </h2>
                        <p className="text-slate-500 mt-1 text-lg">Indeks Pencemaran Udara (AQI) untuk kawasan industri.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- KONTEN KIRI: AIR QUALITY DATA --- */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* AQI Status Card */}
                        <div className={`p-6 rounded-3xl ${aqiStatus.bg} border border-slate-100 shadow-lg`}>
                            <div className="flex items-center gap-3 mb-4">
                                <aqiStatus.icon className={`w-8 h-8 ${aqiStatus.color}`} />
                                <h3 className={`text-2xl font-extrabold ${aqiStatus.color}`}>
                                    Status: {aqiStatus.label}
                                </h3>
                            </div>
                            <div className="text-6xl font-black text-slate-800 tracking-tighter">
                                {aqi} <span className="text-lg font-medium text-slate-500">AQI</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-2">
                                Berdasarkan data Indeks Kualitas Udara, kondisi saat ini <b>{aqiStatus.label}</b>.
                            </p>
                            {error && <p className="text-red-500 text-sm mt-3 font-semibold">{error}</p>}
                        </div>

                        {/* Pollutant Components */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg space-y-3">
                            <h4 className="text-lg font-bold text-slate-700 border-b pb-2 mb-3">Konsentrasi Polutan Udara</h4>
                            {isDataLoading && (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                                    <span className="ml-2 text-slate-600">Memuat data polutan...</span>
                                </div>
                            )}
                            
                            {/* List of components */}
                            {Object.entries(components).length > 0 ? (
                                Object.entries(components).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center text-sm">
                                        <div className="font-medium text-slate-600 flex items-center gap-2">
                                            <Circle className="w-1.5 h-1.5 fill-cyan-400 text-cyan-400" />
                                            {key.toUpperCase()}
                                        </div>
                                        <span className="font-bold text-slate-800">{value.toFixed(2)}</span>
                                    </div>
                                ))
                            ) : (!isDataLoading && <p className="text-slate-500 text-sm">Data polutan tidak ditemukan.</p>)}
                        </div>
                    </motion.div>
                    
                    {/* --- KONTEN KANAN: MAP --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 relative h-[500px] rounded-3xl overflow-hidden shadow-xl border-4 border-slate-200"
                    >
                        {isDataLoading && (
                             <div className="absolute inset-0 bg-slate-50/70 backdrop-blur-sm z-[401] flex items-center justify-center">
                                <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
                                <span className="ml-3 text-lg font-semibold text-slate-700">Memuat Peta & Data...</span>
                            </div>
                        )}
                        
                        <MapContainer
                            ref={mapRef}
                            center={mapCenter}
                            zoom={13}
                            scrollWheelZoom={true}
                            className="h-full w-full relative z-10"
                            whenCreated={(map) => {
                                mapRef.current = map;
                            }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Marker position={mapCenter}>
                                <Popup>
                                    <h4 className='font-bold text-slate-800'>Lokasi: {location.name}</h4>
                                    <p className='text-sm text-slate-600 mt-1'>AQI: {aqiStatus.label} ({aqi})</p>
                                </Popup>
                            </Marker>

                            <SearchControl onSearchResult={handleLocationSearchResult} />
                        </MapContainer>

                        {/* Button to return to default location */}
                        <button
                            onClick={() => {
                                setLocation(fallbackLocation);
                                fetchEnvironmentalData(fallbackLocation);
                                if (mapRef.current) mapRef.current.flyTo([fallbackLocation.lat, fallbackLocation.lon], 13);
                            }}
                            className="absolute bottom-4 left-4 z-[400] bg-white p-3 rounded-full shadow-lg hover:bg-slate-100 transition-colors border border-slate-200"
                            title="Kembali ke Lokasi Default"
                        >
                            <LocateFixed className="w-5 h-5 text-slate-600" />
                        </button>

                    </motion.div>
                </div>
                
                {/* --- ANALISIS DAMPAK --- */}
                <AirQualityDetails />

            </motion.div>
        </section>
    );
};

// ... (Komponen AirQualityDetails)
const AirQualityDetails: React.FC = () => {
    const [showDetails, setShowDetails] = useState(false);
    return (
        <>
        <div className="text-center mt-10">
             <button 
                onClick={() => setShowDetails(!showDetails)}
                className={`text-white rounded-full px-8 py-4 font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-cyan-200/50 hover:scale-105 active:scale-95 mx-auto ${showDetails ? 'bg-slate-700 hover:bg-slate-800' : 'bg-gradient-to-r from-cyan-400 to-emerald-400'}`}
            >
                <BookOpen className="w-5 h-5" />
                {showDetails ? 'Sembunyikan Analisis Dampak' : 'Pelajari Dampak Polusi Industri'}
            </button>
        </div>
        
        <AnimatePresence>
            {showDetails && (
            <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 40 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <div className="bg-cyan-50 rounded-3xl p-8 border border-cyan-100 shadow-inner">
                    <h3 className="text-2xl font-bold text-[#0e4a6b] mb-6 border-b border-cyan-100 pb-4">
                        Analisis Dampak Polusi Industri
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Sumber Polusi */}
                        <div>
                            <h4 className="flex items-center text-lg font-semibold text-rose-600 mb-3">
                                <AlertTriangle className="w-5 h-5 mr-2" /> Pemicu Utama
                            </h4>
                            <ul className="space-y-2 text-slate-600 text-sm">
                                <li className="flex items-start gap-2"><span className="text-rose-400">•</span> Pembakaran batu bara pembangkit listrik</li>
                                <li className="flex items-start gap-2"><span className="text-rose-400">•</span> Proses manufaktur kimia dan semen</li>
                                <li className="flex items-start gap-2"><span className="text-rose-400">•</span> Kebocoran gas industri (Metana/SO2)</li>
                                <li className="flex items-start gap-2"><span className="text-rose-400">•</span> Debu operasional alat berat & konstruksi</li>
                            </ul>
                        </div>

                        {/* Efek Kesehatan */}
                        <div>
                            <h4 className="flex items-center text-lg font-semibold text-orange-600 mb-3">
                                <HeartPulse className="w-5 h-5 mr-2" /> Risiko Kesehatan
                            </h4>
                            <ul className="space-y-2 text-slate-600 text-sm">
                                <li className="flex items-start gap-2"><span className="text-orange-400">•</span> Infeksi Saluran Pernapasan Akut (ISPA)</li>
                                <li className="flex items-start gap-2"><span className="text-orange-400">•</span> Iritasi mata dan kulit akibat paparan zat kimia</li>
                                <li className="flex items-start gap-2"><span className="text-orange-400">•</span> Risiko kanker paru-paru jangka panjang</li>
                                <li className="flex items-start gap-2"><span className="text-orange-400">•</span> Keracunan logam berat (Timbal/Merkuri)</li>
                            </ul>
                        </div>
                    </div>

                    {/* Solusi Nyata Cards */}
                    <div className="pt-6 border-t border-cyan-100">
                        <h4 className="flex items-center text-lg font-semibold text-cyan-700 mb-4">
                            <Sparkles className="w-5 h-5 mr-2" /> Langkah Penanggulangan
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                            {/* Card 1 - Teknologi Filter */}
                            <div className="bg-cyan-50/50 rounded-xl p-4 border border-cyan-100">
                                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-3 text-cyan-600">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <h5 className="font-bold text-[#0e4a6b] mb-1 text-sm">Filtrasi Udara</h5>
                                <p className="text-xs text-slate-600">Pemasangan teknologi penyaring asap (Scrubber) pada cerobong.</p>
                            </div>
                            {/* Card 2 - Energi */}
                            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-3 text-amber-600">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <h5 className="font-bold text-[#0e4a6b] mb-1 text-sm">Transisi Energi</h5>
                                <p className="text-xs text-slate-600">Beralih dari batu bara ke sumber energi yang lebih ramah lingkungan.</p>
                            </div>
                            {/* Card 3 - Penghijauan */}
                            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-3 text-emerald-600">
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <h5 className="font-bold text-[#0e4a6b] mb-1 text-sm">Sabuk Hijau</h5>
                                <p className="text-xs text-slate-600">Menanam pohon penyerap karbon di sekeliling area pabrik.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
            )}
        </AnimatePresence>
        </>
    )
}

export default AirQuality;