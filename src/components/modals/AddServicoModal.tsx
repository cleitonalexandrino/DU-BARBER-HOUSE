import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface AddServicoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddServicoModal: React.FC<AddServicoModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [duracao, setDuracao] = useState('');
    const [preco, setPreco] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate inputs
        const parsedDuracao = parseInt(duracao, 10);
        const parsedPreco = parseFloat(preco.replace(',', '.'));

        if (isNaN(parsedDuracao) || parsedDuracao <= 0) {
            setError('Duração inválida. Digite um número maior que zero.');
            setLoading(false);
            return;
        }

        if (isNaN(parsedPreco) || parsedPreco < 0) {
            setError('Preço inválido.');
            setLoading(false);
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Usuário não autenticado');

            const { error: insertError } = await supabase.from('servicos').insert([
                {
                    nome,
                    descricao,
                    duracao: parsedDuracao,
                    preco: parsedPreco,
                    user_id: session.user.id
                }
            ]);

            if (insertError) throw insertError;

            onSuccess();
            onClose();
            // Reset form
            setNome('');
            setDescricao('');
            setDuracao('');
            setPreco('');
        } catch (err: any) {
            setError(err.message || 'Erro ao adicionar serviço');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Cadastrar Serviço</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Serviço *</label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Corte Degradê"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
                        <textarea
                            placeholder="Ex: Corte na máquina com acabamento navalhado"
                            rows={2}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duração (min) *</label>
                            <input
                                type="number"
                                required
                                min="1"
                                placeholder="Ex: 45"
                                value={duracao}
                                onChange={(e) => setDuracao(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preço (R$) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                placeholder="Ex: 50.00"
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

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
                            disabled={loading}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar Serviço'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
