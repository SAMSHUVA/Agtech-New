import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Building2, MessageCircle, Shield, CheckCircle, Clock } from 'lucide-react';

const floatingParticles = Array.from({ length: 30 }, (_, i) => ({
  left: `${(i * 7.1) % 100}%`,
  top: `${(i * 11.3 + 6) % 100}%`,
  animationDelay: `${(i % 10) * 0.45}s`,
  animationDuration: `${5 + (i % 6)}s`,
}));

const FinalCTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  // Countdown to early bird deadline (Aug 31, 2026)
  useEffect(() => {
    const deadline = new Date('2026-08-31T23:59:59');
    const updateCountdown = () => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
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

  const trustElements = [
    { icon: Shield, text: '100% Refund if Event Cancelled' },
    { icon: CheckCircle, text: 'Hybrid Format Guaranteed' },
    { icon: Clock, text: 'Certificate of Attendance Included' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-transparent"
      id="final-cta"
    >
      {/* Background Image - Sunrise over fields */}
      <div className="absolute inset-0">
        <img
          src="/sunrise_fields.jpg"
          alt="Sunrise over agricultural fields"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-agtech-black via-agtech-black/70 to-agtech-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-agtech-black/50 via-transparent to-agtech-black" />
      </div>

      {/* Animated Sun Rays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-px h-[200%] bg-gradient-to-b from-agtech-lime/30 to-transparent origin-top"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
              animation: `pulse 3s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingParticles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-agtech-lime/40 rounded-full animate-float"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 py-24 sm:py-20">
        {/* Main Content */}
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          {/* Pre-headline */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-agtech-lime/10 border border-agtech-lime/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-agtech-lime rounded-full animate-pulse" />
            <span className="label-mono text-agtech-lime text-xs">THE FUTURE STARTS HERE</span>
          </div>

          {/* Main Headline */}
          <h2 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            Join the <span className="text-agtech-lime">Agricultural</span>
            <br />
            Revolution
          </h2>

          {/* Subheadline */}
          <p className="text-agtech-sage text-xl sm:text-2xl mb-8 max-w-2xl mx-auto">
            Early Bird Registration Closes in
          </p>

          {/* Countdown Timer */}
          <div
            className={`flex justify-center gap-4 mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            style={{ transitionDelay: '0.2s' }}
          >
            {[
              { value: countdown.days, label: 'DAYS' },
              { value: countdown.hours, label: 'HOURS' },
              { value: countdown.minutes, label: 'MINUTES' },
              { value: countdown.seconds, label: 'SECONDS' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-24 sm:w-24 sm:h-28 bg-agtech-black/60 backdrop-blur-md border border-agtech-lime/30 rounded-2xl flex items-center justify-center mb-2">
                  <span className="font-display font-black text-3xl sm:text-4xl text-agtech-lime">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="label-mono text-agtech-sage text-xs">{item.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            style={{ transitionDelay: '0.3s' }}
          >
            <a
              href="#register"
              className="group relative px-10 py-5 bg-agtech-lime text-agtech-black font-display font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_rgba(201,255,46,0.5)] hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Register Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="#submissions"
              className="px-10 py-5 border-2 border-agtech-lime text-agtech-lime font-display font-bold text-lg rounded-full transition-all duration-300 hover:bg-agtech-lime hover:text-agtech-black"
            >
              Submit Abstract
            </a>
            <a
              href="#sponsors"
              className="px-10 py-5 border border-agtech-white/30 text-white font-display font-bold text-lg rounded-full transition-all duration-300 hover:border-agtech-white hover:bg-agtech-white/10 flex items-center justify-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              Become a Sponsor
            </a>
          </div>

          {/* Trust Elements */}
          <div
            className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            style={{ transitionDelay: '0.4s' }}
          >
            {trustElements.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-agtech-black/40 backdrop-blur-sm border border-agtech-white/10 rounded-full"
              >
                <item.icon className="w-4 h-4 text-agtech-lime" />
                <span className="text-agtech-white text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          {/* WhatsApp Community */}
          <div
            className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            style={{ transitionDelay: '0.5s' }}
          >
            <a
              href="https://wa.me/918610100624"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 hover:bg-green-500/30 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Join WhatsApp Community</span>
              <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">2.5K+ members</span>
            </a>
          </div>
        </div>

        {/* Bottom Stats */}
        <div
          className={`relative mt-12 w-full px-4 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: '0.6s' }}
        >
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4 sm:gap-8 text-center bg-agtech-black/40 backdrop-blur-md sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-agtech-white/10 sm:border-0">
            <div>
              <p className="font-display font-black text-xl sm:text-2xl text-agtech-lime">Nov 21-22</p>
              <p className="text-agtech-sage text-xs sm:text-sm">2026</p>
            </div>
            <div className="w-px h-10 sm:h-12 bg-agtech-white/20 hidden sm:block" />
            <div>
              <p className="font-display font-black text-xl sm:text-2xl text-agtech-lime">ITC Gardenia</p>
              <p className="text-agtech-sage text-xs sm:text-sm">Bangalore</p>
            </div>
            <div className="w-px h-10 sm:h-12 bg-agtech-white/20 hidden sm:block" />
            <div>
              <p className="font-display font-black text-xl sm:text-2xl text-agtech-lime">Hybrid</p>
              <p className="text-agtech-sage text-xs sm:text-sm">Format</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default FinalCTASection;
