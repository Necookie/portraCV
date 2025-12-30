import React from 'react';
import Navbar from './Navbar';

// Receive props from App.jsx
export default function MainLayout({ children, currentPage, onNavigate }) {
    
    // Mock user for now (you can add login logic later)
    const user = null; 
    const handleLogin = () => alert("Login Modal Coming Soon");

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Pass the props down to the Navbar */}
            <Navbar 
                currentPage={currentPage} 
                onNavigate={onNavigate} 
                user={user}
                onLogin={handleLogin}
            />
            
            {/* Render the specific page (Landing or Engine) */}
            <main>
                {children}
            </main>
        </div>
    );
}