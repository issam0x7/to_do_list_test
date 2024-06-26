import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import * as yup from "yup";
import { db, updateTodo } from "../db";
import { TaskStatus } from "../types/task";
import { useTodoFormModalContext } from "./context/todoFormModalContext";

const TaskSchema = yup.object().shape({
  name: yup.string().required("Nom de la tâche est requis"),
  description: yup.string(),
  createdAt: yup.date().required("Date et heure de création sont requises"),
  status: yup.string().required("Statut de la tâche est requis"),
  subTodos: yup.array().of(
    yup.object().shape({
      id: yup.number().required("Id de la sous-tâche est requis"),
      name: yup.string().required("Nom de la sous-tâche est requis"),
      done: yup.boolean().required("La sous-tâche doit être complétée").default(false),
      createdAt: yup.date().required("Date et heure de création sont requises"),
    })
  ),
});

export const statusOptions = [
  { value: "PENDING", label: "En attente" },
  { value: "DONE", label: "Done" },
  { value: "VALIDATED", label: "Validé" },
];

type TaskFormInputs = yup.InferType<typeof TaskSchema>;

const CreateTaskForm = () => {
  const { modalState, todoToEdit } = useTodoFormModalContext();

  const [withDescription, setWithDescription] = useState(
    modalState.modalType === "edit"
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<TaskFormInputs>({
    resolver: yupResolver(TaskSchema),
    defaultValues: {
      name: todoToEdit?.name ?? "",
      description: todoToEdit?.description ?? "",
      createdAt: todoToEdit?.createdAt ?? new Date(),
      status: todoToEdit?.status ?? "",
      subTodos: todoToEdit?.subTodos ?? [{id: 1, name: "", done: false, createdAt: new Date()}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "subTodos",
    control,
  });

  const onSubmit: SubmitHandler<TaskFormInputs> = async (data) => {
    if (modalState.modalType === "create") {
      const lastTodo = await db.todoLists.toCollection().last();
      console.log(lastTodo);
      const id = lastTodo?.id  ? lastTodo.id + 1 : 1;
      await db.todoLists.add({
        id: id,
        name: data.name,
        description: data.description ?? "",
        status: data.status as TaskStatus,
        createdAt: data.createdAt,
        subTodos: data.subTodos,
      });
      toast.success("La tâche a été créée avec succès");

      // Code to store task in IndexedDB can be added here
    } else {
      if (todoToEdit) {
        await updateTodo(todoToEdit?.id, { id: todoToEdit?.id ,  ...data, status: data.status as TaskStatus });
      }
    }
    // Code to store task in IndexedDB can be added here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl mb-4">Création de Tâches</h1>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">
          Nom de la tâche
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
              {...field}
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-xs italic">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block  text-sm font-bold mb-2">
          Date et heure de création
        </label>
        <Controller
          name="createdAt"
          control={control}
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={field.onChange}
              showTimeSelect
              dateFormat="Pp"
              className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
            />
          )}
        />
        {errors.createdAt && (
          <p className="text-red-500 text-xs italic">
            {errors.createdAt.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">
          Statut
        </label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <ReactSelect
              options={statusOptions}
              onChange={(option) => field.onChange(option?.value)}
              className="text-gray-700"
            />
          )}
        />
        {errors.status && (
          <p className="text-red-500 text-xs italic">{errors.status.message}</p>
        )}
      </div>

      <div className="mb-4" id="subTodos">
        <label className="block  text-sm font-bold mb-2">
          Sous-tâches
        </label>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 w-full flex gap-2">
            <div className="w-full flex items-center gap-2">
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
                {...register(`subTodos.${index}.name`)}
              />
            </div>
        
            <button
              type="button"
              className="w-max bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={() => remove(index)}
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="w-max block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ms-auto"
        onClick={() =>
          append({
            id: fields[fields.length - 1].id + 1,
            name: "",
            done: false,
            createdAt: new Date(),
          })
        }
      >
        <Plus className="w-4 h-4" />
      </button>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="mr-2"
            checked={withDescription}
            onChange={() => setWithDescription(!withDescription)}
          />
          <label className="block text-sm font-bold ">
            Ajouter une description
          </label>
        </div>
        {withDescription && (
          <>
            <label className="block  text-sm font-bold mb-2">
              Description de la tâche
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  {...field}
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-xs italic">
                {errors.description.message}
              </p>
            )}
          </>
        )}
      </div>

      <div className="mb-4"></div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Créer la tâche
      </button>
    </form>
  );
};

export default CreateTaskForm;
