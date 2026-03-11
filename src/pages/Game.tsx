import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, XCircle } from "lucide-react";
import { motion } from "framer-motion";

// Types
type ItemType = "trash" | "good";

interface FallingItem {
  id: number;
  type: ItemType;
  x: number;
  y: number;
  speed: number;
  symbol: string;
}

// Game Constants
const GAME_WIDTH = 100; // percentage
const GAME_HEIGHT = 100; // percentage
const PLAYER_WIDTH = 15; // percentage of screen width (approximate)
const ITEM_SIZE = 40; // pixels
const WIN_SCORE = 300;
const MAX_LIVES = 3;

const TRASH_SYMBOLS = ["🥤", "📦", "📰", "🥫", "🔋", "🐟", "🛍️"];
const GOOD_SYMBOLS = ["📱", "🧸", "👕", "📖", "🏀", "🪴", "⌚"];

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API;

const Game = () => {
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover" | "win">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [playerX, setPlayerX] = useState(50); // percentage 0-100
  const [items, setItems] = useState<FallingItem[]>([]);
  
  // Realtime Weather & Time States
  const [isDay, setIsDay] = useState(true);
  const [weatherCondition, setWeatherCondition] = useState<"clear" | "rain" | "clouds">("clear");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastItemTimeRef = useRef<number>(0);

  // Fetch Weather & Time Data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Determine Day/Night based on local time
        const hour = new Date().getHours();
        setIsDay(hour >= 6 && hour < 18);

        if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY.length > 30) {
          // Fetch weather for Jakarta as default
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=-6.2088&lon=106.8456&appid=${OPENWEATHER_API_KEY}&units=metric`);
          const data = await res.json();
          if (data && data.weather && data.weather.length > 0) {
            const main = data.weather[0].main.toLowerCase();
            if (main.includes("rain") || main.includes("drizzle") || main.includes("thunderstorm")) {
              setWeatherCondition("rain");
            } else if (main.includes("cloud")) {
              setWeatherCondition("clouds");
            } else {
              setWeatherCondition("clear");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };
    fetchWeather();
    
    // Periodically update time of day
    const interval = setInterval(() => {
        const hour = new Date().getHours();
        setIsDay(hour >= 6 && hour < 18);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      const step = 5;
      if (e.key === "ArrowLeft" || e.key === "a") {
        setPlayerX((prev) => Math.max(0, prev - step));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setPlayerX((prev) => Math.min(100 - PLAYER_WIDTH, prev + step));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);
  
  // Touch controls for mobile
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (gameState !== "playing" || !containerRef.current) return;
    
    let clientX = 0;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
    } else {
        clientX = (e as React.MouseEvent).clientX;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = clientX - containerRect.left;
    let percentage = (x / containerRect.width) * 100;
    // Center character on touch/mouse
    percentage = percentage - (PLAYER_WIDTH / 2);
    
    setPlayerX(Math.max(0, Math.min(100 - PLAYER_WIDTH, percentage)));
  };

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setLives(MAX_LIVES);
    setItems([]);
    lastItemTimeRef.current = Date.now();
  };

  const spawnItem = useCallback(() => {
    const now = Date.now();
    // Spawn every 800ms
    if (now - lastItemTimeRef.current > 800) {
      const isTrash = Math.random() > 0.3; // 70% chance of trash
      const symbolArray = isTrash ? TRASH_SYMBOLS : GOOD_SYMBOLS;
      const symbol = symbolArray[Math.floor(Math.random() * symbolArray.length)];
      
      const newItem: FallingItem = {
        id: now,
        type: isTrash ? "trash" : "good",
        x: Math.random() * (100 - 10), // Random X percentage (0-90 to avoid overflow)
        y: -10, // Start above standard view
        speed: 0.5 + Math.random() * 0.4 + (score / 150), // Speed increases with score
        symbol
      };
      
      setItems((prev) => [...prev, newItem]);
      lastItemTimeRef.current = now;
    }
  }, [score]);

  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    spawnItem();

    setItems((prevItems) => {
      const nextItems: FallingItem[] = [];
      
      for (let i = 0; i < prevItems.length; i++) {
        const item = prevItems[i];
        const newY = item.y + item.speed;
        
        // Collision detection
        // Player is at bottom (e.g. y = 85 to 100)
        // Item size approx 10% height
        if (newY >= 85 && newY <= 95) {
            // Check X collision
            // Player is from playerX to playerX + PLAYER_WIDTH
            if (item.x + 5 >= playerX && item.x <= playerX + PLAYER_WIDTH) {
                // Caught
                if (item.type === "trash") {
                    setScore(s => s + 10);
                } else {
                    setLives(l => l - 1);
                }
                continue; // Do not push to nextItems
            }
        }
        
        if (newY > 100) {
            // Missed
            if (item.type === "trash") {
                setLives(l => l - 1); // Deduct live for missing trash
            }
            continue; // Do not push to nextItems
        }
        
        nextItems.push({ ...item, y: newY });
      }
      
      return nextItems;
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, playerX, spawnItem]);

  useEffect(() => {
    if (gameState === "playing") {
        requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop, gameState]);

  // Check Win/Loss conditions
  useEffect(() => {
    if (lives <= 0 && gameState === "playing") {
        setGameState("gameover");
    } else if (score >= WIN_SCORE && gameState === "playing") {
        setGameState("win");
    }
  }, [lives, score, gameState]);

  // Background Styles Based on Weather/Time
  const bgColors = isDay 
    ? (weatherCondition === "clear" ? "from-sky-300 to-blue-500" : weatherCondition === "rain" ? "from-slate-400 to-slate-600" : "from-slate-300 to-blue-400")
    : (weatherCondition === "clear" ? "from-indigo-900 to-slate-900" : weatherCondition === "rain" ? "from-slate-800 to-slate-900" : "from-slate-800 to-indigo-950");
  
  return (
    <div 
        className={`w-full h-screen overflow-hidden relative bg-gradient-to-b ${bgColors} select-none`}
        ref={containerRef}
        onMouseMove={handleTouchMove}
        onTouchMove={handleTouchMove}
    >
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 z-50 bg-white/30 hover:bg-white/50 backdrop-blur-md p-3 rounded-full text-white transition-all shadow-lg"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>

      {/* Weather Effects (Rain) */}
      {weatherCondition === "rain" && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
              {Array.from({length: 40}).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute bg-white/70 w-[2px] h-[30px] rounded-full animate-rain"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 100}%`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`,
                        animationDelay: `${Math.random()}s`
                    }}
                  />
              ))}
          </div>
      )}
      
      {/* Sun/Moon */}
      <div className="absolute top-10 right-10 z-0 opacity-80 pointer-events-none">
          {isDay ? (
            <div className="w-24 h-24 bg-yellow-300 rounded-full shadow-[0_0_60px_rgba(253,224,71,0.8)]" />
          ) : (
            <div className="w-20 h-20 bg-slate-100 rounded-full shadow-[0_0_50px_rgba(241,245,249,0.5)]" />
          )}
      </div>

      {/* Clouds (if not clear) */}
      {weatherCondition !== "clear" && (
          <div className="absolute top-5 left-0 w-full h-32 pointer-events-none z-0 opacity-60 flex justify-around">
              <div className="w-32 h-16 bg-white/80 rounded-full blur-md mt-10" />
              <div className="w-48 h-20 bg-white/80 rounded-full blur-md mt-2" />
              <div className="w-24 h-12 bg-white/80 rounded-full blur-md mt-16" />
          </div>
      )}

      {/* Score & Lives HUD */}
      {gameState === "playing" && (
        <div className="absolute top-6 right-6 z-40 bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-xl flex gap-6 text-white font-bold text-xl">
          <div className="flex flex-col items-center">
            <span className="text-sm text-white/80 uppercase tracking-wider">Skor</span>
            <span>{score} / {WIN_SCORE}</span>
          </div>
          <div className="w-px bg-white/30 h-10 self-center"></div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-white/80 uppercase tracking-wider">Nyawa</span>
            <div className="flex gap-1 mt-1">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full ${i < lives ? "bg-red-500 shadow-[0_0_10px_red]" : "bg-white/20"}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Game Area */}
      <div className="absolute inset-0 z-10">
          {/* Falling Items */}
          {items.map(item => (
              <div 
                key={item.id}
                className="absolute text-4xl drop-shadow-lg"
                style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: `rotate(${item.y * 3}deg)`
                }}
              >
                  {item.symbol}
              </div>
          ))}

          {/* Player Character / Bin */}
          {(gameState === "playing" || gameState === "start") && (
              <div 
                className="absolute bottom-5 h-[100px] flex flex-col items-center transition-transform"
                style={{ 
                    left: `${playerX}%`, 
                    width: `${PLAYER_WIDTH}%`
                }}
              >
                  {/* Character representation */}
                  <div className="text-5xl mb-[-10px] z-10 drop-shadow-xl">🦸‍♂️</div>
                  {/* Bin */}
                  <div 
                    className="bg-green-600/90 w-full h-16 rounded-b-xl rounded-t-sm shadow-xl border-4 border-green-800 flex justify-center items-center relative overflow-hidden"
                  >
                      {/* Recyle Symbol on bin */}
                      <span className="text-white/50 text-3xl font-bold">♻️</span>
                      {/* Bin edge */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-green-700"></div>
                  </div>
              </div>
          )}
      </div>

      {/* Overlays (Start, Win, Loss) */}
      <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          
          {/* Start Screen */}
          {gameState === "start" && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl max-w-lg w-11/12 text-center pointer-events-auto border-2 border-green-200"
              >
                  <div className="text-5xl mb-4 text-center">♻️</div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-2">Eco<span className="text-green-500">Catch</span></h1>
                  <p className="text-slate-600 mb-6 text-lg">Bantu superhero kita membersihkan jalanan!</p>
                  
                  <div className="bg-slate-50 p-4 rounded-2xl mb-8 text-left border border-slate-100 space-y-3 shadow-inner">
                      <div className="flex items-start gap-3">
                          <span className="text-2xl mt-[-2px]">✅</span>
                          <div>
                              <strong className="text-slate-700 block text-sm">Tangkap Sampah (+10 poin)</strong>
                              <span className="text-2xl mt-1 block tracking-widest">{TRASH_SYMBOLS.slice(0,4).join(" ")}</span>
                          </div>
                      </div>
                      <div className="w-full h-px bg-slate-200"></div>
                      <div className="flex items-start gap-3">
                          <span className="text-2xl mt-[-2px]">❌</span>
                          <div>
                              <strong className="text-slate-700 block text-sm">Hindari Barang Bagus (-1 nyawa)</strong>
                              <span className="text-2xl mt-1 block tracking-widest">{GOOD_SYMBOLS.slice(0,4).join(" ")}</span>
                          </div>
                      </div>
                      <div className="flex items-start gap-3 mt-2">
                        <span className="text-xl mt-[-2px]">⚠️</span>
                        <div className="text-sm text-red-500 font-semibold">Gagal menangkap sampah = -1 nyawa</div>
                      </div>
                  </div>

                  <p className="text-sm text-slate-500 mb-6 font-medium italic">Gunakan panah Kiri/Kanan, tombol A/D, atau sentuh layar untuk bergerak.</p>
                  
                  <button 
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl text-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                      Mulai Main
                  </button>
              </motion.div>
          )}

          {/* Game Over Screen */}
          {gameState === "gameover" && (
              <motion.div 
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl max-w-sm w-11/12 text-center pointer-events-auto border-2 border-red-200"
              >
                  <div className="mx-auto bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                      <XCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Game Over!</h2>
                  <p className="text-slate-600 mb-6">Skor Akhir: <strong className="text-2xl text-slate-800 block mt-2">{score}</strong></p>
                  
                  <button 
                    onClick={startGame}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2"
                  >
                      <RefreshCw className="w-5 h-5" /> Main Lagi
                  </button>
              </motion.div>
          )}

          {/* Win Screen */}
          {gameState === "win" && (
              <motion.div 
                initial={{ scale: 0.9, rotate: -5, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl max-w-sm w-11/12 text-center pointer-events-auto border-2 border-green-300"
              >
                  <div className="text-6xl mb-6 text-center animate-bounce">🏆</div>
                  <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 mb-2">Kamu Menang!</h2>
                  <p className="text-slate-600 mb-6 text-lg">Bumi berterima kasih atas bantuanmu memilah sampah dengan benar.</p>
                  
                  <button 
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2"
                  >
                      <RefreshCw className="w-5 h-5" /> Main Lagi
                  </button>
              </motion.div>
          )}

      </div>
      
      {/* Required CSS for Rain animation if not present in global CSS */}
      <style>{`
          @keyframes rain {
              0% { transform: translateY(0) scaleY(1); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(100vh) scaleY(1.5); opacity: 0; }
          }
          .animate-rain {
              animation-name: rain;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
          }
      `}</style>
    </div>
  );
};

export default Game;
