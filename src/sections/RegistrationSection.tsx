import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface TierData {
  image: string;
  label: string;
  headline: string;
  price: string;
}

const tiers: TierData[] = [
  {
    image: '/experience_seedling.jpg',
    label: 'FOUNDERS',
    headline: 'PITCH + PILOT ACCESS',
    price: '₹25,000',
  },
  {
    image: '/experience_aerial.jpg',
    label: 'RESEARCHERS',
    headline: 'PRESENT + PUBLISH',
    price: '₹15,000',
  },
  {
    image: '/experience_drone.jpg',
    label: 'INVESTORS',
    headline: 'DEAL FLOW + LOUNGE',
    price: '₹35,000',
  },
];

const RegistrationSection = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="register"
      className="three-panel-grid z-[80]"
    >
      {tiers.map((tier, index) => (
        <div
          key={tier.label}
          className="relative w-full md:w-1/3 h-[33.33vh] md:h-screen overflow-hidden group cursor-pointer"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(100px)',
            transition: `all 1s ease ${index * 150}ms`,
          }}
        >
          {/* Image */}
          <img
            src={tier.image}
            alt={tier.label}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ filter: 'saturate(0.85) contrast(1.05)' }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-agtech-black/95 via-agtech-black/40 to-transparent" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-agtech-lime/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Label */}
          <div
            className="panel-label absolute top-5 md:top-[7vh] left-4 md:left-[2.5vw]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: `all 0.7s ease ${300 + index * 100}ms`,
            }}
          >
            <span className="label-mono text-agtech-lime">{tier.label}</span>
          </div>

          {/* Price */}
          <div
            className="panel-price absolute top-5 md:top-[7vh] right-4 md:right-[2.5vw]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: `all 0.7s ease ${350 + index * 100}ms`,
            }}
          >
            <span className="font-display font-bold text-agtech-white text-base md:text-lg">{tier.price}</span>
          </div>

          {/* Headline */}
          <div
            className="panel-headline absolute bottom-5 md:bottom-[7vh] left-4 md:left-[2.5vw] right-4 md:right-[2.5vw]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: `all 0.7s ease ${400 + index * 100}ms`,
            }}
          >
            <h3 className="font-display font-black text-agtech-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase leading-tight tracking-tight group-hover:text-agtech-lime transition-colors duration-300">
              {tier.headline}
            </h3>
            <p className="label-mono text-agtech-white/50 mt-2 md:mt-4 group-hover:text-agtech-lime/70 transition-colors text-xs md:text-sm">
              Click to register
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default RegistrationSection;
