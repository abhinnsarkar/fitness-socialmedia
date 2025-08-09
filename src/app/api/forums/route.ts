import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    console.log("GET request received");

    const { searchParams } = new URL(req.url);

    // **************************************************************************

    // we need to first check if a parentId is provided in the query params
    // if yes, then all is good
    // if no, then we can just pass null to Prisma

    const rawParentId = searchParams.get("parentId");
    let parentId;

    if (rawParentId !== null) {
        parentId = rawParentId;
    } else {
        parentId = null; // no parentId means we want top-level posts
    }

    // **************************************************************************

    const topLevelOnly = searchParams.get("topLevelOnly") === "true";
    const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";
    const limit = 20; // limit for fetching will always be 20 at a time

    const offsetParam = searchParams.get("offset");

    const offset = offsetParam === null ? 0 : Number(offsetParam);

    if (!Number.isInteger(offset) || offset < 0) {
        return NextResponse.json({ error: "Invalid offset." }, { status: 400 });
    }

    const queryOptions: Prisma.ForumPostFindManyArgs = {
        orderBy: { createdAt: sort }, // "asc" or "desc"
        take: limit, // how many posts to fetch
        skip: offset, // how many posts to skip
        // include: {
        //     children: {
        //         orderBy: { createdAt: "asc" }, // always show replies oldest → newest
        //     },
        // },
        include: {
            //returns a count of how many children each post has, that way the frontend can see whether or not to put a dropdown arrow to fetch the replies
            _count: { select: { children: true } },
        },
    };
    if (topLevelOnly) {
        // this is SETTING a propoerty of the queryOptions object since its of type Prisma.ForumPostFindManyArgs
        // Prisma.ForumPostFindManyArgs expects a where clause to filter results and is custom tuned to my specific schema SINCE
        // this Prisma import was done from my unique generated schemas from the generated folder
        queryOptions.where = { parentId: null };
    } else {
        // if not topLevelOnly, we want all posts including replies
        queryOptions.where = { parentId };
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
