"use client";

import { Board, Column, TaskList } from "@/lib/models/model.type";
import { Award, Calendar, CheckCircle, Clock1, MoreVertical, Trash2, XCircle } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "./card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import CreateTaskDialog from "./create-task-dialog";
import TaskListCard from "./task-list-card";

interface KanbanBoardProps {
    board: Board;
    userId: string;
}

interface ColumnConfig {
    color: string;
    icon: React.ReactNode
}

const COLUMN_CONFIG: Array<ColumnConfig> = [
    {
        color: "bg-blue-500",
        icon: <Calendar className="w-4 h-4"/>
    },
    {
        color: "bg-green-500",
        icon: <CheckCircle className="w-4 h-4"/>
    },
    {
        color: "bg-yellow-500",
        icon: <Clock1 className="w-4 h-4"/>
    },
    {
        color: "bg-purple-500",
        icon: <Award className="w-4 h-4"/>
    },
    {
        color: "bg-red-500",
        icon: <XCircle className="w-4 h-4"/>
    }
]

function DroppableColumn({column, config, boardId, sortedColumns} : {column: Column, config: ColumnConfig, boardId: string, sortedColumns: Column[]}) {
    const sortedTasks = column.tasksList.sort((a, b) => a.order - b.order);
    return (
        <Card className="min-w-75 shrink-0 shadow-md p-0 pb-2">
            <CardHeader className={`${config.color} text-white rounded-t-lg py-3 w-full`}>
                <div className="flex items-center gap-2">
                    {config.icon}
                    <CardTitle className="text-white text-base font-semibold">{column.name}</CardTitle>
                </div>
                <CardAction>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer">
                            <MoreVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuGroup>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer">
                                    <div className="flex items-center gap-2 text-destructive"><Trash2/>Delete</div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenuGroup>
                    </DropdownMenu>
                </CardAction>
            </CardHeader>

            <CardContent className="space-y-2 min-h-75 pt-4 bg-gray-50/50">
                {sortedTasks.map((task, key) => (
                    <SortedTaskList 
                        key={key}
                        task={{...task, columnId: task.columnId || column._id}}
                        columns={sortedColumns}
                    />
                ))}
                <CreateTaskDialog columnId={column._id} boardId={boardId} />
            </CardContent>
        </Card>
    )
}

function SortedTaskList({ task, columns } : { task: TaskList, columns: Column[] }) {
    return (
        <div>
            <TaskListCard task={task} columns={columns}/>
        </div>
    )
}

export default function KanbanBoard({board, userId} : KanbanBoardProps) {
    const columns = board.columns;
    const sortedColumns = columns.sort((a, b) => a.order - b.order);
    return (
        <>
            <div>
                <div>
                    {columns.map((col, key) => {
                        const config = COLUMN_CONFIG[key] || {
                            color: "bg-gray-500",
                            icon: <Calendar/>
                        }
                        return (
                            <DroppableColumn key={key} column={col} config={config} boardId={board._id} sortedColumns={sortedColumns}/>
                        )
                    })}
                </div>
            </div>
        </>
    )
}