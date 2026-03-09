import React from 'react';
import { supabase } from '../../lib/supabase';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    return (
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col bg-slate-50 dark:bg-slate-900 shrink-0">
            <div className="p-6 flex items-center justify-center">
                <img src="/logo.png" alt="DU BARBER HOUSE Logo" className="h-20 object-contain" />
            </div>
            <nav className="flex-1 px-4 space-y-1 mt-4">
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }} className={`nav-item flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined">dashboard</span>
                    <span className="font-medium">Dashboard</span>
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('agendamentos'); }} className={`nav-item flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'agendamentos' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined">calendar_month</span>
                    <span className="font-medium">Agendamentos</span>
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('servicos'); }} className={`nav-item flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'servicos' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined">design_services</span>
                    <span className="font-medium">Serviços</span>
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('clientes'); }} className={`nav-item flex items-center gap-3 px-4 py-3 rounded-lg ${activeTab === 'clientes' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined">group</span>
                    <span className="font-medium">Clientes</span>
                </a>
            </nav>
            <div className="p-4 mt-auto">
                <button
                    onClick={() => supabase.auth.signOut()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900"
                >
                    <span className="material-symbols-outlined text-base">logout</span>
                    Sair
                </button>
            </div>
        </aside>
    );
};
