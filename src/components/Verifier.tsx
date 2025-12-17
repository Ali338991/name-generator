"use client";

import { useState } from 'react';

import { useStore } from '@/lib/store';

export default function Verifier() {
    const [candidate, setCandidate] = useState('');
    const [result, setResult] = useState<{ score: number, explanation: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const latestTargetName = useStore((state) => state.latestTargetName);

    const handleVerify = async () => {
        if (!candidate.trim()) return;

        if (!latestTargetName) {
            setError("No target name generated yet.");
            return;
        }

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const res = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidate, targetName: latestTargetName }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Verification failed');
            } else {
                setResult(data);
            }
        } catch (err) {
            console.error(err);
            setError('Network error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent w-fit">
                Name Verifier
            </h2>
            <p className="text-slate-400 mb-6">
                Enter a guess to check against the invisible target.
            </p>

            <input
                type="text"
                className="bg-slate-900/60 border border-white/10 rounded-lg text-white p-3 w-full text-base mb-4 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Enter candidate name..."
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
            />

            <button
                className="w-full bg-gradient-to-br from-violet-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/50 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                onClick={handleVerify}
                disabled={loading || !candidate.trim()}
            >
                {loading ? 'Verifying...' : 'Verify Candidate'}
            </button>

            {error && (
                <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-8 animate-[fadeIn_0.5s_ease]">
                    <div className="flex items-center mb-4">
                        <div className={`text-4xl font-bold mr-4 ${result.score > 0.8 ? 'text-green-400' : result.score > 0.4 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                            {(result.score * 100).toFixed(0)}%
                        </div>
                        <div className="text-xl font-semibold">
                            Confidence Score
                        </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg leading-relaxed text-slate-200">
                        {result.explanation}
                    </div>
                </div>
            )}
        </div>
    );
}
