import {
  Dialog,
  DialogPanel,
  DialogTitle
} from "@headlessui/react";
import { useTodoFormModalContext } from "./context/todoFormModalContext";
import CreateTaskForm from "./createTaskForm";

const FormModal = () => {
  const { setModalState, modalState } = useTodoFormModalContext();

  
  return (
    <Dialog
      open={modalState.isOpen}
      onClose={() => setModalState({ isOpen: false, modalType: "create" })}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-[500px] space-y-4 border bg-[#242424] p-12">
          <DialogTitle className="font-bold">Create Todo</DialogTitle>

          <CreateTaskForm />
          
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default FormModal;
