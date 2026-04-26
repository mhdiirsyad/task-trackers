"use client";

import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { useState } from "react";
import { createTaskList } from "@/lib/actions/task-list";

interface CreateTaskDialogProps {
    columnId: string;
    boardId: string;
}

const INITIAL_FORMDATA = {
    name: "",
    description: "",
    tags: "",
    notes: "",
}

export default function CreateTaskDialog({columnId, boardId}: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORMDATA)
    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
    
        try {
            const result = await createTaskList({
                ...formData,
                columnId,
                boardId,
                tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
            })

            if(!result.error) {
                setFormData(INITIAL_FORMDATA);
                setOpen(false);
            }else {
                console.error(result.error);
            }
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}> 
            <DialogTrigger render={<Button variant="outline" />}>
                <PlusCircle />
                Add task
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>Add your new task to the list</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-2 mb-4">
                        {/* Task Name */}
                        <Label htmlFor="name">Task Name *</Label>
                        <Input id="name" required value={formData.name} onChange={(e) => 
                            setFormData({...formData, name: e.target.value})
                        }/>
                        {/* Task Description */}
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={formData.description} onChange={(e) => 
                            setFormData({...formData, description: e.target.value})
                        }/>
                        {/* Task Tags */}
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input id="tags" value={formData.tags} onChange={(e) => 
                            setFormData({...formData, tags: e.target.value})
                        }/>
                        {/* Task Note */}
                        <Label htmlFor="notes">Note</Label>
                        <Textarea id="notes" value={formData.notes} onChange={(e) => 
                            setFormData({...formData, notes: e.target.value})
                        }/>
                    </div>
                    <DialogFooter>
                        <Button className="bg-destructive" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit">Add task</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}