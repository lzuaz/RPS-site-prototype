"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
      setIsDesktop(true);
      const style = document.createElement('style');
      style.innerHTML = `* { cursor: none !important; }`;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);
  useEffect(() => {
    if (!isDesktop) return;
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'input' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.cursor-pointer') ||
        target.closest('[class*="cursor-pointer"]');
      setIsHovering(!!isClickable);
    };
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isVisible, isDesktop]);
  if (!isDesktop) return null;
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-0 left-0 pointer-events-none z-[999999]"
          style={{
            x: mouseX,
            y: mouseY,
          }}
        >
          <motion.div
            initial={{ x: "-50%", y: "-50%" }}
            animate={{
              x: "-50%",
              y: "-50%",
              width: isHovering ? 48 : 20,
              height: isHovering ? 48 : 20,
              backgroundColor: isHovering ? "rgba(255, 255, 255, 0.08)" : "rgba(200, 200, 200, 0.3)",
              backdropFilter: isHovering ? "blur(8px)" : "blur(4px)",
              border: isHovering ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.1)",
              scale: isClicking ? 0.85 : 1,
              boxShadow: isHovering ? "0 0 15px rgba(255,255,255,0.05)" : "none"
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 28,
              mass: 0.5
            }}
            className="rounded-full shadow-md flex items-center justify-center"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
