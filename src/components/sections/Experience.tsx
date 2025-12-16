import React from 'react';
import { motion } from 'framer-motion';
import { useTimeline } from '../../hooks/usePortfolioData';
import { Briefcase, GraduationCap, Award, Trophy } from 'lucide-react';

import GlitchText from '../GlitchText';

const Experience: React.FC = () => {
    const { data: timeline } = useTimeline();

    const getDurationHeight = (dateVal: string) => {
        try {
            const currentYear = new Date().getFullYear();
            let start = currentYear;
            let end = currentYear;

            if (dateVal.includes('-')) {
                const parts = dateVal.split('-').map(s => s.trim());
                // Parse Start
                const startMatch = parts[0].match(/\d{4}/);
                start = startMatch ? parseInt(startMatch[0]) : currentYear;
                
                // Parse End
                if (parts[1].toLowerCase() === 'present') {
                    end = currentYear;
                } else {
                    const endMatch = parts[1].match(/\d{4}/);
                    end = endMatch ? parseInt(endMatch[0]) : start;
                }
            } else {
                return 120; // Default min height
            }

            const diff = Math.max(1, end - start + 1); 
            return Math.min(diff * 80 + 100, 400); 
        } catch (e) {
            return 120;
        }
    };

    return (
        <section className="min-h-screen pt-[34px] pb-20 px-6 md:px-16 relative z-10 w-full overflow-hidden">
            
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-16 mt-[-10px]"
            >
                <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="text-cyan-400" size={24} />
                    <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white">
                        <GlitchText text="EXPERIENCE_LOG" />
                    </h1>
                </div>
                <p className="text-gray-400 font-mono text-sm border-l-2 border-cyan-500/30 pl-4 py-1">
                    {'>'} CHRONOLOGICAL DATA STREAM
                </p>
            </motion.div>

            {/* Timeline Container */}
            <div className="max-w-7xl mx-auto relative">
                
                {/* Central Neural Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent -translate-x-1/2 md:translate-x-0" />

                <div className="space-y-8">
                    {timeline.map((item: any) => {
                        // Priority: Manual Side > Type Logic
                        // Default if no side: Range types -> Right, Others -> Left
                        const isRange = item.type === 'work' || item.type === 'education';
                        let isRight = isRange; // Default
                        
                        if ((item as any).side) {
                             isRight = (item as any).side === 'right';
                        }
                        
                        // Theme Logic
                        const THEME = {
                             work: { color: 'cyan', icon: Briefcase, border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
                             education: { color: 'purple', icon: GraduationCap, border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
                             certification: { color: 'green', icon: Award, border: 'border-green-500/30', bg: 'bg-green-500/10' },
                             achievement: { color: 'amber', icon: Trophy, border: 'border-amber-500/30', bg: 'bg-amber-500/10' }
                        };
                        const theme = THEME[item.type as keyof typeof THEME] || THEME.work;
                        
                        // Dynamic Height only if it's a range item AND on the right (timeline aesthetic)
                        // OR we just apply it everywhere if isRange is true, regardless of side.
                        const cardHeight = isRange ? getDurationHeight(item.date) : 'auto';

                        return (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, x: isRight ? 20 : -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className={`relative flex flex-col md:flex-row gap-8 ${isRight ? '' : 'md:flex-row-reverse'}`}
                            >
                                {/* Spacer for Opposing Side */}
                                <div className="hidden md:block w-1/2" />

                                {/* Node Center */}
                                <div className={`absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#050a14] border-2 z-10 mt-6 shadow-[0_0_10px_currentColor] transition-colors ${theme.color === 'cyan' ? 'text-cyan-400' : theme.color === 'purple' ? 'text-purple-400' : theme.color === 'green' ? 'text-green-400' : 'text-amber-400'} border-current`}>
                                     <div className={`w-2 h-2 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-current opacity-80`} />
                                </div>

                                {/* Content Card */}
                                <div className={`w-full md:w-1/2 pl-12 md:pl-0 pr-0 ${isRight ? 'md:pl-8' : 'md:pr-8'}`}>
                                    <div 
                                        className={`
                                            relative group p-6 rounded-xl border ${theme.border} ${theme.bg} backdrop-blur-sm
                                            hover:bg-opacity-20 transition-all duration-300 flex flex-col
                                        `}
                                        style={{ minHeight: cardHeight }}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                             <div className="flex flex-col">
                                                 <span className={`text-xs font-mono mb-1 opacity-70 ${theme.color === 'cyan' ? 'text-cyan-300' : 'text-gray-400'}`}>{item.date}</span>
                                                 <h3 className="text-xl font-bold text-white font-mono leading-tight">{item.title}</h3>
                                             </div>
                                            <theme.icon className={`${theme.color === 'cyan' ? 'text-cyan-400' : theme.color === 'purple' ? 'text-purple-400' : theme.color === 'green' ? 'text-green-400' : 'text-amber-400'}`} size={20} />
                                        </div>
                                        
                                        <div className={`text-sm font-mono mb-3 opacity-90 ${theme.color === 'cyan' ? 'text-cyan-200' : 'text-gray-300'}`}>
                                            {item.org}
                                        </div>
                                        
                                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                            {item.desc}
                                        </p>

                                        {/* Type Tag - Pushed to bottom */}
                                        <div className="mt-auto pt-2 flex justify-end">
                                             <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded border border-white/10 opacity-50`}>
                                                {item.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Experience;
