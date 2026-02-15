import { useEffect, useMemo, useState } from 'react';
import { Phone, Search, Crosshair, MapPin, Loader2, Quote, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '../components/AnimatedSection';
import { supabase } from '../lib/supabase';

interface AssemblyMember {
  id: string;
  assemblyman: string;
  zone: string;
  phone: string;
  photoUrl: string;
}

const DEFAULT_MEMBER_PHOTO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/640px-Flag_of_Ghana.svg.png';

export function Assemblymen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [isLocating, setIsLocating] = useState(false);
  const [detectedZone, setDetectedZone] = useState<string | null>(null);
  const [members, setMembers] = useState<AssemblyMember[]>([]);

  useEffect(() => {
    const fetchAssemblyMembers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, phone, zone, avatar_url, is_active')
        .eq('role', 'assemblyman')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!data) {
        setMembers([]);
        return;
      }

      const mappedMembers: AssemblyMember[] = data
        .filter((member) => member.full_name && member.zone)
        .map((member) => ({
          id: member.id,
          assemblyman: member.full_name,
          zone: member.zone ?? '',
          phone: member.phone ?? '',
          photoUrl: member.avatar_url || DEFAULT_MEMBER_PHOTO,
        }));

      setMembers(mappedMembers);
    };

    fetchAssemblyMembers();

    const channel = supabase
      .channel('assembly-members-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchAssemblyMembers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatPhoneNumber = (phone: string) => {
    return phone.replace('+233 ', '0').replace('+233', '0');
  };

  const uniqueZones = useMemo(() => {
    const zones = members.map((m) => m.zone).filter(Boolean);
    return Array.from(new Set(zones)).sort();
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.assemblyman.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.zone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesZone = selectedZone === 'all' || m.zone === selectedZone;
      return matchesSearch && matchesZone;
    });
  }, [members, searchQuery, selectedZone]);

  const handleLiveLocation = () => {
    setIsLocating(true);
    setDetectedZone(null);

    if (!navigator.geolocation) {
      alert('Location services are not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setTimeout(() => {
          setIsLocating(false);
          const matchedZone = 'Abura';
          setDetectedZone(matchedZone);
          setSearchQuery(matchedZone);
        }, 1200);
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="flex flex-col items-center justify-center group">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-center bg-gradient-to-r from-slate-900 via-green-700 to-slate-900 bg-clip-text text-transparent uppercase">
              Assemblymen
            </h1>

            <p className="mt-2 text-sm md:text-xl font-bold text-green-700/80 tracking-[0.2em] uppercase">
              IN CAPE COAST NORTH
            </p>

            <span className="mt-4 h-1.5 w-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all group-hover:w-32" />
          </div>

          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
              <Quote className="absolute -top-2 -left-2 w-12 h-12 text-slate-50 pointer-events-none" />
              <p className="text-sm md:text-base text-slate-700 leading-relaxed font-medium text-center relative z-10">
                "As your MP, I work directly with our Assembly Members. They are on the ground every day, listening to the people, following up on projects, and making sure community issues are raised. That is why their role matters to our development."
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative w-full group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-green-600 transition-colors">
                <Search className="w-full h-full" />
              </div>
              <input
                type="text"
                placeholder="Search by name or town..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-4 focus:ring-green-500/5 focus:border-green-600 transition-all outline-none font-bold text-slate-900 text-base"
              />
            </div>

            <button
              onClick={handleLiveLocation}
              disabled={isLocating}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 disabled:opacity-80 whitespace-nowrap shadow-md"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin text-green-400" />
              ) : (
                <Crosshair className="w-4 h-4" />
              )}
              <span>{isLocating ? 'Locating...' : 'Live Location'}</span>
            </button>
          </div>

          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                Filter by Zone
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
              <button
                onClick={() => setSelectedZone('all')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedZone === 'all'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-green-300'
                }`}
              >
                All Zones
              </button>
              {uniqueZones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedZone === zone
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-green-300'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>

            {(searchQuery || selectedZone !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedZone('all');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}

            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-full border border-slate-200/50">
              {filteredMembers.length} of {members.length} Representatives
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredMembers.map((member, index) => (
            <AnimatedSection key={member.id} delay={(index % 5) * 50}>
              <div
                className={`flex flex-col items-center text-center group bg-white border rounded-2xl p-3 h-full transition-all duration-300 ${
                  detectedZone === member.zone
                    ? 'border-green-500 shadow-xl ring-4 ring-green-50'
                    : 'border-slate-100 hover:shadow-lg hover:border-green-200'
                }`}
              >
                <div className="w-full aspect-[3/4] bg-slate-50 overflow-hidden rounded-xl mb-3 relative">
                  <img
                    src={member.photoUrl}
                    alt={member.assemblyman}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent h-1/2"></div>

                  <AnimatePresence>
                    {detectedZone === member.zone && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-2 right-2 bg-green-600 text-white p-1.5 rounded-lg shadow-lg z-10"
                      >
                        <MapPin className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-full flex flex-col flex-1">
                  <p className="text-[11px] font-black tracking-widest text-green-700 uppercase mb-1">
                    {member.assemblyman}
                  </p>

                  <p className="text-sm font-black text-slate-900 leading-tight uppercase line-clamp-2 mb-3">
                    {member.zone}
                  </p>

                  <div className="mt-auto">
                    {member.phone ? (
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center justify-center gap-2 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 hover:bg-green-50 hover:text-green-700 hover:border-green-100 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5 text-green-600" />
                        <span>{formatPhoneNumber(member.phone)}</span>
                      </a>
                    ) : (
                      <div className="py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-400">
                        No phone number
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 mt-8"
          >
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No members found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedZone('all');
              }}
              className="mt-4 text-green-600 font-black text-xs uppercase underline underline-offset-4"
            >
              Show all members
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
