// Local data layer for AgTech Summit.
// Persists to browser localStorage and notifies subscribers on every mutation.

export interface PaperSubmission {
  id: string;
  authorName: string;
  email: string;
  phone: string;
  country: string;
  paperTitle: string;
  organization: string;
  researchTrack: string;
  coAuthors: string;
  abstractFile: string | null;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected';
  submittedAt: string;
}

export interface Enquiry {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  country: string;
  message?: string;
  submittedAt: string;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  bio: string;
  type: 'keynote' | 'session' | 'panelist';
  image: string | null;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  linkedinId?: string;
  facebookId?: string;
  twitterHandle?: string;
  website?: string;
  createdAt: string;
}

export interface LeadershipApplication {
  id: string;
  track: 'advisor' | 'organizing_committee' | 'speaker';
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  title: string;
  organization: string;
  location: string;
  speakerType?: Speaker['type'];
  bio: string;
  profileImage: string | null;
  linkedinUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinId?: string;
  facebookId?: string;
  twitterHandle?: string;
  submittedAt: string;
  status: 'new' | 'reviewing' | 'approved' | 'rejected';
}

export interface SpeakerApplication {
  id: string;
  fullName: string;
  email: string;
  title: string;
  organization: string;
  location: string;
  type: Speaker['type'];
  bio: string;
  imageFile: string | null;
  submittedAt: string;
  status: 'new' | 'reviewing' | 'approved' | 'rejected';
}

export interface CommitteeMember {
  id: string;
  category: 'advisory' | 'organizing';
  name: string;
  role: string;
  organization: string;
  location: string;
  bio: string;
  image: string | null;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  linkedinId?: string;
  facebookId?: string;
  twitterHandle?: string;
  order: number;
  createdAt: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  time: string;
  endTime: string;
  day: 'day1' | 'day2';
  track: string;
  speakerId: string;
  venue: string;
  type: 'keynote' | 'session' | 'workshop' | 'panel' | 'social';
}

export interface Registration {
  id: string;
  passType: string;
  passId: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  country: string;
  dietaryRequirements?: string;
  couponCode?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed';
  registeredAt: string;
}

export interface ExitFeedback {
  id: string;
  step: number;
  reason: string;
  otherReason?: string;
  email?: string;
  submittedAt: string;
}

export interface PassTier {
  id: string;
  name: string;
  mode: 'in-person' | 'virtual';
  prices: Record<string, number>;
  badge: string;
  badgeColor: string;
  description: string;
}

interface DatabaseState {
  paperSubmissions: PaperSubmission[];
  enquiries: Enquiry[];
  speakers: Speaker[];
  leadershipApplications: LeadershipApplication[];
  speakerApplications: SpeakerApplication[];
  committeeMembers: CommitteeMember[];
  sessions: Session[];
  registrations: Registration[];
  exitFeedback: ExitFeedback[];
  passTiers: PassTier[];
}

const STORAGE_KEY = 'agtech_summit_db_v2';
const subscribers = new Set<() => void>();

