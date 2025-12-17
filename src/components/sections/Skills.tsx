import React from 'react';
import { motion } from 'framer-motion';
import { useSkills, useSkillCategories } from '../../hooks/usePortfolioData';
import { Cpu, Terminal, Cloud, Code2, BarChart3, Database, Globe, Lock, Server, Zap, Heart } from 'lucide-react';
import GlitchText from '../GlitchText';

// Helper to map color names to Tailwind classes
// Supports the 10-color palette defined in SkillForm
const getColorConfig = (colorName: string) => {
    // Default fallback
    const defaults = { 
        text: 'text-cyan-400', 
        border: 'border-cyan-500/30', 
        bg: 'bg-cyan-900/10', 
        bar: 'bg-cyan-400', 
        glow: 'bg-cyan-500',
        icon: Cpu 
    };

    const map: Record<string, any> = {
        cyan:   { ...defaults },
        sky:    { text: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-900/10', bar: 'bg-sky-400', glow: 'bg-sky-500', icon: Cloud }, // Keeping sky just in case
        teal:   { text: 'text-teal-400', border: 'border-teal-500/30', bg: 'bg-teal-900/10', bar: 'bg-teal-400', glow: 'bg-teal-500', icon: Database },
        blue:   { text: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-900/10', bar: 'bg-blue-400', glow: 'bg-blue-500', icon: Server },
        rose:   { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-900/10', bar: 'bg-rose-400', glow: 'bg-rose-500', icon: Heart },
        indigo: { text: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-900/10', bar: 'bg-indigo-400', glow: 'bg-indigo-500', icon: Code2 },
        purple: { text: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-900/10', bar: 'bg-purple-400', glow: 'bg-purple-500', icon: Terminal },
        pink:   { text: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-900/10', bar: 'bg-pink-400', glow: 'bg-pink-500', icon: Code2 },
        red:    { text: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-900/10', bar: 'bg-red-400', glow: 'bg-red-500', icon: Lock },
        orange: { text: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-900/10', bar: 'bg-orange-400', glow: 'bg-orange-500', icon: Zap },
        amber:  { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-900/10', bar: 'bg-amber-400', glow: 'bg-amber-500', icon: Terminal },
        green:  { text: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-900/10', bar: 'bg-green-400', glow: 'bg-green-500', icon: globeOrBarSub(true)  },
    };
    
    return map[colorName] || defaults;
};

// Helper for icon diversity
const globeOrBarSub = (isGreen: boolean) => isGreen ? Globe : BarChart3;


const SkillCard = ({ skill, index, theme }: { skill: any, index: number, theme: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 + 0.2 }}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }}
      className={`relative group p-4 rounded-xl border ${theme.border} bg-[#0a0f1c]/80 backdrop-blur-sm overflow-hidden flex flex-col gap-3 transition-colors duration-300 h-full`}
      style={{ willChange: 'transform' }} 
    >
        {/* Glow Effect */}
        <div className={`absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl ${theme.glow}`} />

        {/* Header */}
        <div className="flex justify-between items-start z-10">
            <h3 className={`font-mono font-bold text-lg ${theme.text} tracking-tight`}>{skill.name}</h3>
            <span className="text-xs text-gray-500 font-mono">{skill.version}</span>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed z-10 flex-1">{skill.desc}</p>

        {/* Progress Bar */}
        <div className="mt-auto z-10 pt-2 flex items-center gap-3">
            <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                className={`h-full ${theme.bar} shadow-[0_0_10px_currentColor]`}
                />
            </div>
            <span className={`text-xs font-mono font-bold ${theme.text}`}>{skill.level}%</span>
        </div>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  const { data: skills } = useSkills();
  const { data: categories } = useSkillCategories();

  // If categories are loading or empty, we might see nothing, which is technically correct (waiting for data)
  // or we could show a loader. For now, we render what we have.

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
            {categories.map((cat: any, catIndex: number) => {
                // Filter skills for this category
                const categorySkills = skills.filter((s:any) => s.category === cat.id);
                
                // If no skills in this category, do NOT render it (user asked for deletions to reflect)
                // Actually, if a category exists but has no skills, it is arguably deleted or just empty.
                // But usually we hide empty categories.
                if (categorySkills.length === 0) return null;

                const theme = getColorConfig(cat.color || 'cyan');
                const Icon = theme.icon;

                return (
                    <motion.div 
                        key={cat.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: catIndex * 0.1 }}
                    >
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-2">
                            <Icon className={`${theme.text}`} size={20} />
                            <h2 className="font-mono text-xl tracking-widest text-gray-300 uppercase">
                                {cat.label}
                            </h2>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categorySkills.map((skill: any, index: number) => (
                                <SkillCard key={skill.id} skill={skill} index={index} theme={theme} />
                            ))}
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Skills;
