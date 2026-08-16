import { useEffect, useRef, useMemo } from 'react';
import { SongTrack } from '../utils/playlistEngine';

interface ImmersiveAtmosphereProps {
  track: SongTrack;
  isPlaying: boolean;
  className?: string;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hue: number;
}

interface AuroraRibbonParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  swaySpeed: number;
  swayAngle: number;
  swayDistance: number;
  type: 'aurora_ion' | 'cosmic_spark' | 'polar_dust';
}

export default function ImmersiveAtmosphere({
  track,
  isPlaying,
  className = '',
}: ImmersiveAtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameId = useRef<number | null>(null);
  const particlesRef = useRef<AuroraRibbonParticle[]>([]);
  const starsRef = useRef<Star[]>([]);

  // Distinctive Aurora Borealis color grading & cosmic universe lighting
  const auroraTheme = useMemo(() => {
    switch (track.themeId) {
      case 'blossom':
        return {
          // Rose & Emerald Polar Flare
          auroraCurtain1: 'linear-gradient(135deg, rgba(244,63,94,0.32) 0%, rgba(16,185,129,0.22) 50%, rgba(0,0,0,0) 80%)',
          auroraCurtain2: 'linear-gradient(225deg, rgba(251,113,133,0.26) 0%, rgba(6,182,212,0.18) 55%, rgba(0,0,0,0) 85%)',
          auroraRibbon3: 'linear-gradient(90deg, rgba(244,63,94,0.18) 0%, rgba(168,85,247,0.22) 50%, rgba(20,184,166,0.18) 100%)',
          polarGlow: 'rgba(244, 63, 94, 0.28)',
          skyGrad: 'from-[#07050f] via-[#0b0718] to-[#040810]',
          baseBg: '#05030a',
          vignette: 'rgba(2, 1, 6, 0.72)',
          colorGradeTint: 'rgba(244, 63, 94, 0.04)',
          auroraHues: [330, 350, 160, 180, 280],
        };
      case 'nostalgia_forest':
        return {
          // Classic Arctic Emerald & Cyan Northern Lights
          auroraCurtain1: 'linear-gradient(145deg, rgba(16,185,129,0.38) 0%, rgba(6,182,212,0.26) 45%, rgba(0,0,0,0) 80%)',
          auroraCurtain2: 'linear-gradient(215deg, rgba(5,150,105,0.30) 0%, rgba(14,165,233,0.22) 55%, rgba(0,0,0,0) 85%)',
          auroraRibbon3: 'linear-gradient(90deg, rgba(16,185,129,0.25) 0%, rgba(52,211,153,0.32) 40%, rgba(6,182,212,0.28) 100%)',
          polarGlow: 'rgba(16, 185, 129, 0.32)',
          skyGrad: 'from-[#03090e] via-[#041417] to-[#020b08]',
          baseBg: '#02070a',
          vignette: 'rgba(1, 4, 6, 0.72)',
          colorGradeTint: 'rgba(16, 185, 129, 0.05)',
          auroraHues: [145, 165, 180, 195, 130],
        };
      case 'prismatic_colors':
      default:
        return {
          // Celestial Magnetosphere: Violet, Electric Cyan, Neon Magenta & Emerald
          auroraCurtain1: 'linear-gradient(135deg, rgba(139,92,246,0.36) 0%, rgba(6,182,212,0.30) 50%, rgba(0,0,0,0) 80%)',
          auroraCurtain2: 'linear-gradient(225deg, rgba(236,72,153,0.28) 0%, rgba(59,130,246,0.24) 55%, rgba(0,0,0,0) 85%)',
          auroraRibbon3: 'linear-gradient(90deg, rgba(139,92,246,0.26) 0%, rgba(6,182,212,0.30) 45%, rgba(244,63,94,0.22) 100%)',
          polarGlow: 'rgba(6, 182, 212, 0.35)',
          skyGrad: 'from-[#060414] via-[#090620] to-[#030914]',
          baseBg: '#04030f',
          vignette: 'rgba(2, 1, 8, 0.72)',
          colorGradeTint: 'rgba(139, 92, 246, 0.05)',
          auroraHues: [270, 190, 310, 160, 220],
        };
    }
  }, [track.themeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isMobile = window.innerWidth < 768;

    // 1. Pre-generate deep universe star field
    const starCount = isMobile ? 45 : 85;
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.5,
        baseAlpha: Math.random() * 0.55 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        hue: auroraTheme.auroraHues[Math.floor(Math.random() * auroraTheme.auroraHues.length)],
      });
    }
    starsRef.current = stars;

    // 2. Pre-generate Aurora Ionized particles & cosmic solar wind sparks
    const particleCount = isMobile ? (isPlaying ? 28 : 18) : (isPlaying ? 52 : 36);
    const particles: AuroraRibbonParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const typeRand = Math.random();
      const type: AuroraRibbonParticle['type'] = 
        typeRand < 0.55 ? 'aurora_ion' : typeRand < 0.85 ? 'polar_dust' : 'cosmic_spark';

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: -(Math.random() * 0.35 + 0.08), // Gentle upward atmospheric convection
        radius: type === 'aurora_ion'
          ? Math.random() * 2.6 + 1.8
          : type === 'cosmic_spark'
            ? Math.random() * 2.2 + 1.2
            : Math.random() * 1.5 + 0.6,
        hue: auroraTheme.auroraHues[Math.floor(Math.random() * auroraTheme.auroraHues.length)],
        baseAlpha: type === 'aurora_ion' ? Math.random() * 0.45 + 0.3 : Math.random() * 0.6 + 0.3,
        alpha: 0.35,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.015 + 0.005,
        swayAngle: Math.random() * Math.PI * 2,
        swayDistance: Math.random() * 0.8 + 0.3,
        type,
      });
    }
    particlesRef.current = particles;

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.01;

      // Draw Starfield
      const allStars = starsRef.current;
      const sLen = allStars.length;
      for (let i = 0; i < sLen; i++) {
        const s = allStars[i];
        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = s.baseAlpha + Math.sin(s.twinklePhase) * (s.baseAlpha * 0.45);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 88%, ${Math.max(0.05, currentAlpha)})`;
        ctx.fill();
      }

      // Draw Aurora Wave Ribbon across the top-middle stratosphere
      const ribbonY = height * 0.32 + Math.sin(tick * 0.6) * 30;
      const ribbonAmp = 45;
      const ribbonSegments = 8;
      const segmentWidth = width / ribbonSegments;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, ribbonY);
      for (let i = 0; i <= ribbonSegments; i++) {
        const x = i * segmentWidth;
        const y = ribbonY + Math.sin(tick * 0.8 + i * 0.8) * ribbonAmp + Math.cos(tick * 0.4 + i * 0.5) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();

      const auroraGrad = ctx.createLinearGradient(0, ribbonY - 120, 0, ribbonY + 60);
      const mainHue = auroraTheme.auroraHues[0];
      const secondHue = auroraTheme.auroraHues[1] || mainHue;
      auroraGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      auroraGrad.addColorStop(0.4, `hsla(${mainHue}, 85%, 65%, ${isPlaying ? 0.07 : 0.04})`);
      auroraGrad.addColorStop(0.7, `hsla(${secondHue}, 90%, 60%, ${isPlaying ? 0.09 : 0.05})`);
      auroraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auroraGrad;
      ctx.fill();
      ctx.restore();

      // Draw Ambient Aurora Ionized Particles
      const pts = particlesRef.current;
      const pLen = pts.length;

      for (let i = 0; i < pLen; i++) {
        const p = pts[i];
        p.swayAngle += p.swaySpeed;
        p.pulsePhase += p.pulseSpeed;

        p.x += p.vx + Math.sin(p.swayAngle) * p.swayDistance;
        p.y += p.vy;

        p.alpha = p.baseAlpha + Math.sin(p.pulsePhase) * (p.baseAlpha * 0.4);

        // Continuous wrap around boundaries
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.beginPath();

        if (p.type === 'aurora_ion') {
          // Luminous elongated ion ribbon particle
          ctx.ellipse(
            p.x,
            p.y,
            p.radius * 1.8,
            p.radius * 0.85,
            p.swayAngle * 0.4,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `hsla(${p.hue}, 92%, 75%, ${p.alpha})`;
          ctx.fill();

          // Soft core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 95%, 90%, ${p.alpha * 0.9})`;
        } else if (p.type === 'cosmic_spark') {
          // Brilliant polar flare spark
          ctx.arc(p.x, p.y, p.radius * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 88%, 70%, ${p.alpha * 0.5})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(180, 100%, 95%, ${p.alpha})`;
        } else {
          // Delicate ambient cosmic dust
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 85%, 72%, ${p.alpha * 0.75})`;
        }

        ctx.fill();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [track.themeId, isPlaying, auroraTheme]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden transition-colors duration-1000 ${className}`}
      style={{ backgroundColor: auroraTheme.baseBg }}
    >
      {/* 1. Deep Space Night Sky Base Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${auroraTheme.skyGrad} opacity-90 transition-all duration-1000 pointer-events-none`}
      />

      {/* 2. Primary Aurora Borealis Flowing Curtain 1 (Top Left to Center) */}
      <div
        className="absolute -top-[25%] -left-[15%] w-[85vw] h-[80vw] max-w-[1100px] max-h-[1000px] rounded-full blur-[110px] pointer-events-none transition-all duration-1000 opacity-65 mix-blend-screen"
        style={{
          background: auroraTheme.auroraCurtain1,
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* 3. Secondary Aurora Borealis Flowing Curtain 2 (Top Right to Center) */}
      <div
        className="absolute -top-[15%] -right-[15%] w-[80vw] h-[75vw] max-w-[1050px] max-h-[950px] rounded-full blur-[125px] pointer-events-none transition-all duration-1000 opacity-60 mix-blend-screen"
        style={{
          background: auroraTheme.auroraCurtain2,
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* 4. Undulating Aurora Horizon Ribbon (Equatorial Belt) */}
      <div
        className="absolute top-[28%] left-[5%] w-[90vw] h-[45vw] max-w-[1200px] max-h-[600px] rounded-full blur-[130px] pointer-events-none transition-all duration-1000 opacity-45 mix-blend-screen"
        style={{
          background: auroraTheme.auroraRibbon3,
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* 5. Bottom Deep Polar Glow Halo */}
      <div
        className="absolute -bottom-[20%] left-[20%] w-[65vw] h-[55vw] max-w-[800px] max-h-[700px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 opacity-35 mix-blend-screen"
        style={{
          background: `radial-gradient(circle, ${auroraTheme.polarGlow} 0%, rgba(0,0,0,0) 75%)`,
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* 6. Dynamic Starfield & Aurora Ion Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 7. Nordic Aurora Color Grading Tint Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000 mix-blend-color"
        style={{ backgroundColor: auroraTheme.colorGradeTint }}
      />

      {/* 8. Cinematic Universe Polar Vignette */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at center, transparent 35%, ${auroraTheme.vignette} 100%)`,
        }}
      />
    </div>
  );
}
