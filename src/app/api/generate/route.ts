import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "OpenAI API Key not configured" }, { status: 500 });
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "Generate a creative, sci-fi inspired name for a spaceship or futuristic entity. Return only the name without any quotes or extra text." }],
            model: "gpt-4o",
        });

        const randomName = completion.choices[0].message.content?.trim() || "Unknown Entity";
        return NextResponse.json({ targetName: randomName });
    } catch (error) {
        console.error("OpenAI Error:", error);
        return NextResponse.json({ error: "Failed to generate name" }, { status: 500 });
    }
}
