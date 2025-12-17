
import React, { useState, useEffect } from 'react';
import { BookOpen, Tag, Plus, X } from 'lucide-react';

interface BlogFormProps {
    initialData?: any;
    onChange: (data: any) => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ initialData, onChange }) => {
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        desc: '',
        date: '',
        readTime: '',
        tags: [] as string[],
        link: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (field: string, value: any) => {
        const up = { ...formData, [field]: value };
        setFormData(up);
        onChange(up);
    };

    const handleTagChange = (index: number, value: string) => {
        const newTags = [...formData.tags];
        newTags[index] = value;
        handleChange('tags', newTags);
    };

    const addTag = () => {
        handleChange('tags', [...formData.tags, '']);
    };

    const removeTag = (index: number) => {
        handleChange('tags', formData.tags.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6 text-gray-300 max-w-2xl mx-auto border border-white/10 p-6 rounded-xl bg-[#0c121e]">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                 <h3 className="font-mono text-cyan-400 flex items-center gap-2">
                     <BookOpen size={16}/> EDIT_LOG_ENTRY
                 </h3>
                 <span className="text-xs font-mono text-gray-500">ID: {formData.id || 'NEW'}</span>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400">POST_TITLE</label>
                <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">PUBLISH_DATE</label>
                    <input 
                        type="text" 
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        placeholder="e.g. March 15, 2024"
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400">READ_TIME</label>
                    <input 
                        type="text" 
                        value={formData.readTime}
                        onChange={(e) => handleChange('readTime', e.target.value)}
                        placeholder="e.g. 5 min read"
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-mono text-cyan-400">EXTERNAL_LINK</label>
                <input 
                    type="text" 
                    value={formData.link}
                    onChange={(e) => handleChange('link', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                />
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

            {/* Tags Array */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                        <Tag size={12}/> METADATA_TAGS
                    </label>
                    <button onClick={addTag} className="text-cyan-400 hover:text-white transition-colors">
                        <Plus size={14} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, i) => (
                        <div key={i} className="flex items-center gap-1 bg-[#050a14] border border-white/10 rounded px-2 py-1">
                            <input
                                value={tag}
                                onChange={(e) => handleTagChange(i, e.target.value)}
                                className="bg-transparent text-xs text-gray-300 outline-none w-20"
                                placeholder="Tag..."
                            />
                            <button onClick={() => removeTag(i)} className="text-gray-500 hover:text-red-400">
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {formData.tags.length === 0 && (
                        <span className="text-xs text-gray-600 italic">No tags added.</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogForm;
