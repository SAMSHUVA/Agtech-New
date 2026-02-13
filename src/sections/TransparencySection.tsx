import { useEffect, useRef, useState } from 'react';
import { X, Check, Download, AlertTriangle, Shield } from 'lucide-react';

const TransparencySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const comparisonData = [
    {
      aspect: 'Acceptance Rate',
      them: '90-95% (everyone pays)',
      themBad: true,
      us: '30-40% (quality control)',
      usGood: true,
    },
    {
      aspect: 'Review Timeline',
      them: '24-48 hours (fake)',
      themBad: true,
      us: '2-4 weeks (real peer review)',
      usGood: true,
    },
    {
      aspect: 'Venue Promise',
      them: '"Physical" → Online switch',
      themBad: true,
      us: 'Confirmed ITC Gardenia booking',
      usGood: true,
    },
    {
      aspect: 'Speaker Quality',
      them: 'Generic/Unknown',
      themBad: true,
      us: 'Industry leaders (named)',
      usGood: true,
    },
    {
      aspect: 'Post-Event Value',
      them: 'Certificate only',
      themBad: true,
      us: 'Community + partnerships + jobs',
      usGood: true,
    },
    {
      aspect: 'Pricing',
      them: 'Cheap ₹5-10K (volume play)',
      themBad: true,
      us: 'Premium ₹15-50K (quality play)',
      usGood: true,
    },
    {
      aspect: 'Transparency',
      them: 'Hidden costs, fake reviews',
      themBad: true,
      us: 'Full cost breakdown, real outcomes',
      usGood: true,
    },
    {
      aspect: 'Target Audience',
      them: 'Anyone with money',
      themBad: true,
      us: 'Serious innovators & farmers',
      usGood: true,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-transparent py-20 overflow-hidden"
      id="transparency"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-agtech-black/70 via-red-950/10 to-agtech-black/70" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8">
        {/* Warning Banner */}
        <div
          className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          <div className="flex items-center justify-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <span className="text-red-400 font-display font-bold">INDUSTRY WARNING</span>
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
        </div>

        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          style={{ transitionDelay: '0.1s' }}
        >
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
            Why We're <span className="text-red-400">Not</span> Like Them
          </h2>
          <p className="text-agtech-sage text-lg max-w-2xl mx-auto">
            The conference industry is plagued by predatory practices. We're here to change that with complete transparency.
          </p>
        </div>

        {/* Comparison Table */}
        <div className={`rounded-2xl border border-agtech-white/10 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`} style={{ transitionDelay: '0.2s' }}>
          <div className="overflow-x-auto">
            <div className="min-w-[760px] overflow-hidden">
              <div className="grid grid-cols-3 bg-agtech-black/80 backdrop-blur-sm">
                <div className="p-4 border-r border-agtech-white/10">
                  <span className="label-mono text-agtech-sage text-xs">ASPECT</span>
                </div>
                <div className="p-4 border-r border-agtech-white/10 bg-red-950/20">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400" />
                    <span className="label-mono text-red-400 text-xs">THEM (Predatory)</span>
                  </div>
                </div>
                <div className="p-4 bg-agtech-lime/10">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-agtech-lime" />
                    <span className="label-mono text-agtech-lime text-xs">US (Premium)</span>
                  </div>
                </div>
              </div>

              {comparisonData.map((row, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 transition-all duration-300 ${
                    hoveredRow === i ? 'bg-agtech-white/5' : i % 2 === 0 ? 'bg-agtech-black/40' : 'bg-agtech-black/60'
                  }`}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <div className="p-4 border-r border-agtech-white/10 flex items-center">
                    <span className="text-white font-medium">{row.aspect}</span>
                  </div>
                  <div className={`p-4 border-r border-agtech-white/10 flex items-center gap-2 ${row.themBad ? 'bg-red-950/10' : ''}`}>
                    <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="text-agtech-sage text-sm">{row.them}</span>
                  </div>
                  <div className={`p-4 flex items-center gap-2 ${row.usGood ? 'bg-agtech-lime/5' : ''}`}>
                    <Check className="w-4 h-4 text-agtech-lime flex-shrink-0" />
                    <span className="text-white text-sm font-medium">{row.us}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Download CTA */}
        <div
          className={`mt-12 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          style={{ transitionDelay: '0.5s' }}
        >
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 bg-agtech-lime text-agtech-black font-display font-bold rounded-full hover:shadow-[0_0_40px_rgba(201,255,46,0.4)] transition-all duration-300 hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Download Full Transparency Report (PDF)
          </a>
          <p className="text-agtech-sage text-sm mt-4">
            Includes our complete methodology, review process, and financial breakdown.
          </p>
        </div>

        {/* Trust Badges */}
        <div
          className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          style={{ transitionDelay: '0.6s' }}
        >
          {[
            { label: 'No Hidden Fees', icon: Check },
            { label: 'Real Peer Review', icon: Check },
            { label: 'Venue Confirmed', icon: Check },
            { label: 'Outcome Focused', icon: Check },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-2 p-3 bg-agtech-green/10 border border-agtech-lime/30 rounded-xl"
            >
              <badge.icon className="w-4 h-4 text-agtech-lime" />
              <span className="text-agtech-white text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransparencySection;
