/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Download, 
  Share2, 
  Headphones, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronUp,
  Star,
  Zap,
  Layout,
  Globe,
  Info
} from 'lucide-react';

// --- Components ---

const NebulaBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    let time = 0;
    let mouse = { x: 0.5, y: 0.5 };
    let targetMouse = { x: 0.5, y: 0.5 };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / W;
      targetMouse.y = e.clientY / H;
    };

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const blobs = [
      { x: 0.15, y: 0.3, r: 0.45, color: [124, 58, 237], speed: 0.0003, phase: 0 },
      { x: 0.75, y: 0.6, r: 0.4, color: [8, 145, 178], speed: 0.0004, phase: 2 },
      { x: 0.5, y: 0.8, r: 0.35, color: [190, 24, 93], speed: 0.0002, phase: 4 },
      { x: 0.3, y: 0.7, r: 0.3, color: [212, 168, 67], speed: 0.0005, phase: 1 },
      { x: 0.8, y: 0.2, r: 0.35, color: [30, 64, 175], speed: 0.00035, phase: 3 },
    ];

    const animate = () => {
      mouse.x += (targetMouse.x - mouse.x) * 0.04;
      mouse.y += (targetMouse.y - mouse.y) * 0.04;
      time++;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#020010';
      ctx.fillRect(0, 0, W, H);

      const mx = (mouse.x - 0.5) * 80;
      const my = (mouse.y - 0.5) * 60;

      blobs.forEach(b => {
        const ox = Math.sin(time * b.speed * 1000 + b.phase) * 80;
        const oy = Math.cos(time * b.speed * 800 + b.phase) * 60;
        const bx = (b.x * W) + ox + mx * 0.4;
        const by = (b.y * H) + oy + my * 0.3;
        const br = b.r * Math.max(W, H);

        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, 0.1)`);
        g.addColorStop(0.5, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, 0.03)`);
        g.addColorStop(1, 'transparent');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(bx, by, br * 1.2, br * 0.8, time * 0.0001 + b.phase, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" />;
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(!window.matchMedia('(pointer: fine)').matches);
    
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  if (isTouch || !isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-amber-400 rounded-full z-[9999] pointer-events-none mix-blend-screen shadow-[0_0_20px_rgba(251,191,36,0.8)]"
        animate={{
          x: position.x - 6,
          y: position.y - 6,
          scale: isPointer ? 2 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 250, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-amber-400/30 rounded-full z-[9998] pointer-events-none"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 150, mass: 0.8 }}
      />
    </>
  );
};

const Toast = ({ message, visible }: { message: string; visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        className="fixed bottom-8 left-8 bg-slate-900/95 backdrop-blur-xl border border-amber-500/40 rounded-xl px-6 py-4 flex items-center gap-3 text-amber-200 font-mono text-xs z-[1000] shadow-2xl"
      >
        <Download size={16} className="animate-bounce" />
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

const FeatureItem = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <motion.div 
    whileHover={{ x: 5, backgroundColor: 'rgba(251, 191, 36, 0.05)', borderColor: 'rgba(251, 191, 36, 0.2)' }}
    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-slate-300 transition-colors"
  >
    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
      <Icon size={12} />
    </div>
    {text}
  </motion.div>
);

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <motion.div 
    whileHover={{ y: -5, borderColor: 'rgba(251, 191, 36, 0.3)' }}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden group"
  >
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
    <span className="block text-3xl font-bold bg-gradient-to-br from-amber-200 to-amber-500 bg-clip-text text-fill-transparent font-serif mb-1 group-hover:scale-110 transition-transform">
      {number}
    </span>
    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">
      {label}
    </span>
  </motion.div>
);

const ChapterItem = ({ num, text }: { num: string; text: string }) => (
  <motion.div 
    whileHover={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', borderColor: 'rgba(124, 58, 237, 0.3)', x: 5 }}
    className="flex items-start gap-4 p-4 bg-white/2 border border-white/5 rounded-xl transition-all cursor-default"
  >
    <span className="font-mono text-[10px] text-amber-500/60 pt-1">{num}</span>
    <span className="text-sm leading-relaxed text-slate-300">{text}</span>
  </motion.div>
);

const TestimonialCard = ({ name, role, text }: { name: string; role: string; text: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl relative"
  >
    <div className="text-amber-500/20 absolute top-4 right-8 text-6xl font-serif">"</div>
    <p className="text-slate-400 italic mb-6 relative z-10 leading-relaxed">"{text}"</p>
    <div>
      <h4 className="text-amber-400 font-bold text-sm tracking-wide">{name}</h4>
      <p className="text-slate-600 text-[10px] uppercase tracking-widest mt-1">{role}</p>
    </div>
  </motion.div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-slate-200 group-hover:text-amber-400 transition-colors font-medium">{question}</span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-amber-500"
        >
          <ChevronUp size={20} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-400 text-sm leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kerala History – UPSC Study Material',
          text: 'Free PDF: Kerala History – European Arrival & Portuguese Era by Akash Sankar',
          url: window.location.href
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      triggerToast('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#020010] text-slate-200 font-serif selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      <NebulaBackground />
      <CustomCursor />
      
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-amber-500 origin-left z-[1001]"
        style={{ scaleX }}
      />

      <Toast visible={toast.visible} message={toast.message} />

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center shadow-lg z-50 hover:scale-110 active:scale-95 transition-transform"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-24 pb-12 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-md text-[10px] font-mono tracking-[0.3em] text-amber-500 uppercase mb-8"
          >
            ✦ UPSC Study Material · Free Access
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black mb-4 tracking-tight leading-none bg-gradient-to-b from-amber-100 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.2)]"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Kerala History
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl italic text-amber-500/70 mb-6 font-light tracking-wide"
          >
            European Arrival & Portuguese Era
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 text-[11px] font-mono tracking-[0.4em] text-slate-500 uppercase"
          >
            <span>by Akash Sankar</span>
            <span className="text-amber-500/30">✦</span>
            <span>Part 1 — Continuation Series</span>
          </motion.div>

          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 flex items-center justify-center gap-6"
          >
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-amber-500/50" />
            <Star size={16} className="text-amber-500 animate-pulse" />
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-amber-500/50" />
          </motion.div>
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-24">
          <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.5em] text-slate-600 font-mono">
              ∙ Digital Collection · Premium Resources ∙
            </p>
          </div>

          {/* Main Product Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-16 grid md:grid-cols-[300px_1fr] gap-12 items-center shadow-2xl overflow-hidden group"
          >
            <div className="absolute top-6 right-6 bg-green-600 text-white text-[10px] font-mono tracking-widest uppercase px-4 py-1.5 rounded-full border border-white/20 shadow-lg shadow-green-900/20 z-20">
              ✓ Free
            </div>

            {/* Book Cover */}
            <div className="relative flex justify-center">
              <div className="absolute inset-[-20px] bg-amber-500/10 blur-[60px] rounded-full animate-pulse z-0" />
              <motion.div
                whileHover={{ rotateY: 0, scale: 1.05 }}
                className="relative z-10 w-56 aspect-[3/4] bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center gap-6 p-8 text-center perspective-1000 rotate-y-[-10deg] transition-all duration-500"
              >
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <BookOpen size={40} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="text-amber-500 font-serif text-lg leading-tight mb-2" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                    Kerala History
                  </h3>
                  <p className="text-[9px] font-mono text-amber-500/50 tracking-[0.3em] uppercase">Part 1</p>
                </div>
                <div className="absolute bottom-4 right-4 text-[8px] font-mono text-slate-700">© 2024</div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-mono uppercase tracking-widest mb-6">
                <Zap size={10} /> PDF Study Guide
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                Kerala History – Part 1
              </h2>
              <p className="text-xl italic text-amber-500/60 mb-8">European Arrival & Portuguese Era</p>
              
              <p className="text-slate-400 leading-relaxed mb-10 text-lg font-light">
                A comprehensive UPSC-ready quick revision guide covering the complete story of European arrival in Kerala — from the Fall of Constantinople to the Portuguese colonial administration. Visual infographics, exam-ready boxes, and timeline summaries.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-12">
                <FeatureItem icon={MapPin} text="Important places with maps" />
                <FeatureItem icon={Zap} text="Quick revision boxes" />
                <FeatureItem icon={Clock} text="Complete timeline" />
                <FeatureItem icon={Layout} text="UPSC exam ready" />
                <FeatureItem icon={Globe} text="Sea route diagrams" />
                <FeatureItem icon={BookOpen} text="Visual infographics" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="/KERALA-HISTORY-PART1.pdf"
                  download="KERALA-HISTORY-PART1.pdf"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => triggerToast('PDF download starting...')}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(217,119,6,0.3)] group no-underline"
                >
                  <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                  <span className="font-mono text-xs tracking-widest uppercase">Download PDF — Free</span>
                </motion.a>
                
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="px-8 py-5 rounded-2xl border border-white/10 bg-white/5 text-amber-500 flex items-center justify-center gap-3 transition-colors"
                >
                  <Share2 size={20} />
                  <span className="font-mono text-xs tracking-widest uppercase">Share</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12">
            <StatCard number="08" label="Chapters" />
            <StatCard number="100%" label="Free Access" />
            <StatCard number="1498" label="Era Covered" />
            <StatCard number="UPSC" label="Exam Ready" />
          </div>

          {/* Chapters Preview */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-10 mb-20 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-amber-500/50 transparent" />
            
            <h3 className="text-xl text-amber-200/80 mb-8 flex items-center gap-3" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              <Info size={18} className="text-amber-500" />
              ✦ What's Inside
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <ChapterItem num="01" text="Background to European Arrival — Fall of Constantinople & Cape Route" />
              <ChapterItem num="02" text="Arrival of Europeans in Kerala — Order of European Powers" />
              <ChapterItem num="03" text="Portuguese–Zamorin Interactions — Calicut vs Cochin Phase" />
              <ChapterItem num="04" text="Portuguese Administration — Almeida & Albuquerque" />
              <ChapterItem num="05" text="Vasco da Gama — Final Voyage and Death" />
              <ChapterItem num="06" text="Key Terms & Policies — Blue Water Policy & Cartaz System" />
              <ChapterItem num="07" text="Important Places Map — Calicut, Cochin, Goa, Cape of Good Hope" />
              <ChapterItem num="08" text="Quick Revision Timeline — Exam-ready summaries" />
            </div>
          </motion.section>

          {/* Audio Section Divider */}
          <div className="flex items-center gap-8 mb-20">
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-pink-500/30" />
            <span className="text-[10px] font-mono tracking-[0.5em] text-slate-600 uppercase">∙ Narrated Edition ∙</span>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-cyan-500/30" />
          </div>

          {/* Audio Section */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-cyan-950/20 via-violet-950/20 to-pink-950/20 backdrop-blur-3xl border border-cyan-500/20 rounded-[2.5rem] p-8 md:p-16 overflow-hidden group mb-24"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 via-violet-400/50 to-transparent" />
            
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col items-center gap-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-48 h-48 rounded-full bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-pink-500/20 border border-cyan-500/30 flex items-center justify-center relative group cursor-pointer"
                >
                  <div className="absolute inset-[-4px] rounded-full border border-cyan-400/40 animate-[spin_10s_linear_infinite]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 30%)' }} />
                  <Headphones size={64} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform" />
                </motion.div>
                
                <div className="flex items-end gap-1.5 h-12">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                      transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: 'easeInOut' }}
                      className="w-1 bg-gradient-to-t from-cyan-500 to-violet-500 rounded-full"
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-6">
                  <Headphones size={10} /> Audio Book
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                  Kerala History – Part 1
                </h3>
                <p className="text-lg italic text-cyan-400/60 mb-6 font-light">Narrated Edition · UPSC Revision</p>
                
                <p className="text-slate-400 leading-relaxed mb-8 font-light">
                  Study on the go. The complete Part 1 narrated clearly with chapter-by-chapter audio. Perfect for revision during commute, workouts, or relaxed listening.
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] font-mono text-violet-400 uppercase tracking-wider">♪ MP3 Format</span>
                  <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] font-mono text-violet-400 uppercase tracking-wider">⏱ Full Length</span>
                  <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] font-mono text-violet-400 uppercase tracking-wider">🆓 Free</span>
                </div>

                <motion.a
                  href="/KERALA-HISTORY-PART1-AUDIO.mp3"
                  download="KERALA-HISTORY-PART1-AUDIO.mp3"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => triggerToast('Audio book download starting...')}
                  className="w-full bg-gradient-to-r from-cyan-600 via-violet-600 to-pink-600 text-white font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-cyan-900/20 group no-underline"
                >
                  <Download size={20} className="group-hover:translate-y-1 transition-transform" />
                  <span className="font-mono text-xs tracking-widest uppercase">Download Audio Book</span>
                </motion.a>
              </div>
            </div>
          </motion.section>

          {/* Testimonials */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-amber-200/80" style={{ fontFamily: "'Cinzel Decorative', serif" }}>Aspirant Feedback</h3>
              <p className="text-slate-500 text-sm mt-2">Join thousands of successful students</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <TestimonialCard 
                name="Rahul M." 
                role="UPSC 2023 Aspirant" 
                text="The visual timelines in Part 1 are a lifesaver. I finally understood the Portuguese administration hierarchy clearly." 
              />
              <TestimonialCard 
                name="Sneha K." 
                role="KPSC Rank Holder" 
                text="The audio book is perfect for my daily commute. It's like having a personal tutor narrating the history of Kerala." 
              />
              <TestimonialCard 
                name="Anjali S." 
                role="History Faculty" 
                text="Highly recommended for anyone looking for a concise yet comprehensive guide to European arrival in Kerala." 
              />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-3xl mx-auto mb-24">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-amber-200/80" style={{ fontFamily: "'Cinzel Decorative', serif" }}>Common Queries</h3>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8">
              <FAQItem 
                question="Is this material enough for UPSC Prelims?" 
                answer="Yes, Part 1 covers all major factual points required for Prelims regarding the Portuguese era. However, we recommend supplementary reading for Mains perspective." 
              />
              <FAQItem 
                question="When will Part 2 be released?" 
                answer="Part 2 (The Dutch & French Era) is currently in production and will be released next month. Stay tuned to our newsletter!" 
              />
              <FAQItem 
                question="Can I use this for KPSC exams?" 
                answer="Absolutely. The material is tailored to meet the requirements of both UPSC and Kerala PSC examinations." 
              />
            </div>
          </section>

          {/* Newsletter */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-[2rem] p-12 text-center relative overflow-hidden mb-24"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1)_0%,transparent_70%)]" />
            <h3 className="text-2xl font-bold text-amber-400 mb-4 relative z-10" style={{ fontFamily: "'Cinzel Decorative', serif" }}>Stay Updated</h3>
            <p className="text-slate-400 mb-8 relative z-10 max-w-md mx-auto">Get notified when Part 2 and other premium study materials are released.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-500 text-slate-950 font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-widest"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.section>

          {/* Related Resources */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-amber-200/80" style={{ fontFamily: "'Cinzel Decorative', serif" }}>Related Resources</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Ancient Kerala', type: 'Article', icon: BookOpen },
                { title: 'Medieval Trade', type: 'PDF', icon: Download },
                { title: 'Modern Kerala', type: 'Video', icon: Headphones },
              ].map((res, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <res.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium group-hover:text-amber-400 transition-colors">{res.title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{res.type}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-20 px-6 border-t border-white/5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-500/5 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[10px] font-mono tracking-[0.4em] text-slate-600 uppercase mb-4">
              Kerala History · UPSC Study Material · Part 1
            </p>
            <p className="text-sm italic text-amber-500/30 font-light mb-8">
              Smart Revision · Clear Concepts · UPSC Ready
            </p>
            <div className="flex justify-center gap-8 mb-12">
              <a href="mailto:support@keralahistory.edu" className="text-[10px] font-mono text-slate-500 hover:text-amber-500 transition-colors uppercase tracking-widest">Contact Support</a>
              <a href="#" className="text-[10px] font-mono text-slate-500 hover:text-amber-500 transition-colors uppercase tracking-widest">Privacy Policy</a>
            </div>
            <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
              <div className="h-[1px] w-12 bg-slate-700" />
              <span className="text-[10px] font-mono">2024</span>
              <div className="h-[1px] w-12 bg-slate-700" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
