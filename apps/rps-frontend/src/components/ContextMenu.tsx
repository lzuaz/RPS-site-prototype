"use client";
import { useState, useEffect, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Activity, Settings, Bug } from "lucide-react";
export function useContextMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [transformOrigin, setTransformOrigin] = useState("top left");
    const onContextMenu = useCallback((e: React.MouseEvent | MouseEvent) => {
        e.preventDefault();
        const x = e.clientX;
        const y = e.clientY;
        const menuWidth = 220; 
        const menuHeight = 300; 
        let originX = "left";
        let originY = "top";
        let posX = x;
        let posY = y;
        if (x + menuWidth > window.innerWidth) {
            originX = "right";
            posX = x - menuWidth;
        }
        if (y + menuHeight > window.innerHeight) {
            originY = "bottom";
            posY = y - menuHeight;
        }
        setPosition({ x: posX, y: posY });
        setTransformOrigin(`${originY} ${originX}`);
        setIsOpen(true);
    }, []);
    const close = useCallback(() => setIsOpen(false), []);
    useEffect(() => {
        if (!isOpen) return;
        const handleClick = () => close();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("click", handleClick, { capture: true });
        window.addEventListener("contextmenu", handleClick, { capture: true });
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("scroll", handleClick, { capture: true }); 
        return () => {
            window.removeEventListener("click", handleClick, { capture: true });
            window.removeEventListener("contextmenu", handleClick, { capture: true });
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("scroll", handleClick, { capture: true });
        };
    }, [isOpen, close]);
    return { isOpen, position, transformOrigin, onContextMenu, close };
}
export function ContextMenu({ 
    children, 
    position, 
    transformOrigin,
    onClose,
    theme 
}: { 
    children: ReactNode; 
    position: { x: number; y: number };
    transformOrigin: string;
    onClose: () => void;
    theme?: any;
}) {
    if (typeof window === "undefined") return null;
    return createPortal(
        <>
            <div className="fixed inset-0 z-[999]" onClick={onClose} />
            <AnimatePresence>
                <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ 
                    position: "fixed",
                    left: position.x,
                    top: position.y,
                    transformOrigin,
                }}
                className={`z-[1000] min-w-[240px] p-2 flex flex-col rounded-2xl backdrop-blur-3xl shadow-[0_32px_64px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.1)]
                    ${theme ? theme.cardBg : 'bg-[#111111]/90 border border-white/[0.08]'}
                `}
            >
                {children}
            </motion.div>
            </AnimatePresence>
        </>,
        document.body
    );
}
export function ContextMenuItem({
    icon: Icon,
    label,
    shortcut,
    onClick,
    destructive,
    theme
}: {
    icon?: any;
    label: string;
    shortcut?: string;
    onClick?: () => void;
    destructive?: boolean;
    theme?: any;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 ease-out 
                ${destructive 
                    ? "hover:bg-red-500/20 hover:text-red-400 text-red-500/80" 
                    : (theme ? `hover:bg-black/5 hover:text-black ${theme.textMuted}` : "hover:bg-white/[0.1] hover:text-white text-white/80")
                } 
                hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(255,255,255,0.1)] group`
            }
        >
            <div className="flex items-center gap-3">
                {Icon && <Icon className="w-4 h-4" />}
                <span className="font-medium text-[11px] tracking-wide">{label}</span>
            </div>
            {shortcut && (
                <span className={`text-[9px] font-bold tracking-widest uppercase opacity-40 group-hover:opacity-60 transition-opacity ${theme ? theme.textBase : ''}`}>
                    {shortcut}
                </span>
            )}
        </button>
    );
}
export function ContextMenuSeparator({ theme }: { theme?: any }) {
    return <div className={`w-full h-px my-1 ${theme ? theme.borderBase : 'bg-white/[0.08]'}`} />;
}
export function GlobalContextMenu({ theme }: { theme?: any }) {
    const { isOpen, position, transformOrigin, onContextMenu, close } = useContextMenu();
    useEffect(() => {
        const handleGlobalContextMenu = (e: MouseEvent) => {
            onContextMenu(e);
        };
        window.addEventListener("contextmenu", handleGlobalContextMenu);
        return () => window.removeEventListener("contextmenu", handleGlobalContextMenu);
    }, [onContextMenu]);
    if (!isOpen) return null;
    return (
        <ContextMenu position={position} transformOrigin={transformOrigin} onClose={close} theme={theme}>
            <ContextMenuItem icon={Terminal} label="Inspect Element" shortcut="⌥ ⌘ I" onClick={close} theme={theme} />
            <ContextMenuItem icon={Activity} label="Analyze Performance" shortcut="⇧ ⌘ A" onClick={close} theme={theme} />
            <ContextMenuSeparator theme={theme} />
            <ContextMenuItem icon={Settings} label="Platform Settings" onClick={close} theme={theme} />
            <ContextMenuSeparator theme={theme} />
            <ContextMenuItem icon={Bug} label="Report Glitch" destructive onClick={close} theme={theme} />
        </ContextMenu>
    );
}
