


import { useTodoFormModalContext } from './context/todoFormModalContext';

function CreateTodoButton() {
    const { setModalState } = useTodoFormModalContext();
  return (
    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4'
    onClick={() => setModalState({ modalType: "create", isOpen: true })}
    >
        Créer une tâche
    </button>
  )
}

export default CreateTodoButton