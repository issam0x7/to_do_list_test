


export type TaskStatus = 'DONE'  | 'PENDING' | 'VALIDATED';


export interface ISubTodo {
    id: number;
    name: string;
    done : boolean;
    createdAt: Date;
}

export interface ITodo {
    id: number;
    name: string;
    description?: string;
    status: TaskStatus;
    createdAt: Date;
    subTodos?: ISubTodo[];
}


