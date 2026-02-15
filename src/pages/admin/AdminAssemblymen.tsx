diff --git a/src/pages/admin/AdminAssemblymen.tsx b/src/pages/admin/AdminAssemblymen.tsx
index 119f9ca82cd6f52e21514274a2d26b6c36add536..f2ed3589e5dfd0f1390020098bab238cbe64fc5c 100644
--- a/src/pages/admin/AdminAssemblymen.tsx
+++ b/src/pages/admin/AdminAssemblymen.tsx
@@ -1,147 +1,151 @@
-import { useState, useEffect } from 'react';
+import { useState, useEffect, type FormEvent } from 'react';
 import { motion } from 'framer-motion';
 import { UserCheck, Mail, Phone, MapPin, Calendar, Edit, Trash2, Plus, Loader2, Users } from 'lucide-react';
 import { supabase } from '../../lib/supabase';
 import { Button } from '../../components/Button';
 
 interface Assemblyman {
   id: string;
   full_name: string;
   email: string;
   phone: string | null;
   zone: string | null;
   is_active: boolean;
   created_at: string;
   avatar_url: string | null;
 }
 
 export function AdminAssemblymen() {
   const [assemblymen, setAssemblymen] = useState<Assemblyman[]>([]);
   const [loading, setLoading] = useState(true);
   const [showForm, setShowForm] = useState(false);
   const [editingId, setEditingId] = useState<string | null>(null);
   const [formData, setFormData] = useState({
     full_name: '',
     email: '',
     phone: '',
     zone: '',
+    avatar_url: '',
   });
 
   useEffect(() => {
     fetchAssemblymen();
   }, []);
 
   const fetchAssemblymen = async () => {
     setLoading(true);
     const { data } = await supabase
       .from('profiles')
       .select('*')
       .eq('role', 'assemblyman')
       .order('created_at', { ascending: false });
     if (data) setAssemblymen(data);
     setLoading(false);
   };
 
-  const handleSubmit = async (e: React.FormEvent) => {
+  const handleSubmit = async (e: FormEvent) => {
     e.preventDefault();
 
     if (editingId) {
       await supabase
         .from('profiles')
         .update({
           full_name: formData.full_name,
           phone: formData.phone || null,
           zone: formData.zone || null,
+          avatar_url: formData.avatar_url || null,
           updated_at: new Date().toISOString(),
         })
         .eq('id', editingId);
     } else {
       const email = formData.email;
       const password = Math.random().toString(36).slice(-8) + 'A1!';
 
       const { data: authData } = await supabase.auth.signUp({
         email,
         password,
       });
 
       if (authData.user) {
         await supabase.from('profiles').update({
           full_name: formData.full_name,
           phone: formData.phone || null,
           zone: formData.zone || null,
+          avatar_url: formData.avatar_url || null,
           role: 'assemblyman',
         }).eq('id', authData.user.id);
       }
     }
 
     setShowForm(false);
     setEditingId(null);
-    setFormData({ full_name: '', email: '', phone: '', zone: '' });
+    setFormData({ full_name: '', email: '', phone: '', zone: '', avatar_url: '' });
     fetchAssemblymen();
   };
 
   const handleEdit = (assemblyman: Assemblyman) => {
     setEditingId(assemblyman.id);
     setFormData({
       full_name: assemblyman.full_name,
       email: assemblyman.email,
       phone: assemblyman.phone || '',
       zone: assemblyman.zone || '',
+      avatar_url: assemblyman.avatar_url || '',
     });
     setShowForm(true);
   };
 
   const handleDelete = async (id: string) => {
     if (!confirm('Remove this assemblyman? Their account will be deactivated.')) return;
     await supabase.from('profiles').update({ is_active: false, role: 'constituent' }).eq('id', id);
     fetchAssemblymen();
   };
 
   const toggleActive = async (id: string, currentStatus: boolean) => {
     await supabase.from('profiles').update({ is_active: !currentStatus }).eq('id', id);
     fetchAssemblymen();
   };
 
   const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
 
   const activeCount = assemblymen.filter(a => a.is_active).length;
   const inactiveCount = assemblymen.filter(a => !a.is_active).length;
 
   return (
     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Assemblymen Management</h2>
           <p className="text-slate-500 mt-1 font-medium">{assemblymen.length} total assemblymen</p>
         </div>
         <Button
           size="md"
           onClick={() => {
             setShowForm(!showForm);
             setEditingId(null);
-            setFormData({ full_name: '', email: '', phone: '', zone: '' });
+            setFormData({ full_name: '', email: '', phone: '', zone: '', avatar_url: '' });
           }}
           className="bg-[#CE1126] hover:bg-[#A60D1E] text-white border-none rounded-xl shadow-lg"
         >
           <Plus className="w-4 h-4 mr-2" />
           Add Assemblyman
         </Button>
       </div>
 
       <div className="grid grid-cols-2 gap-3">
         {[
           { label: 'Active', value: activeCount, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
           { label: 'Inactive', value: inactiveCount, icon: Users, color: 'text-slate-500', bg: 'bg-slate-100' },
         ].map(s => (
           <div key={s.label} className="bg-white p-4 rounded-2xl border border-slate-100">
             <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-2`}>
               <s.icon className="w-4 h-4" />
             </div>
             <p className="text-2xl font-black text-slate-900">{s.value}</p>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
           </div>
         ))}
       </div>
 
       {showForm && (
         <motion.div
@@ -171,88 +175,102 @@ export function AdminAssemblymen() {
                   required
                   disabled={!!editingId}
                   value={formData.email}
                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                   className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-transparent disabled:opacity-50"
                 />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone</label>
                 <input
                   type="tel"
                   value={formData.phone}
                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                   className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-transparent"
                 />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1.5">Zone</label>
                 <input
                   type="text"
                   value={formData.zone}
                   onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                   className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-transparent"
                 />
               </div>
+              <div className="md:col-span-2">
+                <label className="block text-sm font-bold text-slate-700 mb-1.5">Photo URL</label>
+                <input
+                  type="url"
+                  value={formData.avatar_url}
+                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
+                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-transparent"
+                />
+              </div>
             </div>
             <div className="flex gap-3 pt-2">
               <Button type="submit" size="md" className="bg-[#CE1126] hover:bg-[#A60D1E] text-white border-none rounded-xl">
                 {editingId ? 'Update' : 'Create'} Assemblyman
               </Button>
               <Button
                 type="button"
                 size="md"
                 onClick={() => {
                   setShowForm(false);
                   setEditingId(null);
+                  setFormData({ full_name: '', email: '', phone: '', zone: '', avatar_url: '' });
                 }}
                 className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-none rounded-xl"
               >
                 Cancel
               </Button>
             </div>
           </form>
         </motion.div>
       )}
 
       <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
         {loading ? (
           <div className="flex items-center justify-center py-16">
             <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
           </div>
         ) : assemblymen.length === 0 ? (
           <div className="p-12 text-center text-slate-400">
             <UserCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
             <p className="font-medium">No assemblymen registered</p>
           </div>
         ) : (
           <div className="divide-y divide-slate-100">
             {assemblymen.map((assemblyman) => (
               <div key={assemblyman.id} className="p-4 hover:bg-slate-50 transition-colors">
                 <div className="flex items-start gap-4">
-                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
-                    {assemblyman.full_name.charAt(0).toUpperCase()}
+                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 overflow-hidden">
+                    {assemblyman.avatar_url ? (
+                      <img src={assemblyman.avatar_url} alt={assemblyman.full_name} className="w-full h-full object-cover" />
+                    ) : (
+                      assemblyman.full_name.charAt(0).toUpperCase()
+                    )}
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="flex items-start justify-between gap-3 mb-2">
                       <div>
                         <h3 className="text-base font-bold text-slate-900">{assemblyman.full_name}</h3>
                         <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                           {assemblyman.email && (
                             <span className="flex items-center gap-1">
                               <Mail className="w-3 h-3" />
                               {assemblyman.email}
                             </span>
                           )}
                           {assemblyman.phone && (
                             <span className="flex items-center gap-1">
                               <Phone className="w-3 h-3" />
                               {assemblyman.phone}
                             </span>
                           )}
                         </div>
                       </div>
                       <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${assemblyman.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                         {assemblyman.is_active ? 'Active' : 'Inactive'}
                       </span>
                     </div>
                     <div className="flex items-center justify-between">
