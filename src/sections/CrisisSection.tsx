import { ArrowRight, Cpu, Sprout, TrendingUp, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const CrisisSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalScrollable = sectionRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;
      const nextProgress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      setProgress(nextProgress);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const leftShift = 1 + progress * 11;
  const rightShift = 1 + progress * 11;
  const centerGlow = 0.2 + progress * 0.7;

  const leftStats = [
    { icon: Users, label: 'FARMERS', value: '150 Million', subtext: 'Struggling with legacy tools' },
    { icon: Sprout, label: 'PRODUCTIVITY', value: '2 tons/ha', subtext: 'Current average yield' },
  ];

  const rightStats = [
    { icon: Cpu, label: 'STARTUPS', value: '50,000+', subtext: 'Armed with AI, IoT, and data' },
    { icon: TrendingUp, label: 'POTENTIAL', value: '10x yields', subtext: 'Solutions ready to deploy' },
  ];

  return (
    <section
      ref={sectionRef}
      id="crisis"
      className="relative h-[110vh] sm:h-[114vh] lg:h-[117vh] bg-transparent overflow-hidden"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-agtech-black" />

        <div className="absolute inset-0 flex">
          <div
            className="relative h-full w-1/2 overflow-hidden transition-transform duration-300"
            style={{ transform: `translateX(-${leftShift}%)` }}
          >
            <img
              src="/farmer_bw.jpg"
              alt="Farmer side"
              className="h-full w-full object-cover object-center"
              style={{ filter: `grayscale(${95 - progress * 20}%)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-agtech-black/85 via-agtech-black/35 to-transparent" />
          </div>

          <div
            className="relative h-full w-1/2 overflow-hidden transition-transform duration-300"
            style={{ transform: `translateX(${rightShift}%)` }}
          >
            <img
              src="/tech_office.jpg"
              alt="Startup side"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-agtech-black/85 via-agtech-black/35 to-transparent" />
          </div>
        </div>

        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-agtech-lime/20" />
        <div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 blur-xl bg-agtech-lime/30 transition-opacity duration-300"
          style={{ opacity: centerGlow }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/70" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-3 sm:px-6">
          <div className="text-center mb-4 sm:mb-6">
            <span className="label-mono text-red-400 text-xs sm:text-sm tracking-widest">THE DISCONNECT</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            <div className="space-y-3 sm:space-y-5">
              {leftStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-agtech-white/10 bg-agtech-black/65 backdrop-blur-md p-3 sm:p-5"
                  style={{
                    transform: `translateY(${(0.5 - progress) * (i === 0 ? 14 : 8)}px)`,
                  }}
                >
                  <div className="mb-1.5 flex items-center justify-end gap-2">
                    <stat.icon className="h-4 w-4 text-agtech-sage" />
                    <span className="label-mono text-[10px] sm:text-xs text-agtech-sage">{stat.label}</span>
                  </div>
                  <p className="font-display text-right font-black text-agtech-white text-3xl sm:text-5xl leading-none">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-right text-agtech-sage text-sm sm:text-base">{stat.subtext}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 sm:space-y-5">
              {rightStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-agtech-lime/25 bg-agtech-green/25 backdrop-blur-md p-3 sm:p-5"
                  style={{
                    transform: `translateY(${(progress - 0.5) * (i === 0 ? 14 : 8)}px)`,
                  }}
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <stat.icon className="h-4 w-4 text-agtech-lime" />
                    <span className="label-mono text-[10px] sm:text-xs text-agtech-sage">{stat.label}</span>
                  </div>
                  <p className="font-display font-black text-agtech-lime text-3xl sm:text-5xl leading-none">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-agtech-sage text-sm sm:text-base">{stat.subtext}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 sm:mt-8 mx-auto w-full max-w-4xl rounded-3xl border border-agtech-white/10 bg-agtech-black/80 p-4 sm:p-7 text-center backdrop-blur-md">
            <p className="text-agtech-sage text-base sm:text-2xl">
              <span className="text-red-400 font-bold">THE PROBLEM:</span> They&apos;ve never met.
            </p>
            <p className="mt-1.5 font-display font-black text-agtech-lime text-3xl sm:text-5xl">
              THE SOLUTION: AgTech Summit 2026
            </p>

            <div className="mx-auto mt-4 h-1 rounded-full bg-agtech-white/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-agtech-lime to-green-500 transition-all duration-300"
                style={{ width: `${Math.max(8, progress * 100)}%` }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] sm:text-base">
              <span className="text-agtech-sage">Farmer Income: Rs.10,000/month</span>
              <span className="text-agtech-lime">AgTech Funding: Rs.25,000+ Crores</span>
            </div>
          </div>

          <div className="mt-5 text-center">
            <a
              href="#differentiators"
              className="group inline-flex items-center gap-2 rounded-full border border-agtech-lime/35 bg-agtech-lime/10 px-6 py-3 text-agtech-lime transition-all duration-300 hover:bg-agtech-lime hover:text-agtech-black"
            >
              <span className="font-display font-bold">See Transformation Stories</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrisisSection;
