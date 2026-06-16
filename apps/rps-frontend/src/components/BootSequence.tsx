"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
export default function BootSequence({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState<number>(0);
    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 300); 
        const t2 = setTimeout(() => setPhase(2), 1200); 
        const t3 = setTimeout(() => setPhase(3), 3200); 
        const t4 = setTimeout(() => onComplete(), 4000); 
        document.body.style.overflow = 'hidden';
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
            document.body.style.overflow = ''; 
        };
    }, [onComplete]);
    return (
        <motion.div 
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden will-change-[opacity,transform]"
            initial={{ opacity: 1 }}
            animate={phase === 3 ? { opacity: 0, scale: 1.1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full pointer-events-none will-change-[opacity,transform]"
                style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0) 70%)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={phase >= 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.div
                className="relative z-10 flex flex-col items-center"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="w-28 h-28 mb-6 rounded-[2.5rem] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/[0.15] flex items-center justify-center shadow-[0_16px_64px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-[40px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12]" />
                    <img src="/logo.png" alt="RPS Logo" className="w-14 h-14 object-contain relative z-10 opacity-90" />
                </div>
            </motion.div>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 w-full">
                <AnimatePresence mode="wait">
                    {phase === 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <TerminalLine text="LOADING STUDIO ENVIRONMENT..." delay={0} />
                            <TerminalLine text="FETCHING ASSETS..." delay={0.3} />
                            <TerminalLine text="PREPARING WORKSPACE..." delay={0.6} />
                            <TerminalLine text="WELCOME." delay={0.9} highlight />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
function TerminalLine({ text, delay, highlight = false }: { text: string, delay: number, highlight?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.2 }}
            className={`font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase ${highlight ? 'text-white font-bold drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]' : 'text-white/40'}`}
        >
            {text}
        </motion.div>
    );
}
