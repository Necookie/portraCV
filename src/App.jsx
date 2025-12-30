import React, { useState } from 'react';
import MainLayout from './components/MainLayout';
import PhotoEngine from './components/PhotoEngine';
import LandingPage from './components/LandingPage';

function App() {
  // 1. STATE: Default to 'landing' page
  const [currentPage, setCurrentPage] = useState('landing');

  return (
    // 2. Pass the state and the switcher function to MainLayout
    <MainLayout currentPage={currentPage} onNavigate={setCurrentPage}>
       
       {/* 3. CONDITIONAL RENDERING: Swap components based on state */}
       {currentPage === 'landing' ? (
          <LandingPage />
       ) : (
          <PhotoEngine />
       )}
       
    </MainLayout>
  );
}

export default App;