import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import PhotoEngine from './components/PhotoEngine';
import BackgroundRemover from './components/BackgroundRemover';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthModal from './components/AuthModal';
import UpdatePassword from './components/UpdatePassword';
// 1. Import the new ChatWidget
import ChatWidget from './components/ChatWidget';
import { BACKEND_URL } from './constants/packages';

function AppContent() {
  // --- LOCAL STATE ---
  const [currentPage, setCurrentPage] = useState('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // --- CONTEXT ---
  // Pull authenticated user state and recovery edge-cases from global auth
  const { user, isRecoveryMode } = useAuth();

  // Keep-alive mechanism for Hugging Face backend
  useEffect(() => {
    const pingBackend = async () => {
      try {
        await fetch(`${BACKEND_URL}/keep-alive`);
        console.log("Keep-alive ping sent to backend.");
      } catch (error) {
        console.error("Keep-alive ping failed.", error);
      }
    };

    // Ping immediately on load to wake up the space
    pingBackend();

    // Ping every 5 minutes (300,000 ms) to prevent it from sleeping
    const interval = setInterval(pingBackend, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // --- NAVIGATION LOGIC ---
  /**
   * Central orchestrator for page routing.
   * Intercepts attempts to access protected routes (PhotoEngine) 
   * and prompts the Auth Modal if the user is unauthenticated.
   */
  const handleNavigate = (page) => {
    if ((page === 'engine' || page === 'bg-remover') && !user) {
      setShowAuthModal(true);
    } else {
      setCurrentPage(page);
    }
  };

  // --- EDGE CASE RENDERS ---
  // Priority Route: If returning from an emailed reset-password link, force the Update view
  if (isRecoveryMode) {
    return <UpdatePassword />;
  }

  // --- MAIN RENDER TREE ---
  return (
    <>
      {/* 
        MainLayout acts as a static shell (Navbar + structural padding).
        The dynamic page content is passed inside as children. 
      */}
      <MainLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={() => setShowAuthModal(true)}
      >
        {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {currentPage === 'engine' && (
          <ProtectedRoute>
            <PhotoEngine />
          </ProtectedRoute>
        )}
        {currentPage === 'bg-remover' && (
          <ProtectedRoute>
            <BackgroundRemover />
          </ProtectedRoute>
        )}
      </MainLayout>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* 2. Add the ChatWidget here so it floats above everything */}
      <ChatWidget />
    </>
  );
}

const AppWrapper = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default AppWrapper;