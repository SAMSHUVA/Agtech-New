import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Calendar, IndianRupee, MessageCircle, TrendingUp, Users, type LucideIcon } from 'lucide-react';

import AnimatedNumber from '@/components/animations/AnimatedNumber';
import { useInViewOnce } from '@/hooks/useInViewOnce';

const circuitLines = Array.from({ length: 16 }, (_, i) => ({
  x1: `${8 + ((i * 11) % 84)}%`,
  y1: `${12 + ((i * 17) % 70)}%`,
  x2: `${16 + ((i * 13) % 78)}%`,
  y2: `${20 + ((i * 19) % 64)}%`,
  delay: `${(i % 6) * 0.25}s`,
}));

const circuitNodes = Array.from({ length: 40 }, (_, i) => ({
  x: `${6 + ((i * 9.4) % 88)}%`,
  y: `${10 + ((i * 14.2) % 80)}%`,
  delay: `${(i % 8) * 0.22}s`,
}));

const heroParticles = Array.from({ length: 56 }, (_, i) => ({
  x: `${4 + ((i * 7.7) % 92)}%`,
  y: `${8 + ((i * 12.6) % 84)}%`,
  r: i % 5 === 0 ? 4.2 : i % 2 === 0 ? 3.1 : 2.3,
  delay: `${(i % 10) * 0.2}s`,
  duration: `${2.6 + (i % 4) * 0.7}s`,
}));

type NumericTrustIndicator = {
  icon: LucideIcon;
  number: number;
  label: string;
  color: string;
  prefix?: string;
  suffix?: string;
  grouping?: boolean;
  startDelayMs: number;
};

