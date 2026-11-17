import React, { useState, useEffect, useRef, useMemo } from 'react';

export interface Project {
  id: string;
  title: string;
  client: string;
  handle: string;
  type: string;
  category: 'Carrosséis' | 'Estáticos' | 'Identidade Visual';
  cover: string;
  presentationImage?: string;
  slides: string[];
  slideCount: number;
  pdf?: string | null;
  software: string;
  colors: string[];
  description: string;
  highlight: boolean;
}

const WHATSAPP_NUMBER = '5511999999999';

export default function App() {
  const [activeTab, setActiveTab] = useState<'carrosseis' | 'estaticos' | 'identidade-visual'>('carrosseis');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const { carrosseis, estaticos, idVisual } = useMemo(() => {
    const all: Project[] = (window as any).PORTFOLIO_PROJECTS || [];

    return {
      carrosseis: all.filter(p => p.category === 'Carrosséis'),
      estaticos: all.filter(p => p.category === 'Estáticos'),
      idVisual: all.filter(p => p.category === 'Identidade Visual')
    };
  }, []);

  const [selectedIdVisualIndex, setSelectedIdVisualIndex] = useState<number>(0);
  const activeIdVisualProject = idVisual[selectedIdVisualIndex] || idVisual[0];

  // 3D Cover Flow for Carrosséis
  const [viewingCarousel, setViewingCarousel] = useState<Project | null>(null);
  const [currentFlowIndex, setCurrentFlowIndex] = useState<number>(0);
  const [coverMetrics, setCoverMetrics] = useState<{ w: number; h: number }>({ w: 320, h: 400 });

  const flowViewportRef = useRef<HTMLDivElement | null>(null);
  const flowPos = useRef<number>(0);
  const flowTarget = useRef<number>(0);
  const flowLastTime = useRef<number>(performance.now());
  const flowFrameId = useRef<number>(0);
  const flowCardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const flowWheelAccum = useRef<number>(0);

  const flowIsDragging = useRef<boolean>(false);
  const flowDragStartX = useRef<number>(0);
  const flowDragStartPos = useRef<number>(0);
  const flowLastDragX = useRef<number>(0);
  const flowLastDragTime = useRef<number>(0);
  const flowVelocity = useRef<number>(0);
  const flowHasDragged = useRef<boolean>(false);
  const ribbonRef = useRef<HTMLDivElement | null>(null);

  const hexToRgb = (hex: string) => {
    if (!hex || typeof hex !== 'string') return '16, 185, 129';
    const clean = hex.replace('#', '');
    if (clean.length === 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }
    return '16, 185, 129';
  };

  useEffect(() => {
    const updateMetrics = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const W = Math.round(Math.min(h * 0.40, w * 0.32, 360));
      const H = Math.round(W * 1.25);
      setCoverMetrics({ w: W, h: H });
    };
    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, []);

  useEffect(() => {
    if (carrosseis.length > 0 && carrosseis[currentFlowIndex]) {
      const c = carrosseis[currentFlowIndex].colors?.[0] || '#10b981';
      const rgb = hexToRgb(c);
      document.documentElement.style.setProperty('--glow', rgb);
    }
  }, [currentFlowIndex, carrosseis]);

  useEffect(() => {
    if (activeTab !== 'carrosseis' || viewingCarousel) return;

    const N = carrosseis.length;
    if (N === 0) return;

    const ANG = 72;
    const GAP = 0.62;
    const STEP = 0.2;
    const DEPTH = 0.42;
    const W = coverMetrics.w;

    flowLastTime.current = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - flowLastTime.current) / 1000, 0.1);
      flowLastTime.current = now;

      const delta = flowTarget.current - flowPos.current;
      flowPos.current += delta * (1 - Math.exp(-dt * 13));
      if (Math.abs(delta) < 0.0005) {
        flowPos.current = flowTarget.current;
      }

      const rounded = Math.max(0, Math.min(N - 1, Math.round(flowPos.current)));
      setCurrentFlowIndex(prev => (prev !== rounded ? rounded : prev));

      for (let i = 0; i < N; i++) {
        const el = flowCardsRefs.current[i];
        if (!el) continue;

        const d = i - flowPos.current;
        const a = Math.abs(d);
        const s = Math.sign(d);

        if (a > 9) {
          el.style.display = 'none';
          continue;
        }

        el.style.display = 'block';

        let x: number, rot: number, z: number;
        if (a < 1) {
          x = d * GAP;
          rot = -d * ANG;
          z = -a * DEPTH;
        } else {
          x = s * (GAP + (a - 1) * STEP);
          rot = -s * ANG;
          z = -DEPTH;
        }

        const zIndex = Math.round(500 - a * 10);
        el.style.transform = `translate3d(${x * W}px, 0px, ${z * W}px) rotateY(${rot}deg)`;
        el.style.zIndex = `${zIndex}`;
      }

      flowFrameId.current = requestAnimationFrame(tick);
    };

    flowFrameId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(flowFrameId.current);
  }, [activeTab, viewingCarousel, carrosseis, coverMetrics]);

  const handleFlowWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (viewingCarousel || selectedProject) return;
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    flowWheelAccum.current += delta;
    if (Math.abs(flowWheelAccum.current) >= 50) {
      const step = flowWheelAccum.current > 0 ? 1 : -1;
      flowTarget.current = Math.max(0, Math.min(carrosseis.length - 1, flowTarget.current + step));
      flowWheelAccum.current = 0;
    }
  };

  const handleFlowPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (viewingCarousel || selectedProject) return;
    flowIsDragging.current = true;
    flowDragStartX.current = e.clientX;
    flowDragStartPos.current = flowPos.current;
    flowLastDragX.current = e.clientX;
    flowLastDragTime.current = performance.now();
    flowVelocity.current = 0;
    flowHasDragged.current = false;
  };

  const handleFlowPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!flowIsDragging.current) return;
    const dx = e.clientX - flowDragStartX.current;
    if (Math.abs(dx) > 4) {
      flowHasDragged.current = true;
    }
    const now = performance.now();
    const dt = Math.max(1, now - flowLastDragTime.current);
    flowVelocity.current = (e.clientX - flowLastDragX.current) / dt;
    flowLastDragX.current = e.clientX;
    flowLastDragTime.current = now;

    const sensitivity = coverMetrics.w * 0.2 * 2.2;
    const newPos = flowDragStartPos.current - dx / sensitivity;
    flowPos.current = Math.max(-0.4, Math.min(carrosseis.length - 0.6, newPos));
    flowTarget.current = flowPos.current;
  };

  const handleFlowPointerUp = () => {
    if (!flowIsDragging.current) return;
    flowIsDragging.current = false;
    if (flowHasDragged.current) {
      const target = Math.round(flowPos.current - flowVelocity.current * 70);
      flowTarget.current = Math.max(0, Math.min(carrosseis.length - 1, target));
    }
  };

  const handleCardClick = (idx: number) => {
    if (flowHasDragged.current) return;
    const currentTarget = Math.round(flowTarget.current);
    if (idx === currentTarget) {
      setViewingCarousel(carrosseis[idx]);
    } else {
      flowTarget.current = idx;
    }
  };

  const handleRibbonWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!ribbonRef.current) return;
    e.preventDefault();
    ribbonRef.current.scrollLeft += (e.deltaY || e.deltaX) * 1.5;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject) {
        if (e.key === 'Escape') setSelectedProject(null);
        return;
      }

      if (viewingCarousel) {
        if (e.key === 'Escape') setViewingCarousel(null);
        return;
      }

      if (activeTab === 'carrosseis') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          flowTarget.current = Math.max(0, flowTarget.current - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          flowTarget.current = Math.min(carrosseis.length - 1, flowTarget.current + 1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const curr = carrosseis[Math.round(flowTarget.current)];
          if (curr) setViewingCarousel(curr);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, viewingCarousel, selectedProject, carrosseis]);

  // Horizontal scroll ref for Identidade Visual (side by side)
  const idVisualContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingID, setIsDraggingID] = useState<boolean>(false);
  const dragStartXID = useRef<number>(0);
  const scrollStartXID = useRef<number>(0);

  const handleIdVisualWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!idVisualContainerRef.current || selectedProject) return;
    e.preventDefault();
    idVisualContainerRef.current.scrollLeft += (e.deltaY || e.deltaX) * 1.6;
  };

  const handleMouseDownID = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!idVisualContainerRef.current) return;
    setIsDraggingID(true);
    dragStartXID.current = e.pageX - idVisualContainerRef.current.offsetLeft;
    scrollStartXID.current = idVisualContainerRef.current.scrollLeft;
  };

  const handleMouseMoveID = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingID || !idVisualContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - idVisualContainerRef.current.offsetLeft;
    const walk = (x - dragStartXID.current) * 1.5;
    idVisualContainerRef.current.scrollLeft = scrollStartXID.current - walk;
  };

  const handleMouseUpID = () => {
    setIsDraggingID(false);
  };

  // Vertical 3D cylinder metrics for Estáticos
  const [staticMetrics, setStaticMetrics] = useState({
    cardW: 390,
    cardH: 488,
  });

  const staticCardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const staticFrameId = useRef<number>(0);
  const staticProgress = useRef<number>(0);
  const staticTargetProgress = useRef<number>(0);
  const staticIsDragging = useRef<boolean>(false);
  const staticDragStartY = useRef<number>(0);
  const staticDragStartProgress = useRef<number>(0);
  const staticDragDist = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const heightFactor = Math.min(1.0, Math.max(0.72, h / 880));
      let cardW = Math.round(Math.min(430, Math.max(260, w * 0.32)) * heightFactor);
      const cardH = Math.round(cardW * 1.25);

      setStaticMetrics({ cardW, cardH });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ry = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      mouse.current.targetX = Math.max(-1, Math.min(1, rx));
      mouse.current.targetY = Math.max(-1, Math.min(1, ry));

      if (staticIsDragging.current) {
        const diffY = e.clientY - staticDragStartY.current;
        staticDragDist.current += Math.abs(diffY);
        const sensitivity = staticMetrics.cardH * 0.9;
        staticTargetProgress.current = staticDragStartProgress.current - (diffY / sensitivity);
      }
    };

    const handleMouseUp = () => {
      staticIsDragging.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [staticMetrics]);

  useEffect(() => {
    if (activeTab !== 'estaticos') return;

    const handleWheel = (e: WheelEvent) => {
      if (selectedProject) return;
      e.preventDefault();
      const delta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120) * 0.0024;
      staticTargetProgress.current += delta;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeTab, selectedProject]);

  const renderStaticLoop = () => {
    if (activeTab !== 'estaticos') return;

    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.08;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.08;

    const count = estaticos.length;
    if (count === 0) return;

    if (!staticIsDragging.current) {
      staticTargetProgress.current += 0.0008;
    }

    staticProgress.current += (staticTargetProgress.current - staticProgress.current) * 0.12;

    const continuousProgress = staticProgress.current;
    const cards = staticCardsRefs.current;
    const { cardH } = staticMetrics;

    for (let i = 0; i < count; i++) {
      const card = cards[i];
      if (!card) continue;

      let offset = i - continuousProgress;
      const halfCount = count / 2;
      while (offset > halfCount) offset -= count;
      while (offset < -halfCount) offset += count;

      const absOffset = Math.abs(offset);
      const sign = Math.sign(offset);

      if (absOffset > 2.8) {
        card.style.visibility = 'hidden';
        continue;
      } else {
        card.style.visibility = 'visible';
      }

      const targetY = cardH + 28;
      let y = 0;
      let z = 0;
      let rotX = 0;

      if (absOffset <= 1) {
        const t = absOffset;
        const easedT = t * t * (3 - 2 * t);
        y = -sign * (easedT * targetY);
        z = 260 + easedT * (80 - 260);
        rotX = -sign * (easedT * 26);
      } else if (absOffset <= 2) {
        const t = absOffset - 1;
        const easedT = t * t * (3 - 2 * t);
        y = -sign * (targetY + easedT * targetY);
        z = 80 + easedT * (-120 - 80);
        rotX = -sign * (26 + easedT * 32);
      } else {
        const t = Math.min(absOffset - 2, 1);
        const easedT = t * t * (3 - 2 * t);
        y = -sign * (targetY * 2 + easedT * targetY);
        z = -120 + easedT * (-260 - -120);
        rotX = -sign * (58 + easedT * 35);
      }

      const centerFactor = Math.max(0, 1 - absOffset * 0.7);
      const activeTiltX = -mouse.current.y * 11 * centerFactor;
      const activeTiltY = mouse.current.x * 13 * centerFactor;

      const totalRotX = rotX + activeTiltX;
      const totalRotY = activeTiltY;
      const opacity = Math.max(0.25, 1 - absOffset * 0.35);

      card.style.zIndex = Math.round(z + 500).toString();
      card.style.opacity = opacity.toString();
      card.style.transform = `translateY(${y.toFixed(2)}px) translateZ(${z.toFixed(2)}px) rotateX(${totalRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(2)}deg)`;
    }
  };

  useEffect(() => {
    if (activeTab !== 'estaticos') return;

    const tick = () => {
      renderStaticLoop();
      staticFrameId.current = requestAnimationFrame(tick);
    };

    staticFrameId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(staticFrameId.current);
  }, [activeTab, staticMetrics, estaticos]);

  const thicknessLayers = [-1, 0, 1];

  const getWhatsAppLink = (projectTitle = '') => {
    let msg = "Olá Marcos! Vi seu portfólio e gostaria de solicitar um orçamento para um projeto de design.";
    if (projectTitle) {
      msg = `Olá Marcos! Gostei muito do projeto "${projectTitle}" do seu portfólio e gostaria de um orçamento para um trabalho semelhante.`;
    }
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="relative w-full h-full bg-[#08080a] text-zinc-100 flex flex-col overflow-hidden select-none font-sans">
      
      {/* Tactile Obsidian Canvas with Subtle Film Grain */}
      <div className="absolute inset-0 bg-grain pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#08080a]/90 via-transparent to-[#08080a] pointer-events-none z-0" />

      {/* Header with 3 Category Menus */}
      <header className="relative z-50 flex items-center justify-between px-5 sm:px-10 py-4 border-b border-white/[0.08] bg-[#08080a]/85 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 flex items-center justify-center p-1.5 shadow-lg backdrop-blur-md overflow-hidden">
            <img src="assets/logo.png" alt="Marcos Logo" className="w-full h-full object-contain filter brightness-110 drop-shadow" />
          </div>
          <div className="flex flex-col text-left">
            <div className="text-sm font-black tracking-wide text-white">
              MARCOS <span className="text-white/40 font-light">/ DESIGNER</span>
            </div>
            <div className="text-[10px] text-white/50 tracking-wider font-medium flex items-center gap-1.5">
              <span>DIREÇÃO DE ARTE & BRANDING</span>
              <span className="text-white/20">•</span>
              <span className="text-emerald-400/90 font-semibold">2026</span>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl">
          {[
            { id: 'carrosseis', label: 'Carrosséis', badge: carrosseis.length },
            { id: 'estaticos', label: 'Estáticos', badge: estaticos.length },
            { id: 'identidade-visual', label: 'Identidade Visual', badge: idVisual.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#f4f4f5] text-zinc-950 font-bold shadow-lg shadow-black/40 scale-100'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.06] font-medium'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-stretch ${
                activeTab === tab.id ? 'bg-black/10 text-zinc-900 font-bold' : 'bg-white/10 text-zinc-400 font-semibold'
              }`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#f4f4f5] hover:bg-white text-zinc-950 text-xs px-4 py-2 rounded-full shadow-md shadow-white/5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
          >
            <span className="hidden sm:inline font-semibold">Solicitar <strong className="font-extrabold text-black">Orçamento</strong></span>
            <span className="sm:hidden font-bold">Orçamento</span>
            <span className="text-sm">↗</span>
          </a>
        </div>
      </header>

      {/* CARROSSÉIS TAB: 3D COVER FLOW + UNITED PANORAMIC VIEW */}
      {activeTab === 'carrosseis' && (
        <div className="relative flex-1 flex flex-col overflow-hidden animate-fadeIn select-none">
          {/* MODE A: 3D COVER FLOW VIEW */}
          {!viewingCarousel && (
            <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
              {/* Dynamic Glow */}
              <div id="glow" />

              {/* 3D Cover Flow Viewport */}
              <div
                ref={flowViewportRef}
                onWheel={handleFlowWheel}
                onPointerDown={handleFlowPointerDown}
                onPointerMove={handleFlowPointerMove}
                onPointerUp={handleFlowPointerUp}
                onPointerCancel={handleFlowPointerUp}
                className="coverflow-viewport flex-1 flex items-center justify-center relative"
                style={{
                  perspective: `${coverMetrics.w * 3.4}px`,
                  perspectiveOrigin: '50% 40%',
                }}
              >
                {carrosseis.map((carousel, idx) => (
                  <div
                    key={carousel.id}
                    ref={el => { flowCardsRefs.current[idx] = el; }}
                    onClick={() => handleCardClick(idx)}
                    className="cv-item"
                    style={{
                      width: `${coverMetrics.w}px`,
                      height: `${coverMetrics.h}px`,
                      marginLeft: `-${coverMetrics.w / 2}px`,
                      marginTop: `-${coverMetrics.h / 2}px`,
                    }}
                  >
                    <div className="cv-front">
                      <img
                        src={carousel.slides[0]}
                        alt={carousel.title}
                        className="w-full h-full object-cover block pointer-events-none select-none"
                        loading={Math.abs(idx - currentFlowIndex) < 4 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute top-3.5 left-3.5 text-[11px] bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white/90 border border-white/15 pointer-events-none flex items-center gap-1">
                        <span className="font-stretch font-bold text-emerald-400">{carousel.slideCount}</span>
                        <span className="font-light text-white/50">SLIDES</span>
                      </div>

                      {idx === currentFlowIndex && (
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="text-xs bg-black/90 text-white px-4 py-2 rounded-full border border-white/20 shadow-2xl backdrop-blur-md font-medium tracking-wide">
                            <span className="font-light text-white/70">VER</span> <span className="font-stretch font-bold text-emerald-400 tracking-wider">COMPLETO</span> ↗
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="cv-reflection">
                      <img
                        src={carousel.slides[0]}
                        alt=""
                        className="w-full h-full object-cover block pointer-events-none select-none"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Carousel Metadata & Action Hub */}
              {carrosseis[currentFlowIndex] && (
                <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 mb-4 gap-3 animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full">
                      {carrosseis[currentFlowIndex].client}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-xs text-white/60 font-light">
                      {carrosseis[currentFlowIndex].type}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    {carrosseis[currentFlowIndex].title}
                  </h3>

                  <div className="flex items-center gap-3 mt-0.5">
                    <button
                      onClick={() => setViewingCarousel(carrosseis[currentFlowIndex])}
                      className="px-5 py-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-100 text-xs sm:text-sm font-semibold transition-all shadow-xl shadow-black/40 flex items-center gap-2 cursor-pointer border border-white/20 group"
                    >
                      <span>Ver Carrossel Completo</span>
                      <strong className="font-stretch font-bold text-emerald-600">({carrosseis[currentFlowIndex].slideCount} slides unidos)</strong>
                      <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
                    </button>

                    <button
                      onClick={() => setSelectedProject(carrosseis[currentFlowIndex])}
                      className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs font-medium transition-all cursor-pointer border border-white/10"
                    >
                      Ficha Técnica
                    </button>
                  </div>
                </div>
              )}

              {/* Guidance & Controls Footer */}
              <footer className="px-6 py-2.5 border-t border-white/[0.08] bg-[#08080a]/80 backdrop-blur-md flex items-center justify-between text-xs text-zinc-400 flex-shrink-0 z-20">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="font-light tracking-wide text-zinc-400">
                    COVER FLOW 3D • ROLE O MOUSE, ARRASTE OU USE AS SETAS • CLIQUE PARA ABRIR O CARROSSEL <span className="font-stretch font-bold text-zinc-200 tracking-wider">COMPLETO</span>
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-zinc-500 font-light text-[11px]">
                  <button
                    onClick={() => { flowTarget.current = Math.max(0, flowTarget.current - 1); }}
                    className="hover:text-white cursor-pointer px-2 py-0.5 rounded hover:bg-white/5 transition-all"
                  >
                    ← <span className="font-stretch font-bold text-zinc-400">ANTERIOR</span>
                  </button>
                  <span>•</span>
                  <span className="font-mono text-zinc-400">
                    {currentFlowIndex + 1}/{carrosseis.length}
                  </span>
                  <span>•</span>
                  <button
                    onClick={() => { flowTarget.current = Math.min(carrosseis.length - 1, flowTarget.current + 1); }}
                    className="hover:text-white cursor-pointer px-2 py-0.5 rounded hover:bg-white/5 transition-all"
                  >
                    <span className="font-stretch font-bold text-zinc-400">PRÓXIMO</span> →
                  </button>
                </div>
              </footer>
            </div>
          )}

          {/* MODE B: ALL SLIDES UNITED SIDE-BY-SIDE WITH ZERO GAP */}
          {viewingCarousel && (
            <div className="relative flex-1 flex flex-col justify-between overflow-hidden animate-fadeIn">
              <div className="px-6 sm:px-10 py-3.5 border-b border-white/[0.08] bg-[#08080a]/90 backdrop-blur-md flex items-center justify-between z-20 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewingCarousel(null)}
                    className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Voltar ao Cover Flow (Esc)"
                  >
                    <span>←</span>
                    <span>Voltar ao Cover Flow</span>
                  </button>
                  <span className="text-white/30">|</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    {viewingCarousel.client}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide truncate max-w-[280px] sm:max-w-md">
                    {viewingCarousel.title}
                  </h3>
                  <span className="text-[11px] font-light text-white/50 hidden md:inline">
                    ({viewingCarousel.slideCount} SLIDES <span className="font-stretch font-bold text-white/80">CONTÍNUOS UNIDOS</span>)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProject(viewingCarousel)}
                    className="text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 font-medium"
                  >
                    <span className="font-light">Ficha Técnica</span>
                    <strong className="font-bold text-emerald-400">& Orçamento</strong>
                    <span>↗</span>
                  </button>

                  <button
                    onClick={() => setViewingCarousel(null)}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer ml-1"
                    title="Fechar (Esc)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div
                ref={ribbonRef}
                onWheel={handleRibbonWheel}
                className="flex-1 flex items-center overflow-x-auto overflow-y-hidden px-8 sm:px-14 py-6 cursor-grab active:cursor-grabbing no-scrollbar select-none"
              >
                <div className="flex items-center gap-0 p-0 overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-black backdrop-blur-md mx-auto">
                  {viewingCarousel.slides.map((slideImg, sIdx) => (
                    <div
                      key={sIdx}
                      onClick={() => {
                        setSelectedProject(viewingCarousel);
                        setCurrentSlideIndex(sIdx);
                      }}
                      className="relative group cursor-pointer flex-shrink-0 overflow-hidden"
                      style={{
                        height: 'min(68vh, 560px)',
                        aspectRatio: '4/5',
                      }}
                    >
                      <img
                        src={slideImg}
                        alt={`${viewingCarousel.title} - Slide ${sIdx + 1}`}
                        className="w-full h-full object-cover block select-none pointer-events-none"
                        loading="eager"
                      />

                      <div className="absolute top-3 left-3 text-[10px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-white/80 border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-0.5">
                        <span className="font-stretch font-bold text-white">{sIdx + 1}</span>
                        <span className="font-light text-white/40">/{viewingCarousel.slideCount}</span>
                      </div>

                      <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="text-[11px] bg-black/85 text-white px-3.5 py-1.5 rounded-full border border-white/20 shadow-2xl backdrop-blur-md font-medium">
                          <span className="font-light text-white/70">VER</span> <span className="font-stretch font-bold text-emerald-400 tracking-wider">AMPLIAR</span> ↗
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <footer className="px-6 py-2.5 border-t border-white/[0.08] bg-[#08080a]/80 backdrop-blur-md flex items-center justify-between text-xs text-zinc-400 flex-shrink-0 z-20">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="font-light tracking-wide text-zinc-400">
                    ARRASTE NA HORIZONTAL PARA VER TODAS AS LÂMINAS • PRESSIONE <span className="font-stretch font-bold text-white">ESC</span> OU CLIQUE EM VOLTAR PARA O <span className="font-stretch font-bold text-zinc-200 tracking-wider">COVER FLOW</span>
                  </span>
                </div>
                <button
                  onClick={() => setViewingCarousel(null)}
                  className="text-zinc-400 hover:text-white cursor-pointer text-[11px] font-medium"
                >
                  ← Voltar ao Cover Flow
                </button>
              </footer>
            </div>
          )}
        </div>
      )}

      {/* ESTÁTICOS TAB */}
      {activeTab === 'estaticos' && (
        <div className="relative flex-1 flex items-center justify-center overflow-hidden animate-fadeIn">
          <div
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
            style={{ perspective: '1350px' }}
          >
            <div
              className="absolute"
              style={{
                width: `${staticMetrics.cardW}px`,
                height: `${staticMetrics.cardH}px`,
                transformStyle: 'preserve-3d',
              }}
            >
              {estaticos.map((project, i) => (
                <div
                  key={project.id}
                  ref={(el) => { staticCardsRefs.current[i] = el; }}
                  className="absolute inset-0 cursor-pointer pointer-events-auto group"
                  onMouseDown={(e) => {
                    staticIsDragging.current = true;
                    staticDragStartY.current = e.clientY;
                    staticDragStartProgress.current = staticTargetProgress.current;
                    staticDragDist.current = 0;
                  }}
                  onClick={() => {
                    if (staticDragDist.current < 8) {
                      setSelectedProject(project);
                    }
                  }}
                  style={{
                    width: `${staticMetrics.cardW}px`,
                    height: `${staticMetrics.cardH}px`,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'visible',
                  }}
                >
                  {thicknessLayers.map((zOffset, layerIdx) => {
                    const isFrontFace = layerIdx === thicknessLayers.length - 1;
                    const isBackFace = layerIdx === 0;

                    if (!isFrontFace && !isBackFace) {
                      return (
                        <div
                          key={layerIdx}
                          className="absolute inset-0 rounded-[22px] border border-[#232328] pointer-events-none overflow-hidden"
                          style={{
                            backgroundColor: '#121215',
                            transform: `translateZ(${zOffset}px)`,
                          }}
                        />
                      );
                    }

                    if (isFrontFace) {
                      return (
                        <div
                          key={layerIdx}
                          className="absolute inset-0 rounded-[22px] border border-white/20 pointer-events-none overflow-hidden shadow-2xl"
                          style={{
                            backgroundColor: '#09090b',
                            transform: `translateZ(${zOffset}px)`,
                            backfaceVisibility: 'hidden',
                            boxShadow: 'inset 0 1px 1.5px rgba(255,255,255,0.25), 0 25px 50px -12px rgba(0,0,0,0.95)',
                          }}
                        >
                          <img
                            src={project.cover}
                            alt={project.title}
                            className="w-full h-full object-cover block filter contrast-[1.03]"
                            loading="lazy"
                          />

                          {/* Subtle hover indicator */}
                          <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="text-[11px] bg-black/85 text-white px-3.5 py-1.5 rounded-full border border-white/20 shadow-2xl backdrop-blur-md font-medium">
                              <span className="font-light text-white/70">VER</span> <span className="font-stretch font-bold text-emerald-400 tracking-wider">DETALHES</span> ↗
                            </span>
                          </div>
                        </div>
                      );
                    }

                    if (isBackFace) {
                      return (
                        <div
                          key={layerIdx}
                          className="absolute inset-0 rounded-[22px] border border-white/15 pointer-events-none overflow-hidden p-6 flex flex-col justify-between text-left"
                          style={{
                            backgroundColor: '#0c0c10',
                            transform: `translateZ(${zOffset}px) rotateX(180deg)`,
                            backfaceVisibility: 'hidden',
                            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15)',
                          }}
                        >
                          <div className="absolute inset-0 pointer-events-none" style={{ filter: 'blur(24px)', opacity: 0.35, transform: 'scale(1.2)' }}>
                            <img src={project.cover} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute inset-0 bg-black/65 pointer-events-none" />

                          <div className="relative z-10 flex flex-col gap-3">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                                FICHA TÉCNICA
                              </span>
                              <span className="text-[10px] font-mono text-white/50">Post de Feed</span>
                            </div>

                            <div>
                              <div className="text-[10px] font-semibold text-white/60">Cliente:</div>
                              <div className="text-sm font-bold text-white">{project.client}</div>
                            </div>

                            <div>
                              <div className="text-[10px] font-semibold text-white/60">Finalidade:</div>
                              <div className="text-xs text-white/90">{project.type}</div>
                            </div>

                            <div>
                              <div className="text-[10px] font-semibold text-white/60">Softwares:</div>
                              <div className="text-xs font-mono text-white/80">{project.software}</div>
                            </div>

                            <div>
                              <div className="text-[10px] font-semibold text-white/60 mb-1">Paleta de Cores:</div>
                              <div className="flex gap-1.5">
                                {project.colors.map((c, idx) => (
                                  <div
                                    key={idx}
                                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                                    style={{ backgroundColor: c }}
                                    title={c}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-white/50">CLIQUE PARA EXPANDIR</span>
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/80 text-xs">
                              ↗
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              ))}
            </div>
          </div>

          <footer className="absolute bottom-5 left-0 right-0 z-40 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <div className="flex items-center gap-2.5 bg-[#0e0e13]/90 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md shadow-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <p className="text-[11px] text-zinc-400 tracking-wide font-normal">
                ROLE OU ARRASTE NA VERTICAL • <span className="font-stretch font-bold text-emerald-400">{estaticos.length}</span> <span className="font-stretch font-bold text-zinc-200">PEÇAS</span> SELECIONADAS • FEED & SOCIAL
              </p>
            </div>
          </footer>
        </div>
      )}

      {/* IDENTIDADE VISUAL TAB */}
      {activeTab === 'identidade-visual' && (
        <div className="relative flex-1 flex flex-col overflow-hidden animate-fadeIn">
          {/* Main Horizontal Scroll Track for all 9 Visual Identities side-by-side */}
          <div
            ref={idVisualContainerRef}
            onWheel={handleIdVisualWheel}
            onMouseDown={handleMouseDownID}
            onMouseMove={handleMouseMoveID}
            onMouseUp={handleMouseUpID}
            onMouseLeave={handleMouseUpID}
            className="flex-1 flex items-center overflow-x-auto overflow-y-hidden px-8 sm:px-14 py-6 gap-10 sm:gap-14 cursor-grab active:cursor-grabbing no-scrollbar select-none"
          >
            {idVisual.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProject(item)}
                className="flex flex-col gap-3 flex-shrink-0 group cursor-pointer"
                style={{
                  width: 'clamp(320px, 26vw, 420px)',
                }}
              >
                {/* Header above card */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-1.5 truncate mr-2">
                    <span className="text-xs sm:text-sm font-black text-white tracking-wide whitespace-nowrap">
                      {item.title.split(' - ')[0]}
                    </span>
                    {item.title.includes(' - ') && (
                      <span className="text-[11px] text-zinc-400 font-medium tracking-wide truncate">
                        - {item.title.split(' - ')[1]}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(item);
                    }}
                    className="text-[11px] text-white/70 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 font-medium whitespace-nowrap flex-shrink-0"
                  >
                    <span className="font-light">Ver</span>
                    <strong className="font-bold text-emerald-400">Completa</strong>
                    <span>↗</span>
                  </button>
                </div>

                {/* Presentation Board with Subtle Scale on Hover */}
                <div
                  className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0d0d11] shadow-2xl transition-all duration-300 ease-out transform group-hover:scale-[1.03] group-hover:border-emerald-500/40 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(16,185,129,0.15)] flex flex-col"
                  style={{
                    height: 'min(68vh, 560px)',
                  }}
                >
                  <div className="w-full h-full overflow-hidden relative">
                    <img
                      src={item.presentationImage}
                      alt={item.title}
                      className="w-full h-full object-cover object-top block transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                      loading="lazy"
                    />

                    {/* Subtle center hover indicator */}
                    <div className="absolute inset-0 bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="text-[11px] bg-black/85 text-white px-3.5 py-1.5 rounded-full border border-white/20 shadow-2xl backdrop-blur-md font-medium">
                        <span className="font-light text-white/70">VER</span> <span className="font-stretch font-bold text-emerald-400 tracking-wider">COMPLETA</span> ↗
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-emerald-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>

                    <div className="absolute inset-0 bg-emerald-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <footer className="px-6 py-2.5 border-t border-white/[0.08] bg-[#08080a]/80 backdrop-blur-md flex items-center justify-between text-xs text-zinc-400 flex-shrink-0 z-20">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="font-light tracking-wide text-zinc-400">
                DIREÇÃO DE IDENTIDADE VISUAL • ARRASTE NA HORIZONTAL PARA VER TODAS AS <span className="font-stretch font-bold text-zinc-200 tracking-wider">MARCAS</span>
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-zinc-500 font-light text-[11px]">
              <span>← <span className="font-stretch font-bold text-zinc-400">ESQUERDA</span></span>
              <span>•</span>
              <span><span className="font-stretch font-bold text-zinc-400">DIREITA</span> →</span>
            </div>
          </footer>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[92vh] bg-[#0e0e12] border border-white/15 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
              title="Fechar (Esc)"
            >
              ✕
            </button>

            <div className="w-full md:w-3/5 bg-black/60 flex flex-col items-center justify-between p-4 sm:p-6 border-b md:border-b-0 md:border-r border-white/10 relative">
              <div className="relative w-full flex-1 flex items-center justify-center min-h-[300px] sm:min-h-[420px]">
                {selectedProject.isContinuousBoard ? (
                  <div className="w-full h-full max-h-[65vh] overflow-y-auto rounded-xl border border-white/10 shadow-2xl bg-black">
                    <img 
                      src={selectedProject.presentationImage || selectedProject.cover} 
                      alt={selectedProject.title}
                      className="w-full h-auto object-contain block"
                    />
                  </div>
                ) : (
                  selectedProject.slides && selectedProject.slides.length > 0 && (
                    <img 
                      src={selectedProject.slides[currentSlideIndex]} 
                      alt={`${selectedProject.title} - Slide ${currentSlideIndex + 1}`}
                      className="max-h-[55vh] md:max-h-[62vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
                    />
                  )
                )}

                {!selectedProject.isContinuousBoard && selectedProject.slides && selectedProject.slides.length > 1 && currentSlideIndex > 0 && (
                  <button
                    onClick={() => setCurrentSlideIndex(prev => prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                  >
                    ←
                  </button>
                )}

                {!selectedProject.isContinuousBoard && selectedProject.slides && selectedProject.slides.length > 1 && currentSlideIndex < selectedProject.slides.length - 1 && (
                  <button
                    onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                  >
                    →
                  </button>
                )}
              </div>

              {!selectedProject.isContinuousBoard && selectedProject.slides && selectedProject.slides.length > 1 && (
                <div className="w-full mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="text-[11px] font-mono text-white/60">
                    Slide {currentSlideIndex + 1} de {selectedProject.slides.length}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-[70%] py-1">
                    {selectedProject.slides.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`w-8 h-10 rounded-md overflow-hidden border transition-all cursor-pointer flex-shrink-0 ${
                          currentSlideIndex === idx 
                            ? 'border-white scale-105 shadow-md shadow-white/20' 
                            : 'border-white/20 opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img src={s} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      {selectedProject.category}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-[11px] font-mono text-white/60">
                      {selectedProject.type}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {selectedProject.title}
                  </h2>
                  <p className="text-xs text-white/60 font-mono mt-0.5">
                    {selectedProject.handle}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                  <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">
                    Objetivo & Estratégia:
                  </div>
                  <p className="text-xs text-white/85 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-white/80 border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Cliente Oficial:</span>
                    <span className="font-semibold text-white">{selectedProject.client}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Softwares:</span>
                    <span className="font-mono text-white/90">{selectedProject.software}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Volume de Peças:</span>
                    <span className="font-mono text-white/90">{selectedProject.slideCount} {selectedProject.slideCount > 1 ? 'artes' : 'arte'}</span>
                  </div>

                  <div>
                    <span className="text-white/50 block mb-1.5">Paleta de Cores:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedProject.colors.map((c, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-2 py-0.5 rounded-md">
                          <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                          <span className="text-[10px] font-mono text-white/70">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2.5 border-t border-white/10 mt-6">
                <a
                  href={getWhatsAppLink(selectedProject.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#f4f4f5] hover:bg-white text-zinc-950 text-xs sm:text-sm transition-all shadow-lg shadow-black/30 flex items-center justify-center gap-2.5 cursor-pointer border border-white/20 group"
                >
                  <svg className="w-4 h-4 text-[#25D366] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span className="font-semibold text-zinc-950">Solicitar Projeto no <strong className="font-extrabold text-black">WhatsApp</strong></span>
                  <span className="text-base group-hover:translate-x-0.5 transition-transform">↗</span>
                </a>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/60 hover:text-white text-xs font-medium transition-all cursor-pointer"
                >
                  Continuar Navegando
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
