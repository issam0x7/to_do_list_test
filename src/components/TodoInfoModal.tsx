import { Checkbox, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { globalStatusOptions, globalStatusOptions } from "../contants/todoStatus";
import { db } from "../db";
import { ISubTodo, TaskStatus } from "../types/task";
import { useSelectedTodoContext } from "./context/selectedTodoContext";
import CustomSelect from "./ui/select";

export type SelectOption = {
  value: TaskStatus;
  label: string;
};

const TodoInfoModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { selectedTodo, setSelectedTodo } = useSelectedTodoContext();

  const task = useLiveQuery(async () => {
    if (selectedTodo) {
      return await db.todoLists.get(selectedTodo.id);
    }
  }, [selectedTodo]);

  useEffect(() => {
    setIsOpen(selectedTodo !== null);
  }, [selectedTodo]);

  const onSelectStatus = (option: SelectOption) => {
    if (selectedTodo) {
      const isSubTaskCompleted = task?.subTodos?.every(
        (subTodo) => subTodo.done
      );

      if (isSubTaskCompleted && option.value === "DONE") {
        db.todoLists.put({
          ...selectedTodo,
          status: option.value,
        });
      } else if (option.value !== "DONE") {
        db.todoLists.update(selectedTodo?.id, { status: option?.value });
      } else {
        toast.warn(
          "Toutes les sous-tâches doivent être complétées avant de changer le statut de la tâche"
        );

      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        setSelectedTodo(null);
      }}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="relative w-[800px] space-y-4 border bg-[#242424] p-12">
          
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => {
              setIsOpen(false);
              setSelectedTodo(null);
            }}
          >
            <span className="sr-only">Close</span>
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-bold text-2xl">
              To do : {selectedTodo?.name}{" "}
            </DialogTitle>

            <CustomSelect
              defaultValue={globalStatusOptions.find(
                (option) => option.value === selectedTodo?.status
              )}
              options={globalStatusOptions}
              onChange={(option) => onSelectStatus(option as SelectOption)}
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-semibold text-lg">
                description :
              </label>
              <p>{selectedTodo?.description}</p>
            </div>
            {selectedTodo?.subTodos && selectedTodo?.subTodos.length > 0 && (
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="font-semibold text-lg">
                  Sous-tâches :
                </label>
                {selectedTodo?.subTodos?.map((subTodo: ISubTodo) => (
                  <SubTask
                    key={subTodo.id}
                    subTodo={subTodo}
                    todoId={selectedTodo.id}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

const SubTask = ({
  subTodo,
  todoId,
}: {
  subTodo: ISubTodo;
  todoId: number;
}) => {
  const [enabled, setEnabled] = useState(subTodo.done);

  const updateSubTaskDone = async (
    todoId: number,
    subTodoId: number,
    done: boolean
  ) => {
    // Fetch the task
    const task = await db.todoLists.get(todoId);
    if (!task || !task.subTodos) {
      throw new Error("Task or sub-tasks not found");
    }

    // Find the sub-task and update its done status
    const subTaskIndex = task.subTodos.findIndex(
      (subTask: ISubTodo) => subTask.id === subTodoId
    );
    if (subTaskIndex === -1) {
      throw new Error("Sub-task not found");
    }
    task.subTodos[subTaskIndex].done = done;

    const allSubTasksDone = task.subTodos.every((subTask: ISubTodo) => subTask.done);

    if (!allSubTasksDone && task.status === "DONE") {
      task.status = "PENDING";
    }

    // Update the task in the database
    await db.todoLists.put(task);
  };

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        checked={enabled}
        onChange={(checked: boolean) => {
          setEnabled(!enabled);
          updateSubTaskDone(todoId, subTodo.id, checked);
        }}
        className="group block size-6 rounded border bg-white data-[checked]:bg-green-500"
      >
        {/* Checkmark icon */}
        <svg
          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Checkbox>
      <p key={subTodo.id} className={`${subTodo.done ?? "decoration-line-through"}`}>{subTodo.name}</p>
    </div>
  );
};

export default TodoInfoModal;
