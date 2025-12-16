import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal } from 'lucide-react'
import './index.css'
import MainLayout from './layouts/MainLayout'
import NeuralBackground from './components/canvas/NeuralBackground'
import Hero from './components/sections/Hero'
import TerminalIntro from './components/sections/TerminalIntro'
import About from './components/sections/About'
import NeuralNavigation from './components/canvas/NeuralNavigation'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Experience from './components/sections/Experience'
import Contact from './components/sections/Contact'
import Philosophy from './components/sections/Philosophy'
import Roadmap from './components/sections/Roadmap'
import Achievements from './components/sections/Achievements'
import Blog from './components/sections/Blog'
import Resume from './components/sections/Resume'
import AdminModal from './components/admin/AdminModal'

const AppContent = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  // If we load on a subpage, skip the Landing sequence but run the Boot sequence
  const [systemState, setSystemState] = useState<'LANDING' | 'BOOTING' | 'ONLINE'>(
    isHome ? 'LANDING' : 'BOOTING'
  );
  const [isResizing, setIsResizing] = useState(false);
  const [adminSection, setAdminSection] = useState<string | null>(null);

  const handleAdminMode = (section: string) => {
    setAdminSection(section);
  };
  
  const [mobileTerminalOpen, setMobileTerminalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resize for responsive logic
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const handleInitiate = () => {
    setSystemState('BOOTING');
  };

  const handleBootComplete = () => {
    setSystemState('ONLINE');
  };

  return (
    <>
      {/* 
         GLOBAL LAYOUT MANAGEMENT 
         Layer 1: Background (Bottom)
         Layer 2: Terminal Overlay (Left/Center)
         Layer 3: Neural Nav (Home)
         Layer 4: Content (Right)
      */}

      {systemState !== 'LANDING' && (
        <div className="fixed inset-0 z-0 pointer-events-none">
           {/* Global Background */}
           <NeuralBackground />
        </div>
      )}

      {/* Layer 2: Persistent Terminal Sidebar */}
      {/* 
          - Visible during BOOTING (Centered)
          - Visible during ONLINE (Sidebar or Centered if Home)
          - Hidden during LANDING
      */}
      {systemState !== 'LANDING' && (
          <motion.div 
            layout
            initial={false}
            animate={{ 
              // Desktop (lg): 40% (Home) / 25% (Subpage) | Mobile: 100% (Booting) -> 0% (Online)
              width: ((systemState as string) === 'BOOTING' || (systemState as string) === 'LANDING') 
                ? '100%' 
                : (windowWidth >= 1024 
                    ? (isHome ? '40%' : '25%') 
                    : (mobileTerminalOpen ? '100%' : '0%')),
              left: (systemState === 'ONLINE' && windowWidth >= 1024) 
                ? (isHome ? 'calc(12.5% - 150px)' : '0') 
                : '0',
              top: (systemState === 'ONLINE' && windowWidth >= 1024) ? '88px' : '0', // Mobile full screen
              opacity: (systemState === 'ONLINE' && windowWidth < 1024 && !mobileTerminalOpen) ? 0 : 1,
              height: (systemState === 'ONLINE' && windowWidth < 1024 && mobileTerminalOpen) ? '100%' : 'auto', // Full height on mobile open
              bottom: (systemState === 'ONLINE' && windowWidth < 1024 && mobileTerminalOpen) ? '0' : '10px' // Stretch
            }}
            transition={{ 
              type: "spring", 
              stiffness: 120, 
              damping: 20,
              mass: 1
            }} 
            onAnimationStart={() => setIsResizing(true)}
            onAnimationComplete={() => setIsResizing(false)}
            style={{ willChange: "width, left, top", pointerEvents: systemState === 'ONLINE' && windowWidth < 1024 && !mobileTerminalOpen ? 'none' : 'auto' }}
            className={`fixed z-40 flex items-start justify-center pointer-events-none transform-gpu ${
              (systemState as string) === 'BOOTING'
                ? (windowWidth < 1024 ? 'p-[5px]' : 'p-4')
                : (mobileTerminalOpen && windowWidth < 1024 
                    ? 'pt-[70px] px-[5px] pb-[5px] bg-[#050a14]/95 backdrop-blur-xl' 
                    : 'p-0 md:p-4 md:py-0')
            }`}
          >
              <div className="w-full h-full max-w-3xl pointer-events-auto relative">
                  <TerminalIntro 
                    onComplete={handleBootComplete} 
                    onAdminMode={handleAdminMode}
                    onMinimize={windowWidth < 1024 && systemState === 'ONLINE' ? () => setMobileTerminalOpen(false) : undefined}
                    instant={systemState === 'ONLINE'} 
                    isResizing={isResizing} 
                  />
              </div>
          </motion.div>
      )}

      {/* Layer 3: Neural Navigation (Home Only) */}
      <AnimatePresence>
        {systemState === 'ONLINE' && isHome && (
           <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10 pointer-events-none"
           >
              <NeuralNavigation interactable={true} />
           </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 4: Main Content Area (Right Side) */}
      {/* HIDDEN during BOOTING to allow clean terminal sequence */}
      <AnimatePresence mode="wait">
        {systemState !== 'BOOTING' && (
            <Routes location={location} key={location.pathname}>
               {/* Landing Page Route */}
               <Route path="/" element={
                   systemState === 'LANDING' ? (
                      <MainLayout showNavbar={false}>
                         <Hero onStart={handleInitiate} />
                      </MainLayout>
                   ) : (
                      <MainLayout showNavbar={true} className="bg-transparent pointer-events-none">
                         <div /> {/* Home content handled by NeuralNav */}
                      </MainLayout>
                   )
               } />

               {/* Subpages */}
               <Route path="/about" element={<MainLayout showNavbar={true}><About /></MainLayout>} />
               <Route path="/skills" element={<MainLayout showNavbar={true}><Skills /></MainLayout>} />
               <Route path="/philosophy" element={<MainLayout showNavbar={true}><Philosophy /></MainLayout>} />
               <Route path="/resume" element={<MainLayout showNavbar={true}><Resume /></MainLayout>} />
               <Route path="/roadmap" element={<MainLayout showNavbar={true}><Roadmap /></MainLayout>} />
               <Route path="/projects" element={<MainLayout showNavbar={true}><Projects /></MainLayout>} />
               <Route path="/achievements" element={<MainLayout showNavbar={true}><Achievements /></MainLayout>} />
               <Route path="/experience" element={<MainLayout showNavbar={true}><Experience /></MainLayout>} />
               <Route path="/blog" element={<MainLayout showNavbar={true}><Blog /></MainLayout>} />
               <Route path="/contact" element={<MainLayout showNavbar={true}><Contact /></MainLayout>} />
            </Routes>
        )}
      </AnimatePresence>

      {/* Layer 5: Admin Modal Overlay */}
      <AnimatePresence>
        {adminSection && (
            <AdminModal 
                section={adminSection} 
                onClose={() => setAdminSection(null)} 
            />
        )}
      </AnimatePresence>
      
      {/* Mobile Terminal Toggle FAB */}
      {systemState === 'ONLINE' && !mobileTerminalOpen && (
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
            <button 
                onClick={() => setMobileTerminalOpen(true)}
                className="p-4 bg-cyan-500/10 border border-cyan-400 rounded-full text-cyan-400 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-bounce hover:bg-cyan-500/20 active:scale-95 transition-all"
            >
                <Terminal size={24} />
            </button>
        </div>
      )}

      <style>{`
        /* Dynamic Layout Adjustment for Main Content - Desktop Only */
        @media (min-width: 1024px) {
          ${systemState === 'ONLINE' && !isHome ? `
            main { 
              margin-left: 25vw !important; 
              width: 75vw !important; 
              max-width: none !important;
            }
          ` : ''}
        }
      `}</style>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App
