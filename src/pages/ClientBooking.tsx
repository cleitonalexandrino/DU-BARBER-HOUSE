import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export const ClientBooking: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [servicos, setServicos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [step, setStep] = useState(1);
    const [selectedServico, setSelectedServico] = useState<any>(null);

    // New slot-based state
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        fetchServicos();
    }, []);

    // Fetch booked slots whenever the date or step changes to 2
    useEffect(() => {
        if (step === 2 && selectedDate) {
            fetchBookedTimes();
        }
    }, [step, selectedDate]);

    const fetchServicos = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('servicos').select('*').order('nome');
        if (!error && data) {
            setServicos(data);
        }
        setLoading(false);
    };

    const fetchBookedTimes = async () => {
        setLoadingSlots(true);
        setSelectedTime(''); // Reset selected time when date changes

        // To query safely regarding timezones, we can query from 00:00 to 23:59 local time
        const startOfDay = new Date(`${selectedDate}T00:00:00`).toISOString();
        const endOfDay = new Date(`${selectedDate}T23:59:59`).toISOString();

        const { data, error } = await supabase.from('agendamentos')
            .select('data_hora')
            .gte('data_hora', startOfDay)
            .lte('data_hora', endOfDay)
            .neq('status', 'cancelado');

        if (error) {
            console.error("Erro ao buscar horários ocupados:", error);
            setLoadingSlots(false);
            return;
        }

        // Convert the booked UTC ISODates back to local HH:mm string format to match our slots
        const booked = data.map(apt => {
            const dateObj = new Date(apt.data_hora);
            return dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
        });

        setBookedTimes(booked);
        setLoadingSlots(false);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = (e.target as any).email.value;
        const password = (e.target as any).password.value;

        if (authMode === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                alert("Erro ao entrar: Verifique seu e-mail e senha.");
            }
        } else {
            const res = await supabase.auth.signUp({ email, password });
            if (res.error) {
                alert("Erro ao criar conta: " + res.error.message);
            } else {
                alert("Conta criada com sucesso! Você já pode agendar.");
                await supabase.auth.signInWithPassword({ email, password });
            }
        }
    };

    const handleAgendar = async () => {
        if (!session) {
            alert("Você precisa estar logado para agendar.");
            return;
        }

        if (!selectedServico || !selectedDate || !selectedTime) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            // Reconstruct the exact Javascript date using local time
            const dataHoraJS = new Date(`${selectedDate}T${selectedTime}:00`);
            const isoString = dataHoraJS.toISOString();

            // DOUBLE CHECK CONFLICT
            const { data: conflito, error: erroConflito } = await supabase
                .from('agendamentos')
                .select('id')
                .eq('data_hora', isoString)
                .neq('status', 'cancelado')
                .maybeSingle();

            if (erroConflito) {
                console.error("Erro ao verificar disponibilidade:", erroConflito);
            }

            if (conflito) {
                alert("Ops! Esse horário já foi reservado. Por favor, atualize e escolha outro.");
                // refresh the booked times
                fetchBookedTimes();
                return;
            }

            let clienteId = null;
            const { data: clienteArr } = await supabase.from('clientes').select('id').eq('telefone', session.user.email).maybeSingle();

            if (clienteArr) {
                clienteId = clienteArr.id;
            } else {
                const { data: newCliente, error: clError } = await supabase.from('clientes').insert([{
                    nome: session.user.email.split('@')[0],
                    telefone: session.user.email,
                    user_id: session.user.id
                }]).select('id').single();

                if (clError) throw clError;
                clienteId = newCliente.id;
            }

            const { error } = await supabase.from('agendamentos').insert([{
                cliente_id: clienteId,
                servico_id: selectedServico.id,
                data_hora: isoString,
                status: 'agendado',
                user_id: session.user.id
            }]);

            if (error) throw error;

            setStep(3); // Success Screen

        } catch (err: any) {
            alert("Erro ao confirmar agendamento: " + err.message);
        }
    };

    const renderTimeSlots = () => {
        if (loadingSlots) {
            return <div className="text-sm text-slate-500 py-4">Verificando disponibilidade...</div>;
        }

        // Generate 30 minute blocks from 08:00 to 19:30
        const slots = [];
        for (let h = 8; h <= 19; h++) {
            slots.push(`${h.toString().padStart(2, '0')}:00`);
            slots.push(`${h.toString().padStart(2, '0')}:30`);
        }

        // Filter out times that are already passed TODAY
        const now = new Date();
        const isToday = selectedDate === now.toISOString().split('T')[0];
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();

        const availableSlots = slots.filter(slot => {
            // 1. Remove if already booked
            if (bookedTimes.includes(slot)) return false;

            // 2. Remove if it's past this time today
            if (isToday) {
                const [slotH, slotM] = slot.split(':').map(Number);
                if (slotH < currentHour || (slotH === currentHour && slotM <= currentMin)) {
                    return false;
                }
            }

            return true;
        });

        if (availableSlots.length === 0) {
            return <div className="text-sm text-red-500 font-medium py-4">Nenhum horário disponível nesta data.</div>;
        }

        return (
            <div className="grid grid-cols-4 gap-2 mt-4">
                {availableSlots.map(slot => (
                    <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-1 text-sm font-medium rounded-lg border transition ${selectedTime === slot
                            ? 'bg-primary border-primary text-white shadow-md'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-primary/50'
                            }`}
                    >
                        {slot}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col items-center pb-24">
            <div className="w-full max-w-md p-6 flex flex-col mt-4 mb-12">

                <header className="flex flex-col items-center justify-center mb-8">
                    <img src="/logo.png" alt="Du Barber House" className="h-20 w-auto mb-4" />
                    <h1 className="text-2xl font-bold font-display">Agende seu horário</h1>
                </header>

                {!session && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
                        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-6">
                            <button
                                onClick={() => setAuthMode('login')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${authMode === 'login' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'text-slate-500'}`}
                            >
                                Entrar
                            </button>
                            <button
                                onClick={() => setAuthMode('register')}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${authMode === 'register' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'text-slate-500'}`}
                            >
                                Cadastre-se
                            </button>
                        </div>

                        <h2 className="font-bold text-lg mb-4 text-center">
                            {authMode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
                        </h2>

                        <form onSubmit={handleAuth} className="space-y-4">
                            <div>
                                <input type="email" name="email" required placeholder="Seu E-mail" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary" />
                            </div>
                            <div>
                                <input type="password" name="password" required minLength={6} placeholder="Sua Senha" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary" />
                            </div>
                            <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition">
                                {authMode === 'login' ? 'Entrar' : 'Cadastrar e Entrar'}
                            </button>
                        </form>
                    </div>
                )}

                {session && step === 1 && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">1. Escolha o serviço</h2>
                            <button onClick={() => supabase.auth.signOut()} className="text-sm text-red-500 font-medium">Sair</button>
                        </div>

                        {loading ? <p className="text-center text-slate-500 py-8">Carregando serviços...</p> : (
                            servicos.map(s => (
                                <div
                                    key={s.id}
                                    onClick={() => { setSelectedServico(s); setStep(2); }}
                                    className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-center cursor-pointer hover:border-primary transition"
                                >
                                    <div>
                                        <h3 className="font-bold">{s.nome}</h3>
                                        <p className="text-sm text-slate-500">{s.descricao}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-primary">R$ {s.preco}</div>
                                        <div className="text-xs text-slate-500">{s.duracao} min</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {session && step === 2 && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <button onClick={() => setStep(1)} className="text-sm text-slate-500 font-medium mb-4 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">arrow_back</span> Voltar
                        </button>

                        <h2 className="font-bold text-lg mb-2">2. Escolha o dia e hora</h2>
                        <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                            <span className="text-sm text-slate-500 block">Serviço:</span>
                            <span className="font-bold block text-primary">{selectedServico?.nome}</span>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2">Selecione a Data</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    min={new Date().toISOString().split('T')[0]} // Prevents picking past dates
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-500 mt-4">Horários Disponíveis (30 min)</label>
                                {renderTimeSlots()}
                            </div>
                        </div>

                        <button
                            onClick={handleAgendar}
                            disabled={!selectedTime}
                            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 transition mt-4"
                        >
                            Confirmar Agendamento
                        </button>
                    </div>
                )}

                {session && step === 3 && (
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-emerald-500/30 text-center">
                        <span className="material-symbols-outlined text-5xl text-emerald-500 mb-4 inline-block">check_circle</span>
                        <h2 className="font-bold text-xl mb-2">Tudo Certo!</h2>
                        <p className="text-slate-500 mb-6">
                            Seu horário para <strong>{selectedServico?.nome}</strong> foi agendado com sucesso para<br />
                            <strong className="text-slate-900 dark:text-white text-lg block mt-2">Dia {selectedDate.split('-').reverse().join('/')} às {selectedTime}</strong>.
                        </p>

                        <button
                            onClick={() => { setStep(1); setSelectedServico(null); setSelectedTime(''); }}
                            className="w-full py-3 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-bold"
                        >
                            Fazer novo agendamento
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
