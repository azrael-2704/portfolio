import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { storage } from '../../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ResumeFormProps {
    initialData?: any;
    onChange: (data: any) => void;
    onBusy?: (isBusy: boolean) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ initialData, onChange, onBusy }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewUrl, setPreviewUrl] = useState(initialData?.resumeUrl || '');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Please upload a PDF file.');
            return;
        }

        setUploading(true);
        if (onBusy) onBusy(true);
        setError('');
        setSuccess('');

        try {
            console.log("Starting resume upload...");
            const storageRef = ref(storage, `resumes/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            console.log("Resume uploaded, getting URL...");
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log("Resume URL:", downloadURL);
            
            setPreviewUrl(downloadURL);
            onChange({ ...initialData, resumeUrl: downloadURL });
            setSuccess('Resume uploaded successfully!');
        } catch (err) {
            console.error("Resume upload failed:", err);
            setError('Upload failed. ' + (err as any).message);
        } finally {
            setUploading(false);
            if (onBusy) onBusy(false);
        }
    };

    return (
        <div className="space-y-6 text-gray-300 max-w-2xl mx-auto border border-white/10 p-6 rounded-xl bg-[#0c121e]">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                 <h3 className="font-mono text-cyan-400">UPLOAD_RESUME</h3>
            </div>
            
            <div className="space-y-4">
                 <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-cyan-500/50 transition-colors group bg-white/5 hover:bg-white/10">
                    <div className="p-4 rounded-full bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                        <Upload size={32} />
                    </div>
                    <div className="text-center">
                        <p className="font-mono text-sm text-gray-400">Drag & Drop or Click to Upload</p>
                        <p className="text-xs text-gray-600 mt-1">PDF Only (Max 5MB)</p>
                    </div>
                    <input 
                        type="file" 
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                 </div>

                 {uploading && <p className="text-center text-xs font-mono text-cyan-400 animate-pulse">UPLOADING_BYTES...</p>}
                 
                 {error && (
                    <div className="flex items-center gap-2 text-red-400 text-xs font-mono bg-red-500/10 p-3 rounded">
                        <AlertCircle size={14} /> {error}
                    </div>
                 )}

                 {success && (
                    <div className="flex items-center gap-2 text-green-400 text-xs font-mono bg-green-500/10 p-3 rounded">
                        <Check size={14} /> {success}
                    </div>
                 )}

                 {previewUrl && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg flex items-center justify-between border border-white/10">
                        <div className="flex items-center gap-3">
                            <FileText className="text-cyan-400" size={20} />
                            <div className="flex flex-col">
                                <span className="text-sm font-mono text-gray-300">Resumé File</span>
                                <span className="text-[10px] text-gray-500 truncate max-w-[200px]">{previewUrl}</span>
                            </div>
                        </div>
                        <a 
                            href={previewUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-400 hover:text-white underline font-mono"
                        >
                            VIEW_FILE
                        </a>
                    </div>
                 )}
            </div>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-gray-500 font-mono">OR USE LINK</span>
                <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="space-y-2">
                 <label className="text-xs font-mono text-cyan-400">EXTERNAL_URL</label>
                 <input 
                    type="text" 
                    value={previewUrl}
                    onChange={(e) => {
                        const val = e.target.value;
                        setPreviewUrl(val);
                        onChange({ ...initialData, resumeUrl: val });
                    }}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-[#050a14] border border-white/10 rounded p-2 text-white outline-none focus:border-cyan-500/50 text-xs font-mono"
                 />
            </div>
        </div>
    );
};

export default ResumeForm;
