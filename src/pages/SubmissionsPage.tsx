import { useState, useEffect } from 'react';
import { Upload, FileText, Download, Clock, CheckCircle } from 'lucide-react';
import Navbar from '../components/navigation/Navbar';
import { paperSubmissionsApi } from '../data/database';

interface FormData {
  authorName: string;
  email: string;
  phone: string;
  country: string;
  paperTitle: string;
  organization: string;
  researchTrack: string;
  coAuthors: string;
}

const researchTracks = [
  'Precision Agriculture & IoT',
  'AI & Machine Learning in Farming',
  'Supply Chain & Logistics Innovation',
  'Agricultural Finance & Insurance',
  'Climate-Smart Agriculture',
  'Sustainable Farming Practices',
  'Post-Harvest Technology',
  'Farmer-Centric Business Models',
];

const SubmissionsPage = () => {
  const [formData, setFormData] = useState<FormData>({
    authorName: '',
    email: '',
    phone: '',
    country: '',
    paperTitle: '',
    organization: '',
    researchTrack: '',
    coAuthors: '',
  });
  const [abstractFile, setAbstractFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // Countdown timer
  useEffect(() => {
    const deadline = new Date('2026-07-15T23:59:59');
    
    const updateTimer = () => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAbstractFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    paperSubmissionsApi.create({
      ...formData,
      abstractFile: abstractFile ? abstractFile.name : null,
    });

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="relative bg-agtech-black min-h-screen">
        <div className="grain-overlay" />
        <Navbar />
        <main className="relative pt-28 pb-16 flex items-center justify-center min-h-screen">
          <div className="text-center px-6">
            <div className="w-20 h-20 bg-agtech-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-agtech-lime" />
            </div>
            <h1 className="headline-section text-agtech-white mb-4">
              Abstract Submitted Successfully!
            </h1>
            <p className="body-text text-agtech-sage max-w-md mx-auto mb-8">
              Thank you for your submission. We will review your abstract and get back to you within 2-4 weeks.
            </p>
            <a href="/" className="btn-primary">Return to Home</a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative bg-agtech-black min-h-screen">
      <div className="grain-overlay" />
      <Navbar />
      
      <main className="relative pt-24 md:pt-28 pb-16">
        {/* Hero Section */}
        <div className="px-4 md:px-8 lg:px-12 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <span className="label-mono text-agtech-lime mb-4 block">
              AgTech Summit 2026 • BANGALORE, INDIA
            </span>
            <h1 className="headline-display text-agtech-white mb-4">
              Call for Papers
            </h1>
            <p className="body-text text-agtech-sage mb-8">
              Submit your research and be part of India's premier agricultural innovation platform
            </p>

            {/* Countdown */}
            <div className="flex justify-center gap-4 md:gap-8 mb-12">
              {[
                { value: timeLeft.days, label: 'DAYS' },
                { value: timeLeft.hours, label: 'HOURS' },
                { value: timeLeft.mins, label: 'MINS' },
                { value: timeLeft.secs, label: 'SECS' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="font-display font-black text-agtech-lime text-3xl md:text-5xl">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="label-mono text-agtech-sage text-[10px] mt-1">{item.label}</div>
                </div>
              ))}
            </div>

            <p className="body-text text-agtech-white/70">
              Phase 1: Early Submission • Ends <span className="text-agtech-lime">July 15</span>
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-6 md:p-10">
              <h2 className="font-display font-bold text-agtech-white text-2xl mb-2 text-center">
                Submit Your Abstract
              </h2>
              <p className="body-text text-agtech-sage text-center mb-8">
                Please ensure your abstract uses the official AgTech Summit 2026 template
              </p>

              <button className="w-full mb-8 py-3 px-4 bg-agtech-white/10 hover:bg-agtech-white/20 border border-agtech-white/20 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Download size={18} className="text-agtech-lime" />
                <span className="body-text text-agtech-white">Download Templates</span>
              </button>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-mono text-agtech-sage text-xs mb-2 block">Author Name *</label>
                    <input
                      type="text"
                      name="authorName"
                      required
                      value={formData.authorName}
                      onChange={handleInputChange}
                      className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="label-mono text-agtech-sage text-xs mb-2 block">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-mono text-agtech-sage text-xs mb-2 block">WhatsApp / Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="label-mono text-agtech-sage text-xs mb-2 block">Country *</label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                      placeholder="India"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-2 block">Paper Title *</label>
                  <input
                    type="text"
                    name="paperTitle"
                    required
                    value={formData.paperTitle}
                    onChange={handleInputChange}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                    placeholder="Enter your paper title"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-mono text-agtech-sage text-xs mb-2 block">Organization *</label>
                    <input
                      type="text"
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                      placeholder="University/Company Name"
                    />
                  </div>
                  <div>
                    <label className="label-mono text-agtech-sage text-xs mb-2 block">Research Track *</label>
                    <select
                      name="researchTrack"
                      required
                      value={formData.researchTrack}
                      onChange={handleInputChange}
                      className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                    >
                      <option value="">Select a track</option>
                      {researchTracks.map((track) => (
                        <option key={track} value={track}>{track}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-2 block">Co-Authors Details (Optional)</label>
                  <textarea
                    name="coAuthors"
                    value={formData.coAuthors}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                    placeholder="Name, Email, Organization (one per line)"
                  />
                </div>

                <div>
                  <label className="label-mono text-agtech-sage text-xs mb-2 block">Upload Abstract (PDF/DOCX) *</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="abstract-file"
                      required
                    />
                    <label
                      htmlFor="abstract-file"
                      className="w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-dashed border-agtech-white/30 rounded-lg cursor-pointer hover:border-agtech-lime transition-colors"
                    >
                      <Upload size={24} className="text-agtech-lime" />
                      <div className="text-center">
                        <p className="body-text text-agtech-white">
                          {abstractFile ? abstractFile.name : 'Click to upload abstract'}
                        </p>
                        <p className="text-xs text-agtech-sage mt-1">Max 10MB • PDF or DOCX</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Clock size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText size={18} />
                      Submit Abstract
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmissionsPage;
