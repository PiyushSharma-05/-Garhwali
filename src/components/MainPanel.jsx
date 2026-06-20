import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomeView from './WelcomeView';
import ChatArea from './ChatArea';
import { LuPanelLeftOpen, LuPanelLeftClose } from 'react-icons/lu';
import { IoSend } from 'react-icons/io5';

const MainPanel = ({ messages = [], setMessages, currentUser, isSidebarOpen, setIsSidebarOpen, onNavigateAbout }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [subGreeting, setSubGreeting] = useState('How can I help you today?');
  const [isHoveredOpen, setIsHoveredOpen] = useState(false);

  const inputRef = useRef(null);
  const safeMessages = Array.isArray(messages) ? messages : [];

  useEffect(() => {
    const dynamicPhrases = [
      "How can I assist you with your translations today?",
      "What's on your mind? Let’s explore the Garhwali language together.",
      "I'm here to help you translate, learn, and discover.",
      "Let’s dive into language discovery—where should we begin?",
      "Ready to translate? Tell me what you need.",
      "Ask me anything to start our conversation."
    ];
    setSubGreeting(dynamicPhrases[Math.floor(Math.random() * dynamicPhrases.length)]);
  }, [safeMessages.length]);

  useEffect(() => {
    if (safeMessages.length > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [safeMessages.length]);

  const handleSendMessage = async () => {

    if (inputText.trim() === '') return;

    const question = inputText;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: question
    };

    const updatedMessages = [
      ...safeMessages,
      userMessage
    ];

    setMessages(updatedMessages);

    setInputText('');

    setIsLoading(true);

    try {

      const { loadDataset } =
        await import('../ai/datasetLoader');

      const { retrieve } =
        await import('../ai/retrieve');

      const data =
        await loadDataset();

      const rows =
        retrieve(
          data,
          question
        );

      let reply;

      if (
        rows.length
      ) {

        const {
          generateAnswer
        }
          =
          await import(
            '../ai/generate'
          );

        reply =
          await generateAnswer(
            question,
            rows
          );

      }

      else {

        reply =
          "Translation unavailable.";

      }

      setMessages([

        ...updatedMessages,

        {

          id:
            Date.now() + 1,

          sender:
            'bot',

          text:
            reply

        }

      ]);

    }

    catch (err) {

      console.log(err);

      setMessages([

        ...updatedMessages,

        {

          id:
            Date.now() + 1,

          sender:
            'bot',

          text:
            "Dataset load failed."

        }

      ]);

    }

    setIsLoading(false);

  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div layout className="w-full flex-1 h-full flex flex-col relative bg-transparent overflow-hidden">

      {/* Header Panel */}
      <div className="w-full bg-[#150e26]/20 backdrop-blur-md border-b border-purple-950/10 h-16 flex items-center justify-between px-8 z-20 relative shadow-md">
        <div className="flex items-center gap-4">
          <AnimatePresence mode="popLayout">
            {!isSidebarOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setIsHoveredOpen(true)}
                onMouseLeave={() => setIsHoveredOpen(false)}
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/30 text-slate-400 hover:text-slate-100 shadow-md transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                {isHoveredOpen ? <LuPanelLeftOpen className="text-sm text-emerald-400" /> : <LuPanelLeftClose className="text-sm" />}
              </motion.button>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-x-1 select-none tracking-tight font-sans">
            <span className="text-lg font-bold text-[#00c48d]">मि</span>
            <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00c48d] via-[#a855f7] to-[#ec4899] ml-0.5">
              Garhwali
            </span>
          </div>
        </div>

        <motion.button
          onClick={onNavigateAbout}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 196, 141, 0.1)', borderColor: '#00c48d' }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-1.5 rounded-xl text-xs font-bold border border-slate-800 text-[#00c48d] bg-slate-900/40 tracking-wider transition-all cursor-pointer"
        >
          About Us
        </motion.button>
      </div>

      {/* Main Structural Container Content Block Grid mapping layout height logic */}
      <div className="w-full flex-1 overflow-hidden relative z-10 flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {safeMessages.length === 0 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="w-full max-w-2xl flex flex-col justify-center items-center px-4 space-y-6"
            >
              {/* Dynamic Interface Logo Rendering Grid View Component */}
              <WelcomeView subGreeting={subGreeting} currentUser={currentUser} />

              {/* Compressed Search Bar Wrapper block */}
              <div className="w-full flex justify-center">
                <motion.div
                  whileHover={{
                    scale: 1.002,
                    borderColor: 'rgba(0, 196, 141, 0.3)',
                    boxShadow: '0 20px 30px -10px rgba(0,0,0,0.7)'
                  }}
                  transition={{ duration: 0.2 }}
                  className="w-full bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 rounded-2xl flex items-center gap-4 pl-5 pr-2.5 py-2.5 transition-all duration-300 focus-within:border-[#00c48d]/50 focus-within:bg-slate-900"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent outline-none text-sm text-slate-100 placeholder-slate-500"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    whileHover={inputText.trim() ? { scale: 1.02 } : {}}
                    whileTap={inputText.trim() ? { scale: 0.98 } : {}}
                    className={`p-2 rounded-xl transition-all ${inputText.trim() ? 'bg-[#00c48d] text-slate-950 cursor-pointer' : 'bg-slate-800/40 text-slate-600'}`}
                  >
                    <IoSend className="text-xs" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="chat" className="h-full w-full flex flex-col justify-between pb-6">
              <ChatArea messages={safeMessages} isLoading={isLoading} />

              <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-2xl px-4 flex justify-center">
                  <motion.div
                    whileHover={{
                      scale: 1.002,
                      borderColor: 'rgba(0, 196, 141, 0.3)',
                      boxShadow: '0 20px 30px -10px rgba(0,0,0,0.7)'
                    }}
                    transition={{ duration: 0.2 }}
                    className="w-full bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 rounded-2xl flex items-center gap-4 pl-5 pr-2.5 py-2.5 transition-all duration-300 focus-within:border-[#00c48d]/50 focus-within:bg-slate-900"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything..."
                      className="flex-1 bg-transparent outline-none text-sm text-slate-100 placeholder-slate-500"
                    />
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim()}
                      whileHover={inputText.trim() ? { scale: 1.02 } : {}}
                      whileTap={inputText.trim() ? { scale: 0.98 } : {}}
                      className={`p-2 rounded-xl transition-all ${inputText.trim() ? 'bg-[#00c48d] text-slate-950 cursor-pointer' : 'bg-slate-800/40 text-slate-600'}`}
                    >
                      <IoSend className="text-xs" />
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MainPanel;