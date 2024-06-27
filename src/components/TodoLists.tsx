import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { FixedSizeList as List } from "react-window";
import { db } from "../db";
import { ITodo, TaskStatus } from "../types/task";
import CreateTodoButton from "./CreateTodoButton";
import FormModal from "./FormModal";
import SearchBar from "./SearchBar";
import TodoInfoModal from "./TodoInfoModal";
import TodolistView from "./TodolistView";
import { SelectedTodoProvider } from "./context/selectedTodoContext";
import { TodoFormModalProvider } from "./context/todoFormModalContext";

// const getItemSize = (index: number, todoList: ITodo[]) =>
//   todoList[index];

const Row = ({ todoList }: { todoList: ITodo }) => {
  return <TodolistView todoList={todoList} />;
};

const TodoLists = () => {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "">("");
  
  const lists = useLiveQuery(async() => {
    let query = await db.todoLists
      .where("name")
      .startsWithIgnoreCase(search).reverse().sortBy("createdAt");

    if (selectedStatus) {
      query = query.filter((todo : ITodo) => todo.status === selectedStatus);
    }

    return query;
  }, [search, selectedStatus]);
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
          <SearchBar
            setSearch={setSearch}
            setSelectedStatus={setSelectedStatus}
          />
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
