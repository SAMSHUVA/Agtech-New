import { useEffect, useRef, useState } from 'react';
import {
  Check,
  Crown,
  Globe,
  GraduationCap,
  Rocket,
  Sprout,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { passTiersApi, subscribeDatabase, formatPrice, type PassTier } from '../data/database';

const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 8.9) % 100}%`,
  top: `${(i * 13.4 + 9) % 100}%`,
  animationDelay: `${(i % 7) * 0.35}s`,
  animationDuration: `${2 + (i % 4)}s`,
}));

const iconSequence = [Rocket, Sprout, TrendingUp, GraduationCap, Globe, Zap];
const colorSequence = [
  'from-agtech-lime to-agtech-cyan',
  'from-agtech-cyan to-agtech-lime',
  'from-amber-500 to-orange-600',
  'from-teal-500 to-agtech-cyan',
  'from-indigo-500 to-purple-600',
  'from-agtech-cyan to-agtech-lime',
];

const inPersonBenefits = [
  'Full 2-day conference access',
  'Networking sessions and meetups',
  'Lunch and refreshments included',
  'In-person certificate and event kit',
  'Priority access to workshops',
  'Post-event community access',
];

const virtualBenefits = [
  'Live stream access (HD)',
  'On-demand session recordings',
  'Digital networking rooms',
  'E-certificate of attendance',
  'Virtual exhibition access',
  'Digital resource kit',
];

const RegistrationTiersSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [passTiers, setPassTiers] = useState<PassTier[]>(passTiersApi.getAll());

  useEffect(() => {
    return subscribeDatabase(() => {
      setPassTiers(passTiersApi.getAll());
    });
  }, []);

  const tiers = passTiers.map((tier, index) => {
    const Icon = iconSequence[index % iconSequence.length];
    return {
      id: tier.id,
      name: tier.name,
      price: formatPrice(tier.prices.INR ?? tier.prices.USD ?? 0, 'INR'),
      subtitle: tier.mode === 'in-person' ? 'In-Person Access' : 'Virtual Access',
      icon: Icon,
      color: colorSequence[index % colorSequence.length],
      popular: tier.id === 'regular',
      benefits: tier.mode === 'in-person' ? inPersonBenefits : virtualBenefits,
      badge: tier.badge,
      badgeColor: tier.badgeColor,
    };
  });

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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-transparent py-20 overflow-hidden"
      id="pricing"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-agtech-black via-agtech-green/5 to-agtech-black" />
        {floatingParticles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-agtech-lime/30 rounded-full animate-pulse"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="label-mono text-agtech-lime text-sm tracking-widest mb-4 block">
            REGISTRATION TIERS
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
            Choose Your <span className="text-agtech-lime">Path</span>
          </h2>
          <p className="text-agtech-sage text-lg max-w-2xl mx-auto">
            Prices below are synced directly from the admin panel and update automatically.
          </p>
        </div>

        <div
          className={`mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.1s' }}
        >
          <div className="bg-gradient-to-r from-agtech-lime/18 to-agtech-cyan/24 border border-agtech-lime/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-agtech-lime/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-agtech-lime" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-lg">Live Pricing from Admin Panel</p>
                <p className="text-agtech-sage text-sm">Any change in admin pricing appears here instantly.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-agtech-black/50 rounded-full">
              <div className="w-2 h-2 bg-agtech-lime rounded-full animate-pulse" />
              <span className="text-agtech-lime text-sm font-medium">Synced</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tiers.map((tier, i) => (
            <div
              key={tier.id}
              className={`relative h-[400px] perspective-1000 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${0.1 + i * 0.05}s` }}
              onMouseEnter={() => setFlippedCard(i)}
              onMouseLeave={() => setFlippedCard(null)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                  flippedCard === i ? 'rotate-y-180' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flippedCard === i ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div
                  className={`absolute inset-0 backface-hidden rounded-2xl overflow-hidden border transition-all duration-300 ${
                    tier.popular
                      ? 'border-agtech-lime ring-2 ring-agtech-lime/50'
                      : 'border-agtech-white/10 hover:border-agtech-white/30'
                  }`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {tier.popular && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-agtech-lime text-agtech-black rounded-full text-xs font-bold">
                      <Crown className="w-3 h-3" />
                      MOST POPULAR
                    </div>
                  )}

                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-10`} />
                  <div className="absolute inset-0 bg-agtech-black/80" />

                  <div className="relative h-full p-6 flex flex-col">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                      <tier.icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="font-display font-bold text-xl text-white mb-1">{tier.name}</h3>
                    <p className="text-agtech-sage text-sm mb-2">{tier.subtitle}</p>
                    <span className={`inline-block text-[10px] font-mono font-bold px-2 py-1 rounded w-fit ${tier.badgeColor}`}>
                      {tier.badge}
                    </span>

                    <div className="mt-auto">
                      <p className="font-display font-black text-4xl text-agtech-lime mb-4">{tier.price}</p>
                      <p className="text-agtech-sage text-sm mb-4">Hover to see benefits</p>
                      <button
                        className={`w-full py-3 rounded-xl font-display font-bold transition-all duration-300 ${
                          tier.popular
                            ? 'bg-agtech-lime text-agtech-black hover:shadow-[0_0_20px_rgba(201,255,46,0.4)]'
                            : 'bg-agtech-white/10 text-white hover:bg-agtech-white/20'
                        }`}
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border border-agtech-lime/30 bg-agtech-green/20"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="relative h-full p-6 flex flex-col">
                    <h4 className="font-display font-bold text-lg text-white mb-4">What&apos;s Included</h4>
                    <ul className="flex-1 space-y-2 overflow-y-auto">
                      {tier.benefits.map((benefit, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-agtech-lime flex-shrink-0 mt-0.5" />
                          <span className="text-agtech-white/90">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="w-full mt-4 py-3 bg-agtech-lime text-agtech-black rounded-xl font-display font-bold hover:shadow-[0_0_20px_rgba(201,255,46,0.4)] transition-all">
                      Select This Tier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-12 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.5s' }}
        >
          <p className="text-agtech-sage text-sm">
            All prices are synced with admin panel updates. Group discounts available for 5+ registrations.{' '}
            <a href="#contact" className="text-agtech-lime hover:underline">
              Contact us
            </a>{' '}
            for details.
          </p>
        </div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
};

export default RegistrationTiersSection;
