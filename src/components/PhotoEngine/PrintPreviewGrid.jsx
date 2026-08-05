import React from 'react';
import { Image as ImageIcon, Trash2 } from 'lucide-react';

/**
 * PrintPreviewGrid Component
 * Handles the logic of iterating over a chosen layout template and rendering rows
 * of dynamic 'boxes' into an A4 page wrapper format. Contains inline styles driven by user picks.
 */
export default function PrintPreviewGrid({ currentPackage, selectedImage, borderColor, borderWidth, stagedJobs = [], onRemoveJob }) {
  // Shared dynamic properties tied to state updates
  const printCSSVariables = {
    "--print-border-color": borderColor,
    "--print-border-width": `${borderWidth}px`
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-xl min-h-[600px] flex flex-col print:shadow-none print:border-none print:rounded-none">
      {/* Header / Title block inside the white card frame. This completely hides itself when actually printing */}
      <div className="border-b border-stone-200 p-4 bg-stone-50/80 rounded-t-2xl flex justify-between items-center print:hidden">
        <h2 className="font-bold text-stone-800 text-lg flex items-center gap-2">
          {stagedJobs.length > 0 ? "Print Canvas Tracker" : `Preview: ${currentPackage.name}`}
        </h2>
        <div className="flex gap-2">
          <span className="text-xs font-mono bg-amber-50 border border-amber-200 text-amber-600 px-2 py-1 rounded font-bold">
            {stagedJobs.length} Staged
          </span>
          <span className="text-xs font-mono bg-white border border-stone-200 px-2 py-1 rounded text-stone-500">
            A4 • 210 x 297 mm
          </span>
        </div>
      </div>

      {/* Print canvas. Note that variables bound here cascade down to all inner css children */}
      <div id="print-canvas" className="p-8 print:p-0 bg-white flex-1 flex flex-col items-center" style={printCSSVariables}>

        {/* 1. MAPPED STAGED JOBS */}
        {stagedJobs.map((job, jobIndex) => (
          <div key={job.id} className="w-full relative group mb-8 print:mb-0 pb-6 print:pb-0 border-b border-dashed border-stone-200 print:border-none last:border-none">
            {/* Remove Action (Hidden on Print) */}
            <div className="absolute -right-12 top-0 h-full flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
              <button onClick={() => onRemoveJob(job.id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors shadow-sm" title="Remove Job">
                <Trash2 size={16} />
              </button>
            </div>

            {job.package.layout.map((group, groupIndex) => (
              <div
                key={`${job.id}-${groupIndex}`}
                className={`
                  w-full grid mb-4 
                  print:mb-0 print:gap-0 print:w-[8in] print-grid print-grid-cols-${group.cols}
                  ${job.package.hasGap ? 'gap-4' : 'gap-0 justify-center'} 
                `}
                style={{
                  gridTemplateColumns: !job.package.hasGap && group.type === 'passport'
                    ? `repeat(${group.cols}, 35mm)`
                    : `repeat(${group.cols}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: group.count }).map((_, i) => (
                  <div
                    key={`${job.id}-${group.type}-${i}`}
                    className={`
                      aspect-square bg-white relative overflow-hidden
                      print:aspect-auto
                      photo-box size-${group.type}
                    `}
                    style={{ border: `${job.borderWidth}px solid ${job.borderColor}` }}
                  >
                    <img src={job.image} className="w-full h-full object-cover" alt="ID Photo" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        {/* 2. THE LIVE PREVIEW DRAFT SECTION */}
        {/* We only render the live preview if they are actively editing an image or have zero staged jobs */}
        {(selectedImage || stagedJobs.length === 0) && (
          <div className={`w-full opacity-50 hover:opacity-100 transition-opacity relative group print:hidden ${stagedJobs.length > 0 ? 'pt-8 mt-8 border-t border-dashed border-stone-200' : ''}`}>
            {stagedJobs.length > 0 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-xs font-bold text-stone-400 uppercase tracking-widest border border-stone-200 rounded-full">
                Live Staging Draft
              </div>
            )}
            {currentPackage.layout.map((group, groupIndex) => (
              <div
                key={`live-${groupIndex}`}
                className={`
                  w-full grid mb-4 
                  print:mb-0 print:gap-0 print:w-[8in] print-grid print-grid-cols-${group.cols}
                  ${currentPackage.hasGap ? 'gap-4' : 'gap-0 justify-center'} 
                `}
                style={{
                  gridTemplateColumns: !currentPackage.hasGap && group.type === 'passport'
                    ? `repeat(${group.cols}, 35mm)`
                    : `repeat(${group.cols}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: group.count }).map((_, i) => (
                  <div
                    key={`live-${group.type}-${i}`}
                    className={`
                      aspect-square bg-white relative overflow-hidden
                      print:aspect-auto
                      photo-box size-${group.type}
                    `}
                    style={{ border: `${borderWidth}px solid ${borderColor}` }}
                  >
                    {selectedImage ? (
                      <img src={selectedImage} className="w-full h-full object-cover" alt="Draft" />
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
        )}
      </div>
    </div>
  );
}
