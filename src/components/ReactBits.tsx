import React, { useState, useEffect, useRef } from 'react';

export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  reducedMotion?: boolean;
  onClick?: () => void;
}

/**
 * React Bits-inspired SpotlightCard
 * Reference: https://reactbits.dev/components/spotlight-card
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(16, 185, 129, 0.16)',
  reducedMotion = false,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !reducedMotion && setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${className}`}
    >
      {!reducedMotion && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(450px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 45%)`,
          }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

/**
 * React Bits-inspired ShinyText
 * Reference: https://reactbits.dev/text-animations/shiny-text
 */
export const ShinyText: React.FC<{
  text: string;
  className?: string;
  reducedMotion?: boolean;
}> = ({ text, className = '', reducedMotion = false }) => {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-violet-400 ${
        reducedMotion ? '' : 'animate-pulse'
      } ${className}`}
    >
      {text}
    </span>
  );
};

/**
 * React Bits-inspired Tech / Decrypted Text reveal
 */
export const DecryptedText: React.FC<{
  text: string;
  className?: string;
  reducedMotion?: boolean;
}> = ({ text, className = '', reducedMotion = false }) => {
  const [display, setDisplay] = useState(text);
  const glyphs = '01<>[]{}/\\*=+-_#λΣΩπ';

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }
    let iteration = 0;
    const interval = window.setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' ';
            if (idx < iteration) return text[idx];
            return glyphs[(idx + Math.floor(iteration * 3)) % glyphs.length];
          })
          .join('')
      );
      iteration += 1.5;
      if (iteration >= text.length) {
        setDisplay(text);
        window.clearInterval(interval);
      }
    }, 28);
    return () => window.clearInterval(interval);
  }, [text, reducedMotion]);

  return <span className={className}>{display}</span>;
};

/**
 * React Bits-inspired TiltedCard with subtle 3D perspective on hover
 * Reference: https://reactbits.dev/components/tilted-card
 */
export const TiltedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  reducedMotion?: boolean;
}> = ({ children, className = '', reducedMotion = false }) => {
  const [transform, setTransform] = useState('perspective(900px) rotateX(0deg) rotateY(0deg)');

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`
    );
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTransform('perspective(900px) rotateX(0deg) rotateY(0deg)')}
      style={{ transform: reducedMotion ? undefined : transform, transition: 'transform 180ms ease-out' }}
      className={className}
    >
      {children}
    </div>
  );
};

/**
 * Subtle developer grid & node background (disabled inside coding workspace for zero distraction)
 */
export const AnimatedGridBackground: React.FC<{
  darkMode: boolean;
  reducedMotion: boolean;
}> = ({ darkMode, reducedMotion }) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className={`absolute inset-0 ${
          darkMode
            ? 'bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.09),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.08),_transparent_50%)]'
            : 'bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.07),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(59,130,246,0.06),_transparent_50%)]'
        }`}
      />
      <div
        className={`absolute inset-0 opacity-25 ${
          reducedMotion ? '' : 'transition-opacity duration-700'
        }`}
        style={{
          backgroundImage: darkMode
            ? 'linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(71,85,105,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(71,85,105,0.07) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
    </div>
  );
};
