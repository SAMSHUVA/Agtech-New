import { useEffect, useRef, useState } from 'react';
import { Handshake, Rocket, Building2, TreePine, Wrench, BadgeCheck, ArrowRight, TrendingUp, Users, Briefcase } from 'lucide-react';

const DifferentiatorsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const cards = [
    {
      icon: Handshake,
      title: 'Real Partnerships',
      subtitle: '20+ Farmer-Startup Matches Guaranteed',
      description: 'We facilitate meaningful connections that lead to actual pilot programs, not just business card exchanges.',
      stat: '20+',
      statLabel: 'Matches Guaranteed',
      color: 'from-agtech-cyan to-agtech-lime',
      bgImage: '/matchmaking.jpg',
    },
    {
      icon: Rocket,
      title: 'Live Technology Pilots',
      subtitle: 'Launch Your Pilot at the Summit',
      description: 'Test your AgTech solution with real farmers during the event. Get immediate feedback and iterate.',
      stat: '10+',
      statLabel: 'Pilots Launched',
      color: 'from-agtech-cyan to-agtech-lime',
      bgImage: '/pitch_competition.jpg',
    },
    {
      icon: Building2,
      title: 'Government Navigation',
      subtitle: 'Step-by-Step Scheme Access Workshop',
      description: 'Learn how to access PM-KISAN, NABARD funding, and state-specific agricultural schemes.',
      stat: '15+',
      statLabel: 'Schemes Covered',
      color: 'from-purple-500 to-pink-600',
      bgImage: '/venue_conference.jpg',
    },
    {
      icon: TreePine,
      title: 'Investor Connections',
      subtitle: '10+ VCs Seeking AgTech Deals',
      description: 'Meet active investors looking for the next big thing in agricultural technology.',
      stat: '10+',
      statLabel: 'Active VCs',
      color: 'from-amber-500 to-orange-600',
      bgImage: '/networking_dinner.jpg',
    },
    {
      icon: Wrench,
      title: 'Hands-On Workshops',
      subtitle: 'Not Just Talks. Build Solutions.',
      description: '4 parallel tracks covering AI in agriculture, IoT implementation, drone technology, and precision farming.',
      stat: '4',
      statLabel: 'Parallel Tracks',
      color: 'from-rose-500 to-red-600',
      bgImage: '/workshop_session.jpg',
    },
    {
      icon: BadgeCheck,
      title: 'Transparent Process',
      subtitle: '30-40% Paper Acceptance Rate',
      description: 'Real peer review, real quality control. No pay-to-publish schemes here.',
      stat: '35%',
      statLabel: 'Acceptance Rate',
      color: 'from-teal-500 to-emerald-600',
      bgImage: '/tech_grid.jpg',
    },
  ];

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

  // Auto-rotate cards
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % cards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible, cards.length]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-transparent py-20 overflow-hidden"
      id="differentiators"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(201, 255, 46, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(201, 255, 46, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="label-mono text-agtech-lime text-sm tracking-widest mb-4 block">
            WHY WE'RE DIFFERENT
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
            What Makes Us <span className="text-agtech-lime">Different</span>
          </h2>
          <p className="text-agtech-sage text-lg max-w-2xl mx-auto">
            We're not just another conference. We're building the bridge between India's farmers and its innovators.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`group relative h-80 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } ${activeCard === i ? 'ring-2 ring-agtech-lime scale-[1.02]' : ''}`}
              style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
              onMouseEnter={() => setActiveCard(i)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={card.bgImage}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-80`} />
                <div className="absolute inset-0 bg-agtech-black/40" />
              </div>

              {/* Content */}
              <div className="relative h-full p-6 flex flex-col justify-between">
                {/* Top */}
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-1">{card.title}</h3>
                  <p className="text-white/80 text-sm">{card.subtitle}</p>
                </div>

                {/* Bottom - Reveals on Hover */}
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white/90 text-sm mb-4 line-clamp-3">{card.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-black text-2xl text-white">{card.stat}</p>
                      <p className="text-white/70 text-xs">{card.statLabel}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-agtech-black transition-all">
                      <ArrowRight className="w-5 h-5 text-white group-hover:text-agtech-black" />
                    </div>
                  </div>
                </div>

                {/* Always Visible Stat */}
                <div className="group-hover:opacity-0 transition-opacity duration-300">
                  <p className="font-display font-black text-3xl text-white">{card.stat}</p>
                  <p className="text-white/70 text-xs">{card.statLabel}</p>
                </div>
              </div>

              {/* Active Indicator */}
              {activeCard === i && (
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-agtech-lime animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Stats Bar */}
        <div
          className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.8s' }}
        >
          {[
            { icon: Users, value: '100+', label: 'Expected Attendees' },
            { icon: Briefcase, value: '20+', label: 'Partnerships Target' },
            { icon: TrendingUp, value: '10+', label: 'Pilots Target' },
            { icon: TreePine, value: '5+', label: 'Funding Deals Target' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 bg-agtech-green/10 border border-agtech-white/10 rounded-xl"
            >
              <stat.icon className="w-6 h-6 text-agtech-lime mx-auto mb-2" />
              <p className="font-display font-black text-2xl text-white">{stat.value}</p>
              <p className="text-agtech-sage text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentiatorsSection;

