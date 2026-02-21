import React from 'react';
import Navbar from './Navbar';

/**
 * MainLayout Component
 * Serves as the persistent app shell wrapping the router views.
 * Ensures the Navbar stays mounted at the top of all pages and provides a 
 * consistent background styling across the app.
 */
export default function MainLayout({ children, currentPage, onNavigate, onOpenAuth }) {
    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            <Navbar
                currentPage={currentPage}
                onNavigate={onNavigate}
                onLogin={onOpenAuth}
            />
            <main>{children}</main>
        </div>
    );
}