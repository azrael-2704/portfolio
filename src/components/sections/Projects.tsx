import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../../hooks/usePortfolioData';
import { Github, ExternalLink, Database, X, ChevronRight, Layers } from 'lucide-react';

const ProjectCard = ({ project, index, onClick }: { project: any, index: number, onClick: () => void }) => {
  return (
    <motion.div
        layoutId={`project-card-${project.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        onClick={onClick}
        className="group relative rounded-xl overflow-hidden border border-white/10 bg-[#0a0f1c] cursor-pointer h-full flex flex-col hover:border-cyan-500/50 transition-colors"
    >
        {/* Background Image */}
        <div className="relative h-56 overflow-hidden">
            <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/20 to-transparent" />
        </div>

        {/* Content Preview */}
        <div className="relative z-10 p-6 flex-grow flex flex-col">
             <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                 <div className="flex gap-2">
                     <span className={`
                        px-2 py-1 text-[10px] font-mono tracking-widest uppercase border rounded backdrop-blur-md
                        ${project.type === 'research' ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10' : 
                          project.type === 'product' ? 'border-green-500 text-green-400 bg-green-500/10' : 
                          'border-purple-500 text-purple-400 bg-purple-500/10'}
                     `}>
                        {project.type}
                     </span>
                     {project.domain && (
                         <span className="px-2 py-1 text-[10px] font-mono tracking-widest uppercase border border-gray-600 rounded backdrop-blur-md text-gray-300 bg-gray-800/50 flex items-center gap-1">
                            <Layers size={10} /> {project.domain}
                         </span>
                     )}
                 </div>
                 
                 {/* Links on Card */}
                 <div className="flex gap-2">
                    {project.github && (
                        <a 
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <Github size={16} />
                        </a>
                    )}
                    {project.link && (
                        <a 
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            <ExternalLink size={16} />
                        </a>
                    )}
                 </div>
            </div>

            <h3 className="font-mono font-bold text-white text-xl mb-2 group-hover:text-cyan-400 transition-colors">
                {project.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                {project.desc}
            </p>
            
            <div className="mt-auto flex items-center gap-2 text-xs font-mono text-gray-500 group-hover:text-cyan-400/80 transition-colors">
                <span>VIEW_DETAILS</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }: { project: any, onClose: () => void }) => {
    if (!project) return null;

    return (
        <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div 
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            />
            
            <motion.div 
                layoutId={`project-card-${project.id}`}
                className="relative bg-[#0c121e] border border-cyan-500/30 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-red-500/20 hover:text-red-400 transition-all"
                >
                    <X size={20} />
                </button>

                {/* Hero Image */}
                <div className="relative h-72">
                    <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c121e] via-transparent to-transparent" />
                </div>

                {/* Modal Content */}
                <div className="p-8 md:p-10">
                    <div className="mb-8">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                             <span className={`
                                px-2 py-1 text-xs font-mono uppercase bg-white/5 bg-opacity-10 rounded text-cyan-400 border border-cyan-500/30
                             `}>
                                {project.type}
                             </span>
                             {project.domain && (
                                 <span className="px-2 py-1 text-xs font-mono uppercase border border-gray-600 rounded text-gray-300 bg-gray-800/50 flex items-center gap-1">
                                    <Layers size={12} /> {project.domain}
                                 </span>
                             )}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-6">
                            {project.title}
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {project.desc}
                        </p>
                    </div>

                    {/* Detailed Insights */}
                    {project.details && (
                        <div className="mb-8 bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-6">
                            <h3 className="text-sm font-mono text-cyan-400 mb-4 uppercase tracking-wider">Technical Deep Dive</h3>
                            <ul className="space-y-3">
                                {project.details.map((detail: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Tech & Links */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-white/10 pt-[34px]">
                        <div className="flex flex-wrap gap-2">
                            {project.tech.map((t: string) => (
                                <span key={t} className="px-3 py-1 text-xs font-mono text-cyan-300 bg-cyan-900/20 rounded-full border border-cyan-500/20">
                                    {t}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            {project.github && (
                                <a 
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-mono border border-white/10 hover:border-white/30 px-4 py-2 rounded-lg"
                                >
                                    <Github size={18} /> SOURCE
                                </a>
                            )}
                            {project.link && (
                                <a 
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer" 
                                    className="flex items-center gap-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm font-mono border border-cyan-500/30 px-4 py-2 rounded-lg"
                                >
                                    <ExternalLink size={18} /> DEMO
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

import GlitchText from '../GlitchText';

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { data: projects } = useProjects();

  return (
    <div className="pt-[34px] pb-20 px-6 md:px-16 min-h-screen w-full relative">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 mt-[-10px]"
        >
            <div className="flex items-center gap-3 mb-2">
                <Database className="text-cyan-400" size={24} />
                <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white">
                    <GlitchText text="PROJECT_ARCHIVE" />
                </h1>
            </div>
            <p className="text-gray-400 max-w-2xl font-mono text-sm border-l-2 border-cyan-500/30 pl-4 py-1">
                {'>'} ACCESSING ENCRYPTED PROJECT DB...
            </p>
        </motion.div>

        {/* Uniform Grid (2 cols on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto pb-10">
            {projects.map((project, index) => (
                <ProjectCard 
                    key={project.id} 
                    project={project} 
                    index={index} 
                    onClick={() => setSelectedProject(project)}
                />
            ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
            {selectedProject && (
                <ProjectModal 
                    project={selectedProject} 
                    onClose={() => setSelectedProject(null)} 
                />
            )}
        </AnimatePresence>
    </div>
  );
};

export default Projects;
