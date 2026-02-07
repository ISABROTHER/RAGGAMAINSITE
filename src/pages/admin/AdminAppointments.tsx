import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Loader2, AlertCircle, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';

interface Appointment {
  id: string;
  title: string;
  description: string;
  appointment_date: string;
  duration_minutes: number;
  location: string;
  requester_id: string;
  assemblyman_id: string | null;
  status: string;
  notes: string;
  created_at: string;
  requester_name?: string;
  assemblyman_name?: string;
}

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [assemblymen, setAssemblymen] = useState<any[]>([]);

  useEffect(() => {
    fetchAppointments();
    fetchAssemblymen();
  }, []);

  const fetchAssemblymen = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'assemblyman')
      .eq('is_active', true)
      .order('full_name');
    if (data) setAssemblymen(data);
  };

  const fetchAppointments = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });

    if (data && data.length > 0) {
      const requesterIds = [...new Set(data.map(d => d.requester_id))];
      const assemblymanIds = [...new Set(data.filter(d => d.assemblyman_id).map(d => d.assemblyman_id))];
      const allIds = [...new Set([...requesterIds, ...assemblymanIds])];

      if (allIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', allIds as string[]);
        const nameMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);
        setAppointments(data.map(d => ({
          ...d,
          requester_name: nameMap.get(d.requester_id) || 'Unknown',
          assemblyman_name: d.assemblyman_id ? nameMap.get(d.assemblyman_id) || 'Unassigned' : 'Unassigned',
        })));
      } else {
        setAppointments(data.map(d => ({ ...d, requester_name: 'Unknown', assemblyman_name: 'Unassigned' })));
      }
    } else {
      setAppointments([]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    fetchAppointments();
    setSelectedAppointment(null);
  };

  const assignAssemblyman = async (id: string, assemblymanId: string) => {
    await supabase.from('appointments').update({
      assemblyman_id: assemblymanId,
      status: 'confirmed',
      updated_at: new Date().toISOString(),
    }).eq('id', id);
    fetchAppointments();
  };

  const updateNotes = async (id: string, notes: string) => {
    await supabase.from('appointments').update({ notes, updated_at: new Date().toISOString() }).eq('id', id);
    fetchAppointments();
  };

  const filteredAppointments = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (d: string) => {
    const date = new Date(d);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const statusCounts = {
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Appointments Management</h2>
        <p className="text-slate-500 mt-1 font-medium">{appointments.length} total appointments</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Pending', value: statusCounts.pending, status: 'pending', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Confirmed', value: statusCounts.confirmed, status: 'confirmed', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Completed', value: statusCounts.completed, status: 'completed', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Cancelled', value: statusCounts.cancelled, status: 'cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setFilter(filter === s.status ? 'all' : s.status)}
            className={`bg-white p-4 rounded-2xl border transition-all text-left ${filter === s.status ? 'border-[#CE1126] shadow-md' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-2`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No appointments found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${statusColor(appointment.status).replace('text-', 'bg-').replace('100', '50')} flex items-center justify-center shrink-0`}>
                    <Calendar className={`w-5 h-5 ${statusColor(appointment.status).split(' ')[1]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{appointment.title}</h3>
                        <p className="text-sm text-slate-600 mt-0.5">{appointment.description}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${statusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(appointment.appointment_date)} at {formatTime(appointment.appointment_date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {appointment.duration_minutes} minutes
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {appointment.location || 'No location'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        Requested by: {appointment.requester_name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Assigned to:</span>
                        <select
                          value={appointment.assemblyman_id || ''}
                          onChange={(e) => assignAssemblyman(appointment.id, e.target.value)}
                          className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CE1126]"
                        >
                          <option value="">Unassigned</option>
                          {assemblymen.map(a => (
                            <option key={a.id} value={a.id}>{a.full_name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(appointment.id, 'confirmed')}
                              className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
                              Confirm
                            </button>
                            <button
                              onClick={() => updateStatus(appointment.id, 'cancelled')}
                              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5 inline mr-1" />
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(appointment.id, 'completed')}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedAppointment(appointment)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {appointment.notes && (
                      <div className="mt-3 p-2.5 bg-blue-50 rounded-lg">
                        <p className="text-xs text-slate-600"><span className="font-bold">Notes:</span> {appointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedAppointment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedAppointment(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-lg w-full"
          >
            <h3 className="text-xl font-black text-slate-900 mb-4">Edit Notes</h3>
            <textarea
              rows={4}
              defaultValue={selectedAppointment.notes}
              onBlur={(e) => updateNotes(selectedAppointment.id, e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE1126] resize-none"
              placeholder="Add notes about this appointment..."
            />
            <Button
              size="md"
              onClick={() => setSelectedAppointment(null)}
              className="mt-4 bg-slate-900 hover:bg-slate-800 text-white border-none rounded-xl w-full"
            >
              Close
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
