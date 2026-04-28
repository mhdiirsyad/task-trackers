"use client";

import { Column, TaskList } from "@/lib/models/model.type";
import { Card, CardContent } from "./card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { deleteTask, updateTaskList } from "@/lib/actions/task-list";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";

interface TaskListCardProps {
    task: TaskList;
    columns: Column[];
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export default function TaskListCard({ task, columns, dragHandleProps }: TaskListCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: task.name,
        description: task.description || "",
        notes: task.notes || "",
        tags: task.tags ? task.tags.join(", ") || "" : "",
    })

    async function handleUpdate(e: React.SubmitEvent) {
        e.preventDefault();
        try {
            const result = await updateTaskList(task._id, { 
                ...formData,
                tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
             });
            if (!result.error) {
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Failed to move task:", err);
        }
    }

    async function handleDelete() {
        try {
            const result = await deleteTask(task._id);
            console.log(result);
        } catch (err) {
            console.error("Failed to move task:", err);
        }
    }

    async function handleMoveTask(newColumnId: string) {
        try {
            const result = await updateTaskList(task._id, { columnId: newColumnId });
            console.log(result);
        } catch (err) {
            console.error("Failed to move task:", err);
        }
    }
    return (
        <>
            <Card className="cursor-pointer transition-shadow hover:shadow-lg" {...dragHandleProps}>
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
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => setIsEditing(true)}>
                                            <Edit /> Edit
                                        </DropdownMenuItem>
                                        {columns.length > 1 && (
                                            <>
                                                {columns.filter(col => col._id !== task.columnId).map((col, key) => (
                                                    <DropdownMenuItem key={key} className="cursor-pointer" onClick={() => handleMoveTask(col._id)}>
                                                        Move to {col.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </>
                                        )}
                                        <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDelete()}>
                                            <Trash2 /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenuGroup>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>Make changes to your task</DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={handleUpdate}>
                        <div className="space-y-2 mb-4">
                            {/* Task Name */}
                            <Label htmlFor="name">Task Name *</Label>
                            <Input id="name" required value={formData.name} onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            } />
                            {/* Task Description */}
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={formData.description} onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            } />
                            {/* Task Tags */}
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input id="tags" value={formData.tags} onChange={(e) =>
                                setFormData({ ...formData, tags: e.target.value })
                            } />
                            {/* Task Note */}
                            <Label htmlFor="notes">Note</Label>
                            <Textarea id="notes" value={formData.notes} onChange={(e) =>
                                setFormData({ ...formData, notes: e.target.value })
                            } />
                        </div>
                        <DialogFooter>
                            <Button className="bg-destructive" type="button" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}