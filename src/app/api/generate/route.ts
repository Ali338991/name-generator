import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "OpenAI API Key not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
        return NextResponse.json({ error: "Prompt must be at least 3 characters long" }, { status: 400 });
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a creative naming assistant. Generate a unique, interesting name based on the user's description. Return ONLY the name, nothing else." },
                { role: "user", content: `Generate a name based on this description: ${prompt.trim()}` }
            ],
            model: "gpt-4o",
        });

        const randomName = completion.choices[0].message.content?.trim() || "Unknown Entity";
        return NextResponse.json({ targetName: randomName });
    } catch (error) {
        console.error("OpenAI Error:", error);
        return NextResponse.json({ error: "Failed to generate name" }, { status: 500 });
    }
}
