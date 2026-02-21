import React, { useState } from 'react';
import { Upload, X, Loader2, Download, Image as ImageIcon, Sparkles, Timer } from 'lucide-react';
import { removeBackgroundAPI } from '../utils/imageProcessor';

/**
 * Standalone Background Remover Page
 * Reuses the Hugging Face AI pipeline without the complex grid layouts and A4 canvas restrictions.
 */
export default function BackgroundRemover() {
    // --- STATE ---
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [bgColor, setBgColor] = useState('#FFFFFF'); // Default replacement background
    const [isTransparent, setIsTransparent] = useState(true);

    // --- TIMERS ---
    let timerInterval = null;

    const startTimer = () => {
        setElapsedTime(0);
        timerInterval = setInterval(() => {
            setElapsedTime(prev => prev + 0.1);
        }, 100);
    };

    const stopTimer = () => {
        if (timerInterval) clearInterval(timerInterval);
    };

    // --- HANDLERS ---
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setElapsedTime(0); // Reset stats
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setElapsedTime(0);
    };

    const handleRemoveBackground = async () => {
        if (!selectedFile) return;
        setIsProcessing(true);
        startTimer();

        try {
            // Compress and resize BEFORE hitting the backend to optimize speed
            // Wait, removeBackgroundAPI takes a file. 
            // In PhotoEngine we sent the output of `getCroppedImg(blob)`.
            // Here, we'll compress the raw file dynamically before sending it!
            const compressedBlob = await compressAndResizeImage(selectedFile);

            const hexColor = isTransparent ? "" : bgColor.replace('#', '');
            const resultBlob = await removeBackgroundAPI(compressedBlob, hexColor);

            const resultUrl = URL.createObjectURL(resultBlob);
            setPreviewUrl(resultUrl);
        } catch (error) {
            console.error("BG Removal Failed:", error);
            alert("Failed to process image. The backend might be asleep or busy.");
        } finally {
            setIsProcessing(false);
            stopTimer();
        }
    };

    /**
     * Reusable image compression logic locally decoupled from Cropper!
     */
    const compressAndResizeImage = async (file) => {
        const MAX_DIMENSION = 1000;
        const objectUrl = URL.createObjectURL(file);
        const image = new Image();

        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
            image.src = objectUrl;
        });

        let outputWidth = image.width;
        let outputHeight = image.height;

        if (outputWidth > MAX_DIMENSION || outputHeight > MAX_DIMENSION) {
            if (outputWidth > outputHeight) {
                outputHeight = Math.round((outputHeight * MAX_DIMENSION) / outputWidth);
                outputWidth = MAX_DIMENSION;
            } else {
                outputWidth = Math.round((outputWidth * MAX_DIMENSION) / outputHeight);
                outputHeight = MAX_DIMENSION;
            }
        }

        const canvas = document.createElement('canvas');
        canvas.width = outputWidth;
        canvas.height = outputHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, outputWidth, outputHeight);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                // Ensure we return a jpeg blob to mimic the file object format
                const newFile = new File([blob], file.name, { type: 'image/jpeg' });
                resolve(newFile);
            }, 'image/jpeg', 0.80);
        });
    };

    const handleDownload = () => {
        if (!previewUrl) return;
        const link = document.createElement('a');
        link.href = previewUrl;
        link.download = `portracv_bg_removed_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">

            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-stone-800 tracking-tight leading-tight">
                    AI Background <span className="text-rose-600">Remover</span>
                </h1>
                <p className="text-stone-500 mt-2 font-medium">Instantly strip away backgrounds and download the isolated subject.</p>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">

                {/* LEFT: Preview Canvas */}
                <div className="flex-1 bg-stone-100 flex items-center justify-center p-8 relative min-h-[300px]" style={{
                    backgroundImage: isTransparent && previewUrl ? 'radial-gradient(#e5e5e5 1px, transparent 1px)' : 'none',
                    backgroundSize: '20px 20px'
                }}>
                    {!previewUrl ? (
                        <div className="flex flex-col items-center justify-center text-stone-400">
                            <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center mb-4">
                                <ImageIcon size={40} className="text-stone-300" />
                            </div>
                            <p className="font-semibold text-stone-500">No Image Selected</p>
                            <p className="text-sm mt-1">Upload a photo to get started</p>
                        </div>
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Close/Clear Button */}
                            <button onClick={handleClear} className="absolute top-0 right-0 p-2 bg-white/80 hover:bg-red-50 text-stone-500 hover:text-red-500 rounded-full backdrop-blur-sm shadow-sm transition-all z-10">
                                <X size={20} />
                            </button>

                            <img
                                src={previewUrl}
                                alt="Subject Preview"
                                className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl"
                                style={!isTransparent ? { backgroundColor: bgColor } : {}}
                            />
                        </div>
                    )}
                </div>

                {/* RIGHT: Controls Sidebar */}
                <div className="w-full md:w-80 border-l border-stone-200 bg-white p-6 flex flex-col justify-between">
                    <div className="space-y-6">
                        {/* Uploader Trigger */}
                        <div>
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">1. Select Photo</label>
                            <label className="w-full cursor-pointer flex flex-col items-center justify-center h-24 border-2 border-dashed border-rose-200 hover:border-rose-400 hover:bg-rose-50 rounded-2xl transition-all">
                                <div className="flex items-center gap-2 text-rose-600 font-semibold">
                                    <Upload size={18} /> Choose File
                                </div>
                                <span className="text-xs text-rose-400 font-medium tracking-tight">JPEG or PNG, up to 10MB</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>

                        {/* Background Settings */}
                        <div className={!previewUrl ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 block">2. Background Style</label>

                            <div className="flex items-center gap-3 mb-4">
                                <button
                                    onClick={() => setIsTransparent(true)}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-xl border transition-all ${isTransparent ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}
                                >
                                    Transparent
                                </button>
                                <button
                                    onClick={() => setIsTransparent(false)}
                                    className={`flex-1 py-2 text-sm font-semibold rounded-xl border transition-all ${!isTransparent ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}
                                >
                                    Solid Color
                                </button>
                            </div>

                            {!isTransparent && (
                                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-100 animate-fade-in-up">
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white shadow-sm overflow-hidden flex-shrink-0"
                                    />
                                    <span className="text-xs font-mono font-bold text-stone-600 uppercase w-full bg-white py-2 px-3 rounded-lg border border-stone-100">{bgColor}</span>
                                </div>
                            )}
                        </div>

                        {/* Processing Action */}
                        <div className={!previewUrl ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
                            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">3. Generate AI Cutout</label>
                            <button
                                onClick={handleRemoveBackground}
                                disabled={isProcessing || !previewUrl}
                                className="w-full h-12 bg-rose-600 text-white rounded-2xl font-bold flex items-center justify-center px-4 hover:bg-rose-700 disabled:bg-stone-200 disabled:text-stone-400 transition-all font-mono shadow-md shadow-rose-100"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin mr-2" />
                                        <span>Working... {elapsedTime.toFixed(1)}s</span>
                                    </>
                                ) : (
                                    <span className="flex items-center gap-2 font-sans"><Sparkles size={18} /> Remove Background</span>
                                )}
                            </button>

                            {!isProcessing && elapsedTime > 0 && (
                                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-500 bg-emerald-50 py-1.5 px-3 rounded-full border border-emerald-100 animate-fade-in-up">
                                    <Timer size={12} className="text-emerald-500" />
                                    <span>Cutout complete in {elapsedTime.toFixed(1)}s</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Final Output Action */}
                    <div className="pt-6 mt-6 border-t border-stone-100">
                        <button
                            onClick={handleDownload}
                            disabled={!previewUrl || isProcessing}
                            className="w-full h-14 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center px-4 hover:bg-stone-800 disabled:bg-stone-100 disabled:text-stone-300 disabled:border-transparent border border-stone-800 transition-all gap-2"
                        >
                            <Download size={20} /> Download Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
