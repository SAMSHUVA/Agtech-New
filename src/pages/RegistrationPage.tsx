import { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, ChevronLeft, ChevronRight,
  Lock, Shield, CreditCard, MessageCircle, Globe, ChevronDown,
  X, HelpCircle, FileText
} from 'lucide-react';
import Navbar from '../components/navigation/Navbar';
import { 
  passTiersApi, registrationsApi, exitFeedbackApi, subscribeDatabase,
  currencies, formatPrice, detectCurrencyByCountry 
} from '../data/database';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  organization: string;
  dietaryRequirements: string;
  couponCode: string;
}

interface ExitFeedbackData {
  reason: string;
  otherReason: string;
  email: string;
}

const countries = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 
  'Germany', 'France', 'Singapore', 'UAE', 'Japan', 'Other'
];

const DEFAULT_IP_LOOKUP_URL = 'https://ipapi.co/json/';
const IP_LOOKUP_URL = import.meta.env.VITE_IP_LOOKUP_URL?.trim() || DEFAULT_IP_LOOKUP_URL;

const exitReasons = [
  { id: 'price', label: 'Price is too high' },
  { id: 'uncertain', label: 'Not sure if I can attend' },
  { id: 'info', label: 'Need more information' },
  { id: 'compare', label: 'Comparing with other events' },
  { id: 'payment', label: 'Payment issues' },
  { id: 'other', label: 'Other reason' },
];

const faqs = [
  {
    question: 'Is my payment secure?',
    answer: 'Yes, all payments are processed through Razorpay with 256-bit SSL encryption. We are PCI DSS compliant and never store your card details.',
  },
  {
    question: 'What is the refund policy?',
    answer: 'Full refund available up to 30 days before the event. 50% refund between 30-14 days. No refund within 14 days of the event, but you can transfer your ticket to another person.',
  },
  {
    question: 'Can I change my attendance mode (In-Person/Virtual)?',
    answer: 'Yes, you can switch between In-Person and Virtual passes up to 14 days before the event. Any price difference will be adjusted.',
  },
  {
    question: 'Will I receive a formal invoice for my organization?',
    answer: 'Yes, a GST-compliant invoice will be emailed to you within 24 hours of successful payment. The invoice includes all necessary details for reimbursement.',
  },
  {
    question: 'What is included in the registration fee?',
    answer: 'In-Person passes include: Conference access, lunch & refreshments, networking events, printed materials, and certificate. Virtual passes include: Live stream access, digital materials, virtual networking, and digital certificate.',
  },
  {
    question: 'Can I get a student discount?',
    answer: 'Yes, valid students receive 50% off on all pass types. You will need to upload a valid student ID during registration.',
  },
  {
    question: 'How do I submit a paper for presentation?',
    answer: 'Visit the Submissions page and fill out the abstract submission form. Papers are reviewed within 2-4 weeks, and accepted authors will be notified via email.',
  },
  {
    question: 'Is there group registration discount?',
    answer: 'Yes, groups of 5+ receive 10% off, and groups of 10+ receive 15% off. Contact us at hello@agtechsummit.in for group registration.',
  },
];

