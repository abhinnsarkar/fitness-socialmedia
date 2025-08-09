// prisma/seed.ts (SUPER COMMENTED, SIMPLE VERSION)
// ------------------------------------------------
// Goal: Insert forum posts where some posts are replies to others.
// How the DB links them: a reply stores its parent's id in `parentId`.
// This script:
//   1) WIPES the ForumPost table (dev-only safety so you can re-run)
//   2) DEFINES a simple in-memory tree shape (content + children)
//   3) INSERTS parents first, then their children, then grandchildren, etc.
//      (We do this with a small, easy-to-read recursive function.)
// ------------------------------------------------

import { PrismaClient } from "../src/generated/prisma"; // <- from your custom client path
const prisma = new PrismaClient();

// ------------------------------------------------
// 0) What shape are we feeding into the seeder?
// ------------------------------------------------
// This is NOT a database type. It's just a convenient way to describe a thread
// in code. Prisma will NOT store `children` in the DB. We only use it while
// seeding so we know which posts should be replies to which parent.
// Keep it as simple as possible: content + (optional) children.
// If later you need authorId/title/etc., you can add fields here and pass them
// into the create() call below.

type PostSeed = {
    content: string;
    children?: PostSeed[]; // replies to THIS post
};

// ------------------------------------------------
// 1) DEV-ONLY: wipe the table so you can re-run seeds without duplicates
// ------------------------------------------------
async function reset() {
    // We only have one table to worry about.
    // deleteMany() removes all rows. This is fine for local/dev seeding.
    await prisma.forumPost.deleteMany();
}

// ------------------------------------------------
// 2) The simplest possible tree writer
// ------------------------------------------------
// Given a node (content + maybe children) and a parentId (null for roots):
//   - Create the row for THIS node
//   - If there are children, create each child with parentId = this new row's id
// Yes, it's recursive. That's the most straightforward way to read parent->child.
// (We also log what we insert so you can SEE what's happening.)
async function insertNode(node: PostSeed, parentId: string | null) {
    // Create the current post. Only the fields your schema requires need to go here.
    const created = await prisma.forumPost.create({
        data: {
            content: node.content,
            parentId: parentId, // null for roots; a real id for replies
        },
    });

    // Helpful console log so you can follow along in the terminal
    console.log(
        parentId
            ? `Inserted REPLY id=${created.id} (parentId=${parentId}) -> ${node.content}`
            : `Inserted PARENT id=${created.id} -> ${node.content}`
    );

    // If this node has children, insert each one as a reply to THIS node
    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            await insertNode(child, created.id);
        }
    }
}

// ------------------------------------------------
// 3) Your seed data (easy to scan, small to start)
// ------------------------------------------------
// TIP: Start tiny so you can see what's going on. Add more once you trust it.
const DATA: PostSeed[] = [
    {
        content: "What’s the best shoulder routine for beginners?",
        children: [
            {
                content:
                    "Start with Dumbbell Shoulder Press, Lateral Raises, Face Pulls.",
                children: [
                    {
                        content:
                            "Agree—keep volume moderate and focus on form.",
                    },
                    {
                        content:
                            "Add rear delts every session; they’re often neglected.",
                    },
                ],
            },
            {
                content:
                    "I prefer machines at first to lock the path of motion.",
            },
        ],
    },
    {
        content: "Cutting update: down 8 lbs—how to keep strength?",
        children: [
            {
                content:
                    "Keep intensity high, reduce volume slightly, prioritize sleep.",
                children: [
                    {
                        content:
                            "Also keep protein ~1g/lb and don’t slash calories too fast.",
                        children: [
                            {
                                content:
                                    "Seconded. Refeeds can help mentally, too.",
                            },
                        ],
                    },
                ],
            },
            { content: "Creatine + consistent programming helped me a ton." },
        ],
    },
];

// ------------------------------------------------
// 4) Orchestration: wipe -> insert all roots -> print a quick count
// ------------------------------------------------
async function main() {
    console.log("(1/3) Wiping ForumPost table...");
    await reset();

    console.log("(2/3) Inserting posts...");
    for (const root of DATA) {
        await insertNode(root, null); // null parentId means: this is a ROOT post
    }

    console.log("(3/3) Done. Counting rows...");
    const count = await prisma.forumPost.count();
    console.log(`Seed complete. ForumPost rows: ${count}`);
}

main()
    .catch((err) => {
        console.error("Seed failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
