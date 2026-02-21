import React from 'react';
import { Palette, Sparkles, Loader2, LayoutTemplate, Shirt, Timer, PlusSquare, RotateCcw } from 'lucide-react';
import { PACKAGES } from '../../constants/packages';

/**
 * AIStudioControls Component
 * Renders the sidebar settings panel containing all user configurations
 * before they click 'Apply & Process'. Exists purely as a UI layer passing
 * events back up to the PhotoEngine context handler.
 */
export default function AIStudioControls({
    activePackageId,
    setActivePackageId,
    bgColor,
    setBgColor,
    borderColor,
    setBorderColor,
    borderWidth,
    setBorderWidth,
    selectedImage,
    isProcessing,
    handleRemoveBackground,
    elapsedTime,
    handleStageJob,
    handleResetEditor
}) {
    return (
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-5">
            {/* Header of Studio Control Panel */}
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-stone-700 text-sm uppercase tracking-wider">AI Studio</h3>
                <div className="flex items-center gap-1 text-rose-600 font-bold text-xs bg-rose-50 px-2 py-1 rounded-full">
                    <Palette size={12} /> Editor
                </div>
            </div>

            {/* PACKAGE SELECTOR GRID */}
            <div className="space-y-3">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-tight flex items-center gap-2">
                    <LayoutTemplate size={12} /> Select Package
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {PACKAGES.map((pkg) => (
                        <button
                            key={pkg.id}
                            onClick={() => setActivePackageId(pkg.id)}
                            className={`p-3 rounded-2xl border text-left transition-all ${activePackageId === pkg.id
                                ? 'border-rose-600 bg-rose-50 text-rose-900 ring-1 ring-rose-600'
                                : 'border-stone-200 hover:border-rose-300 text-stone-600'
                                }`}
                        >
                            <div className="font-bold text-xs">{pkg.name}</div>
                            <div className="text-[10px] opacity-70 truncate">{pkg.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            <hr className="border-stone-100" />

            {/* BACKGROUND COLOR PICKER */}
            <div className="space-y-3">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-tight">Background Color</label>
                <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                    <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-sm overflow-hidden"
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-mono font-bold text-stone-700 uppercase">{bgColor}</span>
                        <p className="text-[10px] text-stone-500">Pick ID background</p>
                    </div>
                </div>
            </div>

            {/* CUTLINE/BORDER COLOR PICKER */}
            <div className="space-y-3">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-tight">Border Color</label>
                <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                    <input
                        type="color"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-sm overflow-hidden"
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-mono font-bold text-stone-700 uppercase">{borderColor}</span>
                        <p className="text-[10px] text-stone-500">Pick cutline color</p>
                    </div>
                </div>
            </div>

            {/* BORDER THICKNESS SLIDER */}
            <div className="space-y-3">
                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-tight flex justify-between">
                    <span>Border Thickness</span>
                    <span className="text-rose-600 font-mono">{borderWidth.toFixed(1)}px</span>
                </label>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                    <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={borderWidth}
                        onChange={(e) => setBorderWidth(Number(e.target.value))}
                        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-mono">
                        <span>0px</span>
                        <span>5px</span>
                        <span>10px</span>
                    </div>
                </div>
            </div>

            {/* PRIMARY HEAVY ACTION: BACKEND PROCESSING TRIGGER */}
            <button
                onClick={handleRemoveBackground}
                disabled={!selectedImage || isProcessing}
                className="w-full h-12 bg-rose-600 text-white rounded-2xl font-semibold flex items-center justify-center px-4 hover:bg-rose-700 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed shadow-md shadow-rose-100 transition-all font-mono"
            >
                {/* Dynamically adjust button copy based on processing state to provide user feedback */}
                {isProcessing ? (
                    <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        <span>Processing... {elapsedTime.toFixed(1)}s</span>
                    </>
                ) : (
                    <span className="flex items-center gap-2 font-sans"><Sparkles size={18} /> Apply & Process</span>
                )}
            </button>

            {/* PERFORMANCE STATS - Shown after successful generation */}
            {!isProcessing && elapsedTime > 0 && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-500 bg-stone-100/50 py-2 px-3 rounded-2xl border border-stone-200 mx-auto w-full animate-fade-in-up transition-all">
                    <Timer size={14} className="text-emerald-500" />
                    <span>Generation applied smoothly in <span className="text-stone-700">{elapsedTime.toFixed(1)}</span> seconds</span>
                </div>
            )}

            {/* FUTURE UI PLACEHOLDER: NOT CURRENTLY ACTIVE */}
            <button disabled className="w-full h-11 bg-stone-50 border border-stone-200 text-stone-300 rounded-2xl font-medium flex items-center justify-between px-4 cursor-not-allowed">
                <span className="flex items-center gap-2"><Shirt size={18} /> Formal Suit</span>
                <span className="text-[10px] font-bold bg-white text-stone-300 px-2 py-1 rounded border border-stone-100 uppercase">Locked</span>
            </button>

            {/* MULTI-PRINT CONTROLS */}
            <div className="pt-1 space-y-4">
                <hr className="border-stone-100" />

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleResetEditor}
                        disabled={!selectedImage && elapsedTime === 0}
                        className="h-10 border border-stone-200 text-stone-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
                    >
                        <RotateCcw size={14} /> Reset
                    </button>
                    <button
                        onClick={handleStageJob}
                        disabled={!selectedImage}
                        className="h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed shadow-sm shadow-emerald-100 transition-all text-xs"
                    >
                        <PlusSquare size={14} /> Add to Canvas
                    </button>
                </div>
            </div>
        </div>
    );
}
