"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Camera, Upload, Printer, Image as ImageIcon, Sparkles, Loader2, Shirt, Github, User, Mail, Phone, Palette, Crop as CropIcon, X, Check, ZoomIn, LayoutTemplate } from 'lucide-react';

// --- CONFIGURATION ---
const BACKEND_URL = "https://necookie-portracv-backend.hf.space";

// --- PACKAGE DEFINITIONS ---
const PACKAGES = [
    {
        id: 'mixed',
        name: 'Starter Mix',
        description: '4pcs 2x2" + 8pcs 1x1"',
        layout: [
            { type: '2x2', count: 4, cols: 4 },
            { type: '1x1', count: 8, cols: 8 }
        ],
        hasGap: true // Keep gaps for the mixed layout as they are distinct sizes
    },
    {
        id: 'max_2x2',
        name: 'Max 2x2',
        description: '8pcs 2x2" (Formal)',
        layout: [
            { type: '2x2', count: 8, cols: 4 }
        ],
        hasGap: false // Optional: could be true or false, setting false for tighter print
    },
    {
        id: 'passport',
        name: 'Passport / ID',
        description: '10pcs 35x45mm (5x2 Layout)',
        layout: [
            { type: 'passport', count: 10, cols: 5 }
        ],
        hasGap: false // FORCE NO GAP
    },
    {
        id: 'max_1x1',
        name: 'Max 1x1',
        description: '16pcs 1x1" (School ID)',
        layout: [
            { type: '1x1', count: 16, cols: 8 }
        ],
        hasGap: false
    }
];

// --- UTILITY: Create Image Helper ---
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

// --- UTILITY: Canvas Cropping Logic ---
async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            const fileUrl = URL.createObjectURL(blob);
            resolve({ blob, fileUrl });
        }, 'image/jpeg');
    });
}

