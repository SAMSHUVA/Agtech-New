import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';

const ClosingSection = () => {
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const { ref: contactRef, isVisible: contactVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section
      id="contact"
      className="relative bg-agtech-black py-16 md:py-20 lg:py-32 z-[100]"
    >
      {/* Image Block with CTA */}
      <div className="px-4 md:px-6 lg:px-12 mb-12 md:mb-20">
        <div
          ref={imageRef}
          className="closing-image-block relative w-full max-w-[92vw] md:max-w-[88vw] mx-auto h-[40vh] md:h-[52vh] rounded-2xl md:rounded-viewport overflow-hidden"
          style={{
            opacity: imageVisible ? 1 : 0,
            transform: imageVisible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.98)',
            transition: 'all 1s ease',
          }}
        >
          <img
            src="/closing_aerial.jpg"
            alt="Aerial farmland"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.85) contrast(1.05)' }}
          />
          <div className="absolute inset-0 bg-agtech-black/70" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-6">
            <h2
              className="headline-section text-agtech-white mb-4 md:mb-8 max-w-[95vw] md:max-w-[80vw]"
              style={{
                opacity: imageVisible ? 1 : 0,
                transform: imageVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'all 0.8s ease 0.2s',
              }}
            >
              READY TO BUILD THE
              <br />
              <span className="text-agtech-lime">FUTURE OF AGRICULTURE?</span>
            </h2>
            <a
              href="#register"
              onClick={(e) => { e.preventDefault(); window.location.hash = 'register'; }}
              className="btn-primary"
              style={{
                opacity: imageVisible ? 1 : 0,
                transform: imageVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'all 0.8s ease 0.4s',
                animation: imageVisible ? 'pulse-glow 2s ease-in-out infinite' : 'none',
              }}
            >
              Register Now
            </a>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div
        ref={contactRef}
        className="contact-grid px-4 md:px-6 lg:px-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-20"
        style={{
          opacity: contactVisible ? 1 : 0,
          transform: contactVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.8s ease',
        }}
      >
        {/* Contact Info */}
        <div>
          <h3 className="label-mono text-agtech-lime mb-6 md:mb-8">CONTACT</h3>
          <div className="space-y-4 md:space-y-6">
            <a
              href="mailto:hello@agtechsummit.in"
              className="flex items-center gap-3 md:gap-4 text-agtech-white hover:text-agtech-lime transition-colors group"
            >
              <Mail size={18} className="text-agtech-sage group-hover:text-agtech-lime transition-colors flex-shrink-0" />
              <span className="body-text">hello@agtechsummit.in</span>
            </a>
            <a
              href="tel:+918610100624"
              className="flex items-center gap-3 md:gap-4 text-agtech-white hover:text-agtech-lime transition-colors group"
            >
              <Phone size={18} className="text-agtech-sage group-hover:text-agtech-lime transition-colors flex-shrink-0" />
              <span className="body-text">+91 86101 00624</span>
            </a>
            <div className="flex items-start gap-3 md:gap-4 text-agtech-sage">
              <MapPin size={18} className="mt-1 flex-shrink-0" />
              <span className="body-text">
                ITC Gardenia, Residency Road
                <br />
                Bengaluru, Karnataka 560025
              </span>
            </div>
          </div>
        </div>

        {/* Social + Links */}
        <div>
          <h3 className="label-mono text-agtech-lime mb-6 md:mb-8">FOLLOW US</h3>
          <div className="flex gap-4 md:gap-6 mb-8 md:mb-12">
            <a
              href="#"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-agtech-white/20 flex items-center justify-center text-agtech-white hover:border-agtech-lime hover:text-agtech-lime transition-colors"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-agtech-white/20 flex items-center justify-center text-agtech-white hover:border-agtech-lime hover:text-agtech-lime transition-colors"
            >
              <Twitter size={18} />
            </a>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6">
            <a href="#" className="label-mono text-agtech-sage hover:text-agtech-lime transition-colors text-xs md:text-sm">
              Privacy Policy
            </a>
            <a href="#" className="label-mono text-agtech-sage hover:text-agtech-lime transition-colors text-xs md:text-sm">
              Terms of Service
            </a>
            <a href="#" className="label-mono text-agtech-sage hover:text-agtech-lime transition-colors text-xs md:text-sm">
              Code of Conduct
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 md:mt-20 pt-6 md:pt-8 border-t border-agtech-white/10 px-4 md:px-6">
        <div className="footer-content flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 max-w-6xl mx-auto">
          <span className="label-mono text-agtech-sage text-xs md:text-sm text-center md:text-left">
            © 2026 AgTech Transformation Summit. All rights reserved.
          </span>
          <span className="label-mono text-agtech-lime text-xs md:text-sm">
            Organized by IAISR
          </span>
        </div>
      </div>
    </section>
  );
};

export default ClosingSection;
