import { Column, TaskList } from "@/lib/models/model.type";
import { Card, CardContent } from "./card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

interface TaskListCardProps {
    task: TaskList;
    columns: Column[];
}

export default function TaskListCard({ task, columns }: TaskListCardProps) {
    return (
        <>
            <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold mb-2">{task.name}</h3>
                            {task.description && <p className="text-sm text-muted-foreground mb-2">{task.description}</p>}
                            {task.notes && <p className="text-sm text-muted-foreground mb-2">{task.notes}</p>}
                            {task.tags && task.tags.length > 0 && (
                                <div className="flex flex-row items-center gap-1 mb-2">
                                    {task.tags.map((t, idx) => (
                                        <span key={idx} className="bg-blue-300 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className={"cursor-pointer"}>
                                    <MoreVertical width={16} />
                                </DropdownMenuTrigger>
                                <DropdownMenuGroup>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Edit /> Edit
                                        </DropdownMenuItem>
                                        {columns.length > 1 && (
                                            <>
                                                {columns.filter(col => col._id !== task.columnId).map(col => (
                                                    <DropdownMenuItem key={col._id} className="cursor-pointer">
                                                        Move to {col.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </>
                                        )}
                                        <DropdownMenuItem className="cursor-pointer text-destructive">
                                            <Trash2 /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenuGroup>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}