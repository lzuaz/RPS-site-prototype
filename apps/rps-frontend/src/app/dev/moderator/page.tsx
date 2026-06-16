"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    Database, Activity, Users, Settings, Search, 
    Save, AlertTriangle, Moon, Sun, ArrowLeft, RefreshCw, Loader2, Gamepad2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPlayerData, savePlayerData, wipePlayerData } from "@/app/actions/datastore.actions";
import { getCurrentUser } from "@/app/actions/auth.actions";
import StaffChatWidget from "@/components/StaffChatWidget";
const darkTheme = {
    bg: "bg-[#030303]",
    navBg: "bg-black/40 backdrop-blur-[40px] border-r border-white/[0.08]",
    textBase: "text-white/90",
    textMuted: "text-white/60",
    textSubtle: "text-white/30",
    borderBase: "border-white/[0.08]",
    borderStrong: "border-white/[0.15]",
    inputBg: "bg-white/[0.02]",
    glassCard: "bg-white/[0.02] border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
};
const lightTheme = {
    bg: "bg-[#f5f5f7]",
    navBg: "bg-white/60 backdrop-blur-[40px] border-r border-black/[0.08]",
    textBase: "text-black/90",
    textMuted: "text-black/60",
    textSubtle: "text-black/30",
    borderBase: "border-black/[0.08]",
    borderStrong: "border-black/[0.15]",
    inputBg: "bg-black/[0.02]",
    glassCard: "bg-white/80 border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
};
const navTabs = [
    { id: "datastore", label: "Player Datastore", icon: Database },
    { id: "liveops", label: "LiveOps Control", icon: Activity },
    { id: "applications", label: "Vanguard Apps", icon: Users },
    { id: "assets", label: "Asset Moderation", icon: Settings }
];
export default function ModeratorDashboard() {
    const router = useRouter();
    const [authLoading, setAuthLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const theme = isDarkTheme ? darkTheme : lightTheme;
    const [activeTab, setActiveTab] = useState("datastore");
    useEffect(() => {
        const checkAuth = async () => {
            const session = await getCurrentUser();
            if (!session || session.role === "player") {
                router.push("/dashboard");
                return;
            }
            setUsername(session.username);
            setCurrentUser(session);
            setAuthLoading(false);
        };
        checkAuth();
    }, [router]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [playerData, setPlayerData] = useState<any>(null);
    const [jsonEditorContent, setJsonEditorContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        setIsLoading(true);
        setMessage({ text: "", type: "" });
        const res = await getPlayerData(searchTerm.trim());
        if (res.success && res.data) {
            setPlayerData(res.player);
            setJsonEditorContent(JSON.stringify(res.data, null, 4));
            setMessage({ text: "Player profile loaded successfully.", type: "success" });
        } else {
            setPlayerData(null);
            setJsonEditorContent("");
            setMessage({ text: res.error || "Player not found.", type: "error" });
        }
        setIsLoading(false);
    };
    const handleSave = async () => {
        if (!playerData) return;
        setIsLoading(true);
        setMessage({ text: "Saving data...", type: "info" });
        const res = await savePlayerData(playerData.id, jsonEditorContent);
        if (res.success) {
            setMessage({ text: "Player datastore updated successfully.", type: "success" });
        } else {
            setMessage({ text: res.error || "Failed to update datastore.", type: "error" });
        }
        setIsLoading(false);
    };
    const handleWipe = async () => {
        if (!playerData) return;
        if (!confirm("CRITICAL WARNING: This will permanently wipe the player's progression and inventory. Are you sure?")) return;
        setIsLoading(true);
        const res = await wipePlayerData(playerData.id);
        if (res.success) {
            setPlayerData(null);
            setJsonEditorContent("");
            setMessage({ text: "Account wiped successfully.", type: "success" });
        } else {
            setMessage({ text: res.error || "Failed to wipe account.", type: "error" });
        }
        setIsLoading(false);
    };
    if (authLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.textBase}`}>
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
        );
    }
    return (
        <div className={`min-h-screen flex ${theme.bg} ${theme.textBase} transition-colors duration-700 font-sans`}>
            <motion.nav 
                initial={{ x: -300 }}
                animate={{ x: isMobileMenuOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : -300) }}
                className={`w-72 flex flex-col fixed inset-y-0 left-0 z-50 ${theme.navBg} transition-all duration-700 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className={`p-8 border-b ${theme.borderBase} flex items-center justify-between`}>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Vanguard</h1>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${theme.textSubtle}`}>Moderator Hub</p>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                    {navTabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                                    isActive 
                                    ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20' 
                                    : `border border-transparent ${theme.textMuted} hover:${theme.textBase} hover:bg-black/5 dark:hover:bg-white/5`
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-500' : ''}`} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
                <div className={`p-6 border-t ${theme.borderBase} flex flex-col gap-4`}>
                    {username !== 'lzuaz' && (
                        <button 
                            onClick={() => router.push('/dashboard')}
                            className={`w-full py-3 rounded-2xl border ${theme.borderStrong} bg-emerald-500/10 text-emerald-400 font-bold text-xs tracking-widest uppercase hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]`}
                        >
                            <Gamepad2 className="w-4 h-4" />
                            Switch to Player Hub
                        </button>
                    )}
                    <button 
                        onClick={() => setIsDarkTheme(!isDarkTheme)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium border border-transparent transition-all ${theme.textMuted} hover:${theme.textBase} hover:bg-black/5 dark:hover:bg-white/5`}
                    >
                        {isDarkTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <Link href="/dev" className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium border border-transparent transition-all ${theme.textMuted} hover:${theme.textBase} hover:bg-black/5 dark:hover:bg-white/5`}>
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dev Hub
                    </Link>
                </div>
            </motion.nav>
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
            <main className="flex-1 md:ml-72 p-4 md:p-8 lg:p-16 relative w-full overflow-hidden">
                <div className="md:hidden flex items-center justify-between mb-8 p-4 bg-white/[0.02] border border-white/[0.08] rounded-2xl">
                    <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-sky-500" />
                        <span className="font-bold tracking-widest text-xs uppercase">Moderator Hub</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-white/5 rounded-lg border border-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                    </button>
                </div>
                {activeTab === "datastore" && (
                    <div className="max-w-5xl mx-auto space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-2">Player Datastore</h2>
                            <p className={`text-sm ${theme.textMuted}`}>Query and mutate raw player JSON records in real-time.</p>
                        </div>
                        <div className={`p-8 rounded-[2rem] border ${theme.glassCard} transition-all duration-700`}>
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8 w-full">
                                <div className="relative flex-1 w-full">
                                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.textSubtle}`} />
                                    <input 
                                        type="text" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search by User ID..." 
                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border ${theme.inputBg} ${theme.borderBase} ${theme.textBase} focus:outline-none focus:border-sky-500/50 transition-all font-mono text-sm`}
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isLoading || !searchTerm.trim()}
                                    className="px-8 py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.3)] disabled:opacity-50"
                                >
                                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                                    Query Record
                                </button>
                            </form>
                            {message.text && (
                                <div className={`px-4 py-3 rounded-xl text-sm font-medium mb-6 border flex items-center gap-2 ${
                                    message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                    message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                    'bg-sky-500/10 border-sky-500/20 text-sky-500'
                                }`}>
                                    {message.type === 'error' && <AlertTriangle className="w-4 h-4" />}
                                    {message.text}
                                </div>
                            )}
                            {playerData && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${theme.borderBase} bg-sky-500/10 text-sky-500`}>
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{playerData.username}</h3>
                                            <p className={`text-xs ${theme.textSubtle} font-mono mt-0.5`}>{playerData.id}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-bold uppercase tracking-widest ml-2 ${theme.textSubtle}`}>Raw JSON Datastore</label>
                                        <textarea 
                                            value={jsonEditorContent}
                                            onChange={(e) => setJsonEditorContent(e.target.value)}
                                            rows={16}
                                            className={`w-full p-6 rounded-2xl border ${theme.inputBg} ${theme.borderBase} ${theme.textBase} font-mono text-sm leading-relaxed focus:outline-none focus:border-sky-500/50 transition-colors resize-none`}
                                            spellCheck={false}
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                                        <button 
                                            onClick={handleWipe}
                                            disabled={isLoading}
                                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                                        >
                                            <AlertTriangle className="w-4 h-4" />
                                            Wipe Account
                                        </button>
                                        <button 
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                                        >
                                            <Save className="w-4 h-4" />
                                            Force Save State
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}
                {activeTab !== "datastore" && (
                    <div className="max-w-5xl mx-auto h-[60vh] flex flex-col items-center justify-center text-center">
                        <div className={`w-20 h-20 rounded-full border border-dashed flex items-center justify-center mb-6 ${theme.borderBase}`}>
                            <Activity className={`w-8 h-8 ${theme.textSubtle}`} />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">Module Offline</h2>
                        <p className={`text-sm max-w-sm ${theme.textMuted}`}>This moderation tool is currently locked or under active development. Select 'Player Datastore' to proceed.</p>
                    </div>
                )}
            </main>
            {currentUser && <StaffChatWidget currentUser={currentUser} theme={theme} />}
        </div>
    );
}
