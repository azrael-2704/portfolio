
import React, { useState, useEffect } from 'react';
import { User, Plus, X, BarChart, Camera } from 'lucide-react';

import { compressImage } from '../../../lib/imageUtils';

interface ProfileFormProps {
    initialData?: any;
    onChange: (data: any) => void;
    onBusy?: (isBusy: boolean) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onChange, onBusy }) => {
    // We expect initialData to be the full PROFILE object for the 'about' section
    const [formData, setFormData] = useState({
        name: '',
        about: '',
        titles: [] as string[],
        stats: [] as { label: string; value: string }[],
        profileImage: ''
    });

    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        if (onBusy) onBusy(true);
        setUploadError('');

        try {
            // Convert to Base64 (Resize first for safety)
            const compressedBlob = await compressImage(file, 800, 0.8);
            
            // Read Blob as DataURL (Base64)
            const reader = new FileReader();
            reader.readAsDataURL(compressedBlob);
            reader.onloadend = () => {
                const base64data = reader.result as string;
                handleChange('profileImage', base64data);
                setUploading(false);
                if (onBusy) onBusy(false);
            };
        } catch (err) {
            console.error(err);
            setUploadError('Failed to process image.');
            setUploading(false);
            if (onBusy) onBusy(false);
        }
    };

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => {
            const up = { ...prev, [field]: value };
            onChange(up); // Propagate up
            return up;
        });
    };

    // Titles Array
    const addTitle = () => handleChange('titles', [...formData.titles, '']);
    const updateTitle = (index: number, val: string) => {
        const newTitles = [...formData.titles];
        newTitles[index] = val;
        handleChange('titles', newTitles);
    };
    const removeTitle = (index: number) => {
        handleChange('titles', formData.titles.filter((_, i) => i !== index));
    };

    // Stats Array
    const addStat = () => handleChange('stats', [...formData.stats, { label: 'LABEL', value: '0' }]);
    const updateStat = (index: number, field: 'label' | 'value', val: string) => {
        const newStats = [...formData.stats];
        newStats[index] = { ...newStats[index], [field]: val };
        handleChange('stats', newStats);
    };
    const removeStat = (index: number) => {
        handleChange('stats', formData.stats.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6 text-gray-300 max-w-2xl mx-auto border border-white/10 p-6 rounded-xl bg-[#0c121e]">
             {/* Header */}
             <div className="flex justify-between items-center border-b border-white/10 pb-4">
                 <h3 className="font-mono text-cyan-400 flex items-center gap-2">
                     <User size={16}/> EDIT_IDENTITY
                 </h3>
            </div>

            {/* Profile Image Upload */}
            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400">PROFILE_IMAGE</label>
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded border border-white/10 overflow-hidden bg-black/50 relative group">
                        {formData.profileImage ? (
                            <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <User size={24} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {uploading ? (
                                <span className="text-[10px] text-cyan-400 animate-pulse">Wait...</span>
                            ) : (
                                <Camera size={20} className="text-white" />
                            )}
                        </div>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">
                            Recommended: Square Aspect Ratio (1:1). 
                            <br/>
                            Auto-fit to frame enabled.
                        </p>
                        {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400">DISPLAY_NAME</label>
                <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                />
            </div>

            {/* Titles */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-cyan-400">PROFESSIONAL_TITLES</label>
                    <button onClick={addTitle} className="text-cyan-400 hover:text-white"><Plus size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {formData.titles.map((t, i) => (
                        <div key={i} className="flex gap-1">
                            <input 
                                value={t}
                                onChange={(e) => updateTitle(i, e.target.value)}
                                className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white text-sm outline-none"
                            />
                            <button onClick={() => removeTitle(i)} className="text-gray-500 hover:text-red-400"><X size={14}/></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400">BIO_TEXT</label>
                <textarea 
                    value={formData.about}
                    onChange={(e) => handleChange('about', e.target.value)}
                    rows={6}
                    className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none resize-none leading-relaxed"
                />
            </div>

            {/* Stats Matrix */}
             <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                        <BarChart size={14}/> STAT_MATRIX
                    </label>
                    <button onClick={addStat} className="text-cyan-400 hover:text-white"><Plus size={14}/></button>
                </div>
                <div className="space-y-2">
                    {formData.stats.map((stat, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input 
                                value={stat.value}
                                onChange={(e) => updateStat(i, 'value', e.target.value)}
                                className="w-20 bg-[#050a14] border border-white/10 rounded p-2 text-white text-sm outline-none text-right font-mono"
                                placeholder="Value"
                            />
                            <input 
                                value={stat.label}
                                onChange={(e) => updateStat(i, 'label', e.target.value)}
                                className="flex-1 bg-[#050a14] border border-white/10 rounded p-2 text-gray-400 text-sm outline-none uppercase"
                                placeholder="Label"
                            />
                            <button onClick={() => removeStat(i)} className="text-gray-500 hover:text-red-400"><X size={14}/></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;
