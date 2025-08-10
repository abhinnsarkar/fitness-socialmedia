"use server";
import { ForumPostDTO } from "@/app/forums/page";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

interface GetForumPostsQuery {
    parentId?: string | null;
    topLevelOnly: boolean;
    sort: "asc" | "desc";
    offset: number;
}

export async function getForumPosts(req: GetForumPostsQuery) {
    console.log("GET request received");

    // **************************************************************************

    // we need to first check if a parentId is provided in the query params
    // if yes, then all is good
    // if no, then we can just pass null to Prisma

    const parentId = req.parentId;

    // **************************************************************************

    const topLevelOnly = req.topLevelOnly;
    if (topLevelOnly !== true && topLevelOnly !== false) {
        throw new Error("topLevelOnly must be a boolean.");
    }

    const sort = req.sort;
    if (sort !== "asc" && sort !== "desc") {
        throw new Error("sort must be either 'asc' or 'desc'.");
    }

    const limit = 20; // limit for fetching will always be 20 at a time

    const offset = req.offset;
    if (offset < 0) {
        throw new Error("Invalid offset.");
    }

    const queryOptions: Prisma.ForumPostFindManyArgs = {
        orderBy: { createdAt: sort },
        take: limit,
        skip: offset,
        include: { _count: { select: { children: true } } },
    } as const satisfies Prisma.ForumPostFindManyArgs;

    if (topLevelOnly) {
        queryOptions.where = { parentId: null };
    } else if (typeof parentId !== "undefined") {
        queryOptions.where = { parentId };
    }

    const forumPosts = await prisma.forumPost.findMany({
        orderBy: { createdAt: sort },
        take: limit,
        skip: offset,
        where: topLevelOnly
            ? { parentId: null }
            : parentId !== undefined
            ? { parentId }
            : {},
        select: {
            id: true,
            content: true,
            parentId: true,
            createdAt: true,
            _count: { select: { children: true } }, // <-- only fetch the number
        },
    });

    return forumPosts as ForumPostDTO[];
}

// export async function POST(req: Request) {
//     console.log("POST request received");
//     console.log("Request body:", req.body);
//     const body = await req.json();

//     const { content, parentId } = body;

//     if (!content) {
//         return NextResponse.json(
//             { error: "Content is required." },
//             { status: 400 }
//         );
//     }

//     const forumPost = await prisma.forumPost.create({
//         data: {
//             content,
//             parentId: parentId || null,
//         },
//     });

//     return NextResponse.json(forumPost, { status: 201 });
// }
