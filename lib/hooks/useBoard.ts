"use client";

import { useEffect, useState } from "react";
import { Board, Column, TaskList } from "../models/model.type";
import { updateTaskList } from "../actions/task-list";

export function useBoard(initialBoard?: Board | null) {
    const [board, setBoard] = useState<Board | null>(initialBoard || null);
    const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(initialBoard) {
            // eslint-disable-next-line
            setBoard(initialBoard)
            setColumns(initialBoard.columns || [])
        }
    }, [initialBoard])
    async function moveTask(
        taskId: string,
        newColumnId: string,
        newOrder: number,
    ) {
        setColumns((prev) => {
            const newColumns = prev.map((col) => ({
                ...col,
                tasksList: [...col.tasksList]
            }))

            let taskToMove: TaskList | null = null;
            let oldColumnId: string | null = null;

            for (const col of newColumns) {
                const taskIndex = col.tasksList.findIndex((t) => t._id === taskId)
                if(taskIndex !== -1 && taskIndex !== undefined) {
                    taskToMove = col.tasksList[taskIndex]
                    oldColumnId = col._id
                    col.tasksList = col.tasksList.filter(
                        (task) => task._id !== taskId
                    )
                }
                break;
            }

            if(taskToMove && oldColumnId) {
                const targetColIndex = newColumns.findIndex(
                    (col) => col._id === newColumnId
                )

                if(targetColIndex !== -1) {
                    const targetColumn = newColumns[targetColIndex]
                    const currentTask = targetColumn.tasksList || []
                    
                    const updatedTasks = [...currentTask]
                    updatedTasks.splice(newOrder, 0, {
                        ...taskToMove,
                        columnId: newColumnId,
                        order: newOrder * 100
                    })
                    const taskWithUpdatedOrder = updatedTasks.map((task, idx) => ({
                        ...task,
                        order: idx * 100
                    }))

                    newColumns[targetColIndex] = {
                        ...targetColumn,
                        tasksList: taskWithUpdatedOrder
                    }
                }
            }
            return newColumns;
        })

        try {
            const result = await updateTaskList(taskId, {
                columnId: newColumnId,
                order: newOrder
            })
        } catch (err) {
            console.log(err)
        }
    }

    return {board, columns, error, moveTask}
}