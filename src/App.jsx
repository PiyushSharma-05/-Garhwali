import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainPanel from './components/MainPanel';
import AboutUsView from './components/AboutUsView';
import AuthView from './components/AuthView';
import { AnimatePresence } from 'framer-motion';
import { syncUser } from "./backend/syncUser";

function App() {
  const [messages, setMessages] = useState([]);
  const [currentView, setCurrentView] = useState('chat'); // 'chat' | 'about'
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('garhwali_active_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebar_open');
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebar_open', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSignInSuccess =
    async (user) => {
      console.log(user)

      await syncUser(
        user
      );

      setCurrentUser(
        user
      );

      localStorage.setItem(
        'garhwali_active_session',
        JSON.stringify(user)
      );

      setShowAuthModal(
        false
      );

    };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('garhwali_active_session');
    localStorage.removeItem('auth_token');
    setCurrentView('chat');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-tr from-[#0b0714] via-[#0f0a1c] to-[#150e26] flex text-slate-100 font-sans antialiased relative">
      <div className="h-screen w-screen overflow-hidden bg-[#0f0a1c] flex text-slate-100 font-sans antialiased relative">
        <AnimatePresence mode="wait">
          <Sidebar
            isOpen={isSidebarOpen}
            onNewChat={handleNewChat}
            currentUser={currentUser}
            onSignOut={handleSignOut}
            onSignInClick={() => setShowAuthModal(true)}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </AnimatePresence>

        {currentView === 'chat' ? (
          <MainPanel
            messages={messages}
            setMessages={setMessages}
            currentUser={currentUser}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            onNavigateAbout={() => setCurrentView('about')}
          />
        ) : (
          <AboutUsView
            onBack={() => setCurrentView('chat')}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}

        <AnimatePresence>
          {showAuthModal && (
            <AuthView
              onAuthSuccess={handleSignInSuccess}
              onClose={() => setShowAuthModal(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;