"use server";

import { now } from "mongoose";
import { getSession } from "../auth/auth";
import { Board, Column, TaskList } from "../models";
import connectDB from "../db";
import { revalidatePath } from "next/cache";
import { TaskList as Task } from "../models/model.type";

interface TaskListData {
    name: string;
    description?: string;
    notes?: string; 
    tags?: string[];
    columnId: string;
    boardId: string;
    // userId: string;
}
export async function createTaskList(data: TaskListData) {
    const session = await getSession();
    if(!session?.user) {
        return {error: "Unauthorized"}
    }

    await connectDB();
    const {
        name,
        description,
        notes, 
        tags,
        columnId,
        boardId,
    } = data
    const board = Board.findOne({
        _id: boardId,
        userId: session.user.id
    })

    if(!board) {
        return {error: "board not found"}
    }

    const column = Column.findOne({
        _id: columnId,
        boardId: boardId
    });

    if(!column) {
        return {error: "column not found"}
    }

    const maxOrder = (await TaskList.findOne({columnId}).sort({order: -1}).select("order").lean()) as {order : number } | null;

    const taskList = await TaskList.create({
        name,
        description,
        notes,
        tags: tags || [],
        columnId,
        boardId,
        userId: session.user.id,
        status: "On Progress",
        order: maxOrder ? maxOrder.order + 1 : 0,
        start: now(),
        end: now(),
    })

    await Column.findByIdAndUpdate(columnId, {
        $push: {tasksList: taskList._id} ,
    })

    revalidatePath("/dashboard");

    return { data: JSON.parse(JSON.stringify(taskList))}
}

export async function updateTaskList(
    id: string,
    updates: {
        name?: string,
        description?: string,
        notes?: string,
        tags?: string[],
        columnId?: string,
        order?: number,
        start?: Date,
        end?: Date, 
    }
) {
    const session = await getSession();
    if(!session?.user) {
        return {error: "Unauthorized"}
    }

    await connectDB();
    const taskList = await TaskList.findById(id);

    if(!taskList) {
        return {error: "Task List not found"}
    }

    if(taskList.userId != session.user.id) {
        return {error: "Unauthorized"}
    }

    const {
        columnId,
        order,
        ...otherUpdates
    } = updates

    const updateToApply: Partial<{
        name: string,
        description: string,
        notes: string,
        tags: string[],
        columnId: string,
        order: number,
        start: Date,
        end: Date,
    }> = otherUpdates

    const currentColumn = taskList.columnId.toString();
    const newColumn = columnId?.toString() || "";

    const isChangeColumn = newColumn && (newColumn !== currentColumn)
    if(isChangeColumn) {
        await Column.findByIdAndUpdate(currentColumn, {
            $pull: {tasksList: id}
        })

        const tasksInNewCol : Task[] = await TaskList.find({
            columnId: newColumn,
            _id: {$ne: id},
        }).sort({order: -1}).lean()

        let newOrder: number;
        if(order !== undefined && order !== null) {
            newOrder = order * 100

            const taskToShift = tasksInNewCol.slice(order);
            for (const task of taskToShift) {
                await TaskList.findByIdAndUpdate(task._id, {
                    $set: {order: task.order + 100}
                })
            }
        } else {
            if(tasksInNewCol.length > 0) {
                const lastOrder = tasksInNewCol[tasksInNewCol.length - 1].order || 0;
                newOrder = lastOrder + 100
            } else {
                newOrder = 0
            }
        }
        updateToApply.columnId = columnId
        updateToApply.order = newOrder

        await Column.findByIdAndUpdate(newColumn, {
            $push: {tasksList: id}
        })
    } else if (order !== undefined && order !== null) {
        const otherTasksInCol = await TaskList.find({
            columnId: currentColumn,
            _id : {$ne: id}
        }).sort({order: 1}).lean()

        const currentTaskOrder = taskList.order || 0;
        const currentPositionIndex = otherTasksInCol.findIndex((task) => (
            task.order > currentTaskOrder
        ));

        const oldPositionIndex = currentPositionIndex === -1 ? otherTasksInCol.length + 1 : currentPositionIndex;
        const newOrder = order * 100

        if(order < oldPositionIndex) {
            const shiftDown = otherTasksInCol.slice(order, oldPositionIndex);

            for (const task of shiftDown) {
                await TaskList.findByIdAndUpdate(task._id, {
                    $set: {order: task.order + 100}
                })
            }
        } else if (order > oldPositionIndex) {
            const shiftUp = otherTasksInCol.slice(oldPositionIndex, order);
            for (const task of shiftUp) {
                const newOrder = Math.max(0, task.order - 100)
                await TaskList.findByIdAndUpdate(task._id, {
                    $set: {order: newOrder}
                })
            }
        }

        updateToApply.order = newOrder
    }

    const updated = await TaskList.findByIdAndUpdate(
        id, 
        updateToApply, 
        {new: true}
    )

    revalidatePath("/dashboard")

    return {data: JSON.parse(JSON.stringify(updated))}
}

export async function deleteTask(id: string) {
    const session = await getSession();
    if(!session?.user) {
        return {error: "Unauthorized"}
    }

    const taskList = await TaskList.findById(id)
    if(!taskList) {
        return {error: "Task not found"}
    }

    if(taskList.userId != session.user.id) {
        return {error: "Unauthorized"}
    }

    await Column.findByIdAndUpdate(taskList.columnId, {
        $pull: {tasksList: id}
    })

    await TaskList.deleteOne({_id: id})

    revalidatePath("/dashboard")
    return {succes: true}
}