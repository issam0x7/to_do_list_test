import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import TodoLists from "./components/TodoLists";

function App() {
  return (
    <div className="w-full mx-auto">
    <Header />
      <TodoLists />
      
      <ToastContainer />
    </div>
  );
}

export default App;
