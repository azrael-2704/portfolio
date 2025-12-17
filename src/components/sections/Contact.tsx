import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Lock, Signal, Mail, CheckCircle, Github, Linkedin, Instagram } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useProfile } from '../../hooks/usePortfolioData';

import GlitchText from '../GlitchText';
import CyberAlert from '../ui/CyberAlert';

const Contact: React.FC = () => {
    const [formState, setFormState] = useState<'idle' | 'encrypting' | 'sending' | 'sent'>('idle');
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const { profile } = useProfile();

    const [alertState, setAlertState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'error' | 'success' | 'warning' | 'info';
    }>({ isOpen: false, title: '', message: '', type: 'info' });

    useEffect(() => {
        // Initialize EmailJS explicitly
        const key = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        if (key) emailjs.init(key);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState('encrypting');

        // Debug Logging
        console.log("Attempting EmailJS Send with keys:", {
            Service: import.meta.env.VITE_EMAILJS_SERVICE_ID ? 'Received' : 'MISSING',
            Template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ? 'Received' : 'MISSING',
            Key: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? 'Received' : 'MISSING'
        });

        const formData = new FormData(e.currentTarget);
        const templateParams = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            time: new Date().toLocaleString(),
        };

        try {
            await Promise.all([
                // Min animation time
                new Promise(resolve => setTimeout(resolve, 1500)),
                // Actual request
                emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                    templateParams
                )
            ]);
            
            setFormState('sent');
            setAlertState({
                isOpen: true,
                title: 'TRANSMISSION_COMPLETE',
                message: 'Your encrypted message has been successfully uplinked to the developer.',
                type: 'success'
            });

            setTimeout(() => {
                setFormState('idle');
                (e.target as HTMLFormElement).reset();
            }, 3000);
        } catch (error: any) {
            console.error('Transmission failed details:', error);
            const errorMessage = error?.text || error?.message || 'Unknown network error';
            
            setFormState('idle');
            setAlertState({
                isOpen: true,
                title: 'UPLINK_FAILED',
                message: `Transmission Error: ${errorMessage}. Check keys & network.`,
                type: 'error'
            });
        }
    };

    return (
        <section className="pt-[34px] pb-20 px-6 md:px-16 relative z-10 w-full overflow-hidden">
             
             <CyberAlert 
                isOpen={alertState.isOpen}
                onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
             />

             {/* Header */}
             <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-16 mt-[-10px]"
            >
                <div className="flex items-center gap-3 mb-2">
                    <Signal className="text-cyan-400" size={24} />
                    <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white">
                        <GlitchText text="SECURE_UPLINK" />
                    </h1>
                </div>
                <p className="text-gray-400 font-mono text-sm border-l-2 border-cyan-500/30 pl-4 py-1">
                    {'>'} ESTABLISHING ENCRYPTED CONNECTION... <span className="animate-pulse">_</span>
                </p>
            </motion.div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                
                {/* Left: Info Terminal */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#0c121e]/80 border border-white/10 rounded-xl p-8 backdrop-blur-md relative overflow-hidden"
                >
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -z-10" />

                    <div className="flex items-center gap-2 text-cyan-500/70 font-mono text-sm mb-6">
                        <Lock size={16} />
                        <span>/channels/secure_comms</span>
                    </div>

                    <div className="space-y-6">
                        <p className="text-gray-300 leading-relaxed">
                            Start a secure transmission. All messages are encrypted end-to-end relative to the observer's frame of reference.
                        </p>
                        
                        <div className="space-y-4 pt-4">
                            <button onClick={() => window.location.href = profile.social.email.startsWith('mailto:') ? profile.social.email : `mailto:${profile.social.email}`} className="flex items-center gap-4 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer group w-full focus:outline-none">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <span className="font-mono text-sm">anayachala.dev [at] gmail</span>
                            </button>

                            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <Github size={18} />
                                </div>
                                <span className="font-mono text-sm">GITHUB_REPO</span>
                            </a>

                            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    <Linkedin size={18} />
                                </div>
                                <span className="font-mono text-sm">PROFESSIONAL_NETWORK</span>
                            </a>

                            {(profile.social as any).instagram && (
                                <a href={(profile.social as any).instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-400 hover:text-pink-400 transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                                        <Instagram size={18} />
                                    </div>
                                    <span className="font-mono text-sm">VISUAL_LOGS</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Status Log */}
                    <div className="mt-8 pt-[34px] border-t border-white/5 font-mono text-xs text-green-500/70 space-y-1">
                        <div>{'>'} PORT 443: OPEN</div>
                        <div>{'>'} HANDSHAKE: ACKNOWLEDGED</div>
                        <div>{'>'} LATENCY: 12ms</div>
                    </div>
                </motion.div>

                {/* Right: Input Form */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-20"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div className="relative group">
                            <label className={`absolute left-0 -top-6 font-mono text-xs transition-colors ${focusedField === 'name' ? 'text-cyan-400' : 'text-gray-500'}`}>
                                IDENTITY_KEY
                            </label>
                            <input 
                                type="text" 
                                name="name"
                                required
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full bg-transparent border-b border-white/20 py-2 font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder-gray-700"
                                placeholder="ENTER NAME"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative group pt-4">
                            <label className={`absolute left-0 -top-2 font-mono text-xs transition-colors ${focusedField === 'email' ? 'text-cyan-400' : 'text-gray-500'}`}>
                                RETURN_ADDRESS
                            </label>
                            <input 
                                type="email" 
                                name="email"
                                required
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full bg-transparent border-b border-white/20 py-2 font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder-gray-700"
                                placeholder="ENTER EMAIL"
                            />
                        </div>

                        {/* Message */}
                        <div className="relative group pt-4">
                            <label className={`absolute left-0 -top-2 font-mono text-xs transition-colors ${focusedField === 'msg' ? 'text-cyan-400' : 'text-gray-500'}`}>
                                DATA_PACKET
                            </label>
                            <textarea 
                                rows={4}
                                name="message"
                                required
                                onFocus={() => setFocusedField('msg')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full bg-transparent border-b border-white/20 py-2 font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder-gray-700 resize-none custom-scrollbar"
                                placeholder="INPUT MESSAGE STREAM..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={formState !== 'idle'}
                                className={`
                                    w-full py-4 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono tracking-widest uppercase
                                    hover:bg-cyan-500/20 hover:border-cyan-400 transition-all flex items-center justify-center gap-3 group
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                            >
                                {formState === 'idle' && (
                                    <>
                                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                        <span>INITIATE_TRANSMISSION</span>
                                    </>
                                )}
                                {formState === 'encrypting' && (
                                    <>
                                        <Lock size={18} className="animate-spin" />
                                        <span>ENCRYPTING...</span>
                                    </>
                                )}
                                {formState === 'sending' && (
                                    <>
                                        <Signal size={18} className="animate-pulse" />
                                        <span>UPLOADING...</span>
                                    </>
                                )}
                                {formState === 'sent' && (
                                    <>
                                        <CheckCircle size={18} />
                                        <span>TRANSMISSION COMPLETE</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
