


export type TaskStatus = 'DONE' | 'IN_PROGRESS' | 'TODO';


export interface ITask {
    id: number;
    name: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
    subTasks?: ITask[];
}