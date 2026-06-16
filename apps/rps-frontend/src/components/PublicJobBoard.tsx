"use client";
import { useEffect, useState } from "react";
import { getJobs, JobData } from "@/app/actions/jobs.actions";
import { submitApplication } from "@/app/actions/applications.actions";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ArrowUpRight, Flame, X, Send } from "lucide-react";
export default function PublicJobBoard({ isDarkTheme }: { isDarkTheme: boolean }) {
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
    const [formData, setFormData] = useState({ 
        name: '', email: '', birthDate: '', region: '', 
        timeZone: '', phone: '', discord: '', portfolio: '', coverLetter: '' 
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    useEffect(() => {
        async function fetchJobs() {
            const res = await getJobs();
            if (res.success && res.jobs) {
                setJobs(res.jobs.filter((j: any) => j.is_active));
            }
            setLoading(false);
        }
        fetchJobs();
    }, []);
    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJob) return;
        setSubmitting(true);
        setErrorMsg("");
        const res = await submitApplication({
            job_id: selectedJob.id as string,
            applicant_name: formData.name,
            applicant_email: formData.email,
            birth_date: formData.birthDate,
            region: formData.region,
            time_zone: formData.timeZone,
            phone: formData.phone,
            discord: formData.discord,
            portfolio_url: formData.portfolio,
            cover_letter: formData.coverLetter,
            status: 'Pending Review'
        });
        if (res.success) {
            setSuccess(true);
        } else {
            setErrorMsg(res.error || "Failed to submit application.");
        }
        setSubmitting(false);
    };
    const closeModals = () => {
        setSelectedJob(null);
        setSuccess(false);
        setFormData({ 
            name: '', email: '', birthDate: '', region: '', 
            timeZone: '', phone: '', discord: '', portfolio: '', coverLetter: '' 
        });
        setErrorMsg("");
    };
    if (loading) {
        return (
            <div className="w-full flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
            </div>
        );
    }
    const theme = {
        modalBg: isDarkTheme ? 'bg-[#050505]' : 'bg-white',
        border: isDarkTheme ? 'border-white/[0.08]' : 'border-black/[0.08]',
        textBase: isDarkTheme ? 'text-white' : 'text-black',
        textMuted: isDarkTheme ? 'text-white/50' : 'text-black/50',
        textSubtle: isDarkTheme ? 'text-white/40' : 'text-black/40',
        inputBg: isDarkTheme ? 'bg-white/[0.03]' : 'bg-black/[0.03]',
        placeholder: isDarkTheme ? 'placeholder-white/20' : 'placeholder-black/30',
        closeBtn: isDarkTheme ? 'bg-white/[0.05] hover:bg-white/[0.1] border-white/[0.05] text-white/50 hover:text-white' : 'bg-black/[0.05] hover:bg-black/[0.1] border-black/[0.05] text-black/50 hover:text-black',
        scrollbar: isDarkTheme ? 'scrollbar-thumb-white/10' : 'scrollbar-thumb-black/10'
    };
    return (
        <div className="w-full mt-32 relative z-10" id="careers">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h3 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2">Careers at Rascal Pixel Studio</h3>
                    <p className={`${isDarkTheme ? 'text-white/50' : 'text-black/50'} text-sm md:text-base`}>Join the Vanguard. Help us build the future of immersive realities.</p>
                </div>
                {jobs.length > 0 && (
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-widest">
                        <Briefcase className="w-3 h-3" /> {jobs.length} Available
                    </div>
                )}
            </div>
            {jobs.length === 0 ? (
                <div className={`w-full text-center py-32 border border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-colors duration-500 ${isDarkTheme ? 'bg-white/[0.01] border-white/[0.05] shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]' : 'bg-black/[0.01] border-black/[0.05] shadow-[inset_0_0_40px_rgba(255,255,255,0.5)]'}`}>
                    <Briefcase className={`w-12 h-12 mb-4 opacity-20 ${isDarkTheme ? 'text-white' : 'text-black'}`} />
                    <p className={`text-sm font-medium tracking-wide ${isDarkTheme ? 'text-white/40' : 'text-black/40'}`}>
                        No open positions at this time.
                    </p>
                    <p className={`text-xs mt-2 ${isDarkTheme ? 'text-white/20' : 'text-black/20'}`}>
                        Our ranks are currently full, but we are always watching for exceptional talent.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                    <motion.div 
                        key={job.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedJob(job)}
                        className={`p-6 md:p-8 rounded-[2rem] border transition-all duration-500 flex flex-col justify-between group cursor-pointer ${
                            isDarkTheme 
                            ? 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.05] hover:border-sky-500/30 hover:shadow-[0_0_40px_rgba(56,189,248,0.1)]' 
                            : 'bg-black/[0.02] hover:bg-white/60 border-black/[0.05] hover:border-sky-500/30 hover:shadow-[0_0_40px_rgba(56,189,248,0.1)]'
                        }`}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h4 className={`text-2xl font-bold tracking-tight transition-colors duration-300 group-hover:text-sky-400 ${theme.textBase}`}>
                                    {job.title}
                                </h4>
                                {job.is_urgent && (
                                    <span className="px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-1 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                        <Flame className="w-3 h-3" /> Urgent
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isDarkTheme ? 'bg-white/5 text-white/60' : 'bg-black/5 text-black/60'}`}>
                                    {job.department}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isDarkTheme ? 'bg-white/5 text-white/60' : 'bg-black/5 text-black/60'}`}>
                                    {job.location}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isDarkTheme ? 'bg-white/5 text-white/60' : 'bg-black/5 text-black/60'}`}>
                                    {job.type}
                                </span>
                            </div>
                            <p className={`text-sm leading-relaxed line-clamp-3 mb-8 ${theme.textMuted}`}>
                                {job.description}
                            </p>
                        </div>
                        <div className={`mt-auto pt-4 border-t transition-colors duration-500 flex justify-between items-center ${isDarkTheme ? 'border-white/10 group-hover:border-sky-500/30' : 'border-black/10 group-hover:border-sky-500/30'}`}>
                            <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 group-hover:text-sky-400 ${theme.textSubtle}`}>
                                Apply Now
                            </span>
                            <ArrowUpRight className={`w-4 h-4 transition-all duration-300 group-hover:text-sky-400 group-hover:-translate-y-1 group-hover:translate-x-1 ${theme.textSubtle}`} />
                        </div>
                    </motion.div>
                ))}
            </div>
            )}
            <AnimatePresence>
                {selectedJob && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            onClick={closeModals}
                            className={`absolute inset-0 backdrop-blur-md ${isDarkTheme ? 'bg-[#020202]/80' : 'bg-white/80'}`}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                            className={`relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl border ${theme.modalBg} ${theme.border} shadow-[0_32px_64px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.1)] p-5 md:p-6 scrollbar-thin ${theme.scrollbar}`}
                        >
                            <button 
                                onClick={closeModals}
                                className={`absolute top-4 right-4 p-1.5 rounded-full border transition-all ${theme.closeBtn}`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                            {success ? (
                                <div className="flex flex-col items-center justify-center text-center py-8">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <Send className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 tracking-tight ${theme.textBase}`}>Application Sent</h3>
                                    <p className={`text-xs max-w-sm mb-6 ${theme.textMuted}`}>
                                        Your dossier has been securely transmitted to the Vanguard recruiters. We will review your materials shortly.
                                    </p>
                                    <button 
                                        onClick={closeModals}
                                        className={`px-6 py-2 rounded-full border font-bold text-[10px] uppercase tracking-widest transition-colors ${theme.closeBtn}`}
                                    >
                                        Return to Surface
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <h3 className={`text-xl font-bold tracking-tight mb-1 ${theme.textBase}`}>{selectedJob.title}</h3>
                                    <p className="text-sky-400 text-[10px] font-bold uppercase tracking-widest mb-5">{selectedJob.department} • {selectedJob.location}</p>
                                    <form onSubmit={handleApply} className="space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className={`text-[8px] font-bold tracking-widest uppercase ml-1 ${theme.textSubtle}`}>Full Name</label>
                                                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-[11px] ${theme.textBase} ${theme.placeholder} focus:outline-none focus:border-sky-500/50 transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]`} placeholder="John Doe" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={`text-[8px] font-bold tracking-widest uppercase ml-1 ${theme.textSubtle}`}>Email Address</label>
                                                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-[11px] ${theme.textBase} ${theme.placeholder} focus:outline-none focus:border-sky-500/50 transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]`} placeholder="john@example.com" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={`text-[8px] font-bold tracking-widest uppercase ml-1 ${theme.textSubtle}`}>Birth Date</label>
                                                <input required type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-[11px] ${theme.textBase} ${theme.placeholder} focus:outline-none focus:border-sky-500/50 transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]`} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={`text-[8px] font-bold tracking-widest uppercase ml-1 ${theme.textSubtle}`}>Phone Number</label>
                                                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-[11px] ${theme.textBase} ${theme.placeholder} focus:outline-none focus:border-sky-500/50 transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]`} placeholder="+1 (555) 000-0000" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={`text-[8px] font-bold tracking-widest uppercase ml-1 ${theme.textSubtle}`}>Region / Country</label>
                                                <input required type="text" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-[11px] ${theme.textBase} ${theme.placeholder} focus:outline-none focus:border-sky-500/50 transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]`} placeholder="North America, Europe, etc." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={`text-[8px] font-bold tracking-widest uppercase ml-1 ${theme.textSubtle}`}>Time Zone</label>
                                                <input required type="text" value={formData.timeZone} onChange={(e) => setFormData({...formData, timeZone: e.target.value})} className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-[11px] ${theme.textBase} ${theme.placeholder} focus:outline-none focus:border-sky-500/50 transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]`} placeholder="UTC, EST, PST..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={`text-[8px] font-bold tracking-widest uppercase ml-1 ${theme.textSubtle}`}>Discord Handle</label>
                                                <input required type="text" value={formData.discord} onChange={(e) => setFormData({...formData, discord: e.target.value})} className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-[11px] ${theme.textBase} ${theme.placeholder} focus:outline-none focus:border-sky-500/50 transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]`} placeholder="username#1234" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className={`text-[8px] font-bold tracking-widest uppercase ml-1 ${theme.textSubtle}`}>Portfolio URL</label>
                                                <input required type="url" value={formData.portfolio} onChange={(e) => setFormData({...formData, portfolio: e.target.value})} className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-[11px] ${theme.textBase} ${theme.placeholder} focus:outline-none focus:border-sky-500/50 transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]`} placeholder="https://artstation.com/johndoe" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className={`text-[8px] font-bold tracking-widest uppercase ml-1 ${theme.textSubtle}`}>Cover Letter</label>
                                            <textarea required value={formData.coverLetter} onChange={(e) => setFormData({...formData, coverLetter: e.target.value})} rows={2} className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-[11px] ${theme.textBase} ${theme.placeholder} focus:outline-none focus:border-sky-500/50 transition-colors shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] resize-none`} placeholder="Tell us why you belong in the Vanguard..." />
                                        </div>
                                        {errorMsg && <p className="text-red-400 text-[10px] text-center font-medium">{errorMsg}</p>}
                                        <button 
                                            type="submit" 
                                            disabled={submitting}
                                            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold tracking-[0.2em] uppercase text-[10px] transition-colors shadow-[0_0_30px_rgba(56,189,248,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-3"
                                        >
                                            {submitting ? "Transmitting..." : "Submit Application"}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
