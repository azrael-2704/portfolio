
import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { X, Save, RefreshCw, Terminal, ChevronLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { doc, setDoc, deleteDoc, collection, writeBatch } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import ProjectForm from './forms/ProjectForm';
import SkillForm from './forms/SkillForm';
import TimelineForm from './forms/TimelineForm';
import RoadmapForm from './forms/RoadmapForm';
import PhilosophyForm from './forms/PhilosophyForm';
import BlogForm from './forms/BlogForm';
import ContactForm from './forms/ContactForm';
import ProfileForm from './forms/ProfileForm';
import HeroForm from './forms/HeroForm';
import ResumeForm from './forms/ResumeForm';
import { useProjects, useSkills, useTimeline, useRoadmap, usePhilosophy, useBlogPosts, useProfile } from '../../hooks/usePortfolioData';
import CyberAlert from '../ui/CyberAlert';

interface AdminModalProps {
    section: string;
    onClose: () => void;
}


const AdminModal: React.FC<AdminModalProps> = ({ section, onClose }) => {
    const [activeSection, setActiveSection] = useState(section);
    const [isSaving, setIsSaving] = useState(false);
    
    // Alert State
    const [alertState, setAlertState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'error' | 'success' | 'warning' | 'info';
        onConfirm?: () => void;
    }>({ isOpen: false, title: '', message: '', type: 'info' });

    const showAlert = (title: string, message: string, type: 'error' | 'success' | 'warning' | 'info' = 'info') => {
        setAlertState({ isOpen: true, title, message, type, onConfirm: undefined });
    };

    useEffect(() => {
        setActiveSection(section);
    }, [section]);

    // Inactivity Timer (15 Minutes)
    useEffect(() => {
        const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 mins
        const CHECK_INTERVAL = 60 * 1000; // Check every 1 min
        let lastActivity = Date.now();
        
        const updateActivity = () => {
            lastActivity = Date.now();
        };

        // Listeners for activity
        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('click', updateActivity);

        const timer = setInterval(async () => {
            if (Date.now() - lastActivity > INACTIVITY_LIMIT) {
                console.log("Admin Session Expired due to inactivity.");
                await signOut(auth);
                onClose();
                // Optional: Alert the user (handled by UI returning to terminal usually)
            }
        }, CHECK_INTERVAL);

        return () => {
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('click', updateActivity);
            clearInterval(timer);
        };
    }, []);

    const [view, setView] = useState<'LIST' | 'EDIT'>('LIST');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Live Data Hooks
    const { data: projects } = useProjects();
    const { data: skills } = useSkills();
    const { data: timeline } = useTimeline();
    const { data: roadmap } = useRoadmap();
    const { data: philosophy } = usePhilosophy();
    const { data: blogs } = useBlogPosts();
    const { profile } = useProfile();

    // Firestore Save Logic
    const handleSave = async (data: any) => {
        setIsSaving(true);
        try {
            // Determine collection based on section
            let collectionName = '';
            let docId = data.id;

            switch(activeSection) {
                case 'projects': collectionName = 'projects'; break;
                case 'skills': collectionName = 'skills'; break;
                case 'experience': 
                case 'achievements': collectionName = 'timeline'; break;
                case 'roadmap': collectionName = 'roadmap'; break;
                case 'values': collectionName = 'philosophy'; break;
                case 'writings': collectionName = 'writings'; break;
                case 'about': collectionName = 'portfolio'; docId = 'profile'; break;
                case 'hero': collectionName = 'portfolio'; docId = 'profile'; break;
                case 'resume': collectionName = 'portfolio'; docId = 'profile'; break; // Treat Resume as Profile Update
                case 'contact': collectionName = 'portfolio'; docId = 'profile'; break;
            }

            if (!collectionName) {
                console.error("Unknown section collection");
                setIsSaving(false);
                return;
            }

            // Special handling for nested/specific updates
            if (activeSection === 'about' || activeSection === 'hero' || activeSection === 'resume') {
                 // ProfileForm, HeroForm, ResumeForm modify 'profile' doc.
                 // ResumeForm updates 'resumeUrl' field in profile.
                 const ref = doc(db, 'portfolio', 'profile');
                 await setDoc(ref, data, { merge: true });
            } 
            else if (activeSection === 'contact') {
                 // Update existing profile.social
                 const ref = doc(db, 'portfolio', 'profile');
                 await setDoc(ref, { social: data }, { merge: true });
            }
            else {
                // Standard Collection Item
                if (!docId) {
                    // Create new ID if none
                    const newRef = doc(collection(db, collectionName));
                    docId = newRef.id;
                    data = { ...data, id: docId };
                }
                const ref = doc(db, collectionName, docId);
                await setDoc(ref, data, { merge: true });
            }

            console.log("Saved successfully!");
            setIsSaving(false);
            setView('LIST'); // Return to list
            showAlert('SUCCESS', 'Changes committed to database.', 'success');
            
        } catch (e: any) {
            console.error("Save failed:", e);
            setIsSaving(false);
            showAlert('SAVE FAILED', e.message || "Failed to save changes.", 'error');
        }
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setView('EDIT');
    };

    const handleAddNew = () => {
        setSelectedItem(null); // Empty for new
        setView('EDIT');
    };


    const handleDelete = async (data: any) => {
        if (!data || !data.id) return;
        
        // Custom Confirmation Dialog logic
        setAlertState({
            isOpen: true,
            title: 'CONFIRM DELETION',
            message: 'Are you sure you want to permanently delete this item? This action overrides safety protocols.',
            type: 'warning',
            onConfirm: async () => {
                setIsSaving(true);
                try {
                    let collectionName = '';
                    console.log("Attempting delete for section:", activeSection, "Item:", data);

                    switch(activeSection) {
                        case 'projects': collectionName = 'projects'; break;
                        case 'skills': collectionName = 'skills'; break;
                        case 'experience': 
                        case 'achievements': collectionName = 'timeline'; break;
                        case 'roadmap': collectionName = 'roadmap'; break;
                        case 'values': collectionName = 'philosophy'; break;
                        case 'writings': collectionName = 'writings'; break;
                    }

                    if (collectionName) {
                        await deleteDoc(doc(db, collectionName, data.id));
                        console.log("Delete successful");
                        showAlert('DELETED', 'Item purged from database.', 'success');
                    } else {
                        showAlert('ERROR', 'Could not determine collection target.', 'error');
                    }
                    setIsSaving(false);
                } catch (e: any) {
                    console.error("Delete failed", e);
                    showAlert('DELETE FAILED', e.message, 'error');
                    setIsSaving(false);
                }
            }
        });
    };

    const handleReorder = async (newOrder: any[]) => {
        let collectionName = '';
        switch(activeSection) {
            case 'projects': collectionName = 'projects'; break;
            case 'skills': collectionName = 'skills'; break;
            case 'experience': 
            case 'achievements': collectionName = 'timeline'; break;
            case 'roadmap': collectionName = 'roadmap'; break;
            case 'values': collectionName = 'philosophy'; break;
            case 'writings': collectionName = 'writings'; break;
            default: return; // No reorder for singletons
        }

        const batch = writeBatch(db);
        newOrder.forEach((item, index) => {
            const ref = doc(db, collectionName, item.id);
            batch.update(ref, { order: index });
        });

        try {
            await batch.commit();
            console.log("Reorder saved");
        } catch (e) {
            console.error("Reorder failed", e);
        }
    };

    const [localItems, setLocalItems] = useState<any[]>([]);

    useEffect(() => {
        // Load data into local state when section or backend data changes
        let sourceData: any[] = [];
        if (activeSection === 'projects') sourceData = projects;
        else if (activeSection === 'skills') sourceData = skills;
        else if (['experience', 'achievements'].includes(activeSection)) {
            sourceData = timeline.filter((t: any) => {
                 if (activeSection === 'experience') return true;
                 if (activeSection === 'achievements') return t.type === 'achievement' || t.type === 'certification';
                 return false;
            });
        }
        else if (activeSection === 'roadmap') sourceData = roadmap;
        else if (activeSection === 'values') sourceData = philosophy;
        else if (activeSection === 'writings') sourceData = blogs;

        setLocalItems(sourceData);
    }, [activeSection, projects, skills, timeline, roadmap, philosophy, blogs]);

    const onReorderLocal = (newOrder: any[]) => {
        setLocalItems(newOrder); // Update UI instantly
        handleReorder(newOrder); 
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
            <CyberAlert 
                isOpen={alertState.isOpen}
                onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                onConfirm={alertState.onConfirm}
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-5xl h-[85vh] bg-[#0a0f1c] border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-[#050810]">
                    <div className="flex items-center gap-3">
                        {/* Unified Back Button */}
                        {(activeSection !== 'menu' || view === 'EDIT') && (
                            <button 
                                onClick={() => {
                                    if (view === 'EDIT') {
                                        setView('LIST');
                                        setSelectedItem(null);
                                    } else {
                                        setActiveSection('menu');
                                        setView('LIST'); // Ensure view is reset
                                        setSelectedItem(null);
                                    }
                                }} 
                                className="p-1 hover:bg-white/10 rounded mr-1"
                            >
                                <ChevronLeft size={18} className="text-cyan-400" />
                            </button>
                        )}
                        <Terminal className="text-cyan-400" size={20} />
                        <h2 className="text-xl font-mono font-bold text-white tracking-wider flex items-center gap-2">
                            ADMIN_PANEL <span className="text-gray-500">//</span> 
                            <span className="text-cyan-400">{activeSection.toUpperCase()}</span>
                            {view === 'EDIT' && <span className="text-xs text-gray-500 ml-2">[{selectedItem ? 'EDIT' : 'NEW'}]</span>}
                        </h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative bg-[#0a0f1c]">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                    
                    {activeSection === 'menu' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['projects', 'skills', 'experience', 'achievements', 'resume', 'roadmap', 'values', 'writings', 'about', 'contact', 'hero'].map(key => (
                                <button 
                                    key={key} 
                                    onClick={() => setActiveSection(key)}
                                    className="p-6 border border-white/10 rounded-xl bg-white/5 hover:bg-cyan-900/20 hover:border-cyan-500/50 transition-all flex flex-col items-center gap-3 group"
                                >
                                    <div className="text-cyan-400 group-hover:scale-110 transition-transform">
                                        {key === 'hero' ? <Terminal size={32}/> : <Edit2 size={32}/> }
                                    </div>
                                    <span className="text-sm font-mono text-gray-300 uppercase tracking-widest">{key}</span>
                                </button>
                            ))}
                        </div>
                    ) : view === 'LIST' ? (
                        <div className="space-y-4">
                            {/* Toolbar */}
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-sm font-mono text-gray-400">
                                    {activeSection === 'projects' ? `${localItems.length} RECORDS FOUND` : 
                                     activeSection === 'skills' ? `${localItems.length} NODES FOUND` : 
                                     ['experience', 'achievements', 'resume'].includes(activeSection) ? 'TIMELINE NODES' :
                                     activeSection === 'roadmap' ? `${localItems.length} MILESTONES` :
                                     activeSection === 'values' ? `${localItems.length} AXIOMS` :
                                     activeSection === 'writings' ? `${localItems.length} LOGS` :
                                     ['about', 'contact', 'hero'].includes(activeSection) ? 'SINGLETON NODE' :
                                     'SELECT ITEM TO EDIT'}
                                </p>
                                <div className="flex gap-4">
                                    {['projects', 'skills', 'experience', 'roadmap', 'values', 'writings'].includes(activeSection) && (
                                        <p className="text-[10px] text-gray-600 self-center uppercase tracking-widest animate-pulse">
                                            DRAG TO REORDER
                                        </p>
                                    )}
                                    {!['about', 'contact', 'hero', 'resume'].includes(activeSection) && (
                                        <button 
                                            onClick={handleAddNew}
                                            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded hover:bg-cyan-500/20 text-xs font-mono font-bold transition-all"
                                        >
                                            <Plus size={14} /> NEW_ENTRY
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* DRAG AND DROP LISTS */}
                            
                            {/* LIST VIEW RENDERER */}
                            
                            {/* 1. SKILLS: Grouped Grid Layout */}
                            {activeSection === 'skills' ? (
                                <div className="space-y-8">
                                     {/* Derive Unique Categories from Data + Default Order */}
                                     {(() => {
                                         const defaultOrder = ['ml', 'ds', 'dev', 'ops', 'core'];
                                         const usedCategories = Array.from(new Set(localItems.map((i: any) => i.category || 'other')));
                                         // Sort: Default ones first in order, then others alphabetically
                                         const sortedCategories = usedCategories.sort((a, b) => {
                                             const idxA = defaultOrder.indexOf(a);
                                             const idxB = defaultOrder.indexOf(b);
                                             if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                                             if (idxA !== -1) return -1;
                                             if (idxB !== -1) return 1;
                                             return a.localeCompare(b);
                                         });

                                         const categoryLabels: Record<string, string> = {
                                             'ml': 'AI / MACHINE LEARNING',
                                             'ds': 'DATA SCIENCE',
                                             'dev': 'WEB DEVELOPMENT',
                                             'ops': 'DEVOPS / CLOUD',
                                             'core': 'CORE / LANGUAGES'
                                         };

                                         return sortedCategories.map(category => {
                                             const categoryItems = localItems.filter((item: any) => (item.category || 'other') === category);
                                             if (categoryItems.length === 0) return null;

                                             return (
                                                 <div key={category}>
                                                     <h3 className="text-xs font-mono font-bold text-cyan-500/70 mb-3 border-b border-cyan-500/20 pb-1 uppercase tracking-wider">
                                                         {categoryLabels[category] || category.toUpperCase()}
                                                     </h3>
                                                     <Reorder.Group 
                                                         values={categoryItems} 
                                                         onReorder={(newOrder) => {
                                                             const others = localItems.filter((i: any) => (i.category || 'other') !== category);
                                                             onReorderLocal([...others, ...newOrder]);
                                                         }} 
                                                         className="space-y-3"
                                                     >
                                                         {categoryItems.map((item: any) => (
                                                             <Reorder.Item 
                                                                key={item.id} 
                                                                value={item} 
                                                                className="w-full relative cursor-grab active:cursor-grabbing"
                                                                whileDrag={{ scale: 1.02, zIndex: 100, boxShadow: "0px 10px 20px rgba(0,0,0,0.5)" }}
                                                             >
                                                               <div 
                                                                   onClick={() => handleEdit(item)}
                                                                   className="group flex flex-col justify-between p-4 border border-white/5 rounded-lg bg-[#0c121e] hover:border-cyan-500/50 transition-all hover:bg-[#0f1624] relative"
                                                               >
                                                                   <button 
                                                                       onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item); }}
                                                                       className="absolute top-4 right-4 p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                                       title="Delete"
                                                                   >
                                                                       <Trash2 size={16} />
                                                                   </button>

                                                                   <div className="flex justify-between items-center mb-2">
                                                                        <h3 className="text-white font-mono text-sm font-bold group-hover:text-cyan-400 transition-colors truncate w-full" title={item.name}>
                                                                            {item.name}
                                                                        </h3>
                                                                        <Edit2 size={12} className="text-gray-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2" />
                                                                    </div>
                                                                    
                                                                    <div className="space-y-1">
                                                                        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                                                            <span>{item.version}</span>
                                                                            <span>{item.level}%</span>
                                                                        </div>
                                                                        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                                                            <div className="bg-cyan-500 h-full" style={{ width: `${item.level}%` }}></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                             </Reorder.Item>
                                                         ))}
                                                     </Reorder.Group>
                                                 </div>
                                             );
                                         });
                                     })()}
                                </div>
                            ) : 
                            
                            /* 2. GENERIC REORDERABLE LIST */
                            !['about', 'contact', 'hero', 'resume'].includes(activeSection) ? (
                                <Reorder.Group values={localItems} onReorder={onReorderLocal} className="space-y-3">
                                    {localItems.map((item) => (
                                        <Reorder.Item key={item.id} value={item}>
                                            {/* Render Item Content Based on Type */}
                                            {activeSection === 'projects' && (
                                                <div 
                                                    onClick={() => handleEdit(item)}
                                                    className="group flex items-center justify-between p-4 border border-white/5 rounded-lg bg-[#0c121e] hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-[#0f1624] relative"
                                                >
                                                     <button 
                                                        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item); }}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded overflow-hidden bg-gray-800">
                                                            <img src={item.image} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-mono group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                                                            <p className="text-xs text-gray-500 truncate max-w-md">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity pr-6">
                                                        <span className={`text-[10px] uppercase border px-2 py-0.5 rounded ${item.type === 'product' ? 'border-green-500 text-green-500' : 'border-purple-500 text-purple-500'}`}>{item.type}</span>
                                                        <Edit2 size={16} className="text-cyan-400" />
                                                    </div>
                                                </div>
                                            )}  

                                            {['experience', 'achievements'].includes(activeSection) && (
                                                <div 
                                                    onClick={() => handleEdit(item)}
                                                    className="group p-4 border border-white/5 rounded-lg bg-[#0c121e] hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-[#0f1624] flex justify-between items-start relative"
                                                >
                                                     <button 
                                                        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item); }}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <div>
                                                        <h3 className="text-white font-mono font-bold group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                                                        <div className="text-xs text-gray-500 font-mono mt-1">{item.org} | {item.date}</div>
                                                    </div>
                                                    <div className="text-xs border border-white/10 px-2 py-1 rounded text-gray-500 uppercase tracking-wider pr-6">{item.type}</div>
                                                </div>
                                            )}

                                            {activeSection === 'roadmap' && (
                                                <div 
                                                    onClick={() => handleEdit(item)}
                                                    className="group p-4 border border-white/5 rounded-lg bg-[#0c121e] hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-[#0f1624] flex justify-between items-center relative"
                                                >
                                                     <button 
                                                        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item); }}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <div>
                                                        <h3 className="text-white font-mono font-bold group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                                                        <div className="text-xs text-gray-500 font-mono mt-1">{item.date}</div>
                                                    </div>
                                                    <div className={`text-[10px] px-2 py-1 rounded border uppercase mr-8 ${
                                                        item.status === 'completed' ? 'border-green-500 text-green-500' : 
                                                        item.status === 'in-progress' ? 'border-amber-500 text-amber-500' : 
                                                        'border-purple-500 text-purple-500'
                                                    }`}>
                                                        {item.status}
                                                    </div>
                                                </div>
                                            )}

                                            {activeSection === 'values' && (
                                                <div 
                                                    onClick={() => handleEdit(item)}
                                                    className="group p-4 border border-white/5 rounded-lg bg-[#0c121e] hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-[#0f1624] relative"
                                                >
                                                     <button 
                                                        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item); }}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <h3 className="text-white font-mono font-bold group-hover:text-cyan-400 transition-colors mb-2 pr-6">{item.title}</h3>
                                                    <p className="text-xs text-gray-500 line-clamp-2">{item.desc}</p>
                                                </div>
                                            )}

                                            {activeSection === 'writings' && (
                                                <div 
                                                    onClick={() => handleEdit(item)}
                                                    className="group p-4 border border-white/5 rounded-lg bg-[#0c121e] hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-[#0f1624] relative"
                                                >
                                                     <button 
                                                        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item); }}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <div className="flex justify-between items-start mb-1 pr-6">
                                                        <h3 className="text-white font-mono font-bold group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                                                        <span className="text-xs text-gray-500">{item.date}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {item.tags && item.tags.map((tag: string) => (
                                                            <span key={tag} className="text-[10px] text-gray-600 bg-white/5 px-1 rounded">#{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            ) : (
                                /* 3. SINGLETON SECTIONS (Profile, About, Hero, Resume) */
                                <div className="space-y-3">
                                    <div 
                                        onClick={() => handleEdit(
                                            activeSection === 'about' ? profile : 
                                            activeSection === 'hero' ? profile : 
                                            activeSection === 'resume' ? profile :
                                            profile.social
                                        )}
                                        className="group p-6 border border-white/5 rounded-lg bg-[#0c121e] hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-[#0f1624] flex items-center gap-4"
                                    >
                                        <div className="p-3 rounded-full bg-cyan-900/10 text-cyan-400 group-hover:text-white group-hover:bg-cyan-500 transition-all">
                                            <Edit2 size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-mono font-bold text-lg group-hover:text-cyan-400 transition-colors">
                                                {activeSection === 'about' ? 'EDIT PROFILE DATA' : 
                                                 activeSection === 'hero' ? 'EDIT HERO SECTION' : 
                                                 activeSection === 'resume' ? 'UPLOAD RESUME FILE' :
                                                 'EDIT CONTACT CHANNELS'}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {activeSection === 'about' ? 'Modify Bio, Titles, Name, and Stats.' : 
                                                 activeSection === 'hero' ? 'Configure CTA Button, Title, and Main Text.' : 
                                                 activeSection === 'resume' ? 'Upload new Resume PDF.' :
                                                 'Update Email, Social Links, and Handles.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Fallback for other sections not yet implemented */}
                            {!['projects', 'skills', 'experience', 'achievements', 'resume', 'roadmap', 'values', 'writings', 'about', 'contact', 'hero'].includes(activeSection) && (
                                <div className="text-center py-20 text-gray-500 font-mono">
                                    MODULE '{activeSection.toUpperCase()}' NOT YET DEPLOYED.
                                </div>
                            )}
                        </div>
                    ) : (
                        // EDIT MODE
                        <div className="max-w-4xl mx-auto">
                            {activeSection === 'projects' && (
                                <ProjectForm 
                                    initialData={selectedItem} 
                                    onChange={(data) => setSelectedItem(data)}
                                />
                            )}
                            {activeSection === 'skills' && (
                                <SkillForm 
                                    initialData={selectedItem} 
                                    onChange={(data) => setSelectedItem(data)}
                                />
                            )}
                            {/* FIX: Removed 'resume' from here to avoid Double Render */}
                            {['experience', 'achievements'].includes(activeSection) && (
                                <TimelineForm
                                    initialData={selectedItem}
                                    onChange={(data) => setSelectedItem(data)}
                                    restrictType={
                                        activeSection === 'experience' ? 'work' : 
                                        undefined // achievements/certs
                                    }
                                />
                            )}
                            {activeSection === 'roadmap' && (
                                <RoadmapForm 
                                    initialData={selectedItem} 
                                    onChange={(data) => setSelectedItem(data)} 
                                />
                            )}
                            {activeSection === 'values' && (
                                <PhilosophyForm 
                                    initialData={selectedItem} 
                                    onChange={(data) => setSelectedItem(data)} 
                                />
                            )}
                            {activeSection === 'writings' && (
                                <BlogForm 
                                    initialData={selectedItem} 
                                    onChange={(data) => setSelectedItem(data)} 
                                />
                            )}
                            {activeSection === 'about' && (
                                <ProfileForm 
                                    initialData={selectedItem} 
                                    onChange={(data) => setSelectedItem(data)} 
                                    onBusy={setIsSaving} // Re-use isSaving to block global save
                                />
                            )}
                            {activeSection === 'contact' && (
                                <ContactForm 
                                    initialData={selectedItem} 
                                    onChange={(data) => setSelectedItem(data)} 
                                />
                            )}
                             {activeSection === 'hero' && (
                                <HeroForm
                                    initialData={selectedItem} 
                                    onChange={(data) => setSelectedItem(data)} 
                                />
                            )}
                            {activeSection === 'resume' && (
                                <ResumeForm
                                    initialData={selectedItem} 
                                    onChange={(data) => setSelectedItem(data)} 
                                    onBusy={setIsSaving}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 border-t border-cyan-500/20 bg-[#050810] flex justify-between items-center">
                    {view === 'EDIT' && (
                        <>
                            <div>
                                {selectedItem && !['about', 'contact', 'hero'].includes(activeSection) && (
                                    <button 
                                        onClick={() => handleDelete(selectedItem)}
                                        disabled={isSaving}
                                        className="px-4 py-2 rounded-lg font-mono text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all flex items-center gap-2"
                                    >
                                        <Trash2 size={16} /> DELETE
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setView('LIST')}
                                    className="px-6 py-2 rounded-lg font-mono text-sm border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white transition-all"
                                >
                                    CANCEL
                                </button>
                                <button 
                                    onClick={() => handleSave(selectedItem)} 
                                    disabled={isSaving}
                                    className="px-6 py-2 rounded-lg font-mono text-sm font-bold bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                                    {isSaving ? 'SAVING...' : 'COMMIT CHANGES'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminModal;
