import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
type BinCategory = "organik" | "anorganik" | "b3";
type GameState = "intro" | "start" | "playing" | "intermission" | "gameover";
type WeatherMode = "hot" | "rain";

interface LeaderboardEntry {
  username: string;
  score: number;
  phase: number;
  played_at: string;
}

interface TrashItem {
  id: number;
  category: BinCategory;
  x: number;
  y: number;
  speed: number;
  img: string;
  name: string;
  width: number;
  height: number;
}

interface RainDrop {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

// ─── Asset Definitions ──────────────────────────────────────────
const ORGANIK_ITEMS = [
  { img: "/img/InGame/organik/Frame 4.png",  name: "Daun 1",  w: 40, h: 50 },
  { img: "/img/InGame/organik/Frame 5.png",  name: "Daun 2",  w: 38, h: 48 },
  { img: "/img/InGame/organik/Frame 6.png",  name: "Daun 3",  w: 35, h: 50 },
  { img: "/img/InGame/organik/tulang.png",   name: "Tulang",  w: 45, h: 50 },
];

const ANORGANIK_ITEMS = [
  { img: "/img/InGame/anorganik/Frame 3.png",         name: "Kantong Sampah", w: 40, h: 52 },
  { img: "/img/InGame/anorganik/Frame 12.png",        name: "Botol",          w: 28, h: 50 },
  { img: "/img/InGame/anorganik/Frame 14.png",        name: "Kardus",         w: 55, h: 35 },
  { img: "/img/InGame/anorganik/Frame 15.png",        name: "Gelas",          w: 35, h: 42 },
  { img: "/img/InGame/anorganik/Frame 23.png",        name: "Botol Kimia",    w: 32, h: 48 },
  { img: "/img/InGame/anorganik/kaleng minuman.png",  name: "Kaleng",         w: 50, h: 35 },
  { img: "/img/InGame/anorganik/kaleng sampah.png",   name: "Kaleng Sampah",  w: 44, h: 48 },
];

const B3_ITEMS = [
  { img: "/img/InGame/b3/Frame 13.png", name: "Baterai",      w: 28, h: 40 },
  { img: "/img/InGame/b3/Frame 16.png", name: "Zat Kimia",    w: 38, h: 45 },
  { img: "/img/InGame/b3/Frame 17.png", name: "Lampu & Kimia", w: 42, h: 48 },
];

const CATEGORY_ITEMS: Record<BinCategory, typeof ORGANIK_ITEMS> = {
  organik: ORGANIK_ITEMS,
  anorganik: ANORGANIK_ITEMS,
  b3: B3_ITEMS,
};

const BIN_IMAGES: Record<BinCategory, string> = {
  organik: "/img/greenTong.png",
  anorganik: "/img/blueTong.png",
  b3: "/img/redTong.png",
};

const BIN_LABELS: Record<BinCategory, string> = {
  organik: "ORGANIK",
  anorganik: "ANORGANIK",
  b3: "B3",
};

const BIN_COLORS: Record<BinCategory, string> = {
  organik: "#22c55e",
  anorganik: "#3b82f6",
  b3: "#ef4444",
};

const CATEGORIES: BinCategory[] = ["organik", "anorganik", "b3"];

// ─── Game Constants ─────────────────────────────────────────────
const PLAYER_WIDTH_PCT = 18;
const MAX_PENALTIES = 5;
const PHASE_INTERVAL = 200;
const BASE_SPAWN_INTERVAL = 1200;
const BASE_SPEED = 1.8;
const SPEED_INCREASE_PER_PHASE = 0.05;
const SPAWN_DECREASE_PER_PHASE = 0.08;

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API;
const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:5000';

// ─── Pixel Font CSS ─────────────────────────────────────────────
const PIXEL_FONT = "'Press Start 2P', monospace";

// ─── Game Component ─────────────────────────────────────────────
const Game: React.FC = () => {
  // State
  const [gameState, setGameState] = useState<GameState>("intro");
  const [score, setScore] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [currentBin, setCurrentBin] = useState<BinCategory>("organik");
  const [phase, setPhase] = useState(1);
  const [playerX, setPlayerX] = useState(41);
  const [items, setItems] = useState<TrashItem[]>([]);
  const [weatherMode, setWeatherMode] = useState<WeatherMode>("hot");
  const [weatherLabel, setWeatherLabel] = useState("Cerah");
  const [showCatchFeedback, setShowCatchFeedback] = useState<{x: number; y: number; text: string; color: string} | null>(null);
  const [floodLevel, setFloodLevel] = useState(0);
  const [trashPileLevel, setTrashPileLevel] = useState(0);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);
  const [isPortrait, setIsPortrait] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [personalBest, setPersonalBest] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastSpawnTimeRef = useRef<number>(0);
  const scoreRef = useRef(0);
  const phaseRef = useRef(1);
  const penaltiesRef = useRef(0);
  const itemIdRef = useRef(0);
  const currentBinRef = useRef<BinCategory>("organik");
  const playerXRef = useRef(41);

