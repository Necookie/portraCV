import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import PhotoEngine from './components/PhotoEngine';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <AuthProvider>
      {/* Everything inside here can now access the user! */}
      <MainLayout 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onOpenAuth={() => setShowAuthModal(true)}
      >
        {currentPage === 'landing' ? <LandingPage /> : <PhotoEngine />}
      </MainLayout>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </AuthProvider>
  );
}
export default App;