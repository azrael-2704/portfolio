
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
import { useProjects, useSkills, useSkillCategories, useTimeline, useRoadmap, usePhilosophy, useBlogPosts, useProfile } from '../../hooks/usePortfolioData';
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
    const { data: projects, isFallback: isProjectsFallback } = useProjects();
    const { data: skills, isFallback: isSkillsFallback } = useSkills();
    const { data: fetchedCategories, isFallback: isCategoriesFallback } = useSkillCategories();
    const { data: timeline, isFallback: isTimelineFallback } = useTimeline();
    const { data: roadmap, isFallback: isRoadmapFallback } = useRoadmap();
    const { data: philosophy, isFallback: isPhilosophyFallback } = usePhilosophy();
    const { data: blogs, isFallback: isBlogsFallback } = useBlogPosts();
    const { profile } = useProfile();

    // Skills Architecture State
    const [skillViewMode, setSkillViewMode] = useState<'CATEGORIES' | 'SKILLS_LIST'>('CATEGORIES');
    const [activeCategory, setActiveCategory] = useState<any>(null);
    const [localCategories, setLocalCategories] = useState<any[]>([]);

    const isCurrentSectionFallback = 
        activeSection === 'projects' ? isProjectsFallback :
        activeSection === 'skills' ? (isSkillsFallback || isCategoriesFallback) :
        ['experience', 'achievements'].includes(activeSection) ? isTimelineFallback :
        activeSection === 'roadmap' ? isRoadmapFallback :
        activeSection === 'values' ? isPhilosophyFallback :
        activeSection === 'writings' ? isBlogsFallback : false;

    // Firestore Sync Logic (Initialize DB from Static)
    const handleSync = async () => {
        setIsSaving(true);
        try {
            let collectionName = '';
            switch(activeSection) {
                case 'projects': collectionName = 'projects'; break;
                case 'skills': collectionName = 'skills'; break;
                case 'experience': 
                case 'achievements': collectionName = 'timeline'; break;
                case 'roadmap': collectionName = 'roadmap'; break;
                case 'values': collectionName = 'philosophy'; break;
                case 'writings': collectionName = 'writings'; break;
                default: return;
            }

            if (!collectionName) return;

            const batch = writeBatch(db);
            localItems.forEach((item, index) => {
                // Ensure ID exists, or generate one
                const docRef = doc(db, collectionName, item.id || `item_${Date.now()}_${index}`);
                // Add order field if missing
                batch.set(docRef, { ...item, order: index }, { merge: true });
            });

            await batch.commit();
            console.log(`Synced ${collectionName} to Firestore`);
            showAlert('DATABASE SYNCHRONIZED', 'Static content has been uploaded to the database. You can now edit and delete items.', 'success');
        } catch (e: any) {
            console.error("Sync failed", e);
            showAlert('SYNC FAILED', e.message, 'error');
        } finally {
            setIsSaving(false);
        }

    };

    // Firestore Save Logic
    const handleSave = async (data: any) => {
        setIsSaving(true);
        try {
            // Determine collection based on section
            let collectionName = '';
            let docId = data.id;

            console.log("handleSave called", { activeSection, hasId: !!docId, data });

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
                case 'resume': collectionName = 'portfolio'; docId = 'profile'; break; 
                case 'contact': collectionName = 'portfolio'; docId = 'profile'; break;
            }

            console.log("Collection determined:", collectionName);

            if (!collectionName && activeSection !== 'skills') { // Skip check for skills as it might be category update
                console.error("Unknown section collection");
                setIsSaving(false);
                return;
            }

            // Handle Category Save (Special Case)
            if (activeSection === 'skills' && skillViewMode === 'CATEGORIES' && data.color) { // Better Category Detection
                 collectionName = 'skill_categories';
                 let newId = data.id || data.label.toLowerCase().replace(/\s+/g, '-');
                 
                 // CHECK FOR RENAME (Migration)
                 if (selectedItem && selectedItem.id && selectedItem.id !== newId) {
                     console.log(`RENAMING CATEGORY: ${selectedItem.id} -> ${newId}`);
                     const batch = writeBatch(db);

                     // 1. Create New Category Doc
                     const newRef = doc(db, 'skill_categories', newId);
                     batch.set(newRef, { ...data, id: newId });

                     // 2. Update All Skills belonging to old category
                     // We need to find them from localItems (assuming fully loaded) or query
                     // Since we load all skills, we can filter localItems if activeSection is skills
                     // But wait, localCategories is what we are seeing. localItems has skills? 
                     // We need to fetch all skills to be safe or rely on logic.
                     // The AdminModal loads 'skills' into 'skills' data hook.
                     // Let's rely on finding them in `skills` (the hook data) to include ALL skills, not just filtered ones.
                     const relatedSkills = skills?.filter((s: any) => s.category === selectedItem.id) || [];
                     
                     relatedSkills.forEach((skill: any) => {
                         const skillRef = doc(db, 'skills', skill.id);
                         batch.update(skillRef, { category: newId });
                     });

                     // 3. Delete Old Category
                     const oldRef = doc(db, 'skill_categories', selectedItem.id);
                     batch.delete(oldRef);

                     await batch.commit();
                     
                     setIsSaving(false);
                     setView('LIST');
                     showAlert('MIGRATION SUCCESS', `Renamed category and moved ${relatedSkills.length} skills.`, 'success');
                     return;
                 }

                 docId = newId;
                 data = { ...data, id: docId };
            } else if (activeSection === 'skills' && !data.color) { 
                 collectionName = 'skills';
            }

            // Special handling for nested/specific updates
            if (activeSection === 'about' || activeSection === 'hero' || activeSection === 'resume') {
                 const ref = doc(db, 'portfolio', 'profile');
                 await setDoc(ref, data, { merge: true });
            } 
            else if (activeSection === 'contact') {
                 const ref = doc(db, 'portfolio', 'profile');
                 await setDoc(ref, { social: data }, { merge: true });
            }
            else {
                // Standard Collection Item
                if (!docId) {
                    console.log("Creating NEW item for", collectionName);
                    // Create new ID if none
                    const newRef = doc(collection(db, collectionName));
                    docId = newRef.id;
                    
                    // Assign order to end of list
                    const newOrder = localItems.length;
                    data = { ...data, id: docId, order: newOrder };
                    
                    console.log("Generated ID:", docId, "Order:", newOrder);
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

    // Default Templates for New Items
    const getEmptyTemplate = (section: string) => {
        switch(section) {
            case 'projects': return { title: '', desc: '', type: 'product', tech: [], details: [], image: '', link: '', github: '', domain: '', featured: false };
            case 'skills': return { name: '', level: 50, category: 'core', version: '', desc: '' };
            case 'experience': return { title: '', org: '', date: '', desc: '', type: 'work', side: 'right' };
            case 'achievements': return { title: '', org: '', date: '', desc: '', type: 'achievement', side: 'right' };
            case 'roadmap': return { title: '', date: '', desc: '', status: 'planned' };
            case 'values': return { title: '', desc: '' };
            case 'writings': return { title: '', date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric'}), readTime: '5 min', desc: '', tags: [] };
            default: return {};
        }
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setView('EDIT');
    };

    const handleAddNew = () => {
        if (activeSection === 'skills' && skillViewMode === 'CATEGORIES') {
            handleEdit({ isCategory: true, color: 'cyan', label: '', order: localCategories.length });
        } else if (activeSection === 'skills' && skillViewMode === 'SKILLS_LIST' && activeCategory) {
             // Pre-fill category for new skill
             setSelectedItem({ ...getEmptyTemplate('skills'), category: activeCategory.id });
             setView('EDIT');
        } else {
            setSelectedItem(getEmptyTemplate(activeSection)); 
            setView('EDIT');
        }
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
                        case 'skills': 
                            collectionName = data.isCategory || (skillViewMode === 'CATEGORIES' && data.color) ? 'skill_categories' : 'skills'; 
                            break;
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

    // Sync Categories
    useEffect(() => {
        if (fetchedCategories) {
            setLocalCategories(fetchedCategories);
        }
    }, [fetchedCategories]);

    const onReorderLocal = (newOrder: any[]) => {
        setLocalItems(newOrder); // Update UI instantly
        handleReorder(newOrder); 
    };

    const onReorderCategories = (newOrder: any[]) => {
        setLocalCategories(newOrder);
        saveCategoryOrder(newOrder); // Auto-save
    };

    const saveCategoryOrder = async (order: any[]) => {
        // Debounce or just fire fire? The main reorder does fire fire.
        // We'll mimic handleReorder which commits immediately
        const batch = writeBatch(db);
        order.forEach((cat, index) => {
            const ref = doc(db, 'skill_categories', cat.id);
            batch.update(ref, { order: index });
        });
        
        try {
            await batch.commit();
            console.log("Category order auto-saved");
        } catch (e) {
            console.error("Failed to save category order", e);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm"
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
                                    } else if (activeSection === 'skills' && skillViewMode === 'SKILLS_LIST') {
                                        setSkillViewMode('CATEGORIES');
                                        setActiveCategory(null);
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
                            {activeSection === 'skills' && skillViewMode === 'SKILLS_LIST' && activeCategory && (
                                <>
                                    <span className="text-gray-500 mx-2">/</span>
                                    <span className="text-cyan-400">{activeCategory.label || activeCategory.id}</span>
                                </>
                            )}
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
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 custom-scrollbar relative bg-[#0a0f1c]">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                    
                    {activeSection === 'menu' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
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
                                 {isCurrentSectionFallback ? (
                                    <button 
                                        onClick={handleSync}
                                        disabled={isSaving}
                                        className="text-xs font-mono text-amber-400 border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 rounded flex items-center gap-2 hover:bg-amber-500/20 transition-colors animate-pulse"
                                    >
                                        <RefreshCw size={14} className={isSaving ? "animate-spin" : ""} />
                                        INITIALIZE DATABASE TO EDIT
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        {['projects', 'skills', 'experience', 'roadmap', 'values', 'writings'].includes(activeSection) && (
                                            <span className="text-xs font-mono text-gray-600 hidden md:block">DRAG TO REORDER</span>
                                        )}
                                        {!['about', 'contact', 'hero', 'resume'].includes(activeSection) && (
                                            <button 
                                                onClick={handleAddNew}
                                                className="flex items-center gap-2 px-4 py-1.5 bg-cyan-900/20 text-cyan-400 border border-cyan-500/50 rounded hover:bg-cyan-500 hover:text-white transition-all text-xs font-mono font-bold"
                                            >
                                                <Plus size={16} /> 
                                                {activeSection === 'skills' && skillViewMode === 'CATEGORIES' ? 'NEW_CATEGORY' : 'NEW_ENTRY'}
                                            </button>
                                        )}
                                    </div>
                                )}
                                </div>
                            </div>

                            {/* DRAG AND DROP LISTS */}
                            
                            {/* LIST VIEW RENDERER */}
                            
                            {/* 1. SKILLS: Grouped Grid Layout */}
                            {activeSection === 'skills' ? (
                                <div className="space-y-8">
                                     {/* Derive Unique Categories from Data + Default Order */}
                                    {/* SKILLS ARCHITECTURE: VIEW 1 - CATEGORIES */}
                                    {/* SKILLS ARCHITECTURE: VIEW 1 - CATEGORIES */}
                                    {skillViewMode === 'CATEGORIES' && (
                                        <div className="space-y-4">
                                            {/* Sub-bar removed as requested, main button now handles NEW CAT */}
                                            
                                            <Reorder.Group values={localCategories} onReorder={onReorderCategories} className="space-y-2">
                                                {localCategories.map((cat: any) => (
                                                    <Reorder.Item key={cat.id} value={cat} className="cursor-grab active:cursor-grabbing">
                                                        <div 
                                                            onClick={() => {
                                                                setSkillViewMode('SKILLS_LIST');
                                                                setActiveCategory(cat);
                                                            }}
                                                            className="group flex items-center justify-between p-4 border border-white/5 rounded-lg bg-[#0c121e] hover:border-cyan-500/50 hover:bg-[#0f1624] transition-all relative"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-3 h-12 rounded-full bg-${cat.color}-500 opacity-80 shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></div>
                                                                <div>
                                                                    <h3 className="text-white font-mono font-bold group-hover:text-cyan-400 transition-colors">{cat.label}</h3>
                                                                    <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase opacity-50">ID: {cat.id}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-gray-600 font-mono bg-black/30 px-2 py-1 rounded">
                                                                    {localItems.filter((i: any) => i.category === cat.id).length} SKILLS
                                                                </span>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); handleEdit({ ...cat, isCategory: true }); }}
                                                                    className="p-2 text-gray-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Edit2 size={14} />
                                                                </button>
                                                                <button 
                                                                    onClick={(e) => { e.stopPropagation(); handleDelete({ ...cat, isCategory: true }); }}
                                                                    className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </Reorder.Item>
                                                ))}
                                            </Reorder.Group>
                                        </div>
                                    )}

                                    {/* SKILLS ARCHITECTURE: VIEW 2 - SKILL LIST */}
                                    {skillViewMode === 'SKILLS_LIST' && activeCategory && (
                                        <div className="space-y-4">
                                            {/* Sub-bar removed as requested, main toolbar handles Back/New */}
                                            
                                            {/* Filtered Reorder Group */}
                                            <Reorder.Group 
                                                values={localItems.filter((i: any) => i.category === activeCategory.id)} 
                                                onReorder={(newOrder) => {
                                                    const others = localItems.filter((i: any) => i.category !== activeCategory.id);
                                                    onReorderLocal([...others, ...newOrder]);
                                                }} 
                                                className="space-y-3"
                                            >
                                                {localItems
                                                    .filter((i: any) => i.category === activeCategory.id)
                                                    .map((item: any) => (
                                                    <Reorder.Item key={item.id} value={item} className="cursor-grab active:cursor-grabbing">
                                                         <div 
                                                            onClick={() => handleEdit(item)}
                                                            className="group flex flex-col justify-between p-4 border border-white/5 rounded-lg bg-[#0c121e] hover:border-cyan-500/50 transition-all hover:bg-[#0f1624] relative h-[80px]"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="text-white font-mono text-sm font-bold truncate pr-6">{item.name}</h3>
                                                                <div className="space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                     <button onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item); }} className="text-red-400 hover:text-red-300"><Trash2 size={12}/></button>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="space-y-1 mt-auto">
                                                                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                                                    <span>{item.version}</span>
                                                                    <span>{item.level}%</span>
                                                                </div>
                                                                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                                                    <div className={`h-full bg-${activeCategory.color || 'cyan'}-500`} style={{ width: `${item.level}%` }}></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Reorder.Item>
                                                ))}
                                            </Reorder.Group>
                                        </div>
                                    )}
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
                                                            <img src={item.image} className="w-full h-full object-cover object-top" alt="" />
                                                        </div>
                                                        <div className="min-w-0 flex-1 pr-2">
                                                            <h3 className="text-white font-mono group-hover:text-cyan-400 transition-colors truncate">{item.title}</h3>
                                                            <p className="text-xs text-gray-500 line-clamp-1 md:line-clamp-2 break-all">{item.desc}</p>
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
                <div className="px-4 md:px-6 py-4 border-t border-cyan-500/20 bg-[#050810] flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-0">
                    {view === 'EDIT' && (
                        <>
                            <div className="w-full md:w-auto">
                                {selectedItem && !['about', 'contact', 'hero'].includes(activeSection) && (
                                    <button 
                                        onClick={() => handleDelete(selectedItem)}
                                        disabled={isSaving}
                                        className="w-full md:w-auto px-4 py-3 md:py-2 rounded-lg font-mono text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} /> DELETE
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                                <button 
                                    onClick={() => setView('LIST')}
                                    className="w-full md:w-auto px-6 py-3 md:py-2 rounded-lg font-mono text-sm border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white transition-all"
                                >
                                    CANCEL
                                </button>
                                <button 
                                    onClick={() => handleSave(selectedItem)} 
                                    disabled={isSaving}
                                    className="w-full md:w-auto px-6 py-3 md:py-2 rounded-lg font-mono text-sm font-bold bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
