import React from 'react';
import { motion } from 'framer-motion';
import { usePhilosophy } from '../../hooks/usePortfolioData';
import { Lightbulb, Users, GitMerge, Scale, Box } from 'lucide-react';

import GlitchText from '../GlitchText';

const Philosophy: React.FC = () => {
  const icons = [Lightbulb, Users, GitMerge, Scale]; 
  const { data: philosophy } = usePhilosophy();

  return (
    <section className="min-h-screen pt-[34px] pb-20 px-6 md:px-16 relative z-10 w-full overflow-hidden">
       {/* Header */}
       <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="mb-16 mt-[-10px]"
       >
             <div className="flex items-center gap-3 mb-2">
                 <Box className="text-cyan-400" size={24} />
                 <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white">
                    <GlitchText text="CORE_AXIOMS" />
                 </h1>
             </div>
             <p className="text-gray-400 font-mono text-sm border-l-2 border-cyan-500/30 pl-4 py-1">{'>'} OPERATING PRINCIPLES AND VALUES</p>
       </motion.div>

       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {philosophy.map((item:any, index:number) => {
             const Icon = icons[index % icons.length];
             return (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: index * 0.1 }}
                 className="group relative p-8 rounded-xl border border-white/10 bg-[#0c121e]/50 backdrop-blur-sm hover:border-cyan-500/50 transition-colors overflow-hidden"
               >
                 <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity transform translate-x-12 -translate-y-12">
                    <Icon size={200} />
                 </div>
                 
                 <div className="relative z-10">
                    <div className="mb-6 inline-block p-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                        <Icon size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-mono mb-4 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed max-w-md">
                        {item.desc}
                    </p>
                 </div>
               </motion.div>
             )
          })}
       </div>
    </section>
  );
};
export default Philosophy;
