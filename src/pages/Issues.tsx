// src/pages/Issues.tsx
import { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  LocateFixed,
  Loader2,
  Image as ImageIcon,
  ArrowRight,
  MessageSquareWarning,
  Search,
  ChevronDown,
  Check,
  ChevronUp,
  User,
  Phone,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCATIONS } from '../data/locations';

type Priority = 'Normal' | 'Urgent' | 'Life-threatening';

type CategoryKey =
  | 'roads-infrastructure'
  | 'education-schools'
  | 'health-sanitation'
  | 'utilities-environment'
  | 'youth-jobs-welfare'
  | 'community-development'
  | 'governance-feedback';

const CATEGORIES: Record<
  CategoryKey,
  { label: string; subs: string[] }
> = {
  'roads-infrastructure': {
    label: 'Roads & Infrastructure',
    subs: [
      'Potholes / Damaged road',
      'Streetlight not working',
      'Blocked drainage',
      'Bridge/Culvert damage',
      'Flooding',
      'Road markings missing',
      'Waste overflow',
    ],
  },
  'education-schools': {
    label: 'Education & Schools',
    subs: [
      'Broken furniture/roof',
      'Shortage of teachers/textbooks',
      'Poor sanitation',
      'Unsafe structures',
      'ICT/Library needs',
      'Water access',
      'Feeding/bursary delay',
    ],
  },
  'health-sanitation': {
    label: 'Health & Sanitation',
    subs: [
      'Clinic/CHPS non-functioning',
      'Drug/staff shortage',
      'Water/sanitation issue',
      'Waste dumping/burning',
      'Mosquito breeding',
      'Maternity/emergency transport',
    ],
  },
  'utilities-environment': {
    label: 'Utilities & Environment',
    subs: [
      'Power outage/Transformer',
      'Water shortage/Burst pipe',
      'Refuse landfill overflow',
      'Deforestation/sand winning',
      'Air/Noise pollution',
      'Public toilets inadequate',
    ],
  },
  'youth-jobs-welfare': {
    label: 'Youth, Jobs & Welfare',
    subs: [
      'Unemployment/Unfair hiring',
      'Youth/Women groups support',
      'Abandoned livelihood program',
      'Grant disbursement delay',
      'Need entrepreneurship training',
      'Child protection concerns',
    ],
  },
  'community-development': {
    label: 'Community Development',
    subs: [
      'Abandoned community project',
      'Market facilities/toilets',
      'Parks/Lighting needed',
      'Broken boreholes/pumps',
      'Unkept cemeteries/grounds',
      'Security concerns',
      'Mediation support',
    ],
  },
  'governance-feedback': {
    label: 'Governance & Public Service',
    subs: [
      'Extortion/Absenteeism',
      'Permit/forms delay',
      'Bribery/Favouritism',
      'No response from office',
      'Corruption/misuse',
    ],
  },
};

// Pre-compute total communities
const TOTAL_COMMUNITIES = LOCATIONS.reduce((acc, loc) => acc + loc.communities.length, 0);

