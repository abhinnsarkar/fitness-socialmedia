import { NextRequest, NextResponse } from "next/server";
import { askAI } from "@/lib/openai";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const userInput = body.message;

    if (!userInput) {
        return NextResponse.json(
            { result: "No message provided." },
            { status: 400 }
        );
    }

    try {
        const result = await askAI(userInput);
        return NextResponse.json({ result });
    } catch (error) {
        console.error("AI error:", error);
        return NextResponse.json(
            { result: "Error contacting AI service." },
            { status: 500 }
        );
    }
}
