import React from 'react';
import { supabase } from '../../lib/supabase';

interface MobileNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-2 z-20">
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }} className={`nav-item flex flex-col items-center p-2 ${activeTab === 'dashboard' ? 'text-primary' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined">dashboard</span>
                <span className="text-[10px] font-medium">Home</span>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('agendamentos'); }} className={`nav-item flex flex-col items-center p-2 ${activeTab === 'agendamentos' ? 'text-primary' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined">calendar_month</span>
                <span className="text-[10px] font-medium">Agenda</span>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('servicos'); }} className={`nav-item flex flex-col items-center p-2 ${activeTab === 'servicos' ? 'text-primary' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined">design_services</span>
                <span className="text-[10px] font-medium">Serviços</span>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('clientes'); }} className={`nav-item flex flex-col items-center p-2 ${activeTab === 'clientes' ? 'text-primary' : 'text-slate-400'}`}>
                <span className="material-symbols-outlined">group</span>
                <span className="text-[10px] font-medium">Clientes</span>
            </a>
            <button onClick={() => supabase.auth.signOut()} className="nav-item flex flex-col items-center p-2 text-red-400 hover:text-red-500">
                <span className="material-symbols-outlined">logout</span>
                <span className="text-[10px] font-medium">Sair</span>
            </button>
        </nav>
    );
};
