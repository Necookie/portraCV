"use client";

import React, { useState } from 'react';
import { Camera, Upload, Printer, Image as ImageIcon, Sparkles, Loader2, Shirt, Coins, Github, User, Mail, Phone } from 'lucide-react';

export default function PhotoEngine() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // --- SAAS STATE ---
    const [userCredits, setUserCredits] = useState(50); 
    
    // --- API CONFIGURATION ---
    const PIXIAN_KEY = "YOUR_PIXIAN_KEY"; 
    
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    // --- FEATURE 1: BACKGROUND REMOVER (Cost: 1 Credit) ---
    const handleRemoveBackground = async () => {
        if (!selectedImage) return;
        if (userCredits < 1) { alert("Insufficient Credits! Please top up."); return; }

        setIsProcessing(true);
        try {
            // 1. Fetch current image
            const response = await fetch(selectedImage);
            const blob = await response.blob();
            const formData = new FormData();
            formData.append("image", blob, "photo.png");

            // 2. Call Pixian (Example)
            const apiResponse = await fetch("https://api.pixian.ai/api/v2/remove-background", {
                method: "POST",
                headers: { "Authorization": `Basic ${btoa(PIXIAN_KEY + ":")}` },
                body: formData
            });

            if (!apiResponse.ok) throw new Error("Pixian Failed");

            // 3. Update Image & Deduct Credit
            const resultBlob = await apiResponse.blob();
            setSelectedImage(URL.createObjectURL(resultBlob));
            setUserCredits(prev => prev - 1); 

        } catch (error) {
            console.error(error);
            alert("Background removal failed. Check API Key.");
        } finally {
            setIsProcessing(false);
        }
    };

    // --- FEATURE 2: AUTO FORMAL ATTIRE (Cost: 5 Credits) ---
    const handleFormalAttire = async () => {
        if (!selectedImage) return;
        if (userCredits < 5) { alert("Formal Attire costs 5 credits. Please top up."); return; }
        
        setIsProcessing(true);
        try {
            await new Promise(r => setTimeout(r, 2000)); // Fake wait
            alert("This feature requires a backend connection to Replicate/OpenAI.");
            setUserCredits(prev => prev - 5); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const triggerPrint = () => { window.print(); };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
            
            {/* PRINT STYLES */}
            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 0; }
                    body { margin: 0; padding: 0; background: white; }
                    body * { visibility: hidden; }
                    #print-canvas, #print-canvas * { visibility: visible; }
                    #print-canvas { position: absolute; top: 0; left: 0; width: 100%; display: flex; flex-direction: column; align-items: center; padding-top: 0.5in; }
                    .print-row-container { width: 8in; display: flex; flex-wrap: wrap; justify-content: flex-start; margin-bottom: 0; }
                    .photo-2x2 { width: 2in; height: 2in; box-sizing: border-box; border: 0.5px solid #ddd; background-color: white !important; }
                    .photo-1x1 { width: 1in; height: 1in; box-sizing: border-box; border: 0.5px solid #ddd; background-color: white !important; }
                    img { width: 100%; height: 100%; object-fit: cover; display: block; }
                }
            `}</style>

            {/* --- MAIN CONTENT WRAPPER (Push Footer Down) --- */}
            <div className="flex-grow pb-20"> 
                {/* Note: Navbar is handled by App.jsx, so we start with Main content */}
                
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
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">AI Studio</h3>
                            
                            {/* 1. Remove Background (Coming Soon) */}
                            <button 
                                disabled={true}
                                className="w-full h-11 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl font-medium flex items-center justify-between px-4 cursor-not-allowed"
                            >
                                <span className="flex items-center gap-2">
                                    <Sparkles size={18}/> 
                                    Remove Background
                                </span>
                                <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded border border-amber-200 uppercase tracking-wide">
                                    Coming Soon
                                </span>
                            </button>

                            {/* 2. Formal Attire (Coming Soon) */}
                            <button 
                                disabled={true} 
                                className="w-full h-11 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl font-medium flex items-center justify-between px-4 cursor-not-allowed"
                            >
                                <span className="flex items-center gap-2">
                                    <Shirt size={18}/> 
                                    Generate Formal Suit
                                </span>
                                <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded border border-amber-200 uppercase tracking-wide">
                                    Coming Soon
                                </span>
                            </button>
                        </div>

                        <button onClick={triggerPrint} className="w-full bg-white border border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-95">
                            <Printer size={20} /> Print / Save PDF
                        </button>
                    </div>

                    {/* RIGHT: Preview (Standard Grid) */}
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

            {/* --- DEVELOPER / CONTACT FOOTER (Added Here) --- */}
            <footer className="py-16 bg-slate-50 border-t border-slate-200 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        
                        {/* Brand Info */}
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

                        {/* Developer Contact Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Developer Contact</h4>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User size={20} className="text-primary mt-1" />
                                    <div>
                                        <p className="font-semibold text-slate-900">Dheyn Michael Orlanda</p>
                                        <p className="text-sm text-slate-500">Lead Developer (Necookie.dev)</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail size={20} className="text-primary" />
                                    <a href="mailto:Dheyn.main@gmail.com" className="text-slate-600 hover:text-primary transition-colors">
                                        Dheyn.main@gmail.com
                                    </a>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone size={20} className="text-primary" />
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