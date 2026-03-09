import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Dashboard } from './pages/Dashboard';
import { Agendamentos } from './pages/Agendamentos';
import { Servicos } from './pages/Servicos';
import { Clientes } from './pages/Clientes';
import { ClientBooking } from './pages/ClientBooking';

const AdminLayout: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>('dashboard');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                checkRole(session.user.id);
            } else {
                setLoading(false);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                checkRole(session.user.id);
            } else {
                setRole(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkRole = async (userId: string) => {
        try {
            const { data, error } = await supabase.from('perfis').select('role').eq('id', userId).single();
            if (error) throw error;
            setRole(data?.role || 'cliente');
        } catch (err) {
            console.error('Error fetching role:', err);
            setRole('cliente');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="h-screen w-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-500">Caregando app...</div>;
    }

    if (!session) {
        return <Login />;
    }

    // Se a pessoa for "cliente", ela não deveria estar aqui. Mandamos pro /agendar
    if (role === 'cliente') {
        return <Navigate to="/agendar" replace />;
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

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Rota principal: Dashboard Administrativo protegido */}
                <Route path="/" element={<AdminLayout />} />

                {/* Rota pública: Tela de agendamento exclusiva do cliente */}
                <Route path="/agendar" element={<ClientBooking />} />
            </Routes>
        </Router>
    );
};

export default App;
