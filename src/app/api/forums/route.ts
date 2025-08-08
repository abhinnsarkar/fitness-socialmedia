import { Prisma } from "@/generated/prisma";
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

    const queryOptions: Prisma.ForumPostFindManyArgs = {
        orderBy: { createdAt: sort }, // "asc" or "desc"
        take: limit, // how many posts to fetch
        skip: offset, // how many posts to skip
        include: {
            children: {
                orderBy: { createdAt: "asc" }, // always show replies oldest → newest
            },
        },
    };
    if (topLevelOnly) {
        // this is SETTING a propoerty of the queryOptions object since its of type Prisma.ForumPostFindManyArgs
        // Prisma.ForumPostFindManyArgs expects a where clause to filter results and is custom tuned to my specific schema SINCE
        // this Prisma import was done from my unique generated schemas from the generated folder
        queryOptions.where = { parentId: null };
    }
    const forumPosts = await prisma.forumPost.findMany(queryOptions);

    return NextResponse.json(forumPosts, { status: 200 });
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
