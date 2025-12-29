"use client";

import React, { useState } from 'react';
import { Camera, Menu, X, Upload, Printer, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function PhotoEngine() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-10">
            
            {/* --- FIXED PRINT STYLES --- */}
            <style>{`
                @media print {
                    /* 1. RESET PAGE MARGINS */
                    @page {
                        size: A4 portrait;
                        margin: 0; /* Tells browser to use 0 margin */
                    }
                    
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }

                    /* 2. HIDE UI ELEMENTS */
                    body * {
                        visibility: hidden;
                    }
                    #print-canvas, #print-canvas * {
                        visibility: visible;
                    }

                    /* 3. CENTER THE CONTENT "CANVAS" */
                    #print-canvas {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center; /* Center horizontally */
                        padding-top: 0.5in; /* Small top padding for safety */
                    }

                    /* 4. DEFINE THE STRICT 8-INCH CONTAINER */
                    /* A4 is 8.27in wide. Our content is 8.0in wide. 
                       Centering it prevents cutoff. */
                    .print-row-container {
                        width: 8in; 
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: flex-start;
                        margin-bottom: 0; /* Dikit-dikit vertically */
                    }

                    /* 5. EXACT IMAGE SIZES (NO GAPS) */
                    .photo-2x2 {
                        width: 2in;
                        height: 2in;
                        box-sizing: border-box; /* Ensures border doesn't add to size */
                        border: 0.5px solid #ddd; /* Faint guide line for cutting */
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
                        display: block; /* Removes tiny bottom gap in some browsers */
                    }
                }
            `}</style>


            {/* --- NAVBAR --- */}
            <nav className="sticky top-5 z-50 mx-auto w-[95%] max-w-7xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-xl mb-10 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
                                <Camera size={24} />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-white bg-clip-text text-transparent">PortraCV</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md">Login</button>
                        </div>
                    </div>
                </div>
            </nav>


            {/* --- MAIN CONTENT --- */}
            <main className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT: Controls */}
                <div className="lg:col-span-5 flex flex-col gap-6 print:hidden">
                    <div className="relative group">
                        <div className={`aspect-[4/3] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 ${selectedImage ? 'border-indigo-500/50 bg-zinc-900' : 'border-zinc-700 hover:border-indigo-500 hover:bg-zinc-900/50'}`}>
                            {selectedImage ? (
                                <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-xl shadow-lg" />
                            ) : (
                                <>
                                    <Upload className="text-indigo-400 mb-4" size={32} />
                                    <h3 className="text-lg font-semibold text-white">Upload Selfie</h3>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                    </div>
                    <button onClick={triggerPrint} className="w-full bg-white hover:bg-zinc-200 text-black h-12 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-95">
                        <Printer size={20} /> Print / Save PDF
                    </button>
                </div>


                {/* RIGHT: Preview & Print Area */}
                <div className="lg:col-span-7">
                    <div className="bg-white text-zinc-900 rounded-xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col print:shadow-none print:rounded-none">
                        
                        {/* Header (Screen only) */}
                        <div className="border-b border-zinc-200 p-4 bg-zinc-50 flex justify-between items-center print:hidden">
                            <h2 className="font-bold text-lg">A4 Print Preview</h2>
                            <span className="text-xs font-mono bg-zinc-200 px-2 py-1 rounded text-zinc-600">210 x 297 mm</span>
                        </div>

                        {/* --- ACTUAL PRINTABLE CANVAS --- */}
                        <div id="print-canvas" className="p-8 print:p-0 bg-white flex-1">
                            
                            {/* Row 1: 2x2 Photos (Dikit-Dikit) */}
                            {/* Screen styling uses Tailwind grid, Print styling uses strict 8in flex container */}
                            <div className="print-row-container grid grid-cols-4 gap-4 print:block print:gap-0">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={`2x2-${item}`} className="photo-2x2 aspect-square bg-zinc-100 relative print:aspect-auto">
                                        {selectedImage ? (
                                            <img src={selectedImage} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300 border border-zinc-200">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Row 2: 1x1 Photos (Dikit-Dikit) */}
                            <div className="print-row-container grid grid-cols-4 gap-4 print:block print:gap-0 mt-8 print:mt-0">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                    <div key={`1x1-${item}`} className="photo-1x1 aspect-square bg-zinc-100 relative print:aspect-auto">
                                        {selectedImage ? (
                                            <img src={selectedImage} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300 border border-zinc-200">
                                                <ImageIcon size={16} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}