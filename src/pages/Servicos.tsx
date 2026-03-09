import React from 'react';

export const Servicos: React.FC = () => {
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-bold">Serviços Oferecidos</h3>
                    <p className="text-slate-500 dark:text-slate-400">Gerencie seu catálogo de serviços e preços.</p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
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
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><span className="material-symbols-outlined">face</span></div>
                                    <div><p className="font-semibold">Corte Social</p><p className="text-xs text-slate-500">Corte clássico</p></div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 45 min</td>
                            <td className="px-6 py-4 whitespace-nowrap font-bold">R$ 55,00</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                <button className="text-slate-400 hover:text-primary p-1"><span className="material-symbols-outlined">edit</span></button>
                                <button className="text-slate-400 hover:text-red-500 p-1"><span className="material-symbols-outlined">delete</span></button>
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><span className="material-symbols-outlined">tools_installation_kit</span></div>
                                    <div><p className="font-semibold">Barba de Toalha Quente</p><p className="text-xs text-slate-500">Barbear tradicional</p></div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 30 min</td>
                            <td className="px-6 py-4 whitespace-nowrap font-bold">R$ 40,00</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                <button className="text-slate-400 hover:text-primary p-1"><span className="material-symbols-outlined">edit</span></button>
                                <button className="text-slate-400 hover:text-red-500 p-1"><span className="material-symbols-outlined">delete</span></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};
