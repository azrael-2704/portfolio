
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link, Github, Layers, Camera } from 'lucide-react';
import { compressImage } from '../../../lib/imageUtils';

interface ProjectFormProps {
    initialData?: any;
    onChange: (data: any) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onChange }) => {
    // Default Empty State
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        desc: '',
        image: '',
        link: '',
        github: '',
        type: 'product', // 'research' | 'product' | 'experiment'
        domain: '',
        featured: false,
        tech: [] as string[],
        details: [] as string[]
    });

    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError('');

        try {
            // Convert to Base64 (Resize first for safety, landscape optimized)
            const compressedBlob = await compressImage(file, 1200, 0.8); // 1200px width for project shots
            
            // Read Blob as DataURL (Base64)
            const reader = new FileReader();
            reader.readAsDataURL(compressedBlob);
            reader.onloadend = () => {
                const base64data = reader.result as string;
                handleChange('image', base64data);
                setUploading(false);
            };
        } catch (err) {
            console.error(err);
            setUploadError('Failed to process image.');
            setUploading(false);
        }
    };

    // Array manipulation helpers
    const handleArrayChange = (field: 'tech' | 'details', index: number, value: string) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => {
            const up = { ...prev, [field]: newArray };
            onChange(up);
            return up;
        });
    };

    const addArrayItem = (field: 'tech' | 'details') => {
        setFormData(prev => {
            const up = { ...prev, [field]: [...prev[field], ''] };
            onChange(up);
            return up;
        });
    };

    const removeArrayItem = (field: 'tech' | 'details', index: number) => {
        setFormData(prev => {
            const up = {
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index)
            };
            onChange(up);
            return up;
        });
    };

    return (
        <div className="space-y-6 text-gray-300">
            {/* Top Section: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">PROJECT_TITLE</label>
                    <input 
                        type="text" 
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full bg-[#0c121e] border border-white/10 rounded p-2 text-white focus:border-cyan-500/50 outline-none"
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">DOMAIN</label>
                    <div className="relative">
                        <Layers size={14} className="absolute left-3 top-3 text-gray-500" />
                        <input 
                            type="text" 
                            value={formData.domain}
                            onChange={(e) => handleChange('domain', e.target.value)}
                            className="w-full bg-[#0c121e] border border-white/10 rounded p-2 pl-9 text-white focus:border-cyan-500/50 outline-none"
                            placeholder="e.g. Computer Vision"
                        />
                    </div>
                </div>
            </div>

            {/* Type & Featured */}
            <div className="flex flex-col md:flex-row gap-6">
                 <div className="space-y-2 w-full md:w-1/2">
                    <label className="text-xs font-mono text-cyan-400">TYPE</label>
                    <select 
                        value={formData.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                        className="w-full bg-[#0c121e] border border-white/10 rounded p-2 text-white focus:border-cyan-500/50 outline-none appearance-none"
                    >
                        <option value="research">Research</option>
                        <option value="product">Product</option>
                        <option value="experiment">Experiment</option>
                    </select>
                 </div>
                 <div className="space-y-2 flex items-center pt-0 md:pt-6">
                    <input 
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleChange('featured', e.target.checked)} 
                        className="mr-2 accent-cyan-500"
                    />
                    <label className="text-sm">Featured Project?</label>
                 </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400">DESCRIPTION (SHORT)</label>
                <textarea 
                    value={formData.desc}
                    onChange={(e) => handleChange('desc', e.target.value)}
                    rows={2}
                    className="w-full bg-[#0c121e] border border-white/10 rounded p-2 text-white focus:border-cyan-500/50 outline-none resize-none"
                />
            </div>

            {/* Media & Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-3 space-y-4">
                    <label className="text-xs font-mono text-cyan-400">PROJECT VISUAL</label>
                    
                    {/* Image Upload Area */}
                    <div className="w-full h-48 rounded border border-white/10 overflow-hidden bg-black/50 relative group">
                        {formData.image ? (
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                                <Camera size={32} />
                                <span className="text-xs font-mono">UPLOAD PREVIEW</span>
                            </div>
                        )}
                        
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {uploading ? (
                                <span className="text-xs text-cyan-400 animate-pulse font-mono">ENCODING...</span>
                            ) : (
                                <div className="text-white flex flex-col items-center gap-1">
                                    <Camera size={24} />
                                    <span className="text-[10px] font-mono uppercase tracking-widest">Click to Upload</span>
                                </div>
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

                    {/* URL Fallback */}
                    <div className="relative">
                        <input 
                            type="text"
                            value={formData.image}
                            onChange={(e) => handleChange('image', e.target.value)}
                            className="w-full bg-[#0c121e] border border-white/10 rounded p-2 text-gray-500 text-xs focus:border-cyan-500/50 outline-none font-mono focus:text-white transition-colors"
                            placeholder="OR PASTE IMAGE URL..."
                        />
                        {uploadError && <p className="absolute right-0 top-0 -mt-6 text-xs text-red-400">{uploadError}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                     <label className="text-xs font-mono text-cyan-400 flex items-center gap-1"><Github size={12}/> GITHUB_URL</label>
                     <input 
                        type="text"
                        value={formData.github}
                        onChange={(e) => handleChange('github', e.target.value)}
                        className="w-full bg-[#0c121e] border border-white/10 rounded p-2 text-gray-400 text-xs"
                     />
                </div>
                <div className="space-y-2">
                     <label className="text-xs font-mono text-cyan-400 flex items-center gap-1"><Link size={12}/> DEMO_URL</label>
                     <input 
                        type="text"
                        value={formData.link}
                        onChange={(e) => handleChange('link', e.target.value)}
                        className="w-full bg-[#0c121e] border border-white/10 rounded p-2 text-gray-400 text-xs"
                     />
                </div>
            </div>

            {/* Arrays: Tech & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* Tech Stack */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-mono text-cyan-400">TECH_STACK</label>
                        <button onClick={() => addArrayItem('tech')} className="text-xs flex items-center gap-1 hover:text-cyan-400"><Plus size={12}/> ADD</button>
                    </div>
                    {formData.tech.map((t, i) => (
                        <div key={i} className="flex gap-2">
                            <input 
                                value={t}
                                onChange={(e) => handleArrayChange('tech', i, e.target.value)}
                                className="flex-1 bg-[#0c121e] border border-white/10 rounded p-1.5 text-xs text-white"
                                placeholder="e.g. React"
                            />
                            <button onClick={() => removeArrayItem('tech', i)} className="text-red-500/50 hover:text-red-500"><Trash2 size={14}/></button>
                        </div>
                    ))}
                </div>

                {/* Details/Bullets */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-mono text-cyan-400">KEY_DETAILS (BULLETS)</label>
                        <button onClick={() => addArrayItem('details')} className="text-xs flex items-center gap-1 hover:text-cyan-400"><Plus size={12}/> ADD</button>
                    </div>
                    {formData.details.map((d, i) => (
                        <div key={i} className="flex gap-2">
                            <textarea 
                                value={d}
                                onChange={(e) => handleArrayChange('details', i, e.target.value)}
                                rows={2}
                                className="flex-1 bg-[#0c121e] border border-white/10 rounded p-1.5 text-xs text-white resize-none"
                                placeholder="Detail point..."
                            />
                            <button onClick={() => removeArrayItem('details', i)} className="text-red-500/50 hover:text-red-500 self-start mt-2"><Trash2 size={14}/></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectForm;
