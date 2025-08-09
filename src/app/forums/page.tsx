"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import CreateIcon from "@mui/icons-material/Create";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function Page() {
    interface Question {
        id: string;
        content: string;
        replies: Question[]; // nested replies
    }

    // const [questions, setQuestions] = useState<Question[]>([]);
    const questions: Question[] = [
        {
            id: "1",
            content: "What is the best way to stay fit?",
            replies: [
                {
                    id: "1.1",
                    content:
                        "I think a balanced diet and regular exercise are key.",
                    replies: [],
                },
                {
                    id: "1.2",
                    content: "Don't forget about mental health too!",
                    replies: [],
                },
            ],
        },
        {
            id: "2",
            content: "How can I improve my diet?",
            replies: [],
        },
        {
            id: "3",
            content: "What are some effective workout routines?",
            replies: [],
        },
    ];

    return (
        <div className="container-wide">
            <div className="w-full text-5xl font-bold mt-10">Forums</div>
            <div className="w-full text-3xl font-bold mt-10">
                <Button className="bg-deepred glowbox">
                    Ask a Question <CreateIcon fontSize="small" />
                </Button>
            </div>
            <div className="mt-52">
                {questions.map((question) => (
                    <div key={question.id}>
                        {question.content}{" "}
                        {question.replies.length > 0 ? (
                            <ArrowDropDownIcon
                                fontSize="small"
                                onClick={() => {
                                    console.log("clicked");
                                }}
                            />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Page;
