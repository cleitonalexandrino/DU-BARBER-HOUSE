import React from 'react';

interface HeaderProps {
    title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="flex items-center justify-between p-4 md:px-8 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
                <button className="md:hidden text-slate-600 dark:text-slate-400 p-2">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
                <button className="p-2 text-slate-600 dark:text-slate-400 relative">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    AD
                </div>
            </div>
        </header>
    );
};
