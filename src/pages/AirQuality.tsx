import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  CloudRain,
  Navigation,
  Eye,
  MapPin,
  BookOpen,
  AlertTriangle,
  HeartPulse,
  Zap,
  Leaf,
  ShieldCheck,
  Sparkles,
  Loader2,
  LocateFixed,
  Circle,
  CheckCircle,
  Skull,
  Info,
  ArrowRight,
  Bus,
  Factory,
  Trash2,
  ChevronUp,
} from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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
          name: location.label || "Lokasi Baru",
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

const airQualityMap = {
  1: {
    label: "Baik",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    icon: CheckCircle,
  },
  2: {
    label: "Sedang",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    icon: Leaf,
  },
  3: {
    label: "Tidak Sehat",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    icon: AlertTriangle,
  },
  4: {
    label: "Sangat Tidak Sehat",
    color: "text-red-600",
    bg: "bg-red-600/10",
    icon: HeartPulse,
  },
  5: {
    label: "Berbahaya",
    color: "text-purple-600",
    bg: "bg-purple-600/10",
    icon: Skull,
  },
};

const getWeatherIcon = (iconCode) => {
  const code = iconCode?.toString().slice(0, 2);
  if (code === "01") return Sun;
  if (code === "02" || code === "03" || code === "04") return CloudSun;
  if (code === "09" || code === "10") return CloudRain;
  if (code === "11") return Zap;
  if (code === "13") return Droplets;
  if (code === "50") return Eye;
  return CloudSun;
};

const translateWeatherDescription = (desc) => {
  if (!desc) return "Tidak Tersedia";
  const translations = {
    "clear sky": "Cerah",
    "few clouds": "Cerah Berawan",
    "scattered clouds": "Berawan",
    "broken clouds": "Berawan Tebal",
    "shower rain": "Hujan Ringan",
    rain: "Hujan",
    thunderstorm: "Badai Petir",
    snow: "Salju",
    mist: "Kabut/Berkabut",
    "overcast clouds": "Berawan",
    "light rain": "Hujan Ringan",
    "partly cloudy": "Cerah Berawan",
  };
  const lowerDesc = desc.toLowerCase();
  for (const key in translations) {
    if (lowerDesc.includes(key)) {
      return translations[key];
    }
  }
  return desc;
};

