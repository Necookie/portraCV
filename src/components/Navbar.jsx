import React from 'react';
import { Camera } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="sticky top-5 z-50 mx-auto w-[95%] max-w-7xl bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm mb-10 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        {/* Brand Logo Area */}
                        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                            <Camera size={24} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">PortraCV</span>
                    </div>
                    
                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}