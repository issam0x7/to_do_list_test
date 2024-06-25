import { Dexie, Table } from "dexie";
import { ISubTodo, ITodo } from "./types/task";

export class TodoDB extends Dexie {
    todoLists!: Table<ITodo, number>;
    todoItems!: Table<ISubTodo, number>;
    constructor() {
      super('TodoDB');
      this.version(1).stores({
        todoLists: '++id',
        todoItems: '++id, todoListId'
      });
    }
  
    deleteList(todoListId: number) {
      return this.transaction('rw', this.todoItems, this.todoLists, () => {
        this.todoItems.where({ todoListId }).delete();
        this.todoLists.delete(todoListId);
      });
    }
  }
  
  export const db = new TodoDB();
  
  db.on('populate', populate);
  
  export function resetDatabase() {
    return db.transaction('rw', db.todoLists, db.todoItems, async () => {
      await Promise.all(db.tables.map(table => table.clear()));
      await populate();
    });
  }