import React from 'react';

export const Agendamentos: React.FC = () => {
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium">Todos</button>
                    <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Agendado</button>
                    <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Concluído</button>
                    <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Cancelado</button>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
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
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">JS</div>
                                    <div className="font-medium">João Silva</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">Corte & Barba</td>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium">25 Out, 2023</div><div className="text-xs text-slate-500">14:30</div></td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">Agendado</span></td>
                            <td className="px-6 py-4 text-right whitespace-nowrap"><button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button></td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">MO</div>
                                    <div className="font-medium">Mateus Oliveira</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">Corte Kids</td>
                            <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium">25 Out, 2023</div><div className="text-xs text-slate-500">13:00</div></td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Concluído</span></td>
                            <td className="px-6 py-4 text-right whitespace-nowrap"><button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};
