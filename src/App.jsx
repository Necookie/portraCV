import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import PhotoEngine from './components/PhotoEngine';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthModal from './components/AuthModal';
import UpdatePassword from './components/UpdatePassword';
// 1. Import the new ChatWidget
import ChatWidget from './components/ChatWidget';

const BACKEND_URL = "https://necookie-portracv-backend.hf.space";

function AppContent() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
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

  // This function handles the logic: "If going to Engine but not logged in -> Show Login Modal"
  const handleNavigate = (page) => {
    if (page === 'engine' && !user) {
      setShowAuthModal(true);
    } else {
      setCurrentPage(page);
    }
  };

  // Priority: If in recovery mode (clicked email link), SHOW UPDATE PASSWORD
  if (isRecoveryMode) {
      return <UpdatePassword />;
  }

  return (
    <>
      <MainLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={() => setShowAuthModal(true)}
      >
        {currentPage === 'landing' ? (
          <LandingPage onNavigate={handleNavigate} />
        ) : (
          <ProtectedRoute>
            <PhotoEngine />
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