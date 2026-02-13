import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronRight, Clock, MapPin, Sun, Trophy, Users, Utensils, Wrench } from 'lucide-react';

const AUTO_ADVANCE_MS = 4500;
const AUTO_RESUME_DELAY_MS = 3000;

const eventCards = [
  {
    time: 'Day 1 Morning',
    title: 'Technology Showcase',
    icon: Sun,
    image: '/venue_conference.jpg',
    items: [
      'Live AgTech product demonstrations',
      'Startup exhibition booths',
      'Farmer feedback sessions',
      'Investor walkthroughs',
    ],
    highlight: '50+ Technologies on Display',
    color: 'from-amber-500 to-orange-600',
  },
  {
    time: 'Day 1 Afternoon',
    title: 'Startup Pitch Competition',
    icon: Trophy,
    image: '/pitch_competition.jpg',
    items: [
      'Top 10 AgTech startups pitch live',
      'Rs.10L prize pool',
      'Live investor judging',
      'Immediate feedback round',
    ],
    highlight: 'Rs.10,00,000 Prize Pool',
    color: 'from-purple-500 to-pink-600',
  },
  {
    time: 'Day 1 Evening',
    title: 'Networking Dinner + Awards',
    icon: Utensils,
    image: '/networking_dinner.jpg',
    items: [
      'Gala dinner at ITC Gardenia',
      'AgTech excellence awards',
      'Founder-investor meetups',
      'Curated networking circles',
    ],
    highlight: 'Smart Casual Dress Code',
    color: 'from-rose-500 to-red-600',
  },
  {
    time: 'Day 2 Morning',
    title: 'Implementation Workshops',
    icon: Wrench,
    image: '/workshop_session.jpg',
    items: [
      'AI in agriculture track',
      'IoT and sensor network track',
      'Drone technology track',
      'Precision farming track',
    ],
    highlight: '4 Parallel Tracks',
    color: 'from-agtech-cyan to-agtech-lime',
  },
  {
    time: 'Day 2 Afternoon',
    title: 'Farmer-Startup Matchmaking',
    icon: Users,
    image: '/matchmaking.jpg',
    items: [
      'Speed matching format',
      'Pre-qualified introductions',
      'Partnership templates',
      'On-the-spot pilot discussions',
    ],
    highlight: '20+ Partnerships Target',
    color: 'from-agtech-cyan to-agtech-lime',
  },
];

const EventFormatSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const programmaticScrollRef = useRef(false);

  const [hasEntered, setHasEntered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const getCardWidth = (container: HTMLDivElement) => container.clientWidth * 0.82;

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const pauseAutoAdvance = useCallback(
    (delay = AUTO_RESUME_DELAY_MS) => {
      setIsAutoPaused(true);
      clearResumeTimer();
      if (delay >= 0) {
        resumeTimerRef.current = window.setTimeout(() => {
          setIsAutoPaused(false);
          resumeTimerRef.current = null;
        }, delay);
      }
    },
    [clearResumeTimer]
  );

  const scrollToCard = useCallback(
    (index: number, markUserInteraction = true) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      if (markUserInteraction) {
        pauseAutoAdvance();
      }

      programmaticScrollRef.current = true;
      container.scrollTo({
        left: index * getCardWidth(container),
        behavior: 'smooth',
      });

      window.setTimeout(() => {
        programmaticScrollRef.current = false;
      }, 650);
    },
    [pauseAutoAdvance]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
        }
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    const section = sectionRef.current;
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();

    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = getCardWidth(container);
      if (cardWidth <= 0) return;

      const nextIndex = Math.round(container.scrollLeft / cardWidth);
      setActiveCard(Math.max(0, Math.min(eventCards.length - 1, nextIndex)));

      if (!programmaticScrollRef.current) {
        pauseAutoAdvance();
      }
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [pauseAutoAdvance]);

  useEffect(() => {
    if (prefersReducedMotion || !isInView || isAutoPaused) return;

    const interval = window.setInterval(() => {
      const nextIndex = (activeCard + 1) % eventCards.length;
      scrollToCard(nextIndex, false);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, [activeCard, isAutoPaused, isInView, prefersReducedMotion, scrollToCard]);

  useEffect(() => {
    return () => clearResumeTimer();
  }, [clearResumeTimer]);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 w-full bg-transparent overflow-x-hidden py-20 sm:py-24"
      id="format"
    >
      <div className="w-full flex flex-col justify-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-agtech-black/70 via-agtech-green/10 to-agtech-black/70" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(200,255,61,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(200,255,61,0.06)_1px,transparent_1px)] bg-[size:70px_70px] opacity-35" />
        </div>

        <div className="relative z-10">
          <div
            className={`text-center mb-10 sm:mb-12 px-4 transition-all duration-700 ${
              hasEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="label-mono text-agtech-lime text-sm tracking-widest mb-4 block">
              EVENT SCHEDULE
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
              Two Days of <span className="text-agtech-lime">Impact</span>
            </h2>
            <p className="text-agtech-sage text-lg max-w-2xl mx-auto">
              Every session is built for outcomes, not filler talks.
            </p>
          </div>

          <div
            ref={scrollContainerRef}
            onMouseEnter={() => {
              clearResumeTimer();
              setIsAutoPaused(true);
            }}
            onMouseLeave={() => pauseAutoAdvance()}
            onWheel={() => pauseAutoAdvance()}
            onTouchStart={() => pauseAutoAdvance()}
            onPointerDown={() => pauseAutoAdvance()}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory px-4 sm:px-8 pb-4 sm:pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {eventCards.map((card, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-[88vw] sm:w-[72vw] lg:w-[42vw] snap-center transition-all duration-500 ${
                  hasEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${0.08 + i * 0.08}s` }}
              >
                <article
                  className={`group relative h-[430px] sm:h-[500px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    activeCard === i ? 'scale-[1.01] ring-1 ring-agtech-lime/45' : 'scale-100'
                  }`}
                >
                  <div className="absolute inset-0">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-60`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-agtech-black via-agtech-black/50 to-transparent" />
                  </div>

                  <div className="relative h-full p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <card.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-white/80 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {card.time}
                        </p>
                      </div>

                      <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
                        {card.title}
                      </h3>
                      <div
                        className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${card.color} text-white text-sm font-medium`}
                      >
                        {card.highlight}
                      </div>
                    </div>

                    <div>
                      <p className="label-mono text-white/60 text-xs mb-3">AGENDA HIGHLIGHTS</p>
                      <ul className="space-y-2">
                        {card.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2 text-white/90 text-sm">
                            <ChevronRight className="w-4 h-4 text-agtech-lime flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <div
            className={`flex justify-center mt-6 sm:mt-8 transition-all duration-700 ${hasEntered ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '0.55s' }}
          >
            <div className="flex items-center gap-4">
              <span className="text-agtech-sage text-sm">Swipe or scroll to explore</span>
              <div className="flex gap-3">
                {eventCards.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToCard(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeCard === i ? 'w-6 bg-agtech-lime' : 'w-2 bg-agtech-white/30 hover:bg-agtech-lime/60'
                    }`}
                    aria-label={`Go to schedule card ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className={`max-w-4xl mx-auto mt-10 sm:mt-12 px-4 transition-all duration-700 ${
              hasEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0.65s' }}
          >
            <div className="bg-agtech-green/15 border border-agtech-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-agtech-lime/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-agtech-lime" />
                </div>
                <div>
                  <p className="text-white font-display font-bold">ITC Gardenia, Bangalore</p>
                  <p className="text-agtech-sage text-sm">Confirmed venue booking</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="font-display font-bold text-agtech-lime">Nov 21</p>
                  <p className="text-agtech-sage">Day 1</p>
                </div>
                <div className="w-px h-8 bg-agtech-white/20" />
                <div className="text-center">
                  <p className="font-display font-bold text-agtech-lime">Nov 22</p>
                  <p className="text-agtech-sage">Day 2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventFormatSection;