  // Sync refs
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { penaltiesRef.current = penalties; }, [penalties]);
  useEffect(() => { currentBinRef.current = currentBin; }, [currentBin]);

  // ─── Portrait/Landscape Detection ─────────────────────────────
  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 1024;
      setIsPortrait(isMobile && window.innerHeight > window.innerWidth);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // ─── Fetch Leaderboard & Personal Best ──────────────────────────
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/game/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    }
  }, []);

  const fetchPersonalBest = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/game/my-score`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPersonalBest(data.score || 0);
      }
    } catch (err) {
      console.error('Personal best fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    fetchPersonalBest();
  }, [fetchLeaderboard, fetchPersonalBest]);

  // ─── Save Highscore ────────────────────────────────────────────
  const saveHighscore = useCallback(async (finalScore: number, finalPhase: number) => {
    const token = localStorage.getItem('token');
    if (!token || finalScore <= personalBest) return;
    try {
      const res = await fetch(`${API_BASE}/game/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score: finalScore, phase: finalPhase }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.updated) {
          setPersonalBest(finalScore);
          setScoreSaved(true);
          fetchLeaderboard();
        }
      }
    } catch (err) {
      console.error('Score save error:', err);
    }
  }, [personalBest, fetchLeaderboard]);

  // ─── Generate rain drops ───────────────────────────────────────
  useEffect(() => {
    if (weatherMode === "rain") {
      const drops: RainDrop[] = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.3 + Math.random() * 0.4,
        size: 2 + Math.floor(Math.random() * 3),
      }));
      setRainDrops(drops);
    } else {
      setRainDrops([]);
    }
  }, [weatherMode]);

  // ─── Fetch Weather ─────────────────────────────────────────────
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY.length < 30) return;
        
        // Try geolocation first
        let lat = -6.2088, lon = 106.8456;
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          );
          lat = pos.coords.latitude;
          lon = pos.coords.longitude;
        } catch { /* fallback to Jakarta coords */ }
        
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data?.weather?.[0]) {
          const main = data.weather[0].main.toLowerCase();
          if (main.includes("rain") || main.includes("drizzle") || main.includes("thunderstorm") || main.includes("cloud")) {
            setWeatherMode("rain");
            if (main.includes("rain") || main.includes("drizzle")) setWeatherLabel("Hujan");
            else if (main.includes("thunderstorm")) setWeatherLabel("Badai");
            else setWeatherLabel("Mendung");
          } else {
            setWeatherMode("hot");
            setWeatherLabel("Cerah");
          }
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };
    fetchWeather();
  }, []);

  // ─── Keyboard Controls (continuous hold support) ──────────────
  const keysPressed = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      keysPressed.current.add(e.key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // ─── Touch/Mouse Controls (instant, no transition) ────────────
  const handlePointerMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (gameState !== "playing" || !containerRef.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const rect = containerRef.current.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100 - PLAYER_WIDTH_PCT / 2;
    playerXRef.current = Math.max(0, Math.min(100 - PLAYER_WIDTH_PCT, pct));
    setPlayerX(playerXRef.current);
  }, [gameState]);

  // ─── Show catch feedback ──────────────────────────────────────
  const showFeedback = useCallback((x: number, y: number, text: string, color: string) => {
    setShowCatchFeedback({ x, y, text, color });
    setTimeout(() => setShowCatchFeedback(null), 800);
  }, []);

  // ─── Trigger screen shake ─────────────────────────────────────
  const triggerShake = useCallback(() => {
    setShakeScreen(true);
    setTimeout(() => setShakeScreen(false), 300);
  }, []);

  // ─── Apply penalty ────────────────────────────────────────────
  const applyPenalty = useCallback((itemX: number, itemY: number) => {
    const newPenalties = penaltiesRef.current + 1;
    setPenalties(newPenalties);
    triggerShake();
    showFeedback(itemX, itemY, "-1", "#ef4444");
    
    if (weatherMode === "hot") {
      setTrashPileLevel(prev => Math.min(prev + 1, MAX_PENALTIES));
    } else {
      setFloodLevel(prev => Math.min(prev + 1, MAX_PENALTIES));
    }
    
    if (newPenalties >= MAX_PENALTIES) {
      setGameState("gameover");
      // Save highscore when game ends
      const finalScore = scoreRef.current;
      const finalPhase = phaseRef.current;
      setTimeout(() => saveHighscore(finalScore, finalPhase), 100);
    }
  }, [weatherMode, triggerShake, showFeedback]);

  // ─── Spawn items ──────────────────────────────────────────────
  const spawnItem = useCallback(() => {
    const now = Date.now();
    const currentPhase = phaseRef.current;
    let spawnInterval = BASE_SPAWN_INTERVAL * Math.pow(1 - SPAWN_DECREASE_PER_PHASE, currentPhase - 1);
    
    // Slower spawn on short mobile screens to prevent lag/clustering
    if (window.innerHeight < 500) {
      spawnInterval *= 1.8;
    }
    
    if (now - lastSpawnTimeRef.current < spawnInterval) return;
    lastSpawnTimeRef.current = now;

    // 70% chance to spawn matching category, 30% from other categories
    const spawnMatching = Math.random() < 0.7;
    let chosenCategory: BinCategory;
    let chosenItem;

    if (spawnMatching) {
      chosenCategory = currentBinRef.current;
    } else {
      const otherCats = CATEGORIES.filter(c => c !== currentBinRef.current);
      chosenCategory = otherCats[Math.floor(Math.random() * otherCats.length)];
    }
    
    const categoryItems = CATEGORY_ITEMS[chosenCategory];
    chosenItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];

    const speedMultiplier = window.innerHeight < 500 ? 0.6 : 1.0;
    const speed = BASE_SPEED * Math.pow(1 + SPEED_INCREASE_PER_PHASE, currentPhase - 1) * speedMultiplier;
    const variation = 0.7 + Math.random() * 0.6;
    
    const newItem: TrashItem = {
      id: itemIdRef.current++,
      category: chosenCategory,
      x: 5 + Math.random() * 75,
      y: -8,
      speed: speed * variation,
      img: chosenItem.img,
      name: chosenItem.name,
      width: chosenItem.w,
      height: chosenItem.h,
    };
    
    setItems(prev => [...prev, newItem]);
  }, []);

  // ─── Game Loop ────────────────────────────────────────────────
  const gameLoop = useCallback(() => {
    if (gameState !== "playing") return;

    // Process keyboard movement (continuous, no delay)
    const keys = keysPressed.current;
    const moveStep = 2.5;
    if (keys.has("ArrowLeft") || keys.has("a")) {
      playerXRef.current = Math.max(0, playerXRef.current - moveStep);
      setPlayerX(playerXRef.current);
    }
    if (keys.has("ArrowRight") || keys.has("d")) {
      playerXRef.current = Math.min(100 - PLAYER_WIDTH_PCT, playerXRef.current + moveStep);
      setPlayerX(playerXRef.current);
    }

    spawnItem();

    const currentPlayerX = playerXRef.current;

    setItems(prevItems => {
      const nextItems: TrashItem[] = [];
      
      for (const item of prevItems) {
        const newY = item.y + item.speed * 0.16;
        
        
        // Collision zone: player sits at bottom. Widen hitbox and raise Y threshold for easier catch
        if (newY >= 65 && newY <= 85) {
          const itemCenterX = item.x + (item.width / 10);
          // Add a generous tolerance of 5% on each side of the bin
          if (itemCenterX >= currentPlayerX - 5 && itemCenterX <= currentPlayerX + PLAYER_WIDTH_PCT + 5) {
            // Caught!
            if (item.category === currentBinRef.current) {
              // CORRECT catch
              const points = 10 + Math.floor(Math.random() * 11);
              const newScore = scoreRef.current + points;
              setScore(newScore);
              showFeedback(item.x, 70, `+${points}`, "#22c55e");
              
              // Check phase transition
              const currentPhaseThreshold = phaseRef.current * PHASE_INTERVAL;
              if (newScore >= currentPhaseThreshold) {
                setPhase(p => p + 1);
                setGameState("intermission");
                setItems([]);
                return [];
              }
            } else {
              // WRONG catch
              applyPenalty(item.x, 70);
            }
            continue;
          }
        }
        
        // Past bottom of screen
        if (newY > 95) {
          // Only penalize if item matched current bin type (should have been caught)
          if (item.category === currentBinRef.current) {
            applyPenalty(item.x, 90);
          }
          continue;
        }
        
        nextItems.push({ ...item, y: newY });
      }
      
      return nextItems;
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, spawnItem, applyPenalty, showFeedback]);

  // Start/stop game loop
  useEffect(() => {
    if (gameState === "playing") {
      lastSpawnTimeRef.current = Date.now();
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop, gameState]);

  // ─── Start Game ───────────────────────────────────────────────
  const startGame = useCallback(() => {
    const randomBin = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    setScore(0);
    setPenalties(0);
    setPhase(1);
    setItems([]);
    setCurrentBin(randomBin);
    setFloodLevel(0);
    setTrashPileLevel(0);
    setPlayerX(41);
    playerXRef.current = 41;
    scoreRef.current = 0;
    phaseRef.current = 1;
    penaltiesRef.current = 0;
    currentBinRef.current = randomBin;
    itemIdRef.current = 0;
    lastSpawnTimeRef.current = Date.now();
    setScoreSaved(false);
    setGameState("playing");
  }, []);

  // ─── Continue from Intermission ───────────────────────────────
  const continueGame = useCallback(() => {
    const otherBins = CATEGORIES.filter(c => c !== currentBin);
    const newBin = otherBins[Math.floor(Math.random() * otherBins.length)];
    setCurrentBin(newBin);
    currentBinRef.current = newBin;
    
    // Regeneration: reduce penalty by 1
    setPenalties(prev => {
      const newVal = Math.max(0, prev - 1);
      penaltiesRef.current = newVal;
      return newVal;
    });
    if (weatherMode === "hot") {
      setTrashPileLevel(prev => Math.max(0, prev - 1));
    } else {
      setFloodLevel(prev => Math.max(0, prev - 1));
    }
    
    setItems([]);
    lastSpawnTimeRef.current = Date.now();
    setGameState("playing");
  }, [currentBin, weatherMode]);

  // ─── Computed values ──────────────────────────────────────────
  const nextPhaseScore = phase * PHASE_INTERVAL;
  const isWarning = penalties >= MAX_PENALTIES - 1;

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={`w-full h-screen overflow-hidden relative select-none animate-fadeIn ${shakeScreen ? "animate-shake" : ""}`}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      style={{ imageRendering: "auto" }}
    >
      {/* ── Background ── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/img/bgGame.png")',
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
          backgroundRepeat: "no-repeat",
          imageRendering: "pixelated",
        }}
      />

      {/* ── Rain overlay for cloudy/rain weather ── */}
      {weatherMode === "rain" && gameState === "playing" && (
        <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
          {rainDrops.map(drop => (
            <div
              key={drop.id}
              className="absolute animate-pixelRain"
              style={{
                left: `${drop.x}%`,
                top: "-5%",
                animationDelay: `${drop.delay}s`,
                animationDuration: `${drop.duration}s`,
                width: `${drop.size}px`,
                height: `${drop.size * 5}px`,
                background: "linear-gradient(to bottom, rgba(150,200,255,0.0), rgba(150,200,255,0.6), rgba(150,200,255,0.3))",
                imageRendering: "pixelated",
              }}
            />
          ))}
          {/* Dark overlay for rain atmosphere */}
          <div className="absolute inset-0 bg-blue-900/15" />
        </div>
      )}

      {/* ── Warning red tint when at max-1 penalty ── */}
      {isWarning && gameState === "playing" && (
        <div className="absolute inset-0 z-[6] pointer-events-none animate-warningPulse bg-red-600/20" />
      )}

      {/* ── Back Button ── */}
      <Link
        to="/"
        className="absolute top-3 left-3 z-[60] bg-black/50 hover:bg-black/70 p-2.5 text-white transition-all border-2 border-white/30"
        style={{ imageRendering: "pixelated" }}
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

      {/* ── HUD (during gameplay) ── */}
      {gameState === "playing" && (
        <div className="absolute top-2 left-0 right-0 z-[40] flex justify-center pointer-events-none px-4">
          <div
            className="flex items-center gap-3 md:gap-5 bg-black/70 border-2 px-3 py-2 md:px-5 md:py-3"
            style={{
              fontFamily: PIXEL_FONT,
              borderColor: BIN_COLORS[currentBin],
              imageRendering: "pixelated",
            }}
          >
            {/* Score */}
            <div className="flex flex-col items-center">
              <span className="text-[6px] md:text-[8px] text-white/50 tracking-widest">SKOR</span>
              <span className="text-[10px] md:text-sm text-white">{score}</span>
            </div>

            <div className="w-px h-8 bg-white/20" />

            {/* Phase indicator */}
            <div className="flex flex-col items-center">
              <span className="text-[6px] md:text-[8px] tracking-widest" style={{ color: BIN_COLORS[currentBin] }}>
                MODE
              </span>
              <span className="text-[8px] md:text-[11px] font-bold" style={{ color: BIN_COLORS[currentBin] }}>
                {BIN_LABELS[currentBin]}
              </span>
            </div>

            <div className="w-px h-8 bg-white/20" />

            {/* Next phase progress */}
            <div className="flex flex-col items-center">
              <span className="text-[6px] md:text-[8px] text-white/50 tracking-widest">FASE {phase}</span>
              <span className="text-[8px] md:text-[10px] text-yellow-300">{score}/{nextPhaseScore}</span>
            </div>

            <div className="w-px h-8 bg-white/20" />

            {/* Penalty meter */}
            <div className="flex flex-col items-center">
              <span className="text-[6px] md:text-[8px] text-white/50 tracking-widest">
                {weatherMode === "hot" ? "SAMPAH" : "BANJIR"}
              </span>
              <div className="flex gap-0.5 mt-0.5">
                {Array.from({ length: MAX_PENALTIES }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 md:w-3 md:h-3 border"
                    style={{
                      backgroundColor: i < penalties
                        ? (weatherMode === "hot" ? "#f97316" : "#3b82f6")
                        : "rgba(255,255,255,0.1)",
                      borderColor: i < penalties
                        ? (weatherMode === "hot" ? "#ea580c" : "#2563eb")
                        : "rgba(255,255,255,0.2)",
                      imageRendering: "pixelated",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Warning Icon (flashing at 1 life left) ── */}
      {isWarning && gameState === "playing" && (
        <div className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-[41] animate-warningBlink pointer-events-none">
          <img
            src="/img/InGame/warning.png"
            alt="Warning"
            className="w-10 h-10 md:w-14 md:h-14"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      )}

      {/* ── Game Area (falling items + player) ── */}
      <div className="absolute inset-0 z-[20]">
        {/* Falling items */}
        {items.map(item => (
          <div
            key={item.id}
            className="absolute"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.width}px`,
              height: `${item.height}px`,
              transform: `rotate(${Math.sin(item.y * 0.05) * 15}deg)`,
              transition: "none",
            }}
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              style={{ imageRendering: "pixelated" }}
              draggable={false}
            />
          </div>
        ))}

        {/* Player bin — NO transition for instant response */}
        {(gameState === "playing" || gameState === "start") && (
          <div
            className="absolute bottom-[12%] flex flex-col items-center pointer-events-none"
            style={{
              left: `${playerX}%`,
              width: `${PLAYER_WIDTH_PCT}%`,
            }}
          >
            <img
              src={BIN_IMAGES[currentBin]}
              alt={`${BIN_LABELS[currentBin]} Bin`}
              className="w-full h-auto object-contain drop-shadow-2xl"
              style={{ imageRendering: "pixelated", minHeight: "50px", maxHeight: "100px" }}
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* ── Catch Feedback Popup ── */}
      {showCatchFeedback && (
        <div
          className="absolute z-[45] pointer-events-none animate-feedbackFloat"
          style={{
            left: `${showCatchFeedback.x}%`,
            top: `${showCatchFeedback.y}%`,
            fontFamily: PIXEL_FONT,
            color: showCatchFeedback.color,
            fontSize: "18px",
            textShadow: "2px 2px 0 #000, -1px -1px 0 #000",
          }}
        >
          {showCatchFeedback.text}
        </div>
      )}

      {/* ── Trash Pile (hot weather penalty visual) ── */}
      {weatherMode === "hot" && trashPileLevel > 0 && gameState === "playing" && (
        <div
          className="absolute bottom-0 left-0 right-0 z-[15] pointer-events-none flex justify-center"
          style={{
            opacity: Math.min(0.4 + trashPileLevel * 0.15, 1),
            transform: `scale(${0.4 + trashPileLevel * 0.15}) translateY(${40 - trashPileLevel * 8}%)`,
            transformOrigin: "bottom center",
            transition: "all 0.5s ease",
          }}
        >
          <img
            src="/img/InGame/tumpukansampah.png"
            alt="Tumpukan Sampah"
            className="w-[80%] max-w-[500px] h-auto"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      )}

      {/* ── Flood (rain weather penalty visual) — covers up to bin level, z above player ── */}
      {weatherMode === "rain" && floodLevel > 0 && gameState === "playing" && (
        <div
          className="absolute bottom-0 left-0 right-0 z-[25] pointer-events-none"
          style={{
            height: `${Math.min(floodLevel * 5, 25)}%`,
            transition: "height 0.8s ease",
          }}
        >
          <img
            src="/img/InGame/banjir.png"
            alt="Banjir"
            className="w-full h-full object-cover"
            style={{ imageRendering: "pixelated", objectPosition: "top center" }}
          />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
           OVERLAYS (Intro, Tutorial, Intermission, Game Over)
         ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-[50] pointer-events-none flex items-center justify-center">

        {/* ── INTRO SCREEN ── */}
        {gameState === "intro" && (
          <div className="w-full h-full relative flex flex-col items-center justify-center p-6 md:p-20 pointer-events-auto">
            {/* Title */}
            <div className="flex flex-col items-center mt-[-15vh] mb-8 md:mb-14">
              <h1
                className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-[#1e4d2b] tracking-wider uppercase text-center leading-relaxed"
                style={{
                  fontFamily: PIXEL_FONT,
                  textShadow: "3px 3px 0 rgba(255,255,255,0.8), -1px -1px 0 rgba(0,0,0,0.1)",
                }}
              >
                ECO GAMES
              </h1>
              <p
                className="text-[8px] md:text-[10px] text-[#2d5a36] mt-2 tracking-[0.3em] uppercase"
                style={{ fontFamily: PIXEL_FONT }}
              >
                Pilah Sampah, Selamatkan Bumi
              </p>
            </div>

            {/* Play button */}
            <button
              onClick={() => setGameState("start")}
              className="group relative transition-transform hover:scale-105 active:scale-95 z-20 mb-16 md:mb-24"
            >
              <img
                src="/img/buttonPlay.png"
                alt="PLAY"
                className="w-36 sm:w-44 md:w-56 lg:w-64 drop-shadow-2xl"
                style={{ imageRendering: "pixelated" }}
              />
            </button>

            {/* 3 Bins at bottom with item previews */}
            <div className="absolute bottom-12 md:bottom-20 flex gap-4 sm:gap-8 md:gap-12 items-end px-4 w-full justify-center">
              {CATEGORIES.map(cat => (
                <div key={cat} className="flex flex-col items-center">
                  {/* Item previews */}
                  <div className="flex flex-wrap justify-center gap-1 mb-1.5 max-w-[90px] md:max-w-[130px]">
                    {CATEGORY_ITEMS[cat].slice(0, 4).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.img}
                        alt={item.name}
                        className="w-5 h-5 md:w-7 md:h-7 object-contain"
                        style={{ imageRendering: "pixelated" }}
                      />
                    ))}
                  </div>
                  {/* Category label */}
                  <p
                    className="text-[5px] md:text-[7px] mb-1 tracking-widest uppercase"
                    style={{ fontFamily: PIXEL_FONT, color: BIN_COLORS[cat] }}
                  >
                    {BIN_LABELS[cat]}
                  </p>
                  {/* Bin image */}
                  <div className="w-16 sm:w-20 md:w-28">
                    <img
                      src={BIN_IMAGES[cat]}
                      alt={`${BIN_LABELS[cat]} Bin`}
                      className="w-full h-auto drop-shadow-xl"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Leaderboard Toggle Button */}
            <button
              onClick={() => setShowLeaderboard(prev => !prev)}
              className="absolute bottom-6 left-6 bg-black/50 hover:bg-black/70 border-2 border-yellow-400/50 px-3 py-2 transition-all z-20"
              style={{ fontFamily: PIXEL_FONT }}
            >
              <span className="text-[7px] md:text-[9px] text-yellow-300">
                {showLeaderboard ? '✕ TUTUP' : '🏆 LEADERBOARD'}
              </span>
            </button>

            {/* Leaderboard Panel */}
            {showLeaderboard && (
              <div
                className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto bg-black/60"
                onClick={() => setShowLeaderboard(false)}
              >
                <div
                  className="bg-[#1a1a2e] border-4 border-yellow-500/60 p-3 md:p-6 max-h-[90vh] overflow-y-auto max-w-[92vw] md:max-w-md w-full animate-pixelSlideIn"
                  style={{ fontFamily: PIXEL_FONT, imageRendering: "pixelated" }}
                  onClick={e => e.stopPropagation()}
                >
                  <h3
                    className="text-[10px] md:text-sm text-yellow-300 mb-4 uppercase tracking-wider text-center"
                    style={{ textShadow: "2px 2px 0 #000" }}
                  >
                    🏆 Leaderboard
                  </h3>

                  {/* Personal Best */}
                  {localStorage.getItem('token') && (
                    <div className="bg-green-900/30 border border-green-700/50 p-2 mb-3 text-center">
                      <span className="text-[6px] md:text-[8px] text-green-300">
                        Skor Terbaikmu: <span className="text-white">{personalBest}</span>
                      </span>
                    </div>
                  )}

                  {/* Table */}
                  <div className="bg-black/40 border-2 border-white/10 max-h-[40vh] overflow-y-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-[5px] md:text-[7px] text-white/40 py-2 px-2 text-left">#</th>
                          <th className="text-[5px] md:text-[7px] text-white/40 py-2 px-2 text-left">PEMAIN</th>
                          <th className="text-[5px] md:text-[7px] text-white/40 py-2 px-2 text-right">SKOR</th>
                          <th className="text-[5px] md:text-[7px] text-white/40 py-2 px-2 text-right">FASE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-[6px] md:text-[8px] text-white/30 py-4 text-center">
                              Belum ada skor
                            </td>
                          </tr>
                        ) : (
                          leaderboard.map((entry, i) => (
                            <tr
                              key={i}
                              className={`border-b border-white/5 ${
                                i === 0 ? 'bg-yellow-900/20' : i === 1 ? 'bg-gray-600/10' : i === 2 ? 'bg-amber-900/10' : ''
                              }`}
                            >
                              <td className="text-[6px] md:text-[8px] py-1.5 px-2">
                                <span className={i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-500' : 'text-white/40'}>
                                  {i + 1}
                                </span>
                              </td>
                              <td className="text-[6px] md:text-[8px] text-white py-1.5 px-2 truncate max-w-[120px]">
                                {entry.username}
                              </td>
                              <td className="text-[6px] md:text-[8px] text-green-300 py-1.5 px-2 text-right">
                                {entry.score}
                              </td>
                              <td className="text-[6px] md:text-[8px] text-yellow-300 py-1.5 px-2 text-right">
                                {entry.phase}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Guest hint */}
                  {!localStorage.getItem('token') && (
                    <p className="text-[5px] md:text-[7px] text-white/30 mt-3 text-center">
                      Login untuk menyimpan skor kamu ke leaderboard!
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Weather indicator */}
            <div
              className="absolute bottom-6 right-6 bg-black/50 border-2 border-white/20 px-3 py-2"
              style={{ fontFamily: PIXEL_FONT }}
            >
              <span className="text-[7px] md:text-[9px] text-white/60">CUACA: </span>
              <span className={`text-[7px] md:text-[9px] ${weatherMode === "rain" ? "text-blue-300" : "text-yellow-300"}`}>
                {weatherLabel}
              </span>
            </div>
          </div>
        )}

        {/* ── TUTORIAL / START SCREEN ── */}
        {gameState === "start" && (
          <div
            className="bg-[#1a1a2e] border-4 border-[#16213e] p-3 sm:p-5 md:p-10 max-h-[90vh] overflow-y-auto max-w-[92vw] md:max-w-lg w-full text-center pointer-events-auto shadow-2xl"
            style={{ fontFamily: PIXEL_FONT, imageRendering: "pixelated" }}
          >
            <h2
              className="text-sm md:text-lg text-yellow-300 mb-5 uppercase tracking-wider"
              style={{ textShadow: "2px 2px 0 #000" }}
            >
              📜 Cara Bermain
            </h2>

            <div className="bg-black/40 border-2 border-white/10 p-3 md:p-5 mb-5 text-left space-y-3">
              {/* Rule 1 */}
              <div className="flex items-start gap-3">
                <span className="text-[10px] md:text-xs text-green-400 bg-green-900/30 px-2 py-1 border border-green-700/50">✓</span>
                <div>
                  <p className="text-[7px] md:text-[9px] text-green-300">Tangkap sampah SESUAI tong (+10~20)</p>
                  <p className="text-[6px] md:text-[7px] text-white/40 mt-1">Tong berubah tiap 200 poin</p>
                </div>
              </div>
              {/* Rule 2 */}
              <div className="w-full h-px bg-white/10" />
              <div className="flex items-start gap-3">
                <span className="text-[10px] md:text-xs text-red-400 bg-red-900/30 px-2 py-1 border border-red-700/50">✗</span>
                <div>
                  <p className="text-[7px] md:text-[9px] text-red-300">Salah tangkap / meleset = PENALTI</p>
                  <p className="text-[6px] md:text-[7px] text-white/40 mt-1">
                    {weatherMode === "hot"
                      ? "Cuaca panas → Tumpukan sampah muncul!"
                      : "Cuaca hujan → Level banjir naik!"}
                  </p>
                </div>
              </div>
              {/* Rule 3 */}
              <div className="w-full h-px bg-white/10" />
              <div className="flex items-start gap-3">
                <span className="text-[10px] md:text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 border border-yellow-700/50">!</span>
                <div>
                  <p className="text-[7px] md:text-[9px] text-yellow-200">5 penalti = Game Over!</p>
                  <p className="text-[6px] md:text-[7px] text-white/40 mt-1">Setiap babak baru mengurangi 1 penalti</p>
                </div>
              </div>
            </div>

            {/* Controls info */}
            <p className="text-[6px] md:text-[7px] text-white/30 mb-5">
              ← → / A D / Geser layar untuk bergerak
            </p>

            {/* Start button */}
            <button
              onClick={startGame}
              className="w-full bg-green-500 hover:bg-green-400 text-black py-3 text-[10px] md:text-xs uppercase tracking-[0.3em] border-2 border-green-300 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ fontFamily: PIXEL_FONT, textShadow: "none" }}
            >
              ▶ START
            </button>

            <button
              onClick={() => setGameState("intro")}
              className="mt-4 text-[7px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-[0.2em]"
              style={{ fontFamily: PIXEL_FONT }}
            >
              ← KEMBALI
            </button>
          </div>
        )}

        {/* ── INTERMISSION (Phase Transition) ── */}
        {gameState === "intermission" && (
          <div
            className="bg-[#1a1a2e] border-4 p-3 sm:p-5 md:p-10 max-h-[90vh] overflow-y-auto max-w-[90vw] md:max-w-md w-full text-center pointer-events-auto animate-pixelSlideIn shadow-2xl"
            style={{
              fontFamily: PIXEL_FONT,
              borderColor: BIN_COLORS[currentBin],
              imageRendering: "pixelated",
            }}
          >
            {/* Phase number */}
            <div
              className="text-[8px] md:text-[10px] tracking-[0.4em] uppercase mb-2"
              style={{ color: BIN_COLORS[currentBin] }}
            >
              FASE {phase}
            </div>

            <h2
              className="text-sm md:text-lg text-yellow-300 mb-4 uppercase"
              style={{ textShadow: "2px 2px 0 #000" }}
            >
              ⚡ Target Berganti!
            </h2>

            <div className="bg-black/40 border-2 border-white/10 p-4 mb-4">
              <p className="text-[7px] md:text-[9px] text-white/70 leading-relaxed">
                Cuaca sedang <span className={weatherMode === "rain" ? "text-blue-300" : "text-yellow-300"}>{weatherLabel}</span>,
                waspada terhadap <span className="text-red-300">{weatherMode === "hot" ? "Tumpukan Sampah" : "Banjir"}</span>!
              </p>
            </div>

            {/* Show penalty regeneration */}
            <div className="bg-green-900/30 border border-green-700/50 p-2 mb-5">
              <p className="text-[6px] md:text-[8px] text-green-300">
                ♻ Regenerasi: Penalti berkurang 1
              </p>
            </div>

            {/* Speed increase notice */}
            <div className="bg-orange-900/30 border border-orange-700/50 p-2 mb-5">
              <p className="text-[6px] md:text-[8px] text-orange-300">
                ↑ Kecepatan meningkat +{Math.round(SPEED_INCREASE_PER_PHASE * 100)}%
              </p>
            </div>

            <p className="text-[8px] md:text-[10px] text-white/50 mb-5">Siap?</p>

            <button
              onClick={continueGame}
              className="w-full py-3 text-[10px] md:text-xs uppercase tracking-[0.3em] border-2 text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                fontFamily: PIXEL_FONT,
                backgroundColor: BIN_COLORS[currentBin],
                borderColor: "#fff",
              }}
            >
              ▶ LANJUT
            </button>
          </div>
        )}

        {/* ── GAME OVER SCREEN ── */}
        {gameState === "gameover" && (
          <div
            className="bg-[#1a1a2e] border-4 border-red-600 p-3 sm:p-5 md:p-10 max-h-[90vh] overflow-y-auto max-w-[90vw] md:max-w-sm w-full text-center pointer-events-auto animate-pixelSlideIn shadow-2xl"
            style={{ fontFamily: PIXEL_FONT, imageRendering: "pixelated" }}
          >
            {/* Skull / Game Over visual */}
            <div className="text-3xl md:text-4xl mb-3 animate-bounce">💀</div>

            <h2
              className="text-lg md:text-xl text-red-400 mb-2 uppercase tracking-wider"
              style={{ textShadow: "2px 2px 0 #000" }}
            >
              Game Over!
            </h2>

            <div className="bg-black/40 border-2 border-white/10 p-4 mb-4">
              <p className="text-[7px] md:text-[8px] text-white/50 uppercase tracking-widest">Skor Akhir</p>
              <p className="text-xl md:text-2xl text-white mt-1">{score}</p>
              <div className="w-full h-px bg-white/10 my-2" />
              <p className="text-[7px] md:text-[8px] text-white/50 uppercase tracking-widest">Fase Tercapai</p>
              <p className="text-sm md:text-lg text-yellow-300 mt-1">{phase}</p>
            </div>

            <p className="text-[6px] md:text-[7px] text-white/40 mb-3">
              {weatherMode === "hot"
                ? "Tumpukan sampah telah memenuhi lingkungan..."
                : "Banjir telah merendam area permainan..."}
            </p>

            {/* Personal Best & New Highscore */}
            {localStorage.getItem('token') ? (
              <div className="mb-4">
                {scoreSaved ? (
                  <div className="bg-green-900/30 border border-green-700/50 p-2">
                    <p className="text-[6px] md:text-[8px] text-green-300">🎉 Highscore Baru Tersimpan!</p>
                  </div>
                ) : score <= personalBest && personalBest > 0 ? (
                  <div className="bg-black/40 border border-white/10 p-2">
                    <p className="text-[6px] md:text-[8px] text-white/40">
                      Skor Terbaik: <span className="text-yellow-300">{personalBest}</span>
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="bg-blue-900/20 border border-blue-700/30 p-2 mb-4">
                <p className="text-[5px] md:text-[7px] text-blue-300">
                  Login untuk menyimpan skor ke leaderboard!
                </p>
              </div>
            )}

            <button
              onClick={startGame}
              className="w-full bg-red-500 hover:bg-red-400 text-white py-3 text-[10px] md:text-xs uppercase tracking-[0.3em] border-2 border-red-300 transition-all hover:scale-[1.02] active:scale-[0.98] mb-3"
              style={{ fontFamily: PIXEL_FONT }}
            >
              ↻ MAIN LAGI
            </button>

            <button
              onClick={() => setGameState("intro")}
              className="text-[7px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-[0.2em]"
              style={{ fontFamily: PIXEL_FONT }}
            >
              ← MENU UTAMA
            </button>
          </div>
        )}
      </div>

      {/* ── Portrait Mode Warning (Mobile Landscape Lock) ── */}
      {isPortrait && (
        <div
          className="fixed inset-0 z-[100] bg-[#0a0a1a] flex flex-col items-center justify-center p-8"
          style={{ fontFamily: PIXEL_FONT }}
        >
          <div className="animate-spin-slow mb-6">
            <RotateCcw className="w-16 h-16 text-green-400" />
          </div>
          <h2
            className="text-sm md:text-lg text-green-400 mb-4 uppercase tracking-wider text-center"
            style={{ textShadow: "2px 2px 0 #000" }}
          >
            Putar Layar!
          </h2>
          <p className="text-[7px] md:text-[9px] text-white/60 text-center leading-relaxed max-w-[280px]">
            Game ini harus dimainkan dalam mode <span className="text-yellow-300">Landscape</span>. Silakan putar perangkat Anda ke posisi horizontal.
          </p>
          <div className="mt-6 border-2 border-white/20 w-24 h-14 rounded-md flex items-center justify-center relative">
            <div className="absolute w-1 h-4 bg-white/30 -right-1 top-3 rounded-r" />
            <span className="text-[8px] text-white/40">↻</span>
          </div>
        </div>
      )}

      {/* ── CSS Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        @keyframes pixelRain {
          0% { transform: translateY(0); opacity: 0; }
          5% { opacity: 0.7; }
          90% { opacity: 0.5; }
          100% { transform: translateY(105vh); opacity: 0; }
        }
        .animate-pixelRain {
          animation-name: pixelRain;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes warningPulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-warningPulse {
          animation: warningPulse 0.8s ease-in-out infinite;
        }

        @keyframes warningBlink {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.2; transform: translateX(-50%) scale(0.9); }
        }
        .animate-warningBlink {
          animation: warningBlink 0.5s ease-in-out infinite;
        }

        @keyframes feedbackFloat {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-40px); }
        }
        .animate-feedbackFloat {
          animation: feedbackFloat 0.8s ease-out forwards;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        .animate-shake {
          animation: shake 0.3s ease;
        }

        @keyframes pixelSlideIn {
          0% { opacity: 0; transform: scale(0.8); }
          50% { transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pixelSlideIn {
          animation: pixelSlideIn 0.4s ease-out;
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Game;
