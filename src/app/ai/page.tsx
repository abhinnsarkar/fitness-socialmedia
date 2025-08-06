"use client";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

function CircularIndeterminate() {
    return (
        <div className="flex justify-center items-center h-40">
            <CircularProgress />
        </div>
    );
}

/*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Home page component.
     *
     * Displays a text input and a button to ask DeepSeek a question.
     * When the button is clicked, it sends a POST request to the
     * `/api/ask` endpoint with the user's input as a JSON payload.
     * The response is then displayed below the button, with a loading
     * indicator displayed while the request is being processed.
     */
/*******  976ce515-83e1-4d52-86e3-80e06eb4dafa  *******/
export default function Home() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleAsk() {
        if (!input.trim()) return;
        setLoading(true);
        const res = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input }),
        });

        const data = await res.json();
        setResponse(data.result);
        setInput("");
        setLoading(false);
    }

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">Ask DeepSeek Anything</h1>
            <input
                autoFocus
                className="border p-2 w-full mb-4"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
            />
            <button
                onClick={handleAsk}
                disabled={loading}
                className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                Ask
            </button>
            {loading && <CircularIndeterminate />}
            {response && (
                <div className="mt-6 p-4 bg-gray-100 rounded">
                    <p className="text-lg font-medium">Response:</p>
                    <div className="prose prose-sm text-gray-800 max-w-none">
                        <ReactMarkdown>{response}</ReactMarkdown>
                    </div>
                </div>
            )}
        </main>
    );
}
