import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowRight } from 'lucide-react';

const KeynoteSection = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      id="speakers"
      className="split-section z-[70]"
    >
      {/* Left Panel - Portrait (55%) */}
      <div
        className={`relative w-full md:w-[55%] h-[45vh] md:h-screen transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
        }`}
      >
        <img
          src="/keynote_portrait.jpg"
          alt="Keynote speaker"
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
          <div className="mb-6 md:mb-10">
            <h2 className="headline-section text-agtech-white">
              <span className="block transition-all duration-700 delay-300" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(48px)' }}>KEYNOTE</span>
              <span className="block text-agtech-lime transition-all duration-700 delay-400" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(48px)' }}>SPEAKER</span>
            </h2>
          </div>

          {/* Subheadline */}
          <p 
            className="body-text text-agtech-sage max-w-md mb-6 md:mb-10 transition-all duration-700 delay-500"
            style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            Agritech leader, operator, and investor. Building the bridge 
            between traditional farming and cutting-edge technology.
          </p>

          {/* CTA */}
          <a
            href="#speakers"
            className="inline-flex items-center gap-3 label-mono text-agtech-lime hover:text-agtech-white transition-colors group"
            style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s ease 0.6s' }}
          >
            See all speakers
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

export default KeynoteSection;
