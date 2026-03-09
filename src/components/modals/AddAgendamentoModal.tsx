import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface AddAgendamentoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Cliente {
    id: string;
    nome: string;
}

interface Servico {
    id: string;
    nome: string;
    duracao: number;
}

export const AddAgendamentoModal: React.FC<AddAgendamentoModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);

    const [clienteId, setClienteId] = useState('');
    const [servicoId, setServicoId] = useState('');

    // New slot-based state
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchDropdownData();
            fetchBookedTimes();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && selectedDate) {
            fetchBookedTimes();
        }
    }, [selectedDate]);

    const fetchDropdownData = async () => {
        try {
            const [clientesResponse, servicosResponse] = await Promise.all([
                supabase.from('clientes').select('id, nome').order('nome'),
                supabase.from('servicos').select('id, nome, duracao').order('nome')
            ]);

            if (clientesResponse.error) throw clientesResponse.error;
            if (servicosResponse.error) throw servicosResponse.error;

            setClientes(clientesResponse.data || []);
            setServicos(servicosResponse.data || []);

            if (clientesResponse.data && clientesResponse.data.length > 0) {
                setClienteId(clientesResponse.data[0].id);
            } else {
                setError('Você precisa cadastrar pelo menos um cliente primeiro.');
            }

            if (servicosResponse.data && servicosResponse.data.length > 0) {
                setServicoId(servicosResponse.data[0].id);
            } else {
                setError('Você precisa cadastrar pelo menos um serviço primeiro.');
            }

        } catch (err: any) {
            console.error("Error fetching dropdown data", err);
        }
    };

    const fetchBookedTimes = async () => {
        setLoadingSlots(true);
        setSelectedTime('');

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

        const booked = data.map(apt => {
            const dateObj = new Date(apt.data_hora);
            return dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
        });

        setBookedTimes(booked);
        setLoadingSlots(false);
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!clienteId || !servicoId || !selectedDate || !selectedTime) {
            setError('Por favor, preencha todos os campos.');
            setLoading(false);
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Usuário não autenticado');

            const dataHoraJS = new Date(`${selectedDate}T${selectedTime}:00`);
            const isoString = dataHoraJS.toISOString();

            // Validação de conflito de horário duplo check
            const { data: conflito, error: erroConflito } = await supabase
                .from('agendamentos')
                .select('id')
                .eq('data_hora', isoString)
                .neq('status', 'cancelado')
                .maybeSingle();

            if (conflito) {
                setError('Esse horário já está reservado. Por favor, atualize e escolha outro.');
                fetchBookedTimes();
                setLoading(false);
                return;
            }

            const { error: insertError } = await supabase.from('agendamentos').insert([
                {
                    cliente_id: clienteId,
                    servico_id: servicoId,
                    data_hora: isoString,
                    status: 'agendado',
                    user_id: session.user.id
                }
            ]);

            if (insertError) throw insertError;

            onSuccess();
            onClose();
            setSelectedTime('');
        } catch (err: any) {
            setError(err.message || 'Erro ao agendar.');
        } finally {
            setLoading(false);
        }
    };

    const renderTimeSlots = () => {
        if (loadingSlots) {
            return <div className="text-sm text-slate-500 py-2">Verificando...</div>;
        }

        const slots = [];
        for (let h = 8; h <= 19; h++) {
            slots.push(`${h.toString().padStart(2, '0')}:00`);
            slots.push(`${h.toString().padStart(2, '0')}:30`);
        }

        const now = new Date();
        const isToday = selectedDate === now.toISOString().split('T')[0];
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();

        const availableSlots = slots.filter(slot => {
            if (bookedTimes.includes(slot)) return false;

            if (isToday) {
                const [slotH, slotM] = slot.split(':').map(Number);
                if (slotH < currentHour || (slotH === currentHour && slotM <= currentMin)) {
                    return false;
                }
            }

            return true;
        });

        if (availableSlots.length === 0) {
            return <div className="text-sm text-red-500 py-2">Sem horários disponíveis para hoje.</div>;
        }

        return (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-2 max-h-[160px] overflow-y-auto pr-1">
                {availableSlots.map(slot => (
                    <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-1.5 px-1 text-sm rounded border transition ${selectedTime === slot
                                ? 'bg-primary border-primary text-white shadow'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Novo Agendamento</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cliente *</label>
                        <select
                            required
                            value={clienteId}
                            onChange={(e) => setClienteId(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        >
                            {clientes.length === 0 && <option value="">Nenhum cliente cadastrado</option>}
                            {clientes.map(c => (
                                <option key={c.id} value={c.id}>{c.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Serviço *</label>
                        <select
                            required
                            value={servicoId}
                            onChange={(e) => setServicoId(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        >
                            {servicos.length === 0 && <option value="">Nenhum serviço cadastrado</option>}
                            {servicos.map(s => (
                                <option key={s.id} value={s.id}>{s.nome} ({s.duracao} min)</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data *</label>
                            <input
                                type="date"
                                required
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-0">Horários (30 min) *</label>
                        {renderTimeSlots()}
                    </div>

                    {error && <div className="text-red-500 text-sm font-medium mt-2">{error}</div>}

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || clientes.length === 0 || servicos.length === 0 || !selectedTime}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
                        >
                            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
