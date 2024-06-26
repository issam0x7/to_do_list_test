import { Dexie, Table } from "dexie";
import { ITodo, TaskStatus } from "./types/task";



export class TodoDB extends Dexie {
  todoLists!: Table<ITodo, number>;

  constructor() {
    super("TodoDB");
    this.version(1).stores({
      todoLists: "++id, name, description, status, createdAt, subTodos",
    });
  }

  deleteList(todoListId: number) {
    return this.transaction("rw", this.todoLists, () => {
      this.todoLists.delete(todoListId);
    });
  }
}

export const db = new TodoDB();

db.on("populate", populate);

export function resetDatabase() {
  return db.transaction("rw", db.todoLists, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
    await populate();
  });
}

const getRandomStatus = (): TaskStatus => {
  const statuses: TaskStatus[] = ["DONE", "PENDING", "VALIDATED"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export async function populate() {
  const count = await db.todoLists.count();
  if (count === 10000) return;

  const tasks = [];
  for (let i = 0; i < 10000; i++) {
    const subTasks = [];
    for (let j = 0; j < 5; j++) {
      subTasks.push({
        id: j + 1,
        name: `Sub-task ${j + 1} of Task ${i + 1}`,
        done: false,
        createdAt: new Date(),
      });
    }
    tasks.push({
      id: i + 1,
      name: `Task ${i + 1}`,
      description: `This is the description for task ${i + 1}`,
      status: getRandomStatus(),
      createdAt: new Date(),
      subTodos: subTasks,
    });
  }

  await db.todoLists.bulkAdd(tasks);
}

export async function removeSubTask(taskId: number, subTaskId: number) {
  // Fetch the task
  const task = await db.todoLists.get(taskId);
  if (!task || !task.subTodos) {
    throw new Error("Task or sub-tasks not found");
  }

  // Remove the sub-task from the subTodos array
  task.subTodos = task.subTodos.filter((subTask) => subTask.id !== subTaskId);

  // Update the task in the database
  await db.todoLists.put(task);
}

export async function updateTodo(todoId: number, todo: ITodo) {
  await db.todoLists.update(todoId, todo);
}
