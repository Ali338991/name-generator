import { NextResponse } from 'next/server';


const MOCK_NAMES = [
    "Nebula Walker",
    "Crimson Tide",
    "Solar Flare",
    "Lunar Eclipse",
    "Starlight Voyager",
    "Quantum Leaper",
    "Shadow Dancer",
    "Crystal Peak",
    "Thunder Strike",
    "Velvet Horizon"
];

export async function POST(request: Request) {
    await new Promise(resolve => setTimeout(resolve, 1000));


    const randomName = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];

    return NextResponse.json({ targetName: randomName });
}
