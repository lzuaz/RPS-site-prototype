"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, Users, Settings, Zap, ArrowRight, Gamepad2, ShieldAlert, Trophy, User } from "lucide-react";
import { usePathname } from "next/navigation";
export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.shiftKey && e.key === ">") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            } else if (e.key === "Escape" && isOpen) {
                e.preventDefault();
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50); 
            setSelectedIndex(0); 
            setQuery(""); 
        }
    }, [isOpen]);
    const getContextCommands = () => {
        if (pathname?.startsWith('/dev')) {
            return [
                { icon: Command, label: "Deploy Studio Network", shortcut: "⌘ D" },
                { icon: ShieldAlert, label: "Trigger Master Override", shortcut: "⌘ ⇧ O" },
                { icon: Users, label: "Manage Staff Clearances", shortcut: "⌘ U" },
                { icon: Settings, label: "Platform Settings", shortcut: "⌘ ," },
                { icon: Zap, label: "Execute LiveOps Pipeline", shortcut: "⇧ ⌘ E" },
            ];
        } else if (pathname?.startsWith('/dashboard')) {
            return [
                { icon: Gamepad2, label: "Join Matchmaking", shortcut: "⌘ J" },
                { icon: Trophy, label: "View Leaderboards", shortcut: "⌘ L" },
                { icon: Users, label: "Manage Friends", shortcut: "⌘ F" },
                { icon: User, label: "Profile Settings", shortcut: "⌘ P" },
            ];
        }
        return [
            { icon: User, label: "Sign In", shortcut: "⌘ S" },
            { icon: Settings, label: "App Preferences", shortcut: "⌘ ," }
        ];
    };
    const contextCommands = getContextCommands();
    const filteredCommands = contextCommands.filter(c => 
        c.label.toLowerCase().includes(query.toLowerCase()) || 
        c.shortcut.toLowerCase().includes(query.toLowerCase())
    );
    const autocompleteMatch = query 
        ? contextCommands.find(c => c.label.toLowerCase().startsWith(query.toLowerCase())) 
        : null;
    const autocompleteSuggestion = autocompleteMatch ? autocompleteMatch.label : "";
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filteredCommands[selectedIndex]) {
                console.log(`Executed: ${filteredCommands[selectedIndex].label}`);
                setIsOpen(false);
            }
        } else if (e.key === "Tab" || e.key === "ArrowRight") {
            if (autocompleteSuggestion && query.length < autocompleteSuggestion.length) {
                e.preventDefault();
                setQuery(autocompleteSuggestion);
            }
        }
    };
    const highlightMatch = (text: string, q: string) => {
        if (!q) return text;
        const parts = text.split(new RegExp(`(${q})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => 
                    part.toLowerCase() === q.toLowerCase() 
                        ? <span key={i} className="text-sky-400 font-black drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">{part}</span> 
                        : part
                )}
            </span>
        );
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-[95%] max-w-2xl bg-white/[0.08] backdrop-blur-3xl rounded-[2.5rem] border border-white/[0.15] shadow-[0_16px_64px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.15)] overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center px-6 py-5 border-b border-white/[0.07]">
                            <Search className="w-6 h-6 text-white/50 mr-4 shrink-0" />
                            <div className="flex-1 relative flex items-center h-8">
                                {autocompleteSuggestion && query && (
                                    <div className="absolute inset-0 flex items-center pointer-events-none text-lg font-medium tracking-wide">
                                        <span className="opacity-0">{query}</span>
                                        <span className="text-white/20">{autocompleteSuggestion.slice(query.length)}</span>
                                    </div>
                                )}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search studio nodes or execute commands..."
                                    onKeyDown={handleInputKeyDown}
                                    className="absolute inset-0 w-full h-full bg-transparent text-white text-lg font-medium tracking-wide placeholder:text-white/30 focus:outline-none focus:ring-0 focus:shadow-none !shadow-none z-10"
                                    style={{ boxShadow: 'none' }}
                                />
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/50 text-[10px] font-bold tracking-widest uppercase shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                                <span>Shift</span>
                                <span>+</span>
                                <span>&gt;</span>
                            </div>
                        </div>
                        <div className="p-3 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden relative">
                            {filteredCommands.length > 0 ? (
                                <>
                                    <div className="px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-white/40">Suggested Actions</div>
                                    <div className="flex flex-col gap-1 mt-1">
                                        {filteredCommands.map((cmd, i) => {
                                            const isSelected = i === selectedIndex;
                                            return (
                                                <button
                                                    key={i}
                                                    onMouseEnter={() => setSelectedIndex(i)}
                                                    onClick={() => {
                                                        console.log(`Executed: ${cmd.label}`);
                                                        setIsOpen(false);
                                                    }}
                                                    className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 ease-out 
                                                        ${isSelected 
                                                            ? 'bg-white/[0.08] scale-[1.015] shadow-[0_0_20px_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(255,255,255,0.1)]' 
                                                            : 'bg-transparent scale-100 shadow-none'}
                                                    `}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl border border-white/[0.05] flex items-center justify-center transition-colors shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] ${isSelected ? 'bg-white/10' : 'bg-white/[0.05]'}`}>
                                                            <cmd.icon className={`w-5 h-5 transition-colors ${isSelected ? 'text-white' : 'text-white/80'}`} />
                                                        </div>
                                                        <span className={`font-medium text-sm transition-colors tracking-wide ${isSelected ? 'text-white' : 'text-white/80'}`}>
                                                            {highlightMatch(cmd.label, query)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`text-[10px] font-bold tracking-widest transition-colors ${isSelected ? 'text-white/50' : 'text-white/30'}`}>{cmd.shortcut}</span>
                                                        <ArrowRight className={`w-4 h-4 transition-all transform ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} text-white/40`} />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center text-center">
                                    <Search className="w-8 h-8 text-white/20 mb-3" />
                                    <p className="text-sm font-medium text-white/50">No results found for "<span className="text-white/80">{query}</span>"</p>
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mt-2">Try a different command</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
