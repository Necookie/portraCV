import React from 'react';
import { Camera, LayoutTemplate, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate, currentPage, onLogin }) {
    const { user, signOut } = useAuth();

    // Dynamically assign active link styling
    const getLinkClass = (pageName) => {
        return currentPage === pageName
            ? "text-rose-600 bg-rose-50 font-bold px-4 py-2 rounded-full transition-all"
            : "text-stone-600 hover:text-rose-600 font-medium px-4 py-2 transition-colors";
    };

    return (
        <nav className="sticky top-5 z-50 mx-auto w-[95%] max-w-7xl bg-white/90 backdrop-blur-md border border-stone-200 rounded-3xl shadow-sm mb-10 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* LEFT SIDE: Brand & Navigation Links */}
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
                            <div className="bg-rose-50 p-2 rounded-2xl text-rose-600"><Camera size={24} /></div>
                            <span className="text-xl font-bold text-stone-900 tracking-tight">PortraCV</span>
                        </div>
                        <div className="hidden md:flex items-center gap-1">
                            <button onClick={() => onNavigate('engine')} className={getLinkClass('engine')}>
                                <span className="flex items-center gap-2"><LayoutTemplate size={18} /> Layout Engine</span>
                            </button>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Auth & Profile */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3 pl-6 border-l border-stone-200">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-bold text-stone-900">{user.email.split('@')[0]}</p>
                                    <p className="text-xs text-stone-500">Free Tier</p>
                                </div>
                                {/* Profile Dropdown Container */}
                                <div className="group relative">
                                    <div className="h-10 w-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 border border-rose-200 cursor-pointer">
                                        <User size={20} />
                                    </div>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-lg p-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={signOut} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors">
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={onLogin} className="text-stone-600 hover:text-rose-600 font-medium px-4 py-2 transition-colors">Log in</button>
                                <button onClick={onLogin} className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-full font-medium shadow-md transition-colors">Sign up</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}