"use client";
import React, {
  useRef,
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import {
  ArrowDown,
  ChevronRight,
  Activity,
  ShieldCheck,
  Terminal,
  Layers,
  Cpu,
  Mail,
  ArrowUpRight,
  Crown,
  Code2,
  Video,
  Users,
  ShieldAlert,
  Bug,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Settings,
  ChevronDown,
  FolderTree,
  FileCode2,
  Database,
  X,
} from "lucide-react";
import BootSequence from "@/components/BootSequence";
import LiveGlobe from "@/components/LiveGlobe";
import LuminousBulb from "@/components/LuminousBulb";
import PublicJobBoard from "@/components/PublicJobBoard";
import { useRouter } from "next/navigation";
import {
  login,
  signup,
  getCurrentUser,
  signInWithOAuth,
  resolveEmail,
} from "./actions/auth.actions";
import { getLandingBlockOrder } from "@/app/actions/settings.actions";
import { createClient } from "@/lib/supabase/client";
const darkTheme = {
  isDark: true,
  bg: "bg-black",
  textBase: "text-white/95",
  textMuted: "text-white/60",
  textSubtle: "text-white/40",
  borderBase: "border-white/[0.07]",
  borderStrong:
    "border-white/[0.15] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
  glassBg:
    "bg-white/[0.06] backdrop-blur-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.06)]",
  glassHover:
    "hover:bg-white/[0.10] hover:shadow-[0_8px_40px_rgba(0,0,0,0.35),0_0_30px_rgba(56,189,248,0.03),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:scale-[1.015] transition-all duration-300 ease-out",
  iconBg: "bg-white/[0.06] backdrop-blur-2xl",
  btnPrimary:
    "bg-white/95 text-black hover:bg-white hover:scale-[1.02] backdrop-blur-lg shadow-[0_4px_20px_0_rgba(255,255,255,0.15),inset_0_1px_0_0_rgba(255,255,255,0.3)]",
  btnGhost:
    "border-white/[0.15] text-white/95 hover:bg-white/[0.10] hover:scale-[1.02] backdrop-blur-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
  btnAccent:
    "bg-white/[0.04] text-white/60 hover:bg-white/[0.12] hover:text-white hover:scale-[1.02] backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
  inputBg:
    "bg-black/50 backdrop-blur-2xl text-white placeholder:text-white/35 border-white/[0.12] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.04)]",
  navBg: "bg-black/30 backdrop-blur-[40px] border-b border-white/[0.07]",
};
const lightTheme = {
  isDark: false,
  bg: "bg-[#f2f2f7]",
  textBase: "text-black/95",
  textMuted: "text-black/60",
  textSubtle: "text-black/40",
  borderBase: "border-black/[0.04]",
  borderStrong:
    "border-white/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5)]",
  glassBg:
    "bg-white/65 backdrop-blur-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_0_rgba(255,255,255,0.5)]",
  glassHover:
    "hover:bg-white/80 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08),inset_0_1px_0_0_rgba(255,255,255,0.6)] hover:scale-[1.015] transition-all duration-300 ease-out",
  iconBg: "bg-white/80 backdrop-blur-2xl",
  btnPrimary:
    "bg-black/95 text-white hover:bg-black hover:scale-[1.02] backdrop-blur-lg shadow-[0_4px_20px_0_rgba(0,0,0,0.15),inset_0_1px_0_0_rgba(255,255,255,0.1)]",
  btnGhost:
    "border-black/[0.08] text-black/95 hover:bg-black/[0.04] hover:scale-[1.02] backdrop-blur-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]",
  btnAccent:
    "bg-white/50 text-black/60 hover:bg-white/80 hover:text-black/95 hover:scale-[1.02] backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]",
  inputBg:
    "bg-white/60 backdrop-blur-2xl text-black placeholder:text-black/35 border-black/[0.06] shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_0_0_rgba(255,255,255,0.5)]",
  navBg: "bg-white/50 backdrop-blur-[40px] border-b border-black/[0.04]",
};
const ThemeContext = createContext(darkTheme);
const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useContext(ThemeContext);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const pulses: {
      points: { x: number; y: number }[];
      progress: number;
      speed: number;
      length: number;
    }[] = [];
    const nodeCount = Math.floor((width * height) / 22000);
    const connectionDistance = 160;
    const connectionDistanceSq = connectionDistance * connectionDistance;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }
    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = theme.isDark;
      const baseGridColor = isDark ? "255, 255, 255" : "0, 0, 0";
      const electricColor = "56, 189, 248";
      const adjacency: number[][] = Array.from(
        { length: nodes.length },
        () => [],
      );
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;
        if (nodes[i].x <= 0 || nodes[i].x >= width) nodes[i].vx *= -1;
        if (nodes[i].y <= 0 || nodes[i].y >= height) nodes[i].vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < connectionDistanceSq) {
            adjacency[i].push(j);
            adjacency[j].push(i);
            const dist = Math.sqrt(distSq);
            const opacity =
              (1 - dist / connectionDistance) * (isDark ? 0.04 : 0.1);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${baseGridColor}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      if (Math.random() < 0.05 && pulses.length < 12) {
        const startNode = Math.floor(Math.random() * nodes.length);
        if (adjacency[startNode].length > 0) {
          const path = [startNode];
          const visited = new Set([startNode]);
          let curr = startNode;
          const targetPathLength = 4 + Math.floor(Math.random() * 4);
          for (let k = 0; k < targetPathLength; k++) {
            const neighbors = adjacency[curr].filter((n) => !visited.has(n));
            if (neighbors.length === 0) break;
            const next =
              neighbors[Math.floor(Math.random() * neighbors.length)];
            path.push(next);
            visited.add(next);
            curr = next;
          }
          if (path.length > 1) {
            const fullPoints = [];
            for (let s = 0; s < path.length - 1; s++) {
              const n1 = nodes[path[s]];
              const n2 = nodes[path[s + 1]];
              fullPoints.push({ x: n1.x, y: n1.y });
              const segments = 4;
              for (let j = 1; j < segments; j++) {
                const t = j / segments;
                fullPoints.push({
                  x: n1.x + (n2.x - n1.x) * t + (Math.random() - 0.5) * 20,
                  y: n1.y + (n2.y - n1.y) * t + (Math.random() - 0.5) * 20,
                });
              }
            }
            fullPoints.push({
              x: nodes[path[path.length - 1]].x,
              y: nodes[path[path.length - 1]].y,
            });
            pulses.push({
              points: fullPoints,
              progress: 0,
              speed: 0.003 + Math.random() * 0.003,
              length: 0.15 + Math.random() * 0.15,
            });
          }
        }
      }
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;
        if (pulse.progress - pulse.length >= 1) {
          pulses.splice(p, 1);
        } else {
          const startP = Math.max(0, pulse.progress - pulse.length);
          const endP = Math.min(1, pulse.progress);
          const totalSubSegs = pulse.points.length - 1;
          ctx.strokeStyle = `rgba(${electricColor}, 1)`;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          const pulseThickness = Math.sin(Math.PI * endP) * 2.5;
          ctx.lineWidth = Math.max(1, pulseThickness);
          ctx.beginPath();
          let started = false;
          for (let i = 0; i < totalSubSegs; i++) {
            const segStartT = i / totalSubSegs;
            const segEndT = (i + 1) / totalSubSegs;
            if (endP >= segStartT && startP <= segEndT) {
              const localStart = Math.max(
                0,
                (startP - segStartT) / (segEndT - segStartT),
              );
              const localEnd = Math.min(
                1,
                (endP - segStartT) / (segEndT - segStartT),
              );
              const p1 = pulse.points[i];
              const p2 = pulse.points[i + 1];
              const drawStartX = p1.x + (p2.x - p1.x) * localStart;
              const drawStartY = p1.y + (p2.y - p1.y) * localStart;
              const drawEndX = p1.x + (p2.x - p1.x) * localEnd;
              const drawEndY = p1.y + (p2.y - p1.y) * localEnd;
              if (!started) {
                ctx.moveTo(drawStartX, drawStartY);
                started = true;
              } else {
                ctx.lineTo(drawStartX, drawStartY);
              }
              ctx.lineTo(drawEndX, drawEndY);
            }
          }
          ctx.stroke();
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme.isDark]);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-100 mix-blend-screen"
    />
  );
};
const SpatialCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const theme = useContext(ThemeContext);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-[2.5rem] border ${theme.borderBase} ${theme.glassBg} overflow-hidden ${theme.glassHover} hover:shadow-[0_0_60px_rgba(56,189,248,0.04)] group/card ${className}`}
    >
      {" "}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover/card:opacity-100 z-50"
        style={{
          background: useMotionTemplate`            radial-gradient(              600px circle at ${mouseX}px ${mouseY}px,              rgba(56, 189, 248, 0.08),              transparent 80%            )          `,
        }}
      />{" "}
      {children}{" "}
    </motion.div>
  );
};
const AppIcon = ({
  icon: Icon,
  color = "text-emerald-400",
  glow = "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]",
}: {
  icon: any;
  color?: string;
  glow?: string;
}) => {
  const theme = useContext(ThemeContext);
  return (
    <div
      className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center border ${theme.borderStrong} shadow-[inset_0_0_20px_rgba(16,185,129,0.02),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-2xl transition-all duration-500 ease-out group-hover:scale-110 ${theme.iconBg} ${glow}`}
    >
      {" "}
      <Icon className={`w-6 h-6 ${color}`} strokeWidth={1.5} />{" "}
    </div>
  );
};
const FadeText = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className={`transition-colors duration-700 ${className}`}
  >
    {" "}
    {children}{" "}
  </motion.div>
);
const navItems = [
  { id: "coord-core", label: "Core" },
  { id: "coord-ops", label: "Operations" },
  { id: "coord-arch", label: "Deployed" },
  { id: "coord-vanguard", label: "Vanguard" },
  { id: "coord-uplink", label: "Contact" },
];
const teamHierarchy = [
  {
    role: "Founder & Lead Programmer",
    name: "Monarch",
    desc: "Visionary Architect, Engine Lead & C++ Systems Logic. Operating in perpetual flow state.",
    icon: Crown,
    color: "text-purple-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
  },
  {
    role: "Studio Director",
    name: "Argeno",
    desc: "Strategic operations and production management. Anticipating systemic roadblocks.",
    icon: Cpu,
    color: "text-blue-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
  },
  {
    role: "Lead Animator",
    name: "Cipher",
    desc: "3D Rigging & Spatial Motion. Bringing pixels to life.",
    icon: Video,
    color: "text-pink-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]",
  },
  {
    role: "Community Manager",
    name: "Vanguard",
    desc: "Autarchs Server Operations & Digital Event Orchestration.",
    icon: Users,
    color: "text-orange-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]",
  },
  {
    role: "Moderator",
    name: "Aegis",
    desc: "Network Security & Compliance. Enforcing server rulesets.",
    icon: ShieldAlert,
    color: "text-red-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]",
  },
  {
    role: "QA Tester",
    name: "Glitch",
    desc: "Exploit Discovery & Patching. Breaking things so others can't.",
    icon: Bug,
    color: "text-yellow-400",
    glow: "group-hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]",
  },
];
export default function WelcomePage() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isBooting, setIsBooting] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    getCurrentUser().then((user) => {
      setCurrentUser(user);
      if (user && user.role !== "player") {
        router.push("/dev");
      }
    });
  }, [router]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authFirstName, setAuthFirstName] = useState("");
  const [authLastName, setAuthLastName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [blockOrder, setBlockOrder] = useState<string[]>([
    "hero",
    "games",
    "vanguard",
    "contact",
  ]);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setIsNavHidden(true);
      } else if (currentScrollY < lastScrollY.current) {
        setIsNavHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    getLandingBlockOrder().then((res) => {
      if (res.success && res.order) setBlockOrder(res.order);
    });
  }, []);
  const theme = isDarkTheme ? darkTheme : lightTheme;
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pageProgress } = useScroll({
    target: pageRef,
    offset: ["start start", "end end"],
  });
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: introProgressRaw } = useScroll({
    target: introRef,
    offset: ["start start", "end end"],
  });
  const smoothIntro = useSpring(introProgressRaw, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });
  const opsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: opsProgress } = useScroll({
    target: opsRef,
    offset: ["start end", "end start"],
  });
  const opsTextY = useTransform(opsProgress, [0, 1], ["20%", "-40%"]);
  const teamRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: teamProgress } = useScroll({
    target: teamRef,
    offset: ["start end", "end start"],
  });
  const teamTextY = useTransform(teamProgress, [0, 1], ["0%", "-50%"]);
  const introOpacity = useTransform(smoothIntro, [0.8, 1], [1, 0]);
  const introScale = useTransform(smoothIntro, [0.8, 1], [1, 0.95]);
  const heroScale = useTransform(smoothIntro, [0, 0.2], [1, 0.9]);
  const heroOpacity = useTransform(smoothIntro, [0, 0.2], [1, 0]);
  const heroY = useTransform(smoothIntro, [0, 0.2], ["0vh", "-20vh"]);
  const buttonOpacity = useTransform(smoothIntro, [0, 0.05], [1, 0]);
  const splitY = useTransform(smoothIntro, [0.15, 0.4], ["100vh", "0vh"]);
  const splitOpacity = useTransform(smoothIntro, [0.15, 0.35], [0, 1]);
  const splitScale = useTransform(smoothIntro, [0.15, 0.4], [0.8, 1]);
  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    if (authMode === "signup") {
      if (
        !authFirstName.trim() ||
        !authLastName.trim() ||
        !authEmail.trim() ||
        !authUsername.trim() ||
        !authPassword.trim()
      ) {
        setAuthError("All parameters must be configured for clearance.");
        setAuthLoading(false);
        return;
      }
      if (!authEmail.includes("@")) {
        setAuthError("Invalid network routing address (email).");
        setAuthLoading(false);
        return;
      }
    } else {
      if (!authUsername.trim() || !authPassword.trim()) {
        setAuthError(
          "Credentials missing. Please provide username and passkey.",
        );
        setAuthLoading(false);
        return;
      }
    }
    const action =
      authMode === "login"
        ? () => login(authUsername, authPassword)
        : () =>
            signup(
              authFirstName,
              authLastName,
              authEmail,
              authUsername,
              authPassword,
            );
    const res = await action();
    if (!res?.success) {
      setAuthError(res?.error || "Authentication failed. Node rejected.");
      setAuthLoading(false);
      return;
    }
    if (res && "bypassLink" in res && res.bypassLink) {
      window.location.href = res.bypassLink as string;
      return;
    }
    const supabase = createClient();
    const resolvedEmail =
      authMode === "login"
        ? (await resolveEmail(authUsername)) || authUsername
        : authEmail;
    const { error } = await supabase.auth.signInWithPassword({
      email: resolvedEmail,
      password: authPassword,
    });
    setAuthLoading(false);
    if (error) {
      setAuthError(error.message);
      return;
    }
    const sessionUser = await getCurrentUser();
    if (sessionUser && sessionUser.role !== "player") {
      router.push("/dev");
    } else {
      router.push("/dashboard");
    }
  };
  const handleOAuth = async (provider: "google" | "github") => {
    setAuthLoading(true);
    setAuthError("");
    const res = await signInWithOAuth(provider);
    if (res.success && res.url) {
      window.location.href = res.url;
    } else {
      setAuthError(res.error || "OAuth initialization failed");
      setAuthLoading(false);
    }
  };
  return (
    <ThemeContext.Provider value={theme}>
      {" "}
      {isBooting && (
        <BootSequence onComplete={() => setIsBooting(false)} />
      )}{" "}
      <main
        ref={pageRef}
        className={`relative min-h-screen transition-colors duration-700 ${theme.bg} ${theme.textBase} selection:bg-sky-500/30 overflow-x-hidden font-sans antialiased pb-12`}
      >
        {" "}
        <AnimatePresence>
          {" "}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[250] lg:hidden flex flex-col items-center justify-center p-6"
            >
              {" "}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className={`absolute top-8 right-8 p-3 rounded-full ${theme.iconBg} border ${theme.borderStrong}`}
              >
                {" "}
                <X className="w-5 h-5" />{" "}
              </button>{" "}
              <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                {" "}
                <img
                  src="/logo.png"
                  alt="RPS Logo"
                  className="w-16 h-16 object-contain mb-4 drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]"
                />{" "}
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      scrollToId(item.id);
                    }}
                    className={`w-full py-4 rounded-2xl ${theme.glassBg} border ${theme.borderStrong} text-xs font-bold tracking-[0.2em] uppercase text-center`}
                  >
                    {" "}
                    {item.label}{" "}
                  </button>
                ))}{" "}
              </div>{" "}
            </motion.div>
          )}{" "}
        </AnimatePresence>{" "}
        <div
          className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ${isDarkTheme ? "opacity-[0.02]" : "opacity-[0.04]"} bg-[url('https://grainy-gradients.vercel.app/noise.svg')]`}
        />{" "}
        <NeuralBackground />{" "}
        <div
          id="coord-core"
          className="absolute top-0 w-full h-px pointer-events-none"
        />{" "}
        <nav className="fixed top-6 w-full flex justify-center z-[200] pointer-events-none px-4">
          {" "}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{
              y: isNavHidden ? -150 : 0,
              opacity: isNavHidden ? 0 : 1,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full md:w-[85%] max-w-7xl px-4 md:px-8 py-3 flex justify-between items-center pointer-events-auto border ${theme.navBg} shadow-2xl rounded-[2rem] backdrop-blur-md transition-colors duration-700 relative`}
          >
            {" "}
            <div className="hidden lg:flex items-center gap-6 z-10">
              {" "}
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToId(item.id)}
                  className={`py-1 px-2 text-[10px] font-bold tracking-[0.2em] ${theme.textMuted} hover:${theme.textBase} transition-all duration-300 uppercase`}
                >
                  {" "}
                  {item.label}{" "}
                </button>
              ))}{" "}
            </div>{" "}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer z-20"
              onClick={() => scrollToId("coord-core")}
            >
              {" "}
              <img
                src="/logo.png"
                alt="RPS Logo"
                className={`w-8 h-8 object-contain transition-all duration-700 hover:scale-110 ${isDarkTheme ? "drop-shadow-[0_0_20px_rgba(56,189,248,0.6)]" : "drop-shadow-sm"}`}
              />{" "}
            </div>{" "}
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 z-10 ml-auto lg:ml-0">
              {" "}
              <div
                className="relative group/dropdown hidden md:block mr-2"
                onMouseEnter={() => setIsDirectoryOpen(true)}
                onMouseLeave={() => setIsDirectoryOpen(false)}
              >
                {" "}
                <button
                  className={`flex items-center gap-2 py-2 px-5 rounded-full border ${theme.borderStrong} ${theme.iconBg} font-bold tracking-[0.2em] text-[9px] ${theme.textBase} hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all duration-300 uppercase`}
                >
                  {" "}
                  Directory{" "}
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${isDirectoryOpen ? "rotate-180" : ""}`}
                  />{" "}
                </button>{" "}
                <AnimatePresence>
                  {" "}
                  {isDirectoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`absolute top-full right-0 mt-3 w-56 rounded-[1.5rem] border ${theme.borderStrong} ${theme.glassBg} backdrop-blur-md shadow-2xl overflow-hidden py-3`}
                    >
                      {" "}
                      <div className="flex flex-col">
                        {" "}
                        {[
                          { name: "Studio Vault", icon: Database },
                          { name: "Client Terminal", icon: FolderTree },
                          { name: "Dev Documentation", icon: FileCode2 },
                        ].map((link, i) => (
                          <button
                            key={i}
                            className={`w-full flex items-center gap-3 px-5 py-3 text-[10px] font-bold tracking-widest uppercase ${theme.textMuted} hover:${theme.textBase} ${theme.glassHover} transition-colors`}
                          >
                            {" "}
                            <link.icon className="w-3.5 h-3.5" />{" "}
                            {link.name}{" "}
                          </button>
                        ))}{" "}
                      </div>{" "}
                    </motion.div>
                  )}{" "}
                </AnimatePresence>{" "}
              </div>{" "}
              <button
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                className={`w-8 h-8 rounded-full border ${theme.borderStrong} ${theme.iconBg} flex items-center justify-center ${theme.textMuted} hover:${theme.textBase} transition-colors duration-700 hidden sm:flex`}
              >
                {" "}
                {isSoundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}{" "}
              </button>{" "}
              <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className={`relative w-8 h-8 rounded-full border ${theme.borderStrong} ${theme.iconBg} flex items-center justify-center ${theme.textMuted} hover:${theme.textBase} transition-colors duration-700 hidden sm:flex overflow-hidden`}
              >
                {" "}
                <AnimatePresence mode="wait" initial={false}>
                  {" "}
                  <motion.div
                    key={isDarkTheme ? "moon" : "sun"}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    className="absolute"
                  >
                    {" "}
                    {isDarkTheme ? (
                      <Moon className="w-3.5 h-3.5" />
                    ) : (
                      <Sun className="w-3.5 h-3.5" />
                    )}{" "}
                  </motion.div>{" "}
                </AnimatePresence>{" "}
              </button>{" "}
              <div
                className={`w-[1px] h-4 ${theme.borderStrong} border-r mx-1 hidden sm:block transition-colors duration-700`}
              />{" "}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`lg:hidden w-8 h-8 rounded-full border ${theme.borderStrong} ${theme.iconBg} flex items-center justify-center ${theme.textMuted} transition-colors duration-700`}
              >
                {" "}
                <div className="w-3.5 h-[2px] bg-current rounded-full shadow-[0_4px_0_0_currentColor,0_-4px_0_0_currentColor]" />{" "}
              </button>{" "}
              <button
                onClick={() => {
                  if (currentUser) router.push("/dashboard");
                  else {
                    setAuthMode("login");
                    setIsAuthOpen(true);
                  }
                }}
                className={`py-2.5 px-5 rounded-full text-[9px] border ${theme.borderStrong} ${theme.iconBg} font-bold tracking-[0.2em] ${theme.textBase} hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all duration-300 flex items-center gap-2 uppercase`}
              >
                {" "}
                <Settings className="w-3 h-3 hidden sm:block" />{" "}
                {currentUser ? currentUser.username : "PORTAL"}{" "}
              </button>{" "}
            </div>{" "}
          </motion.div>{" "}
        </nav>{" "}
        <div className="fixed left-4 md:left-8 top-1/4 bottom-1/4 w-[3px] bg-sky-500/10 rounded-full z-[100] pointer-events-none hidden md:flex items-start justify-center">
          {" "}
          <motion.div
            className="w-full h-full bg-gradient-to-b from-transparent to-sky-400 rounded-full opacity-50 will-change-transform"
            style={{ scaleY: pageProgress, transformOrigin: "top" }}
          />{" "}
          <motion.div
            className="absolute w-2 h-6 -ml-[2.5px] bg-sky-400 rounded-full shadow-[0_0_20px_#38bdf8,0_0_40px_#38bdf8]"
            style={{ top: useTransform(pageProgress, [0, 1], ["0%", "100%"]) }}
          />{" "}
        </div>{" "}
        {blockOrder.map((blockId) => (
          <React.Fragment key={blockId}>
            {" "}
            {blockId === "hero" && (
              <div ref={introRef} className="h-[300vh] relative z-10">
                {" "}
                <motion.div
                  className="sticky top-0 h-screen w-full flex items-center justify-center will-change-transform"
                  style={{ opacity: introOpacity, scale: introScale }}
                >
                  <motion.div
                    className="absolute flex flex-col items-center justify-center w-full px-6 pointer-events-none"
                    style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
                  >
                    <h1
                      className={`text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter leading-[0.85] text-center text-transparent bg-clip-text bg-gradient-to-b ${isDarkTheme ? "from-white via-white/90 to-white/20" : "from-black via-black/90 to-black/20"} mb-6 drop-shadow-2xl transition-all duration-700`}
                    >
                      Welcome to <br />
                      Rascal Pixels Studio.
                    </h1>
                    <p
                      className={`px-4 py-1.5 rounded-full border ${theme.borderStrong} ${theme.iconBg} text-[10px] md:text-xs font-bold tracking-[0.3em] text-sky-400 uppercase shadow-[0_0_30px_rgba(56,189,248,0.1)] transition-colors duration-700`}
                    >
                      Official Website
                    </p>
                  </motion.div>
                  <motion.div
                    className="absolute bottom-12"
                    style={{ opacity: buttonOpacity }}
                  >
                    <button className="flex flex-col items-center gap-4 group">
                      <span
                        className={`px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.3em] ${theme.textMuted} uppercase ${theme.iconBg} backdrop-blur-md border ${theme.borderStrong} group-hover:${theme.bg} group-hover:${theme.textBase} transition-all duration-500`}
                      >
                        Scroll to Explore
                      </span>
                      <ArrowDown
                        className={`w-4 h-4 ${theme.textSubtle} group-hover:${theme.textBase} animate-bounce transition-colors duration-700`}
                      />
                    </button>
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center w-full h-full pointer-events-none will-change-transform px-4 md:px-8 pt-24 pb-8"
                    style={{
                      y: splitY,
                      opacity: splitOpacity,
                      scale: splitScale,
                    }}
                  >
                    <div
                      className={`w-full max-w-7xl mx-auto flex flex-col lg:flex-row rounded-[2.5rem] border ${theme.borderBase} ${theme.glassBg} shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto transition-colors duration-700 relative z-20`}
                    >
                      <div
                        className={`flex-1 p-8 md:p-12 flex flex-col justify-between relative group/panel ${theme.glassHover} transition-colors duration-700 rounded-t-[2.5rem] lg:rounded-tr-none lg:rounded-l-[2.5rem]`}
                      >
                        {" "}
                        <div className="flex w-full justify-between items-center mb-8 gap-6">
                          {" "}
                          <div className="flex flex-col gap-6 flex-1">
                            {" "}
                            <div className="flex flex-col gap-3">
                              {" "}
                              <div className="flex flex-col">
                                {" "}
                                <span className="text-[9px] text-emerald-500 font-bold tracking-[0.2em] uppercase mb-1 flex items-center gap-1.5">
                                  <Activity className="w-3 h-3" /> Network Nodes
                                </span>{" "}
                                <span
                                  className={`text-3xl font-bold tracking-tighter ${theme.textBase} transition-colors duration-700`}
                                >
                                  4,204
                                </span>{" "}
                              </div>{" "}
                              <div className="flex flex-col">
                                {" "}
                                <span
                                  className={`text-[9px] ${theme.textMuted} font-bold tracking-[0.2em] uppercase mb-1 transition-colors duration-700`}
                                >
                                  Global Latency
                                </span>{" "}
                                <span
                                  className={`text-xl font-medium tracking-tight ${theme.textBase} transition-colors duration-700`}
                                >
                                  12ms Ping
                                </span>{" "}
                              </div>{" "}
                            </div>{" "}
                            <div className="flex flex-col mt-4">
                              {" "}
                              <h3
                                className={`text-3xl font-bold tracking-tight ${theme.textBase} mb-2 transition-colors duration-700`}
                              >
                                {" "}
                                {currentUser
                                  ? `Welcome, ${currentUser.username}`
                                  : "Developer Network"}{" "}
                              </h3>{" "}
                              <p
                                className={`${theme.textMuted} font-medium text-xs leading-relaxed max-w-[280px] transition-colors duration-700`}
                              >
                                {" "}
                                {currentUser
                                  ? "Access your studio telemetry and project nodes."
                                  : "Sign up or Login to Unlock full experience"}{" "}
                              </p>{" "}
                            </div>{" "}
                          </div>{" "}
                          <div className="flex-shrink-0">
                            <LiveGlobe />
                          </div>{" "}
                        </div>{" "}
                        <div
                          className={`w-full flex flex-col gap-3 mt-auto pt-6 border-t ${theme.borderBase} transition-colors duration-700`}
                        >
                          {" "}
                          {currentUser ? (
                            <button
                              onClick={() => router.push("/dashboard")}
                              className={`w-full py-4 rounded-2xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300 shadow-md ${theme.btnPrimary}`}
                            >
                              {" "}
                              ENTER DASHBOARD{" "}
                            </button>
                          ) : (
                            <>
                              {" "}
                              <div className="flex gap-3 w-full">
                                {" "}
                                <button
                                  onClick={() => {
                                    setAuthMode("signup");
                                    setIsAuthOpen(true);
                                  }}
                                  className={`flex-1 py-4 rounded-2xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300 shadow-md ${theme.btnPrimary}`}
                                >
                                  SIGN UP
                                </button>{" "}
                                <button
                                  onClick={() => {
                                    setAuthMode("login");
                                    setIsAuthOpen(true);
                                  }}
                                  className={`flex-1 py-4 rounded-2xl text-[11px] font-bold tracking-widest uppercase transition-all duration-300 border ${theme.btnGhost}`}
                                >
                                  LOG IN
                                </button>{" "}
                              </div>{" "}
                              <button
                                onClick={() => router.push("/dashboard")}
                                className={`w-full py-3.5 rounded-2xl text-[11px] font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${theme.btnAccent}`}
                              >
                                {" "}
                                GUEST PASS{" "}
                                <ChevronRight className="w-3 h-3" />{" "}
                              </button>{" "}
                            </>
                          )}{" "}
                        </div>{" "}
                      </div>{" "}
                      <div
                        className={`hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-${isDarkTheme ? "white" : "black"}/10 to-transparent my-16 transition-colors duration-700`}
                      />{" "}
                      <div
                        className={`block lg:hidden h-[1px] w-full bg-gradient-to-r from-transparent via-${isDarkTheme ? "white" : "black"}/10 to-transparent mx-12 transition-colors duration-700`}
                      />{" "}
                      <div
                        className={`flex-1 p-8 md:p-12 flex flex-col justify-between group/panel ${theme.glassHover} transition-colors duration-700 rounded-b-[2.5rem] lg:rounded-bl-none lg:rounded-r-[2.5rem]`}
                      >
                        {" "}
                        <div className="flex w-full justify-between items-center mb-8 gap-4">
                          {" "}
                          <div className="flex flex-col text-right">
                            {" "}
                            <span
                              className={`text-[9px] ${theme.textMuted} font-bold tracking-[0.2em] uppercase mb-1 transition-colors duration-700`}
                            >
                              Clearance
                            </span>{" "}
                            <span
                              className={`text-xl font-medium tracking-tight ${theme.textBase} transition-colors duration-700`}
                            >
                              Tier 4
                            </span>{" "}
                          </div>{" "}
                          <LuminousBulb />{" "}
                          <div className="flex flex-col text-left">
                            {" "}
                            <span className="text-[9px] text-emerald-500 font-bold tracking-[0.2em] uppercase mb-1 flex items-center gap-1.5">
                              <ShieldCheck className="w-3 h-3" /> Status
                            </span>{" "}
                            <span
                              className={`text-xl font-medium tracking-tight ${theme.textBase} transition-colors duration-700`}
                            >
                              Encrypted
                            </span>{" "}
                          </div>{" "}
                        </div>{" "}
                        <div className="w-full mb-8 pt-4 text-center">
                          {" "}
                          <h3
                            className={`text-3xl font-bold tracking-tight ${theme.textBase} mb-2 transition-colors duration-700`}
                          >
                            Investor Vault
                          </h3>{" "}
                          <p
                            className={`${theme.textMuted} font-medium text-xs leading-relaxed max-w-[280px] mx-auto transition-colors duration-700`}
                          >
                            {" "}
                            Exclusive portal for verified venture partners and
                            shareholders. Authorization required.{" "}
                          </p>{" "}
                        </div>{" "}
                        <div
                          className={`w-full mt-auto pt-6 border-t ${theme.borderBase} transition-colors duration-700`}
                        >
                          {" "}
                          <button
                            onClick={() => {
                              setAuthMode("login");
                              setIsAuthOpen(true);
                            }}
                            className="w-full py-4 rounded-2xl text-[11px] font-bold tracking-[0.2em] text-black bg-sky-400 hover:bg-sky-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_30px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2"
                          >
                            {" "}
                            ACCESS INVESTOR PASS{" "}
                          </button>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                  </motion.div>{" "}
                </motion.div>{" "}
              </div>
            )}{" "}
            {blockId === "games" && (
              <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pt-32">
                {" "}
                <section
                  id="coord-ops"
                  ref={opsRef}
                  className="relative min-h-[80vh] flex flex-col justify-center py-12 scroll-mt-24"
                >
                  {" "}
                  <motion.div
                    className="absolute -top-10 md:-top-32 left-0 right-0 z-0 pointer-events-none overflow-hidden flex justify-center will-change-transform"
                    style={{ y: opsTextY }}
                  >
                    {" "}
                    <h2
                      className={`text-[5rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] font-black tracking-tighter ${isDarkTheme ? "text-white/[0.02]" : "text-black/[0.03]"} whitespace-nowrap leading-none select-none transition-colors duration-700`}
                    >
                      SYSTEMS
                    </h2>{" "}
                  </motion.div>{" "}
                  <div className="relative z-10">
                    {" "}
                    <FadeText className="mb-10">
                      {" "}
                      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                        Studio Pipeline
                      </h2>{" "}
                      <p
                        className={`${theme.textMuted} max-w-2xl text-base md:text-lg`}
                      >
                        Upcoming and actively developed games and core
                        technologies within the Rascal Pixels Studio ecosystem.
                      </p>{" "}
                    </FadeText>{" "}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {" "}
                      <SpatialCard className="p-4 md:p-5 flex flex-col group cursor-pointer hover:border-emerald-500/50 hover:shadow-[0_0_50px_rgba(16,185,129,0.1)] h-full">
                        {" "}
                        <div className="w-full h-24 md:h-32 rounded-2xl overflow-hidden mb-4 border border-white/5 relative bg-black/50 flex-shrink-0">
                          {" "}
                          <img
                            src="/post_rife_banner.png"
                            alt="Post Rife Banner"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />{" "}
                          <div className="absolute top-2 right-2">
                            {" "}
                            <span
                              className={`px-2 py-1 border ${theme.borderStrong} bg-black/60 backdrop-blur-md rounded-full text-[8px] font-bold tracking-widest text-emerald-500 uppercase`}
                            >
                              IN WORKS
                            </span>{" "}
                          </div>{" "}
                        </div>{" "}
                        <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-emerald-500 transition-colors">
                          Post Rife
                        </h3>{" "}
                        <p
                          className={`${theme.textMuted} text-xs leading-relaxed flex-grow mb-4 line-clamp-2`}
                        >
                          A sprawling open-world survival experience set in the
                          brutal aftermath of a devastating global pandemic.
                        </p>{" "}
                        <button
                          onClick={() =>
                            setSelectedProject({
                              title: "Post Rife",
                              status: "IN WORKS",
                              textColor: "text-emerald-500",
                              image: "/post_rife_banner.png",
                              description:
                                "Post Rife is our flagship open-world survival game currently in pre-alpha development on the Roblox platform. Set in a sprawling, meticulously crafted ruined city, players must scavenge, build, and survive against both the environment and other factions. The game features an advanced inventory system, realistic stamina and injury mechanics, and a fully dynamic weather system. Our custom engine tuning ensures massive concurrent player counts with minimal lag, utilizing Luau task schedulers and aggressive asset streaming.",
                              features: [
                                "Dynamic Weather",
                                "Advanced Inventory",
                                "Luau Optimizations",
                                "Faction Alliances",
                              ],
                            })
                          }
                          className={`px-4 py-2.5 rounded-2xl border ${theme.borderStrong} ${theme.iconBg} text-[10px] font-bold tracking-widest uppercase hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-500 transition-all w-full mt-auto`}
                        >
                          {" "}
                          Read More{" "}
                        </button>{" "}
                      </SpatialCard>{" "}
                      <SpatialCard className="p-4 md:p-5 flex flex-col group cursor-pointer hover:border-red-500/50 hover:shadow-[0_0_50px_rgba(239,68,68,0.1)] h-full">
                        {" "}
                        <div className="w-full h-24 md:h-32 rounded-2xl overflow-hidden mb-4 border border-white/5 relative bg-black/50 flex-shrink-0">
                          {" "}
                          <img
                            src="/iron_man_suits_banner.png"
                            alt="Iron Man: Armored Warfare Banner"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />{" "}
                          <div className="absolute top-2 right-2">
                            {" "}
                            <span
                              className={`px-2 py-1 border ${theme.borderStrong} bg-black/60 backdrop-blur-md rounded-full text-[8px] font-bold tracking-widest text-red-500 uppercase`}
                            >
                              PRE-ALPHA
                            </span>{" "}
                          </div>{" "}
                        </div>{" "}
                        <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-red-500 transition-colors">
                          Iron Man: Armored Warfare
                        </h3>{" "}
                        <p
                          className={`${theme.textMuted} text-xs leading-relaxed flex-grow mb-4 line-clamp-2`}
                        >
                          A highly immersive player-vs-player Iron Man
                          experience on Roblox.
                        </p>{" "}
                        <button
                          onClick={() =>
                            setSelectedProject({
                              title: "Iron Man: Armored Warfare",
                              status: "PRE-ALPHA",
                              textColor: "text-red-500",
                              image: "/iron_man_suits_banner.png",
                              description:
                                "Suit up in highly detailed, physically simulated Iron Man armor in this adrenaline-pumping PvP experience on the Roblox platform. 'Iron Man: Armored Warfare' pushes the engine to its absolute limits, featuring dynamic flight mechanics, real-time destruction, and a deeply immersive combat system. Engage in high-altitude dogfights, unleash devastating repulsor blasts, and outmaneuver rival armored combatants in sprawling futuristic battlegrounds. Our custom animation rigging and particle systems ensure every thruster burn and impact feels cinematic and visceral.",
                              features: [
                                "Dynamic Flight System",
                                "Real-time Destruction",
                                "Repulsor Combat",
                                "Custom Rigging",
                              ],
                            })
                          }
                          className={`px-4 py-2.5 rounded-2xl border ${theme.borderStrong} ${theme.iconBg} text-[10px] font-bold tracking-widest uppercase hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all w-full mt-auto`}
                        >
                          {" "}
                          Read More{" "}
                        </button>{" "}
                      </SpatialCard>{" "}
                    </div>{" "}
                  </div>{" "}
                </section>{" "}
              </div>
            )}{" "}
            {blockId === "deployed" && (
              <section
                id="coord-deployed"
                className="relative min-h-[80vh] pt-32 scroll-mt-24"
              >
                {" "}
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  {" "}
                  <FadeText className="mb-16">
                    {" "}
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                      Deployed Nodes
                    </h2>{" "}
                    <p
                      className={`${theme.textMuted} max-w-2xl text-base md:text-lg`}
                    >
                      High-level reality-shifting products pushed to production.
                    </p>{" "}
                  </FadeText>{" "}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {" "}
                    {[1, 2, 3].map((item) => (
                      <SpatialCard
                        key={item}
                        className="h-[450px] flex flex-col justify-end p-8 group cursor-pointer relative hover:border-sky-500/30 hover:shadow-[0_0_40px_rgba(56,189,248,0.1)]"
                      >
                        {" "}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${isDarkTheme ? "from-neutral-900 to-[#030303]" : "from-neutral-300 to-white"} opacity-60 group-hover:scale-110 transition-all duration-1000`}
                        />{" "}
                        <div
                          className={`absolute inset-0 bg-gradient-to-t ${isDarkTheme ? "from-black via-black/90" : "from-white via-white/90"} to-transparent transition-colors duration-700`}
                        />{" "}
                        <div className="relative z-10">
                          {" "}
                          <span
                            className={`text-[10px] ${theme.textMuted} font-bold tracking-[0.2em] uppercase mb-3 block`}
                          >
                            Deployment 0{item}
                          </span>{" "}
                          <h3 className="text-3xl font-bold tracking-tight mb-3">
                            Platform Horizon
                          </h3>{" "}
                          <p
                            className={`${theme.textMuted} text-sm leading-relaxed`}
                          >
                            Complete structural overhaul and full-stack
                            deployment of scalable digital goods.
                          </p>{" "}
                        </div>{" "}
                      </SpatialCard>
                    ))}{" "}
                  </div>{" "}
                </div>{" "}
              </section>
            )}{" "}
            {blockId === "coord-arch" && (
              <section
                id="coord-arch"
                className="relative min-h-[60vh] pt-32 scroll-mt-24"
              >
                {" "}
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                  {" "}
                  <FadeText className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    {" "}
                    <div>
                      {" "}
                      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                        Archives
                      </h2>{" "}
                      <p
                        className={`${theme.textMuted} max-w-xl text-base md:text-lg`}
                      >
                        Historical operational logs and legacy data structures
                        from previous cycles.
                      </p>{" "}
                    </div>{" "}
                    <button
                      className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase ${theme.textMuted} hover:${theme.textBase} transition-colors pb-2 border-b ${theme.borderStrong}`}
                    >
                      {" "}
                      View Full Logs <ArrowUpRight className="w-4 h-4" />{" "}
                    </button>{" "}
                  </FadeText>{" "}
                </div>{" "}
              </section>
            )}{" "}
            {blockId === "vanguard" && (
              <section
                id="coord-vanguard"
                ref={teamRef}
                className={`relative min-h-[120vh] border-t ${theme.borderBase} pt-32 pb-32 overflow-hidden transition-colors duration-700`}
              >
                {" "}
                <motion.div
                  className="absolute top-0 left-0 w-full z-0 pointer-events-none flex justify-center opacity-30 will-change-transform"
                  style={{ y: teamTextY }}
                >
                  {" "}
                  <h2
                    className="text-[4rem] sm:text-[6rem] md:text-[10rem] lg:text-[12rem] font-black tracking-tighter text-transparent"
                    style={{
                      WebkitTextStroke: `1px ${isDarkTheme ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                    }}
                  >
                    {" "}
                    VANGUARD{" "}
                  </h2>{" "}
                </motion.div>{" "}
                <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
                  {" "}
                  <FadeText className="mb-20 text-center">
                    {" "}
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                      The Vanguard
                    </h2>{" "}
                    <p
                      className={`${theme.textMuted} max-w-xl mx-auto text-base md:text-lg`}
                    >
                      The comprehensive engineering, design, and moderation
                      force driving the studio's global expansion.
                    </p>{" "}
                  </FadeText>{" "}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {" "}
                    {teamHierarchy.map((member, idx) => {
                      const colSpan =
                        idx < 2 ? "lg:col-span-3 md:col-span-2" : "col-span-1";
                      const layout =
                        idx < 2
                          ? "flex-col md:flex-row items-start md:items-center"
                          : "flex-col items-start";
                      return (
                        <SpatialCard
                          key={idx}
                          className={`p-6 md:p-8 group hover:border-white/10 ${colSpan}`}
                        >
                          {" "}
                          <div className={`flex gap-6 ${layout}`}>
                            {" "}
                            <AppIcon
                              icon={member.icon}
                              color={member.color}
                              glow={member.glow}
                            />{" "}
                            <div>
                              {" "}
                              <p
                                className={`${member.color} text-[10px] font-bold tracking-widest uppercase mb-2`}
                              >
                                {member.role}
                              </p>{" "}
                              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                                {member.name}
                              </h3>{" "}
                              <p
                                className={`${theme.textMuted} text-sm leading-relaxed max-w-lg`}
                              >
                                {member.desc}
                              </p>{" "}
                            </div>{" "}
                          </div>{" "}
                        </SpatialCard>
                      );
                    })}{" "}
                  </div>{" "}
                  <PublicJobBoard isDarkTheme={isDarkTheme} />{" "}
                </div>{" "}
              </section>
            )}{" "}
            {blockId === "contact" && (
              <section id="coord-uplink" className="relative pt-32 pb-20">
                {" "}
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                  {" "}
                  <SpatialCard className="p-12 md:p-20 text-center border-t border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent mb-32 hover:shadow-[0_0_80px_rgba(255,255,255,0.02)]">
                    {" "}
                    <FadeText>
                      {" "}
                      <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                        Establish Connection
                      </h2>{" "}
                      <p
                        className={`${theme.textMuted} max-w-xl mx-auto mb-10 text-base md:text-lg`}
                      >
                        {" "}
                        Subscribe to the mainframe. Receive encrypted telemetry,
                        project updates, and exclusive access directly to your
                        inbox.{" "}
                      </p>{" "}
                    </FadeText>{" "}
                    <form
                      className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto relative z-20"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      {" "}
                      <input
                        type="email"
                        placeholder="ENTER SECURE EMAIL"
                        className={`flex-1 rounded-2xl px-8 py-5 text-sm font-bold tracking-widest focus:outline-none focus:border-sky-500 focus:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-300 ${theme.inputBg}`}
                      />{" "}
                      <button
                        className={`py-5 px-12 rounded-2xl text-xs font-bold tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 whitespace-nowrap ${theme.btnPrimary}`}
                      >
                        {" "}
                        Initialize Uplink{" "}
                      </button>{" "}
                    </form>{" "}
                    <div className="flex items-center justify-center gap-4 mt-12 relative z-20">
                      {" "}
                      <a
                        href="https://discord.com/invite/bsVNRn6m4j"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-full border ${theme.borderStrong} ${theme.iconBg} flex items-center justify-center ${theme.textMuted} hover:${theme.textBase} hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-500 group/icon`}
                      >
                        {" "}
                        <svg
                          className="w-5 h-5 fill-current transition-transform duration-300 group-hover/icon:scale-110"
                          viewBox="0 0 24 24"
                        >
                          {" "}
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.077 0 0 0 .084-.025c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.077 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.298 12.298 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.76 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />{" "}
                        </svg>{" "}
                      </a>{" "}
                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-full border ${theme.borderStrong} ${theme.iconBg} flex items-center justify-center ${theme.textMuted} hover:${theme.textBase} hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-500 group/icon`}
                      >
                        {" "}
                        <svg
                          className="w-5 h-5 fill-current transition-transform duration-300 group-hover/icon:scale-110"
                          viewBox="0 0 24 24"
                        >
                          {" "}
                          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />{" "}
                        </svg>{" "}
                      </a>{" "}
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-full border ${theme.borderStrong} ${theme.iconBg} flex items-center justify-center ${theme.textMuted} hover:${theme.textBase} hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-500 group/icon`}
                      >
                        {" "}
                        <svg
                          className="w-5 h-5 fill-none stroke-current transition-transform duration-300 group-hover/icon:scale-110"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          {" "}
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="5"
                            ry="5"
                          ></rect>{" "}
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>{" "}
                          <line
                            x1="17.5"
                            y1="6.5"
                            x2="17.51"
                            y2="6.5"
                          ></line>{" "}
                        </svg>{" "}
                      </a>{" "}
                      <a
                        href="https://x.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 rounded-full border ${theme.borderStrong} ${theme.iconBg} flex items-center justify-center ${theme.textMuted} hover:${theme.textBase} hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-500 group/icon`}
                      >
                        {" "}
                        <svg
                          className="w-4 h-4 fill-current transition-transform duration-300 group-hover/icon:scale-110"
                          viewBox="0 0 24 24"
                        >
                          {" "}
                          <path d="M18.244 2.25h3.308l-7.227 7.778 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.335L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />{" "}
                        </svg>{" "}
                      </a>{" "}
                    </div>{" "}
                  </SpatialCard>{" "}
                  <footer
                    className={`w-full pt-16 border-t ${theme.borderBase} transition-colors duration-700`}
                  >
                    {" "}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                      {" "}
                      <div className="col-span-1 md:col-span-2">
                        {" "}
                        <div className="flex items-center gap-3 mb-6">
                          {" "}
                          <img
                            src="/logo.png"
                            alt="RPS Logo"
                            className={`w-5 h-5 object-contain transition-all duration-700 ${isDarkTheme ? "drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]" : "drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]"}`}
                          />{" "}
                          <span className="font-bold tracking-[0.3em] text-sm uppercase">
                            Rascal Pixels Studio
                          </span>{" "}
                        </div>{" "}
                        <p
                          className={`${theme.textMuted} text-sm leading-relaxed max-w-sm mb-8`}
                        >
                          {" "}
                          Architecting reality-shattering digital experiences.
                          Global operational nodes active.{" "}
                        </p>{" "}
                      </div>{" "}
                      <div className="flex flex-col gap-4">
                        {" "}
                        <h4 className="font-bold tracking-widest text-xs uppercase mb-2">
                          Portals
                        </h4>{" "}
                        <a
                          href="#"
                          className={`${theme.textMuted} text-sm hover:text-sky-500 transition-colors`}
                        >
                          Client Terminal
                        </a>{" "}
                        <a
                          href="#"
                          className={`${theme.textMuted} text-sm hover:text-sky-500 transition-colors`}
                        >
                          Developer Docs
                        </a>{" "}
                        <a
                          href="#"
                          className={`${theme.textMuted} text-sm hover:text-sky-500 transition-colors`}
                        >
                          Investor Vault
                        </a>{" "}
                      </div>{" "}
                      <div className="flex flex-col gap-4">
                        {" "}
                        <h4 className="font-bold tracking-widest text-xs uppercase mb-2">
                          Legal
                        </h4>{" "}
                        <a
                          href="#"
                          className={`${theme.textMuted} text-sm hover:${theme.textBase} transition-colors`}
                        >
                          Privacy Policy
                        </a>{" "}
                        <a
                          href="#"
                          className={`${theme.textMuted} text-sm hover:${theme.textBase} transition-colors`}
                        >
                          Terms of Service
                        </a>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div
                      className={`w-full flex flex-col md:flex-row justify-between items-center py-8 border-t ${theme.borderBase} gap-4 transition-colors duration-700`}
                    >
                      {" "}
                      <p
                        className={`${theme.textSubtle} text-[10px] font-bold tracking-widest uppercase`}
                      >
                        &copy; 2026 Rascal Pixels Studio. All Rights Reserved.
                      </p>{" "}
                      <div
                        className={`flex items-center gap-2 ${theme.textSubtle} text-[10px] font-bold tracking-widest uppercase`}
                      >
                        {" "}
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_10px_#38bdf8]" />{" "}
                        System Operational{" "}
                      </div>{" "}
                    </div>{" "}
                  </footer>{" "}
                </div>{" "}
              </section>
            )}{" "}
          </React.Fragment>
        ))}{" "}
        <AnimatePresence>
          {" "}
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              {" "}
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className={`w-full max-w-2xl rounded-3xl border ${theme.borderStrong} ${theme.glassBg} shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden`}
              >
                {" "}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 text-neutral-400 hover:text-white transition-colors z-20 bg-black/40 backdrop-blur-md w-8 h-8 flex items-center justify-center rounded-full border border-white/5"
                >
                  {" "}
                  ✕{" "}
                </button>{" "}
                <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full h-full">
                  {" "}
                  {selectedProject.image ? (
                    <div className="w-full h-40 md:h-48 relative bg-black">
                      {" "}
                      <img
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />{" "}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />{" "}
                    </div>
                  ) : (
                    <div className="w-full h-40 md:h-48 relative bg-gradient-to-br from-neutral-900 to-black">
                      {" "}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {" "}
                        <Cpu className="w-16 h-16 text-white/5" />{" "}
                      </div>{" "}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />{" "}
                    </div>
                  )}{" "}
                  <div className="p-6 md:p-8 -mt-12 relative z-10">
                    {" "}
                    <span
                      className={`px-3 py-1 border border-white/10 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest ${selectedProject.textColor} uppercase inline-block mb-4`}
                    >
                      {" "}
                      {selectedProject.status}{" "}
                    </span>{" "}
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                      {selectedProject.title}
                    </h2>{" "}
                    <p
                      className={`${theme.textMuted} text-sm leading-relaxed mb-8`}
                    >
                      {" "}
                      {selectedProject.description}{" "}
                    </p>{" "}
                    <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-3">
                      Core Architecture
                    </h4>{" "}
                    <div className="flex flex-wrap gap-2">
                      {" "}
                      {selectedProject.features.map((feature: string) => (
                        <span
                          key={feature}
                          className={`px-3 py-1.5 rounded-2xl border ${theme.borderStrong} ${theme.iconBg} text-xs font-bold text-neutral-300`}
                        >
                          {" "}
                          {feature}{" "}
                        </span>
                      ))}{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </motion.div>{" "}
            </motion.div>
          )}{" "}
        </AnimatePresence>{" "}
        <AnimatePresence>
          {" "}
          {isAuthOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              {" "}
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className={`w-full max-w-md rounded-2xl border ${theme.borderStrong} ${theme.glassBg} shadow-2xl relative max-h-[95vh] flex flex-col overflow-hidden`}
              >
                {" "}
                <button
                  onClick={() => setIsAuthOpen(false)}
                  className="absolute top-4 right-4 md:top-5 md:right-5 text-neutral-400 hover:text-white transition-colors z-20 bg-black/40 backdrop-blur-md w-7 h-7 flex items-center justify-center rounded-full border border-white/5"
                >
                  {" "}
                  ✕{" "}
                </button>{" "}
                <div className="p-5 md:p-6 w-full h-full">
                  {" "}
                  <div className="mb-4">
                    {" "}
                    <div className="flex items-center gap-2 mb-2">
                      {" "}
                      <img
                        src="/logo.png"
                        alt="RPS"
                        className="w-5 h-5 md:w-6 md:h-6 object-contain"
                      />{" "}
                      <span className="font-bold tracking-[0.2em] uppercase text-[9px] md:text-[10px]">
                        RPS
                      </span>{" "}
                    </div>{" "}
                    <h2 className="text-xl md:text-2xl font-black tracking-tight">
                      {authMode === "login" ? "Welcome Back" : "Create Account"}
                    </h2>{" "}
                    <p className="text-neutral-400 mt-1 text-xs">
                      {authMode === "login"
                        ? "Authenticate to access your dashboard."
                        : "Join the studio network."}
                    </p>{" "}
                  </div>{" "}
                  {authError && (
                    <div className="mb-4 p-2 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold">
                      {" "}
                      {authError}{" "}
                    </div>
                  )}{" "}
                  <form onSubmit={handleAuth} className="space-y-2" noValidate>
                    {" "}
                    {authMode === "signup" && (
                      <div className="grid grid-cols-2 gap-3">
                        {" "}
                        <div className="space-y-1">
                          {" "}
                          <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-500 ml-1">
                            First Name
                          </label>{" "}
                          <input
                            type="text"
                            value={authFirstName}
                            onChange={(e) => setAuthFirstName(e.target.value)}
                            required
                            className={`w-full px-3 py-2 rounded-2xl border ${theme.borderStrong} ${theme.inputBg} focus:outline-none focus:border-sky-500 transition-colors text-sm`}
                            placeholder="First Name"
                          />{" "}
                        </div>{" "}
                        <div className="space-y-1">
                          {" "}
                          <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-500 ml-1">
                            Last Name
                          </label>{" "}
                          <input
                            type="text"
                            value={authLastName}
                            onChange={(e) => setAuthLastName(e.target.value)}
                            required
                            className={`w-full px-3 py-2 rounded-2xl border ${theme.borderStrong} ${theme.inputBg} focus:outline-none focus:border-sky-500 transition-colors text-sm`}
                            placeholder="Last Name"
                          />{" "}
                        </div>{" "}
                      </div>
                    )}{" "}
                    {authMode === "signup" && (
                      <div className="space-y-1">
                        {" "}
                        <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-500 ml-1">
                          Email
                        </label>{" "}
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          required
                          className={`w-full px-3 py-2 rounded-2xl border ${theme.borderStrong} ${theme.inputBg} focus:outline-none focus:border-sky-500 transition-colors text-sm`}
                          placeholder="your@email.com"
                        />{" "}
                      </div>
                    )}{" "}
                    <div className="space-y-1">
                      {" "}
                      <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-500 ml-1">
                        Username
                      </label>{" "}
                      <input
                        type="text"
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                        required
                        className={`w-full px-3 py-2 rounded-2xl border ${theme.borderStrong} ${theme.inputBg} focus:outline-none focus:border-sky-500 transition-colors text-sm`}
                        placeholder="Enter handle"
                      />{" "}
                    </div>{" "}
                    <div className="space-y-1">
                      {" "}
                      <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-500 ml-1">
                        Passkey
                      </label>{" "}
                      <input
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        required
                        className={`w-full px-3 py-2 rounded-2xl border ${theme.borderStrong} ${theme.inputBg} focus:outline-none focus:border-sky-500 transition-colors text-sm`}
                        placeholder="••••••••"
                      />{" "}
                    </div>{" "}
                    <button
                      type="submit"
                      disabled={authLoading}
                      className={`w-full py-2.5 mt-3 rounded-2xl font-bold tracking-widest uppercase text-[10px] flex justify-center items-center ${authLoading ? "bg-sky-500/50 text-white/50 cursor-not-allowed" : "bg-sky-500 text-white hover:bg-sky-400"} transition-colors`}
                    >
                      {" "}
                      {authLoading
                        ? "Authenticating..."
                        : authMode === "login"
                          ? "Initialize Session"
                          : "Register Profile"}{" "}
                    </button>{" "}
                  </form>{" "}
                  <div className="mt-4">
                    {" "}
                    <div className="relative">
                      {" "}
                      <div className="absolute inset-0 flex items-center">
                        {" "}
                        <div
                          className={`w-full border-t ${theme.borderStrong}`}
                        ></div>{" "}
                      </div>{" "}
                      <div className="relative flex justify-center text-[9px] font-bold tracking-widest uppercase">
                        {" "}
                        <span
                          className={`${theme.glassBg} backdrop-blur-md px-3 py-1 rounded-full ${theme.textSubtle}`}
                        >
                          Or continue with
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {" "}
                      <button
                        type="button"
                        onClick={() => handleOAuth("google")}
                        className={`flex w-full items-center justify-center gap-2 rounded-2xl border ${theme.borderStrong} ${theme.iconBg} px-3 py-2 text-[10px] font-bold ${theme.textBase} ${theme.glassHover} transition-colors`}
                      >
                        {" "}
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                          {" "}
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />{" "}
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />{" "}
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />{" "}
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />{" "}
                          <path d="M1 1h22v22H1z" fill="none" />{" "}
                        </svg>{" "}
                        Google{" "}
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() => handleOAuth("github")}
                        className={`flex w-full items-center justify-center gap-2 rounded-2xl border ${theme.borderStrong} ${theme.iconBg} px-3 py-2 text-[10px] font-bold ${theme.textBase} ${theme.glassHover} transition-colors`}
                      >
                        {" "}
                        <svg
                          className="h-3.5 w-3.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {" "}
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />{" "}
                        </svg>{" "}
                        GitHub{" "}
                      </button>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="mt-4 text-center">
                    {" "}
                    <button
                      onClick={() =>
                        setAuthMode(authMode === "login" ? "signup" : "login")
                      }
                      className={`text-xs font-medium ${theme.textMuted} hover:${theme.textBase} transition-colors`}
                    >
                      {" "}
                      {authMode === "login"
                        ? "Don't have clearance? Request access."
                        : "Already have clearance? Authenticate."}{" "}
                    </button>{" "}
                  </div>{" "}
                </div>{" "}
              </motion.div>{" "}
            </motion.div>
          )}{" "}
        </AnimatePresence>{" "}
      </main>{" "}
    </ThemeContext.Provider>
  );
}
