import React, { useState } from 'react';
import { useProfile } from '../../../hooks/usePortfolioData';

interface HeroFormProps {
    initialData?: any;
    onChange: (data: any) => void;
}

const HeroForm: React.FC<HeroFormProps> = ({ initialData, onChange }) => {
    // Hero data is usually part of 'profile'
    const { profile } = useProfile();
    const [formData, setFormData] = useState(initialData || profile || {
        name: '',
        title: '',
        bio: '',
        // Initialize button config if not present
        cta: {
             text: 'INITIALIZE_PORTFOLIO',
             link: '/projects'
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let newData;
        if (name.startsWith('cta.')) {
            const ctaField = name.split('.')[1];
            newData = {
                ...formData,
                cta: {
                    ...formData.cta,
                    [ctaField]: value
                }
            };
        } else {
            newData = { ...formData, [name]: value };
        }
        
        setFormData(newData);
        onChange(newData); // Propagate up
    };

    return (
        <div className="space-y-6 text-white font-mono p-4">
            <h3 className="text-xl text-cyan-400 border-b border-gray-700 pb-2">HERO_CONFIGURATION</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Display Name</label>
                    <input 
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="w-full bg-[#0c121e] border border-white/10 rounded p-2 text-white focus:border-cyan-500 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Professional Title</label>
                    <input 
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        className="w-full bg-[#0c121e] border border-white/10 rounded p-2 text-white focus:border-cyan-500 outline-none"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase">Short Bio (Hero Subtext)</label>
                <textarea 
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-[#0c121e] border border-white/10 rounded p-2 text-white focus:border-cyan-500 outline-none resize-none"
                />
            </div>

            <div className="border border-cyan-500/20 rounded p-4 bg-cyan-900/5">
                <h4 className="text-sm text-cyan-400 mb-4">PRIMARY_ACTION_BUTTON</h4>
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase">Button Text</label>
                    <input 
                        name="cta.text"
                        value={formData.cta?.text || 'INITIALIZE_PORTFOLIO'}
                        onChange={handleChange}
                        className="w-full bg-[#0c121e] border border-white/10 rounded p-2 text-white focus:border-cyan-500 outline-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default HeroForm;
