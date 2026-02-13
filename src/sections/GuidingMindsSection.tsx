import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Facebook, Linkedin, Twitter, X } from 'lucide-react';
import {
  committeeMembersApi,
  leadershipApplicationsApi,
  speakersApi,
  subscribeDatabase,
  type CommitteeMember,
  type LeadershipApplication,
  type Speaker,
} from '../data/database';
import { imageFileToDataUrl } from '../lib/imageUpload';
import { extractFacebookId, extractLinkedinId, extractTwitterHandle } from '../lib/socialParsers';

type ApplicationTrack = LeadershipApplication['track'];

interface ApplicationFormState {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  title: string;
  organization: string;
  location: string;
  speakerType: Speaker['type'];
  bio: string;
  profileImage: string | null;
  linkedinUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedinId?: string;
  facebookId?: string;
  twitterHandle?: string;
}

const initialFormState: ApplicationFormState = {
  fullName: '',
  email: '',
  phone: '',
  whatsapp: '',
  title: '',
  organization: '',
  location: '',
  speakerType: 'session',
  bio: '',
  profileImage: null,
  linkedinUrl: '',
  facebookUrl: '',
  twitterUrl: '',
  linkedinId: undefined,
  facebookId: undefined,
  twitterHandle: undefined,
};

const trackCopy: Record<ApplicationTrack, { title: string; button: string }> = {
  advisor: { title: 'Become an Advisor', button: 'Apply as Advisor' },
  organizing_committee: {
    title: 'Join Our Organizing Committee',
    button: 'Apply for Committee',
  },
  speaker: { title: 'Speak at AgTech Summit', button: 'Apply as Speaker' },
};

const PersonCard = ({
  image,
  name,
  line1,
  line2,
  line3,
  linkedin,
  facebook,
  twitter,
}: {
  image: string | null;
  name: string;
  line1: string;
  line2: string;
  line3?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
}) => (
  <article className="group bg-[#081425]/70 border border-[#1A2F4D] rounded-2xl p-4 sm:p-5 hover:border-agtech-cyan/45 transition-colors">
    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-agtech-black/70 mb-4">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-agtech-cyan/20 to-agtech-black">
          <span className="font-display text-4xl text-agtech-cyan/70">{name.charAt(0)}</span>
        </div>
      )}
    </div>
    <h4 className="font-display font-bold text-agtech-white text-lg leading-tight">{name}</h4>
    <p className="text-agtech-lime text-sm mt-1">{line1}</p>
    <p className="label-mono text-agtech-sage text-[10px] mt-1">{line2}</p>
    {line3 ? <p className="label-mono text-agtech-sage/80 text-[10px] mt-1">{line3}</p> : null}
    <div className="mt-4 flex items-center gap-2">
      {linkedin ? (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 rounded-full bg-agtech-white/10 flex items-center justify-center text-agtech-sage hover:bg-agtech-lime hover:text-agtech-black transition-colors"
          aria-label={`${name} LinkedIn`}
        >
          <Linkedin size={13} />
        </a>
      ) : null}
      {facebook ? (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 rounded-full bg-agtech-white/10 flex items-center justify-center text-agtech-sage hover:bg-agtech-lime hover:text-agtech-black transition-colors"
          aria-label={`${name} Facebook`}
        >
          <Facebook size={13} />
        </a>
      ) : null}
      {twitter ? (
        <a
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 rounded-full bg-agtech-white/10 flex items-center justify-center text-agtech-sage hover:bg-agtech-lime hover:text-agtech-black transition-colors"
          aria-label={`${name} Twitter`}
        >
          <Twitter size={13} />
        </a>
      ) : null}
    </div>
  </article>
);