const policies = [
 {
    title: 'Registration Guidelines',
    content: `
      â€¢ All registrations must be completed online through our secure payment gateway.
      â€¢ Early Bird rates are valid until July 15, 2026 or until slots are filled.
      â€¢ Student registrations require valid student ID verification.
      â€¢ Group registrations (5+) are eligible for discounts - contact us for details.
      â€¢ All prices are inclusive of applicable taxes.
    `,
  },
  {
    title: 'Cancellation & Refund Policy',
    content: `
      â€¢ Full refund: Up to 30 days before the event (before October 22, 2026)
      â€¢ 50% refund: Between 30-14 days before the event (Oct 22 - Nov 7, 2026)
      â€¢ No refund: Within 14 days of the event (after Nov 7, 2026)
      â€¢ Ticket transfers allowed at any time with prior notification
      â€¢ Refunds processed within 14 business days to original payment method
    `,
  },
  {
    title: 'Privacy Policy',
    content: `
      â€¢ We collect only necessary information for event registration and communication.
      â€¢ Your data is stored securely and never shared with third parties without consent.
      â€¢ We use your contact information to send event updates and important announcements.
      â€¢ Photos and videos may be taken during the event for promotional purposes.
      â€¢ You can request data deletion by emailing privacy@agtechsummit.in
    `,
  },
  {
    title: 'Terms & Conditions',
    content: `
      â€¢ By registering, you agree to follow the event code of conduct.
      â€¢ IAISR reserves the right to modify the agenda and speaker lineup.
      â€¢ The event may be recorded for promotional and educational purposes.
      â€¢ Attendees are responsible for their own travel and accommodation arrangements.
      â€¢ IAISR is not liable for any personal belongings lost or damaged during the event.
    `,
  },
];

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [selectedPass, setSelectedPass] = useState<string>('regular');
  const [currency, setCurrency] = useState<string>('INR');
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitFeedback, setExitFeedback] = useState<ExitFeedbackData>({
    reason: '',
    otherReason: '',
    email: '',
  });
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    organization: '',
    dietaryRequirements: '',
    couponCode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openPolicy, setOpenPolicy] = useState<number | null>(null);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [passTiers, setPassTiers] = useState(passTiersApi.getAll());

  const selectedTier = (passTiers.find((tier) => tier.id === selectedPass) || passTiers[1] || passTiers[0])!;

  // Detect location and set currency
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch(IP_LOOKUP_URL);
        if (!response.ok) {
          throw new Error(`Geo lookup failed with status ${response.status}`);
        }
        const data = await response.json();
        const country = data.country_name || 'India';
        const detectedCurrency = detectCurrencyByCountry(country);
        setCurrency(detectedCurrency);
      } catch {
        setCurrency('INR');
      }
    };
    detectLocation();
  }, []);

  useEffect(() => {
    return subscribeDatabase(() => {
      setPassTiers(passTiersApi.getAll());
    });
  }, []);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !submitted && !showExitPopup) {
        setShowExitPopup(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [submitted, showExitPopup]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Update currency when country changes
    if (e.target.name === 'country') {
      const newCurrency = detectCurrencyByCountry(e.target.value);
      setCurrency(newCurrency);
    }
  };

  const handleExitFeedbackSubmit = () => {
    if (exitFeedback.reason) {
      exitFeedbackApi.create({
        step,
        reason: exitFeedback.reason,
        otherReason: exitFeedback.otherReason,
        email: exitFeedback.email,
      });
    }
    setShowExitPopup(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    registrationsApi.create({
      passType: selectedTier.name,
      passId: selectedPass,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization,
      country: formData.country,
      dietaryRequirements: formData.dietaryRequirements,
      couponCode: formData.couponCode,
      amount: selectedTier.prices[currency],
      currency,
    });

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const getPrice = (tier: typeof passTiers[0]) => {
    return tier.prices[currency] || tier.prices['USD'];
  };

  const platformFee = Math.round(getPrice(selectedTier) * 0.05);
  const total = getPrice(selectedTier) + platformFee;

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
              Registration Successful!
            </h1>
            <p className="body-text text-agtech-sage max-w-md mx-auto mb-4">
              Thank you for registering for AgTech Summit 2026. 
            </p>
            <p className="body-text text-agtech-sage max-w-md mx-auto mb-8">
              A confirmation email has been sent to <span className="text-agtech-lime">{formData.email}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/#" className="btn-primary">Return to Home</a>
              <button className="btn-secondary flex items-center justify-center gap-2">
                <FileText size={18} />
                Download Invoice
              </button>
            </div>
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
        {/* Progress Header */}
        <div className="px-4 md:px-8 lg:px-12 mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="label-mono text-agtech-sage">Registration Progress</h1>
              <span className="label-mono text-agtech-lime">Step {step} of 2</span>
            </div>
            <div className="h-1 bg-agtech-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-agtech-lime transition-all duration-500"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className={`text-xs ${step >= 1 ? 'text-agtech-lime' : 'text-agtech-sage'}`}>1. Select Pass</span>
              <span className={`text-xs ${step >= 2 ? 'text-agtech-lime' : 'text-agtech-sage'}`}>2. Your Details</span>
            </div>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="px-4 md:px-8 lg:px-12 mb-6">
          <div className="max-w-6xl mx-auto flex justify-end">
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-agtech-green/30 border border-agtech-white/20 rounded-lg text-agtech-white hover:border-agtech-lime transition-colors"
              >
                <Globe size={16} className="text-agtech-lime" />
                <span>{currencies[currency]?.symbol} {currency}</span>
                <ChevronDown size={14} />
              </button>
              {showCurrencyDropdown && (
                <div className="absolute right-0 top-full mt-2 bg-agtech-black border border-agtech-white/20 rounded-lg overflow-hidden z-50 min-w-[150px]">
                  {Object.entries(currencies).map(([code, curr]) => (
                    <button
                      key={code}
                      onClick={() => { setCurrency(code); setShowCurrencyDropdown(false); }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-agtech-green/30 transition-colors ${currency === code ? 'text-agtech-lime' : 'text-agtech-white'}`}
                    >
                      {curr.symbol} {code} - {curr.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Registration Content */}
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {step === 1 ? (
                  /* Step 1: Pass Selection */
                  <div className="bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-5 md:p-8">
                    <h2 className="font-display font-bold text-agtech-white text-xl md:text-2xl mb-2">
                      1. Select Your Pass
                    </h2>
                    <p className="body-text text-agtech-sage mb-6">
                      Choose a pass below. Benefits differ by attendance mode.
                    </p>

                    {/* Pass Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {passTiers.map((tier) => (
                        <button
                          key={tier.id}
                          onClick={() => setSelectedPass(tier.id)}
                          className={`relative text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-300 ${
                            selectedPass === tier.id
                              ? 'border-agtech-lime bg-agtech-lime/10'
                              : 'border-agtech-white/10 bg-agtech-black/50 hover:border-agtech-white/30'
                          }`}
                        >
                          <span className={`absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${tier.badgeColor}`}>
                            {tier.badge}
                          </span>
                          <div className="pr-14">
                            <p className="label-mono text-agtech-sage text-[10px] mb-1">
                              {tier.mode === 'in-person' ? 'In-Person' : 'Virtual'}
                            </p>
                            <h3 className="font-display font-bold text-agtech-white text-sm md:text-base mb-1">
                              {tier.name}
                            </h3>
                            <p className="font-display font-black text-agtech-white text-2xl md:text-3xl">
                              {formatPrice(tier.prices[currency] || tier.prices['USD'], currency)}
                            </p>
                          </div>
                          <div className={`absolute bottom-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedPass === tier.id ? 'border-agtech-lime bg-agtech-lime' : 'border-agtech-white/30'
                          }`}>
                            {selectedPass === tier.id && <CheckCircle size={12} className="text-agtech-black" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Benefits */}
                    <div className="mt-6 p-4 bg-agtech-black/50 rounded-xl">
                      <h3 className="font-display font-bold text-agtech-white text-sm mb-3">
                        What's Included
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {(selectedTier.mode === 'in-person' ? [
                          'Venue: ITC Gardenia, Bangalore',
                          'Lunch & Refreshments Included',
                          'Physical Networking Sessions',
                          'Printed Certificates & Kits',
                        ] : [
                          'Live Stream Access (HD Quality)',
                          'Digital Resource Materials',
                          'Virtual Networking Rooms',
                          'Digital Certificate of Attendance',
                        ]).map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-agtech-sage text-sm">
                            <CheckCircle size={14} className="text-agtech-lime flex-shrink-0" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => setStep(2)}
                      className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
                    >
                      Continue to Details
                      <ChevronRight size={18} />
                    </button>
                  </div>
                ) : (
                  /* Step 2: Your Details */
                  <div className="bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-5 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <button 
                        onClick={() => setStep(1)}
                        className="p-2 bg-agtech-white/10 rounded-lg hover:bg-agtech-white/20 transition-colors"
                      >
                        <ChevronLeft size={18} className="text-agtech-white" />
                      </button>
                      <h2 className="font-display font-bold text-agtech-white text-xl md:text-2xl">
                        2. Your Details
                      </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="label-mono text-agtech-sage text-xs mb-2 block">First Name *</label>
                          <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="label-mono text-agtech-sage text-xs mb-2 block">Last Name *</label>
                          <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                            placeholder="Doe"
                          />
                        </div>
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
                        <select
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                        >
                          <option value="">Select your country</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="label-mono text-agtech-sage text-xs mb-2 block">Organization *</label>
                        <input
                          type="text"
                          name="organization"
                          required
                          value={formData.organization}
                          onChange={handleInputChange}
                          className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                          placeholder="University or Company"
                        />
                      </div>

                      {selectedTier.mode === 'in-person' && (
                        <div>
                          <label className="label-mono text-agtech-sage text-xs mb-2 block">
                            Dietary Requirements (In-Person only)
                          </label>
                          <textarea
                            name="dietaryRequirements"
                            value={formData.dietaryRequirements}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                            placeholder="Any allergies or requirements?"
                          />
                        </div>
                      )}

                      <div>
                        <label className="label-mono text-agtech-sage text-xs mb-2 block">Have a coupon code?</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="couponCode"
                            value={formData.couponCode}
                            onChange={handleInputChange}
                            className="flex-1 bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none transition-colors"
                            placeholder="Enter code (e.g. SAVE10)"
                          />
                          <button
                            type="button"
                            className="px-4 py-2 bg-agtech-lime text-agtech-black rounded-lg font-display font-bold text-sm hover:bg-agtech-lime/90 transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 btn-secondary"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <Clock size={18} className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Pay {formatPrice(total, currency)}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Right Column - Order Summary */}
              <div className="space-y-6">
                <div className="bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-5 md:p-6 lg:sticky lg:top-28">
                  <h3 className="font-display font-bold text-agtech-white text-lg mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="body-text text-agtech-sage">
                        1x {selectedTier.name} ({selectedTier.mode === 'in-person' ? 'In-Person' : 'Virtual'})
                      </span>
                      <span className="body-text text-agtech-white">
                        {formatPrice(getPrice(selectedTier), currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="body-text text-agtech-sage">Platform Handling (5%)</span>
                      <span className="body-text text-agtech-white">{formatPrice(platformFee, currency)}</span>
                    </div>
                  </div>

                  <div className="h-px bg-agtech-white/10 mb-6" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="font-display font-bold text-agtech-white text-lg">Total</span>
                    <span className="font-display font-black text-agtech-lime text-2xl md:text-3xl">
                      {formatPrice(total, currency)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-agtech-sage">
                      <Lock size={14} className="text-agtech-lime" />
                      <span className="text-xs">SSL Secured 256-bit Encryption</span>
                    </div>
                    <div className="flex items-center gap-2 text-agtech-sage">
                      <Shield size={14} className="text-agtech-lime" />
                      <span className="text-xs">PCI DSS Compliant Payments</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="label-mono text-agtech-sage text-[10px] mb-3">POWERED BY</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-agtech-white text-sm">Razorpay</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-5 bg-agtech-white/10 rounded flex items-center justify-center">
                          <CreditCard size={12} className="text-agtech-sage" />
                        </div>
                        <div className="w-8 h-5 bg-agtech-white/10 rounded flex items-center justify-center">
                          <span className="text-[8px] text-agtech-sage font-bold">VISA</span>
                        </div>
                        <div className="w-8 h-5 bg-agtech-white/10 rounded flex items-center justify-center">
                          <span className="text-[8px] text-agtech-sage font-bold">UPI</span>
                        </div>
                      </div>
                      <span className="text-xs text-agtech-sage">+ more</span>
                    </div>
                  </div>

                  <div className="border-t border-agtech-white/10 pt-5">
                    <p className="label-mono text-agtech-sage text-[10px] mb-3">NEED ASSISTANCE?</p>
                    <a 
                      href="https://wa.me/918610100624"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-agtech-cyan hover:bg-agtech-cyan/90 text-white rounded-lg transition-colors mb-3"
                    >
                      <MessageCircle size={18} />
                      <span className="font-display font-bold text-sm">Chat on WhatsApp</span>
                    </a>
                    <div className="text-center">
                      <a href="mailto:info@iaisr.com" className="text-agtech-lime text-sm hover:underline">
                        info@iaisr.com
                      </a>
                      <p className="text-agtech-sage text-xs mt-1">Avg. response time: &lt; 2 Hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-4 md:px-8 lg:px-12 mt-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-bold text-agtech-white text-2xl md:text-3xl text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                  >
                    <span className="font-display font-medium text-agtech-white pr-4">{faq.question}</span>
                    <ChevronDown 
                      size={20} 
                      className={`text-agtech-lime flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5">
                      <p className="body-text text-agtech-sage">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Policies Section */}
        <div className="px-4 md:px-8 lg:px-12 mt-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-bold text-agtech-white text-2xl md:text-3xl text-center mb-8">
              Policies & Guidelines
            </h2>
            <div className="space-y-3">
              {policies.map((policy, index) => (
                <div 
                  key={index} 
                  className="bg-agtech-green/20 border border-agtech-white/10 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenPolicy(openPolicy === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                  >
                    <span className="font-display font-medium text-agtech-white pr-4">{policy.title}</span>
                    <ChevronDown 
                      size={20} 
                      className={`text-agtech-lime flex-shrink-0 transition-transform ${openPolicy === index ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {openPolicy === index && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5">
                      <pre className="body-text text-agtech-sage whitespace-pre-wrap font-sans">{policy.content}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Exit Intent Popup */}
      {showExitPopup && (
        <div className="fixed inset-0 z-[200] bg-agtech-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-agtech-green/30 border border-agtech-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-agtech-lime/20 rounded-full flex items-center justify-center">
                <HelpCircle size={24} className="text-agtech-lime" />
              </div>
              <button 
                onClick={() => setShowExitPopup(false)}
                className="text-agtech-sage hover:text-agtech-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <h3 className="font-display font-bold text-agtech-white text-xl mb-2">
              Wait! Before you go...
            </h3>
            <p className="body-text text-agtech-sage mb-6">
              We'd love to know why you're leaving. Your feedback helps us improve.
            </p>

            <div className="space-y-3 mb-6">
              {exitReasons.map((reason) => (
                <label 
                  key={reason.id}
                  className="flex items-center gap-3 p-3 bg-agtech-black/50 rounded-lg cursor-pointer hover:bg-agtech-black/70 transition-colors"
                >
                  <input
                    type="radio"
                    name="exitReason"
                    value={reason.id}
                    checked={exitFeedback.reason === reason.id}
                    onChange={(e) => setExitFeedback({ ...exitFeedback, reason: e.target.value })}
                    className="w-4 h-4 accent-agtech-lime"
                  />
                  <span className="text-agtech-white text-sm">{reason.label}</span>
                </label>
              ))}
            </div>

            {exitFeedback.reason === 'other' && (
              <textarea
                value={exitFeedback.otherReason}
                onChange={(e) => setExitFeedback({ ...exitFeedback, otherReason: e.target.value })}
                placeholder="Please tell us more..."
                rows={3}
                className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none mb-4"
              />
            )}

            <input
              type="email"
              value={exitFeedback.email}
              onChange={(e) => setExitFeedback({ ...exitFeedback, email: e.target.value })}
              placeholder="Your email (optional)"
              className="w-full bg-agtech-black/50 border border-agtech-white/20 rounded-lg px-4 py-3 text-agtech-white focus:border-agtech-lime focus:outline-none mb-6"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowExitPopup(false)}
                className="flex-1 btn-secondary"
              >
                Continue Registration
              </button>
              <button
                onClick={handleExitFeedbackSubmit}
                className="flex-1 btn-primary"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPage;

