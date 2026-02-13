import { useEffect, useState } from 'react';
import { Download, MapPin, Clock } from 'lucide-react';
import Navbar from '../components/navigation/Navbar';
import { sessionsApi, speakersApi, subscribeDatabase } from '../data/database';

const days = [
  { id: 'day1', label: 'Day 1', date: 'Nov 21' },
  { id: 'day2', label: 'Day 2', date: 'Nov 22' },
];

const tracks = [
  { id: 'all', label: 'All' },
  { id: 'keynote', label: 'Keynote' },
  { id: 'agtech', label: 'AgTech' },
  { id: 'policy', label: 'Policy' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'social', label: 'Social' },
];

const sessionTypeColors: Record<string, string> = {
  keynote: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  session: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  workshop: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  panel: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  social: 'bg-agtech-cyan/20 text-agtech-cyan border-agtech-cyan/35',
};

const SessionsPage = () => {
  const [selectedDay, setSelectedDay] = useState('day1');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [allSessions, setAllSessions] = useState(sessionsApi.getAll());

  useEffect(() => {
    return subscribeDatabase(() => {
      setAllSessions(sessionsApi.getAll());
    });
  }, []);
  
  const filteredSessions = allSessions.filter((session) => {
    const matchesDay = session.day === selectedDay;
    const matchesTrack = selectedTrack === 'all' || session.track === selectedTrack;
    return matchesDay && matchesTrack;
  });

  // Group sessions by time
  const groupedSessions = filteredSessions.reduce((acc, session) => {
    if (!acc[session.time]) {
      acc[session.time] = [];
    }
    acc[session.time].push(session);
    return acc;
  }, {} as Record<string, typeof allSessions>);

  const sortedTimes = Object.keys(groupedSessions).sort();

  return (
    <div className="relative bg-agtech-black min-h-screen">
      <div className="grain-overlay" />
      <Navbar />
      
      <main className="relative pt-24 md:pt-28 pb-16">
        {/* Hero Section */}
        <div className="px-4 md:px-8 lg:px-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="headline-display text-agtech-white mb-4">
              World-Class Agenda
            </h1>
            <p className="body-text text-agtech-sage mb-8">
              Join 3,000+ pioneers for 2 days of groundbreaking keynotes, technical workshops, 
              and unparalleled networking in Bangalore, India.
            </p>

            <button className="btn-primary flex items-center gap-2 mx-auto mb-10">
              <Download size={18} />
              Download Full Agenda
            </button>

            {/* Day Selector */}
            <div className="flex justify-center gap-4 mb-8">
              {days.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`px-6 py-3 rounded-xl border-2 transition-all ${
                    selectedDay === day.id
                      ? 'border-agtech-lime bg-agtech-lime/10'
                      : 'border-agtech-white/20 hover:border-agtech-white/40'
                  }`}
                >
                  <span className="label-mono text-agtech-sage text-[10px] block">{day.label}</span>
                  <span className={`font-display font-bold ${selectedDay === day.id ? 'text-agtech-lime' : 'text-agtech-white'}`}>
                    {day.date}
                  </span>
                </button>
              ))}
            </div>

            {/* Track Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {tracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTrack === track.id
                      ? 'bg-agtech-lime text-agtech-black'
                      : 'bg-agtech-white/10 text-agtech-white hover:bg-agtech-white/20'
                  }`}
                >
                  {track.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions Timeline */}
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {sortedTimes.length === 0 ? (
              <div className="text-center py-16">
                <p className="body-text text-agtech-sage">No sessions found for the selected filters.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedTimes.map((time) => (
                  <div key={time}>
                    {/* Time Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-agtech-lime">
                        <Clock size={16} />
                        <span className="font-display font-bold">{time}</span>
                      </div>
                      <div className="flex-1 h-px bg-agtech-white/10" />
                    </div>

                    {/* Sessions at this time */}
                    <div className="space-y-4">
                      {groupedSessions[time].map((session) => {
                        const speaker = session.speakerId ? speakersApi.getById(session.speakerId) : null;
                        
                        return (
                          <div
                            key={session.id}
                            className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl p-5 hover:border-agtech-lime/30 transition-colors"
                          >
                            <div className="flex flex-wrap items-start gap-3 mb-3">
                              <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${sessionTypeColors[session.type]}`}>
                                {session.type.toUpperCase()}
                              </span>
                              <span className="text-agtech-sage text-xs flex items-center gap-1">
                                <MapPin size={12} />
                                {session.venue}
                              </span>
                            </div>

                            <h3 className="font-display font-bold text-agtech-white text-lg mb-2">
                              {session.title}
                            </h3>
                            <p className="body-text text-agtech-sage text-sm mb-4">
                              {session.description}
                            </p>

                            {speaker && (
                              <div className="flex items-center gap-3 pt-3 border-t border-agtech-white/10">
                                <div className="w-8 h-8 rounded-full bg-agtech-lime/20 flex items-center justify-center">
                                  <span className="font-display font-bold text-agtech-lime text-sm">
                                    {speaker.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-agtech-white text-sm font-medium">{speaker.name}</p>
                                  <p className="text-agtech-sage text-xs">{speaker.title}, {speaker.company}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SessionsPage;


