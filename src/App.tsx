import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormModal from "./components/FormModal";
import Header from "./components/Header";
import TodoLists from "./components/TodoLists";

function App() {
  return (
    <div className="w-full mx-auto">
    <Header />
      <TodoLists />
      <FormModal />
      <ToastContainer />
    </div>
  );
}

export default App;
