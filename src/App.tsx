import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import FormModal from "./components/FormModal";
import TodoLists from "./components/TodoLists";

function App() {
  return (
    <>
      <TodoLists />
      <FormModal />
      <ToastContainer />
    </>
  );
}

export default App;
