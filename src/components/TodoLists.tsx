import { useLiveQuery } from "dexie-react-hooks";
import { FixedSizeList as List } from "react-window";
import { db } from "../db";
import { ITodo } from "../types/task";
import CreateTodoButton from "./CreateTodoButton";
import FormModal from "./FormModal";
import TodoInfoModal from "./TodoInfoModal";
import TodolistView from "./TodolistView";
import { SelectedTodoProvider } from "./context/selectedTodoContext";
import { TodoFormModalProvider } from "./context/todoFormModalContext";
import { useState } from "react";

// const getItemSize = (index: number, todoList: ITodo[]) =>
//   todoList[index];

const Row = ({ todoList }: { todoList: ITodo }) => {
  return <TodolistView todoList={todoList} />;
};

const TodoLists = () => {

  const [search, setSearch] = useState("");
  const lists = useLiveQuery(() =>
    db.todoLists.orderBy("createdAt").reverse().toArray()
  );
  // console.log(lists);

  if (!lists) return null;

  return (
    <SelectedTodoProvider>
      <TodoFormModalProvider>
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 p-4">
          {/* {lists?.map((list: ITodo) => (
        <TodolistView key={list.id} todoList={list} />
      ))} */}
          <CreateTodoButton />
          <List
            itemData={lists}
            height={500}
            itemCount={lists?.length}
            itemSize={120}
            width={800}
          >
            {({ data, index, style }) => (
              <div style={style}>
                <Row todoList={data[index]} />
              </div>
            )}
          </List>
          <FormModal />
          <TodoInfoModal />
        </div>
      </TodoFormModalProvider>
    </SelectedTodoProvider>
  );
};

export default TodoLists;
