import { useScrollAnimation } from '../hooks/useScrollAnimation';

const SolutionSection = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      id="solution"
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center z-50"
    >
      {/* Background Image */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
        }`}
      >
        <img
          src="/solution_farmer.jpg"
          alt="Farmer with tablet in field"
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.85) contrast(1.05)' }}
        />
        <div className="absolute inset-0 bg-agtech-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 py-12">
        {/* Headline */}
        <div className="mb-4 md:mb-8">
          <h2 className="headline-display text-agtech-white">
            <span 
              className="block transition-all duration-700"
              style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(72px)', transitionDelay: '200ms' }}
            >
              OUTCOMES
            </span>
            <span 
              className="block transition-all duration-700"
              style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(72px)', transitionDelay: '350ms' }}
            >
              OVER
            </span>
            <span 
              className="block text-agtech-lime transition-all duration-700"
              style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(72px)', transitionDelay: '500ms' }}
            >
              HYPE
            </span>
          </h2>
        </div>

        {/* Subheadline */}
        <p 
          className="body-text text-agtech-white/80 max-w-xl mx-auto mb-6 md:mb-10 px-4"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease 0.6s' }}
        >
          Live pilots. Real partnerships. Measurable impact.
        </p>

        {/* CTA */}
        <a
          href="#register"
          onClick={(e) => { e.preventDefault(); window.location.hash = 'register'; }}
          className="btn-primary inline-block"
          style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease 0.75s' }}
        >
          Request an invite
        </a>
      </div>
    </section>
  );
};

export default SolutionSection;
