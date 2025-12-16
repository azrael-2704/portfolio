
import React, { useState, useEffect } from 'react';

interface SkillFormProps {
    initialData?: any;
    onChange: (data: any) => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ initialData, onChange }) => {
    // Default Empty State
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        category: 'ml',
        level: 50,
        version: '',
        desc: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => {
            const up = { ...prev, [field]: value };
            onChange(up);
            return up;
        });
    };

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
                
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">CATEGORY</label>
                    <input 
                        list="categories"
                        type="text"
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                        placeholder="Select or Type New..."
                    />
                    <datalist id="categories">
                        <option value="ml">AI / Machine Learning</option>
                        <option value="ds">Data Science</option>
                        <option value="dev">Web Development</option>
                        <option value="ops">DevOps / Cloud</option>
                        <option value="core">Core / Languages</option>
                    </datalist>
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
