import mongoose, { Document, Schema } from "mongoose";

export interface ITaskList extends Document {
    name: string;
    status: string;
    description?: string;
    notes?: string; 
    tags?: string[];
    order: number;
    start: Date;
    end: Date;
    columnId: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TaskListSchema = new Schema<ITaskList>(
    {
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            default: "onProgress"
        },
        description: {
            type: String,
        },
        notes: {
            type: String,
        },
        tags: [
            {
                type: String,
            }
        ],
        order: {
            type: Number,
            required: true,
            default: 0,
        }, 
        start: {
            type: Date,
        },
        end: {
            type: Date,
        },
        boardId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        columnId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.models.TaskList || mongoose.model<ITaskList>("TaskList", TaskListSchema)