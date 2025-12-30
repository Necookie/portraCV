"use client";

import React, { useState } from 'react';
import { Upload, Printer, Image as ImageIcon } from 'lucide-react';

export default function PhotoEngine() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const triggerPrint = () => {
        window.print();
    };

    return (
        <>
            {/* --- FIXED PRINT STYLES --- */}
            {/* Kept this here because it is specific to printing photos */}
            <style>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #print-canvas, #print-canvas * {
                        visibility: visible;
                    }
                    #print-canvas {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding-top: 0.5in;
                    }
                    .print-row-container {
                        width: 8in; 
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: flex-start;
                        margin-bottom: 0;
                    }
                    .photo-2x2 {
                        width: 2in;
                        height: 2in;
                        box-sizing: border-box;
                        border: 0.5px solid #ddd;
                    }
                    .photo-1x1 {
                        width: 1in;
                        height: 1in;
                        box-sizing: border-box;
                        border: 0.5px solid #ddd;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        display: block;
                    }
                }
            `}</style>

            {/* --- MAIN CONTENT --- */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT: Controls */}
                <div className="lg:col-span-5 flex flex-col gap-6 print:hidden">
                    
                    {/* Upload Zone */}
                    <div className="relative group">
                        <div className={`
                            aspect-[4/3] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 cursor-pointer
                            ${selectedImage 
                                ? 'border-indigo-500/50 bg-indigo-50/50' 
                                : 'border-slate-300 bg-white hover:border-indigo-500 hover:bg-indigo-50/30'
                            }
                        `}>
                            {selectedImage ? (
                                <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-xl shadow-sm" />
                            ) : (
                                <>
                                    <div className="bg-indigo-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Upload className="text-indigo-600" size={32} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">Upload Selfie</h3>
                                    <p className="text-slate-500 text-sm mt-1">Drag & drop or click to browse</p>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    </div>

                    {/* Print Button */}
                    <button 
                        onClick={triggerPrint} 
                        className="w-full bg-white border border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        <Printer size={20} /> 
                        <span>Print / Save PDF</span>
                    </button>
                </div>

                {/* RIGHT: Preview & Print Area */}
                <div className="lg:col-span-7">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-h-[600px] flex flex-col print:shadow-none print:border-none print:rounded-none">
                        
                        {/* Header (Screen only) */}
                        <div className="border-b border-slate-200 p-4 bg-slate-50/80 flex justify-between items-center print:hidden">
                            <h2 className="font-bold text-slate-800 text-lg">A4 Print Preview</h2>
                            <span className="text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-500 shadow-sm">210 x 297 mm</span>
                        </div>

                        {/* --- ACTUAL PRINTABLE CANVAS --- */}
                        <div id="print-canvas" className="p-8 print:p-0 bg-white flex-1">
                            
                            {/* Row 1: 2x2 Photos */}
                            <div className="print-row-container grid grid-cols-4 gap-4 print:block print:gap-0">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={`2x2-${item}`} className="photo-2x2 aspect-square bg-slate-100 border border-slate-200 relative print:aspect-auto print:border-none">
                                        {selectedImage ? (
                                            <img src={selectedImage} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <ImageIcon size={24} />
                                            </div>
                                        )} 
                                    </div>
                                ))}
                            </div>

                            {/* Row 2: 1x1 Photos */}
                            <div className="print-row-container grid grid-cols-4 gap-4 print:block print:gap-0 mt-8 print:mt-0">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                    <div key={`1x1-${item}`} className="photo-1x1 aspect-square bg-slate-100 border border-slate-200 relative print:aspect-auto print:border-none">
                                        {selectedImage ? (
                                            <img src={selectedImage} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}