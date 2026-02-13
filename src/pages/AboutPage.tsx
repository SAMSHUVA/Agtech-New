import { useEffect, useState } from 'react';
import { BookOpen, Globe, Shield, Users, Award, Target, Lightbulb, Heart } from 'lucide-react';
import Navbar from '../components/navigation/Navbar';
import GuidingMindsSection from '../sections/GuidingMindsSection';
import { committeeMembersApi, subscribeDatabase, type CommitteeMember } from '../data/database';

const corePillars = [
  {
    icon: <BookOpen size={28} />,
    title: 'Scientific Rigor',
    description: 'Peer-reviewed tracks, qualified program committees, and transparent selection standards.',
  },
  {
    icon: <Globe size={28} />,
    title: 'Global Collaboration',
    description: 'A multidisciplinary network across academia, industry, and policy ecosystems.',
  },
  {
    icon: <Shield size={28} />,
    title: 'Responsible Innovation',
    description: 'Research translation that prioritizes ethics, safety, and human-centered outcomes.',
  },
];

const stats = [
  { value: '50+', label: 'Countries' },
  { value: '10k+', label: 'Members' },
  { value: '200+', label: 'IAISR Events' },
];

const AboutPage = () => {
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>(
    committeeMembersApi.getAll()
  );

  useEffect(() => {
    return subscribeDatabase(() => {
      setCommitteeMembers(committeeMembersApi.getAll());
    });
  }, []);

  return (
    <div className="relative bg-agtech-black min-h-screen">
      <div className="grain-overlay" />
      <Navbar />

      <main className="relative pt-24 md:pt-28 pb-16">
        <div className="px-4 md:px-8 lg:px-12 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="label-mono text-agtech-lime mb-4 block">ABOUT IAISR</span>
                <h1 className="headline-section text-agtech-white mb-6">
                  Building the Research Ecosystem Behind{' '}
                  <span className="text-agtech-lime">AgTech Transformation Summit</span>
                </h1>
                <p className="body-text text-agtech-sage mb-8">
                  IAISR supports a global community of researchers, educators, and practitioners.
                  AgTech Summit 2026 is one of our flagship forums designed to connect frontier
                  science with real-world deployment in agricultural innovation.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a href="#register" className="btn-primary">
                    Join AgTech Transformation Summit
                  </a>
                  <a href="#submissions" className="btn-secondary">
                    Submit a Paper
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-agtech-lime/20 to-transparent rounded-3xl blur-3xl" />
                <div className="relative bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-8">
                  <span className="label-mono text-agtech-sage mb-4 block">FOCUS</span>
                  <h2 className="font-display font-bold text-agtech-white text-2xl md:text-3xl mb-4">
                    AI Systems, Robotics, and Ethical Deployment
                  </h2>
                  <p className="body-text text-agtech-sage">
                    From foundational models to applied autonomy, IAISR programs align research
                    depth with practical impact in agricultural technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 lg:px-12 mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-agtech-white text-2xl md:text-3xl text-center mb-10">
              Core Pillars
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {corePillars.map((pillar, index) => (
                <div
                  key={index}
                  className="bg-agtech-green/20 border border-agtech-white/10 rounded-2xl p-6 hover:border-agtech-lime/30 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-agtech-lime/20 flex items-center justify-center mb-5">
                    <span className="text-agtech-lime">{pillar.icon}</span>
                  </div>
                  <h3 className="font-display font-bold text-agtech-white text-xl mb-3">{pillar.title}</h3>
                  <p className="body-text text-agtech-sage text-sm">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 lg:px-12 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-agtech-lime/12 to-agtech-cyan/22 border border-agtech-lime/20 rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-3 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="font-display font-black text-agtech-lime text-3xl md:text-5xl mb-2">
                      {stat.value}
                    </div>
                    <div className="label-mono text-agtech-sage text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 lg:px-12 mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-agtech-green/20 border border-agtech-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-agtech-lime/20 flex items-center justify-center">
                    <Target size={20} className="text-agtech-lime" />
                  </div>
                  <h3 className="font-display font-bold text-agtech-white text-xl">Our Mission</h3>
                </div>
                <p className="body-text text-agtech-sage">
                  To bridge the gap between agricultural research and real-world implementation,
                  fostering innovation that transforms farming practices and improves livelihoods
                  across India and beyond.
                </p>
              </div>

              <div className="bg-agtech-green/20 border border-agtech-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-agtech-lime/20 flex items-center justify-center">
                    <Lightbulb size={20} className="text-agtech-lime" />
                  </div>
                  <h3 className="font-display font-bold text-agtech-white text-xl">Our Vision</h3>
                </div>
                <p className="body-text text-agtech-sage">
                  A world where cutting-edge agricultural technology is accessible to every farmer,
                  enabling sustainable, efficient, and profitable farming for generations to come.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 lg:px-12 mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-agtech-white text-2xl md:text-3xl text-center mb-10">
              Program Committee
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {committeeMembers.length === 0 && (
                <div className="col-span-full text-center text-agtech-sage py-8">
                  No committee members configured yet. Add them from Admin Panel.
                </div>
              )}
              {committeeMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-agtech-green/20 border border-agtech-white/10 rounded-2xl p-6 hover:border-agtech-lime/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-agtech-cyan/20 flex items-center justify-center mb-4">
                    <span className="text-agtech-cyan font-display font-bold text-lg">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-agtech-white">{member.name}</h4>
                  <p className="text-agtech-lime text-sm">{member.role}</p>
                  <p className="text-agtech-sage text-sm mt-1">{member.organization}</p>
                  <p className="text-agtech-sage/70 text-xs mb-3">{member.location}</p>
                  <p className="body-text text-agtech-sage text-sm">{member.bio}</p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-agtech-cyan text-sm hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-agtech-white text-2xl md:text-3xl text-center mb-10">
              Why Attend AgTech Summit 2026?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Users size={24} />, title: 'Network', desc: 'Connect with 3000+ industry leaders' },
                { icon: <Award size={24} />, title: 'Learn', desc: '50+ expert speakers sharing insights' },
                { icon: <Lightbulb size={24} />, title: 'Innovate', desc: 'Discover cutting-edge technologies' },
                { icon: <Heart size={24} />, title: 'Impact', desc: 'Shape the future of agriculture' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-agtech-black/50 border border-agtech-white/10 rounded-xl hover:border-agtech-lime/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-agtech-lime/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-agtech-lime">{item.icon}</span>
                  </div>
                  <h4 className="font-display font-bold text-agtech-white mb-2">{item.title}</h4>
                  <p className="body-text text-agtech-sage text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <GuidingMindsSection />
      </main>
    </div>
  );
};

export default AboutPage;
