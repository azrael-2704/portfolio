
import React, { useState, useEffect } from 'react';
import { Map, Clock, CheckCircle2, Target } from 'lucide-react';

interface RoadmapFormProps {
    initialData?: any;
    onChange: (data: any) => void;
}

const RoadmapForm: React.FC<RoadmapFormProps> = ({ initialData, onChange }) => {
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        date: '',
        desc: '',
        status: 'planned' // planned | in-progress | completed
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
                     <Map size={16}/> EDIT_STRATEGY_NODE
                 </h3>
                 <div className={`text-xs font-bold font-mono px-2 py-1 rounded border ${
                     formData.status === 'completed' ? 'border-green-500 text-green-500' : 
                     formData.status === 'in-progress' ? 'border-amber-500 text-amber-500' : 'border-purple-500 text-purple-500'
                 }`}>
                     {formData.status.toUpperCase()}
                 </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400">INITIATIVE_TITLE</label>
                <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">TARGET_TIMELINE</label>
                    <input 
                        type="text" 
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        placeholder="e.g. Q3 2024"
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">EXECUTION_STATUS</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            onClick={() => handleChange('status', 'planned')}
                            className={`p-2 rounded flex justify-center border ${formData.status === 'planned' ? 'bg-purple-900/20 border-purple-500 text-purple-400' : 'border-white/10 hover:bg-white/5'}`}
                        >
                            <Target size={16} />
                        </button>
                        <button 
                            onClick={() => handleChange('status', 'in-progress')}
                            className={`p-2 rounded flex justify-center border ${formData.status === 'in-progress' ? 'bg-amber-900/20 border-amber-500 text-amber-400' : 'border-white/10 hover:bg-white/5'}`}
                        >
                            <Clock size={16} />
                        </button>
                        <button 
                            onClick={() => handleChange('status', 'completed')}
                            className={`p-2 rounded flex justify-center border ${formData.status === 'completed' ? 'bg-green-900/20 border-green-500 text-green-400' : 'border-white/10 hover:bg-white/5'}`}
                        >
                            <CheckCircle2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400">DESCRIPTION</label>
                <textarea 
                    value={formData.desc}
                    onChange={(e) => handleChange('desc', e.target.value)}
                    rows={3}
                    className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none resize-none"
                />
            </div>
        </div>
    );
};

export default RoadmapForm;
