import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AddServicoModal } from '../components/modals/AddServicoModal';

interface Servico {
    id: string;
    nome: string;
    descricao: string;
    duracao: number;
    preco: number;
    created_at: string;
}

export const Servicos: React.FC = () => {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchServicos = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('servicos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching services:", error);
        } else {
            setServicos(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchServicos();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-bold">Serviços Oferecidos</h3>
                    <p className="text-slate-500 dark:text-slate-400">Gerencie seu catálogo de serviços e preços.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition"
                >
                    <span className="material-symbols-outlined text-sm">add</span> Cadastrar Serviço
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                            <th className="px-6 py-4">Serviço</th>
                            <th className="px-6 py-4">Duração Média</th>
                            <th className="px-6 py-4">Preço</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    Carregando serviços...
                                </td>
                            </tr>
                        ) : servicos.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    Nenhum serviço cadastrado ainda.
                                </td>
                            </tr>
                        ) : (
                            servicos.map(servico => (
                                <tr key={servico.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                <span className="material-symbols-outlined">content_cut</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{servico.nome}</p>
                                                <p className="text-xs text-slate-500 truncate max-w-[200px]">{servico.descricao || '-'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">schedule</span> {servico.duracao} min
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-700 dark:text-slate-200">
                                        {formatCurrency(servico.preco)}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <button className="text-slate-400 hover:text-primary p-1 transition"><span className="material-symbols-outlined">edit</span></button>
                                        <button className="text-slate-400 hover:text-red-500 p-1 transition"><span className="material-symbols-outlined">delete</span></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AddServicoModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchServicos}
            />
        </>
    );
};
