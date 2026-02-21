import React from 'react';
import { Camera, Github, User, Mail } from 'lucide-react';

/**
 * Globally reusable Footer Component
 * Rendered at the bottom of standard unauthenticated and authenticated pages
 * Extracted from PhotoEngine to allow usage everywhere else without repeating code.
 */
export default function Footer() {
    return (
        <footer className="py-16 bg-slate-50 border-t border-slate-200 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 2-Column Desktop Grid for Footer contents */}
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Branding Hook */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                                <Camera size={20} />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">PortraCV</span>
                        </div>
                        <p className="text-slate-600 mb-6 max-w-sm">The ultimate SaaS solution for printing shops.</p>
                        <a href="https://github.com/Necookie" className="text-slate-400 hover:text-slate-900" target="_blank" rel="noreferrer">
                            <Github size={24} />
                        </a>
                    </div>

                    {/* Right Column: Developer Contact Info Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Developer Contact</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User size={20} className="text-indigo-600 mt-1" />
                                <div>
                                    <p className="font-semibold text-slate-900">Dheyn Michael Orlanda</p>
                                    <p className="text-sm text-slate-500">Lead Developer (Necookie.dev)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-indigo-600" />
                                <a href="mailto:Dheyn.main@gmail.com" className="text-slate-600 hover:text-indigo-600">Dheyn.main@gmail.com</a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Minimal Copyright Bottom Line */}
                <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
                    © {new Date().getFullYear()} Necookie.dev. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
