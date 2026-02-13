import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowRight } from 'lucide-react';

const SplitManifestoSection = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      id="program"
      className="split-section z-20"
    >
      {/* Left Panel - Image */}
      <div
        className={`relative w-full md:w-1/2 h-[45vh] md:h-screen transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
        }`}
      >
        <img
          src="/split_seedling.jpg"
          alt="Hands holding seedling"
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(0.85) contrast(1.05)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-agtech-black/30" />
      </div>

      {/* Vertical Divider */}
      <div 
        className={`vertical-divider left-1/2 hidden md:block transition-transform duration-1000 delay-300 origin-top ${
          isVisible ? 'scale-y-100' : 'scale-y-0'
        }`}
      />

      {/* Right Panel - Content */}
      <div
        className={`relative w-full md:w-1/2 h-auto md:h-screen bg-agtech-black flex items-center transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
        }`}
      >
        <div className="px-6 md:px-[6vw] py-8 md:py-12">
          {/* Headline */}
          <div className="mb-6 md:mb-12">
            <h2 className="headline-section text-agtech-white">
              <span className="block transition-all duration-700 delay-300" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(40px)' }}>WHERE</span>
              <span className="block transition-all duration-700 delay-400" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(40px)' }}>150 MILLION</span>
              <span className="block text-agtech-lime transition-all duration-700 delay-500" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(40px)' }}>FARMERS</span>
              <span className="block transition-all duration-700 delay-600" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(40px)' }}>MEET 50,000</span>
              <span className="block transition-all duration-700 delay-700" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(40px)' }}>INNOVATIONS</span>
            </h2>
          </div>

          {/* Body */}
          <p 
            className="body-text text-agtech-sage max-w-md mb-6 md:mb-10 transition-all duration-700 delay-800"
            style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            A hybrid summit built for outcomes: live pilots, real partnerships, 
            and policy workshops that move from presentation to implementation.
          </p>

          {/* CTA */}
          <a
            href="#experience"
            className="inline-flex items-center gap-3 label-mono text-agtech-lime hover:text-agtech-white transition-colors group"
            style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease 0.9s' }}
          >
            Explore the program
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

export default SplitManifestoSection;
