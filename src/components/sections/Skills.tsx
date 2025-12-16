import React from 'react';
import { motion } from 'framer-motion';
import { useSkills } from '../../hooks/usePortfolioData';
import { Cpu, Terminal, Cloud, Code2, BarChart3 } from 'lucide-react';

// Domain 10-Color Cycle Config
const PALETTES = [
  { label: 'CYAN_NEURAL', icon: Cpu, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-900/10', bar: 'bg-cyan-400', glow: 'bg-cyan-500' },
  { label: 'INDIGO_DATA', icon: BarChart3, color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-900/10', bar: 'bg-indigo-400', glow: 'bg-indigo-500' },
  { label: 'PURPLE_SYS', icon: Code2, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-900/10', bar: 'bg-purple-400', glow: 'bg-purple-500' },
  { label: 'GREEN_OPS', icon: Cloud, color: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-900/10', bar: 'bg-green-400', glow: 'bg-green-500' },
  { label: 'AMBER_CORE', icon: Terminal, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-900/10', bar: 'bg-amber-400', glow: 'bg-amber-500' },
  { label: 'RED_SEC', icon: Terminal, color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-900/10', bar: 'bg-red-400', glow: 'bg-red-500' },
  { label: 'PINK_UI', icon: Code2, color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-900/10', bar: 'bg-pink-400', glow: 'bg-pink-500' },
  { label: 'BLUE_NET', icon: Cloud, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-900/10', bar: 'bg-blue-400', glow: 'bg-blue-500' },
  { label: 'TEAL_DB', icon: BarChart3, color: 'text-teal-400', border: 'border-teal-500/30', bg: 'bg-teal-900/10', bar: 'bg-teal-400', glow: 'bg-teal-500' },
  { label: 'ORANGE_API', icon: Cpu, color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-900/10', bar: 'bg-orange-400', glow: 'bg-orange-500' }
];

const getDomainConfig = (category: string, index: number) => {
    // Standard mapping for core types to keep them consistent if desired, 
    // OR just use the cycle for everything to ensure the 10-color requirement is met strictly.
    // User asked "specify colours for upto 10 categories, then just loop". This implies order matters.
    
    const palette = PALETTES[index % PALETTES.length];
    return { ...palette, label: category.toUpperCase().replace('-', ' ') };
};

const SkillCard = ({ skill, index, categoryIndex }: { skill: any, index: number, categoryIndex: number }) => {
  const domain = getDomainConfig(skill.category, categoryIndex);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 + 0.2 }}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }}
      className={`relative group p-4 rounded-xl border ${domain.border} bg-[#0a0f1c]/80 backdrop-blur-sm overflow-hidden flex flex-col gap-2 transition-colors duration-300`}
      style={{ willChange: 'transform' }} // Optimization
    >
        {/* Glow Effect */}
        <div className={`absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl ${domain.glow}`} />

        {/* Header */}
        <div className="flex justify-between items-start z-10">
            <h3 className={`font-mono font-bold text-lg ${domain.color} tracking-tight`}>{skill.name}</h3>
            <span className="text-xs text-gray-500 font-mono">v{skill.version}</span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed z-10 h-10">{skill.desc}</p>

        {/* Progress Bar (Signal Strength) */}
        <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden z-10">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${skill.level}%` }}
               transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
               className={`h-full ${domain.bar} shadow-[0_0_10px_currentColor]`}
            />
        </div>
    </motion.div>
  );
};

import GlitchText from '../GlitchText';

const Skills: React.FC = () => {
  const { data: skills } = useSkills();

  // Dynamically derive categories and sort (default ones first)
  const defaultOrder = ['ml', 'ds', 'dev', 'ops', 'core'];
  const categories = Array.from(new Set(skills.map((s:any) => s.category || 'other'))).sort((a: any, b: any) => {
        const idxA = defaultOrder.indexOf(a);
        const idxB = defaultOrder.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
  });

  return (
    <div className="pt-[34px] pb-20 px-6 md:px-16 min-h-screen w-full relative z-10 overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12 mt-[-10px]"
      >
        <div className="flex items-center gap-3 mb-2">
            <Cpu className="text-cyan-400" size={24} />
            <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white">
                <GlitchText text="TECHNICAL_MATRIX" />
            </h1>
        </div>
        <p className="text-gray-400 font-mono text-sm border-l-2 border-cyan-500/30 pl-4 py-1">
              {'>'} SYSTEM DIAGNOSTICS: COMPETENCY MAP<br/>
              {'>'} LOADING ACTIVE NEURAL MODULES...
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">

      <div className="grid grid-cols-1 gap-12">
        {categories.map((cat, catIndex) => {
           const category = cat as string;
           const categorySkills = skills.filter((s:any) => (s.category || 'other') === category);
           if (categorySkills.length === 0) return null;
           
           const domain = getDomainConfig(category, catIndex);
           
           return (
             <motion.div 
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: catIndex * 0.2 }}
             >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-2">
                    <domain.icon className={`${domain.color}`} size={20} />
                    <h2 className="font-mono text-xl tracking-widest text-gray-300">{domain.label}</h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill: any, index: number) => (
                        <SkillCard key={skill.id} skill={skill} index={index} categoryIndex={catIndex} />
                    ))}
                </div>
             </motion.div>
           )
        })}
      </div>
     </div>
    </div>
  );
};

export default Skills;
