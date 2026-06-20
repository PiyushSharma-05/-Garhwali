import React from 'react';
import logoImg from './logo.png';

const WelcomeView = ({ subGreeting, currentUser }) => {
  const isGuest = !currentUser || currentUser.isGuest;

  return (
    <div className="text-center flex flex-col justify-center items-center select-none pointer-events-none w-full">
      
      {/* Shifted upward with -mt-24 and aggressively pulled the text block up using -mb-28 to eliminate structural padding gaps */}
      <div className="w-[380px] h-[380px] md:w-[440px] md:h-[440px] -mt-24 -mb-28 drop-shadow-[0_0_50px_rgba(139,92,246,0.15)] select-none pointer-events-none flex items-center justify-center relative">
        <img 
          src={logoImg} 
          alt="मि Garhwali Logo" 
          className="w-full h-full object-contain scale-100 transform"
        />
      </div>

      {/* Balanced text stack layout */}
      <h2 className="text-3xl md:text-4xl font-black text-slate-100 tracking-tight">
        {isGuest ? (
          "Let's jump right in!"
        ) : (
          <>
            Let's jump in,{' '}
            <span className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {(currentUser?.name || "User").split(" ")[0]}!
            </span>
          </>
        )}
      </h2>
      
      <p className="text-xs md:text-sm font-medium text-slate-400/80 mt-1.5 tracking-wide max-w-xl text-center px-4 leading-relaxed">
        {subGreeting}
      </p>
    </div>
  );
};

export default WelcomeView;