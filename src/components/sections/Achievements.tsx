import React from 'react';
import { motion } from 'framer-motion';
import { useTimeline } from '../../hooks/usePortfolioData';
import { Trophy, Award, Medal } from 'lucide-react';

import GlitchText from '../GlitchText';

const Achievements: React.FC = () => {
    const { data: timeline } = useTimeline();
    const achievements = timeline.filter((item: any) => item.type === 'achievement' || item.type === 'certification');

    return (
        <section className="pt-[34px] pb-20 px-6 md:px-16 relative z-10 w-full overflow-hidden">
             <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="mb-16 mt-[-10px]"
             >
                <div className="flex items-center gap-3 mb-2">
                    <Trophy className="text-cyan-400" size={24} />
                    <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white">
                        <GlitchText text="HONORS_AND_AWARDS" />
                    </h1>
                </div>
                <p className="text-gray-400 font-mono text-sm border-l-2 border-cyan-500/30 pl-4 py-1">{'>'} RECOGNITION AND CERTIFICATIONS</p>
             </motion.div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-[#0c121e]/50 border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity transform translate-x-4 -translate-y-4">
                             <Award size={100} />
                         </div>

                         <div className="relative z-10 flex flex-col h-full">
                             <div className="flex justify-between items-start mb-4">
                                 <span className="text-xs font-mono text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded">
                                     {item.date}
                                 </span>
                                 {item.type === 'achievement' ? <Trophy size={20} className="text-amber-400" /> : <Medal size={20} className="text-purple-400" />}
                             </div>

                             <h3 className="text-lg font-bold text-white font-mono mb-2 group-hover:text-cyan-300 transition-colors">
                                 {item.title}
                             </h3>
                             <div className="text-sm text-gray-400 font-mono mb-4">{item.org}</div>
                             
                             <p className="text-gray-500 text-sm leading-relaxed flex-grow whitespace-pre-wrap">
                                 {item.desc}
                             </p>
                         </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
export default Achievements;
