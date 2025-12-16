import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Initialize worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import GlitchText from '../GlitchText';

const Resume: React.FC = () => {
    const resumePath = "/AmartyaResume.pdf";
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageWidth, setPageWidth] = useState(800);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    // Responsive width handler
    useEffect(() => {
        function handleResize() {
            const container = document.getElementById('resume-container');
            if (container) {
                setPageWidth(container.clientWidth - 60); // Padding adjustment
            }
        }
        window.addEventListener('resize', handleResize);
        setTimeout(handleResize, 100); // Initial call with slight delay for layout
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section className="min-h-screen pt-[34px] pb-20 px-6 md:px-16 relative z-10 w-full overflow-hidden flex flex-col h-screen">
             <div className="w-full mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
                 <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-[-10px]"
                 >
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="text-cyan-400" size={24} />
                        <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white">
                            <GlitchText text="RESUME_CV" />
                        </h1>
                    </div>
                    <p className="text-gray-400 font-mono text-sm border-l-2 border-cyan-500/30 pl-4 py-1">{'>'} PROFESSIONAL HISTORY AND QUALIFICATIONS</p>
                 </motion.div>

                 <motion.a 
                    href={resumePath}
                    download="Amartya_Anayachala_Resume.pdf"
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 px-6 py-3 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-sm hover:bg-cyan-500/20 transition-colors"
                >
                     <Download size={18} /> DOWNLOAD_PDF
                 </motion.a>
            </div>

            <div className="max-w-5xl mx-auto w-full flex-grow bg-[#0c121e]/50 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm relative flex flex-col">
                 <div id="resume-container" className="flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar p-6 bg-[#1a1f2e] text-center">
                     <Document
                        file={resumePath}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="inline-block shadow-xl"
                        loading={<div className="text-cyan-400 animate-pulse font-mono mt-10">LOADING_DOCUMENT_STREAM...</div>}
                        error={<div className="text-red-400 font-mono mt-10">FAILED_TO_LOAD_DOCUMENT_STREAM</div>}
                     >
                        {Array.from(new Array(numPages || 0), (el, index) => (
                           <Page 
                              key={`page_${index + 1}`} 
                              pageNumber={index + 1} 
                              width={pageWidth}
                              className="mb-6 resume-page"
                              renderTextLayer={true}
                              renderAnnotationLayer={true}
                           />
                        ))}
                     </Document>
                 </div>
            </div>
            
            <style>{`
                /* Hide react-pdf canvas if not loaded to prevent white flash if any */
                .resume-page canvas {
                    margin-bottom: 0 !important;
                }
            `}</style>
        </section>
    );
};
export default Resume;
