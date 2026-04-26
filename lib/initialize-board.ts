import connectDB from "./db";
import { Board, Column } from "./models";

const DEFAULT_COLUMN = [
    {
        name: "On Progress",
        order: 0,
    },
    {
        name: "Done",
        order: 1,
    }, 
    {
        name: "Reviewing",
        order: 2,
    },
    {
        name: "Accepted",
        order: 3,
    },
    {
        name: "Rejected",
        order: 4,
    },
]

export default async function initializeUserBoard(userId: string) {
    try {
        await connectDB();

        // Check already exist
        const existingBoard = await Board.findOne({userId, name: "Task List"})
        if(existingBoard) {
            return existingBoard
        }

        const board = await Board.create({
            name: "Task List",
            userId,
            columns: [],
        })

        const columns = await Promise.all(DEFAULT_COLUMN.map((col) => Column.create({
            name: col.name,
            order: col.order,
            boardId: board._id,
            tasksList: [],
        })))

        board.columns = columns.map((col) => col._id)
        await board.save();
        return board;
    } catch (err) {
        throw err
    }
}