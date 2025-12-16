import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { useProfile } from '../../hooks/usePortfolioData';
import GlitchText from '../GlitchText';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const { profile } = useProfile();

  React.useEffect(() => {
    document.title = "Amartya | Portfolio";
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center relative z-20">
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full max-w-7xl px-4">
        
        {/* Left: Huge Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: -50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex-shrink-0"
        >
          <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full"></div>
          <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-72 h-72 md:w-[450px] md:h-[450px] object-cover rounded-full relative z-10"
              style={{ maskImage: 'radial-gradient(circle, black 40%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)' }} 
          />
        </motion.div>

        {/* Right: Info & Name */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left z-20">
            
            {/* Introduction Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-6 border border-cyan-500/30 px-4 py-1.5 rounded-full bg-cyan-900/10 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="font-mono text-cyan-400 tracking-wider text-sm">SYSTEM_READY</span>
            </motion.div>

            {/* Main Heading - Split Lines */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center md:items-start leading-none mb-6"
            >
              <h1 className="text-6xl md:text-8xl font-black font-mono tracking-tighter text-white mb-2 md:mb-4">
                <GlitchText text="AMARTYA" />
              </h1>
              <h1 className="text-6xl md:text-8xl font-black font-mono tracking-tighter text-white">
                <GlitchText text="ANAYACHALA" />
              </h1>
            </motion.div>

             {/* Dynamic Titles */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-400 font-mono mb-8 h-8 flex items-center gap-3"
            >
                <span className="text-gray-500">&lt;</span>
                <span className="text-gray-200">{profile.title}</span>
                <span className="text-gray-500">/&gt;</span>
            </motion.div>

             {/* Bio */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-xl text-gray-400 leading-relaxed mb-10 text-lg"
            >
                {profile.bio}
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-6 items-center"
            >
                <button 
                onClick={onStart}
                className="group relative px-8 py-4 bg-black text-white border border-white hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto"
                >
                <span className="flex items-center gap-2 font-mono font-bold">
                    INITIATE_PROJECT <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                </button>

                <div className="flex gap-6 pointer-events-auto">
                <a href={profile.social.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                    <Github size={28} />
                </a>
                <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                    <Linkedin size={28} />
                </a>
                <a href={profile.social.email} className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                    <Mail size={28} />
                </a>
                </div>
            </motion.div>

        </div>
      </div>

    </section>
  );
};

export default Hero;
