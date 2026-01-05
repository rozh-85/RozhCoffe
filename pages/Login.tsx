
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/admin');
            }
        });
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // STATIC CREDENTIALS
        const STATIC_EMAIL = 'admin@rozh.com';
        const STATIC_PASS = 'rozh2026';

        try {
            if (email === STATIC_EMAIL && password === STATIC_PASS) {
                localStorage.setItem('admin_session', 'true');
                // Use navigate to trigger state update in App.tsx
                navigate('/admin');
                window.location.reload(); // Force reload once to ensure App.tsx re-reads localStorage
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans antialiased">
            <div className="w-full max-w-[400px] animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(252,198,36,0.15)]">
                        <span className="material-icons-round text-4xl text-primary">admin_panel_settings</span>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Admin Portal</h1>
                    <p className="text-zinc-500 font-medium">Enter your credentials to continue</p>
                </div>

                <div className="bg-[#121214] border border-zinc-800/50 p-8 rounded-[2.5rem] shadow-2xl relative ring-1 ring-white/5">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase ml-1 tracking-wider">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@example.com"
                                className="bg-[#1a1a1d] border border-zinc-800/50 rounded-2xl w-full px-5 py-4 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase ml-1 tracking-wider">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="bg-[#1a1a1d] border border-zinc-800/50 rounded-2xl w-full px-5 py-4 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                                <span className="material-icons-round text-base">error_outline</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-black font-black w-full py-4 rounded-2xl shadow-[0_10px_20px_-5px_rgba(252,198,36,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <span className="material-icons-round text-lg">login</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-zinc-500 hover:text-white text-sm font-bold transition-colors inline-flex items-center gap-2"
                    >
                        <span className="material-icons-round text-base">arrow_back</span>
                        Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
