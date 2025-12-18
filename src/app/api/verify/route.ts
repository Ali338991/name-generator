import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "OpenAI API Key not configured" }, { status: 500 });
    }

    const { candidate, targetName } = await request.json();

    if (!targetName) {
        return NextResponse.json(
            { error: "No target name has been generated yet." },
            { status: 400 }
        );
    }

    if (!candidate || typeof candidate !== 'string') {
        return NextResponse.json(
            { error: "Invalid candidate name provided." },
            { status: 400 }
        );
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a strict judge comparing a candidate name against a target name. 
                    Analyze the similarity. 
                    Return a JSON object with two fields: 
                    - 'score': a number between 0 and 1 (1.0 for perfect match, 0.0 for no similarity).
                    - 'explanation': a short explanation of the score.`
                },
                {
                    role: "user",
                    content: `Target Name: "${targetName}"\nCandidate Name: "${candidate}"`
                }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        const result = content ? JSON.parse(content) : {}; 
        
        return NextResponse.json({
            score: result.score || 0,
            explanation: result.explanation || "Could not verify."
        });
    } catch (error) {
        console.error("OpenAI Error:", error);
        return NextResponse.json({ error: "Failed to verify name" }, { status: 500 });
    }
}
