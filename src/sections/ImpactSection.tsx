import { useEffect, useRef, useState } from 'react';
import { Target, Zap, TrendingUp, Users, Sprout, CheckCircle } from 'lucide-react';

const ImpactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    partnerships: 0,
    pilots: 0,
    funding: 0,
    jobs: 0,
    farmers: 0,
  });

  const targetStats = {
    partnerships: 20,
    pilots: 10,
    funding: 5,
    jobs: 50,
    farmers: 1000,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate stats when visible
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        partnerships: Math.round(targetStats.partnerships * easeOut),
        pilots: Math.round(targetStats.pilots * easeOut),
        funding: Math.round(targetStats.funding * easeOut),
        jobs: Math.round(targetStats.jobs * easeOut),
        farmers: Math.round(targetStats.farmers * easeOut),
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  const outcomes = [
    { icon: Target, label: 'Partnerships Formed', value: animatedStats.partnerships, target: targetStats.partnerships, suffix: '+' },
    { icon: Zap, label: 'Technology Pilots', value: animatedStats.pilots, target: targetStats.pilots, suffix: '+' },
    { icon: TrendingUp, label: 'Funding Deals', value: animatedStats.funding, target: targetStats.funding, suffix: '+' },
    { icon: Users, label: 'Jobs Created', value: animatedStats.jobs, target: targetStats.jobs, suffix: '+' },
    { icon: Sprout, label: 'Farmers Impacted', value: animatedStats.farmers, target: targetStats.farmers, suffix: '+' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-transparent py-20 overflow-hidden"
      id="impact"
    >
      {/* Background Map */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <img
          src="/india_agtech_map.jpg"
          alt="India AgTech Map"
          className={`w-full max-w-5xl transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />
      </div>

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(201, 255, 46, 0.1)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="label-mono text-agtech-lime text-sm tracking-widest mb-4 block">
            MEASURABLE OUTCOMES
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
            We Measure <span className="text-agtech-lime">What Matters</span>
          </h2>
          <p className="text-agtech-sage text-lg max-w-2xl mx-auto">
            Unlike other conferences, we set clear targets and publish our results. Transparency is our commitment.
          </p>
        </div>

        {/* Main Dashboard */}
        <div
          className={`grid lg:grid-cols-2 gap-8 mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          {/* Left - Main Stat */}
          <div className="bg-gradient-to-br from-agtech-lime/18 to-agtech-cyan/24 border border-agtech-lime/30 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-agtech-lime/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-agtech-lime" />
              </div>
              <span className="label-mono text-agtech-lime text-sm">PRIMARY TARGET</span>
            </div>
            <p className="font-display font-black text-5xl sm:text-6xl text-agtech-lime mb-2">
              â‚¹43L
            </p>
            <p className="text-agtech-white text-lg mb-4">Profit Target for Organizers</p>
            <div className="p-4 bg-agtech-black/40 rounded-xl">
              <p className="text-agtech-sage text-sm">
                <span className="text-agtech-lime font-bold">100% Reinvested</span> in farmer programs, 
                community building, and next year's summit improvements.
              </p>
            </div>
          </div>

          {/* Right - Outcomes Grid */}
          <div className="grid grid-cols-2 gap-4">
            {outcomes.map((outcome, i) => (
              <div
                key={i}
                className={`bg-agtech-green/10 border border-agtech-white/10 rounded-2xl p-6 transition-all duration-500 hover:border-agtech-lime/30 hover:bg-agtech-green/20 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
              >
                <outcome.icon className="w-6 h-6 text-agtech-lime mb-3" />
                <p className="label-mono text-agtech-sage text-xs mb-1">TARGET</p>
                <p className="font-display font-black text-3xl text-white mb-1">
                  {outcome.value}{outcome.suffix}
                </p>
                <p className="text-agtech-sage text-sm">{outcome.label}</p>
                {/* Progress Bar */}
                <div className="mt-3 h-1.5 bg-agtech-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-agtech-lime to-agtech-cyan rounded-full transition-all duration-1000"
                    style={{ width: isVisible ? `${(outcome.value / outcome.target) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commitment Statement */}
        <div
          className={`bg-gradient-to-r from-red-500/10 via-agtech-black to-agtech-cyan/10 border border-agtech-white/10 rounded-3xl p-8 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.8s' }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-agtech-lime" />
            <span className="label-mono text-agtech-lime text-sm">OUR COMMITMENT</span>
          </div>
          <p className="text-white text-xl sm:text-2xl max-w-3xl mx-auto mb-6">
            "If we don't achieve <span className="text-agtech-lime font-bold">70%</span> of these targets, 
            we'll publish a post-mortem and offer{' '}
            <span className="text-agtech-lime font-bold">50% refund</span> on next event registration."
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-agtech-green/20 rounded-full">
              <div className="w-2 h-2 bg-agtech-lime rounded-full animate-pulse" />
              <span className="text-agtech-sage text-sm">Full Transparency</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-agtech-green/20 rounded-full">
              <div className="w-2 h-2 bg-agtech-lime rounded-full animate-pulse" />
              <span className="text-agtech-sage text-sm">Public Post-Mortem</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-agtech-green/20 rounded-full">
              <div className="w-2 h-2 bg-agtech-lime rounded-full animate-pulse" />
              <span className="text-agtech-sage text-sm">50% Refund Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;

