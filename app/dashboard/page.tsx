import KanbanBoard from "@/components/ui/kanban-board";
import { getSession } from "@/lib/auth/auth"
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await getSession();
    if(!session?.user) {
        return redirect("/sign-in");
    }

    await connectDB();
    const board = await Board.findOne({
        userId: session.user.id,
        name: "Task List"
    }).populate({
        path: "columns", 
        populate: {
            path: "tasksList"
        }
    });
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-black">{board.name}</h1>
                    <p className="text-sm text-muted-foreground">Utilize this board to manage your tasks and projects.</p>
                </div>
                {/* Board content */}
                <KanbanBoard board={JSON.parse(JSON.stringify(board))} userId={session.user.id} />
            </div>
        </div>
    )
}