import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

    console.log("GET request received");

    const { searchParams } = new URL(req.url);

    const topLevelOnly = searchParams.get("topLevelOnly") === "true";
    const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";
    const limit = 20; // limit for fetching will always be 20 at a time
    const offsetParam = searchParams.get("offset");
    let offset = 0;
    if (offsetParam === null) {
        return NextResponse.json(
            { error: "Offset parameter is required." },
            { status: 400 }
        );
    } else {
        offset = parseInt(offsetParam, 10);
    }

    

}

export async function POST(req: Request) {
    console.log("POST request received");
    console.log("Request body:", req.body);
    const body = await req.json();

    const { content, parentId } = body;

    if (!content) {
        return NextResponse.json(
            { error: "Content is required." },
            { status: 400 }
        );
    }

    const forumPost = await prisma.forumPost.create({
        data: {
            content,
            parentId: parentId || null,
        },
    });

    return NextResponse.json(forumPost, { status: 201 });
}
