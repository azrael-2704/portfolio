import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, User, Mail, Folder, Cpu, Briefcase, Map, BookOpen, Award, FileText, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Configuration
  const STATIC_LINKS = [
    { path: '/', label: 'HOME', icon: Home },
    { path: '/about', label: 'ABOUT', icon: User },
    { path: '/contact', label: 'CONTACT', icon: Mail },
  ];

  const GROUP_TECHNICAL = [
    { path: '/experience', label: 'EXPERIENCE', icon: Briefcase },
    { path: '/projects', label: 'PROJECTS', icon: Folder },
    { path: '/skills', label: 'SKILLS', icon: Cpu },
    { path: '/roadmap', label: 'ROADMAP', icon: Map },
  ];

  const GROUP_PROFESSIONAL = [
    { path: '/philosophy', label: 'PHILOSOPHY', icon: BookOpen },
    { path: '/achievements', label: 'ACHIEVEMENTS', icon: Award },
    { path: '/blog', label: 'WRITINGS', icon: FileText },
    { path: '/resume', label: 'RESUME', icon: FileText },
  ];

  // Determine active group & Context
  // "Home-like" Navbar (Dropdowns) is used for Home, About, and Contact
  const showDropdowns = location.pathname === '/' || location.pathname === '/about' || location.pathname === '/contact';
  
  const isGroupTechnical = GROUP_TECHNICAL.some(link => link.path === location.pathname);
  const isGroupProfessional = GROUP_PROFESSIONAL.some(link => link.path === location.pathname);
  
  const activeContextLinks = isGroupTechnical ? GROUP_TECHNICAL : isGroupProfessional ? GROUP_PROFESSIONAL : [];

  // Dynamic Title Update
  useEffect(() => {
    const allLinks = [...STATIC_LINKS, ...GROUP_TECHNICAL, ...GROUP_PROFESSIONAL];
    const currentLink = allLinks.find(l => l.path === location.pathname);
    if (currentLink) {
        document.title = `Amartya | ${currentLink.label}`;
    } else {
        document.title = "Amartya Anayachala | Portfolio";
    }
  }, [location.pathname]);

  return (
    <>
    <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-3 flex justify-between items-center border-b border-white/10 bg-[#050a14]/90 backdrop-blur-md pointer-events-auto">
      {/* Brand / Logo - Forces Full Reload to Reset System State */}
      <a href="/" className="flex items-center gap-3 group relative z-50">
        <motion.img 
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            src="/logo.png" 
            alt="Logo" 
            className="w-10 h-10 object-cover drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all rounded-full" 
            style={{ maskImage: 'radial-gradient(circle, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)' }} 
        />
        <div className="flex flex-col">
            <span className="font-mono text-lg font-bold tracking-tighter text-white leading-none group-hover:text-cyan-400 transition-colors">
            AMARTYA<span className="text-cyan-400 animate-pulse">_</span>DEV
            </span>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest hidden md:block">I Build Things That Think</span>
        </div>
      </a>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-6">
        
        {/* Static Links */}
        {STATIC_LINKS.map(link => {
            if (link.path === '/' && location.pathname === '/') return null; // Hide Home if on Home
            return (
                <Link 
                    key={link.path} 
                    to={link.path}
                    className={`nav-link text-sm font-mono flex items-center gap-2 transition-colors ${location.pathname === link.path ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
                >
                    <link.icon size={14} />
                    {link.label}
                </Link>
            )
        })}

        <div className="h-4 w-px bg-white/10 mx-2" />

        {/* MODE: MAIN PAGES -> DROPDOWNS */}
        {showDropdowns && (
            <>
                {/* Technical Dropdown */}
                <div className="relative group/dropdown" onMouseEnter={() => setActiveDropdown('technical')} onMouseLeave={() => setActiveDropdown(null)}>
                    <button className={`nav-link text-sm font-mono flex items-center gap-2 transition-colors ${activeDropdown === 'technical' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
                        TECHNICAL <ChevronDown size={14} />
                    </button>
                    <AnimatePresence>
                    {activeDropdown === 'technical' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute top-full right-0 mt-4 w-56 bg-[#050a14] border border-white/10 rounded-lg p-2 shadow-xl backdrop-blur-xl"
                        >
                            <div className="px-3 py-2 text-xs font-mono text-gray-500 border-b border-white/5 mb-1">TECHNICAL_MATRIX</div>
                            {GROUP_TECHNICAL.map(link => (
                                <Link 
                                    key={link.path} 
                                    to={link.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-mono transition-colors ${location.pathname === link.path ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-400 hover:bg-white/5 hover:text-cyan-400'}`}
                                >
                                    <link.icon size={14} /> {link.label}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>

                {/* Professional Dropdown */}
                <div className="relative group/dropdown" onMouseEnter={() => setActiveDropdown('professional')} onMouseLeave={() => setActiveDropdown(null)}>
                    <button className={`nav-link text-sm font-mono flex items-center gap-2 transition-colors ${activeDropdown === 'professional' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
                        PROFESSIONAL <ChevronDown size={14} />
                    </button>
                    <AnimatePresence>
                    {activeDropdown === 'professional' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute top-full right-0 mt-4 w-56 bg-[#050a14] border border-white/10 rounded-lg p-2 shadow-xl backdrop-blur-xl"
                        >
                            <div className="px-3 py-2 text-xs font-mono text-gray-500 border-b border-white/5 mb-1">DATA_LOGS</div>
                            {GROUP_PROFESSIONAL.map(link => (
                                <Link 
                                    key={link.path} 
                                    to={link.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-mono transition-colors ${location.pathname === link.path ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-400 hover:bg-white/5 hover:text-cyan-400'}`}
                                >
                                    <link.icon size={14} /> {link.label}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
            </>
        )}

        {/* MODE: SUBPAGES -> FLAT CONTEXT LINKS */}
        {!showDropdowns && activeContextLinks.length > 0 && (
             <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {activeContextLinks.map(link => (
                    <Link 
                        key={link.path} 
                        to={link.path}
                        className={`nav-link text-sm font-mono flex items-center gap-2 transition-colors ${location.pathname === link.path ? 'text-cyan-400 font-bold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        {/* No Chevron here to keep it clean, or allow it for active */}
                        {link.label}
                    </Link>
                ))}
            </div>
        )}

      </div>

      {/* Mobile Menu Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors z-50"
      >
        {isOpen ? <X /> : <Menu />}
      </button>
    </nav>

    {/* Mobile Overlay Menu */}
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="fixed inset-0 z-40 bg-[#050a14] pt-24 px-6 flex flex-col gap-8 overflow-y-auto"
            >
                {/* Static Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">Main Navigation</h3>
                    {STATIC_LINKS.map(link => (
                        <Link 
                            key={link.path} 
                            to={link.path} 
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-4 text-lg font-mono p-2 rounded ${location.pathname === link.path ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-300'}`}
                        >
                            <link.icon size={20} /> {link.label}
                        </Link>
                    ))}
                </div>

                {/* Group Technical */}
                <div className="space-y-4">
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">Technical Core</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {GROUP_TECHNICAL.map(link => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-2 text-sm font-mono p-2 rounded transition-colors ${location.pathname === link.path ? 'text-cyan-400 bg-cyan-900/10' : 'text-gray-400 bg-white/5'}`}
                            >
                                <link.icon size={16} /> {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Group Professional */}
                <div className="space-y-4">
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">Professional Data</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {GROUP_PROFESSIONAL.map(link => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-2 text-sm font-mono p-2 rounded transition-colors ${location.pathname === link.path ? 'text-cyan-400 bg-cyan-900/10' : 'text-gray-400 bg-white/5'}`}
                            >
                                <link.icon size={16} /> {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
    </>
  );
};

export default React.memo(Navbar);
