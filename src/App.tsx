import { useState, useEffect } from 'react';
import Navbar from './components/navigation/Navbar';
import AnimatedBackground from './components/background/AnimatedBackground';
import SiteFooter from './components/layout/SiteFooter';
import HeroSection from './sections/HeroSection';
import CrisisSection from './sections/CrisisSection';
import DifferentiatorsSection from './sections/DifferentiatorsSection';
import ImpactSection from './sections/ImpactSection';
import GuidingMindsSection from './sections/GuidingMindsSection';
import EventFormatSection from './sections/EventFormatSection';
import VenueSpotlightSection from './sections/VenueSpotlightSection';
import TransparencySection from './sections/TransparencySection';
import RegistrationTiersSection from './sections/RegistrationTiersSection';
import FAQSection from './sections/FAQSection';
import FinalCTASection from './sections/FinalCTASection';
import RegistrationPage from './pages/RegistrationPage';
import SubmissionsPage from './pages/SubmissionsPage';
import SpeakersPage from './pages/SpeakersPage';
import SessionsPage from './pages/SessionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './admin/AdminDashboard';
import './App.css';

const ROUTE_HASHES = new Set([
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

// Simple router using URL hash
function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => window.location.hash.replace('#', '') || 'home');

  useEffect(() => {
    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      setCurrentPage(newHash || 'home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Scroll behavior for routes and home-page section anchors
  useEffect(() => {
    if (!currentPage || currentPage === 'home' || ROUTE_HASHES.has(currentPage)) {
      window.scrollTo(0, 0);
      return;
    }

    const timer = window.setTimeout(() => {
      const section = document.getElementById(currentPage);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo(0, 0);
      }
    }, 80);

    return () => window.clearTimeout(timer);
  }, [currentPage]);

  // Render different pages based on hash
  switch (currentPage) {
    case 'register':
    case 'registration':
      return <RegistrationPage />;
    case 'submissions':
    case 'call-for-papers':
      return <SubmissionsPage />;
    case 'speakers':
      return <SpeakersPage />;
    case 'sessions':
      return <SessionsPage />;
    case 'about':
      return <AboutPage />;
    case 'contact':
      return <ContactPage />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <div className="relative min-h-screen overflow-x-clip bg-agtech-black">
          <AnimatedBackground />

          {/* Navigation */}
          <Navbar />

          {/* Main Content */}
          <main className="relative z-10">
            {/* Section 1: Hero - Immersive 3D Experience */}
            <HeroSection />

            {/* Section 2: Crisis Statement - Split Screen Parallax */}
            <CrisisSection />

            {/* Section 3: What Makes Us Different - Card Stack */}
            <DifferentiatorsSection />

            {/* Section 4: Impact Visualization - Animated Dashboard */}
            <ImpactSection />

            {/* Section 4.5: Guiding Minds - Advisory/Committee/Speakers */}
            <GuidingMindsSection />

            {/* Section 5: Event Format Preview - Horizontal Scroll */}
            <EventFormatSection />

            {/* Section 5.5: Venue Spotlight */}
            <VenueSpotlightSection />

            {/* Section 6: Transparency Manifesto - Comparison Table */}
            <TransparencySection />

            {/* Section 7: Registration Tiers - 3D Flip Cards */}
            <RegistrationTiersSection />

            {/* Section 8: FAQ - Searchable Accordion */}
            <FAQSection />

            {/* Section 9: Final CTA - Animated Sunrise */}
            <FinalCTASection />
          </main>

          <SiteFooter />
        </div>
      );
  }
}

export default App;
