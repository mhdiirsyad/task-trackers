import KanbanBoard from "@/components/ui/kanban-board";
import { getSession } from "@/lib/auth/auth"
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function getBoard(userId: string) {
    "use cache";
    await connectDB();
    const boardDoc = await Board.findOne({
        userId: userId,
        name: "Task List"
    }).populate({
        path: "columns", 
        populate: {
            path: "tasksList"
        }
    });

    if(!boardDoc) return null;

    const board = JSON.parse(JSON.stringify(boardDoc));
    return board;
}

async function DasboardPage () {
    const session = await getSession();
    if(!session?.user) {
        return redirect("/sign-in");
    }

    const board = await getBoard(session.user.id);
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black">{board.name}</h1>
                    <p className="text-sm text-muted-foreground">Utilize this board to manage your tasks and projects.</p>
                </div>
                {/* Board content */}
                <KanbanBoard board={board} userId={session.user.id} />
            </div>
        </div>
    )
}

export default async function Dashboard() {
    return (
        <Suspense fallback={
            <p>loading...</p>
        }>
            <DasboardPage />
        </Suspense>
    )
}