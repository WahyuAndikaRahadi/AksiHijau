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
const PLAYER_WIDTH = 25; // percentage of screen width (approximate)
const ITEM_SIZE = 40; // pixels
const WIN_SCORE = 300;
const MAX_LIVES = 3;

const TRASH_SYMBOLS = ["🥤", "📦", "📰", "🥫", "🔋", "🐟", "🛍️"];
const GOOD_SYMBOLS = ["📱", "🧸", "👕", "📖", "🏀", "🪴", "⌚"];

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API;

const Game = () => {
  const [gameState, setGameState] = useState<"intro" | "start" | "playing" | "gameover" | "win">("intro");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [playerX, setPlayerX] = useState(50); // percentage 0-100
  const [items, setItems] = useState<FallingItem[]>([]);
  
  // weatherCondition can remain as it's used in the rain effect
  const [weatherCondition, setWeatherCondition] = useState<"clear" | "rain" | "clouds">("clear");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastItemTimeRef = useRef<number>(0);

  // Fetch Weather Data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY.length > 30) {
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=-6.2088&lon=106.8456&appid=${OPENWEATHER_API_KEY}&units=metric`);
          if (!res.ok) return;
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
        if (newY >= 75 && newY <= 85) {
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

  // Background Styles Based on Weather/Time removed as per user request for "kosongan" bg
  
  return (
    <div 
        className={`w-full h-screen overflow-hidden relative select-none bg-black`}
        ref={containerRef}
        onMouseMove={handleTouchMove}
        onTouchMove={handleTouchMove}
    >
      {/* Background Image Layer - NO BLUR */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("/img/bgGame.png")' }}
      />
      
      {/* Weather Effects (Rain) - Only during gameplay */}
      {weatherCondition === "rain" && gameState === "playing" && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-30">
              {Array.from({length: 40}).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute bg-white/70 w-[1.5px] h-[30px] rounded-full animate-rain"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 100}%`,
                        animationDuration: `${0.4 + Math.random() * 0.4}s`,
                        animationDelay: `${Math.random()}s`
                    }}
                  />
              ))}
          </div>
      )}
      
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 z-[60] bg-black/20 hover:bg-black/40 backdrop-blur-md p-3 rounded-full text-white transition-all shadow-lg border border-white/10"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>

      {/* Score & Lives HUD */}
      {gameState === "playing" && (
        <div className="absolute top-6 right-6 z-40 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl flex gap-6 text-white font-bold text-xl">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-black">Score</span>
            <span>{score} / {WIN_SCORE}</span>
          </div>
          <div className="w-px bg-white/20 h-10 self-center"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-black">Lives</span>
            <div className="flex gap-1.5 mt-1">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <div key={i} className={`w-3.5 h-3.5 rounded-full ${i < lives ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]" : "bg-white/10"}`} />
              ))}
            </div>
          </div>
        </div>
      )}
 
      {/* Game Area */}
      <div className="absolute inset-0 z-20">
          {/* Falling Items */}
          {items.map(item => (
              <div 
                key={item.id}
                className="absolute text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: `rotate(${item.y * 3}deg)`
                }}
              >
                  {item.symbol}
              </div>
          ))}

          {/* Player Bin during game */}
          {(gameState === "playing" || gameState === "start") && (
              <div 
                className="absolute bottom-[15%] flex flex-col items-center transition-all duration-300 pointer-events-none"
                style={{ 
                    left: `${playerX}%`, 
                    width: `${PLAYER_WIDTH}%`
                }}
              >
                  <img 
                    src="/img/greenTong.png" 
                    alt="Bin" 
                    className="w-full h-auto drop-shadow-2xl object-contain min-h-[50px] md:min-h-[80px]"
                  />
              </div>
          )}
      </div>

      {/* Overlays (Intro, Start, Win, Loss) */}
      <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          
          {/* Landing / Intro Screen (Matched to user image) */}
          {gameState === "intro" && (
              <div className="w-full h-full relative flex flex-col items-center justify-center p-6 md:p-20 pointer-events-auto">
                 {/* Title Section */}
                 <div className="flex flex-col items-center w-full mt-[-20vh] mb-12 md:mb-20">
                    <motion.h1 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-[#1e4d2b] tracking-widest uppercase drop-shadow-[0_2px_0_rgba(255,255,255,0.8)] text-center leading-tight outline-white"
                        style={{ fontFamily: "'Press Start 2P', cursive" }}
                    >
                        ECO GAMES
                    </motion.h1>
                 </div>

                 {/* PLAY Button Image Section */}
                 <motion.button 
                   onClick={() => setGameState("start")}
                   className="group relative transition-transform hover:scale-110 active:scale-95 z-20 mb-20 md:mb-32"
                   whileHover={{ scale: 1.1 }}
                 >
                    <img 
                      src="/img/buttonPlay.png" 
                      alt="PLAY" 
                      className="w-40 sm:w-48 md:w-56 lg:w-72 drop-shadow-2xl"
                    />
                 </motion.button>
                 
                 {/* 3 Bins at the bottom - Positioned absolutely near bottom */}
                 <div className="absolute bottom-24 md:bottom-32 flex gap-4 sm:gap-12 md:gap-20 items-end px-6 w-full justify-center">
                    {/* Organik Bin */}
                    <div className="w-24 sm:w-28 md:w-36 flex flex-col items-center">
                        <img src="/img/greenTong.png" alt="Green Bin" className="w-full h-auto drop-shadow-xl object-contain" />
                    </div>
                    {/* B3 Bin */}
                    <div className="w-24 sm:w-28 md:w-36 flex flex-col items-center">
                        <img src="/img/redTong.png" alt="Red Bin" className="w-full h-auto drop-shadow-xl object-contain" />
                    </div>
                    {/* Anorganik Bin */}
                    <div className="w-24 sm:w-28 md:w-36 flex flex-col items-center">
                        <img src="/img/blueTong.png" alt="Blue Bin" className="w-full h-auto drop-shadow-xl object-contain" />
                    </div>
                 </div>
              </div>
          )}

          {/* Start / Tutorial Screen */}
          {gameState === "start" && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-black/80 backdrop-blur-2xl p-6 sm:p-10 md:p-12 rounded-[2rem] shadow-2xl max-w-[90vw] md:max-w-lg w-full text-center pointer-events-auto border border-white/10"
              >
                  <div className="text-4xl md:text-5xl mb-4 text-center">📜</div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-6 uppercase tracking-tight">Cara Bermain</h2>
                  
                  <div className="bg-white/5 p-4 sm:p-6 rounded-2xl mb-8 text-left border border-white/10 space-y-4 shadow-inner">
                      <div className="flex items-start gap-4">
                          <div className="bg-green-500/20 p-2 rounded-lg text-lg">✅</div>
                          <div>
                              <strong className="text-green-400 block text-xs md:text-sm font-bold uppercase tracking-wider">Tangkap Sampah (+10)</strong>
                              <span className="text-xl md:text-2xl mt-1 block tracking-[0.2em]">{TRASH_SYMBOLS.slice(0,4).join(" ")}</span>
                          </div>
                      </div>
                      <div className="w-full h-px bg-white/10"></div>
                      <div className="flex items-start gap-4">
                          <div className="bg-red-500/20 p-2 rounded-lg text-lg">❌</div>
                          <div>
                              <strong className="text-red-400 block text-xs md:text-sm font-bold uppercase tracking-wider">Hindari Barang Bagus</strong>
                              <span className="text-xl md:text-2xl mt-1 block tracking-[0.2em]">{GOOD_SYMBOLS.slice(0,4).join(" ")}</span>
                          </div>
                      </div>
                      <div className="w-full h-px bg-white/10" />
                      <div className="flex items-start gap-4">
                        <div className="bg-yellow-500/20 p-2 rounded-lg text-lg">⚠️</div>
                        <div className="text-xs md:text-sm text-yellow-200 font-medium tracking-tight">Jangan biarkan sampah jatuh! (-1 nyawa)</div>
                      </div>
                  </div>

                  <p className="text-[10px] md:text-xs text-white/50 mb-8 font-medium italic">Gunakan panah, tombol A/D, atau geser layar.</p>
                  
                  <button 
                    onClick={startGame}
                    className="w-full bg-white text-black hover:bg-green-400 hover:text-white font-black py-4 rounded-xl text-lg md:text-xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] uppercase"
                    style={{ fontFamily: "'Press Start 2P', cursive" }}
                  >
                      START
                  </button>
                  
                  <button 
                    onClick={() => setGameState("intro")}
                    className="mt-6 text-white/30 hover:text-white/60 transition-colors text-[10px] font-bold uppercase tracking-[0.3em]"
                  >
                    KEMBALI KE MENU
                  </button>
              </motion.div>
          )}

          {/* Game Over Screen */}
          {gameState === "gameover" && (
              <motion.div 
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="bg-black/60 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-2xl max-w-sm w-11/12 text-center pointer-events-auto border border-white/10"
              >
                  <div className="mx-auto bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                      <XCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Game Over!</h2>
                  <p className="text-white/60 mb-8 text-lg font-medium">Skor Akhir: <strong className="text-4xl text-white block mt-2">{score}</strong></p>
                  
                  <button 
                    onClick={startGame}
                    className="w-full bg-white text-black hover:bg-red-500 hover:text-white font-black py-4 rounded-xl text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2"
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
                className="bg-black/60 backdrop-blur-2xl p-8 md:p-12 rounded-[2rem] shadow-2xl max-w-sm w-11/12 text-center pointer-events-auto border border-white/10"
              >
                  <div className="text-6xl mb-6 text-center animate-bounce">🏆</div>
                  <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">Kamu Menang!</h2>
                  <p className="text-white/60 mb-8 text-lg font-medium">Bumi berterima kasih atas bantuanmu memilah sampah dengan benar.</p>
                  
                  <button 
                    onClick={startGame}
                    className="w-full bg-green-500 text-white hover:bg-green-400 font-black py-4 rounded-xl text-lg shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2"
                  >
                      <RefreshCw className="w-5 h-5" /> Main Lagi
                  </button>
              </motion.div>
          )}

      </div>
      
      {/* Required CSS for Rain animation and Pixel Font */}
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

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
