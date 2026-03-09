import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AddAgendamentoModal } from '../components/modals/AddAgendamentoModal';

type StatusAgendamento = 'todos' | 'agendado' | 'concluido' | 'cancelado';

interface Agendamento {
    id: string;
    data_hora: string;
    status: string;
    cliente: { nome: string };
    servico: { nome: string; duracao: number };
}

export const Agendamentos: React.FC = () => {
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<StatusAgendamento>('todos');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchAgendamentos = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('agendamentos')
            .select(`
                id,
                data_hora,
                status,
                cliente:clientes(nome),
                servico:servicos(nome, duracao)
            `)
            .order('data_hora', { ascending: true });

        if (error) {
            console.error("Error fetching appointments:", error);
        } else {
            // Note: Supabase sometimes returns single objects or arrays for joins depending on relation.
            // As it's many-to-one (agendamento -> cliente), it should be a single object.
            setAgendamentos(data as unknown as Agendamento[] || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAgendamentos();
    }, []);

    const filteredAgendamentos = agendamentos.filter(ag => {
        if (filter === 'todos') return true;
        return ag.status === filter;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'agendado': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'concluido': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
            case 'cancelado': return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'agendado': return 'Agendado';
            case 'concluido': return 'Concluído';
            case 'cancelado': return 'Cancelado';
            default: return status;
        }
    };

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        return {
            dateStr: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
            timeStr: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const getInitials = (name: string) => {
        if (!name) return '??';
        const parts = name.split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setFilter('todos')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === 'todos' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('agendado')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition ${filter === 'agendado' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>Agendado
                    </button>
                    <button
                        onClick={() => setFilter('concluido')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition ${filter === 'concluido' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>Concluído
                    </button>
                    <button
                        onClick={() => setFilter('cancelado')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition ${filter === 'cancelado' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>Cancelado
                    </button>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition"
                >
                    <span className="material-symbols-outlined text-sm">add</span> Novo Agendamento
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Serviço</th>
                            <th className="px-6 py-4">Data / Hora</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    Carregando agendamentos...
                                </td>
                            </tr>
                        ) : filteredAgendamentos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    {filter === 'todos' ? 'Nenhum agendamento encontrado.' : `Nenhum agendamento com status "${getStatusText(filter)}" encontrado.`}
                                </td>
                            </tr>
                        ) : (
                            filteredAgendamentos.map(agendamento => {
                                const { dateStr, timeStr } = formatDateTime(agendamento.data_hora);
                                const clienteNome = agendamento.cliente?.nome || 'Desconhecido';
                                const servicoNome = agendamento.servico?.nome || 'Desconhecido';

                                return (
                                    <tr key={agendamento.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                                                    {getInitials(clienteNome)}
                                                </div>
                                                <div className="font-medium">{clienteNome}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                                            {servicoNome}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium">{dateStr}</div>
                                            <div className="text-xs text-slate-500">{timeStr}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(agendamento.status)}`}>
                                                {getStatusText(agendamento.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button className="text-slate-400 hover:text-primary transition">
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <AddAgendamentoModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchAgendamentos}
            />
        </>
    );
};