export function Issues() {
  // ---------- STATE ----------
  // Location
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('');
  const [locationDetail, setLocationDetail] = useState('');
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [locGetting, setLocGetting] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Issue
  const [cat, setCat] = useState<CategoryKey>('roads-infrastructure');
  const [subcat, setSubcat] = useState<string>(CATEGORIES['roads-infrastructure'].subs[0]);
  const [manualSubcat, setManualSubcat] = useState('');
  const [description, setDescription] = useState('');
  
  // Files
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Contact
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string>('');

  // Community Search State
  const [communitySearch, setCommunitySearch] = useState('');
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
  const communityDropdownRef = useRef<HTMLDivElement>(null);

  // Step Progress Logic
  const isStep1Complete = selectedZone !== '' && selectedCommunity !== '';
  const isStep2Complete = description.trim().length > 0;

  // Communities Filter
  const currentZoneData = LOCATIONS.find(l => l.zone === selectedZone);
  const availableCommunities = currentZoneData ? currentZoneData.communities : [];
  const filteredCommunities = availableCommunities.filter((c: string) =>
    c.toLowerCase().includes(communitySearch.toLowerCase())
  );

  // Reset subcat when category changes
  useEffect(() => {
    setSubcat(CATEGORIES[cat].subs[0]);
    setManualSubcat('');
  }, [cat]);

  // Click outside listener for community dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (communityDropdownRef.current && !communityDropdownRef.current.contains(event.target as Node)) {
        setIsCommunityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getGPS = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser');
      return;
    }
    setLocGetting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocGetting(false);
      },
      () => {
        setGpsError('Unable to retrieve your location');
        setLocGetting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setPhotoFile(f || null);
    setPhotoPreview(f ? URL.createObjectURL(f) : null);
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile) return null;
    const ext = photoFile.name.split('.').pop() || 'jpg';
    const path = `public/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from('issues').upload(path, photoFile, {
      cacheControl: '3600',
      upsert: false,
      contentType: photoFile.type || 'image/jpeg',
    });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from('issues').getPublicUrl(path);
    return data.publicUrl || null;
  };

  const makeTracking = (id: string | number | null) => {
    const y = new Date().getFullYear();
    const short = String(id || '').slice(-4) || Math.floor(Math.random() * 8999 + 1000).toString();
    return `CCN-${y}-${short.toUpperCase()}`;
  };

  const resetForm = () => {
    setSelectedZone('');
    setSelectedCommunity('');
    setLocationDetail('');
    setCoords({ lat: null, lng: null });
    setCat('roads-infrastructure');
    setSubcat(CATEGORIES['roads-infrastructure'].subs[0]);
    setManualSubcat('');
    setDescription('');
    setPhotoFile(null);
    setPhotoPreview(null);
    setName('');
    setPhone('');
    setGpsError(null);
  };

  const onSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedZone || !selectedCommunity) {
      setFormError('Step 1 incomplete: Please select an Area and Community.');
      return;
    }
    if (!description.trim()) {
      setFormError('Step 2 incomplete: Please describe the issue.');
      return;
    }

    setSubmitting(true);
    try {
      let photo_url: string | null = null;
      if (photoFile) {
        photo_url = await uploadPhoto();
      }

      const finalSubcategory = subcat === '__custom' ? manualSubcat : subcat;
      const fullLocation = `${selectedZone} > ${selectedCommunity}${locationDetail ? ` (${locationDetail})` : ''}`;
      const locCombined = coords.lat && coords.lng
          ? `${fullLocation} • GPS: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
          : fullLocation;

      const insertPayload = {
        category: CATEGORIES[cat].label,
        subcategory: finalSubcategory,
        description: description.trim(),
        location: locCombined.trim(),
        priority: 'Normal', // Hidden priority field
        photo_url,
        name: name.trim() || null,
        phone: phone.trim() || null,
        status: 'Pending',
      };

      const { data, error } = await supabase
        .from('issues')
        .insert(insertPayload)
        .select('id')
        .single();

      if (error) throw error;

      const code = makeTracking(data?.id ?? null);
      setTrackingCode(code);
      setSuccessOpen(true);
      resetForm();
    } catch (err: any) {
      console.error(err);
      setFormError(err?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 border border-green-100 mb-4">
              <MessageSquareWarning className="w-3.5 h-3.5 text-green-700" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-green-700">
                Citizen Reporting
              </span>
            </div>
            <div className="flex flex-col items-center justify-center group">
              <h2 className="
                text-3xl sm:text-4xl md:text-5xl 
                font-extrabold leading-tight tracking-tight mb-2
                bg-gradient-to-r from-slate-900 via-green-700 to-slate-900
                bg-clip-text text-transparent
                motion-safe:transition-transform motion-safe:duration-500
              ">
                Report an Issue
              </h2>
              <span className="
                mt-4 h-[3px] w-20 rounded-full
                bg-gradient-to-r from-green-500 via-emerald-500 to-green-600
                motion-safe:transition-all motion-safe:duration-500
                group-hover:w-32
              " />
            </div>
            <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-base md:text-lg font-normal leading-relaxed">
              Help improve the community — share problems like broken streetlights, potholes, or school issues directly with the MP's office.
            </p>
          </div>

          <form onSubmit={onSubmitIssue} className="space-y-6">
            
            {/* ------------------------------------------ */}
            {/* STEP 1: LOCATION DETAILS (BLUE) */}
            {/* ------------------------------------------ */}
            <div className="rounded-3xl overflow-hidden border border-blue-100 bg-blue-50/60 shadow-sm transition-all">
              <div className="px-6 py-4 border-b border-blue-100/50 flex justify-between items-center bg-blue-50/80">
                <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Location Details
                </h3>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-bold text-blue-600/70 uppercase tracking-wider hidden sm:inline-block">
                     Communities in system: {TOTAL_COMMUNITIES}
                   </span>
                   <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isStep1Complete ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-800'}`}>
                     Step 1
                   </span>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Area (Zone) */}
                  <div>
                    <label className="block text-sm font-bold text-blue-800 mb-1.5">Area (Zone) *</label>
                    <div className="relative">
                      <select
                        value={selectedZone}
                        onChange={(e) => {
                          setSelectedZone(e.target.value);
                          setSelectedCommunity('');
                          setCommunitySearch('');
                        }}
                        className="w-full appearance-none px-4 py-3.5 rounded-xl border border-blue-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      >
                        <option value="">Select Area...</option>
                        {LOCATIONS.map((loc) => (
                          <option key={loc.zone} value={loc.zone}>{loc.zone}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Community */}
                  <div ref={communityDropdownRef} className="relative">
                    <label className="block text-sm font-bold text-blue-800 mb-1.5">Community *</label>
                    <div 
                      className={`relative w-full rounded-xl border bg-white text-gray-900 focus-within:ring-2 focus-within:ring-blue-500 shadow-sm ${!selectedZone ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : 'border-blue-200 cursor-text'}`}
                      onClick={() => selectedZone && setIsCommunityDropdownOpen(true)}
                    >
                      <div className="flex items-center px-4 py-3.5">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                          type="text"
                          value={communitySearch}
                          onChange={(e) => {
                            setCommunitySearch(e.target.value);
                            setIsCommunityDropdownOpen(true);
                            if (selectedCommunity && e.target.value !== selectedCommunity) {
                              setSelectedCommunity('');
                            }
                          }}
                          onFocus={() => selectedZone && setIsCommunityDropdownOpen(true)}
                          disabled={!selectedZone}
                          placeholder={selectedZone ? "Search community..." : "Select an Area first"}
                          className="flex-1 bg-transparent outline-none placeholder:text-gray-400 w-full"
                        />
                        {selectedCommunity && <Check className="w-4 h-4 text-blue-600 ml-2" />}
                      </div>

                      <AnimatePresence>
                        {isCommunityDropdownOpen && selectedZone && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-white rounded-xl border border-blue-100 shadow-xl z-20"
                          >
                            {filteredCommunities.length > 0 ? (
                              filteredCommunities.map((comm) => (
                                <button
                                  key={comm}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCommunity(comm);
                                    setCommunitySearch(comm);
                                    setIsCommunityDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors text-sm ${selectedCommunity === comm ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                                >
                                  {comm}
                                </button>
                              ))
                            ) : (
                              <div className="p-4 text-center text-sm text-gray-500">No communities found</div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* ASSEMBLYMAN PROFILE CARD (Thick Design - Portrait Image) */}
                <AnimatePresence>
                  {currentZoneData && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-white rounded-2xl border border-blue-200 shadow-md overflow-hidden mt-6"
                    >
                      <div className="flex flex-row">
                        {/* Image Section - PORTRAIT MODE */}
                        <div className="w-32 sm:w-40 aspect-[3/4] bg-blue-50 flex-shrink-0 relative">
                          <img 
                            src={currentZoneData.photoUrl} 
                            alt={currentZoneData.assemblyman} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Details Section */}
                        <div className="p-5 flex-1 flex flex-col justify-center">
                          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
                            Your Assembly Member
                          </span>
                          <h4 className="text-xl font-black text-slate-900 mb-1 leading-tight">
                            {currentZoneData.assemblyman}
                          </h4>
                          <p className="text-sm text-slate-500 mb-4 font-medium">
                            {currentZoneData.zone} Electoral Area
                          </p>
                          
                          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg self-start font-semibold text-sm">
                            <Phone className="w-4 h-4" />
                            {currentZoneData.phone}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid md:grid-cols-2 gap-6 items-end">
                    {/* Landmark */}
                    <div>
                      <label className="block text-sm font-bold text-blue-800 mb-1.5">Specific Landmark <span className="font-normal text-blue-600/80">(Optional)</span></label>
                      <input
                        value={locationDetail}
                        onChange={(e) => setLocationDetail(e.target.value)}
                        placeholder="e.g., Near the Methodist Church"
                        className="w-full px-4 py-3.5 rounded-xl border border-blue-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      />
                    </div>
                    
                    {/* Live Location */}
                    <div>
                      <button
                        type="button"
                        onClick={getGPS}
                        className="w-full px-5 py-3.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-900 flex items-center justify-center gap-2 transition-colors font-bold shadow-sm"
                        title="Use GPS"
                      >
                        {locGetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                        <span>{coords.lat ? "GPS Updated" : "Use Live Location"}</span>
                      </button>
                    </div>
                </div>
                
                {/* GPS Feedback / Error */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <p className="text-xs text-blue-600/80 leading-relaxed">
                       Use live location only if you are standing at the exact place where the issue is.
                    </p>
                    
                    {coords.lat && coords.lng && (
                        <div className="text-xs text-green-700 bg-green-100 px-3 py-1.5 rounded-lg font-mono self-start">
                          GPS Captured: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                        </div>
                    )}
                    
                    {gpsError && (
                        <div className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg font-medium self-start">
                          {gpsError}
                        </div>
                    )}
                </div>
              </div>
            </div>

            {/* ------------------------------------------ */}
            {/* STEP 2: ISSUE DETAILS (AMBER) */}
            {/* ------------------------------------------ */}
            <div className={`rounded-3xl overflow-hidden border transition-all duration-500 ${isStep1Complete ? 'border-amber-100 bg-amber-50/60 shadow-sm' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
               <div className="px-6 py-4 border-b border-amber-100/50 flex justify-between items-center bg-amber-50/80">
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isStep1Complete ? 'text-amber-900' : 'text-slate-400'}`}>
                  <AlertCircle className="w-5 h-5" /> Issue Details
                </h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isStep2Complete ? 'bg-amber-600 text-white' : isStep1Complete ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-500'}`}>
                   Step 2
                </span>
              </div>

              <AnimatePresence>
                {isStep1Complete && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="p-6 md:p-8 space-y-6">
                       <div className="grid md:grid-cols-2 gap-6">
                          {/* Category */}
                          <div>
                            <label className="block text-sm font-bold text-amber-800 mb-1.5">Category</label>
                            <div className="relative">
                              <select
                                value={cat}
                                onChange={(e) => setCat(e.target.value as CategoryKey)}
                                className="w-full appearance-none px-4 py-3.5 rounded-xl border border-amber-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                              >
                                {Object.entries(CATEGORIES).map(([key, val]) => (
                                  <option key={key} value={key}>{val.label}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                          </div>

                          {/* Sub-category */}
                          <div>
                            <label className="block text-sm font-bold text-amber-800 mb-1.5">Sub-category</label>
                            <div className="relative">
                              <select
                                value={manualSubcat !== '' || subcat === '__custom' ? '__custom' : subcat}
                                onChange={(e) => {
                                  if (e.target.value === '__custom') {
                                    setSubcat('__custom'); // Use a flag value or handle logic
                                  } else {
                                    setSubcat(e.target.value);
                                    setManualSubcat('');
                                  }
                                }}
                                className="w-full appearance-none px-4 py-3.5 rounded-xl border border-amber-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                              >
                                {CATEGORIES[cat].subs.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                                <option value="__custom">Issue not listed – type manually</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            
                            {/* Custom Input */}
                            {subcat === '__custom' && (
                              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                                <input
                                  type="text"
                                  value={manualSubcat}
                                  onChange={(e) => setManualSubcat(e.target.value)}
                                  placeholder="Type the issue in your own words"
                                  className="w-full px-4 py-3.5 rounded-xl border border-amber-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                                />
                              </motion.div>
                            )}
                          </div>
                       </div>

                       {/* Description */}
                       <div>
                          <label className="block text-sm font-bold text-amber-800 mb-1.5">Description *</label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Describe the issue in detail..."
                            className="w-full px-4 py-3.5 rounded-xl border border-amber-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                          />
                       </div>

                       {/* Photo Evidence */}
                       <div>
                          <label className="block text-sm font-bold text-amber-800 mb-1.5">Photo Evidence</label>
                          <div className="flex items-center gap-4">
                            {!photoPreview ? (
                              <label className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 cursor-pointer transition-colors text-sm font-bold text-amber-900 shadow-sm">
                                <Upload className="w-4 h-4" />
                                <span>Upload Photo</span>
                                <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                              </label>
                            ) : (
                              <div className="relative flex items-center gap-3 p-2 border border-amber-200 rounded-xl bg-white shadow-sm pr-4">
                                  <img src={photoPreview} alt="Preview" className="h-12 w-12 object-cover rounded-lg" />
                                  <span className="text-sm text-gray-600 truncate max-w-[150px]">{photoFile?.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                                    className="p-1.5 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                                    title="Remove photo"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                              </div>
                            )}
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ------------------------------------------ */}
            {/* STEP 3: YOUR DETAILS (GREEN) */}
            {/* ------------------------------------------ */}
             <div className={`rounded-3xl overflow-hidden border transition-all duration-500 ${isStep2Complete ? 'border-green-100 bg-green-50/60 shadow-sm' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
               <div className="px-6 py-4 border-b border-green-100/50 flex justify-between items-center bg-green-50/80">
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isStep2Complete ? 'text-green-900' : 'text-slate-400'}`}>
                  <User className="w-5 h-5" /> Your Details (Optional)
                </h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isStep2Complete ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-slate-500'}`}>
                   Step 3
                </span>
              </div>

              <AnimatePresence>
                {isStep2Complete && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                     <div className="p-6 md:p-8">
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                          <div>
                            <label className="block text-sm font-bold text-green-800 mb-1.5">Name <span className="font-normal text-green-600/80">(Optional)</span></label>
                            <input
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your name"
                              className="w-full px-4 py-3.5 rounded-xl border border-green-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-green-800 mb-1.5">Phone <span className="font-normal text-green-600/80">(Optional)</span></label>
                            <input
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="e.g., 024XXXXXXX"
                              className="w-full px-4 py-3.5 rounded-xl border border-green-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                            />
                          </div>
                        </div>

                        {formError && (
                          <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 text-red-800 border border-red-100 mb-6">
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-sm">Submission Failed</p>
                              <p className="text-sm">{formError}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col items-center gap-4 pt-2">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="
                              relative w-full md:w-auto px-12 py-4 rounded-2xl 
                              bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600
                              text-white font-black text-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 
                              transition-all duration-300 
                              disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0
                              flex items-center justify-center gap-3
                            "
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                Submit Report <ArrowRight className="w-6 h-6" />
                              </>
                            )}
                          </button>
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5" /> Your details remain private. You'll receive a tracking code upon submission.
                          </p>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </form>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSuccessOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-md w-full rounded-[2rem] border border-white/20 bg-[#002B5B] shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden z-10"
          >
            <div className="h-2 bg-gradient-to-r from-[#FF6B00] via-amber-300 to-[#FF6B00]" />
            <div className="p-10 text-white text-center">
              <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-3xl font-extrabold mb-3 tracking-tight">Issue Submitted!</h3>
              <p className="text-blue-100 text-base mb-8">
                Thank you for reporting. Your tracking code is:
              </p>
              
              <div className="bg-white/10 rounded-2xl p-5 mb-8 border border-white/10 backdrop-blur-md">
                  <div className="text-4xl font-black tracking-widest text-[#FF6B00] font-mono">{trackingCode}</div>
                  <p className="text-xs text-blue-200 mt-3 font-medium uppercase tracking-wide">
                  Save this code
                  </p>
              </div>

              <button
                onClick={() => setSuccessOpen(false)}
                className="w-full px-6 py-4 rounded-xl bg-white text-[#002B5B] font-bold hover:bg-gray-50 transition shadow-lg text-lg"
              >
                Done
              </button>
            </div>
            <button
              onClick={() =>  setSuccessOpen(false)}
              className="absolute top-5 right-5 text-blue-300 hover:text-white p-2 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}