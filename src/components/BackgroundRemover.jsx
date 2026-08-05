import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Download, Image as ImageIcon, Sparkles, Timer, ArrowRight, ShieldCheck } from 'lucide-react';
import { removeBackgroundAPI, compressAndResizeImage } from '../utils/imageProcessor';

/**
 * Standalone Background Remover Page
 * Two-state component:
 * 1. Landing View (Split screen, massive dropzone inspired by remove.bg)
 * 2. Workspace View (Canvas preview with sidebar tools)
 */
export default function BackgroundRemover() {
    // --- STATE ---
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [bgColor, setBgColor] = useState('#FFFFFF');
    const [isTransparent, setIsTransparent] = useState(true);

    // --- TIMERS ---
    const timerRef = useRef(null);

    const startTimer = () => {
        setElapsedTime(0);
        timerRef.current = setInterval(() => {
            setElapsedTime(prev => prev + 0.1);
        }, 100);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // --- HANDLERS ---
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            // Capture whether this is the very first upload BEFORE any state updates
            // — reading previewUrl from state here is reliable since we haven't called a setter yet.
            const isFirstUpload = !previewUrl;
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setElapsedTime(0);

            // Auto-trigger on first drop only (workspace view handles it via the manual button)
            if (isFirstUpload) {
                processAILogic(file, true, "transparent");
            }
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setElapsedTime(0);
    };

    // Explicit manual trigger button (for when user changes colors in the workspace)
    const handleRemoveBackground = async () => {
        if (!selectedFile) return;
        const hexColor = isTransparent ? "transparent" : bgColor.replace('#', '');
        await processAILogic(selectedFile, isTransparent, hexColor);
    };

    // The actual AI work
    const processAILogic = async (targetFile, transparentFlag, hexColorString) => {
        setIsProcessing(true);
        startTimer();

        try {
            const compressedBlob = await compressAndResizeImage(targetFile);
            const resultBlob = await removeBackgroundAPI(compressedBlob, hexColorString);
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

    const handleDownload = () => {
        if (!previewUrl) return;
        const link = document.createElement('a');
        link.href = previewUrl;
        link.download = `portracv_bg_removed_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // ==========================================
    // RENDER: INITIAL LANDING STATE
    // ==========================================
    if (!previewUrl) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 animate-fade-in-up">
                <div className="text-center space-y-4 mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-rose-100 text-rose-600 rounded-3xl mb-1 shadow-sm">
                        <Sparkles size={28} />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-stone-800 tracking-tight">
                        AI Background <span className="text-rose-600">Remover</span>
                    </h1>
                    <p className="text-lg text-stone-500 font-medium max-w-2xl mx-auto">
                        Drop any photo below and let our AI instantly strip away the background.
                    </p>
                </div>

                <div className="relative max-w-2xl mx-auto">
                    {/* Abstract background decorative blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-br from-rose-100 to-amber-50 rounded-[4rem] -z-10 blur-3xl opacity-60"></div>

                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[3rem] p-6 lg:p-10 hover:shadow-rose-100/50 transition-all duration-500 group relative overflow-hidden">

                        {/* Inner Dashed Zone */}
                        <label className="w-full min-h-[320px] border-4 border-dashed border-stone-200 group-hover:border-rose-300 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-colors hover:bg-rose-50/50">

                            <div className="bg-rose-600 text-white rounded-2xl px-6 py-3 text-lg font-bold shadow-xl shadow-rose-600/20 group-hover:-translate-y-1 transition-transform flex items-center gap-3 mb-4">
                                <Upload size={20} /> Select a Photo
                            </div>

                            <h3 className="text-xl font-bold text-stone-700 mb-1">or drag and drop it here</h3>
                            <p className="text-stone-400 font-medium text-sm">Supports JPG, PNG up to 10MB</p>

                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>

                        {/* Processing Overlay (If Auto-Trigger is running) */}
                        {isProcessing && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center rounded-[3rem] z-20">
                                <Loader2 size={40} className="text-rose-600 animate-spin mb-4" />
                                <p className="text-lg font-bold text-stone-700">Extracting Subject...</p>
                                <p className="text-stone-500 font-mono mt-1 text-sm">{elapsedTime.toFixed(1)}s elapsed</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Features Row */}
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl"><ShieldCheck size={22} /></div>
                        <h4 className="font-bold text-stone-700 text-sm">100% Secure</h4>
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Client-side processing</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl"><Timer size={22} /></div>
                        <h4 className="font-bold text-stone-700 text-sm">Automated AI</h4>
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">No manual cutting</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-purple-50 text-purple-600 p-3 rounded-2xl"><ImageIcon size={22} /></div>
                        <h4 className="font-bold text-stone-700 text-sm">High Quality</h4>
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider font-bold">Perfect for PortraCV</p>
                    </div>
                </div>

            </div>
        );
    }

    // ==========================================
    // RENDER: WORKSPACE STATE (After Upload)
    // ==========================================
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in-up">

            {/* Header (Workspace scale) */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-stone-800 tracking-tight">
                    Background <span className="text-rose-600">Remover</span> Workspace
                </h1>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-stone-200 shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

                {/* LEFT: Preview Canvas */}
                <div className="flex-[2] bg-stone-100 flex items-center justify-center p-8 relative min-h-[400px]" style={{
                    backgroundImage: isTransparent ? 'radial-gradient(#e5e5e5 1px, transparent 1px)' : 'none',
                    backgroundSize: '20px 20px'
                }}>
                    <div className="relative w-full h-full flex items-center justify-center group">
                        {/* Top Action Bar hovering over the image */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-stone-600 shadow-sm border border-stone-200">
                                {selectedFile?.name || "Image"}
                            </span>
                            <button onClick={handleClear} className="bg-white/90 backdrop-blur-md p-2 hover:bg-red-50 text-stone-500 hover:text-red-500 rounded-full shadow-sm border border-stone-200 transition-all">
                                <X size={18} />
                            </button>
                        </div>

                        {isProcessing ? (
                            <div className="flex flex-col items-center">
                                <Loader2 size={40} className="text-rose-600 animate-spin mb-4" />
                                <p className="font-bold text-stone-600">Processing background...</p>
                                <p className="text-stone-400 font-mono text-sm mt-1">{elapsedTime.toFixed(1)}s</p>
                            </div>
                        ) : (
                            <img
                                src={previewUrl}
                                alt="Subject Preview"
                                className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-xl transition-all duration-300"
                                style={!isTransparent ? { backgroundColor: bgColor } : {}}
                            />
                        )}
                    </div>
                </div>

                {/* RIGHT: Controls Sidebar */}
                <div className="flex-1 border-l border-stone-200 bg-white p-8 flex flex-col justify-between">
                    <div className="space-y-8">
                        <div>
                            <h3 className="font-bold text-xl text-stone-800 mb-1">Background</h3>
                            <p className="text-sm text-stone-500 mb-6">Customize the backdrop behind your isolated subject.</p>

                            <div className="flex flex-col gap-3 mb-6">
                                <button
                                    onClick={() => { setIsTransparent(true); handleRemoveBackground(); }}
                                    className={`w-full py-4 text-sm font-bold rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${isTransparent ? 'bg-stone-800 text-white border-stone-800 shadow-md shadow-stone-200' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'}`}
                                >
                                    <div className="w-5 h-5 rounded-md border border-stone-300" style={{ backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
                                    Transparent
                                </button>
                                <button
                                    onClick={() => setIsTransparent(false)}
                                    className={`w-full py-4 text-sm font-bold rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${!isTransparent ? 'bg-stone-800 text-white border-stone-800 shadow-md shadow-stone-200' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'}`}
                                >
                                    <div className="w-5 h-5 rounded-md border border-white/50 bg-gradient-to-br from-blue-400 to-rose-400"></div>
                                    Solid Color
                                </button>
                            </div>

                            {/* Color Picker Reveal */}
                            <div className={`transition-all duration-300 overflow-hidden ${!isTransparent ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 block">Pick Shade</label>
                                <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        onBlur={handleRemoveBackground} // Re-run AI when finishing color pick
                                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-sm overflow-hidden flex-shrink-0"
                                    />
                                    <span className="text-sm font-mono font-bold text-stone-700 uppercase w-full bg-white py-3 px-4 rounded-xl border border-stone-100">{bgColor}</span>
                                </div>
                                <p className="text-[10px] text-stone-400 mt-2 flex items-center gap-1"><ArrowRight size={10} /> AI will re-process on color change</p>
                            </div>
                        </div>

                        {/* Display processing time if any */}
                        {!isProcessing && elapsedTime > 0 && (
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 py-3 px-4 rounded-2xl border border-emerald-100 w-full animate-fade-in-up">
                                <Timer size={14} /> Cutout took {elapsedTime.toFixed(1)}s
                            </div>
                        )}
                    </div>

                    {/* Final Output Action */}
                    <div className="pt-8 mt-8 border-t border-stone-100">
                        <button
                            onClick={handleDownload}
                            disabled={!previewUrl || isProcessing}
                            className="w-full h-16 bg-rose-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center px-4 hover:bg-rose-700 disabled:bg-stone-100 disabled:text-stone-300 disabled:cursor-not-allowed shadow-xl shadow-rose-600/20 transition-all font-mono gap-3 hover:-translate-y-1"
                        >
                            <Download size={22} /> Download HD Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
