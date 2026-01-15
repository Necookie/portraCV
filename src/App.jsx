import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import PhotoEngine from './components/PhotoEngine';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleNavigate = (page) => {
    if (page === 'engine' && !user) {
      setShowAuthModal(true);
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <MainLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAuth={() => setShowAuthModal(true)}
      >
        {currentPage === 'landing' ? (
          <LandingPage />
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
    <App />
  </AuthProvider>
);

export default AppWrapper;