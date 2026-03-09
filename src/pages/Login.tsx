import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Scissors } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;
                setMessage('Cadastro realizado com sucesso! Você já pode fazer login (ou verifique seu e-mail).');
                setIsSignUp(false);
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro durante a autenticação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
                <img src="/logo.png" alt="DU BARBER HOUSE Logo" className="h-32 object-contain rounded-xl shadow-lg border border-gray-800" />
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                    DU BARBER HOUSE
                </h2>
                <p className="mt-2 text-center text-sm text-gray-400">
                    {isSignUp ? 'Crie sua conta' : 'Acesse seu painel'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-900 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-800">
                    <form className="space-y-6" onSubmit={handleAuth}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-300"
                            >
                                E-mail
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm font-medium">{error}</div>
                        )}

                        {message && (
                            <div className="text-green-500 text-sm font-medium">{message}</div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Aguarde...' : isSignUp ? 'Criar Conta' : 'Entrar'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            {isSignUp
                                ? 'Já tem uma conta? Faça login'
                                : 'Não tem uma conta? Cadastre-se'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
