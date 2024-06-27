import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import { useTodoFormModalContext } from "./context/todoFormModalContext";
import CreateTaskForm from "./createTaskForm";

const FormModal = () => {
  const { setModalState, modalState, setTodoToEdit } =
    useTodoFormModalContext();

  return (
    <Dialog
      open={modalState.isOpen}
      onClose={() => {
        setModalState({ isOpen: false, modalType: "create" });
        setTodoToEdit(null);
      }}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="relative w-[500px] space-y-4 border bg-[#242424] p-12">
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => {
              setModalState({ isOpen: false, modalType: "create" });
              setTodoToEdit(null);
            }}
          >
            <span className="sr-only">Close</span>
            <X className="w-6 h-6 text-white" />
          </button>
          <DialogTitle className="font-bold">Create Todo</DialogTitle>

          <CreateTaskForm />
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default FormModal;
