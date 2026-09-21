import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Trophy, 
  CheckCircle2, 
  Download, 
  FileSpreadsheet, 
  User, 
  Building2, 
  Phone, 
  Sparkles, 
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  Share2,
  Copy,
  Check,
  Music,
  Link,
  Loader2
} from 'lucide-react';
import { CompetitionParticipant } from '../types';
import { submitNominationToGoogleSheet } from '../services/googleSheetsService';
import { 
  NominationFormEntry, 
  saveLocalNomination, 
  exportToExcel, 
  exportToCsv,
  mergeParticipantsWithLocalNominations,
  normalizeCategory,
  getParticipantKey
} from '../services/nominationService';

interface NominationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  allParticipants: CompetitionParticipant[];
  localNominations: NominationFormEntry[];
  onNominationAdded: (newEntry: NominationFormEntry) => void;
}

const CATEGORY_OPTIONS = [
  { id: 'Dance', label: 'Dance / नृत्य स्पर्धा', icon: '💃' },
  { id: 'Drawing', label: 'Drawing / चित्रकला स्पर्धा', icon: '🎨' },
  { id: 'Drama', label: 'Drama / नाट्य व अभिनय', icon: '🎭' },
  { id: 'Emcee / Host', label: 'Emcee / Host (सूत्रसंचालन)', icon: '⭐' },
  { id: 'Piano Play', label: 'Piano Play / पियानो वादन', icon: '🎹' },
  { id: 'Rangoli', label: 'Rangoli / रांगोळी स्पर्धा', icon: '🌸' },
  { id: 'Shloka', label: 'Shloka / श्लोक पठण', icon: '📖' },
  { id: 'Singing', label: 'Singing / गायन स्पर्धा', icon: '🎤' },
  { id: 'Other', label: 'Other Talent / इतर स्पर्धा', icon: '✨' }
];

const AGE_GROUPS = [
  'Under 6 Years (गट अ - ६ वर्षांखालील)',
  '6 to 10 Years (गट ब - ६ ते १० वर्षे)',
  '11 to 15 Years (गट क - ११ ते १५ वर्षे)',
  '16+ Years / Open Group (खुला गट - १६ वर्षे व पुढे)'
];

