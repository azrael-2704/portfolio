import React from 'react';
import { motion } from 'framer-motion';
import { useBlogPosts } from '../../hooks/usePortfolioData';
import { BookOpen, ArrowUpRight, Linkedin } from 'lucide-react';

import GlitchText from '../GlitchText';

const Blog: React.FC = () => {
    const { data: blogs } = useBlogPosts();
    return (
        <section className="pt-[34px] pb-20 px-6 md:px-16 relative z-10 w-full overflow-hidden">
             <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="mb-16 mt-[-10px]"
             >
                <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="text-cyan-400" size={24} />
                    <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white">
                        <GlitchText text="DATA_LOGS" />
                    </h1>
                </div>
                <p className="text-gray-400 font-mono text-sm border-l-2 border-cyan-500/30 pl-4 py-1">{'>'} LINKEDIN ACTIVITY STREAM</p>
             </motion.div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                 {blogs.map((post:any, index:number) => (
                     <motion.a 
                        key={post.id}
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative p-6 md:p-8 rounded-xl border border-white/10 bg-[#0c121e]/40 backdrop-blur-sm hover:border-[#0077b5]/50 hover:bg-[#0077b5]/5 transition-all cursor-pointer block"
                     >
                        <div className="absolute top-6 right-6 text-gray-500 group-hover:text-[#0077b5] transition-colors">
                            <Linkedin size={24} />
                        </div>

                        <div className="space-y-4">
                             <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
                                 <span>{post.date}</span>
                             </div>
                             
                             <h2 className="text-xl font-bold text-white font-mono group-hover:text-[#0077b5] transition-colors pr-8">
                                 {post.title}
                             </h2>
                             
                             <p className="text-gray-400 leading-relaxed text-sm line-clamp-3">
                                 {post.desc}
                             </p>
                             
                             <div className="flex flex-wrap items-center gap-2 pt-2">
                                 {post.tags.map((tag: string) => (
                                     <span key={tag} className="text-xs text-[#0077b5] bg-[#0077b5]/10 px-2 py-1 rounded border border-[#0077b5]/20">
                                         #{tag}
                                     </span>
                                 ))}
                             </div>
                             
                             <div className="pt-4 flex items-center gap-2 text-xs font-mono text-gray-500 group-hover:text-white transition-colors border-t border-white/5 mt-4">
                                 <span>READ_ON_LINKEDIN</span>
                                 <ArrowUpRight size={14} />
                             </div>
                        </div>
                     </motion.a>
                 ))}
            </div>
        </section>
    );
};
export default Blog;
