"use server";

import { now } from "mongoose";
import { getSession } from "../auth/auth";
import { Board, Column, TaskList } from "../models";
import connectDB from "../db";

interface TaskListData {
    name: string;
    description?: string;
    notes?: string; 
    tags?: string[];
    columnId: string;
    boardId: string;
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
        status: "On Progress",
        order: maxOrder ? maxOrder.order + 1 : 0,
        start: now(),
        end: now(),
    })

    await Column.findByIdAndUpdate(columnId, {
        $push: {tasksList: taskList._id} ,
    })

    return { data: JSON.parse(JSON.stringify(taskList))}
}