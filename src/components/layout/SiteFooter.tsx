const quickLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Why Attend', href: '#differentiators' },
  { label: 'Advisory', href: '#advisory' },
  { label: 'Committee', href: '#committee' },
  { label: 'Speakers', href: '#people-speakers' },
  { label: 'Schedule', href: '#format' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const pageLinks = [
  { label: 'Submissions', href: '#submissions' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Sessions', href: '#sessions' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const SiteFooter = () => {
  return (
    <footer className="relative z-20 border-t border-agtech-white/10 bg-agtech-black/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label-mono text-agtech-lime mb-4">AGTECH SUMMIT 2026</p>
            <p className="text-agtech-sage text-sm leading-relaxed max-w-xs">
              India&apos;s outcome-focused AgTech platform connecting farmers, startups, investors, and policymakers.
            </p>
            <a
              href="#register"
              className="inline-flex mt-5 px-5 py-2.5 rounded-full bg-agtech-lime text-agtech-black font-display font-bold text-sm hover:bg-agtech-lime/90 transition-colors"
            >
              Register Now
            </a>
          </div>

          <div>
            <p className="text-agtech-white font-display font-bold mb-4">Quick Links</p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-agtech-sage hover:text-agtech-lime transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-agtech-white font-display font-bold mb-4">Pages</p>
            <ul className="space-y-2.5">
              {pageLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-agtech-sage hover:text-agtech-lime transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-agtech-white font-display font-bold mb-4">Contact</p>
            <ul className="space-y-2.5 text-sm text-agtech-sage">
              <li>ITC Gardenia, Bangalore</li>
              <li>Nov 21-22, 2026</li>
              <li>
                <a href="mailto:info@agtechsummit.in" className="hover:text-agtech-lime transition-colors">
                  info@agtechsummit.in
                </a>
              </li>
              <li>
                <a href="tel:+918610100624" className="hover:text-agtech-lime transition-colors">
                  +91 86101 00624
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-agtech-white/10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-agtech-sage">
          <p>© 2026 AgTech Summit. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#about" className="hover:text-agtech-lime transition-colors">Terms</a>
            <a href="#about" className="hover:text-agtech-lime transition-colors">Privacy</a>
            <a href="#contact" className="hover:text-agtech-lime transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
