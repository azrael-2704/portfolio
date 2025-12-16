import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
            initial={{ width: '100%', left: 0, top: '10px' }}
            animate={{ 
              width: systemState === 'ONLINE' ? (isHome ? '40%' : '25%') : '100%',
              left: systemState === 'ONLINE' ? (isHome ? 'calc(12.5% - 150px)' : '0') : '0',
              top: systemState === 'ONLINE' ? '88px' : '10px',
            }}
            transition={{ duration: 0.35, ease: "circOut" }} 
            onAnimationStart={() => setIsResizing(true)}
            onAnimationComplete={() => setIsResizing(false)}
            style={{ willChange: "width, left, top" }}
            className={`fixed bottom-[10px] z-40 flex items-start justify-center p-4 md:px-4 md:py-0 pointer-events-none transform-gpu`}
          >
              <div className="w-full h-full max-w-3xl pointer-events-auto">
                  <TerminalIntro 
                    onComplete={handleBootComplete} 
                    onAdminMode={handleAdminMode}
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

      <style>{`
        /* Dynamic Layout Adjustment for Main Content */
        ${systemState === 'ONLINE' && !isHome ? `
          main { 
            margin-left: 25vw !important; 
            width: 75vw !important; 
            max-width: none !important;
          }
        ` : ''}
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