const WeatherDashboard = ({ weatherData, locationName, isLoading }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = time.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const mainTemp = weatherData?.main?.temp
    ? Math.round(weatherData.main.temp)
    : 30;
  const feelsLike = weatherData?.main?.feels_like
    ? Math.round(weatherData.main.feels_like)
    : 30;
  const description = weatherData?.weather?.[0]?.description || "Cerah Berawan";
  const humidity = weatherData?.main?.humidity || 65;
  const windSpeed = weatherData?.wind?.speed
    ? (weatherData.wind.speed * 3.6).toFixed(1)
    : "12";
  const visibility = weatherData?.visibility
    ? (weatherData.visibility / 1000).toFixed(1)
    : "8.0";
  const iconCode = weatherData?.weather?.[0]?.icon || "04d";
  const WeatherIcon = getWeatherIcon(iconCode);

  const uvIndex = 8;
  const isHighUV = uvIndex > 7;
  const windDirection = "Tenggara";
  const weatherDescriptionID = translateWeatherDescription(description);

  const dailyForecasts = useMemo(() => {
    const today = new Date();
    const getForecastVariation = (currentTemp, index) => {
      const offset = index % 4;
      let tempChange = 0;
      let condition = {
        label: "Berawan",
        icon: CloudSun,
        color: "bg-slate-100 text-slate-600",
      };

      if (offset === 1) {
        tempChange = -1;
        condition = {
          label: "Hujan Ringan",
          icon: CloudRain,
          color: "bg-blue-100 text-blue-600",
        };
      } else if (offset === 2) {
        tempChange = 1;
        condition = {
          label: "Cerah Berawan",
          icon: CloudSun,
          color: "bg-yellow-100 text-yellow-600",
        };
      } else if (offset === 3) {
        tempChange = 2;
        condition = {
          label: "Cerah Penuh",
          icon: Sun,
          color: "bg-orange-100 text-orange-600",
        };
      }

      const newTemp = Math.max(28, Math.min(34, currentTemp + tempChange));
      return { temp: `${newTemp}°`, ...condition };
    };

    const forecasts = [];
    for (let i = 1; i <= 4; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const dayName = nextDay.toLocaleDateString("id-ID", { weekday: "long" });

      forecasts.push({
        day: i === 1 ? "Besok" : dayName,
        ...getForecastVariation(mainTemp, i),
      });
    }
    return forecasts;
  }, [mainTemp]);

  const blobVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <section className="py-10 px-4 w-full max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start mb-10 ml-2">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            Kondisi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
              Cuaca Real-time
            </span>
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Pantauan cuaca dan atmosfer kawasan industri.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 mt-4 md:mt-0">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          ) : (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          )}
          <span className="text-sm font-semibold text-slate-600">
            {isLoading ? "Mencari Lokasi..." : "Data Langsung"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-0">
        {/* Card Utama Cuaca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] text-white shadow-2xl shadow-blue-200/50 min-h-[450px] md:min-h-[400px] flex flex-col justify-between p-6 md:p-10 group"
        >
          {/* Background & Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 z-0"></div>
          <motion.div
            variants={blobVariants}
            animate="animate"
            className="absolute top-[-20%] right-[-20%] w-64 h-64 md:w-96 md:h-96 bg-cyan-300 rounded-full blur-[80px] md:blur-[100px] mix-blend-overlay"
          ></motion.div>
          <motion.div
            variants={blobVariants}
            animate="animate"
            transition={{ delay: 2 }}
            className="absolute bottom-[-20%] left-[-20%] w-64 h-64 md:w-80 md:h-80 bg-blue-400 rounded-full blur-[60px] md:blur-[80px] mix-blend-overlay"
          ></motion.div>
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] z-0"></div>

          {/* Header Section: Lokasi & Jam */}
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full flex items-center gap-2 transition-transform group-hover:scale-105">
              <MapPin className="w-4 h-4 text-white" />
              <span className="font-medium tracking-wide text-xs md:text-sm truncate max-w-[150px] md:max-w-[200px]">
                {locationName}
              </span>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-4xl md:text-5xl font-bold tracking-tighter">
                {formattedTime}
              </div>
              <div className="text-blue-100 font-medium text-xs md:text-sm mt-1">
                {formattedDate}
              </div>
            </div>
          </div>

          {/* Main Temp Section */}
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mt-6 md:mt-8">
            <div>
              <div className="flex items-start">
                {/* Font suhu yang dinamis: kecil di mobile, besar di desktop */}
                <span className="text-7xl sm:text-8xl md:text-[10rem] lg:text-[9rem] xl:text-[10rem] leading-none font-black tracking-tighter drop-shadow-lg">
                  {mainTemp}
                </span>
                <span className="text-4xl md:text-6xl font-light text-blue-200 mt-2 md:mt-4">
                  °
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-medium text-white/90 ml-1 md:ml-2">
                {weatherDescriptionID}
              </div>
              <div className="text-sm md:text-lg font-light text-blue-200 ml-1 md:ml-2 mt-1">
                Terasa seperti {feelsLike}°
              </div>
            </div>

            {/* Ikon Cuaca: mengecil di mobile */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="mt-6 md:mt-0 self-end md:self-center"
            >
              <WeatherIcon
                className="w-32 h-32 md:w-48 md:h-48 text-yellow-300 drop-shadow-2xl"
                strokeWidth={1.5}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Grid Statistik (Kanan) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {/* Kelembaban */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-lg shadow-slate-100 border border-slate-100 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="p-2 md:p-3 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl">
                <Droplets className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                Kelembaban
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl md:text-4xl font-bold text-slate-800">
                {humidity}
              </span>
              <span className="text-lg md:text-xl text-slate-400 font-medium">
                %
              </span>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${humidity}%` }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Angin */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900 text-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-lg flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500 blur-3xl opacity-20"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="p-2 md:p-3 bg-white/10 rounded-xl md:rounded-2xl">
                <Wind className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                Angin
              </span>
            </div>
            <div className="mt-4 relative z-10">
              <span className="text-3xl md:text-4xl font-bold">
                {windSpeed}
              </span>
              <span className="text-xs md:text-sm text-slate-400 ml-1">
                km/j
              </span>
              <div className="flex items-center gap-2 mt-3 text-[10px] md:text-xs text-slate-400">
                <Navigation className="w-3 h-3 rotate-45" /> Arah{" "}
                {windDirection}
              </div>
            </div>
          </motion.div>

          {/* Indeks UV */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-lg shadow-slate-100 border border-slate-100 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="p-2 md:p-3 bg-orange-50 text-orange-500 rounded-xl md:rounded-2xl">
                <Sun className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                Indeks UV
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl md:text-4xl font-bold text-slate-800">
                  {uvIndex}
                </span>
                <span
                  className={`px-2 py-0.5 ${
                    isHighUV
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  } text-[9px] md:text-[10px] font-bold rounded-full uppercase`}
                >
                  {isHighUV ? "Tinggi" : "Sedang"}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${uvIndex * 10}%` }}
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Jarak Pandang */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-lg shadow-slate-100 border border-slate-100 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="p-2 md:p-3 bg-emerald-50 text-emerald-600 rounded-xl md:rounded-2xl">
                <Eye className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                Jarak Pandang
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl md:text-4xl font-bold text-slate-800">
                {visibility}
              </span>
              <span className="text-xs md:text-sm text-slate-400 ml-1">km</span>
              <p className="mt-2 text-[10px] text-slate-500 leading-tight">
                Jarak pandang baik untuk operasional.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

<div className="mt-8 bg-slate-50 p-5 md:p-6 rounded-[2.5rem] border border-slate-100">
  <h3 className="text-lg font-bold text-slate-700 mb-5 flex items-center">
    <CloudSun className="w-5 h-5 mr-2 text-cyan-500" /> 
    Prakiraan 4 Hari Mendatang
  </h3>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {dailyForecasts.map((item) => (
      <div
        key={item.day}
        className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-lg hover:scale-[1.02]"
      >
        {/* Ikon di bagian atas */}
        <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-3 shadow-sm`}>
          <item.icon className="w-6 h-6" />
        </div>

        {/* Keterangan Hari */}
        <div className="flex flex-col gap-0.5 mb-2">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            {item.day}
          </span>
          <span className="text-sm font-semibold text-slate-600">
            {item.label}
          </span>
        </div>

        {/* Derajat Suhu - Dibuat lebih mencolok di bawah */}
        <div className="mt-auto pt-2 border-t border-slate-50 w-full">
          <span className="text-2xl font-black text-slate-800">
            {item.temp}<span className="text-blue-500 font-light"></span>
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
    </section>
  );
};

const ImpactDetails = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="bg-white border-2 border-cyan-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl mb-12 relative overflow-hidden mx-1">
        <h3 className="text-2xl font-bold text-[#0e4a6b] mb-8">
          Dampak Mendalam Polusi Udara
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h4 className="font-bold text-slate-800">Sumber Polusi</h4>
            </div>
            <ul className="space-y-4 text-slate-600 text-sm md:text-base">
              {[
                {
                  text: "Emisi kendaraan bermotor (40% kontribusi)",
                  icon: Bus,
                },
                { text: "Pembangkit listrik berbahan bakar fosil", icon: Zap },
                { text: "Industri manufaktur dan konstruksi", icon: Factory },
                { text: "Pembakaran sampah dan pertanian", icon: Trash2 },
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full border border-cyan-400 mt-2 shrink-0 bg-transparent" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <HeartPulse className="w-5 h-5 text-orange-500" />
              <h4 className="font-bold text-slate-800">Efek Kesehatan</h4>
            </div>
            <ul className="space-y-4 text-slate-600 text-sm md:text-base">
              {[
                "Penyakit pernapasan kronis (PPOK, asma)",
                "Peningkatan risiko stroke dan penyakit jantung",
                "Gangguan perkembangan kognitif pada anak",
                "Komplikasi kehamilan dan kelahiran prematur",
              ].map((text, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full border border-cyan-400 mt-2 shrink-0 bg-transparent" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-cyan-500" />
            <h4 className="font-bold text-slate-800">Solusi Nyata</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-cyan-50/50 p-6 rounded-2xl border border-cyan-100 hover:bg-cyan-50 transition-colors">
              <div className="mb-4 bg-white w-fit p-2 rounded-lg shadow-sm">
                <Bus className="w-6 h-6 text-blue-600" />
              </div>
              <h5 className="font-bold text-blue-700 mb-2">Transportasi</h5>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gunakan transportasi umum, kendaraan listrik, atau bersepeda
              </p>
            </div>

            <div className="bg-cyan-50/50 p-6 rounded-2xl border border-cyan-100 hover:bg-cyan-50 transition-colors">
              <div className="mb-4 bg-white w-fit p-2 rounded-lg shadow-sm">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h5 className="font-bold text-[#0e4a6b] mb-2">Energi</h5>
              <p className="text-sm text-slate-600 leading-relaxed">
                Beralih ke energi terbarukan dan efisiensi energi
              </p>
            </div>

            <div className="bg-cyan-50/50 p-6 rounded-2xl border border-cyan-100 hover:bg-cyan-50 transition-colors">
              <div className="mb-4 bg-white w-fit p-2 rounded-lg shadow-sm">
                <Leaf className="w-6 h-6 text-emerald-600" />
              </div>
              <h5 className="font-bold text-[#0e4a6b] mb-2">Penghijauan</h5>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tanam pohon dan pertahankan ruang terbuka hijau
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AirQualityBanner = () => {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-7xl mx-auto mt-12 mb-8"
    >
      <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl border border-slate-100 flex flex-col lg:flex-row gap-10 items-center overflow-hidden mb-8">
        <div className="w-full lg:w-1/2 relative group">
          <div className="absolute inset-0  opacity-10 group-hover:rotate-6 transition-transform"></div>
          <img
            src="./img/Polusi-Udara-Industri.jpg"
            alt="Udara Bersih"
            className="relative z-10 rounded-3xl shadow-lg w-full h-[320px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />

          <div className="absolute z-20 -bottom-6 -right-4 lg:-right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow border border-slate-100">
            <div className="bg-orange-50 p-3 rounded-xl">
              <Wind className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                Kualitas Udara
              </div>
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1">
                Pantau Live{" "}
                <span className="flex h-2 w-2 relative ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 text-xs font-bold uppercase tracking-wider mb-6 border border-cyan-100">
            <CloudSun className="w-4 h-4" /> Kualitas Udara
          </div>

          <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-800 mb-6 leading-[1.15]">
            Udara Bersih untuk <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Masa Depan Sehat
            </span>
          </h2>

          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            Udara adalah sumber kehidupan, namun polusi industri dan emisi
            kendaraan mengancam kesehatan paru-paru kita. Setiap hirupan udara
            bersih yang kita jaga hari ini adalah investasi kesehatan bagi
            generasi mendatang.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">
              <div className="text-3xl font-black text-slate-800 mb-1">99%</div>
              <div className="text-xs font-medium text-slate-500 leading-tight">
                Populasi dunia menghirup udara polusi (WHO)
              </div>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-colors">
              <div className="text-3xl font-black text-blue-600 mb-1">
                7 Juta
              </div>
              <div className="text-xs font-medium text-slate-500 leading-tight">
                Kematian dini per tahun akibat polusi
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowDetail(!showDetail)}
            className="bg-[#0e4a6b] text-white px-8 py-4 rounded-full font-bold text-sm lg:text-base flex items-center gap-2 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-900/20 group"
          >
            <BookOpen className="w-5 h-5" />
            {showDetail ? "Tutup Penjelasan" : "Pelajari Dampaknya"}
            <ArrowRight
              className={`w-4 h-4 transition-transform duration-300 ${
                showDetail ? "rotate-90" : "group-hover:translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showDetail && <ImpactDetails onClose={() => setShowDetail(false)} />}
      </AnimatePresence>
    </motion.div>
  );
};

const AirQuality = () => {
  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API;

  const fallbackLocation = {
    lat: -6.2088,
    lon: 106.8456,
    name: "Jakarta Industrial Estate",
  };
  const mapRef = useRef(null);

  const [location, setLocation] = useState(fallbackLocation);
  const [pollutionData, setPollutionData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLocationSearchResult = (newLocation) => {
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

    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY.length < 30) {
      setError("ERROR: Kunci API OpenWeatherMap tidak valid.");
      setIsDataLoading(false);
      return;
    }

    try {
      const pollutionPromise = fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${loc.lat}&lon=${loc.lon}&appid=${OPENWEATHER_API_KEY}`
      ).then((res) => {
        if (res.status === 401)
          throw new Error("Unauthorized (Kunci API Salah/Tidak Aktif)");
        if (!res.ok) throw new Error(`Status: ${res.statusText}`);
        return res.json();
      });

      const weatherPromise = fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=id`
      ).then((res) => {
        if (res.status === 401)
          throw new Error("Unauthorized (Kunci API Salah/Tidak Aktif)");
        if (!res.ok) throw new Error(`Status: ${res.statusText}`);
        return res.json();
      });

      const [pollutionDataResult, weatherDataResult] = await Promise.all([
        pollutionPromise,
        weatherPromise,
      ]);

      const finalLocationName = weatherDataResult?.name || loc.name;

      setPollutionData(
        pollutionDataResult.list && pollutionDataResult.list[0]
          ? pollutionDataResult.list[0]
          : null
      );
      setWeatherData(weatherDataResult);

      setLocation({
        ...loc,
        name: finalLocationName,
      });
    } catch (err) {
      console.error("Error fetching environmental data:", err);
      setError(`Gagal memuat data lingkungan: ${err.message}.`);
    } finally {
      setIsDataLoading(false);
    }
  };

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
            name: "Lokasi Anda (GPS)",
          };

          console.log(
            `DIAGNOSIS: GPS Berhasil Ditemukan! Lat: ${gpsLocation.lat}, Lon: ${gpsLocation.lon}`
          );

          setLocation(gpsLocation);
          fetchEnvironmentalData(gpsLocation);
        },
        (err) => {
          let errMsg = "Akses lokasi ditolak. Menggunakan lokasi default.";

          if (err.code === 1) {
            errMsg =
              "ERROR GPS (Code 1): Akses lokasi DITOLAK. Pastikan Anda mengizinkan lokasi di browser/sistem. Menggunakan lokasi default.";
          } else if (err.code === 3) {
            errMsg =
              "ERROR GPS (Code 3): Gagal mendapatkan lokasi (Timeout 15 detik). Cek koneksi Anda. Menggunakan lokasi default.";
          } else {
            errMsg = `ERROR GPS (Code ${err.code}): Terjadi kesalahan tidak terduga. Menggunakan lokasi default.`;
          }

          console.error("DIAGNOSIS:", errMsg, err);
          setError(errMsg);

          fetchEnvironmentalData(fallbackLocation);
          setLocation(fallbackLocation);
        },
        {
          timeout: 15000,
          maximumAge: 60000,
        }
      );
    } else {
      const errMsg =
        "Browser tidak mendukung Geolocation. Menggunakan lokasi default.";
      console.error("DIAGNOSIS:", errMsg);
      setError(errMsg);
      fetchEnvironmentalData(fallbackLocation);
      setLocation(fallbackLocation);
    }
  }, []);

  const aqi = pollutionData?.main?.aqi || 0;

  const aqiStatus =
    aqi > 0
      ? airQualityMap[aqi]
      : {
          label: "Tidak Tersedia",
          color: "text-slate-500",
          bg: "bg-slate-100",
          icon: Circle,
        };

  const components = pollutionData?.components || {};
  const mapCenter = [location.lat, location.lon];

  return (
    <section className="py-12 px-4 w-full">
      <AirQualityBanner />
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
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
              Pantauan <span className="text-cyan-500">Kualitas Udara</span>{" "}
              Real-time
            </h2>
            <p className="text-slate-500 mt-1 text-lg">
              Indeks Pencemaran Udara (AQI) untuk kawasan industri.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div
              className={`p-6 rounded-3xl ${aqiStatus.bg} border border-slate-100 shadow-lg`}
            >
              <div className="flex items-center gap-3 mb-4">
                <aqiStatus.icon className={`w-8 h-8 ${aqiStatus.color}`} />
                <h3 className={`text-2xl font-extrabold ${aqiStatus.color}`}>
                  Status: {aqiStatus.label}
                </h3>
              </div>
              <div className="text-6xl font-black text-slate-800 tracking-tighter">
                {aqi}{" "}
                <span className="text-lg font-medium text-slate-500">AQI</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Berdasarkan data Indeks Kualitas Udara, kondisi saat ini{" "}
                <b>{aqiStatus.label}</b>.
              </p>
              {error && (
                <p className="text-red-500 text-sm mt-3 font-semibold">
                  {error}
                </p>
              )}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg space-y-3">
              <h4 className="text-lg font-bold text-slate-700 border-b pb-2 mb-3">
                Konsentrasi Polutan Udara
              </h4>
              {isDataLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                  <span className="ml-2 text-slate-600">
                    Memuat data polutan...
                  </span>
                </div>
              )}

              {Object.entries(components).length > 0
                ? Object.entries(components).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="font-medium text-slate-600 flex items-center gap-2">
                        <Circle className="w-1.5 h-1.5 fill-cyan-400 text-cyan-400" />
                        {key.toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-800">
                        {value.toFixed(2)}
                      </span>
                    </div>
                  ))
                : !isDataLoading && (
                    <p className="text-slate-500 text-sm">
                      Data polutan tidak ditemukan.
                    </p>
                  )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 relative h-[500px] rounded-3xl overflow-hidden shadow-xl border-4 border-slate-200"
          >
            {isDataLoading && (
              <div className="absolute inset-0 bg-slate-50/70 backdrop-blur-sm z-[401] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
                <span className="ml-3 text-lg font-semibold text-slate-700">
                  Memuat Peta & Data...
                </span>
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
                  <h4 className="font-bold text-slate-800">
                    Lokasi: {location.name}
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    AQI: {aqiStatus.label} ({aqi})
                  </p>
                </Popup>
              </Marker>

              <SearchControl onSearchResult={handleLocationSearchResult} />
            </MapContainer>

            <button
              onClick={() => {
                setLocation(fallbackLocation);
                fetchEnvironmentalData(fallbackLocation);
                if (mapRef.current)
                  mapRef.current.flyTo(
                    [fallbackLocation.lat, fallbackLocation.lon],
                    13
                  );
              }}
              className="absolute bottom-4 left-4 z-[10] bg-white p-3 rounded-full shadow-lg hover:bg-slate-100 transition-colors border border-slate-200"
              title="Kembali ke Lokasi Default"
            >
              <LocateFixed className="w-5 h-5 text-slate-600" />
            </button>
          </motion.div>
        </div>

        <AirQualityDetails components={components} />
      </motion.div>
    </section>
  );
};

