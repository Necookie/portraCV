import React from 'react';
import { Camera, LayoutTemplate, Home, User } from 'lucide-react';

export default function Navbar({ onNavigate, currentPage, user, onLogin }) {
    
    // Helper to style active/inactive links
    const getLinkClass = (pageName) => {
        return currentPage === pageName 
            ? "text-indigo-600 bg-indigo-50 font-bold px-4 py-2 rounded-full transition-all" 
            : "text-slate-600 hover:text-indigo-600 font-medium px-4 py-2 transition-colors";
    };

    return (
        // 1. CONTAINER: Keeps the "Floating Island" look (w-[95%], rounded-2xl, top-5)
        <nav className="sticky top-5 z-50 mx-auto w-[95%] max-w-7xl bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm mb-10 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* --- LEFT SIDE: LOGO + NAV LINKS --- */}
                    <div className="flex items-center gap-8">
                        
                        {/* A. Logo */}
                        <div 
                            className="flex items-center gap-2 cursor-pointer" 
                            onClick={() => onNavigate('landing')}
                        >
                            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                                <Camera size={24} />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">PortraCV</span>
                        </div>

                        {/* B. Links (Grouped next to logo) */}
                        <div className="hidden md:flex items-center gap-1">
                            <button 
                                onClick={() => onNavigate('engine')} 
                                className={getLinkClass('engine')}
                            >
                                <span className="flex items-center gap-2">
                                    <LayoutTemplate size={18} /> Layout Engine
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: AUTH BUTTONS --- */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            // Logged In State
                            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                    <p className="text-xs text-slate-500">{user.credits} Credits</p>
                                </div>
                                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 border border-indigo-200">
                                    <User size={20} />
                                </div>
                            </div>
                        ) : (
                            // Guest State: Separated Login & Sign Up
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={onLogin}
                                    className="text-slate-600 hover:text-indigo-600 font-medium px-4 py-2 transition-colors"
                                >
                                    Log in
                                </button>
                                <button 
                                    onClick={onLogin}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Sign up
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}