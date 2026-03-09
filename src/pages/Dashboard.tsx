import React from 'react';

export const Dashboard: React.FC = () => {
    return (
        <>
            <div>
                <h2 className="text-2xl font-bold mb-1">Bem-vindo de volta, Admin!</h2>
                <p className="text-slate-500 dark:text-slate-400">Aqui está o que está acontecendo na sua barbearia hoje.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">person_add</span>
                        </div>
                        <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">+12%</span>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Clientes Cadastrados</p>
                        <h3 className="text-2xl font-bold mt-1">1.240</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-500">
                            <span className="material-symbols-outlined">event_available</span>
                        </div>
                        <span className="text-slate-400 text-xs font-bold">Hoje</span>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Agendamentos de Hoje</p>
                        <h3 className="text-2xl font-bold mt-1">18</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-amber-500/10 dark:bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-500">
                            <span className="material-symbols-outlined">content_cut</span>
                        </div>
                        <span className="text-amber-500 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded">Em alta</span>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Serviços Realizados</p>
                        <h3 className="text-2xl font-bold mt-1">450</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm border-l-4 border-l-primary">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">+8%</span>
                    </div>
                    <div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Receita Mensal</p>
                        <h3 className="text-2xl font-bold mt-1">R$ 12.500</h3>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Próximos Agendamentos</h3>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y dark:divide-slate-800">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-500">person</span>
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Ricardo Mendes</p>
                                <p className="text-xs text-slate-500">Corte & Barba - 14:30</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">Confirmado</span>
                    </div>
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-500">person</span>
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Gustavo Lima</p>
                                <p className="text-xs text-slate-500">Corte Degradê - 15:15</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full">Pendente</span>
                    </div>
                </div>
            </div>
        </>
    );
};
