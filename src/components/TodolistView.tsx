import { Eye, Pencil, Trash } from "lucide-react";
import { db } from "../db";
import { ITodo, TaskStatus } from "../types/task";
import { useSelectedTodoContext } from "./context/selectedTodoContext";
import { useTodoFormModalContext } from "./context/todoFormModalContext";


const mapStatusToColor = (status: TaskStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500";
    case "DONE":
      return "bg-green-500";
    case "VALIDATED":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const TodolistView = ({ todoList }: { todoList: ITodo }) => {
  const { setSelectedTodo } = useSelectedTodoContext();
  const { setTodoToEdit, setModalState } = useTodoFormModalContext();

  const onDelete = () => {
    db.deleteList(todoList?.id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto  p-4 border border-gray-200 rounded-lg cursor-pointer">
      <div className="flex-1 flex  gap-4 p-4">
        <div className="flex-1 flex items-center gap-4">
          <h1 className="text-2xl font-bold">{todoList.name}</h1>
          <span className={`text-white py-2 px-4 rounded-full text-sm font-bold ${mapStatusToColor(todoList.status)}`}>{todoList.status}</span>
        </div>
        <div className="flex-none">
          <button
            onClick={() => {
              setTodoToEdit(todoList);
              setModalState({ isOpen: true, modalType: "edit" });
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            type="button"
            className="w-max bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ms-1"
          >
            <Trash className="w-4 h-4" />
          </button>
          <button
            className="text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ring-1 ring-white ms-1"
            onClick={() => setSelectedTodo(todoList)}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodolistView;
