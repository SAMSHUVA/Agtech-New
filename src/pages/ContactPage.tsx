import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import Navbar from '../components/navigation/Navbar';
import { enquiriesApi } from '../data/database';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    country: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    enquiriesApi.create({
      fullName: formData.fullName,
      email: formData.email,
      whatsapp: formData.whatsapp,
      country: formData.country,
      message: formData.message,
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
              Message Sent Successfully!
            </h1>
            <p className="body-text text-agtech-sage max-w-md mx-auto mb-8">
              Thank you for reaching out. Our team will get back to you within 24 hours.
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
            <h1 className="headline-display text-agtech-white mb-4">
              Get in Touch
            </h1>
            <p className="body-text text-agtech-sage">
              Have questions? We're here to help. Reach out to our team for any inquiries 
              about the summit, submissions, or partnerships.
            </p>
          </div>
        </div>

        {/* Contact Content */}
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              {/* Contact Form */}
              <div className="bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-6 md:p-8">
                <h2 className="font-display font-bold text-agtech-white text-xl mb-6">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="label-mono text-agtech-sage text-xs mb-2 block">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
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
                    <div>
                      <label className="label-mono text-agtech-sage text-xs mb-2 block">WhatsApp Number *</label>
                      <input
                        type="tel"
                        name="whatsapp"
                        required
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-mono text-agtech-sage text-xs mb-2 block">Country *</label>
                    <select
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                    >
                      <option value="">Select your country</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="label-mono text-agtech-sage text-xs mb-2 block">Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Quick Contact */}
                <div className="bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-6">
                  <h3 className="font-display font-bold text-agtech-white text-lg mb-5">
                    Quick Contact
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="mailto:hello@agtechsummit.in"
                      className="flex items-center gap-4 p-4 bg-agtech-black/50 rounded-xl hover:bg-agtech-black/70 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-agtech-lime/20 flex items-center justify-center flex-shrink-0">
                        <Mail size={18} className="text-agtech-lime" />
                      </div>
                      <div>
                        <p className="label-mono text-agtech-sage text-[10px]">EMAIL</p>
                        <p className="text-agtech-white text-sm">hello@agtechsummit.in</p>
                      </div>
                    </a>

                    <a
                      href="tel:+918610100624"
                      className="flex items-center gap-4 p-4 bg-agtech-black/50 rounded-xl hover:bg-agtech-black/70 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-agtech-lime/20 flex items-center justify-center flex-shrink-0">
                        <Phone size={18} className="text-agtech-lime" />
                      </div>
                      <div>
                        <p className="label-mono text-agtech-sage text-[10px]">PHONE</p>
                        <p className="text-agtech-white text-sm">+91 86101 00624</p>
                      </div>
                    </a>

                    <div className="flex items-center gap-4 p-4 bg-agtech-black/50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-agtech-lime/20 flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-agtech-lime" />
                      </div>
                      <div>
                        <p className="label-mono text-agtech-sage text-[10px]">VENUE</p>
                        <p className="text-agtech-white text-sm">ITC Gardenia, Bangalore</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Support */}
                <div className="bg-agtech-cyan/10 border border-agtech-cyan/35 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-agtech-cyan flex items-center justify-center">
                      <MessageCircle size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-white">WhatsApp Support</h4>
                      <p className="text-agtech-cyan text-xs">Get instant assistance</p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/918610100624"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-agtech-cyan hover:bg-agtech-cyan/90 text-white rounded-lg font-display font-bold text-sm text-center block transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                  <p className="text-center text-agtech-cyan text-xs mt-3">
                    Avg. response time: &lt; 2 hours
                  </p>
                </div>

                {/* Response Time */}
                <div className="bg-agtech-black/50 border border-agtech-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-agtech-lime" />
                    <div>
                      <p className="text-agtech-white font-medium">24-Hour Response</p>
                      <p className="text-agtech-sage text-sm">We typically respond within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;

