import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Dashboard } from './pages/Dashboard';
import { Agendamentos } from './pages/Agendamentos';
import { Servicos } from './pages/Servicos';
import { Clientes } from './pages/Clientes';

const App: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<string>('dashboard');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!session) {
        return <Login />;
    }

    const getPageTitle = (tab: string) => {
        switch (tab) {
            case 'dashboard': return 'Dashboard Principal';
            case 'agendamentos': return 'Agendamentos';
            case 'servicos': return 'Gerenciar Serviços';
            case 'clientes': return 'Clientes';
            default: return 'DU BARBER HOUSE';
        }
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'agendamentos': return <Agendamentos />;
            case 'servicos': return <Servicos />;
            case 'clientes': return <Clientes />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex h-screen overflow-hidden font-display">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <Header title={getPageTitle(activeTab)} />
                <div className="p-4 md:p-8 space-y-8 pb-20 md:pb-8">
                    {renderActiveTab()}
                </div>
            </main>

            <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default App;
