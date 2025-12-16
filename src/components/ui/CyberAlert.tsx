import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import GlitchText from '../GlitchText';

interface CyberAlertProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'error' | 'success' | 'warning' | 'info';
    onConfirm?: () => void; // If present, shows "Confirm/Cancel" buttons
}

const CyberAlert: React.FC<CyberAlertProps> = ({ isOpen, onClose, title, message, type = 'info', onConfirm }) => {
    
    const getIcon = () => {
        switch (type) {
            case 'error': return <XCircle className="text-red-500" size={32} />;
            case 'success': return <CheckCircle className="text-green-500" size={32} />;
            case 'warning': return <AlertTriangle className="text-yellow-500" size={32} />;
            default: return <Info className="text-cyan-500" size={32} />;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'error': return 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] bg-red-950/20';
            case 'success': return 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] bg-green-950/20';
            case 'warning': return 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-yellow-950/20';
            default: return 'border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] bg-cyan-950/20';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Dialog */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className={`
                            relative w-full max-w-md bg-[#050a14] border-2 rounded-lg p-6 
                            backdrop-blur-xl pointer-events-auto
                            ${getColor()}
                        `}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                {getIcon()}
                                <h3 className="font-mono font-bold text-xl tracking-wider text-white">
                                    <GlitchText text={title} />
                                </h3>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="mb-8 font-mono text-sm text-gray-300 leading-relaxed">
                            {message}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4">
                            {onConfirm ? (
                                <>
                                    <button 
                                        onClick={onClose}
                                        className="px-4 py-2 rounded border border-white/10 hover:bg-white/5 text-gray-300 font-mono text-sm transition-colors"
                                    >
                                        CANCEL
                                    </button>
                                    <button 
                                        onClick={() => { onConfirm(); onClose(); }}
                                        className={`
                                            px-6 py-2 rounded font-mono text-xs font-bold uppercase tracking-widest
                                            bg-white/10 hover:bg-white/20 text-white border border-white/20
                                            transition-all
                                        `}
                                    >
                                        CONFIRM
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={onClose}
                                    className={`
                                        w-full py-3 rounded font-mono text-xs font-bold uppercase tracking-widest
                                        bg-white/5 hover:bg-white/10 text-white border border-white/10
                                        transition-all
                                    `}
                                >
                                    ACKNOWLEDGE
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CyberAlert;
