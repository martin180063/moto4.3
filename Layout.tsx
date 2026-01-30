import React from 'react';
import { Tab } from './types';
interface LayoutProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentTab, onTabChange, children }) => {
  return (
    <div className="relative min-h-screen w-full font-sans text-slate-800">
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://image2url.com/r2/default/images/1769771210479-712878e8-f369-424d-864b-fe73eddeeba8.jpg')`, 
        }}
      >
        {/* Subtle overlay to help text readability without blocking the view */}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 pt-8 pb-12 md:pt-12">
        
        {/* Title Section - Using darker text color for better contrast against the light painting if needed, or keeping it dark with shadow */}
        <div className="mb-6 text-center animate-slide-up">
          <h1 className="text-4xl font-black tracking-widest text-slate-800 drop-shadow-sm md:text-5xl lg:text-6xl">
            騎車旅行
          </h1>
          <h2 className="mt-2 text-lg font-bold text-slate-700 md:text-2xl tracking-wider">
            最強四天三夜行程
          </h2>
        </div>

        {/* Navigation - Floating Pills */}
        <div className="sticky top-4 z-50 mb-6 w-full max-w-5xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto rounded-full bg-white/40 p-1.5 shadow-lg backdrop-blur-md md:justify-center border border-white/50">
            {Object.values(Tab).map((tab) => {
              const isActive = currentTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`flex-shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-all duration-300
                    ${isActive 
                      ? 'bg-sky-600 text-white shadow-md transform scale-105' 
                      : 'bg-white/60 text-slate-700 hover:bg-white hover:text-sky-600'
                    }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Card - Increased transparency in CSS (glass-card class) */}
        <div className="glass-card w-full max-w-5xl animate-slide-up overflow-hidden rounded-[2rem] shadow-xl transition-all" style={{ animationDelay: '0.2s' }}>
           <div className="min-h-[50vh] p-4 md:p-8">
              {children}
           </div>
        </div>

        <div className="mt-8 text-center text-xs font-medium text-slate-600/80 drop-shadow-sm bg-white/30 px-4 py-1 rounded-full backdrop-blur-sm">
          Powered by Gemini AI • Make your journey memorable
        </div>
      </div>
    </div>
  );
};
