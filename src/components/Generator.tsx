"use client";

import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function Generator() {
    const [prompt, setPrompt] = useState('');
    const setLatestTargetName = useStore((state) => state.setLatestTargetName);
    const latestTargetName = useStore((state) => state.latestTargetName);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setError('');
        if (!prompt.trim()) return;
        
        if (prompt.trim().length < 3) {
            setError('Prompt must be at least 3 characters long');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.error || 'Failed to generate name');
                return;
            }
            
            setLatestTargetName(data.targetName);
        } catch (error) {
            console.error("Generation failed:", error);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent w-fit">
                Target Name Generator
            </h2>
            <p className="text-slate-400 mb-6">
                Describe the kind of name you want to generate.
            </p>

            <textarea
                className="bg-slate-900/60 border border-white/10 rounded-lg text-white p-3 w-full text-base mb-4 focus:outline-none focus:border-violet-500 transition-colors"
                rows={3}
                placeholder="e.g. A futuristic city name sounding like Greek mythology..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />

            {error && (
                <div className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <button
                className="w-full bg-gradient-to-br from-violet-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/50 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
            >
                {loading ? 'Generating...' : 'Generate Name'}
            </button>

            {latestTargetName && (
                <div className="mt-8 text-center animate-[fadeIn_0.5s_ease]">
                    <div className="text-sm text-slate-400 mb-2">
                        Latest Target Name
                    </div>
                    <div className="text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                        {latestTargetName}
                    </div>
                </div>
            )}
        </div>
    );
}
