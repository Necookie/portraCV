import React from 'react';
import Navbar from './Navbar';

export default function MainLayout({ children, currentPage, onNavigate, onOpenAuth }) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar 
                currentPage={currentPage} 
                onNavigate={onNavigate} 
                onLogin={onOpenAuth}
            />
            <main>{children}</main>
        </div>
    );
}