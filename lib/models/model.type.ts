export interface Board {
    _id: string;
    name: string;
    userId: string;
    columns: Column[];
}

export interface Column {
    _id: string;
    name: string;
    order: number;
    tasksList: TaskList[];
}

export interface TaskList {
    _id: string;
    name: string;
    status: string;
    description?: string;
    notes?: string; 
    tags?: string[];
    order: number;
    start: Date;
    end: Date;
    columnId: string;
    boardId: string;
    userId: string;
}