import React from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, X, Check } from 'lucide-react';

/**
 * CropperModal Component
 * Decouples the React-Easy-Crop modal pop-over element from the main Engine JSX.
 * Renders full screen logic conditionally based on higher-level state.
 */
export default function CropperModal({
    originalImage,
    crop,
    zoom,
    setCrop,
    setZoom,
    onCropComplete,
    handleSaveCrop,
    setIsCropping
}) {
    return (
        <div className="fixed inset-0 z-50 bg-stone-900/90 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Main overlay container frame */}
            <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl">

                {/* Header bar */}
                <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50">
                    <h3 className="font-bold text-stone-700">Adjust Photo</h3>
                    <button onClick={() => setIsCropping(false)} className="text-stone-400 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Cropping Context bounded to container height */}
                <div className="relative h-[400px] w-full bg-stone-100">
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

                {/* Controls Footer */}
                <div className="p-6 space-y-4">
                    {/* Zoom Range Slider */}
                    <div className="flex items-center gap-4">
                        <ZoomIn size={18} className="text-stone-400" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                        />
                    </div>
                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsCropping(false)}
                            className="flex-1 py-3 text-stone-600 font-semibold hover:bg-stone-50 rounded-2xl transition-colors border border-stone-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveCrop}
                            className="flex-1 py-3 bg-rose-600 text-white font-semibold rounded-2xl hover:bg-rose-700 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <Check size={18} /> Apply Crop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
