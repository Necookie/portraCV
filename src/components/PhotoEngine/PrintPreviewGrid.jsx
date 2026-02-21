import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

/**
 * PrintPreviewGrid Component
 * Handles the logic of iterating over a chosen layout template and rendering rows
 * of dynamic 'boxes' into an A4 page wrapper format. Contains inline styles driven by user picks.
 */
export default function PrintPreviewGrid({ currentPackage, selectedImage, borderColor, borderWidth }) {
    // Shared dynamic properties tied to state updates
    const printCSSVariables = {
        "--print-border-color": borderColor,
        "--print-border-width": `${borderWidth}px`
    };

    return (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col print:shadow-none print:border-none print:rounded-none">
            {/* Header / Title block inside the white card frame. This completely hides itself when actually printing */}
            <div className="border-b border-stone-200 p-4 bg-stone-50/80 flex justify-between items-center print:hidden">
                <h2 className="font-bold text-stone-800 text-lg flex items-center gap-2">
                    Preview: {currentPackage.name}
                </h2>
                <span className="text-xs font-mono bg-white border border-stone-200 px-2 py-1 rounded text-stone-500">
                    A4 • 210 x 297 mm
                </span>
            </div>

            {/* Print canvas. Note that variables bound here cascade down to all inner css children */}
            <div id="print-canvas" className="p-8 print:p-0 bg-white flex-1 flex flex-col items-center" style={printCSSVariables}>
                {currentPackage.layout.map((group, groupIndex) => (
                    <div
                        key={groupIndex}
                        className={`
                            w-full grid mb-4 
                            print:mb-0 print:gap-0 print:w-[8in] print-grid print-grid-cols-${group.cols}
                            ${currentPackage.hasGap ? 'gap-4' : 'gap-0 justify-center'} 
                        `}
                        style={{
                            // Conditional styling for Preview to match the printed output behavior as close as possible
                            gridTemplateColumns: !currentPackage.hasGap && group.type === 'passport'
                                ? `repeat(${group.cols}, 35mm)` // Explicitly pack columns for passport layout without relying on browser auto-fll
                                : `repeat(${group.cols}, minmax(0, 1fr))`
                        }}
                    >
                        {Array.from({ length: group.count }).map((_, i) => (
                            <div
                                key={`${group.type}-${i}`}
                                className={`
                                    aspect-square bg-white relative overflow-hidden
                                    print:aspect-auto
                                    photo-box size-${group.type}
                                `}
                                style={{ border: `${borderWidth}px solid ${borderColor}` }}
                            >
                                {/* Only render the image inside the rigid box if user provided an image. Otherwise show placeholder */}
                                {selectedImage ? (
                                    <img src={selectedImage} className="w-full h-full object-cover" alt="ID Photo" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
