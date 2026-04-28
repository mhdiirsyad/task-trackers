"use client";

import { Board, Column, TaskList } from "@/lib/models/model.type";
import { Award, Calendar, CheckCircle, Clock1, MoreVertical, Trash2, XCircle } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "./card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import CreateTaskDialog from "./create-task-dialog";
import TaskListCard from "./task-list-card";
import { useBoard } from "@/lib/hooks/useBoard";
import { closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

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
    const {setNodeRef, isOver} = useDroppable({
        id: column._id,
        data: {
            type: "column",
            columnId: column._id
        }
    })
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

            <CardContent ref={setNodeRef} className={`space-y-2 min-h-75 pt-4 bg-gray-50/50 ${isOver ? "ring-blue-500 ring-2" : ""}`}>
            <SortableContext items={sortedTasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
                {sortedTasks.map((task, key) => (
                    <SortedTaskList 
                        key={key}
                        task={{...task, columnId: task.columnId || column._id}}
                        columns={sortedColumns}
                    />
                ))}
            </SortableContext>
                <CreateTaskDialog columnId={column._id} boardId={boardId} />
            </CardContent>
        </Card>
    )
}

function SortedTaskList({ task, columns } : { task: TaskList, columns: Column[] }) {
    const {
        attributes,
        listeners,
        transform,
        transition,
        setNodeRef,
        isDragging
    } = useSortable({
        id: task._id,
        data: {
            type: "task",
            task
        }
    })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }
    return (
        <div ref={setNodeRef} style={style}>
            <TaskListCard task={task} columns={columns} dragHandleProps={{...attributes, ...listeners}}/>
        </div>
    )
}

export default function KanbanBoard({board, userId} : KanbanBoardProps) {
    const {columns, moveTask} = useBoard(board);
    const [activeId, setActiveId] = useState<string | null>(null);
    const sortedColumns = columns.sort((a, b) => a.order - b.order);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        })
    )

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;
        setActiveId(null);
        if(!over || !board._id) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        let draggedTask : TaskList | null = null;
        let sourceColumn : Column | null = null;
        let sourceIndex = -1;

        for (const col of sortedColumns) {
            const tasks = col.tasksList.sort((a, b) => a.order - b.order);
            const index = tasks.findIndex(task => task._id === activeId);
            if(index !== -1) {
                draggedTask = tasks[index];
                sourceColumn = col;
                sourceIndex = index;
                break;
            }
        }

        if(!draggedTask || !sourceColumn) return;

        const targetColumn = sortedColumns.find(col => col._id === overId);
        const targetTask = sortedColumns.flatMap(col => col.tasksList || []).find(task => task._id === overId);

        let targetColumnId: string;
        let newOrder: number;

        if(targetColumn) {
            targetColumnId = targetColumn._id;
            const tasksInTargetCol = targetColumn.tasksList.filter(
                (task) => task._id !== activeId).sort(
                    (a, b) => a.order - b.order) || [];
            newOrder = tasksInTargetCol.length
        } else if (targetTask) {
            const targetTaskCol = sortedColumns.find(col => col.tasksList.some((t) => t._id === targetTask._id));
            targetColumnId = targetTaskCol?._id || targetTask._id || "";
            if(!targetColumnId) return;

            const targetColObj = sortedColumns.find(col => col._id === targetColumnId);
            if(!targetColObj) return;

            const allTasksInTargetOriginal = targetColObj.tasksList.sort(
                (a, b) => a.order - b.order
            ) || [];

            const allTasksInTargetFiltered = allTasksInTargetOriginal.filter(
                (task) => task._id !== activeId
            ) || [];

            const targetIndexOriginal = allTasksInTargetOriginal.findIndex(task => task._id === overId);
            const targetIndexFiltered = allTasksInTargetFiltered.findIndex(task => task._id === overId);

            if(targetIndexFiltered === -1) {
                if(sourceColumn._id === targetColumnId) {
                    if(sourceIndex < targetIndexOriginal) {
                        newOrder = targetIndexFiltered + 1;
                    } else {
                        newOrder = targetIndexFiltered;
                    }
                } else {
                    newOrder = targetIndexFiltered;
                }
            } else {
                newOrder = allTasksInTargetFiltered.length;
            }
        } else {
            return;
        }

        if(!targetColumnId) return;

        await moveTask(activeId, targetColumnId, newOrder);
    }

    const activeTask = sortedColumns.flatMap(col => col.tasksList || []).find(task => task._id === activeId);
    return (
        <DndContext 
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
        >
            <div className="space-y-4">
                <div className="flex overflow-x-auto gap-4 pb-4">
                    {sortedColumns.map((col, key) => {
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
            <DragOverlay>
                {activeTask ? (
                    <div className="opacity-50">
                        <TaskListCard task={activeTask} columns={sortedColumns} />
                    </div>
                ) : (
                    null
                )}
            </DragOverlay>
        </DndContext>
    )
}