export const NominationFormModal: React.FC<NominationFormModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  allParticipants,
  localNominations,
  onNominationAdded
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dance');
  const [customCategory, setCustomCategory] = useState('');
  const [wing, setWing] = useState<'A' | 'B'>('A');
  const [flatNumber, setFlatNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [trackUrl, setTrackUrl] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedEntry, setLastSubmittedEntry] = useState<NominationFormEntry | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Sync initialCategory when modal opens or changes
  useEffect(() => {
    if (isOpen) {
      if (initialCategory) {
        const norm = normalizeCategory(initialCategory);
        // Try matching standard category
        const matched = CATEGORY_OPTIONS.find(c => 
          c.id.toLowerCase() === norm.toLowerCase() ||
          c.id.toLowerCase() === initialCategory.toLowerCase() ||
          initialCategory.toLowerCase().includes(c.id.toLowerCase()) ||
          c.id.toLowerCase().includes(initialCategory.toLowerCase())
        );
        if (matched) {
          setCategory(matched.id);
        } else {
          setCategory('Other');
          setCustomCategory(initialCategory);
        }
      }
      setIsSubmitted(false);
      setErrors({});
    }
  }, [isOpen, initialCategory]);

  const selectedCategoryName = category === 'Other' && customCategory.trim() 
    ? normalizeCategory(customCategory.trim()) 
    : normalizeCategory(category);

  // Smart mobile input: strip international +91/0 prefixes, spaces, and non-digits
  const handleMobileChange = (val: string) => {
    let clean = val.replace(/[\s-]/g, '');
    if (clean.startsWith('+91')) clean = clean.slice(3);
    else if (clean.startsWith('91') && clean.length === 12) clean = clean.slice(2);
    else if (clean.startsWith('0') && clean.length === 11) clean = clean.slice(1);
    clean = clean.replace(/\D/g, '').slice(0, 10);
    setMobile(clean);
    if (errors.mobile) setErrors(prev => ({ ...prev, mobile: '' }));
  };

  // Smart flat number: alphanumeric uppercase without invalid special characters
  const handleFlatChange = (val: string) => {
    const clean = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 5);
    setFlatNumber(clean);
    if (errors.flatNumber) setErrors(prev => ({ ...prev, flatNumber: '' }));
  };

  // Real-time duplicate registration detection
  const existingParticipant = useMemo(() => {
    if (!name.trim() || !flatNumber.trim()) return null;
    const cleanFlat = flatNumber.trim().toUpperCase();
    const currentKey = getParticipantKey(name, selectedCategoryName, wing, cleanFlat);
    return allParticipants.find(p => 
      getParticipantKey(p.name, p.eventCategory, p.wing, p.flatNumber) === currentKey
    );
  }, [name, selectedCategoryName, wing, flatNumber, allParticipants]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'कृपया स्पर्धकाचे पूर्ण नाव टाका (Min 2 characters)';
    }
    if (!flatNumber.trim()) {
      errs.flatNumber = 'कृपया फ्लॅट नंबर टाका (उदा. 202, 504)';
    } else if (!/^[0-9]{1,4}[a-zA-Z]?$/.test(flatNumber.trim())) {
      errs.flatNumber = 'वैध फ्लॅट नंबर टाका (उदा. 101, 804)';
    }
    if (mobile.trim() && !/^[6-9]\d{9}$/.test(mobile)) {
      errs.mobile = '१० अंकी वैध मोबाईल नंबर टाका (उदा. 9876543210)';
    }
    if (category === 'Other' && !customCategory.trim()) {
      errs.category = 'कृपया स्पर्धा नाव नमूद करा';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (autoDownloadExcel: boolean = false) => {
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      eventCategory: selectedCategoryName,
      wing,
      flatNumber: flatNumber.trim().toUpperCase(),
      mobile: mobile.trim() || undefined,
      ageGroup: ageGroup || undefined,
      trackUrl: trackUrl.trim() || undefined,
      notes: notes.trim() || undefined
    };

    // 1. Save locally for instant UI update & offline availability
    const saved = saveLocalNomination(payload);
    onNominationAdded(saved);
    setLastSubmittedEntry(saved);

    // 2. Submit directly to live Google Sheet via Apps Script Webhook
    try {
      await submitNominationToGoogleSheet({
        ...payload,
        srNo: saved.srNo
      });
    } catch (err) {
      console.warn('Google Sheet background submission notice:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }

    if (autoDownloadExcel) {
      // Immediate download of the updated workbook with the new participant
      const updatedLocal = [saved, ...localNominations];
      const merged = mergeParticipantsWithLocalNominations(allParticipants, [saved]);
      exportToExcel(merged, updatedLocal, `PrideUniversal_Nominations_${saved.eventCategory.replace(/\s+/g, '_')}`);
    }
  };

  const handleResetForNext = () => {
    setName('');
    // Intentionally keep wing & flatNumber for fast registration of siblings/family members
    setMobile('');
    setTrackUrl('');
    setNotes('');
    setErrors({});
    setIsSubmitted(false);
    setLastSubmittedEntry(null);
    setIsCopied(false);
  };

  const handleCopyDetails = () => {
    if (!lastSubmittedEntry) return;
    const text = `🕉️ श्री गणेशोत्सव २०२६ - स्पर्धा नावनोंदणी पावती\n` +
      `🏆 स्पर्धा: ${lastSubmittedEntry.eventCategory}\n` +
      `👤 स्पर्धक: ${lastSubmittedEntry.name}\n` +
      `🏢 पत्ता: Wing ${lastSubmittedEntry.wing} - Flat ${lastSubmittedEntry.flatNumber}\n` +
      (lastSubmittedEntry.mobile ? `📱 मोबाईल: ${lastSubmittedEntry.mobile}\n` : '') +
      (lastSubmittedEntry.ageGroup ? `🎂 वयोगट: ${lastSubmittedEntry.ageGroup}\n` : '') +
      (lastSubmittedEntry.trackUrl ? `🎵 गाण्याची लिंक: ${lastSubmittedEntry.trackUrl}\n` : '') +
      `📍 प्राइड युनिव्हर्सल सोसायटी गणेशोत्सव २०२६`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    if (!lastSubmittedEntry) return;
    const msg = encodeURIComponent(
      `🎉 मी प्राइड युनिव्हर्सल गणेशोत्सव २०२६ साठी नाव नोंदवले आहे!\n\n` +
      `🏆 स्पर्धा: ${lastSubmittedEntry.eventCategory}\n` +
      `👤 स्पर्धक: ${lastSubmittedEntry.name}\n` +
      `🏢 विंग व फ्लॅट: Wing ${lastSubmittedEntry.wing}-${lastSubmittedEntry.flatNumber}\n` +
      (lastSubmittedEntry.trackUrl ? `🎵 गाण्याची लिंक: ${lastSubmittedEntry.trackUrl}\n` : '') +
      `\n🌺 गणपती बाप्पा मोरया! 🌺`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleExportAllToExcel = () => {
    exportToExcel(allParticipants, localNominations, 'PrideUniversal_All_Nominations_2026');
  };

  const handleExportAllToCsv = () => {
    exportToCsv(allParticipants, localNominations, 'PrideUniversal_All_Nominations_2026');
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border-2 border-amber-400 my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-950 via-red-900 to-amber-950 text-amber-100 px-5 py-4 border-b border-amber-400/40 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 shadow-inner">
              🏆
            </span>
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-amber-300">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>गणेशोत्सव २०२६ • स्पर्धा नावनोंदणी</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-amber-100 font-festive">
                {isSubmitted ? 'नोंदणी यशस्वी झाली! (Nomination Saved)' : 'स्पर्धा नोंदणी फॉर्म (Nomination Form)'}
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-amber-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto scrollbar-thin">
          {!isSubmitted ? (
            /* Registration Form */
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(true); }} className="space-y-4">
              {/* Competition Category Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  १. स्पर्धा निवडा (Event Category) <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        category === cat.id
                          ? 'bg-amber-100 text-red-950 border-amber-500 shadow-xs ring-2 ring-amber-400/50'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50/60'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="truncate">{cat.id}</span>
                    </button>
                  ))}
                </div>

                {category === 'Other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="स्पर्धेचे नाव लिहा (e.g. Fancy Dress, Poetry)"
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/50"
                    />
                    {errors.category && (
                      <p className="text-[11px] text-red-600 font-bold mt-1">{errors.category}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Participant Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  २. स्पर्धकाचे पूर्ण नाव (Participant Full Name) <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="उदा. Aarav Patil / अनुजा जोशी"
                    className={`w-full text-sm font-semibold pl-9 pr-3 py-2 rounded-xl border ${
                      errors.name ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-amber-500'
                    } focus:outline-none focus:ring-2 focus:ring-amber-400/40`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] text-red-600 font-bold mt-1">{errors.name}</p>
                )}
              </div>

              {/* Wing & Flat Number Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Wing */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    ३. विंग (Wing) <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWing('A')}
                      className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        wing === 'A'
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-300'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Wing A</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWing('B')}
                      className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        wing === 'B'
                          ? 'bg-red-700 text-white border-red-800 shadow-xs ring-2 ring-red-300'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Wing B</span>
                    </button>
                  </div>
                </div>

                {/* Flat Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    ४. फ्लॅट नंबर (Flat No) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={flatNumber}
                    onChange={(e) => handleFlatChange(e.target.value)}
                    placeholder="उदा. 102, 504, 1102"
                    maxLength={5}
                    className={`w-full text-sm font-semibold px-3 py-2 rounded-xl border ${
                      errors.flatNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-amber-500'
                    } focus:outline-none focus:ring-2 focus:ring-amber-400/40`}
                  />
                  {errors.flatNumber && (
                    <p className="text-[11px] text-red-600 font-bold mt-1">{errors.flatNumber}</p>
                  )}
                </div>
              </div>

              {/* Mobile Number & Age Group Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    ५. मोबाईल नंबर (WhatsApp / Contact)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => handleMobileChange(e.target.value)}
                      placeholder="उदा. 9822012345 (१० अंक)"
                      maxLength={10}
                      className={`w-full text-xs font-semibold pl-8 pr-3 py-2 rounded-xl border ${
                        errors.mobile ? 'border-red-500 bg-red-50/50' : 'border-slate-300 focus:border-amber-500'
                      } focus:outline-none focus:ring-2 focus:ring-amber-400/40`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-[11px] text-red-600 font-bold mt-1">{errors.mobile}</p>
                  )}
                </div>

                {/* Age Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    ६. वयोगट (Age Group)
                  </label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 bg-white"
                  >
                    <option value="">वयोगट निवडा (Select Age)</option>
                    {AGE_GROUPS.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Song / Audio Track Link */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-amber-700" />
                    <span>७. गाण्याची / ऑडिओ ट्रॅक लिंक (Song / Track Link)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Link className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="url"
                    value={trackUrl}
                    onChange={(e) => setTrackUrl(e.target.value)}
                    placeholder="उदा. YouTube किंवा ऑडिओ / व्हिडिओ लिंक (https://...)"
                    className="w-full text-xs font-medium pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  डान्स, गायन किंवा नाटकासाठी गाण्याची ऑडिओ किंवा व्हिडिओ लिंक देऊ शकता.
                </p>
              </div>

              {/* Notes / Performance Details */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  ८. विशेष माहिती (Notes / Group Details)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="उदा. गाण्याचे बोल, स्वतःचे वाद्य, ग्रुपमधील इतर सदस्यांची नावे इ."
                  rows={2}
                  className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
                />
              </div>

              {/* Live duplicate warning */}
              {existingParticipant && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs shadow-xs">
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="leading-snug">
                    <span className="font-extrabold text-amber-900">आधीच नोंदणी अस्तित्वात आहे:</span> {existingParticipant.name} (विंग {existingParticipant.wing} - फ्लॅट {existingParticipant.flatNumber}) यांची <strong>{existingParticipant.eventCategory}</strong> साठी आधीच नोंदणी झालेली आहे. पुन्हा सबमिट केल्यास माहिती अपडेट होईल.
                  </div>
                </div>
              )}

              {/* Submit Buttons Bar */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-800 transition-colors border border-slate-300 cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                      <span>नोंदणी जतन होत आहे...</span>
                    </>
                  ) : (
                    <span>✅ नोंदणी जतन करा (Save Entry)</span>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-red-800 via-amber-700 to-amber-600 text-white hover:brightness-110 disabled:opacity-60 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                  )}
                  <span>💾 जतन करा व Export करा (Save &amp; Export)</span>
                </button>
              </div>
            </form>
          ) : (
            /* Success / Confirmation Screen */
            <div className="text-center py-4 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md border-2 border-emerald-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
                  ✅ नोंदणी थेट सेव्ह झाली!
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-festive">
                  अभिनंदन! {lastSubmittedEntry?.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                  गणेशोत्सव २०२६ च्या <strong>{lastSubmittedEntry?.eventCategory}</strong> स्पर्धेसाठी तुमची नोंदणी यशस्वीरित्या सेव्ह झाली आहे.
                </p>
              </div>

              {/* Summary Card */}
              {lastSubmittedEntry && (
                <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-300/80 text-left text-xs space-y-2 max-w-md mx-auto shadow-inner">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                    <span className="text-slate-600 font-bold">स्पर्धकाचे नाव:</span>
                    <span className="font-black text-slate-900">{lastSubmittedEntry.name}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                    <span className="text-slate-600 font-bold">स्पर्धा प्रकार:</span>
                    <span className="font-extrabold text-red-900 bg-red-100 px-2 py-0.5 rounded">
                      {lastSubmittedEntry.eventCategory}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                    <span className="text-slate-600 font-bold">फ्लॅट व विंग:</span>
                    <span className="font-extrabold text-slate-900">
                      Wing {lastSubmittedEntry.wing} - {lastSubmittedEntry.flatNumber}
                    </span>
                  </div>
                  {lastSubmittedEntry.mobile && (
                    <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                      <span className="text-slate-600 font-bold">मोबाईल:</span>
                      <span className="font-bold text-slate-800">{lastSubmittedEntry.mobile}</span>
                    </div>
                  )}
                  {lastSubmittedEntry.ageGroup && (
                    <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                      <span className="text-slate-600 font-bold">वयोगट:</span>
                      <span className="font-medium text-slate-800">{lastSubmittedEntry.ageGroup}</span>
                    </div>
                  )}
                  {lastSubmittedEntry.trackUrl && (
                    <div className="flex items-center justify-between border-b border-amber-200 pb-1.5">
                      <span className="text-slate-600 font-bold">गाण्याची लिंक:</span>
                      <a 
                        href={lastSubmittedEntry.trackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline font-semibold truncate max-w-[210px] hover:text-blue-900"
                        title={lastSubmittedEntry.trackUrl}
                      >
                        {lastSubmittedEntry.trackUrl}
                      </a>
                    </div>
                  )}
                  {lastSubmittedEntry.notes && (
                    <div className="pt-1">
                      <span className="text-slate-600 font-bold block mb-0.5">विशेष टिप्पणी:</span>
                      <p className="text-slate-700 bg-white/70 p-2 rounded-lg border border-amber-200">
                        {lastSubmittedEntry.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons for Share, Copy & Export */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  title="Share registration confirmation on WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp शेअर</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  title="Copy confirmation receipt to clipboard"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'कॉपी झाले! ✓' : 'पावती कॉपी'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportToExcel(allParticipants, localNominations, 'PrideUniversal_Nominations_2026');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  title="Download nominations Excel file"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-200" />
                  <span>Excel (.xls)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportToCsv(allParticipants, localNominations, 'PrideUniversal_Nominations_2026');
                  }}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-amber-200 hover:bg-slate-900 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  title="Download nominations CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV (.csv)</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-center gap-3">
                <button
                  onClick={handleResetForNext}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 transition-colors cursor-pointer"
                >
                  + आणखी एक नाव नोंदवा (Register Another)
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
                >
                  पूर्ण झाले (Close)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Banner with Quick Roster Stats */}
        <div className="bg-amber-50 px-5 py-3 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              एकूण नोंदणीकृत स्पर्धक: <strong>{allParticipants.length}</strong> (विंग A: {allParticipants.filter(p => p.wing === 'A').length}, विंग B: {allParticipants.filter(p => p.wing === 'B').length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAllToExcel}
              className="font-bold text-amber-900 hover:text-red-800 underline flex items-center gap-1 cursor-pointer"
              title="Download entire 2026 roster in Excel format"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-700" />
              <span>संपूर्ण यादी Excel मध्ये घ्या (All to Excel)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

