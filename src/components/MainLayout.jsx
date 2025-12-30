import React from 'react';
import Navbar from './navbar'; // Importing from the same folder

export default function MainLayout({ children }) {
    return (
        // Moved the global background/font styles here
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10 transition-colors duration-300">
            <Navbar />
            
            {/* The content (PhotoEngine) will be rendered here */}
            <main>
                {children}
            </main>
        </div>
    );
}