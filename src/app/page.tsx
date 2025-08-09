"use client";

import ForumIcon from "@mui/icons-material/Forum";
import ChatIcon from "@mui/icons-material/Chat";
import AssistantIcon from "@mui/icons-material/Assistant";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Header() {
    return (
        <header className="w-full fixed top-0 left-0 right-0 z-50 glow-border-b">
            <div className="container-wide h-16 flex flex-row items-center text-lg font-semibold justify-between ">
                <div className="w-1/6 flex flex-row items-center ">
                    <span className="w-auto flex flex-row items-center">
                        BrownBoard
                        <Image
                            alt="icon"
                            src="/logo.png"
                            width={64}
                            height={64}
                        />
                    </span>
                </div>
                <div className="w-3/4 flex flex-row items-center justify-center ">
                    <Link href="/ai" className="glowbox w-40 mx-2">
                        Ask the AI <AssistantIcon fontSize="small" />
                    </Link>
                    <Link href="/forums" className="glowbox w-40 mx-2">
                        Forums <ForumIcon fontSize="small" />
                    </Link>
                    <Link href="/about" className="glowbox w-40 mx-2">
                        Chats <ChatIcon fontSize="small" />
                    </Link>
                </div>
                <div className="w-1/6 flex flex-row items-center ">
                    <h1>sign out</h1>
                </div>
            </div>
        </header>
    );
}