export default function PhotoEngine() {
    // --- STATE ---
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [activePackageId, setActivePackageId] = useState('mixed'); 
    
    // Crop State
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Derived State
    const currentPackage = PACKAGES.find(p => p.id === activePackageId) || PACKAGES[0];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setOriginalImage(imageUrl);
            setSelectedFile(file);
            setIsCropping(true);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSaveCrop = async () => {
        try {
            const { blob, fileUrl } = await getCroppedImg(originalImage, croppedAreaPixels);
            setSelectedImage(fileUrl);
            const newFile = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
            setSelectedFile(newFile);
            setIsCropping(false);
        } catch (e) {
            console.error(e);
            alert("Something went wrong cropping the image.");
        }
    };

    const handleRemoveBackground = async () => {
        if (!selectedFile) return;
        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("color", bgColor);

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
                alert("Failed to connect to the AI server.");
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
                    
                    /* Dynamic Grid Containers - FORCE ZERO GAP */
                    .print-grid { 
                        width: 8in; 
                        display: grid; 
                        gap: 0 !important; 
                        margin-bottom: 0; 
                        justify-content: center; 
                    }
                    
                    /* Grid Columns Configuration */
                    .print-grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
                    .print-grid-cols-8 { grid-template-columns: repeat(8, 1fr); }
                    
                    /* FIXED: Passport (5 cols) fixed width to ensure they touch */
                    .print-grid-cols-5 { grid-template-columns: repeat(5, 35mm); }

                    /* Photo Sizes & Borders */
                    .photo-box { 
                        box-sizing: border-box; 
                        /* Clear border for cutting - slate-300 */
                        border: 1px solid #cbd5e1;
                        background-color: white !important; 
                        overflow: hidden;
                        flex-shrink: 0;
                    }
                    
                    /* Force exact print dimensions */
                    .size-2x2 { width: 2in !important; height: 2in !important; }
                    .size-1x1 { width: 1in !important; height: 1in !important; }
                    .size-passport { width: 35mm !important; height: 45mm !important; } 
                    
                    img { width: 100%; height: 100%; object-fit: cover; display: block; }
                }
            `}</style>

            <div className="flex-grow pb-20 relative">
                
                {/* --- CROPPER OVERLAY --- */}
                {isCropping && originalImage && (
                    <div className="fixed inset-0 z-50 bg-slate-900/90 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                <h3 className="font-bold text-slate-700">Adjust Photo</h3>
                                <button onClick={() => setIsCropping(false)} className="text-slate-400 hover:text-red-500">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="relative h-[400px] w-full bg-slate-100">
                                <Cropper
                                    image={originalImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <ZoomIn size={18} className="text-slate-400" />
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setIsCropping(false)} className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors border border-slate-200">Cancel</button>
                                    <button onClick={handleSaveCrop} className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"><Check size={18} /> Apply Crop</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <main className="max-w-7xl mx-auto px-4 md:px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT: Controls */}
                    <div className="lg:col-span-5 flex flex-col gap-4 print:hidden">
                        <div className="relative group">
                            <div className={`aspect-[4/3] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 cursor-pointer overflow-hidden relative ${selectedImage ? 'border-indigo-500/50 bg-indigo-50/50' : 'border-slate-300 bg-white hover:border-indigo-500 hover:bg-indigo-50/30'}`}>
                                {selectedImage ? (
                                    <>
                                        <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-xl shadow-sm" />
                                        <button 
                                            onClick={() => { setZoom(1); setIsCropping(true); }}
                                            className="absolute bottom-4 right-4 bg-white text-indigo-600 p-2 rounded-full shadow-lg border border-indigo-100 hover:scale-105 transition-transform"
                                        >
                                            <CropIcon size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="text-indigo-600 mb-2" size={32} />
                                        <h3 className="text-lg font-semibold text-slate-900">Upload Selfie</h3>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* AI STUDIO */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">AI Studio</h3>
                                <div className="flex items-center gap-1 text-indigo-600 font-bold text-xs bg-indigo-50 px-2 py-1 rounded-full">
                                    <Palette size={12}/> Editor
                                </div>
                            </div>

                            {/* PACKAGE SELECTOR */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-2">
                                    <LayoutTemplate size={12} /> Select Package
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {PACKAGES.map((pkg) => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => setActivePackageId(pkg.id)}
                                            className={`p-3 rounded-xl border text-left transition-all ${
                                                activePackageId === pkg.id 
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600' 
                                                : 'border-slate-200 hover:border-indigo-300 text-slate-600'
                                            }`}
                                        >
                                            <div className="font-bold text-xs">{pkg.name}</div>
                                            <div className="text-[10px] opacity-70 truncate">{pkg.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* COLOR PICKER */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Background Color</label>
                                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <input 
                                        type="color" 
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-sm overflow-hidden"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-mono font-bold text-slate-700 uppercase">{bgColor}</span>
                                        <p className="text-[10px] text-slate-500">Pick ID background</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleRemoveBackground}
                                disabled={!selectedImage || isProcessing}
                                className="w-full h-12 bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center px-4 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-md shadow-indigo-100 transition-all"
                            >
                                {isProcessing ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2"><Sparkles size={18}/> Apply & Process</span>
                                )}
                            </button>

                            <button disabled className="w-full h-11 bg-slate-50 border border-slate-200 text-slate-400 rounded-xl font-medium flex items-center justify-between px-4 cursor-not-allowed">
                                <span className="flex items-center gap-2"><Shirt size={18}/> Formal Suit</span>
                                <span className="text-[10px] font-bold bg-white text-slate-400 px-2 py-1 rounded border border-slate-200 uppercase">Locked</span>
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
                                <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                    Preview: {currentPackage.name}
                                </h2>
                                <span className="text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">A4 • 210 x 297 mm</span>
                            </div>
                            
                            {/* DYNAMIC RENDERER */}
                            <div id="print-canvas" className="p-8 print:p-0 bg-white flex-1 flex flex-col items-center">
                                {currentPackage.layout.map((group, groupIndex) => (
                                    <div 
                                        key={groupIndex} 
                                        className={`
                                            w-full grid mb-4 
                                            print:mb-0 print:gap-0 print:w-[8in] print-grid print-grid-cols-${group.cols}
                                            ${currentPackage.hasGap ? 'gap-4' : 'gap-0 justify-center'} 
                                        `}
                                        style={{ 
                                            // Conditional styling for Preview to match Print as closely as possible
                                            gridTemplateColumns: !currentPackage.hasGap && group.type === 'passport'
                                                ? `repeat(${group.cols}, 35mm)` // Explicitly pack columns for passport preview
                                                : `repeat(${group.cols}, minmax(0, 1fr))`
                                        }}
                                    >
                                        {Array.from({ length: group.count }).map((_, i) => (
                                            <div 
                                                key={`${group.type}-${i}`} 
                                                className={`
                                                    aspect-square bg-white border border-slate-200 relative overflow-hidden
                                                    print:aspect-auto
                                                    photo-box size-${group.type}
                                                `}
                                            >
                                                {selectedImage ? (
                                                    <img src={selectedImage} className="w-full h-full object-cover" alt="ID Photo" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <ImageIcon size={24} />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="py-16 bg-slate-50 border-t border-slate-200 print:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><Camera size={20} /></div>
                                <span className="text-2xl font-bold text-slate-900">PortraCV</span>
                            </div>
                            <p className="text-slate-600 mb-6 max-w-sm">The ultimate SaaS solution for printing shops.</p>
                            <a href="https://github.com/Necookie" className="text-slate-400 hover:text-slate-900"><Github size={24} /></a>
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
                                    <a href="mailto:Dheyn.main@gmail.com" className="text-slate-600 hover:text-indigo-600">Dheyn.main@gmail.com</a>
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