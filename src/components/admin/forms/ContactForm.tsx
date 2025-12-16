
import React, { useState, useEffect } from 'react';
import { Share2, Mail, Github, Linkedin, Instagram } from 'lucide-react';

interface ContactFormProps {
    initialData?: any;
    onChange: (data: any) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ initialData, onChange }) => {
    // Expects initialData to be the `PROFILE.social` object 
    const [formData, setFormData] = useState({
        email: '',
        github: '',
        linkedin: '',
        instagram: ''
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
                     <Share2 size={16}/> EDIT_CHANNELS
                 </h3>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                        <Mail size={12}/> EMAIL_ADDRESS
                    </label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                        <Github size={12}/> GITHUB_URL
                    </label>
                    <input 
                        type="text" 
                        value={formData.github}
                        onChange={(e) => handleChange('github', e.target.value)}
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                        <Linkedin size={12}/> LINKEDIN_URL
                    </label>
                    <input 
                        type="text" 
                        value={formData.linkedin}
                        onChange={(e) => handleChange('linkedin', e.target.value)}
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                    />
                </div>

                 <div className="space-y-2">
                    <label className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                        <Instagram size={12}/> INSTAGRAM_URL (OPTIONAL)
                    </label>
                    <input 
                        type="text" 
                        value={formData.instagram}
                        onChange={(e) => handleChange('instagram', e.target.value)}
                        className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50"
                    />
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
