"use client";

import React, { useState } from 'react';
import { Camera, Upload, Printer, Image as ImageIcon, Sparkles, Loader2, Shirt, Github, User, Mail, Phone, Palette } from 'lucide-react';

// --- CONFIGURATION ---
const BACKEND_URL = "https://necookie-portracv-backend.hf.space"; 

export default function PhotoEngine() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [bgColor, setBgColor] = useState("#ffffff"); // State for the background color
    const [userCredits, setUserCredits] = useState(50); 

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setSelectedFile(file);
        }
    };

    const handleRemoveBackground = async () => {
        if (!selectedFile) return;
        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("color", bgColor); // Sending the chosen color to backend

            const response = await fetch(`${BACKEND_URL}/remove-bg`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const newImageUrl = URL.createObjectURL(blob);
                setSelectedImage(newImageUrl);
            } else {
                console.error("Server Error");
                alert("Failed to connect to the AI server. Please check if the backend is waking up.");
            }
        } catch (error) {
            console.error("Connection Failed", error);
            alert("Connection failed. Ensure the backend URL is correct.");
        } finally {
            setIsProcessing(false);
        }
    };

    const triggerPrint = () => { window.print(); };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 0; }
                    body { margin: 0; padding: 0; background: white; }
                    body * { visibility: hidden; }
                    #print-canvas, #print-canvas * { visibility: visible; }
                    #print-canvas { position: absolute; top: 0; left: 0; width: 100%; display: flex; flex-direction: column; align-items: center; padding-top: 0.5in; }
                    .print-row-container { width: 8in; display: flex; flex-wrap: wrap; justify-content: flex-start; margin-bottom: 0; }
                    
                    .photo-2x2 { 
                        width: 2in; 
                        height: 2in; 
                        box-sizing: border-box; 
                        border: 1px solid #94a3b8;
                        background-color: white !important; 
                    }
                    .photo-1x1 { 
                        width: 1in; 
                        height: 1in; 
                        box-sizing: border-box; 
                        border: 1px solid #94a3b8;
                        background-color: white !important; 
                    }
                    img { width: 100%; height: 100%; object-fit: cover; display: block; }
                }
            `}</style>

            <div className="flex-grow pb-20"> 
                <main className="max-w-7xl mx-auto px-4 md:px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT: Controls */}
                    <div className="lg:col-span-5 flex flex-col gap-4 print:hidden">
                        <div className="relative group">
                            <div className={`aspect-[4/3] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 cursor-pointer ${selectedImage ? 'border-indigo-500/50 bg-indigo-50/50' : 'border-slate-300 bg-white hover:border-indigo-500 hover:bg-indigo-50/30'}`}>
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-xl shadow-sm" />
                                ) : (
                                    <>
                                        <Upload className="text-indigo-600 mb-2" size={32} />
                                        <h3 className="text-lg font-semibold text-slate-900">Upload Selfie</h3>
                                    </>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        {/* SAAS CONTROLS */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">AI Studio</h3>
                                <div className="flex items-center gap-1 text-indigo-600 font-bold text-xs bg-indigo-50 px-2 py-1 rounded-full">
                                    <Palette size={12}/> Background
                                </div>
                            </div>

                            {/* COLOR PICKER SECTION */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Select Background Color</label>
                                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <input 
                                        type="color" 
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-sm overflow-hidden"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-mono font-bold text-slate-700 uppercase">{bgColor}</span>
                                        <p className="text-[10px] text-slate-500">Pick the ID background color</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleRemoveBackground}
                                disabled={!selectedImage || isProcessing}
                                className="w-full h-12 bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center px-4 transition-all duration-200 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-md shadow-indigo-100"
                            >
                                {isProcessing ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Sparkles size={18}/> 
                                        Apply & Process
                                    </span>
                                )}
                            </button>

                            <button 
                                disabled={true} 
                                className="w-full h-11 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl font-medium flex items-center justify-between px-4 cursor-not-allowed"
                            >
                                <span className="flex items-center gap-2">
                                    <Shirt size={18}/> 
                                    Generate Formal Suit
                                </span>
                                <span className="text-[10px] font-bold bg-white text-slate-400 px-2 py-1 rounded border border-slate-200 uppercase tracking-wide">
                                    Locked
                                </span>
                            </button>
                        </div>  

                        <button onClick={triggerPrint} className="w-full bg-white border border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
                            <Printer size={20} /> Print / Save PDF
                        </button>
                    </div>

                    {/* RIGHT: Preview */}
                    <div className="lg:col-span-7">
                        <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-h-[600px] flex flex-col print:shadow-none print:border-none print:rounded-none">
                            <div className="border-b border-slate-200 p-4 bg-slate-50/80 flex justify-between items-center print:hidden">
                                <h2 className="font-bold text-slate-800 text-lg">A4 Print Preview</h2>
                                <span className="text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">210 x 297 mm</span>
                            </div>
                            <div id="print-canvas" className="p-8 print:p-0 bg-white flex-1">
                                <div className="print-row-container grid grid-cols-4 gap-4 print:block print:gap-0">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div key={`2x2-${item}`} className="photo-2x2 aspect-square bg-white border border-slate-200 relative print:aspect-auto print:border-none">
                                            {selectedImage ? <img src={selectedImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={24} /></div>}
                                        </div>
                                    ))}
                                </div>
                                <div className="print-row-container grid grid-cols-4 gap-4 print:block print:gap-0 mt-8 print:mt-0">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                        <div key={`1x1-${item}`} className="photo-1x1 aspect-square bg-white border border-slate-200 relative print:aspect-auto print:border-none">
                                            {selectedImage ? <img src={selectedImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer remains same */}
            <footer className="py-16 bg-slate-50 border-t border-slate-200 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                                    <Camera size={20} />
                                </div>
                                <span className="text-2xl font-bold text-slate-900">PortraCV</span>
                            </div>
                            <p className="text-slate-600 mb-6 max-w-sm">
                                The ultimate SaaS solution for printing shops to modernize operations and increase productivity.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://github.com/Necookie" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
                                    <Github size={24} />
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Developer Contact</h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User size={20} className="text-indigo-600 mt-1" />
                                    <div>
                                        <p className="font-semibold text-slate-900">Dheyn Michael Orlanda</p>
                                        <p className="text-sm text-slate-500">Lead Developer (Necookie.dev)</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail size={20} className="text-indigo-600" />
                                    <a href="mailto:Dheyn.main@gmail.com" className="text-slate-600 hover:text-indigo-600 transition-colors">
                                        Dheyn.main@gmail.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={20} className="text-indigo-600" />
                                    <span className="text-slate-600">+63 995 492 2742</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
                        © {new Date().getFullYear()} Necookie.dev. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}