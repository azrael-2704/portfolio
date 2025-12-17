
import React, { useState, useEffect } from 'react';
import { useSkillCategories } from '../../../hooks/usePortfolioData';
import { ChevronDown } from 'lucide-react';

interface SkillFormProps {
    initialData?: any;
    onChange: (data: any) => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ initialData, onChange }) => {
    const { data: categories } = useSkillCategories();

    // Default Empty State
    const [formData, setFormData] = useState({
        id: '',
        name: '',       // used for Skill
        label: '',      // used for Category
        category: 'ml', // used for Skill
        color: 'cyan',  // used for Category (and fallback for skill?)
        level: 50,
        version: '',
        desc: '',
        isCategory: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData({ ...formData, ...initialData });
        }
    }, [initialData]);

    const handleChange = (field: string, value: any) => {
        const up = { ...formData, [field]: value };
        // Sync name/label if needed? No, separate fields is safer.
        setFormData(up);
        onChange(up);
    };

    // RENDER: CATEGORY FORM
    if (formData.isCategory) {
        return (
            <div className="space-y-6 text-gray-300 max-w-2xl mx-auto border border-white/10 p-6 rounded-xl bg-[#0c121e]">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                     <h3 className="font-mono text-cyan-400">EDIT_CATEGORY_NODE</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-cyan-400">CATEGORY_ID (SLUG)</label>
                        <input 
                            type="text" 
                            value={formData.id}
                            onChange={(e) => handleChange('id', e.target.value)}
                            // If it's a new item, allow edit. If existing, allow but maybe warn? 
                            // User requested ability to edit.
                            className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50 font-mono text-sm"
                            placeholder="e.g. ml-ops"
                        />
                        <p className="text-[10px] text-gray-500">Unique identifier for this category (used in URL/filters).</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-cyan-400">CATEGORY_LABEL</label>
                        <input 
                            type="text" 
                            value={formData.label}
                            onChange={(e) => handleChange('label', e.target.value)}
                            className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-cyan-400">COLOR_THEME</label>
                        <div className="flex gap-3">
                            {['indigo', 'cyan', 'teal', 'green', 'purple', 'pink', 'rose', 'red', 'orange', 'amber'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => handleChange('color', color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                                        formData.color === color ? `border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.5)]` : `border-transparent opacity-50 hover:opacity-100`
                                    } bg-${color}-500`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: SKILL FORM (Default)
    return (
        <div className="space-y-6 text-gray-300 max-w-2xl mx-auto border border-white/10 p-6 rounded-xl bg-[#0c121e]">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                 <h3 className="font-mono text-cyan-400">EDIT_SKILL_NODE</h3>
                 {formData.id && <span className="text-xs font-mono text-gray-600">ID: {formData.id}</span>}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">SKILL_NAME</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                    />
                </div>
                
                <div className="space-y-2 relative">
                    <label className="text-xs font-mono text-cyan-400">CATEGORY</label>
                    <div className="relative">
                        <select 
                            value={formData.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50 appearance-none cursor-pointer"
                        >
                            {categories.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.label}
                                </option>
                            ))}
                           {/* Add 'other' option just in case */}
                           <option value="other">Other / Archive</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">MASTERY_LEVEL ({formData.level}%)</label>
                    <input 
                        type="range"
                        min="0"
                        max="100"
                        value={formData.level}
                        onChange={(e) => handleChange('level', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">VERSION_TAG</label>
                     <input 
                        type="text" 
                        value={formData.version}
                        onChange={(e) => handleChange('version', e.target.value)}
                        placeholder="e.g. v2.0 or 2024"
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-gray-400 text-xs outline-none"
                    />
                 </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400">DESCRIPTION</label>
                <textarea 
                    value={formData.desc}
                    onChange={(e) => handleChange('desc', e.target.value)}
                    rows={2}
                    className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none resize-none"
                />
            </div>
        </div>
    );
};

export default SkillForm;
