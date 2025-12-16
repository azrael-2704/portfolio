import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Briefcase, Cpu, Code, BookOpen, Award, 
  FileText, Lightbulb, Map as MapIcon, Mail 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Configuration ---

interface NodeData {
  id: string;
  label: string;
  x: number; // % of Window Width (Right Half Focused)
  y: number; // % of Window Height
  route: string;
  icon: React.FC<any>;
}

// Right-Aligned Constellation Layout (x ranges ~ 55% to 95%)
const NODES: NodeData[] = [
  // CENTER ANCHOR (Right Quadrant)
  { id: 'about', label: 'About Me', x: 75, y: 50, route: '/about', icon: User },

  // INNER RING
  { id: 'skills', label: 'Skills', x: 65, y: 40, route: '/skills', icon: Cpu },
  { id: 'philosophy', label: 'Philosophy', x: 85, y: 40, route: '/philosophy', icon: Lightbulb }, // Mirrored from Skills (65,40) -> (85,40)
  { id: 'resume', label: 'Resume', x: 85, y: 60, route: '/resume', icon: FileText }, // Mirrored from Roadmap (65,60) -> (85,60)
  { id: 'roadmap', label: 'Roadmap', x: 65, y: 60, route: '/roadmap', icon: MapIcon },

  // OUTER RING
  { id: 'projects', label: 'Projects', x: 60, y: 25, route: '/projects', icon: Code },
  { id: 'achievements', label: 'Achievements', x: 90, y: 25, route: '/achievements', icon: Award }, // Mirrored from Projects (60,25) -> (90,25)
  { id: 'experience', label: 'Experience', x: 55, y: 50, route: '/experience', icon: Briefcase },
  { id: 'blog', label: 'Writings', x: 95, y: 50, route: '/blog', icon: BookOpen }, // Mirrored from Experience (55,50) -> (95,50)
  { id: 'contact', label: 'Contact', x: 75, y: 80, route: '/contact', icon: Mail },
];

interface NeuralNavigationProps {
    interactable?: boolean;
}

import GlitchText from '../GlitchText';

const NeuralNavigation: React.FC<NeuralNavigationProps> = ({ interactable = true }) => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  
  // Ref to track hovered node without triggering re-renders in the canvas loop
  const hoveredNodeIdRef = useRef<string | null>(null);

  useEffect(() => {
    hoveredNodeIdRef.current = hoveredNodeId;
  }, [hoveredNodeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    let animId: number;
    let time = 0;

    const render = () => {
      // Use getBoundingClientRect for precise sub-pixel dimensions matching layout
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || window.innerWidth;
      const height = rect?.height || window.innerHeight;
      
      time += 0.005;
      
      ctx.clearRect(0, 0, width, height);
      
      const currentHoverId = hoveredNodeIdRef.current;

      // --- Static Neural Connections (Constellation) ---
      
      ctx.save();
      ctx.lineCap = 'round';
      
      NODES.forEach((source, i) => {
          const sx = (source.x / 100) * width - 50;
          const sy = (source.y / 100) * height + 15;

          NODES.forEach((target, j) => {
              if (i >= j) return;
              const tx = (target.x / 100) * width - 50;
              const ty = (target.y / 100) * height + 15;
              const dist = Math.hypot(sx - tx, sy - ty);
              
              const threshold = Math.min(width, height) * 0.35;

              if (dist < threshold) {
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(tx, ty);
                
                // Highlight Logic
                const isConnected = interactable && currentHoverId && (source.id === currentHoverId || target.id === currentHoverId);
                
                if (isConnected) {
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = 'rgba(34, 211, 238, 1)';
                    ctx.strokeStyle = '#22d3ee';
                    ctx.lineWidth = 2.5;
                    ctx.globalAlpha = 1;
                } else {
                    ctx.shadowBlur = 0;
                    // Increased visibility: Base opacity 0.3, pulsing slightly
                    ctx.strokeStyle = `rgba(34, 211, 238, ${0.3 + Math.sin(time * 2 + i) * 0.1})`;
                    ctx.lineWidth = 0.8; // Slightly thicker
                    ctx.globalAlpha = 1;
                }

                ctx.stroke();
                ctx.globalAlpha = 1;
              }
          });
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [interactable]); 

  const handleNodeEnter = (id: string) => {
    setHoveredNodeId(id);
  };

  const handleNodeLeave = () => {
    setHoveredNodeId(null);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden font-sans">
      
      {/* Canvas Layer (Background) */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* React Nodes Layer (Only visible if interactable) */}
      <AnimatePresence>
      {interactable && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-50 pointer-events-none" 
        >
             {/* Header - Centered on Right Half */}
            <div 
                className="absolute top-[88px] right-[25%] text-center pointer-events-auto z-50 w-[600px]"
                style={{ transform: 'translateX(calc(50% - 50px))' }}
            >
                <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tighter text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                    <GlitchText text="NEURAL_NAVIGATION" />
                </h1>
            </div>

             {/* Nodes - Pointer Events Auto */}
             {NODES.map((node) => {
               const isHovered = hoveredNodeId === node.id;
               
               return (
                 <motion.div
                   key={node.id}
                   className="absolute cursor-pointer group pointer-events-auto"
                   style={{ left: `calc(${node.x}% - 50px)`, top: `calc(${node.y}% + 15px)` }}
                   initial={{ x: "-50%", y: "-50%", scale: 0 }}
                   animate={{ x: "-50%", y: "-50%", scale: 1 }}
                   whileHover={{ scale: 1.1 }}
                   transition={{ type: "spring", stiffness: 260, damping: 20 }}
                   onClick={() => navigate(node.route)}
                   onMouseEnter={() => handleNodeEnter(node.id)}
                   onMouseLeave={handleNodeLeave}
                 >
                   {/* Icon Container */}
                   <div className={`
                     relative flex items-center justify-center rounded-full transition-all duration-500 ease-out z-10
                     ${isHovered 
                        ? 'w-20 h-20 bg-cyan-500/10 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.4)]' 
                        : 'w-14 h-14 bg-[#0f172a]/80 border-cyan-500/30 hover:border-cyan-500/50 shadow-[0_0_15px_rgba(0,0,0,0.5)]'}
                     border backdrop-blur-xl
                   `}>
                     <node.icon 
                       size={isHovered ? 36 : 22} 
                       className={`transition-colors duration-300 ${isHovered ? 'text-cyan-50' : 'text-cyan-400/80 group-hover:text-cyan-400'}`} 
                     />
    
                     {isHovered && (
                        <div className="absolute -inset-1 rounded-full border border-cyan-400/20 animate-pulse" />
                     )}
                   </div>
    
                   {/* Label - Absolute Positioning with Background for Legibility */}
                   <div className={`
                     absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-20
                     bg-[#050a14]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-500/30
                     font-mono tracking-wider text-xs uppercase
                     shadow-[0_0_10px_rgba(0,0,0,0.8)]
                     transition-all duration-300
                     ${isHovered ? 'text-cyan-200 font-bold scale-110 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-cyan-400/90 font-semibold'}
                   `}>
                     {node.label}
                   </div>
    
                   {/* Invisible Anchor for glow center */}
                   <div className="absolute inset-0 z-0 bg-transparent rounded-full" />
                 </motion.div>
               );
             })}

        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default NeuralNavigation;
