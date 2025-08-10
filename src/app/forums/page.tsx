"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import CreateIcon from "@mui/icons-material/Create";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getForumPosts } from "../actions/forums/actions";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export type ForumPostDTO = {
    id: string;
    content: string;
    parentId: string | null;
    createdAt: Date; // comes back as ISO string in JSON
    _count?: { children: number }; // only exists if API includes _count
};

// What your UI holds (can add local-only fields)
type Question = {
    id: string;
    content: string;
    parentId: string | null;
    createdAt: string;
    replies: Question[]; // you populate this later (starts empty)
    repliesCount?: number; // from _count.children (optional)
};

function Page() {
    // What /api/forums returns for top-level posts

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [askQuestionTime, setAskQuestionTime] = useState<boolean>(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const forumPostsRaw: ForumPostDTO[] = await getForumPosts({
                    topLevelOnly: true,
                    sort: "desc",
                    offset: 0,
                });

                const mappedQuestions: Question[] = forumPostsRaw.map(
                    (post) => ({
                        id: post.id,
                        content: post.content,
                        parentId: post.parentId,
                        createdAt: new Date(post.createdAt).toISOString(), // store consistently as string
                        replies: [],
                        repliesCount: post._count?.children ?? 0, // move into its own field
                    })
                );

                setQuestions(mappedQuestions);
            } catch (error) {
                console.error("Error fetching questions:", error);
                setError("Error fetching questions");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    return (
        <div className="container-wide">
            <div className="w-full text-5xl font-bold mt-10">Forums</div>
            <div className="w-full text-3xl font-bold mt-10">
                <Button
                    className="bg-deepred glowbox"
                    onClick={() => setAskQuestionTime(true)}
                >
                    Ask a Question <CreateIcon fontSize="small" />
                </Button>
            </div>
            {askQuestionTime && (
                <Card className="mt-10 bg-deepred glowbox minimal-grow w-full">
                    <div className="flex flex-col justify-start">
                        <h2 className="text-2xl text-left font-bold">
                            Type your Question Below
                        </h2>
                        <Textarea className="mt-5 overflow-y-auto" />
                        <Button
                            className="bg-deepred glowbox mt-5 mb-2.5 w-fit"
                            onClick={() => {
                                console.log("Submit question logic here");
                            }}
                        >
                            Submit Question
                        </Button>
                    </div>
                </Card>
            )}
            <div className="mt-52">
                {questions.map((question) => (
                    <div
                        key={question.id}
                        className="border-b border-gray-200 py-4 justify-between flex flex-row"
                    >
                        <div>
                            <h2 className="text-xl font-bold">
                                {question.content}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Posted on{" "}
                                {new Date(
                                    question.createdAt
                                ).toLocaleDateString()}{" "}
                                by <span className="font-medium">User</span>
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <Button className="bg-deepred glowbox">
                                Reply <CreateIcon fontSize="small" />
                            </Button>
                            {question.repliesCount &&
                                question.repliesCount > 0 && (
                                    <span className="flex text-sm text-gray-500 justify-end mt-5 ">
                                        {question.repliesCount} replies{" "}
                                        <ArrowDropDownIcon
                                            className="icon"
                                            fontSize="small"
                                            onClick={() => {
                                                console.log(
                                                    `time to fetch replies for ${question.id} relating to ${question.content}`
                                                );
                                            }}
                                        />
                                        {/* TODO: Fetch and display replies */}
                                    </span>
                                )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Page;
