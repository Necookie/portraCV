"use client";

import React, { useState, useCallback } from 'react';
import { Upload, Printer, Crop as CropIcon } from 'lucide-react';

// --- UTILITIES & CONSTANTS ---
import { PACKAGES } from '../constants/packages';
import { getCroppedImg, removeBackgroundAPI } from '../utils/imageProcessor';

// --- SUBCOMPONENTS ---
import CropperModal from './PhotoEngine/CropperModal';
import AIStudioControls from './PhotoEngine/AIStudioControls';
import PrintPreviewGrid from './PhotoEngine/PrintPreviewGrid';
import Footer from './Footer';

/**
 * Main PhotoEngine Orchestrator Component
 * Retains all local states and binds them down to isolated UI subcomponents.
 * File size drastically reduced for readability by extracting UI and logic modules.
 */
export default function PhotoEngine() {
    // --- STATE MANAGEMENT ---

    // Core Image States
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);

    // Process & Settings States
    const [isProcessing, setIsProcessing] = useState(false);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [borderColor, setBorderColor] = useState("#cbd5e1"); // Default border color (stone-300)
    const [borderWidth, setBorderWidth] = useState(1); // Default border width in pixels
    const [activePackageId, setActivePackageId] = useState('mixed');

    // Performance State
    const [elapsedTime, setElapsedTime] = useState(0);

    // Cropping Overlay States
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // Derived States
    const currentPackage = PACKAGES.find(p => p.id === activePackageId) || PACKAGES[0];

    // --- EVENT HANDLERS ---

    /**
     * Captures a local file from the <input>, generates a local Object URL,
     * and spawns the cropping modal immediately for framing.
     */
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

    /** Memoized callback from react-easy-crop whenever the user moves the crop box */
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    /**
     * Reads the current crop viewport coordinates and generates a completely new
     * cropped jpeg blob using our external utility.
     */
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

    /**
     * Triggers the API request to our Hugging Face backend.
     * Starts an interval timer to provide real-time UI feedback while waiting.
     */
    const handleRemoveBackground = async () => {
        if (!selectedFile) return;

        setIsProcessing(true);
        setElapsedTime(0);

        // Start processing timer
        const startTime = Date.now();
        const timerInterval = setInterval(() => {
            setElapsedTime((Date.now() - startTime) / 1000);
        }, 100);

        try {
            // Await processing logic from the external utility
            const blobResult = await removeBackgroundAPI(selectedFile, bgColor);
            const newImageUrl = URL.createObjectURL(blobResult);
            setSelectedImage(newImageUrl);
        } catch (error) {
            console.error(error);
            alert("Connection failed. Ensure the backend URL is correct and server is awake.");
        } finally {
            // Clean up intervals once promise settles
            clearInterval(timerInterval);
            setIsProcessing(false);
        }
    };

    /** Triggers the native browser print dialogue configured via `@media print` CSS block */
    const triggerPrint = () => { window.print(); };

    // --- RENDER BLOCK ---
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">

            {/* INLINE CSS BLOCK defining strict rules exclusively observed during `<window.print()>` */}
            <style>{`
                @media print {
                    @page { size: A4 portrait; margin: 0; }
                    body { margin: 0; padding: 0; background: white; }
                    body * { visibility: hidden; }
                    /* Only the target canvas grid is allowed to paint onto the paper */
                    #print-canvas, #print-canvas * { visibility: visible; }
                    #print-canvas { position: absolute; top: 0; left: 0; width: 100%; display: flex; flex-direction: column; align-items: center; padding-top: 0.5in; }
                    
                    /* Dynamic Grid Containers - FORCE ZERO GAP BY DEFAULT */
                    .print-grid { width: 8in; display: grid; gap: 0 !important; margin-bottom: 0; justify-content: center; }
                    .print-grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
                    .print-grid-cols-8 { grid-template-columns: repeat(8, 1fr); }
                    .print-grid-cols-5 { grid-template-columns: repeat(5, 35mm); } /* Passport fix */
                    
                    /* Box constraints mapped to physical dimensions */
                    .photo-box { 
                        box-sizing: border-box; 
                        /* Clear border for cutting - dynamically set in subcomponent via var() */
                        border: var(--print-border-width, 1px) solid var(--print-border-color, #cbd5e1);
                        background-color: white !important; 
                        overflow: hidden;
                        flex-shrink: 0;
                    }
                    .size-2x2 { width: 2in !important; height: 2in !important; }
                    .size-1x1 { width: 1in !important; height: 1in !important; }
                    .size-passport { width: 35mm !important; height: 45mm !important; } 
                    img { width: 100%; height: 100%; object-fit: cover; display: block; }
                }
            `}</style>

            <div className="flex-grow pb-20 relative">

                {/* --- 1. POPUP MODAL (Hidden by default unless editing) --- */}
                {isCropping && originalImage && (
                    <CropperModal
                        originalImage={originalImage}
                        crop={crop} zoom={zoom} setCrop={setCrop} setZoom={setZoom}
                        onCropComplete={onCropComplete}
                        handleSaveCrop={handleSaveCrop} setIsCropping={setIsCropping}
                    />
                )}

                <main className="max-w-7xl mx-auto px-4 md:px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- 2. LEFT COLUMN (Core Interactive Elements) --- */}
                    <div className="lg:col-span-5 flex flex-col gap-4 print:hidden animate-fade-in-up">

                        {/* Top: Image Uploader / Preview Context */}
                        <div className="relative group">
                            <div className={`aspect-[4/3] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 cursor-pointer overflow-hidden relative ${selectedImage ? 'border-rose-500/50 bg-rose-50/50' : 'border-stone-300 bg-white hover:border-rose-500 hover:bg-rose-50/30'}`}>
                                {selectedImage ? (
                                    <>
                                        <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-2xl shadow-sm" />
                                        <button
                                            onClick={() => { setZoom(1); setIsCropping(true); }}
                                            className="absolute bottom-4 right-4 bg-white text-rose-600 p-2 rounded-full shadow-lg border border-rose-100 hover:scale-105 transition-transform"
                                        >
                                            <CropIcon size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="text-rose-600 mb-2" size={32} />
                                        <h3 className="text-lg font-semibold text-stone-900">Upload Selfie</h3>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Middle: Render the Extracted AI Studio Config Panel */}
                        <AIStudioControls
                            activePackageId={activePackageId} setActivePackageId={setActivePackageId}
                            bgColor={bgColor} setBgColor={setBgColor}
                            borderColor={borderColor} setBorderColor={setBorderColor}
                            borderWidth={borderWidth} setBorderWidth={setBorderWidth}
                            selectedImage={selectedImage} isProcessing={isProcessing}
                            handleRemoveBackground={handleRemoveBackground} elapsedTime={elapsedTime}
                        />

                        {/* Bottom: Print Access */}
                        <button onClick={triggerPrint} className="w-full bg-white border border-stone-200 hover:border-rose-500/50 hover:bg-rose-50/50 text-stone-700 hover:text-rose-600 h-12 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
                            <Printer size={20} /> Print / Save PDF
                        </button>
                    </div>

                    {/* --- 3. RIGHT COLUMN (Render Map / A4 Print Target ) --- */}
                    <div className="lg:col-span-7 animate-fade-in-up-delay-1">
                        <PrintPreviewGrid
                            currentPackage={currentPackage}
                            selectedImage={selectedImage}
                            borderColor={borderColor}
                            borderWidth={borderWidth}
                        />
                    </div>

                </main>
            </div>

            {/* --- globally extracted footer --- */}
            <Footer />
        </div>
    );
}
