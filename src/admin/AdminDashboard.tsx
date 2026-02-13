import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { 
  LayoutDashboard, FileText, Users, Calendar, MessageSquare, 
  LogOut, Search, Download, CheckCircle, XCircle, 
  Clock, Trash2, Edit, Plus, Mail,
  Phone, MapPin, User as UserIcon, X, DollarSign, MessageCircle, Save, UserPlus
} from 'lucide-react';
import {
  paperSubmissionsApi, enquiriesApi, speakersApi, sessionsApi,
  registrationsApi, statsApi, passTiersApi, exitFeedbackApi, subscribeDatabase,
  leadershipApplicationsApi, committeeMembersApi,
  currencies, type PaperSubmission, type Enquiry, type Speaker, type Session,
  type PassTier, type ExitFeedback, type LeadershipApplication, type CommitteeMember
} from '../data/database';
import { imageFileToDataUrl } from '../lib/imageUpload';
import { extractFacebookId, extractLinkedinId, extractTwitterHandle } from '../lib/socialParsers';

const DEFAULT_ADMIN_EMAIL = 'admin@agtechsummit.in';
const DEFAULT_ADMIN_PASSWORD = 'admin123';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL?.trim() || DEFAULT_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple auth - in production use proper authentication
    if (loginData.email === ADMIN_EMAIL && loginData.password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert(`Invalid credentials. Use ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-agtech-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-agtech-white text-2xl mb-2">
              Admin Login
            </h1>
            <p className="body-text text-agtech-sage">
              AgTech Summit 2026 Dashboard
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label-mono text-agtech-sage text-xs mb-2 block">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  placeholder={ADMIN_EMAIL}
                />
              </div>
            <div>
              <label className="label-mono text-agtech-sage text-xs mb-2 block">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              />
            </div>
            <button type="submit" className="w-full btn-primary">
              Sign In
            </button>
          </form>
          <p className="text-center text-agtech-sage text-xs mt-6">
            Demo: {ADMIN_EMAIL} / {ADMIN_PASSWORD}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-agtech-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-agtech-green/20 border-r border-agtech-white/10 flex-shrink-0">
        <div className="p-6">
          <h1 className="font-display font-bold text-agtech-white text-lg">
            AgTech <span className="text-agtech-lime">Admin</span>
          </h1>
        </div>
        <nav className="px-4 pb-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'submissions', label: 'Paper Submissions', icon: FileText },
            { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
            { id: 'leadershipApplications', label: 'Leadership Applications', icon: UserPlus },
            { id: 'speakers', label: 'Speakers', icon: Users },
            { id: 'committee', label: 'Committee Members', icon: Users },
            { id: 'sessions', label: 'Sessions', icon: Calendar },
            { id: 'registrations', label: 'Registrations', icon: Mail },
            { id: 'pricing', label: 'Pricing', icon: DollarSign },
            { id: 'exitFeedback', label: 'Exit Feedback', icon: MessageCircle },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeTab === item.id
                  ? 'bg-agtech-lime/20 text-agtech-lime'
                  : 'text-agtech-sage hover:bg-agtech-white/5 hover:text-agtech-white'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-agtech-white/10">
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-agtech-sage hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'submissions' && <SubmissionsView />}
        {activeTab === 'enquiries' && <EnquiriesView />}
        {activeTab === 'leadershipApplications' && <LeadershipApplicationsView />}
        {activeTab === 'speakers' && <SpeakersView />}
        {activeTab === 'committee' && <CommitteeView />}
        {activeTab === 'sessions' && <SessionsView />}
        {activeTab === 'registrations' && <RegistrationsView />}
        {activeTab === 'pricing' && <PricingView />}
        {activeTab === 'exitFeedback' && <ExitFeedbackView />}
      </main>
    </div>
  );
};

// Dashboard View
const DashboardView = () => {
  const [stats, setStats] = useState(statsApi.getDashboardStats());

  useEffect(() => {
    return subscribeDatabase(() => {
      setStats(statsApi.getDashboardStats());
    });
  }, []);

  const statCards = [
    { label: 'Paper Submissions', value: stats.paperSubmissions, icon: FileText, color: 'text-blue-400' },
    { label: 'Pending Review', value: stats.pendingSubmissions, icon: Clock, color: 'text-yellow-400' },
    { label: 'Enquiries', value: stats.enquiries, icon: MessageSquare, color: 'text-purple-400' },
    { label: 'Leadership Applications', value: stats.leadershipApplications, icon: UserPlus, color: 'text-agtech-cyan' },
    { label: 'Speakers', value: stats.speakers, icon: Users, color: 'text-pink-400' },
    { label: 'Committee Members', value: stats.committeeMembers, icon: Users, color: 'text-agtech-lime' },
    { label: 'Sessions', value: stats.sessions, icon: Calendar, color: 'text-agtech-cyan' },
    { label: 'Registrations', value: stats.registrations, icon: Mail, color: 'text-orange-400' },
  ];

  return (
    <div className="p-8">
      <h2 className="font-display font-bold text-agtech-white text-2xl mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={24} className={stat.color} />
              <span className="font-display font-black text-agtech-white text-3xl">{stat.value}</span>
            </div>
            <p className="text-agtech-sage text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-agtech-lime/18 to-agtech-cyan/24 border border-agtech-lime/30 rounded-xl p-6">
        <p className="label-mono text-agtech-sage text-xs mb-2">TOTAL REVENUE</p>
        <p className="font-display font-black text-agtech-lime text-4xl">
          â‚¹{stats.totalRevenue.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

// Submissions View
const SubmissionsView = () => {
  const [submissions, setSubmissions] = useState<PaperSubmission[]>(paperSubmissionsApi.getAll());
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    return subscribeDatabase(() => {
      setSubmissions(paperSubmissionsApi.getAll());
    });
  }, []);

  const filteredSubmissions = submissions.filter((s) => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch = s.authorName.toLowerCase().includes(search.toLowerCase()) ||
                         s.paperTitle.toLowerCase().includes(search.toLowerCase()) ||
                         s.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateStatus = (id: string, status: PaperSubmission['status']) => {
    paperSubmissionsApi.updateStatus(id, status);
    setSubmissions(paperSubmissionsApi.getAll());
  };

  const deleteSubmission = (id: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      paperSubmissionsApi.delete(id);
      setSubmissions(paperSubmissionsApi.getAll());
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      under_review: 'bg-blue-500/20 text-blue-400',
      accepted: 'bg-green-500/20 text-green-400',
      rejected: 'bg-red-500/20 text-red-400',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-agtech-white text-2xl">Paper Submissions</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-agtech-white/10 rounded-lg text-agtech-white hover:bg-agtech-white/20 transition-colors">
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-agtech-sage" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg pl-10 pr-4 py-2 text-agtech-white focus:border-agtech-lime focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-2 text-agtech-white focus:border-agtech-lime focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-agtech-black/50">
            <tr>
              <th className="text-left px-4 py-3 text-agtech-sage text-xs font-medium">Author</th>
              <th className="text-left px-4 py-3 text-agtech-sage text-xs font-medium">Paper Title</th>
              <th className="text-left px-4 py-3 text-agtech-sage text-xs font-medium">Track</th>
              <th className="text-left px-4 py-3 text-agtech-sage text-xs font-medium">Status</th>
              <th className="text-left px-4 py-3 text-agtech-sage text-xs font-medium">Date</th>
              <th className="text-left px-4 py-3 text-agtech-sage text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-agtech-sage">
                  No submissions found
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="border-t border-agtech-white/10 hover:bg-agtech-white/5">
                  <td className="px-4 py-3">
                    <p className="text-agtech-white font-medium">{submission.authorName}</p>
                    <p className="text-agtech-sage text-xs">{submission.email}</p>
                  </td>
                  <td className="px-4 py-3 text-agtech-white text-sm">{submission.paperTitle}</td>
                  <td className="px-4 py-3 text-agtech-sage text-sm">{submission.researchTrack}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(submission.status)}`}>
                      {submission.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-agtech-sage text-sm">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(submission.id, 'accepted')}
                        className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                        title="Accept"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => updateStatus(submission.id, 'rejected')}
                        className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                        title="Reject"
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        onClick={() => deleteSubmission(submission.id)}
                        className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Enquiries View
const EnquiriesView = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(enquiriesApi.getAll());
  const [search, setSearch] = useState('');

  useEffect(() => {
    return subscribeDatabase(() => {
      setEnquiries(enquiriesApi.getAll());
    });
  }, []);

  const filteredEnquiries = enquiries.filter((e) =>
    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  const deleteEnquiry = (id: string) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      enquiriesApi.delete(id);
      setEnquiries(enquiriesApi.getAll());
    }
  };

  return (
    <div className="p-8">
      <h2 className="font-display font-bold text-agtech-white text-2xl mb-6">Enquiries</h2>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-agtech-sage" />
        <input
          type="text"
          placeholder="Search enquiries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-agtech-black/50 border border-agtech-white/20 rounded-lg pl-10 pr-4 py-2 text-agtech-white focus:border-agtech-lime focus:outline-none"
        />
      </div>

      <div className="grid gap-4">
        {filteredEnquiries.length === 0 ? (
          <p className="text-agtech-sage text-center py-8">No enquiries found</p>
        ) : (
          filteredEnquiries.map((enquiry) => (
            <div key={enquiry.id} className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-agtech-white text-lg">{enquiry.fullName}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-agtech-sage">
                    <span className="flex items-center gap-1"><Mail size={14} /> {enquiry.email}</span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {enquiry.whatsapp}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {enquiry.country}</span>
                  </div>
                  {enquiry.message && (
                    <p className="mt-3 text-agtech-white/80 text-sm bg-agtech-black/30 rounded-lg p-3">
                      {enquiry.message}
                    </p>
                  )}
                  <p className="mt-3 text-agtech-sage text-xs">
                    Submitted: {new Date(enquiry.submittedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteEnquiry(enquiry.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Leadership Applications View
const LeadershipApplicationsView = () => {
  const [applications, setApplications] = useState<LeadershipApplication[]>(leadershipApplicationsApi.getAll());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadershipApplication['status']>('all');
  const [trackFilter, setTrackFilter] = useState<'all' | LeadershipApplication['track']>('all');

  useEffect(() => {
    return subscribeDatabase(() => {
      setApplications(leadershipApplicationsApi.getAll());
    });
  }, []);

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.fullName.toLowerCase().includes(search.toLowerCase()) ||
      application.email.toLowerCase().includes(search.toLowerCase()) ||
      application.organization.toLowerCase().includes(search.toLowerCase()) ||
      application.phone.toLowerCase().includes(search.toLowerCase()) ||
      application.whatsapp.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    const matchesTrack = trackFilter === 'all' || application.track === trackFilter;
    return matchesSearch && matchesStatus && matchesTrack;
  });

  const updateApplicationStatus = (id: string, status: LeadershipApplication['status']) => {
    leadershipApplicationsApi.updateStatus(id, status);
    setApplications(leadershipApplicationsApi.getAll());
  };

  const approveApplication = (application: LeadershipApplication) => {
    if (application.track === 'speaker') {
      leadershipApplicationsApi.promoteToSpeaker(application.id);
    } else {
      leadershipApplicationsApi.promoteToCommittee(application.id);
    }
    setApplications(leadershipApplicationsApi.getAll());
  };

  const deleteApplication = (id: string) => {
    if (confirm('Delete this leadership application?')) {
      leadershipApplicationsApi.delete(id);
      setApplications(leadershipApplicationsApi.getAll());
    }
  };

  const getTrackLabel = (track: LeadershipApplication['track']) => {
    if (track === 'advisor') return 'Advisor';
    if (track === 'organizing_committee') return 'Organizing Committee';
    return 'Speaker';
  };

  const getTrackBadge = (track: LeadershipApplication['track']) => {
    if (track === 'advisor') return 'bg-agtech-cyan/20 text-agtech-cyan';
    if (track === 'organizing_committee') return 'bg-purple-500/20 text-purple-300';
    return 'bg-agtech-lime/20 text-agtech-lime';
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-agtech-white text-2xl">Leadership Applications</h2>
        <div className="bg-agtech-cyan/20 px-4 py-2 rounded-lg">
          <span className="text-agtech-cyan font-medium">{applications.length} total</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-agtech-sage" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg pl-10 pr-4 py-2 text-agtech-white focus:border-agtech-lime focus:outline-none"
          />
        </div>
        <select
          value={trackFilter}
          onChange={(e) => setTrackFilter(e.target.value as 'all' | LeadershipApplication['track'])}
          className="bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-2 text-agtech-white focus:border-agtech-lime focus:outline-none"
        >
          <option value="all">All Tracks</option>
          <option value="advisor">Advisor</option>
          <option value="organizing_committee">Organizing Committee</option>
          <option value="speaker">Speaker</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | LeadershipApplication['status'])}
          className="bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-2 text-agtech-white focus:border-agtech-lime focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="reviewing">Reviewing</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredApplications.length === 0 ? (
          <p className="text-agtech-sage text-center py-8">No leadership applications found</p>
        ) : (
          filteredApplications.map((application) => (
            <div key={application.id} className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-[240px]">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-display font-bold text-agtech-white text-lg">{application.fullName}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${getTrackBadge(application.track)}`}>
                      {getTrackLabel(application.track)}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        application.status === 'approved'
                          ? 'bg-green-500/20 text-green-400'
                          : application.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : application.status === 'reviewing'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                  <p className="text-agtech-lime text-sm">{application.title}</p>
                  <p className="text-agtech-sage text-sm">{application.organization}</p>
                  <p className="text-agtech-sage/80 text-xs mt-1">{application.location}</p>
                  <p className="mt-3 text-agtech-white/85 text-sm bg-agtech-black/30 rounded-lg p-3">{application.bio}</p>

                  <div className="mt-3 text-xs text-agtech-sage space-y-1">
                    <p>Email: {application.email}</p>
                    <p>Phone: {application.phone || '-'}</p>
                    <p>WhatsApp: {application.whatsapp || '-'}</p>
                    <p>Submitted: {new Date(application.submittedAt).toLocaleString()}</p>
                    {application.speakerType ? <p>Speaker Type: {application.speakerType}</p> : null}
                    {application.linkedinUrl ? (
                      <p>
                        LinkedIn: {application.linkedinUrl}{' '}
                        {application.linkedinId ? (
                          <span className="text-agtech-lime">(ID: {application.linkedinId})</span>
                        ) : null}
                      </p>
                    ) : null}
                    {application.facebookUrl ? (
                      <p>
                        Facebook: {application.facebookUrl}{' '}
                        {application.facebookId ? (
                          <span className="text-agtech-lime">(ID: {application.facebookId})</span>
                        ) : null}
                      </p>
                    ) : null}
                    {application.twitterUrl ? (
                      <p>
                        X: {application.twitterUrl}{' '}
                        {application.twitterHandle ? (
                          <span className="text-agtech-lime">(Handle: @{application.twitterHandle})</span>
                        ) : null}
                      </p>
                    ) : null}
                  </div>

                  {application.profileImage ? (
                    <div className="mt-3">
                      <p className="label-mono text-agtech-sage text-[10px] mb-1">PROFILE PHOTO</p>
                      <img
                        src={application.profileImage}
                        alt={`${application.fullName} profile`}
                        className="w-20 h-20 rounded-lg object-cover border border-agtech-white/20"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'reviewing')}
                    className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 text-sm"
                  >
                    Mark Reviewing
                  </button>
                  <button
                    onClick={() => approveApplication(application)}
                    className="px-3 py-2 bg-agtech-lime/20 text-agtech-lime rounded-lg hover:bg-agtech-lime/30 text-sm"
                  >
                    {application.track === 'speaker' ? 'Approve + Add Speaker' : 'Approve + Add Committee'}
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'rejected')}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-sm"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => deleteApplication(application.id)}
                    className="px-3 py-2 bg-agtech-white/10 text-agtech-sage rounded-lg hover:bg-agtech-white/20 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Speakers View
const SpeakersView = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>(speakersApi.getAll());
  const [showForm, setShowForm] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [formData, setFormData] = useState<Partial<Speaker>>({
    name: '',
    title: '',
    company: '',
    location: '',
    bio: '',
    type: 'session',
    image: null,
    linkedin: '',
    facebook: '',
    twitter: '',
    linkedinId: '',
    facebookId: '',
    twitterHandle: '',
    website: '',
  });

  useEffect(() => {
    return subscribeDatabase(() => {
      setSpeakers(speakersApi.getAll());
    });
  }, []);

  const setSpeakerSocialField = (field: 'linkedin' | 'facebook' | 'twitter', value: string) => {
    if (field === 'linkedin') {
      setFormData((prev) => ({ ...prev, linkedin: value, linkedinId: extractLinkedinId(value) || '' }));
      return;
    }
    if (field === 'facebook') {
      setFormData((prev) => ({ ...prev, facebook: value, facebookId: extractFacebookId(value) || '' }));
      return;
    }
    setFormData((prev) => ({ ...prev, twitter: value, twitterHandle: extractTwitterHandle(value) || '' }));
  };

  const handleSpeakerImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const image = await imageFileToDataUrl(file, { maxSizeMB: 5, maxWidth: 1200, quality: 0.82 });
      setFormData((prev) => ({ ...prev, image }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to process image.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSpeaker) {
      speakersApi.update(editingSpeaker.id, formData);
    } else {
      speakersApi.create(formData as Omit<Speaker, 'id' | 'createdAt'>);
    }
    setSpeakers(speakersApi.getAll());
    setShowForm(false);
    setEditingSpeaker(null);
    setFormData({
      name: '',
      title: '',
      company: '',
      location: '',
      bio: '',
      type: 'session',
      image: null,
      linkedin: '',
      facebook: '',
      twitter: '',
      linkedinId: '',
      facebookId: '',
      twitterHandle: '',
      website: '',
    });
  };

  const editSpeaker = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
    const nextFormData: Partial<Speaker> = { ...speaker };
    nextFormData.linkedin = speaker.linkedin || '';
    nextFormData.facebook = speaker.facebook || '';
    nextFormData.twitter = speaker.twitter || '';
    nextFormData.linkedinId = speaker.linkedinId || '';
    nextFormData.facebookId = speaker.facebookId || '';
    nextFormData.twitterHandle = speaker.twitterHandle || '';
    nextFormData.website = speaker.website || '';
    setFormData(nextFormData);
    setShowForm(true);
  };

  const deleteSpeaker = (id: string) => {
    if (confirm('Are you sure you want to delete this speaker?')) {
      speakersApi.delete(id);
      setSpeakers(speakersApi.getAll());
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-agtech-white text-2xl">Speakers</h2>
        <button
          onClick={() => {
            setEditingSpeaker(null);
            setFormData({
              name: '',
              title: '',
              company: '',
              location: '',
              bio: '',
              type: 'session',
              image: null,
              linkedin: '',
              facebook: '',
              twitter: '',
              linkedinId: '',
              facebookId: '',
              twitterHandle: '',
              website: '',
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-agtech-lime text-agtech-black rounded-lg font-medium hover:bg-agtech-lime/90 transition-colors"
        >
          <Plus size={18} />
          Add Speaker
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakers.map((speaker) => (
          <div key={speaker.id} className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-full bg-agtech-lime/20 overflow-hidden flex items-center justify-center">
                {speaker.image ? (
                  <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-agtech-lime text-xl">
                    {speaker.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editSpeaker(speaker)}
                  className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteSpeaker(speaker.id)}
                  className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="font-display font-bold text-agtech-white text-lg">{speaker.name}</h3>
            <p className="text-agtech-lime text-sm">{speaker.title}</p>
            <p className="text-agtech-sage text-sm">{speaker.company}</p>
            <p className="text-agtech-sage/70 text-xs mt-1">{speaker.location}</p>
            <span className={`inline-block mt-3 px-2 py-1 rounded text-xs ${
              speaker.type === 'keynote' ? 'bg-agtech-lime/20 text-agtech-lime' :
              speaker.type === 'session' ? 'bg-blue-500/20 text-blue-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {speaker.type}
            </span>
          </div>
        ))}
      </div>

      {/* Speaker Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-agtech-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-agtech-white text-xl">
                {editingSpeaker ? 'Edit Speaker' : 'Add Speaker'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-agtech-sage hover:text-agtech-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Company/Organization"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Speaker['type'] })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
              >
                <option value="keynote">Keynote Speaker</option>
                <option value="session">Session Speaker</option>
                <option value="panelist">Panelist</option>
              </select>
              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
              />
              <div>
                <label className="label-mono text-agtech-sage text-xs mb-1 block">Profile Photo Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSpeakerImageUpload}
                  className="w-full text-agtech-sage text-sm"
                />
                {formData.image ? (
                  <div className="mt-3 flex items-center gap-4">
                    <img src={formData.image} alt="Speaker preview" className="w-16 h-16 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: null })}
                      className="px-3 py-2 bg-agtech-white/10 text-agtech-sage rounded-lg hover:bg-agtech-white/20 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={formData.linkedin}
                    onChange={(e) => setSpeakerSocialField('linkedin', e.target.value)}
                    onBlur={(e) => setSpeakerSocialField('linkedin', e.target.value)}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSpeakerSocialField('linkedin', formData.linkedin || '')}
                    className="mt-2 text-xs px-2 py-1 bg-agtech-white/10 text-agtech-sage rounded hover:bg-agtech-white/20"
                  >
                    Extract ID
                  </button>
                  {formData.linkedinId ? (
                    <p className="text-agtech-lime text-xs mt-1">ID: {formData.linkedinId}</p>
                  ) : null}
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="Facebook URL"
                    value={formData.facebook}
                    onChange={(e) => setSpeakerSocialField('facebook', e.target.value)}
                    onBlur={(e) => setSpeakerSocialField('facebook', e.target.value)}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSpeakerSocialField('facebook', formData.facebook || '')}
                    className="mt-2 text-xs px-2 py-1 bg-agtech-white/10 text-agtech-sage rounded hover:bg-agtech-white/20"
                  >
                    Extract ID
                  </button>
                  {formData.facebookId ? (
                    <p className="text-agtech-lime text-xs mt-1">ID: {formData.facebookId}</p>
                  ) : null}
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="X / Twitter URL"
                    value={formData.twitter}
                    onChange={(e) => setSpeakerSocialField('twitter', e.target.value)}
                    onBlur={(e) => setSpeakerSocialField('twitter', e.target.value)}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSpeakerSocialField('twitter', formData.twitter || '')}
                    className="mt-2 text-xs px-2 py-1 bg-agtech-white/10 text-agtech-sage rounded hover:bg-agtech-white/20"
                  >
                    Extract ID
                  </button>
                  {formData.twitterHandle ? (
                    <p className="text-agtech-lime text-xs mt-1">Handle: @{formData.twitterHandle}</p>
                  ) : null}
                </div>
              </div>
              <input
                type="url"
                placeholder="Website URL"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
              />
              <button type="submit" className="w-full btn-primary">
                {editingSpeaker ? 'Update Speaker' : 'Add Speaker'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Committee View
const CommitteeView = () => {
  const [members, setMembers] = useState<CommitteeMember[]>(committeeMembersApi.getAll());
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [formData, setFormData] = useState<Partial<CommitteeMember>>({
    category: 'organizing',
    name: '',
    role: '',
    organization: '',
    location: '',
    bio: '',
    image: null,
    linkedin: '',
    facebook: '',
    twitter: '',
    linkedinId: '',
    facebookId: '',
    twitterHandle: '',
  });

  useEffect(() => {
    return subscribeDatabase(() => {
      setMembers(committeeMembersApi.getAll());
    });
  }, []);

  const setCommitteeSocialField = (field: 'linkedin' | 'facebook' | 'twitter', value: string) => {
    if (field === 'linkedin') {
      setFormData((prev) => ({ ...prev, linkedin: value, linkedinId: extractLinkedinId(value) || '' }));
      return;
    }
    if (field === 'facebook') {
      setFormData((prev) => ({ ...prev, facebook: value, facebookId: extractFacebookId(value) || '' }));
      return;
    }
    setFormData((prev) => ({ ...prev, twitter: value, twitterHandle: extractTwitterHandle(value) || '' }));
  };

  const handleCommitteeImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const image = await imageFileToDataUrl(file, { maxSizeMB: 5, maxWidth: 1200, quality: 0.82 });
      setFormData((prev) => ({ ...prev, image }));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to process image.');
    }
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      category: 'organizing',
      name: '',
      role: '',
      organization: '',
      location: '',
      bio: '',
      image: null,
      linkedin: '',
      facebook: '',
      twitter: '',
      linkedinId: '',
      facebookId: '',
      twitterHandle: '',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditModal = (member: CommitteeMember) => {
    setEditingMember(member);
    const nextFormData: Partial<CommitteeMember> = { ...member };
    nextFormData.category = member.category || 'organizing';
    nextFormData.linkedin = member.linkedin || '';
    nextFormData.facebook = member.facebook || '';
    nextFormData.twitter = member.twitter || '';
    nextFormData.linkedinId = member.linkedinId || '';
    nextFormData.facebookId = member.facebookId || '';
    nextFormData.twitterHandle = member.twitterHandle || '';
    setFormData(nextFormData);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      committeeMembersApi.update(editingMember.id, formData);
    } else {
      const maxOrder = members.reduce((max, member) => Math.max(max, member.order || 0), 0);
      committeeMembersApi.create({
        category: (formData.category as CommitteeMember['category']) || 'organizing',
        name: formData.name || '',
        role: formData.role || '',
        organization: formData.organization || '',
        location: formData.location || '',
        bio: formData.bio || '',
        image: formData.image || null,
        linkedin: formData.linkedin || '',
        facebook: formData.facebook || '',
        twitter: formData.twitter || '',
        linkedinId: formData.linkedinId || '',
        facebookId: formData.facebookId || '',
        twitterHandle: formData.twitterHandle || '',
        order: maxOrder + 1,
      });
    }
    setMembers(committeeMembersApi.getAll());
    setShowForm(false);
    resetForm();
  };

  const deleteMember = (id: string) => {
    if (confirm('Delete this committee member?')) {
      committeeMembersApi.delete(id);
      setMembers(committeeMembersApi.getAll());
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-agtech-white text-2xl">Committee Members</h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-agtech-lime text-agtech-black rounded-lg font-medium hover:bg-agtech-lime/90 transition-colors"
        >
          <Plus size={18} />
          Add Member
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-14 h-14 rounded-full bg-agtech-cyan/20 overflow-hidden flex items-center justify-center">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-agtech-cyan text-xl">{member.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(member)}
                  className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteMember(member.id)}
                  className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="font-display font-bold text-agtech-white text-lg">{member.name}</h3>
            <p className="text-agtech-lime text-sm">{member.role}</p>
            <p className="text-agtech-sage text-sm">{member.organization}</p>
            <p className="text-agtech-sage/70 text-xs mt-1">{member.location}</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded text-[10px] ${
              member.category === 'advisory'
                ? 'bg-agtech-cyan/20 text-agtech-cyan'
                : 'bg-purple-500/20 text-purple-300'
            }`}>
              {member.category === 'advisory' ? 'Advisory' : 'Organizing'}
            </span>
            <p className="text-agtech-white/85 text-sm mt-3 line-clamp-3">{member.bio}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-agtech-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-agtech-white text-xl">
                {editingMember ? 'Edit Committee Member' : 'Add Committee Member'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-agtech-sage hover:text-agtech-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as CommitteeMember['category'] })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
              >
                <option value="advisory">Advisory Board</option>
                <option value="organizing">Organizing Committee</option>
              </select>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                required
              />
              <textarea
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
              />
              <div>
                <label className="label-mono text-agtech-sage text-xs mb-1 block">Profile Photo Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCommitteeImageUpload}
                  className="w-full text-agtech-sage text-sm"
                />
                {formData.image ? (
                  <div className="mt-3 flex items-center gap-4">
                    <img src={formData.image} alt="Member preview" className="w-16 h-16 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: null })}
                      className="px-3 py-2 bg-agtech-white/10 text-agtech-sage rounded-lg hover:bg-agtech-white/20 text-sm"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={formData.linkedin}
                    onChange={(e) => setCommitteeSocialField('linkedin', e.target.value)}
                    onBlur={(e) => setCommitteeSocialField('linkedin', e.target.value)}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setCommitteeSocialField('linkedin', formData.linkedin || '')}
                    className="mt-2 text-xs px-2 py-1 bg-agtech-white/10 text-agtech-sage rounded hover:bg-agtech-white/20"
                  >
                    Extract ID
                  </button>
                  {formData.linkedinId ? (
                    <p className="text-agtech-lime text-xs mt-1">ID: {formData.linkedinId}</p>
                  ) : null}
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="Facebook URL"
                    value={formData.facebook}
                    onChange={(e) => setCommitteeSocialField('facebook', e.target.value)}
                    onBlur={(e) => setCommitteeSocialField('facebook', e.target.value)}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setCommitteeSocialField('facebook', formData.facebook || '')}
                    className="mt-2 text-xs px-2 py-1 bg-agtech-white/10 text-agtech-sage rounded hover:bg-agtech-white/20"
                  >
                    Extract ID
                  </button>
                  {formData.facebookId ? (
                    <p className="text-agtech-lime text-xs mt-1">ID: {formData.facebookId}</p>
                  ) : null}
                </div>
                <div>
                  <input
                    type="url"
                    placeholder="X / Twitter URL"
                    value={formData.twitter}
                    onChange={(e) => setCommitteeSocialField('twitter', e.target.value)}
                    onBlur={(e) => setCommitteeSocialField('twitter', e.target.value)}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setCommitteeSocialField('twitter', formData.twitter || '')}
                    className="mt-2 text-xs px-2 py-1 bg-agtech-white/10 text-agtech-sage rounded hover:bg-agtech-white/20"
                  >
                    Extract ID
                  </button>
                  {formData.twitterHandle ? (
                    <p className="text-agtech-lime text-xs mt-1">Handle: @{formData.twitterHandle}</p>
                  ) : null}
                </div>
              </div>
              <button type="submit" className="w-full btn-primary">
                {editingMember ? 'Update Member' : 'Add Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sessions View
const SessionsView = () => {
  const [sessions, setSessions] = useState<Session[]>(sessionsApi.getAll());
  const [speakersList, setSpeakersList] = useState<Speaker[]>(speakersApi.getAll());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Session>>({
    title: '',
    description: '',
    time: '',
    endTime: '',
    day: 'day1',
    track: 'keynote',
    speakerId: '',
    venue: '',
    type: 'session',
  });

  useEffect(() => {
    return subscribeDatabase(() => {
      setSessions(sessionsApi.getAll());
      setSpeakersList(speakersApi.getAll());
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionsApi.create(formData as Omit<Session, 'id'>);
    setSessions(sessionsApi.getAll());
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      time: '',
      endTime: '',
      day: 'day1',
      track: 'keynote',
      speakerId: '',
      venue: '',
      type: 'session',
    });
  };

  const deleteSession = (id: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      sessionsApi.delete(id);
      setSessions(sessionsApi.getAll());
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-agtech-white text-2xl">Sessions</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-agtech-lime text-agtech-black rounded-lg font-medium hover:bg-agtech-lime/90 transition-colors"
        >
          <Plus size={18} />
          Add Session
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => {
          const speaker = session.speakerId ? speakersApi.getById(session.speakerId) : null;
          return (
            <div key={session.id} className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      session.type === 'keynote' ? 'bg-pink-500/20 text-pink-400' :
                      session.type === 'session' ? 'bg-blue-500/20 text-blue-400' :
                      session.type === 'workshop' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-agtech-cyan/20 text-agtech-cyan'
                    }`}>
                      {session.type.toUpperCase()}
                    </span>
                    <span className="text-agtech-sage text-sm">{session.day === 'day1' ? 'Nov 21' : 'Nov 22'}</span>
                    <span className="text-agtech-lime text-sm">{session.time} - {session.endTime}</span>
                  </div>
                  <h3 className="font-display font-bold text-agtech-white text-lg">{session.title}</h3>
                  <p className="text-agtech-sage text-sm mt-1">{session.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-agtech-sage">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {session.venue}</span>
                    {speaker && <span className="flex items-center gap-1"><UserIcon size={14} /> {speaker.name}</span>}
                  </div>
                </div>
                <button
                  onClick={() => deleteSession(session.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-agtech-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-agtech-white text-xl">Add Session</h3>
              <button onClick={() => setShowForm(false)} className="text-agtech-sage hover:text-agtech-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Session Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  placeholder="Start Time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  required
                />
                <input
                  type="time"
                  placeholder="End Time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value as Session['day'] })}
                  className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                >
                  <option value="day1">Day 1 (Nov 21)</option>
                  <option value="day2">Day 2 (Nov 22)</option>
                </select>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Session['type'] })}
                  className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                >
                  <option value="keynote">Keynote</option>
                  <option value="session">Session</option>
                  <option value="workshop">Workshop</option>
                  <option value="panel">Panel</option>
                  <option value="social">Social</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
                required
              />
              <select
                value={formData.speakerId}
                onChange={(e) => setFormData({ ...formData, speakerId: e.target.value })}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none"
              >
                <option value="">Select Speaker (Optional)</option>
                {speakersList.map((speaker) => (
                  <option key={speaker.id} value={speaker.id}>{speaker.name}</option>
                ))}
              </select>
              <button type="submit" className="w-full btn-primary">
                Add Session
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Registrations View
const RegistrationsView = () => {
  const [registrations, setRegistrations] = useState(registrationsApi.getAll());

  useEffect(() => {
    return subscribeDatabase(() => {
      setRegistrations(registrationsApi.getAll());
    });
  }, []);

  return (
    <div className="p-8">
      <h2 className="font-display font-bold text-agtech-white text-2xl mb-6">Registrations</h2>

      <div className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-agtech-black/50">
            <tr>
              <th className="text-left px-4 py-3 text-agtech-sage text-xs font-medium">Name</th>
              <th className="text-left px-4 py-3 text-agtech-sage text-xs font-medium">Pass Type</th>
              <th className="text-left px-4 py-3 text-agtech-sage text-xs font-medium">Amount</th>
              <th className="text-left px-4 py-3 text-agtech-sage text-xs font-medium">Status</th>
              <th className="text-left px-4 py-3 text-agtech-sage text-xs font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-agtech-sage">
                  No registrations yet
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg.id} className="border-t border-agtech-white/10 hover:bg-agtech-white/5">
                  <td className="px-4 py-3">
                    <p className="text-agtech-white font-medium">{reg.fullName}</p>
                    <p className="text-agtech-sage text-xs">{reg.email}</p>
                  </td>
                  <td className="px-4 py-3 text-agtech-white text-sm">{reg.passType}</td>
                  <td className="px-4 py-3 text-agtech-lime text-sm">{reg.currency} {reg.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      reg.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-agtech-sage text-sm">
                    {new Date(reg.registeredAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Pricing View
const PricingView = () => {
  const [passTiers, setPassTiers] = useState<PassTier[]>(passTiersApi.getAll());
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [editPrices, setEditPrices] = useState<Record<string, number>>({});
  const [savedMessage, setSavedMessage] = useState('');

  const currencyList = Object.keys(currencies);

  useEffect(() => {
    return subscribeDatabase(() => {
      setPassTiers(passTiersApi.getAll());
    });
  }, []);

  const startEditing = (tier: PassTier) => {
    setEditingTier(tier.id);
    setEditPrices({ ...tier.prices });
  };

  const savePrices = (tierId: string) => {
    passTiersApi.updatePrices(tierId, editPrices);
    setPassTiers(passTiersApi.getAll());
    setEditingTier(null);
    setSavedMessage('Prices updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const cancelEdit = () => {
    setEditingTier(null);
    setEditPrices({});
  };

  const updatePrice = (currency: string, value: string) => {
    setEditPrices({
      ...editPrices,
      [currency]: parseInt(value) || 0,
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-agtech-white text-2xl">Pricing Management</h2>
        {savedMessage && (
          <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm">
            {savedMessage}
          </span>
        )}
      </div>

      <div className="grid gap-6">
        {passTiers.map((tier) => (
          <div key={tier.id} className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${tier.badgeColor}`}>
                    {tier.badge}
                  </span>
                  <span className="label-mono text-agtech-sage text-[10px]">
                    {tier.mode === 'in-person' ? 'In-Person' : 'Virtual'}
                  </span>
                </div>
                <h3 className="font-display font-bold text-agtech-white text-xl">{tier.name}</h3>
                <p className="text-agtech-sage text-sm mt-1">{tier.description}</p>
              </div>
              {editingTier === tier.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => savePrices(tier.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-agtech-lime text-agtech-black rounded-lg font-medium hover:bg-agtech-lime/90 transition-colors"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-agtech-white/10 text-agtech-white rounded-lg hover:bg-agtech-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing(tier)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Edit size={16} />
                  Edit Prices
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {currencyList.map((curr) => (
                <div key={curr} className="bg-agtech-black/50 rounded-lg p-3">
                  <p className="label-mono text-agtech-sage text-[10px] mb-1">{curr}</p>
                  {editingTier === tier.id ? (
                    <input
                      type="number"
                      value={editPrices[curr] || 0}
                      onChange={(e) => updatePrice(curr, e.target.value)}
                      className="w-full bg-agtech-black border border-agtech-white/20 rounded px-2 py-1 text-agtech-white text-sm focus:border-agtech-lime focus:outline-none"
                    />
                  ) : (
                    <p className="font-display font-bold text-agtech-white">
                      {currencies[curr].symbol}{tier.prices[curr]?.toLocaleString() || 0}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exit Feedback View
const ExitFeedbackView = () => {
  const [feedback, setFeedback] = useState<ExitFeedback[]>(exitFeedbackApi.getAll());
  const [search, setSearch] = useState('');

  useEffect(() => {
    return subscribeDatabase(() => {
      setFeedback(exitFeedbackApi.getAll());
    });
  }, []);

  const filteredFeedback = feedback.filter((f) =>
    f.reason.toLowerCase().includes(search.toLowerCase()) ||
    f.otherReason?.toLowerCase().includes(search.toLowerCase()) ||
    f.email?.toLowerCase().includes(search.toLowerCase())
  );

  const deleteFeedback = (id: string) => {
    if (confirm('Are you sure you want to delete this feedback?')) {
      exitFeedbackApi.delete(id);
      setFeedback(exitFeedbackApi.getAll());
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      price: 'Price is too high',
      uncertain: 'Not sure if I can attend',
      info: 'Need more information',
      compare: 'Comparing with other events',
      payment: 'Payment issues',
      other: 'Other reason',
    };
    return labels[reason] || reason;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-agtech-white text-2xl">Exit Feedback</h2>
        <div className="bg-agtech-lime/20 px-4 py-2 rounded-lg">
          <span className="text-agtech-lime font-medium">{feedback.length} submissions</span>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-agtech-sage" />
        <input
          type="text"
          placeholder="Search feedback..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-agtech-black/50 border border-agtech-white/20 rounded-lg pl-10 pr-4 py-2 text-agtech-white focus:border-agtech-lime focus:outline-none"
        />
      </div>

      <div className="grid gap-4">
        {filteredFeedback.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="text-agtech-sage mx-auto mb-4" />
            <p className="text-agtech-sage">No exit feedback submissions yet</p>
            <p className="text-agtech-sage/60 text-sm mt-2">
              Feedback will appear here when users exit the registration page
            </p>
          </div>
        ) : (
          filteredFeedback.map((item) => (
            <div key={item.id} className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                      Step {item.step}
                    </span>
                    <span className="text-agtech-lime text-sm font-medium">
                      {getReasonLabel(item.reason)}
                    </span>
                    <span className="text-agtech-sage text-xs">
                      {new Date(item.submittedAt).toLocaleString()}
                    </span>
                  </div>

                  {item.otherReason && (
                    <div className="bg-agtech-black/30 rounded-lg p-3 mb-3">
                      <p className="label-mono text-agtech-sage text-[10px] mb-1">DETAILED REASON</p>
                      <p className="text-agtech-white text-sm">{item.otherReason}</p>
                    </div>
                  )}

                  {item.email && (
                    <div className="flex items-center gap-2 text-agtech-sage text-sm">
                      <Mail size={14} />
                      {item.email}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteFeedback(item.id)}
                  className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 ml-4"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


