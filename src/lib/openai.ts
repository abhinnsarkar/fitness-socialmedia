import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY!,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // or your real domain
        "X-Title": "AI Tester App",
    },
});

export async function askAI(message: string) {
    const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
            {
                role: "system",
                content: `
You are a helpful assistant. Format all your responses in clean, semantic Markdown.

- Use headers (### or ##) to organize sections.
- Use bullet points for lists.
- Use **bold**, _italics_, and \`inline code\` for emphasis.
- For code blocks, wrap them in triple backticks like \`\`\`js ... \`\`\`.
- Separate paragraphs clearly with line breaks.

The response will be rendered with Tailwind Typography, so Markdown formatting will be styled beautifully. Do not use HTML — only Markdown.`,
            },
            {
                role: "user",
                content: message,
            },
        ],
    });

    return completion.choices[0].message.content;
}
