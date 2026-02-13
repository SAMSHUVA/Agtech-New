import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowRight } from 'lucide-react';

const ProblemSection = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="split-section z-40"
    >
      {/* Left Panel - Image (55%) */}
      <div
        className={`relative w-full md:w-[55%] h-[45vh] md:h-screen transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
        }`}
      >
        <img
          src="/problem_aerial.jpg"
          alt="Aerial view of farmland with single tree"
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.85) contrast(1.05)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-agtech-black/40" />
      </div>

      {/* Vertical Divider */}
      <div 
        className={`vertical-divider hidden md:block transition-transform duration-1000 delay-300 origin-top ${
          isVisible ? 'scale-y-100' : 'scale-y-0'
        }`}
        style={{ left: '55%' }}
      />

      {/* Right Panel - Content (45%) */}
      <div
        className={`relative w-full md:w-[45%] h-auto md:h-screen bg-agtech-black flex items-center transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
        }`}
      >
        <div className="px-6 md:px-[5vw] py-8 md:py-12">
          {/* Headline */}
          <div className="mb-6 md:mb-12">
            <h2 className="headline-section text-agtech-white">
              <span className="block transition-all duration-700 delay-300" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(48px)' }}>THE</span>
              <span className="block text-agtech-lime transition-all duration-700 delay-400" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(48px)' }}>DISCONNECT</span>
            </h2>
          </div>

          {/* Body */}
          <p 
            className="body-text text-agtech-sage max-w-md mb-6 md:mb-10 transition-all duration-700 delay-500"
            style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(32px)' }}
          >
            150 million farmers still operate with 1950s tools—while 50,000 
            agritech solutions wait on the shelf. The gap isn't technology. 
            It's trust, access, and meaningful connection.
          </p>

          {/* CTA */}
          <a
            href="#solution"
            className="inline-flex items-center gap-3 label-mono text-agtech-lime hover:text-agtech-white transition-colors group"
            style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.7s ease 0.6s' }}
          >
            See how we bridge it
            <ArrowRight
              size={18}
              className="transform group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
