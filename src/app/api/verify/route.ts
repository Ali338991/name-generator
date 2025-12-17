import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await new Promise(resolve => setTimeout(resolve, 800));

    const { candidate, targetName } = await request.json();

    if (!targetName) {
        return NextResponse.json(
            { error: "No target name has been generated yet." },
            { status: 400 }
        );
    }

    const latestTarget = targetName;

    if (!candidate || typeof candidate !== 'string') {
        return NextResponse.json(
            { error: "Invalid candidate name provided." },
            { status: 400 }
        );
    }

    const { score, explanation } = calculateMatch(latestTarget, candidate);

    return NextResponse.json({
        score,
        explanation
    });
}

function calculateMatch(target: string, candidate: string) {
    const targetLower = target.toLowerCase();
    const candidateLower = candidate.toLowerCase();

    if (targetLower === candidateLower) {
        return {
            score: 1.0,
            explanation: "Perfect match! The candidate name is identical to the target name."
        };
    }

    if (candidateLower.length > 2) {
        if (targetLower.includes(candidateLower)) {
            return {
                score: 0.5,
                explanation: `Partial match. The candidate "${candidate}" is a substring of the target.`
            };
        }
        if (candidateLower.includes(targetLower)) {
            return {
                score: 0.5,
                explanation: `Partial match. The target is contained within your candidate.`
            };
        }
    }

    return {
        score: 0.1,
        explanation: `The name "${candidate}" is too different from the target.`
    };
}
