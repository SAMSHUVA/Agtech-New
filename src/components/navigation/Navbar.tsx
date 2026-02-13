import { useEffect, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

const routePages = new Set([
  '',
  'home',
  'register',
  'registration',
  'submissions',
  'call-for-papers',
  'speakers',
  'sessions',
  'about',
  'contact',
  'admin',
]);

const peopleLinks = [
  { label: 'Advisory', href: 'advisory' },
  { label: 'Committee', href: 'committee' },
  { label: 'Speakers', href: 'people-speakers' },
];

const pageLinks = [
  { label: 'Submissions', href: 'submissions' },
  { label: 'Sessions', href: 'sessions' },
  { label: 'About', href: 'about' },
  { label: 'Contact', href: 'contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPeopleOpen, setIsPeopleOpen] = useState(false);
  const [isMobilePeopleOpen, setIsMobilePeopleOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPage(hash || 'home');
      setIsMobilePeopleOpen(false);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const setHash = (hash: string) => {
    const nextUrl = hash
      ? `${window.location.pathname}${window.location.search}#${hash}`
      : `${window.location.pathname}${window.location.search}`;
    window.history.pushState(null, '', nextUrl);
    window.dispatchEvent(new Event('hashchange'));
  };

  const navigateToPage = (hash: string) => {
    setIsMobileMenuOpen(false);
    setIsPeopleOpen(false);
    setIsMobilePeopleOpen(false);
    setHash(hash);
  };

  const navigateToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    setIsPeopleOpen(false);
    setIsMobilePeopleOpen(false);
    setHash(sectionId);
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 140);
  };

  const isOnHomePage = currentPage === 'home' || currentPage === '' || !routePages.has(currentPage);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled || !isOnHomePage
            ? 'bg-agtech-black/90 backdrop-blur-md py-3 sm:py-4'
            : 'bg-transparent py-4 sm:py-6'
        }`}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateToPage('')}
            className="label-mono text-agtech-white hover:text-agtech-lime transition-colors text-[11px] sm:text-xs"
          >
            AGTECH SUMMIT
          </button>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <button
              type="button"
              onClick={() => navigateToPage('')}
              className="label-mono text-agtech-white/70 hover:text-agtech-lime transition-colors"
            >
              Home
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPeopleOpen((prev) => !prev)}
                className="label-mono text-agtech-white/70 hover:text-agtech-lime transition-colors flex items-center gap-1"
              >
                People <ChevronDown size={14} className={`transition-transform ${isPeopleOpen ? 'rotate-180' : ''}`} />
              </button>
              {isPeopleOpen ? (
                <div className="absolute left-0 mt-2 w-44 rounded-xl border border-agtech-white/10 bg-agtech-black/95 shadow-xl p-2">
                  {peopleLinks.map((link) => (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => navigateToSection(link.href)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-agtech-sage hover:text-agtech-lime hover:bg-agtech-white/5 transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {pageLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => navigateToPage(link.href)}
                className="label-mono text-agtech-white/70 hover:text-agtech-lime transition-colors"
              >
                {link.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => navigateToPage('register')}
              className="label-mono px-5 py-2 bg-agtech-lime text-agtech-black rounded-lg hover:bg-agtech-lime/90 transition-colors"
            >
              Register
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-agtech-white p-2.5 rounded-md border border-agtech-white/20 bg-agtech-black/35"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[99] bg-agtech-black/98 backdrop-blur-lg transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-full overflow-y-auto pt-24 pb-8">
          <div className="mx-auto w-full max-w-md px-6">
            <nav className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => navigateToPage('')}
                className="w-full text-left font-display font-black text-3xl sm:text-4xl leading-tight text-agtech-white hover:text-agtech-lime transition-colors py-2"
              >
                Home
              </button>

              <button
                type="button"
                onClick={() => setIsMobilePeopleOpen((prev) => !prev)}
                aria-expanded={isMobilePeopleOpen}
                aria-controls="mobile-people-links"
                className="w-full flex items-center justify-between font-display font-black text-3xl sm:text-4xl leading-tight text-agtech-white hover:text-agtech-lime transition-colors py-2"
              >
                <span>People</span>
                <ChevronDown
                  size={22}
                  className={`transition-transform duration-300 ${isMobilePeopleOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                id="mobile-people-links"
                className={`overflow-hidden transition-all duration-300 ${
                  isMobilePeopleOpen ? 'max-h-64 opacity-100 mt-1 mb-3' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="ml-3 pl-4 border-l border-agtech-white/15 flex flex-col gap-1">
                  {peopleLinks.map((link) => (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => navigateToSection(link.href)}
                      className="w-full text-left font-display font-bold text-xl leading-tight text-agtech-sage hover:text-agtech-lime transition-colors py-1.5"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              {pageLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => navigateToPage(link.href)}
                  className="w-full text-left font-display font-black text-3xl sm:text-4xl leading-tight text-agtech-white hover:text-agtech-lime transition-colors py-2"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigateToPage('register')}
                className="px-8 py-3 bg-agtech-lime text-agtech-black rounded-lg font-display font-bold"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
