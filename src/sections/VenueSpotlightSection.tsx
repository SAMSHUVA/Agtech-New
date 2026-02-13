import { Building2, MapPin, ShieldCheck, Wifi } from 'lucide-react';

const VenueSpotlightSection = () => {
  return (
    <section id="venue-spotlight" className="relative w-full py-20 sm:py-24 bg-transparent overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-agtech-black/70 via-agtech-green/10 to-agtech-black/75" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-8 sm:mb-10 text-center">
          <span className="label-mono text-agtech-lime text-sm tracking-widest">VENUE SPOTLIGHT</span>
          <h3 className="mt-3 font-display font-black text-agtech-white text-3xl sm:text-5xl">
            ITC Gardenia, <span className="text-agtech-lime">Bangalore</span>
          </h3>
          <p className="mt-3 text-agtech-sage max-w-2xl mx-auto">
            Premium venue experience with dedicated conference halls, networking lounges, and seamless hybrid broadcasting support.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] items-stretch">
          <div className="relative rounded-3xl overflow-hidden border border-agtech-white/10 min-h-[320px] sm:min-h-[420px]">
            <img
              src="/venue_itc.jpg"
              alt="ITC Gardenia venue"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-agtech-black/80 via-agtech-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
              <p className="label-mono text-agtech-lime mb-2">CONFIRMED VENUE</p>
              <p className="font-display font-black text-agtech-white text-2xl sm:text-4xl leading-tight">
                2-Day Physical + Hybrid Experience
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-agtech-white/10 bg-agtech-black/55 backdrop-blur-md p-6 sm:p-8">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-agtech-lime" />
                <div>
                  <p className="font-display font-bold text-agtech-white text-lg">Central Location</p>
                  <p className="text-agtech-sage text-sm">Easy airport and metro access for both Indian and international delegates.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 mt-0.5 text-agtech-lime" />
                <div>
                  <p className="font-display font-bold text-agtech-white text-lg">Premium Infrastructure</p>
                  <p className="text-agtech-sage text-sm">High-capacity conference rooms, expo-ready spaces, and breakout zones.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wifi className="w-5 h-5 mt-0.5 text-agtech-lime" />
                <div>
                  <p className="font-display font-bold text-agtech-white text-lg">Hybrid Ready</p>
                  <p className="text-agtech-sage text-sm">Reliable connectivity and AV setup for live streaming and virtual participation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 mt-0.5 text-agtech-lime" />
                <div>
                  <p className="font-display font-bold text-agtech-white text-lg">On-ground Operations</p>
                  <p className="text-agtech-sage text-sm">Managed check-in, guided venue flow, and dedicated attendee support desks.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueSpotlightSection;
