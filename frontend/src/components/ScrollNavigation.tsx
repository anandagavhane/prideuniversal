import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const ScrollNavigation: React.FC = () => {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Show scroll-to-top button when scrolled down past 250px
      setShowTop(scrollY > 250);

      // Show scroll-to-bottom button when not within 200px of page bottom
      setShowBottom(scrollY + windowHeight < docHeight - 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to establish initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  if (!showTop && !showBottom) return null;

  return (
    <div 
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 right-3 sm:right-6 z-40 flex flex-col gap-2 items-center print:hidden select-none"
      role="region"
      aria-label="Quick Scroll Navigation"
    >
      {showTop && (
        <button
          onClick={scrollToTop}
          title="Scroll to Top"
          aria-label="Scroll to Top"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-red-800 to-red-950 text-amber-200 border-2 border-amber-300 shadow-xl flex items-center justify-center hover:scale-110 hover:brightness-110 active:scale-95 transition-all duration-200 backdrop-blur-sm"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
        </button>
      )}

      {showBottom && (
        <button
          onClick={scrollToBottom}
          title="Scroll to Bottom"
          aria-label="Scroll to Bottom"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-red-800 to-red-950 text-amber-200 border-2 border-amber-300 shadow-xl flex items-center justify-center hover:scale-110 hover:brightness-110 active:scale-95 transition-all duration-200 backdrop-blur-sm"
        >
          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
        </button>
      )}
    </div>
  );
};

