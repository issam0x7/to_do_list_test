import { createContext, useContext, useState } from "react";
import { ITodo } from "../../types/task";

export type SelectedTodoContextValue = {
  selectedTodo: ITodo | null;
  setSelectedTodo: React.Dispatch<React.SetStateAction<ITodo | null>>;
};

export const SelectedTodoContext =
  createContext<SelectedTodoContextValue | null>(null);

export const SelectedTodoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedTodo, setSelectedTodo] = useState<ITodo | null>(null);

  return (
    <SelectedTodoContext.Provider value={{ selectedTodo, setSelectedTodo }}>
      {children}
    </SelectedTodoContext.Provider>
  );
};

export const useSelectedTodoContext = () => {
  const context = useContext(SelectedTodoContext);
  if (!context) {
    throw new Error(
      "useSelectedTodoContext must be used within a SelectedTodoProvider"
    );
  }
  return context;
};
