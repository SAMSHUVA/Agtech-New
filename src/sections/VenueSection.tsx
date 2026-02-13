import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface PanelData {
  image: string;
  label: string;
  headline: string;
}

const panels: PanelData[] = [
  {
    image: '/venue_itc.jpg',
    label: 'VENUE',
    headline: 'ITC GARDENIA, BENGALURU',
  },
  {
    image: '/hero_farmland.jpg',
    label: 'FORMAT',
    headline: 'HYBRID: PHYSICAL + VIRTUAL',
  },
  {
    image: '/closing_aerial.jpg',
    label: 'SAVE THE DATE',
    headline: 'NOV 21–22, 2026',
  },
];

const VenueSection = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      className="three-panel-grid z-[90]"
    >
      {panels.map((panel, index) => (
        <div
          key={panel.label}
          className="relative w-full md:w-1/3 h-[33.33vh] md:h-screen overflow-hidden"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(100px)',
            transition: `all 1s ease ${index * 150}ms`,
          }}
        >
          {/* Image */}
          <img
            src={panel.image}
            alt={panel.label}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            style={{ filter: 'saturate(0.85) contrast(1.05)' }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-agtech-black/90 via-agtech-black/30 to-transparent" />

          {/* Label */}
          <div
            className="panel-label absolute top-5 md:top-[7vh] left-4 md:left-[2.5vw]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: `all 0.7s ease ${300 + index * 100}ms`,
            }}
          >
            <span className="label-mono text-agtech-lime">{panel.label}</span>
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
            <h3 className="font-display font-black text-agtech-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl uppercase leading-tight tracking-tight">
              {panel.headline}
            </h3>
          </div>
        </div>
      ))}
    </section>
  );
};

export default VenueSection;
