"use client";
import { useState, useRef, useEffect, ReactNode, useCallback } from "react";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { GripHorizontal } from "lucide-react";
interface SpatialWidgetProps {
    children: ReactNode;
    title?: string;
    icon?: any;
    defaultX?: number;
    defaultY?: number;
    defaultWidth?: number;
    defaultHeight?: number;
    minWidth?: number;
    minHeight?: number;
    className?: string;
    boundsRef?: React.RefObject<Element | null>;
    isEditable?: boolean;
    storageKey?: string;
    theme?: any;
}
export default function SpatialWidget({
    children,
    title,
    icon: Icon,
    defaultX = 0,
    defaultY = 0,
    defaultWidth = 400,
    defaultHeight = 300,
    minWidth = 300,
    minHeight = 200,
    className = "",
    boundsRef,
    isEditable = false,
    storageKey,
    theme
}: SpatialWidgetProps) {
    const dragControls = useDragControls();
    const widgetRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [zIndex, setZIndex] = useState(10);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const x = useMotionValue(defaultX);
    const y = useMotionValue(defaultY);
    useEffect(() => {
        if (storageKey) {
            const saved = localStorage.getItem(`spatial_widget_${storageKey}`);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.size) setSize(parsed.size);
                    if (parsed.position) {
                        x.set(parsed.position.x);
                        y.set(parsed.position.y);
                    }
                    if (parsed.zIndex) setZIndex(parsed.zIndex);
                } catch (e) {
                    console.error("Failed to parse widget layout:", e);
                }
            }
        }
        setIsLoaded(true);
    }, [storageKey, x, y]);
    const saveState = useCallback((newSize = size, newZ = zIndex) => {
        if (!storageKey) return;
        localStorage.setItem(`spatial_widget_${storageKey}`, JSON.stringify({
            size: newSize,
            position: { x: x.get(), y: y.get() },
            zIndex: newZ
        }));
    }, [storageKey, size, zIndex, x, y]);
    const bringToFront = () => {
        const newZ = Date.now() % 100000 + 100;
        setZIndex(newZ);
        saveState(size, newZ);
    };
    const startResize = (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        bringToFront();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = size.width;
        const startHeight = size.height;
        const onPointerMove = (moveEvent: PointerEvent) => {
            const newWidth = Math.max(minWidth, startWidth + (moveEvent.clientX - startX));
            const newHeight = Math.max(minHeight, startHeight + (moveEvent.clientY - startY));
            setSize({ width: newWidth, height: newHeight });
        };
        const onPointerUp = () => {
            setIsResizing(false);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
            saveState();
        };
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
    };
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    if (isMobile) {
        return (
            <div className={`w-full rounded-[2.5rem] border border-white/[0.15] bg-white/[0.04] backdrop-blur-2xl shadow-lg p-6 flex flex-col ${className}`}>
                {title && (
                    <div className="flex items-center gap-2 mb-6">
                        {Icon && <Icon className="w-4 h-4 text-sky-400" />}
                        <h3 className="text-sm font-black tracking-widest uppercase">{title}</h3>
                    </div>
                )}
                <div className="flex-1 flex flex-col">{children}</div>
            </div>
        );
    }
    if (!isLoaded) return null;
    return (
        <motion.div
            ref={widgetRef}
            drag={isEditable}
            dragControls={dragControls}
            dragListener={false} 
            dragMomentum={false}
            dragConstraints={boundsRef || undefined}
            onDragStart={() => { setIsDragging(true); bringToFront(); }}
            onDragEnd={() => { setIsDragging(false); saveState(); }}
            style={{ x, y, width: size.width, height: size.height, zIndex: isFocused ? 50 : 10 }}
            onPointerDown={() => setIsFocused(true)}
            className={`absolute flex flex-col rounded-3xl overflow-hidden backdrop-blur-3xl shadow-[0_32px_64px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.1)] 
                transform-gpu will-change-transform backface-hidden isolate
                ${theme ? theme.cardBg : 'bg-[#050505]/90 border-white/[0.08] border'} 
                ${isFocused ? (theme ? theme.borderStrong : 'ring-1 ring-white/20') : ''} 
                ${className}
            `}
        >
            <div
                className={`flex-shrink-0 px-4 h-12 flex items-center justify-between cursor-grab active:cursor-grabbing 
                    ${theme ? 'bg-white/[0.03] border-b border-white/[0.05]' : 'bg-white/[0.03] border-b border-white/[0.05]'}
                `}
                onPointerDown={(e) => {
                    bringToFront();
                    if (isEditable) dragControls.start(e);
                }}
            >
                <div className="flex items-center gap-3">
                    <GripHorizontal className={`w-4 h-4 ${theme ? theme.textMuted : 'text-white/40'}`} />
                    {Icon && <Icon className={`w-4 h-4 ${theme ? theme.textBase : 'text-white/80'}`} />}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${theme ? theme.textBase : 'text-white'}`}>
                        {title}
                    </span>
                </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto flex flex-col relative [&::-webkit-scrollbar]:hidden">
                {children}
            </div>
            {isEditable && (
                <div 
                    className="absolute bottom-1 right-1 w-6 h-6 cursor-nwse-resize flex items-center justify-center opacity-30 hover:opacity-100 transition-opacity z-50 text-white"
                    onPointerDown={startResize}
                >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 0L10 10L0 10" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10 5L5 10" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                </div>
            )}
        </motion.div>
    );
}
