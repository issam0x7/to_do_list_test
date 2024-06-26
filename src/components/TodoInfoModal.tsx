import { Checkbox, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { db } from "../db";
import { ISubTodo, TaskStatus } from "../types/task";
import { useSelectedTodoContext } from "./context/selectedTodoContext";
import { statusOptions } from "./createTaskForm";

export type SelectOption = {
  value: TaskStatus;
  label: string;
};

const TodoInfoModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { selectedTodo, setSelectedTodo } = useSelectedTodoContext();
  

  useEffect(() => {
    setIsOpen(selectedTodo !== null);
  }, [selectedTodo]);

  const onSelectStatus = (option: SelectOption) => {
    if (selectedTodo) {
      const isSubTaskCompleted = selectedTodo.subTodos?.every(
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
        <DialogPanel className="w-[800px] space-y-4 border bg-[#242424] p-12">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-bold text-2xl">
              To do : {selectedTodo?.name}{" "}
            </DialogTitle>

            <ReactSelect
              defaultValue={statusOptions.find(
                (option) => option.value === selectedTodo?.status
              )}
              options={statusOptions}
              onChange={(option) => onSelectStatus(option as SelectOption)}
              className="text-gray-700"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-semibold">
                description :
              </label>
              <p>{selectedTodo?.description}</p>
            </div>
            {selectedTodo?.subTodos && selectedTodo?.subTodos.length > 0 && (
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="font-semibold">
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
        className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500"
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
      <p key={subTodo.id}>{subTodo.name}</p>
    </div>
  );
};

export default TodoInfoModal;
