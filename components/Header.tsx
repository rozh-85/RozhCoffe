
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Header({ isDarkMode, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-primary font-display text-2xl md:text-3xl tracking-wide select-none drop-shadow-sm">
            Rozh
          </span>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={onToggleTheme}
            className="bg-surface-light dark:bg-zinc-800 p-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:scale-105 active:scale-95 transition-all"
            title="Toggle Theme"
          >
            <span className="material-icons-round text-xl dark:hidden">dark_mode</span>
            <span className="material-icons-round text-xl hidden dark:block">light_mode</span>
          </button>
        </div>
      </div>
    </header>
  );
}
