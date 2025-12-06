import { 
  animate, 
  stagger, 
  splitText, 
  createScope, 
  createDraggable, 
  spring,
  svg
} from 'animejs'; 
import { useEffect, useRef } from 'react'; 
import { Leaf } from 'lucide-react'; 

// --- UTILITY CSS CLASS INJECTION ---
const injectCss = () => {
  const style = document.createElement('style');
  style.textContent = `
    .first-load-animation-container h2 {
      display: inline-block;
      margin: 0;
      white-space: nowrap;
      letter-spacing: 0.06em;
    }
    .first-load-animation-container h2 .char {
      display: inline-block;
      transform-origin: 50% 100%;
    }
    .leaf-logo {
        cursor: grab;
    }
    .leaf-logo:active {
        cursor: grabbing;
    }
    
    /* STYLE UNTUK IKON TUNAS YANG AKAN DIGAMBAR */
    .sprout-drawable-svg {
        width: 60px; 
        height: 60px;
    }
    .sprout-drawable-svg path {
        fill: none; 
        stroke: currentColor; 
        stroke-width: 2; 
    }
  `;
  if (!document.querySelector('#anime-css-inject')) {
      style.id = 'anime-css-inject';
      document.head.appendChild(style);
  }
};
injectCss(); 

// ------------------------------------------------------

const FirstLoadAnimation = () => {
  const rootRef = useRef<HTMLDivElement>(null); 
  const textRef = useRef<HTMLHeadingElement>(null);
  const scope = useRef<any>(null); 
  
  // Ref untuk setiap PATH di ikon Tunas
  const path1Ref = useRef<SVGPathElement>(null); 
  const path2Ref = useRef<SVGPathElement>(null); 
  const path3Ref = useRef<SVGPathElement>(null); 
  
  // Total durasi menggambar untuk ketiga path adalah 5000ms
  const DRAW_DURATION_TOTAL = 4500; 
  // Durasi per path: 5000ms / 3 path ≈ 1666ms
  const DRAW_DURATION_PER_PATH = DRAW_DURATION_TOTAL / 3; 

  useEffect(() => {
    
    // Pastikan semua ref tersedia
    if (rootRef.current && textRef.current && path1Ref.current && path2Ref.current && path3Ref.current) {
      
      const { chars } = splitText(textRef.current, { words: false, chars: true });
      
      if (chars.length === 0) {
          console.warn('Anime.js: Teks "AksiHijau" gagal di-split.');
          return;
      }

      // Kumpulkan semua elemen path
      const paths = [path1Ref.current, path2Ref.current, path3Ref.current];

      scope.current = createScope({ root: rootRef.current }).add(self => {
        
        // --- 1. ANIMASI LINE DRAWING (Ikon Tunas/Sprout) ---
        
        paths.forEach((pathElement, index) => {
             // Hitung delay untuk setiap path
             const delay = index * DRAW_DURATION_PER_PATH;
             
             // Animasi draw untuk setiap path
             animate(svg.createDrawable(pathElement), {
                draw: [
                    // Fase Menggambar: 0 (awal) ke 1 (akhir)
                    { to: '0 1', easing: 'easeInOutQuad', duration: DRAW_DURATION_PER_PATH, delay: delay }, 
                ],
                // loop dihapus agar hanya menggambar sekali
             });
        });

        
        // --- 2. ANIMASI LOGO (Leaf) ---
        animate('.leaf-logo', {
          scale: [
            { to: 1.3, ease: 'inOut(3)', duration: 600 }, 
            { to: 1, ease: spring({ bounce: .7 }) }
          ],
          loopDelay: 800, 
          duration: 2000, 
          loop: true, 
        });
        
        createDraggable('.leaf-logo', {
          releaseEase: spring({ bounce: .7 })
        });
        
        // --- 3. ANIMASI TEKS (Berjalan 2 Kali) ---
        animate(chars, {
          y: [
            { to: '-3rem', ease: 'outExpo', duration: 600 }, 
            { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
          ],
          rotate: {
            from: '-1turn',
            delay: 0
          },
          delay: stagger(50),
          ease: 'inOutCirc',
          loopDelay: 500,
          loop: 2 
        });

      });
    }

    return () => scope.current?.revert(); 
    
  }, []);


  return (
    <div 
      ref={rootRef} 
      className="fixed inset-0 flex flex-col items-center justify-center bg-green-50 z-[9999] first-load-animation-container"
    >
        
        {/* Logo Leaf */}
        <div className="mb-8">
            <Leaf className="w-16 h-16 text-primary leaf-logo" />
        </div>

        {/* Teks AksiHijau */}
        <h2 
            ref={textRef}
            className="text-5xl sm:text-6xl font-extrabold text-primary tracking-wider"
        >
            Aksi Hijau
        </h2>
      
        {/* IKON TUNAS/SPROUT YANG DIGAMBAR (DRAWABLE) */}
        <div className="mt-8 text-primary">
            <svg 
                className="sprout-drawable-svg" 
                aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" 
                width="30" 
                height="30" 
                fill="none" 
                viewBox="0 0 24 24"
            >
                {/* Path 1 */}
                <path 
                    ref={path1Ref} 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"
                />
                {/* Path 2 */}
                <path 
                    ref={path2Ref} 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"
                />
                {/* Path 3 */}
                <path 
                    ref={path3Ref} 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 21h14"
                />
            </svg>
        </div>

    </div>
  );
};

export default FirstLoadAnimation;