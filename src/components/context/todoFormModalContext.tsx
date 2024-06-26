import { createContext, useContext, useState } from "react";
import { ITodo } from "../../types/task";

type modalType = "create" | "edit";

export type TodoFormModalContextType = {
  modalState: {
    isOpen: boolean;
    modalType: modalType;
  };
  setModalState: (modalState: { isOpen: boolean; modalType: "create" | "edit" }) => void;
  todoToEdit: ITodo | null;
  setTodoToEdit: (todoToEdit: ITodo | null) => void;
};

const TodoFormModalContext = createContext<TodoFormModalContextType>({
  modalState: {
    isOpen: false,
    modalType: "create",
  },
  setModalState: () => {},
  todoToEdit: null,
  setTodoToEdit: () => {},
});

export const TodoFormModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    modalType: "create" as modalType,
  });
  const [todoToEdit, setTodoToEdit] = useState<ITodo | null>(null);

  return (
    <TodoFormModalContext.Provider
      value={{
        modalState,
        setModalState,
        todoToEdit,
        setTodoToEdit,
      }}
    >
      {children}
    </TodoFormModalContext.Provider>
  );
};

export const useTodoFormModalContext = () => {
  const context = useContext(TodoFormModalContext);

  if (!context) {
    throw new Error(
      "useTodoFormModalContext must be used within a TodoFormModalProvider"
    );
  }

  return context;
};