const AirQualityDetails = ({ components }) => {
  const pollutantInfo = {
    co: {
      name: "Karbon Monoksida",
      desc: "Gas beracun dari pembakaran bahan bakar kendaraan dan industri.",
      color: "text-slate-700",
      bg: "bg-slate-100",
    },
    no: {
      name: "Nitrogen Monoksida",
      desc: "Dihasilkan dari emisi kendaraan bermotor dan proses pembakaran suhu tinggi.",
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    no2: {
      name: "Nitrogen Dioksida",
      desc: "Penyebab utama kabut asap dan hujan asam. Berbahaya bagi paru-paru.",
      color: "text-rose-700",
      bg: "bg-rose-50",
    },
    o3: {
      name: "Ozon (Permukaan)",
      desc: "Terbentuk dari reaksi kimia di udara. Dapat memicu asma dan gangguan pernapasan.",
      color: "text-violet-700",
      bg: "bg-violet-50",
    },
    so2: {
      name: "Sulfur Dioksida",
      desc: "Berasal dari pembakaran batubara dan minyak bumi di industri.",
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    pm2_5: {
      name: "Partikel Halus (PM2.5)",
      desc: "Partikel sangat kecil (<2.5µm) yang dapat menembus paru-paru hingga aliran darah.",
      color: "text-red-700",
      bg: "bg-red-50",
    },
    pm10: {
      name: "Partikel Kasar (PM10)",
      desc: "Debu, serbuk sari, dan partikel kasar yang mengiritasi mata dan hidung.",
      color: "text-orange-700",
      bg: "bg-orange-50",
    },
    nh3: {
      name: "Amonia",
      desc: "Gas berbau tajam dari limbah pertanian dan industri pupuk.",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="overflow-hidden mt-2"
    >
      <div className="bg-cyan-50 rounded-3xl p-8 border border-cyan-100 shadow-inner">
        <h3 className="text-2xl font-bold text-[#0e4a6b] mb-6 border-b border-cyan-100 pb-4 flex items-center gap-2">
          <Info className="w-6 h-6" /> Penjelasan Konsentrasi Polutan Udara
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(pollutantInfo).map(([key, info]) => {
            const value = components && components[key] ? components[key] : 0;

            return (
              <div
                key={key}
                className={`${info.bg} p-5 rounded-2xl border border-slate-100 transition-transform hover:scale-105`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-bold text-lg uppercase ${info.color}`}>
                    {key.replace("_", ".")}
                  </h4>
                  <span className="bg-white/60 px-2 py-1 rounded-lg text-xs font-bold text-slate-600 shadow-sm">
                    {value} µg/m³
                  </span>
                </div>
                <h5 className="text-sm font-bold text-slate-800 mb-1">
                  {info.name}
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {info.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default AirQuality;
