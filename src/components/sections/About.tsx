import React from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '../../hooks/usePortfolioData';
import { Terminal, Cpu, ChevronRight, Github, Linkedin, Mail } from 'lucide-react';
import GlitchText from '../GlitchText';

const ProfileHologram = ({ profile }: { profile: any }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative w-full max-w-md mx-auto aspect-square group"
        >
             {/* Frame */}
             <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-lg z-20 group-hover:border-cyan-400/60 transition-colors duration-500" />
             
             {/* Corner Accents */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 z-30" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 z-30" />

             {/* Image Container */}
             <div className="absolute inset-2 bg-[#0c121e] rounded overflow-hidden z-10">
                 <img 
                    src={profile.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"}
                    alt="Profile"
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 opacity-80 hover:opacity-100 group-hover:scale-105"
                 />
                 {/* Scanline Overlay */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_4px,3px_100%] pointer-events-none" />
             </div>

             {/* Floating Info */}
             <div className="absolute -bottom-6 -right-6 bg-[#050a14]/90 backdrop-blur-md border border-cyan-500/30 p-4 rounded z-40 shadow-xl">
                 <h3 className="text-xl font-bold text-white font-mono tracking-tighter">
                     <GlitchText text={profile.name} />
                 </h3>
                 <div className="text-xs text-cyan-400 font-mono mt-1">
                     STATUS: <span className="text-green-400 animate-pulse">ONLINE</span>
                 </div>
             </div>
        </motion.div>
    );
};

const BioTerminal = ({ profile }: { profile: any }) => {
    return (
        <div className="space-y-6 font-mono">
            {/* Header */}
            <div className="flex items-center gap-2 text-cyan-500/50 text-sm mb-4">
                <Terminal size={16} />
                <span>/usr/bin/identity_log.txt</span>
            </div>

            <p className="text-gray-300 leading-relaxed text-lg border-l-2 border-cyan-500/20 pl-6 relative">
                 <span className="absolute left-0 top-0 -ml-[2px] w-[2px] h-8 bg-cyan-400" /> {/* Accent */}
                 {profile.about}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
                {profile.titles.map((title: string) => (
                    <div key={title} className="flex items-center gap-2 text-sm text-gray-400">
                        <ChevronRight className="text-cyan-500" size={14} />
                        {title}
                    </div>
                ))}
            </div>

            {/* Social Links */}
             <div className="flex gap-4 pt-4 border-t border-white/10 mt-6">
                <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:scale-110 transition-all"><Github size={20} /></a>
                <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 hover:scale-110 transition-all"><Linkedin size={20} /></a>
                <button onClick={() => window.location.href = profile.social.email.startsWith('mailto:') ? profile.social.email : `mailto:${profile.social.email}`} className="text-gray-400 hover:text-cyan-400 hover:scale-110 transition-all focus:outline-none"><Mail size={20} /></button>
            </div>
        </div>
    );
};

const StatMatrix = ({ profile }: { profile: any }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {profile.stats.map((stat: any, index: number) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#0c121e]/50 border border-white/5 p-4 rounded hover:border-cyan-500/30 transition-colors group"
                >
                    <h4 className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors font-mono">{stat.value}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-mono">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    );
};

const About: React.FC = () => {
  const { profile } = useProfile();

  return (
    <section id="about" className="min-h-screen pt-[34px] pb-20 px-6 md:px-16 relative z-10 w-full overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />

      {/* Section Header */}
      <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-16 mt-[-10px]"
      >
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="text-cyan-400" size={24} />
            <h2 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white">
                <GlitchText text="IDENTITY_MODULE" />
            </h2>
          </div>
          <p className="text-gray-500 font-mono text-sm border-l-2 border-cyan-500/30 pl-4 py-1">
              {'>'} DECRYPTING USER PROFILE... <span className="animate-pulse">_</span>
          </p>
      </motion.div>

      <div className="max-w-7xl mx-auto w-full">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Hologram (Left/Top) */}
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
                <ProfileHologram profile={profile} />
            </div>

            {/* Data Log (Right/Bottom) */}
            <div className="lg:col-span-8">
                <BioTerminal profile={profile} />
                <StatMatrix profile={profile} />
            </div>

        </div>
      </div>
    </section>
  );
};

export default About;
