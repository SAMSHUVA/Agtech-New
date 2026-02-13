import { useEffect, useState } from 'react';

const lineConfig = Array.from({ length: 18 }, (_, index) => ({
  x1: `${(index * 11) % 100}%`,
  y1: `${(index * 17) % 100}%`,
  x2: `${(index * 13 + 22) % 100}%`,
  y2: `${(index * 19 + 18) % 100}%`,
  delay: `${(index % 6) * 0.35}s`,
}));

const nodeConfig = Array.from({ length: 32 }, (_, index) => ({
  left: `${(index * 7.8) % 100}%`,
  top: `${(index * 12.4 + 9) % 100}%`,
  delay: `${(index % 8) * 0.28}s`,
}));

const AnimatedBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[#060A0F]" />

      <div className="absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(30,230,212,0.2),transparent_45%),radial-gradient(circle_at_78%_22%,rgba(201,255,46,0.22),transparent_40%),radial-gradient(circle_at_50%_88%,rgba(13,21,32,0.5),transparent_60%)]" />
      </div>

      <div className="absolute inset-0 opacity-[0.16] bg-[linear-gradient(rgba(30,230,212,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(201,255,46,0.22)_1px,transparent_1px)] bg-[size:110px_110px]" />

      <div
        className="absolute inset-[-10%]"
        style={{ transform: `translate3d(0, ${Math.min(220, scrollY * 0.08)}px, 0)` }}
      >
        <svg className="h-full w-full opacity-55" viewBox="0 0 1600 900" fill="none">
          <defs>
            <linearGradient id="circuit-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C9FF2E" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#1EE6D4" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          {lineConfig.map((line, idx) => (
            <line
              key={`line-${idx}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="url(#circuit-line)"
              strokeWidth="0.7"
              className="animate-circuit-pulse"
              style={{ animationDelay: line.delay }}
            />
          ))}
        </svg>
      </div>

      <div className="absolute inset-0">
        {nodeConfig.map((node, idx) => (
          <span
            key={`node-${idx}`}
            className="absolute h-1.5 w-1.5 rounded-full bg-agtech-lime/70 animate-node-float"
            style={{
              left: node.left,
              top: node.top,
              animationDelay: node.delay,
            }}
          />
        ))}
      </div>

      <div className="absolute -left-40 top-[18%] h-80 w-80 rounded-full bg-agtech-cyan/15 blur-3xl animate-bg-float-slow" />
      <div className="absolute -right-36 bottom-[12%] h-96 w-96 rounded-full bg-agtech-lime/12 blur-3xl animate-bg-float-slow [animation-delay:1.4s]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/70" />
    </div>
  );
};

export default AnimatedBackground;
