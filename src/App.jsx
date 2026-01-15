import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import PhotoEngine from './components/PhotoEngine';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthModal from './components/AuthModal';
import UpdatePassword from './components/UpdatePassword';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isRecoveryMode } = useAuth(); 

  // This function handles the logic: "If going to Engine but not logged in -> Show Login Modal"
  const handleNavigate = (page) => {
    if (page === 'engine' && !user) {
      setShowAuthModal(true);
    } else {
      setCurrentPage(page);
    }
  };

  // 1. Priority: If in recovery mode (clicked email link), SHOW UPDATE PASSWORD
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
          // PASS THE NAVIGATE FUNCTION HERE
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
    </>
  );
}

const AppWrapper = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default AppWrapper;