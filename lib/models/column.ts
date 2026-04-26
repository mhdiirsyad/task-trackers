import mongoose, { Document, Schema } from "mongoose";

export interface IColumn extends Document {
    name: string;
    order: number;
    boardId: mongoose.Types.ObjectId;
    tasksList: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ColumnSchema = new Schema<IColumn>(
    {
        name: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            required: true,
            default: 0,
        },
        boardId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Board",
        },
        tasksList: [
            {
                type: Schema.Types.ObjectId,
                ref: "TaskList"
            }
        ]
    }, {
        timestamps: true,
    }
)

export default mongoose.models.Column || mongoose.model<IColumn>("Column", ColumnSchema)