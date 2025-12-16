import React, { ReactNode } from 'react';
import NeuralBackground from '../components/canvas/NeuralBackground';
import Navbar from '../components/layout/Navbar';

interface MainLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  className?: string; // Allow custom styling
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showNavbar = true, className = "bg-[#050a14]" }) => {
  return (
    <div className={`min-h-screen text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-100 ${className}`}>
      {/* Global Background */}
      <NeuralBackground />

      {/* Global Navigation - Conditionally Rendered */}
      {showNavbar && <Navbar />}

      {/* Page Content */}
      <main className={`relative z-10 ${showNavbar ? 'pt-16' : ''} px-6 max-w-7xl mx-auto`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
