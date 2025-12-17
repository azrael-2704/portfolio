import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
  import { signInWithEmailAndPassword, signOut, setPersistence, inMemoryPersistence } from 'firebase/auth';
import { X } from 'lucide-react';

  interface TerminalIntroProps {
    onComplete: () => void;
    onAdminMode: (page: string) => void;
    onMinimize?: () => void;
    instant?: boolean;
    isResizing?: boolean;
  }
  
  const AVAILABLE_COMMANDS = [
    'help', 'about', 'experience', 'projects', 'skills', 
    'roadmap', 'philosophy', 'achievements', 'blog', 
    'resume', 'contact', 'clear', 'home', 'ls'
  ];
  
  const TerminalIntro: React.FC<TerminalIntroProps> = ({ onComplete, onAdminMode, onMinimize, instant = false, isResizing = false }) => {
    const navigate = useNavigate();
    const [completedLines, setCompletedLines] = useState<string[]>([]);
    const [currentLine, setCurrentLine] = useState('');
    const [history, setHistory] = useState<Array<{type: 'input'|'output', content: string, color?: string}>>([]);
    const [input, setInput] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [isInteractive, setIsInteractive] = useState(false);
    
    // Auth State
    const [adminMode, setAdminMode] = useState<{ active: boolean, page: string | null }>({ active: false, page: null });
    const [authStep, setAuthStep] = useState<'NONE' | 'EMAIL' | 'PASSWORD'>('NONE');
    const [emailInput, setEmailInput] = useState('');
    
    // Terminal User state for visual feedback
    const [user] = useState("amartya"); 
    
    const hasStarted = useRef(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
  
    // Derived suggestion state
    const suggestion = input.trim() && AVAILABLE_COMMANDS.find(cmd => cmd.startsWith(input.toLowerCase().trim()))
      ? AVAILABLE_COMMANDS.find(cmd => cmd.startsWith(input.toLowerCase().trim())) || ''
      : '';
  
    // Dynamic Age Calculation (From July 2, 2004)
    const birthDate = new Date('2004-07-02');
    const currentDate = new Date();
    const ageInYears = ((currentDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(0);
  
    // Dynamic Experience Calculation (From June 5, 2024)
    const expStartDate = new Date('2024-06-05');
    const expInYears = ((currentDate.getTime() - expStartDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(2);
    
    const bootSequence = [
      { text: "> initializing portfolio...", color: "text-cyan-400" },
      { text: "> loading neurons: landing, neural_navigator...", color: "text-gray-400" },
      { text: `> uptime: ${ageInYears}y | deployed: ${expInYears}y (active)`, color: "text-blue-400" },
      { text: "> status: online", color: "text-green-400" },
      { text: "> hello - i'm Amartya", color: "text-white font-bold" },
      { text: "> Intelligent Systems Developer | Applied Data Scientist | Solutions Architect | Software Developer", color: "text-gray-300" },
      { text: "> type 'help' to see available commands...", color: "text-cyan-400 animate-pulse" },
    ];
  
  
    useEffect(() => {
      // FORCE LOGOUT ON LOAD: Strict requirement "Refresh = Logout"
      // This ensures that even if a token exists in storage, we kill it immediately on boot.
      const secureBoot = async () => {
          await signOut(auth); 
          await setPersistence(auth, inMemoryPersistence);
      };
      secureBoot();

      if (hasStarted.current) return;
      hasStarted.current = true;
      
      if (instant) {
          setCompletedLines(bootSequence.map(l => l.text));
          setIsInteractive(true);
          onComplete();
          return;
      }
  
      const typeLines = async () => {
        for (let i = 0; i < bootSequence.length; i++) {
          const line = bootSequence[i].text;
          for (let charIndex = 0; charIndex < line.length; charIndex++) {
            setCurrentLine(prev => prev + line[charIndex]);
            await new Promise(r => setTimeout(r, Math.random() * 20 + 20)); 
          }
          await new Promise(r => setTimeout(r, 300));
          setCompletedLines(prev => [...prev, line]);
          setCurrentLine('');
        }
        
        // Boot Complete
        setIsInteractive(true);
        onComplete(); 
      };
  
      typeLines();
    }, []);
  
    // Auto-scroll
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [completedLines, currentLine, history]);
  
    const handleCommand = async (cmd: string) => {
      const cleanCmd = cmd.trim(); // Keep case for passwords
      
      // EMAIL STEP
      if (authStep === 'EMAIL') {
           if (cleanCmd.length > 0) {
               setHistory(prev => [...prev, { type: 'input', content: cleanCmd, color: 'text-slate-300' }]);
               
               // Validate email format roughly
               if (!cleanCmd.includes('@')) {
                   setHistory(prev => [...prev, { type: 'output', content: '> INVALID EMAIL FORMAT.', color: 'text-red-500' }]);
                   // Stay on email step
                   return; 
               }
  
               setEmailInput(cleanCmd);
               setHistory(prev => [...prev, { type: 'output', content: '> Enter Password:', color: 'text-slate-400' }]);
               setAuthStep('PASSWORD');
           } else {
               setHistory(prev => [...prev, { type: 'output', content: '> Email required.', color: 'text-red-500' }]);
           }
           setInput('');
           return;
      }
  
      // PASSWORD STEP
      if (authStep === 'PASSWORD') {
          if (cleanCmd.length > 0) { 
               setHistory(prev => [...prev, { type: 'input', content: '**********', color: 'text-slate-300' }]);
               
               try {
                   await signInWithEmailAndPassword(auth, emailInput, cleanCmd);
  
                   setHistory(prev => [
                       ...prev, 
                       { type: 'output', content: '> ACCESS GRANTED.', color: 'text-green-400 font-bold' },
                       { type: 'output', content: `> Opening Admin Interface for: ${adminMode.page?.toUpperCase() || 'MENU'}...`, color: 'text-cyan-400' }
                   ]);
                   
                    setTimeout(() => {
                        setAuthStep('NONE');
                        // If page is null/menu, we pass 'menu'
                        onAdminMode(adminMode.page || 'menu');
                        setAdminMode({ active: false, page: null });
                        if (onMinimize) onMinimize(); // Auto-minimize on success
                    }, 1000);
  
               } catch (error: any) {
                   console.error("Auth failed", error);
                   setHistory(prev => [...prev, { type: 'output', content: `> ACCESS DENIED: ${error.message}`, color: 'text-red-500 font-bold' }]);
                   setAuthStep('NONE');
                   setAdminMode({ active: false, page: null });
               }
               
          } else {
               setHistory(prev => [...prev, { type: 'output', content: '> ACCESS DENIED.', color: 'text-red-500 font-bold' }]);
               setAuthStep('NONE');
               setAdminMode({ active: false, page: null });
          }
          setInput('');
          return;
      }
  
      const lowerCmd = cleanCmd.toLowerCase();
      const newHistory = [...history, { type: 'input' as const, content: `${user}@portfolio:~$ ${cmd}`, color: 'text-slate-300' }];
  
      // LOGOUT COMMAND
      if (lowerCmd === 'sudo admin -cmd logout') {
          try {
              await signOut(auth);
              newHistory.push({ type: 'output', content: '> Successfully logged out.', color: 'text-green-400' });
          } catch (e: any) {
              newHistory.push({ type: 'output', content: `> Logout failed: ${e.message}`, color: 'text-red-400' });
          }
          setHistory(newHistory);
          setInput('');
          return;
      }
  
      // SUDO APT -ACCESS ADMIN parsing
      if (lowerCmd.startsWith('sudo apt -access admin')) {
          const parts = lowerCmd.split(' ');
          // sudo(0) apt(1) -access(2) admin(3) [page](4)
          
          let targetPage = 'menu'; // Default to menu
          if (parts.length >= 5) {
               targetPage = parts[4];
          }
  
          // Validate page if provided
          const validPages = ['projects', 'skills', 'experience', 'roadmap', 'about', 'contact', 'values', 'resume', 'achievements', 'writings', 'hero', 'menu'];
          
          if (validPages.includes(targetPage) || targetPage === 'menu') {
                  
                  // CHECK PERSISTENT AUTH
                  if (auth.currentUser) {
                      newHistory.push({ type: 'output', content: `> Authenticated as: ${auth.currentUser.email}`, color: 'text-green-500' });
                      newHistory.push({ type: 'output', content: `> Granting Access...`, color: 'text-cyan-400' });
                      setHistory(newHistory);
                      setInput('');
                      
                       
                       setTimeout(() => {
                            onAdminMode(targetPage);
                            if (onMinimize) onMinimize(); // Auto-minimize on cookie usage
                       }, 800);
                       return;
                  }
  
                  setHistory([...newHistory, 
                    { type: 'output', content: `> Admin Access Requested for '${targetPage}'.`, color: 'text-yellow-400' },
                    { type: 'output', content: `> Enter Admin Email:`, color: 'text-slate-400' }
                  ]);
                  setAdminMode({ active: true, page: targetPage });
                  setAuthStep('EMAIL');
                  setInput('');
                  return;
          } else {
                  newHistory.push({ type: 'output', content: `Target '${targetPage}' not found.`, color: 'text-red-400' });
          }
          
          setHistory(newHistory);
          setInput('');
          return;
      }
  
      switch(lowerCmd) {
          case 'help':
          case 'ls':
              newHistory.push({ type: 'output', content: "Available Commands:", color: 'text-cyan-400' });
              newHistory.push({ type: 'output', content: "  - home        : Return to Neural Nav", color: 'text-gray-300' });
              newHistory.push({ type: 'output', content: "  - about       : View About Me", color: 'text-gray-300' });
              newHistory.push({ type: 'output', content: "  - experience  : Work History", color: 'text-gray-300' });
              newHistory.push({ type: 'output', content: "  - projects    : View Projects", color: 'text-gray-300' });
              newHistory.push({ type: 'output', content: "  - skills      : Skills", color: 'text-gray-300' });
              newHistory.push({ type: 'output', content: "  - roadmap     : Future Plans", color: 'text-gray-300' });
              newHistory.push({ type: 'output', content: "  - philosophy  : Core Values", color: 'text-gray-300' });
              newHistory.push({ type: 'output', content: "  - achievements: Achievements", color: 'text-gray-300' });
              newHistory.push({ type: 'output', content: "  - blog        : Writings", color: 'text-gray-300' });
              newHistory.push({ type: 'output', content: "  - resume      : View Resume", color: 'text-gray-300' });
              newHistory.push({ type: 'output', content: "  - contact     : Send Message", color: 'text-gray-300' });
              newHistory.push({ type: 'output', content: "  - clear       : Clear Terminal", color: 'text-gray-300' });
              break;
          case 'home':
              newHistory.push({ type: 'output', content: "Returning to Base...", color: 'text-cyan-400' });
              navigate('/');
              break;
          case 'about':
              newHistory.push({ type: 'output', content: "Navigating to /about...", color: 'text-green-400' });
              navigate('/about');
              break;
          case 'skills':
              newHistory.push({ type: 'output', content: "Navigating to /skills...", color: 'text-green-400' });
              navigate('/skills');
              break;
          case 'philosophy':
              newHistory.push({ type: 'output', content: "Navigating to /philosophy...", color: 'text-green-400' });
              navigate('/philosophy');
              break;
          case 'resume':
              newHistory.push({ type: 'output', content: "Opening Resume...", color: 'text-green-400' });
              navigate('/resume');
              break;
          case 'roadmap':
              newHistory.push({ type: 'output', content: "Navigating to /roadmap...", color: 'text-green-400' });
              navigate('/roadmap');
              break;
          case 'projects':
              newHistory.push({ type: 'output', content: "Navigating to /projects...", color: 'text-green-400' });
              navigate('/projects');
              break;
          case 'achievements':
              newHistory.push({ type: 'output', content: "Navigating to /achievements...", color: 'text-green-400' });
              navigate('/achievements');
              break;
          case 'experience':
              newHistory.push({ type: 'output', content: "Navigating to /experience...", color: 'text-green-400' });
              navigate('/experience');
              break;
          case 'blog':
              newHistory.push({ type: 'output', content: "Navigating to /blog...", color: 'text-green-400' });
              navigate('/blog');
              break;
          case 'contact':
              newHistory.push({ type: 'output', content: "Navigating to /contact...", color: 'text-green-400' });
              navigate('/contact');
              break;
          case 'clear':
              setHistory([]);
              setCompletedLines([]); // Optional: clear boot lines too? Maybe
              setInput('');
              return; // Return early to avoid setting history
           case '':
               break;
           default:
               newHistory.push({ type: 'output', content: `Command not found: ${cleanCmd}. Type 'help' for list.`, color: 'text-red-400' });
       }
       
       // Auto-minimize for navigation commands
       if (onMinimize && ['about','skills','experience','projects','roadmap','philosophy','achievements','blog','resume','contact','home'].includes(lowerCmd)) {
           setTimeout(() => onMinimize(), 800);
       }
       
       setHistory(newHistory);
      setInput('');
    };
  
    // Focus input on click
    const handleDivClick = () => {
      if(isInteractive) inputRef.current?.focus();
    };
  
    return (
      <div className="w-full h-full flex items-center justify-center pointer-events-auto" onClick={handleDivClick}>
        <div className={`w-full h-full max-w-3xl border border-white/10 rounded-xl flex flex-col overflow-hidden relative z-20 transition-all duration-300 ${
          isResizing ? 'bg-[#050a14]' : 'glass bg-[#050a14]/90 backdrop-blur-md shadow-2xl'
        }`}>
          
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10 shrink-0">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="mx-auto text-slate-400 text-xs font-medium opacity-75 font-mono">
              {user}@portfolio:~
            </div>
            {onMinimize && (
                <button 
                  onClick={onMinimize}
                  className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
            )}
          </div>
          
          {/* Terminal Body */}
          <div ref={scrollRef} className="p-6 space-y-1 flex-1 overflow-y-auto terminal-scrollbar flex flex-col justify-start items-start font-mono text-sm leading-relaxed text-slate-300">
            {/* Boot Lines */}
            {completedLines.map((line, index) => {
               const lineData = bootSequence.find(r => r.text === line);
               const colorClass = lineData?.color || "text-slate-300";
               return <div key={`boot-${index}`} className={`${colorClass} whitespace-pre-wrap`}>{line}</div>;
            })}
  
            {/* Current Typing Boot Line */}
            {currentLine && (
               <div className={`${bootSequence[completedLines.length]?.color || "text-slate-300"}`}>
                 {currentLine}
                 <span className="w-2 h-4 bg-cyan-400 inline-block ml-1 animate-pulse align-middle" />
               </div>
            )}
  
            {/* Interactive History */}
            {history.map((item, idx) => (
                <div key={`hist-${idx}`} className={`${item.color || 'text-slate-300'} whitespace-pre-wrap`}>
                    {item.content}
                </div>
            ))}
  
            {/* Active Input Line */}
            {isInteractive && (
                <div className="flex items-center w-full text-slate-300">
                    {authStep === 'NONE' && <span className="text-green-400 mr-2 whitespace-nowrap">{user}@portfolio:~$</span>}
                    {authStep === 'EMAIL' && <span className="text-slate-400 mr-2 whitespace-nowrap">Email:</span>}
                    {authStep === 'PASSWORD' && <span className="text-slate-400 mr-2 whitespace-nowrap">Password:</span>}
                    
                    <div className="relative flex-1">
                      {/* Ghost Text (Suggestion) - Hide on password */}
                      {suggestion && authStep === 'NONE' && (
                         <div className="absolute inset-0 pointer-events-none font-mono flex">
                           <span className="opacity-0 whitespace-pre">{input}</span>
                           <span className="text-slate-600 opacity-50">{suggestion.slice(input.length)}</span>
                         </div>
                      )}
                      
                      {/* Actual Input */}
                      <input 
                        ref={inputRef}
                        type={authStep === 'PASSWORD' ? "password" : "text"}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            // Reset history navigation if user types manually
                            setHistoryIndex(null); 
                        }}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                              if (input.trim()) {
                                  if (authStep === 'NONE') {
                                      setCommandHistory(prev => [...prev, input]);
                                  }
                                  setHistoryIndex(null);
                              }
                              handleCommand(input);
                           } else if ((e.key === 'Tab' || e.key === ' ') && suggestion && input !== suggestion && authStep === 'NONE') {
                              e.preventDefault();
                              setInput(suggestion);
                           } else if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              if (commandHistory.length === 0 || authStep !== 'NONE') return;
                              const newIndex = historyIndex === null 
                                  ? commandHistory.length - 1 
                                  : Math.max(0, historyIndex - 1);
                              setHistoryIndex(newIndex);
                              setInput(commandHistory[newIndex]);
                           } else if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              if (historyIndex !== null && authStep === 'NONE') {
                                  const newIndex = historyIndex + 1;
                                  if (newIndex < commandHistory.length) {
                                      setHistoryIndex(newIndex);
                                      setInput(commandHistory[newIndex]);
                                  } else {
                                      setHistoryIndex(null);
                                      setInput('');
                                  }
                              }
                           }
                        }}
                        className="bg-transparent border-none outline-none w-full text-slate-300 font-mono relative z-10"
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                      />
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    );
};

export default TerminalIntro;