const GuidingMindsSection = () => {
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>(committeeMembersApi.getAll());
  const [speakers, setSpeakers] = useState<Speaker[]>(speakersApi.getAll());
  const [activeFormTrack, setActiveFormTrack] = useState<ApplicationTrack | null>(null);
  const [formState, setFormState] = useState<ApplicationFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    return subscribeDatabase(() => {
      setCommitteeMembers(committeeMembersApi.getAll());
      setSpeakers(speakersApi.getAll());
    });
  }, []);

  const advisoryMembers = useMemo(
    () => committeeMembers.filter((member) => member.category === 'advisory'),
    [committeeMembers]
  );
  const organizingMembers = useMemo(
    () => committeeMembers.filter((member) => member.category === 'organizing'),
    [committeeMembers]
  );

  const openForm = (track: ApplicationTrack) => {
    setActiveFormTrack(track);
    setFormState(initialFormState);
    setFormError('');
  };

  const closeForm = () => {
    setActiveFormTrack(null);
    setFormState(initialFormState);
    setFormError('');
  };

  const setSocialIdentity = (field: 'linkedinUrl' | 'facebookUrl' | 'twitterUrl', value: string) => {
    const nextState: Partial<ApplicationFormState> = { [field]: value };
    if (field === 'linkedinUrl') {
      nextState.linkedinId = extractLinkedinId(value);
    }
    if (field === 'facebookUrl') {
      nextState.facebookId = extractFacebookId(value);
    }
    if (field === 'twitterUrl') {
      nextState.twitterHandle = extractTwitterHandle(value);
    }
    setFormState((prev) => ({ ...prev, ...nextState }));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setFormError('');
      const image = await imageFileToDataUrl(file, { maxSizeMB: 5, maxWidth: 1200, quality: 0.82 });
      setFormState((prev) => ({ ...prev, profileImage: image }));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to process image.');
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!activeFormTrack) return;

    setIsSubmitting(true);
    setFormError('');
    try {
      leadershipApplicationsApi.create({
        track: activeFormTrack,
        fullName: formState.fullName.trim(),
        email: formState.email.trim(),
        phone: formState.phone.trim(),
        whatsapp: formState.whatsapp.trim(),
        title: formState.title.trim(),
        organization: formState.organization.trim(),
        location: formState.location.trim(),
        speakerType: activeFormTrack === 'speaker' ? formState.speakerType : undefined,
        bio: formState.bio.trim(),
        profileImage: formState.profileImage,
        linkedinUrl: formState.linkedinUrl.trim() || undefined,
        facebookUrl: formState.facebookUrl.trim() || undefined,
        twitterUrl: formState.twitterUrl.trim() || undefined,
        linkedinId: formState.linkedinId,
        facebookId: formState.facebookId,
        twitterHandle: formState.twitterHandle,
      });

      setFormSuccess(`Application submitted for ${trackCopy[activeFormTrack].title}.`);
      closeForm();
      window.setTimeout(() => setFormSuccess(''), 4500);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="people" className="relative w-full py-20 sm:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-10">
          <span className="label-mono text-agtech-lime text-xs tracking-[0.24em] block mb-3">THE GUIDING MINDS</span>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-agtech-white">Advisory Board</h2>
          <p className="text-agtech-sage text-sm sm:text-base mt-2 max-w-3xl">
            Industry veterans and research pioneers ensuring the highest standards of quality and impact.
          </p>
          <div className="mt-4">
            <button onClick={() => openForm('advisor')} className="btn-secondary">
              Become an Advisor
            </button>
          </div>
        </div>

        {formSuccess ? (
          <div className="mb-6 rounded-xl border border-agtech-cyan/35 bg-agtech-cyan/10 px-4 py-3 text-sm text-agtech-white">
            {formSuccess}
          </div>
        ) : null}

        <div id="advisory" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {advisoryMembers.length === 0 ? (
            <p className="col-span-full text-agtech-sage">No advisory board profiles yet. Add them from admin panel.</p>
          ) : (
            advisoryMembers.map((member) => (
              <PersonCard
                key={member.id}
                image={member.image}
                name={member.name}
                line1={member.role}
                line2={member.organization}
                line3={member.location}
                linkedin={member.linkedin}
                facebook={member.facebook}
                twitter={member.twitter}
              />
            ))
          )}
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-display font-black text-3xl text-agtech-white">Organizing Committee</h3>
          <button onClick={() => openForm('organizing_committee')} className="btn-secondary">
            Join Our Organizing Committee
          </button>
        </div>
        <div id="committee" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {organizingMembers.length === 0 ? (
            <p className="col-span-full text-agtech-sage">No organizing committee profiles yet. Add them from admin panel.</p>
          ) : (
            organizingMembers.map((member) => (
              <PersonCard
                key={member.id}
                image={member.image}
                name={member.name}
                line1={member.role}
                line2={member.organization}
                line3={member.location}
                linkedin={member.linkedin}
                facebook={member.facebook}
                twitter={member.twitter}
              />
            ))
          )}
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-display font-black text-3xl text-agtech-white">Speakers</h3>
          <button onClick={() => openForm('speaker')} className="btn-secondary">
            Speak at AgTech Summit
          </button>
        </div>
        <div id="people-speakers" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {speakers.length === 0 ? (
            <p className="col-span-full text-agtech-sage">No speaker profiles yet. Add them from admin panel.</p>
          ) : (
            speakers.map((speaker) => (
              <PersonCard
                key={speaker.id}
                image={speaker.image}
                name={speaker.name}
                line1={speaker.title}
                line2={speaker.company}
                line3={speaker.location}
                linkedin={speaker.linkedin}
                facebook={speaker.facebook}
                twitter={speaker.twitter}
              />
            ))
          )}
        </div>
      </div>

      {activeFormTrack ? (
        <div className="fixed inset-0 z-[210] bg-agtech-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-agtech-white text-xl">{trackCopy[activeFormTrack].title}</h2>
              <button onClick={closeForm} className="text-agtech-sage hover:text-agtech-white">
                <X size={20} />
              </button>
            </div>

            {formError ? (
              <div className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                {formError}
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-1 block">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={formState.fullName}
                    onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                </div>
                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-1 block">Email *</label>
                  <input
                    required
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                </div>
                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-1 block">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                </div>
                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-1 block">WhatsApp Number *</label>
                  <input
                    required
                    type="tel"
                    value={formState.whatsapp}
                    onChange={(e) => setFormState((prev) => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                </div>
                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-1 block">Title / Position *</label>
                  <input
                    required
                    type="text"
                    value={formState.title}
                    onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                </div>
                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-1 block">Organization *</label>
                  <input
                    required
                    type="text"
                    value={formState.organization}
                    onChange={(e) => setFormState((prev) => ({ ...prev, organization: e.target.value }))}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-agtech-sage text-xs mb-1 block">Location *</label>
                <input
                  required
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                />
              </div>

              {activeFormTrack === 'speaker' ? (
                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-1 block">Speaker Type *</label>
                  <select
                    value={formState.speakerType}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, speakerType: e.target.value as Speaker['type'] }))
                    }
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  >
                    <option value="keynote">Keynote Speaker</option>
                    <option value="session">Session Speaker</option>
                    <option value="panelist">Panelist</option>
                  </select>
                </div>
              ) : null}

              <div>
                <label className="label-mono text-agtech-sage text-xs mb-1 block">Bio *</label>
                <textarea
                  required
                  rows={3}
                  value={formState.bio}
                  onChange={(e) => setFormState((prev) => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                />
              </div>

              <div>
                <label className="label-mono text-agtech-sage text-xs mb-1 block">Profile Photo Upload</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-agtech-sage text-sm" />
                {formState.profileImage ? (
                  <div className="mt-3 flex items-center gap-4">
                    <img src={formState.profileImage} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-agtech-white/20" />
                    <button
                      type="button"
                      onClick={() => setFormState((prev) => ({ ...prev, profileImage: null }))}
                      className="px-3 py-2 bg-agtech-white/10 text-agtech-sage rounded-lg hover:bg-agtech-white/20 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-1 block">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formState.linkedinUrl}
                    onChange={(e) => setSocialIdentity('linkedinUrl', e.target.value)}
                    onBlur={(e) => setSocialIdentity('linkedinUrl', e.target.value)}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSocialIdentity('linkedinUrl', formState.linkedinUrl)}
                    className="mt-2 text-xs px-2 py-1 bg-agtech-white/10 text-agtech-sage rounded hover:bg-agtech-white/20"
                  >
                    Extract ID
                  </button>
                  {formState.linkedinId ? <p className="text-agtech-lime text-xs mt-1">ID: {formState.linkedinId}</p> : null}
                </div>
                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-1 block">Facebook URL</label>
                  <input
                    type="url"
                    value={formState.facebookUrl}
                    onChange={(e) => setSocialIdentity('facebookUrl', e.target.value)}
                    onBlur={(e) => setSocialIdentity('facebookUrl', e.target.value)}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSocialIdentity('facebookUrl', formState.facebookUrl)}
                    className="mt-2 text-xs px-2 py-1 bg-agtech-white/10 text-agtech-sage rounded hover:bg-agtech-white/20"
                  >
                    Extract ID
                  </button>
                  {formState.facebookId ? <p className="text-agtech-lime text-xs mt-1">ID: {formState.facebookId}</p> : null}
                </div>
                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-1 block">X / Twitter URL</label>
                  <input
                    type="url"
                    value={formState.twitterUrl}
                    onChange={(e) => setSocialIdentity('twitterUrl', e.target.value)}
                    onBlur={(e) => setSocialIdentity('twitterUrl', e.target.value)}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSocialIdentity('twitterUrl', formState.twitterUrl)}
                    className="mt-2 text-xs px-2 py-1 bg-agtech-white/10 text-agtech-sage rounded hover:bg-agtech-white/20"
                  >
                    Extract ID
                  </button>
                  {formState.twitterHandle ? (
                    <p className="text-agtech-lime text-xs mt-1">Handle: @{formState.twitterHandle}</p>
                  ) : null}
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full btn-primary mt-4 disabled:opacity-60">
                {isSubmitting ? 'Submitting...' : trackCopy[activeFormTrack].button}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default GuidingMindsSection;
