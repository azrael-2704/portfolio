import React from 'react';
import { motion } from 'framer-motion';
import { useRoadmap } from '../../hooks/usePortfolioData';
import { Map, Clock, CheckCircle2, Target } from 'lucide-react';

import GlitchText from '../GlitchText';

const Roadmap: React.FC = () => {
    const { data: roadmap } = useRoadmap();
    return (
        <section className="min-h-screen pt-[34px] pb-20 px-6 md:px-16 relative z-10 w-full overflow-hidden">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="mb-16 mt-[-10px]"
            >
                <div className="flex items-center gap-3 mb-2">
                    <Map className="text-cyan-400" size={24} />
                    <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white">
                        <GlitchText text="FUTURE_NODES" />
                    </h1>
                </div>
                <p className="text-gray-400 font-mono text-sm border-l-2 border-cyan-500/30 pl-4 py-1 flex items-center gap-2">
                    {'>'} PROJECTED TRAJECTORY AND MILESTONES
                </p>
            </motion.div>

            <div className="max-w-4xl mx-auto relative">
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 to-transparent -translate-x-1/2 md:translate-x-0 border-l border-dashed border-cyan-500/30" />

                <div className="space-y-12">
                     {roadmap.map((item, index) => {
                         const isEven = index % 2 === 0;
                         const StatusIcon = item.status === 'completed' ? CheckCircle2 : item.status === 'in-progress' ? Clock : Target;
                         const statusColor = item.status === 'completed' ? 'text-green-400' : item.status === 'in-progress' ? 'text-amber-400' : 'text-purple-400';
                         
                         return (
                             <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className={`relative flex flex-col md:flex-row gap-8 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}
                             >
                                  {/* Spacer */}
                                  <div className="hidden md:block w-1/2" />
                                  
                                  {/* Center Node */}
                                  <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#050a14] border flex items-center justify-center z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${item.status === 'in-progress' ? 'border-amber-400/50' : item.status === 'planned' ? 'border-purple-400/50' : 'border-cyan-500/50'}`}>
                                     <StatusIcon size={14} className={`${statusColor} ${item.status === 'in-progress' ? 'animate-pulse' : ''}`} />
                                  </div>

                                  {/* Content */}
                                  <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                                      <div className={`p-6 rounded-xl border bg-[#0c121e]/40 backdrop-blur-sm transition-colors group ${item.status === 'in-progress' ? 'border-amber-400/20 bg-amber-900/5' : item.status === 'planned' ? 'border-purple-500/20 hover:bg-purple-900/5' : 'border-white/10 hover:bg-cyan-900/10'}`}>
                                           <div className={`flex flex-col mb-2 ${isEven ? '' : 'md:items-end'}`}>
                                               <span className={`text-xs font-mono mb-1 ${item.status === 'planned' ? 'text-purple-400' : 'text-cyan-400'}`}>{item.date}</span>
                                               <h3 className="text-xl font-bold text-white font-mono">{item.title}</h3>
                                           </div>
                                           <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                           <div className={`mt-4 flex items-center gap-2 text-xs font-mono text-gray-500 ${isEven ? '' : 'md:justify-end'}`}>
                                               <span className={item.status === 'planned' ? 'text-purple-400/80' : ''}>STATUS: {item.status.toUpperCase()}</span>
                                               
                                               {item.status === 'in-progress' && (
                                                   <span className="relative flex h-2 w-2">
                                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                                   </span>
                                               )}
                                               
                                               {item.status === 'planned' && (
                                                    <span className="w-2 h-2 rounded-full border border-purple-500/50" />
                                               )}

                                               {item.status === 'completed' && (
                                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                               )}
                                           </div>
                                      </div>
                                  </div>
                             </motion.div>
                         )
                     })}
                </div>
            </div>
        </section>
    );
};
export default Roadmap;
