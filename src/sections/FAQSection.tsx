import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';

const FAQSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'General',
      question: 'What is AgTech Summit 2026?',
      answer: 'AgTech Summit 2026 is India\'s first outcome-focused agricultural technology conference, bringing together 150 million farmers with 50,000+ innovators. The event focuses on creating real partnerships, launching technology pilots, and driving measurable impact in Indian agriculture.',
    },
    {
      category: 'Registration',
      question: 'What are the registration fees and what\'s included?',
      answer: 'Registration fees range from ₹5,000 (Virtual/Farmers) to ₹35,000 (Investors). All tiers include conference access, networking sessions, workshops, and certificates. Early bird pricing offers up to 40% discount until August 31, 2026.',
    },
    {
      category: 'Registration',
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer a 100% refund if the event is cancelled. For attendee cancellations, full refund available up to 30 days before the event, 50% refund up to 14 days before. No refunds within 14 days of the event.',
    },
    {
      category: 'Submission',
      question: 'How do I submit a research paper or abstract?',
      answer: 'Visit the Submissions page to submit your abstract. Our review process takes 2-4 weeks with a 30-40% acceptance rate. Accepted papers get presentation slots and publication in conference proceedings.',
    },
    {
      category: 'Submission',
      question: 'What is the paper acceptance rate?',
      answer: 'We maintain a 30-40% acceptance rate to ensure quality. Unlike predatory conferences that accept 90-95% of submissions, we conduct genuine peer review with industry experts and academics.',
    },
    {
      category: 'Event',
      question: 'What is the hybrid format?',
      answer: 'The hybrid format allows both in-person attendance at ITC Gardenia, Bangalore and virtual participation via live stream. Virtual attendees get access to all sessions, networking platform, and on-demand recordings.',
    },
    {
      category: 'Event',
      question: 'Will I get a certificate?',
      answer: 'Yes, all attendees receive a certificate of attendance. Presenters receive certificates of presentation, and papers are published in conference proceedings with ISBN.',
    },
    {
      category: 'Sponsorship',
      question: 'How can my company sponsor the event?',
      answer: 'We offer various sponsorship tiers from ₹1L to ₹25L+ with benefits including branding, booth space, speaking opportunities, and exclusive networking access. Contact us at sponsor@agtechsummit.in for the sponsorship deck.',
    },
    {
      category: 'Travel',
      question: 'Is accommodation included?',
      answer: 'Accommodation is not included in registration fees. We have partnered with ITC Gardenia and nearby hotels for discounted rates. Details are shared after registration.',
    },
    {
      category: 'Travel',
      question: 'How do I reach the venue?',
      answer: 'ITC Gardenia is located in the heart of Bangalore, 35km from the airport. We provide shuttle services from major transit points. The venue is also accessible via metro and taxi services.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(faqs.map((f) => f.category))];

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
      id="faq"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-agtech-black via-agtech-green/5 to-agtech-black" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="label-mono text-agtech-lime text-sm tracking-widest mb-4 block">
            GOT QUESTIONS?
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
            Frequently Asked <span className="text-agtech-lime">Questions</span>
          </h2>
          <p className="text-agtech-sage text-lg max-w-2xl mx-auto">
            Everything you need to know about AgTech Summit 2026.
          </p>
        </div>

        {/* Search Bar */}
        <div
          className={`relative mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.1s' }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-agtech-sage" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-agtech-green/10 border border-agtech-white/10 rounded-xl text-white placeholder-agtech-sage focus:border-agtech-lime focus:outline-none transition-colors"
          />
        </div>

        {/* Category Pills */}
        {!searchQuery && (
          <div
            className={`flex flex-wrap justify-center gap-2 mb-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            {categories.map((cat, i) => (
              <button
                key={i}
                className="px-4 py-2 bg-agtech-green/10 border border-agtech-white/10 rounded-full text-agtech-sage text-sm hover:border-agtech-lime hover:text-agtech-lime transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${0.1 + i * 0.05}s` }}
            >
              <div
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                  openIndex === i
                    ? 'border-agtech-lime/50 bg-agtech-green/10'
                    : 'border-agtech-white/10 bg-agtech-black/40 hover:border-agtech-white/30'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div>
                    <span className="label-mono text-agtech-sage text-xs mb-1 block">{faq.category}</span>
                    <span className="text-white font-medium pr-4">{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-agtech-lime flex-shrink-0 transition-transform duration-300 ${
                      openIndex === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-5 pb-5">
                    <p className="text-agtech-sage leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-agtech-sage mb-4">No questions found matching your search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-agtech-lime hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Contact CTA */}
        <div
          className={`mt-12 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.5s' }}
        >
          <p className="text-agtech-sage mb-4">Still have questions?</p>
          <a
            href="https://wa.me/918610100624"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 hover:bg-green-500/30 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat with us on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
