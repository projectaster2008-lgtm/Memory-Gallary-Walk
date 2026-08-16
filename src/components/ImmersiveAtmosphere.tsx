import { useEffect, useRef } from 'react';
import { SongTrack } from '../utils/playlistEngine';

interface ImmersiveAtmosphereProps {
  track: SongTrack;
  isPlaying: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  alpha: number;
  alphaSpeed: number;
  swaySpeed: number;
  swayAngle: number;
}

export default function ImmersiveAtmosphere({
  track,
  isPlaying,
  className = '',
}: ImmersiveAtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameId = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize particles based on track theme
    const count = isPlaying ? 55 : 35;
    const hues = track.palette.particleHue;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: track.themeId === 'blossom' ? -(Math.random() * 0.5 + 0.2) : (Math.random() - 0.5) * 0.3,
        radius: Math.random() * (track.themeId === 'prismatic_colors' ? 4.5 : 3.5) + 1.2,
        hue: hues[Math.floor(Math.random() * hues.length)],
        alpha: Math.random() * 0.6 + 0.2,
        alphaSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        swaySpeed: Math.random() * 0.03 + 0.01,
        swayAngle: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;

    let tick = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.01;

      // Draw subtle dynamic gradient aura in the background
      const auraGrad = ctx.createRadialGradient(
        width * 0.5 + Math.sin(tick * 0.4) * (width * 0.2),
        height * 0.45 + Math.cos(tick * 0.3) * (height * 0.15),
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );

      if (track.themeId === 'blossom') {
        auraGrad.addColorStop(0, 'rgba(251, 113, 133, 0.12)');
        auraGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.05)');
        auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else if (track.themeId === 'nostalgia_forest') {
        auraGrad.addColorStop(0, 'rgba(16, 185, 129, 0.14)');
        auraGrad.addColorStop(0.5, 'rgba(5, 150, 105, 0.06)');
        auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        // True Colors dynamic rainbow aura
        const hueShift = (tick * 25) % 360;
        auraGrad.addColorStop(0, `hsla(${hueShift}, 85%, 65%, 0.15)`);
        auraGrad.addColorStop(0.5, `hsla(${(hueShift + 60) % 360}, 80%, 55%, 0.07)`);
        auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }

      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw particles
      particlesRef.current.forEach((p) => {
        p.swayAngle += p.swaySpeed;
        p.x += p.vx + Math.sin(p.swayAngle) * (track.themeId === 'blossom' ? 0.6 : 0.25);
        p.y += p.vy;

        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.75 || p.alpha < 0.15) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        // Screen wrap
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.beginPath();

        if (track.themeId === 'blossom') {
          // Petal oval shape
          ctx.ellipse(p.x, p.y, p.radius * 1.5, p.radius * 0.9, p.swayAngle, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.alpha * 0.8})`;
          ctx.shadowColor = `hsla(${p.hue}, 90%, 70%, 0.4)`;
          ctx.shadowBlur = 8;
        } else if (track.themeId === 'nostalgia_forest') {
          // Firefly glowing orb
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${p.alpha * 0.9})`;
          ctx.shadowColor = `hsla(${p.hue}, 90%, 60%, 0.6)`;
          ctx.shadowBlur = 12;
        } else {
          // True Colors chromatic star / prism
          const currentHue = (p.hue + tick * 20) % 360;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${currentHue}, 90%, 70%, ${p.alpha * 0.95})`;
          ctx.shadowColor = `hsla(${currentHue}, 95%, 65%, 0.7)`;
          ctx.shadowBlur = 14;
        }

        ctx.fill();
        ctx.restore();
      });

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [track.themeId, isPlaying]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none transition-colors duration-1000 overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(ellipse at top center, ${track.palette.glow} 0%, rgba(10, 10, 15, 0.95) 70%, #050508 100%)`,
      }}
    >
      {/* Dynamic Animated Ambient Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle Corner Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)] pointer-events-none" />
    </div>
  );
}
