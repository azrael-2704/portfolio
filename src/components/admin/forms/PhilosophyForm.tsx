
import React, { useState, useEffect } from 'react';
import { Box } from 'lucide-react';

interface PhilosophyFormProps {
    initialData?: any;
    onChange: (data: any) => void;
}

const PhilosophyForm: React.FC<PhilosophyFormProps> = ({ initialData, onChange }) => {
    const [formData, setFormData] = useState({
        title: '',
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
                 <h3 className="font-mono text-cyan-400 flex items-center gap-2">
                     <Box size={16}/> EDIT_AXIOM
                 </h3>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400">VALUE_TITLE</label>
                <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                    placeholder="e.g. First Principles"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400">PRINCIPLE_DESCRIPTION</label>
                <textarea 
                    value={formData.desc}
                    onChange={(e) => handleChange('desc', e.target.value)}
                    rows={3}
                    className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none resize-none"
                    placeholder="Short, punchy description of the value."
                />
            </div>
        </div>
    );
};

export default PhilosophyForm;
