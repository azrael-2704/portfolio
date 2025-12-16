
import React, { useState, useEffect } from 'react';
import { Calendar, Building, Briefcase, GraduationCap, Trophy, Award } from 'lucide-react';

interface TimelineFormProps {
    initialData?: any;
    onChange: (data: any) => void;
    restrictType?: string; // Optional: If we want to force a specific type
}

const TimelineForm: React.FC<TimelineFormProps> = ({ initialData, onChange, restrictType }) => {
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        org: '',
        date: '',
        desc: '',
        type: 'work', // work | education | certification | achievement
        side: 'right'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else if (restrictType) {
            setFormData(prev => ({ ...prev, type: restrictType }));
        }
    }, [initialData, restrictType]);

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
                 <h3 className="font-mono text-cyan-400">EDIT_TIMELINE_NODE</h3>
                 <div className="flex gap-2 text-xs font-mono">
                     {formData.type === 'work' && <Briefcase size={14} className="text-cyan-400" />}
                     {formData.type === 'education' && <GraduationCap size={14} className="text-purple-400" />}
                     {formData.type === 'achievement' && <Trophy size={14} className="text-amber-400" />}
                     {formData.type === 'certification' && <Award size={14} className="text-green-400" />}
                     <span className="uppercase text-gray-500">{formData.type}</span>
                 </div>
            </div>

            {/* Title & Org */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">TITLE / ROLE</label>
                    <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                        placeholder="e.g. Senior Developer"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                        <Building size={12}/> ORGANIZATION
                    </label>
                    <input 
                        type="text" 
                        value={formData.org}
                        onChange={(e) => handleChange('org', e.target.value)}
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                        placeholder="e.g. Google"
                    />
                </div>
            </div>

            {/* Date & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                        <Calendar size={12}/> DATE_RANGE
                    </label>
                    <input 
                        type="text" 
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                        placeholder="e.g. 2023 - Present"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">ENTRY_TYPE</label>
                    <select 
                        value={formData.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none appearance-none capitalize"
                    >
                        <option value="work">Work Experience</option>
                        <option value="education">Education</option>
                        <option value="certification">Certification</option>
                        <option value="achievement">Achievement / Award</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">ALIGNMENT_SIDE</label>
                    <select 
                        value={formData.side}
                        onChange={(e) => handleChange('side', e.target.value)}
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none appearance-none capitalize"
                    >
                        <option value="right">Right</option>
                        <option value="left">Left</option>
                    </select>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400">DESCRIPTION</label>
                <textarea 
                    value={formData.desc}
                    onChange={(e) => handleChange('desc', e.target.value)}
                    rows={4}
                    className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none resize-none leading-relaxed"
                />
            </div>
        </div>
    );
};

export default TimelineForm;
