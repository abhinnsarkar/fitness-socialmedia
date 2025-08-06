import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// export async function GET() {
//     const forumPosts = await prisma.forumPost.findMany({
//         orderBy: {
//             createdAt: "desc",
//         },
//         include: {
//             children: {
//                 orderBy: {
//                     createdAt: "desc",
//                 },
//             },
//         },
//     });

//     return NextResponse.json(forumPosts, { status: 200 });
// }

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
