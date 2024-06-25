


export type TaskStatus = 'DONE' | 'IN_PROGRESS' | 'TODO';


export interface ITodo {
    id: number;
    name: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
    
}


export interface ISubTodo {
    id: number;
    name: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
    todoId: number;
}