type TextTrustIndicator = {
  icon: LucideIcon;
  label: string;
  color: string;
};

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { ref: metricsRef, hasEntered: playHeroNumbers } = useInViewOnce<HTMLDivElement>({ threshold: 0.35 });

  useEffect(() => {
    const eventDate = new Date('2026-11-21T09:00:00');
    const updateCountdown = () => {
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 14,
        y: (e.clientY / window.innerHeight - 0.5) * 12,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDesktop]);

  const trustIndicators: Array<NumericTrustIndicator | TextTrustIndicator> = [
    {
      icon: Users,
      number: 100,
      suffix: '+',
      label: 'Physical Attendees Expected',
      color: 'from-emerald-400 to-green-500',
      startDelayMs: 940,
    },
    {
      icon: TrendingUp,
      number: 300,
      suffix: '+',
      label: 'Virtual Participants',
      color: 'from-blue-400 to-cyan-500',
      startDelayMs: 1060,
    },
    { icon: Calendar, label: 'Hybrid Format Guaranteed', color: 'from-purple-400 to-pink-500' },
    {
      icon: IndianRupee,
      number: 25000,
      prefix: 'Rs.',
      suffix: 'Cr+',
      grouping: true,
      label: 'AgTech Market',
      color: 'from-amber-400 to-orange-500',
      startDelayMs: 1180,
    },
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden bg-transparent" id="hero">
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          transform: `translateY(${Math.min(140, scrollY * (isDesktop ? 0.16 : 0.08))}px)`,
          opacity: Math.max(0.55, 1 - scrollY / 1300),
        }}
      >
        <img src="/hero_farmland_new.jpg" alt="Farmland" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-agtech-black/45 via-transparent to-agtech-black" />
      </div>

      <div
        className="absolute inset-0 h-full w-full transition-opacity duration-1000"
        style={{
          opacity: Math.min(0.88, 0.34 + scrollY / 1200),
          transform: `translateY(${Math.min(120, scrollY * 0.1)}px)`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(200,255,61,0.26),transparent_40%),radial-gradient(circle_at_80%_28%,rgba(46,151,93,0.2),transparent_48%)]" />

        <svg
          className="absolute inset-0 h-full w-full"
          style={{ transform: isDesktop ? `translate(${mousePos.x * 0.45}px, ${mousePos.y * 0.45}px)` : undefined }}
        >
          <defs>
            <linearGradient id="heroCircuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d2ff5c" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#1f7a4e" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {circuitLines.map((line, i) => (
            <line
              key={`hero-line-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="url(#heroCircuitGradient)"
              strokeWidth="0.75"
              strokeLinecap="round"
              className="animate-circuit-pulse"
              style={{ animationDelay: line.delay }}
            />
          ))}
          {circuitNodes.map((node, i) => (
            <circle
              key={`hero-node-${i}`}
              cx={node.x}
              cy={node.y}
              r={i % 3 === 0 ? 3.1 : 2.2}
              fill="#C9FF2E"
              className="animate-node-float"
              style={{ animationDelay: node.delay }}
            />
          ))}
        </svg>

        <svg className="absolute inset-0 h-full w-full">
          {heroParticles.map((p, i) => (
            <circle
              key={`hero-particle-${i}`}
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill="#C9FF2E"
              opacity={0.92}
              className="animate-particle-flow"
              style={{ animationDelay: p.delay, animationDuration: p.duration }}
            />
          ))}
          {heroParticles.slice(0, 28).map((p, i) => (
            <line
              key={`hero-link-${i}`}
              x1={p.x}
              y1={p.y}
              x2={heroParticles[(i + 5) % heroParticles.length].x}
              y2={heroParticles[(i + 5) % heroParticles.length].y}
              stroke="rgba(204,255,79,0.38)"
              strokeWidth="0.7"
              className="animate-circuit-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </svg>

        <div className="absolute inset-0 bg-gradient-to-b from-agtech-black/58 via-agtech-black/28 to-agtech-black" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/30" />

      <div className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-14 pt-28 pb-36 sm:pb-28">
        <div className="absolute top-24 right-4 sm:right-8 xl:right-14 hidden xl:block">
          <div className="bg-agtech-black/60 backdrop-blur-md border border-agtech-lime/30 rounded-xl p-4">
            <p className="label-mono text-agtech-lime text-xs mb-2 text-center">EVENT STARTS IN</p>
            <div className="flex gap-2">
              {[
                { value: countdown.days, label: 'DAYS' },
                { value: countdown.hours, label: 'HRS' },
                { value: countdown.minutes, label: 'MIN' },
                { value: countdown.seconds, label: 'SEC' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="bg-agtech-lime/20 rounded-lg px-2 py-1 min-w-[40px]">
                    <span className="font-display font-bold text-agtech-lime text-lg">
                      {String(item.value).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[8px] text-agtech-sage mt-1 block">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={metricsRef}
          className="max-w-4xl mx-auto text-center"
          style={{ transform: isDesktop ? `translateY(${-scrollY * 0.06}px)` : undefined }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-agtech-lime/10 border border-agtech-lime/30 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-agtech-lime rounded-full animate-pulse" />
            <span className="label-mono text-agtech-lime text-xs">BENGALURU - NOV 21-22, 2026</span>
          </div>

          <h1 className="font-display font-black text-[clamp(2.05rem,6.3vw,5.5rem)] text-white mb-4 leading-[0.94] tracking-tight">
            <span className="block overflow-hidden md:whitespace-nowrap">
              <span className="inline-block animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Where{' '}
              </span>
              <span className="inline-block text-agtech-lime animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <AnimatedNumber
                  value={150}
                  suffix=" Million"
                  play={playHeroNumbers}
                  durationMs={1500}
                  startDelayMs={140}
                  className="align-baseline"
                />
              </span>
            </span>
            <span className="block overflow-hidden md:whitespace-nowrap">
              <span className="inline-block animate-slide-up" style={{ animationDelay: '0.3s' }}>
                Farmers Meet
              </span>
            </span>
            <span className="block overflow-hidden md:whitespace-nowrap">
              <span className="inline-block text-agtech-lime animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <AnimatedNumber
                  value={50000}
                  play={playHeroNumbers}
                  durationMs={1650}
                  startDelayMs={290}
                  className="align-baseline"
                />
              </span>
              <span className="inline-block animate-slide-up" style={{ animationDelay: '0.5s' }}>
                {' '}Innovations
              </span>
            </span>
          </h1>

          <p className="text-agtech-sage text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            India's First Outcome-Focused AgTech Platform | Nov 21-22, 2026 | ITC Gardenia, Bangalore
          </p>

          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-center mb-11 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <a
              href="#register"
              className="group relative px-8 py-4 bg-agtech-lime text-agtech-black font-display font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,255,46,0.5)] hover:scale-105 w-full md:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Register Now - Early Bird{' '}
                <AnimatedNumber
                  value={15000}
                  prefix="Rs."
                  play={playHeroNumbers}
                  durationMs={1200}
                  startDelayMs={760}
                  className="align-baseline"
                />
                <span className="w-2 h-2 bg-agtech-black rounded-full animate-pulse" />
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </a>
            <a
              href="#submissions"
              className="px-8 py-4 border-2 border-agtech-lime text-agtech-lime font-display font-bold rounded-full transition-all duration-300 hover:bg-agtech-lime hover:text-agtech-black w-full md:w-auto"
            >
              Submit Your Research
            </a>
            <a
              href="#"
              className="px-8 py-4 border border-agtech-white/30 text-agtech-white font-display font-bold rounded-full transition-all duration-300 hover:border-agtech-white hover:bg-agtech-white/10 flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              Download Prospectus
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.8s' }}>
            {trustIndicators.map((item, i) => (
              <div
                key={i}
                className="group relative p-4 bg-agtech-black/40 backdrop-blur-sm border border-agtech-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-agtech-lime/50 hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <item.icon className="w-6 h-6 text-agtech-lime mb-2 mx-auto" />
                {'number' in item ? (
                  <p className="text-agtech-white text-[11px] sm:text-sm font-medium">
                    <AnimatedNumber
                      value={item.number}
                      play={playHeroNumbers}
                      prefix={item.prefix}
                      suffix={item.suffix}
                      grouping={item.grouping}
                      startDelayMs={item.startDelayMs}
                      durationMs={1300}
                      className="text-agtech-lime"
                    />{' '}
                    {item.label}
                  </p>
                ) : (
                  <p className="text-agtech-white text-[11px] sm:text-sm font-medium">{item.label}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 inset-x-0 z-20 flex justify-center">
        <a href="#crisis" className="flex flex-col items-center gap-1.5 animate-scroll-cue" aria-label="Scroll to explore">
          <span className="label-mono text-agtech-sage text-xs">SCROLL TO EXPLORE</span>
          <ArrowDown className="w-5 h-5 text-agtech-lime" />
        </a>
      </div>

      <a
        href="https://wa.me/918610100624"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30" />
          <div className="relative w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
            1
          </span>
        </div>
      </a>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes particle-twinkle {
          0%, 100% {
            opacity: 0.35;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-4px);
          }
        }
        @keyframes particle-orbit {
          0% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(8px, -4px);
          }
          50% {
            transform: translate(0px, -8px);
          }
          75% {
            transform: translate(-8px, -4px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-particle-flow {
          animation: particle-twinkle 3.2s ease-in-out infinite, particle-orbit 6.8s linear infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