const nowIso = () => new Date().toISOString();
const createId = () => `${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
const canUseStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const currencies: Record<string, { symbol: string; rate: number; name: string }> = {
  INR: { symbol: 'Rs', rate: 1, name: 'Indian Rupee' },
  USD: { symbol: '$', rate: 0.012, name: 'US Dollar' },
  EUR: { symbol: 'EUR', rate: 0.011, name: 'Euro' },
  GBP: { symbol: 'GBP', rate: 0.0094, name: 'British Pound' },
  AUD: { symbol: 'A$', rate: 0.018, name: 'Australian Dollar' },
  CAD: { symbol: 'C$', rate: 0.016, name: 'Canadian Dollar' },
  SGD: { symbol: 'S$', rate: 0.016, name: 'Singapore Dollar' },
  AED: { symbol: 'AED', rate: 0.044, name: 'UAE Dirham' },
};

const passTiersData: PassTier[] = [
  {
    id: 'early-bird',
    name: 'Early Bird',
    mode: 'in-person',
    prices: { INR: 12499, USD: 149, EUR: 139, GBP: 119, AUD: 229, CAD: 199, SGD: 199, AED: 549 },
    badge: 'LIMITED',
    badgeColor: 'bg-agtech-lime text-agtech-black',
    description: 'Best value for early registrants',
  },
  {
    id: 'regular',
    name: 'Regular',
    mode: 'in-person',
    prices: { INR: 17499, USD: 209, EUR: 194, GBP: 164, AUD: 319, CAD: 279, SGD: 279, AED: 769 },
    badge: 'POPULAR',
    badgeColor: 'bg-agtech-cyan text-agtech-black',
    description: 'Full conference experience',
  },
  {
    id: 'student',
    name: 'Student',
    mode: 'in-person',
    prices: { INR: 8749, USD: 104, EUR: 97, GBP: 82, AUD: 159, CAD: 139, SGD: 139, AED: 384 },
    badge: 'ECONOMY',
    badgeColor: 'bg-blue-500 text-white',
    description: 'Valid student ID required',
  },
  {
    id: 'e-oral',
    name: 'E-Oral',
    mode: 'virtual',
    prices: { INR: 6249, USD: 74, EUR: 69, GBP: 59, AUD: 114, CAD: 99, SGD: 99, AED: 274 },
    badge: 'REMOTE',
    badgeColor: 'bg-purple-500 text-white',
    description: 'Present your research virtually',
  },
  {
    id: 'e-poster',
    name: 'E-Poster',
    mode: 'virtual',
    prices: { INR: 4124, USD: 49, EUR: 45, GBP: 39, AUD: 75, CAD: 65, SGD: 65, AED: 180 },
    badge: 'REMOTE',
    badgeColor: 'bg-purple-500 text-white',
    description: 'Digital poster presentation',
  },
  {
    id: 'listener',
    name: 'Listener',
    mode: 'virtual',
    prices: { INR: 874, USD: 10, EUR: 9, GBP: 8, AUD: 16, CAD: 14, SGD: 14, AED: 38 },
    badge: 'DELEGATE',
    badgeColor: 'bg-orange-500 text-white',
    description: 'Access to all live streams',
  },
];

const createSeedDatabase = (): DatabaseState => {
  const seedTime = nowIso();

  return {
    paperSubmissions: [],
    enquiries: [],
    leadershipApplications: [],
    speakerApplications: [],
    registrations: [],
    exitFeedback: [],
    passTiers: passTiersData,
    speakers: [
      {
        id: 'spk_1',
        name: 'Dr. Rajesh Kumar',
        title: 'Chief Scientist',
        company: 'Indian Agricultural Research Institute',
        location: 'New Delhi, India',
        bio: 'Leading researcher in precision agriculture with 20+ years of experience.',
        type: 'keynote',
        image: null,
        linkedin: 'https://linkedin.com',
        createdAt: seedTime,
      },
      {
        id: 'spk_2',
        name: 'Dr. Priya Sharma',
        title: 'AgTech Founder',
        company: 'FarmAI Solutions',
        location: 'Bangalore, India',
        bio: 'Serial entrepreneur building AI solutions for smallholder farmers.',
        type: 'session',
        image: null,
        linkedin: 'https://linkedin.com',
        createdAt: seedTime,
      },
      {
        id: 'spk_3',
        name: 'Mr. Arun Patel',
        title: 'CEO',
        company: 'AgriTech Ventures',
        location: 'Mumbai, India',
        bio: 'Investor and advisor to multiple AgTech startups across Asia.',
        type: 'panelist',
        image: null,
        createdAt: seedTime,
      },
    ],
    committeeMembers: [
      {
        id: 'cm_1',
        category: 'organizing',
        name: 'Dr. Meera Iyer',
        role: 'Program Chair',
        organization: 'IAISR',
        location: 'Bangalore, India',
        bio: 'Leads summit program quality and scientific review standards.',
        image: null,
        linkedin: 'https://linkedin.com',
        order: 1,
        createdAt: seedTime,
      },
      {
        id: 'cm_2',
        category: 'organizing',
        name: 'Prof. Daniel Ross',
        role: 'Technical Committee',
        organization: 'Agri Robotics Lab',
        location: 'London, UK',
        bio: 'Focuses on robotics, autonomy, and applied farm intelligence systems.',
        image: null,
        linkedin: 'https://linkedin.com',
        order: 2,
        createdAt: seedTime,
      },
      {
        id: 'cm_3',
        category: 'advisory',
        name: 'Ms. Kavya Menon',
        role: 'Industry Advisory',
        organization: 'FarmChain Ventures',
        location: 'Singapore',
        bio: 'Connects startup pipelines with enterprise deployment pathways.',
        image: null,
        linkedin: 'https://linkedin.com',
        order: 3,
        createdAt: seedTime,
      },
    ],
    sessions: [
      {
        id: 'ses_1',
        title: 'Registration & Breakfast',
        description: 'Check-in, badge pickup, and morning networking with coffee and light refreshments.',
        time: '08:00 AM',
        endTime: '09:00 AM',
        day: 'day1',
        track: 'social',
        speakerId: '',
        venue: 'Grand Foyer',
        type: 'social',
      },
      {
        id: 'ses_2',
        title: 'Opening Keynote: The Future of AgTech in India',
        description: 'Exploring the next frontier where AI meets precision agriculture and autonomous farming.',
        time: '09:00 AM',
        endTime: '10:15 AM',
        day: 'day1',
        track: 'keynote',
        speakerId: 'spk_1',
        venue: 'Grand Ballroom',
        type: 'keynote',
      },
      {
        id: 'ses_3',
        title: 'Precision Agriculture: AI-Driven Crop Management',
        description: 'How AI and IoT sensors are optimizing irrigation, fertilization, and pest control.',
        time: '10:30 AM',
        endTime: '11:30 AM',
        day: 'day1',
        track: 'agtech',
        speakerId: 'spk_2',
        venue: 'Sands Hall A',
        type: 'session',
      },
    ],
  };
};

const db: DatabaseState = createSeedDatabase();

const clonePassTier = (tier: PassTier): PassTier => ({
  ...tier,
  prices: { ...tier.prices },
});

const persistDatabase = () => {
  if (!canUseStorage) {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Ignore storage failures and keep in-memory behavior as fallback.
  }
};

const notifySubscribers = () => {
  subscribers.forEach((subscriber) => subscriber());
};

const persistAndNotify = () => {
  persistDatabase();
  notifySubscribers();
};

const loadDatabase = () => {
  if (!canUseStorage) {
    return;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    persistDatabase();
    return;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DatabaseState>;

    if (Array.isArray(parsed.paperSubmissions)) db.paperSubmissions = parsed.paperSubmissions;
    if (Array.isArray(parsed.enquiries)) db.enquiries = parsed.enquiries;
    if (Array.isArray(parsed.speakers)) db.speakers = parsed.speakers;
    if (Array.isArray(parsed.leadershipApplications)) {
      db.leadershipApplications = parsed.leadershipApplications.map((application) => ({
        ...application,
        track: application.track || 'speaker',
        phone: application.phone || '',
        whatsapp: application.whatsapp || '',
        profileImage: application.profileImage || null,
      }));
    }
    if (Array.isArray(parsed.speakerApplications)) {
      db.speakerApplications = parsed.speakerApplications;
      if (db.leadershipApplications.length === 0) {
        db.leadershipApplications = parsed.speakerApplications.map((application) => ({
          id: application.id,
          track: 'speaker',
          fullName: application.fullName,
          email: application.email,
          phone: '',
          whatsapp: '',
          title: application.title,
          organization: application.organization,
          location: application.location,
          speakerType: application.type,
          bio: application.bio,
          profileImage: application.imageFile,
          submittedAt: application.submittedAt,
          status: application.status,
        }));
      }
    }
    if (Array.isArray(parsed.committeeMembers)) {
      db.committeeMembers = parsed.committeeMembers.map((member) => ({
        ...member,
        category:
          member.category ||
          (member.role?.toLowerCase().includes('advisory') ? 'advisory' : 'organizing'),
      }));
    }
    if (Array.isArray(parsed.sessions)) db.sessions = parsed.sessions;
    if (Array.isArray(parsed.registrations)) db.registrations = parsed.registrations;
    if (Array.isArray(parsed.exitFeedback)) db.exitFeedback = parsed.exitFeedback;
    if (Array.isArray(parsed.passTiers) && parsed.passTiers.length > 0) {
      db.passTiers = parsed.passTiers.map((tier) => ({
        ...tier,
        prices: { ...tier.prices },
      }));
    }
  } catch {
    persistDatabase();
  }
};

loadDatabase();

export const subscribeDatabase = (listener: () => void) => {
  subscribers.add(listener);
  return () => {
    subscribers.delete(listener);
  };
};

// Pass Tiers API
export const passTiersApi = {
  getAll: (): PassTier[] => db.passTiers.map(clonePassTier),
  getById: (id: string): PassTier | undefined => {
    const tier = db.passTiers.find((p) => p.id === id);
    return tier ? clonePassTier(tier) : undefined;
  },
  updatePrices: (id: string, prices: Record<string, number>): PassTier | null => {
    const index = db.passTiers.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }
    db.passTiers[index] = {
      ...db.passTiers[index],
      prices: { ...prices },
    };
    persistAndNotify();
    return clonePassTier(db.passTiers[index]);
  },
};

// Paper Submissions API
export const paperSubmissionsApi = {
  getAll: (): PaperSubmission[] => [...db.paperSubmissions],
  getById: (id: string): PaperSubmission | undefined => db.paperSubmissions.find((p) => p.id === id),
  create: (data: Omit<PaperSubmission, 'id' | 'submittedAt' | 'status'>): PaperSubmission => {
    const submission: PaperSubmission = {
      ...data,
      id: createId(),
      status: 'pending',
      submittedAt: nowIso(),
    };
    db.paperSubmissions.push(submission);
    persistAndNotify();
    return submission;
  },
  updateStatus: (id: string, status: PaperSubmission['status']): PaperSubmission | null => {
    const index = db.paperSubmissions.findIndex((p) => p.id === id);
    if (index === -1) {
      return null;
    }
    db.paperSubmissions[index] = { ...db.paperSubmissions[index], status };
    persistAndNotify();
    return db.paperSubmissions[index];
  },
  delete: (id: string): boolean => {
    const index = db.paperSubmissions.findIndex((p) => p.id === id);
    if (index === -1) {
      return false;
    }
    db.paperSubmissions.splice(index, 1);
    persistAndNotify();
    return true;
  },
};

// Enquiries API
export const enquiriesApi = {
  getAll: (): Enquiry[] => [...db.enquiries],
  create: (data: Omit<Enquiry, 'id' | 'submittedAt'>): Enquiry => {
    const enquiry: Enquiry = {
      ...data,
      id: createId(),
      submittedAt: nowIso(),
    };
    db.enquiries.push(enquiry);
    persistAndNotify();
    return enquiry;
  },
  delete: (id: string): boolean => {
    const index = db.enquiries.findIndex((e) => e.id === id);
    if (index === -1) {
      return false;
    }
    db.enquiries.splice(index, 1);
    persistAndNotify();
    return true;
  },
};

// Speaker Applications API
export const speakerApplicationsApi = {
  getAll: (): SpeakerApplication[] =>
    db.leadershipApplications
      .filter((application) => application.track === 'speaker')
      .map((application) => ({
        id: application.id,
        fullName: application.fullName,
        email: application.email,
        title: application.title,
        organization: application.organization,
        location: application.location,
        type: application.speakerType || 'session',
        bio: application.bio,
        imageFile: application.profileImage,
        submittedAt: application.submittedAt,
        status: application.status,
      })),
  create: (data: Omit<SpeakerApplication, 'id' | 'submittedAt' | 'status'>): SpeakerApplication => {
    const created = leadershipApplicationsApi.create({
      track: 'speaker',
      fullName: data.fullName,
      email: data.email,
      phone: '',
      whatsapp: '',
      title: data.title,
      organization: data.organization,
      location: data.location,
      speakerType: data.type,
      bio: data.bio,
      profileImage: data.imageFile,
    });
    return {
      id: created.id,
      fullName: created.fullName,
      email: created.email,
      title: created.title,
      organization: created.organization,
      location: created.location,
      type: created.speakerType || 'session',
      bio: created.bio,
      imageFile: created.profileImage,
      submittedAt: created.submittedAt,
      status: created.status,
    };
  },
  updateStatus: (id: string, status: SpeakerApplication['status']): SpeakerApplication | null => {
    const updated = leadershipApplicationsApi.updateStatus(id, status);
    if (!updated || updated.track !== 'speaker') return null;
    return {
      id: updated.id,
      fullName: updated.fullName,
      email: updated.email,
      title: updated.title,
      organization: updated.organization,
      location: updated.location,
      type: updated.speakerType || 'session',
      bio: updated.bio,
      imageFile: updated.profileImage,
      submittedAt: updated.submittedAt,
      status: updated.status,
    };
  },
  promoteToSpeaker: (id: string): Speaker | null => {
    return leadershipApplicationsApi.promoteToSpeaker(id);
  },
  delete: (id: string): boolean => {
    return leadershipApplicationsApi.delete(id);
  },
};

export const leadershipApplicationsApi = {
  getAll: (): LeadershipApplication[] => [...db.leadershipApplications],
  create: (data: Omit<LeadershipApplication, 'id' | 'submittedAt' | 'status'>): LeadershipApplication => {
    const application: LeadershipApplication = {
      ...data,
      id: createId(),
      submittedAt: nowIso(),
      status: 'new',
    };
    db.leadershipApplications.push(application);
    persistAndNotify();
    return application;
  },
  update: (id: string, data: Partial<LeadershipApplication>): LeadershipApplication | null => {
    const index = db.leadershipApplications.findIndex((application) => application.id === id);
    if (index === -1) {
      return null;
    }
    db.leadershipApplications[index] = { ...db.leadershipApplications[index], ...data };
    persistAndNotify();
    return db.leadershipApplications[index];
  },
  updateStatus: (id: string, status: LeadershipApplication['status']): LeadershipApplication | null => {
    const index = db.leadershipApplications.findIndex((application) => application.id === id);
    if (index === -1) {
      return null;
    }
    db.leadershipApplications[index] = { ...db.leadershipApplications[index], status };
    persistAndNotify();
    return db.leadershipApplications[index];
  },
  promoteToSpeaker: (id: string): Speaker | null => {
    const application = db.leadershipApplications.find((item) => item.id === id);
    if (!application || application.track !== 'speaker') {
      return null;
    }
    const speaker: Speaker = {
      id: createId(),
      name: application.fullName,
      title: application.title,
      company: application.organization,
      location: application.location,
      bio: application.bio,
      type: application.speakerType || 'session',
      image: application.profileImage,
      linkedin: application.linkedinUrl,
      facebook: application.facebookUrl,
      twitter: application.twitterUrl,
      linkedinId: application.linkedinId,
      facebookId: application.facebookId,
      twitterHandle: application.twitterHandle,
      createdAt: nowIso(),
    };
    db.speakers.push(speaker);
    db.leadershipApplications = db.leadershipApplications.map((item) =>
      item.id === id ? { ...item, status: 'approved' } : item
    );
    persistAndNotify();
    return speaker;
  },
  promoteToCommittee: (id: string): CommitteeMember | null => {
    const application = db.leadershipApplications.find((item) => item.id === id);
    if (!application || application.track === 'speaker') {
      return null;
    }
    const category: CommitteeMember['category'] =
      application.track === 'advisor' ? 'advisory' : 'organizing';
    const maxOrder = db.committeeMembers.reduce((max, member) => Math.max(max, member.order || 0), 0);
    const member: CommitteeMember = {
      id: createId(),
      category,
      name: application.fullName,
      role: application.title,
      organization: application.organization,
      location: application.location,
      bio: application.bio,
      image: application.profileImage,
      linkedin: application.linkedinUrl,
      facebook: application.facebookUrl,
      twitter: application.twitterUrl,
      linkedinId: application.linkedinId,
      facebookId: application.facebookId,
      twitterHandle: application.twitterHandle,
      order: maxOrder + 1,
      createdAt: nowIso(),
    };
    db.committeeMembers.push(member);
    db.leadershipApplications = db.leadershipApplications.map((item) =>
      item.id === id ? { ...item, status: 'approved' } : item
    );
    persistAndNotify();
    return member;
  },
  delete: (id: string): boolean => {
    const index = db.leadershipApplications.findIndex((application) => application.id === id);
    if (index === -1) {
      return false;
    }
    db.leadershipApplications.splice(index, 1);
    persistAndNotify();
    return true;
  },
};

// Committee Members API
export const committeeMembersApi = {
  getAll: (): CommitteeMember[] =>
    [...db.committeeMembers].sort((a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt)),
  getById: (id: string): CommitteeMember | undefined => db.committeeMembers.find((m) => m.id === id),
  create: (data: Omit<CommitteeMember, 'id' | 'createdAt'>): CommitteeMember => {
    const member: CommitteeMember = {
      ...data,
      id: createId(),
      createdAt: nowIso(),
    };
    db.committeeMembers.push(member);
    persistAndNotify();
    return member;
  },
  update: (id: string, data: Partial<CommitteeMember>): CommitteeMember | null => {
    const index = db.committeeMembers.findIndex((m) => m.id === id);
    if (index === -1) {
      return null;
    }
    db.committeeMembers[index] = { ...db.committeeMembers[index], ...data };
    persistAndNotify();
    return db.committeeMembers[index];
  },
  delete: (id: string): boolean => {
    const index = db.committeeMembers.findIndex((m) => m.id === id);
    if (index === -1) {
      return false;
    }
    db.committeeMembers.splice(index, 1);
    persistAndNotify();
    return true;
  },
};

// Speakers API
export const speakersApi = {
  getAll: (): Speaker[] => [...db.speakers],
  getById: (id: string): Speaker | undefined => db.speakers.find((s) => s.id === id),
  getByType: (type: Speaker['type']): Speaker[] => db.speakers.filter((s) => s.type === type),
  create: (data: Omit<Speaker, 'id' | 'createdAt'>): Speaker => {
    const speaker: Speaker = {
      ...data,
      id: createId(),
      createdAt: nowIso(),
    };
    db.speakers.push(speaker);
    persistAndNotify();
    return speaker;
  },
  update: (id: string, data: Partial<Speaker>): Speaker | null => {
    const index = db.speakers.findIndex((s) => s.id === id);
    if (index === -1) {
      return null;
    }
    db.speakers[index] = { ...db.speakers[index], ...data };
    persistAndNotify();
    return db.speakers[index];
  },
  delete: (id: string): boolean => {
    const index = db.speakers.findIndex((s) => s.id === id);
    if (index === -1) {
      return false;
    }
    db.speakers.splice(index, 1);
    db.sessions = db.sessions.map((session) =>
      session.speakerId === id ? { ...session, speakerId: '' } : session
    );
    persistAndNotify();
    return true;
  },
};

// Sessions API
export const sessionsApi = {
  getAll: (): Session[] => [...db.sessions],
  getByDay: (day: Session['day']): Session[] => db.sessions.filter((s) => s.day === day),
  getByTrack: (track: string): Session[] => db.sessions.filter((s) => s.track === track),
  create: (data: Omit<Session, 'id'>): Session => {
    const session: Session = {
      ...data,
      id: createId(),
    };
    db.sessions.push(session);
    persistAndNotify();
    return session;
  },
  update: (id: string, data: Partial<Session>): Session | null => {
    const index = db.sessions.findIndex((s) => s.id === id);
    if (index === -1) {
      return null;
    }
    db.sessions[index] = { ...db.sessions[index], ...data };
    persistAndNotify();
    return db.sessions[index];
  },
  delete: (id: string): boolean => {
    const index = db.sessions.findIndex((s) => s.id === id);
    if (index === -1) {
      return false;
    }
    db.sessions.splice(index, 1);
    persistAndNotify();
    return true;
  },
};

// Registrations API
export const registrationsApi = {
  getAll: (): Registration[] => [...db.registrations],
  create: (data: Omit<Registration, 'id' | 'registeredAt' | 'status'>): Registration => {
    const registration: Registration = {
      ...data,
      id: createId(),
      status: 'pending',
      registeredAt: nowIso(),
    };
    db.registrations.push(registration);
    persistAndNotify();
    return registration;
  },
  updateStatus: (id: string, status: Registration['status']): Registration | null => {
    const index = db.registrations.findIndex((r) => r.id === id);
    if (index === -1) {
      return null;
    }
    db.registrations[index] = { ...db.registrations[index], status };
    persistAndNotify();
    return db.registrations[index];
  },
};

// Exit Feedback API
export const exitFeedbackApi = {
  getAll: (): ExitFeedback[] => [...db.exitFeedback],
  create: (data: Omit<ExitFeedback, 'id' | 'submittedAt'>): ExitFeedback => {
    const feedback: ExitFeedback = {
      ...data,
      id: createId(),
      submittedAt: nowIso(),
    };
    db.exitFeedback.push(feedback);
    persistAndNotify();
    return feedback;
  },
  delete: (id: string): boolean => {
    const index = db.exitFeedback.findIndex((f) => f.id === id);
    if (index === -1) {
      return false;
    }
    db.exitFeedback.splice(index, 1);
    persistAndNotify();
    return true;
  },
};

// Stats API
export const statsApi = {
  getDashboardStats: () => ({
    paperSubmissions: db.paperSubmissions.length,
    pendingSubmissions: db.paperSubmissions.filter((p) => p.status === 'pending').length,
    enquiries: db.enquiries.length,
    speakers: db.speakers.length,
    speakerApplications: db.leadershipApplications.filter((item) => item.track === 'speaker').length,
    leadershipApplications: db.leadershipApplications.length,
    committeeMembers: db.committeeMembers.length,
    sessions: db.sessions.length,
    registrations: db.registrations.length,
    exitFeedback: db.exitFeedback.length,
    totalRevenue: db.registrations.reduce((sum, registration) => sum + registration.amount, 0),
  }),
};

// Currency helper functions
export const formatPrice = (price: number, currency: string): string => {
  if (!currencies[currency]) {
    return `${price}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};

// Detect currency based on country
export const detectCurrencyByCountry = (country: string): string => {
  const countryCurrencyMap: Record<string, string> = {
    India: 'INR',
    'United States': 'USD',
    USA: 'USD',
    'United Kingdom': 'GBP',
    UK: 'GBP',
    Germany: 'EUR',
    France: 'EUR',
    Italy: 'EUR',
    Spain: 'EUR',
    Netherlands: 'EUR',
    Australia: 'AUD',
    Canada: 'CAD',
    Singapore: 'SGD',
    'United Arab Emirates': 'AED',
    UAE: 'AED',
  };

  return countryCurrencyMap[country] || 'USD';
};

export default db;
