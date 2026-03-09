import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AddClienteModal } from '../components/modals/AddClienteModal';

interface Cliente {
    id: string;
    nome: string;
    telefone: string;
    email: string;
    created_at: string;
}

export const Clientes: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchClientes = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching clients:", error);
        } else {
            setClientes(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-bold">Clientes</h3>
                    <p className="text-slate-500 dark:text-slate-400">Gerencie sua base de clientes cadastrados</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition"
                >
                    <span className="material-symbols-outlined text-sm">person_add</span> Adicionar Cliente
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6 flex gap-4 items-center">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input type="text" placeholder="Buscar por nome, telefone ou email..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition"><span className="material-symbols-outlined text-sm">filter_list</span> Filtros</button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Telefone</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    Carregando clientes...
                                </td>
                            </tr>
                        ) : clientes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    Nenhum cliente cadastrado ainda.
                                </td>
                            </tr>
                        ) : (
                            clientes.map(cliente => (
                                <tr key={cliente.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                {getInitials(cliente.nome)}
                                            </div>
                                            <div className="font-medium">{cliente.nome}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">{cliente.telefone || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">{cliente.email || '-'}</td>
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

            <AddClienteModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchClientes}
            />
        </>
    );
};
