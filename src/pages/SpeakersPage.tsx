import { useEffect, useState } from 'react';
import { Search, Linkedin, Facebook, Twitter, Globe } from 'lucide-react';
import Navbar from '../components/navigation/Navbar';
import GuidingMindsSection from '../sections/GuidingMindsSection';
import { speakersApi, subscribeDatabase, type Speaker } from '../data/database';

const speakerTypes = [
  { id: 'all', label: 'All' },
  { id: 'keynote', label: 'Keynote Speaker' },
  { id: 'session', label: 'Session Speaker' },
  { id: 'panelist', label: 'Panelist' },
];

const SpeakersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [speakers, setSpeakers] = useState<Speaker[]>(speakersApi.getAll());

  useEffect(() => {
    return subscribeDatabase(() => {
      setSpeakers(speakersApi.getAll());
    });
  }, []);

  const filteredSpeakers = speakers.filter((speaker) => {
    const matchesSearch =
      speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || speaker.type === selectedType;
    return matchesSearch && matchesType;
  });

  const stats = {
    speakers: speakers.length,
    sessions: 30,
    workshops: 20,
  };

  return (
    <div className="relative bg-agtech-black min-h-screen">
      <div className="grain-overlay" />
      <Navbar />

      <main className="relative pt-24 md:pt-28 pb-16">
        <div className="px-4 md:px-8 lg:px-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="headline-display text-agtech-white mb-4">AgTech Summit 2026 Speakers</h1>
            <p className="body-text text-agtech-sage mb-8">
              Leading the conversation on Agricultural Innovation in Bangalore, India. Join global
              experts from around the world.
            </p>

            <a href="#people-speakers" className="btn-primary mb-10 inline-flex">
              Speak at AgTech Summit
            </a>

            <div className="flex justify-center gap-4 md:gap-6 mb-10">
              {[
                { value: `${stats.speakers}+`, label: 'SPEAKERS' },
                { value: `${stats.sessions}+`, label: 'SESSIONS' },
                { value: `${stats.workshops}+`, label: 'WORKSHOPS' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-agtech-white/5 border border-agtech-white/10 rounded-full px-4 md:px-6 py-2"
                >
                  <span className="font-display font-bold text-agtech-lime text-lg md:text-xl">
                    {stat.value}
                  </span>
                  <span className="label-mono text-agtech-sage text-[10px] ml-2">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="relative max-w-xl mx-auto mb-6">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-agtech-sage" />
              <input
                type="text"
                placeholder="Search speakers, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-full pl-12 pr-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {speakerTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type.id
                      ? 'bg-agtech-lime text-agtech-black'
                      : 'bg-agtech-white/10 text-agtech-white hover:bg-agtech-white/20'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            {filteredSpeakers.length === 0 ? (
              <div className="text-center py-16">
                <p className="body-text text-agtech-sage">No speakers found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpeakers.map((speaker) => (
                  <div
                    key={speaker.id}
                    className="group bg-agtech-green/20 border border-agtech-white/10 rounded-2xl overflow-hidden hover:border-agtech-lime/50 transition-all"
                  >
                    <div className="aspect-square bg-gradient-to-br from-agtech-green/40 to-agtech-black/60 relative overflow-hidden">
                      {speaker.image ? (
                        <img
                          src={speaker.image}
                          alt={speaker.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-agtech-lime/20 flex items-center justify-center">
                            <span className="font-display font-bold text-agtech-lime text-3xl">
                              {speaker.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${
                            speaker.type === 'keynote'
                              ? 'bg-agtech-lime text-agtech-black'
                              : speaker.type === 'session'
                                ? 'bg-blue-500 text-white'
                                : 'bg-purple-500 text-white'
                          }`}
                        >
                          {speaker.type.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-display font-bold text-agtech-white text-lg mb-1">{speaker.name}</h3>
                      <p className="text-agtech-lime text-sm mb-1">{speaker.title}</p>
                      <p className="text-agtech-sage text-sm mb-3">{speaker.company}</p>
                      <p className="text-agtech-sage/70 text-xs mb-4">{speaker.location}</p>

                      <div className="flex gap-2">
                        {speaker.linkedin && (
                          <a
                            href={speaker.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-agtech-white/10 flex items-center justify-center text-agtech-sage hover:bg-agtech-lime hover:text-agtech-black transition-colors"
                          >
                            <Linkedin size={14} />
                          </a>
                        )}
                        {speaker.facebook && (
                          <a
                            href={speaker.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-agtech-white/10 flex items-center justify-center text-agtech-sage hover:bg-agtech-lime hover:text-agtech-black transition-colors"
                          >
                            <Facebook size={14} />
                          </a>
                        )}
                        {speaker.twitter && (
                          <a
                            href={speaker.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-agtech-white/10 flex items-center justify-center text-agtech-sage hover:bg-agtech-lime hover:text-agtech-black transition-colors"
                          >
                            <Twitter size={14} />
                          </a>
                        )}
                        {speaker.website && (
                          <a
                            href={speaker.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-agtech-white/10 flex items-center justify-center text-agtech-sage hover:bg-agtech-lime hover:text-agtech-black transition-colors"
                          >
                            <Globe size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <GuidingMindsSection />
      </main>
    </div>
  );
};

export default SpeakersPage;
