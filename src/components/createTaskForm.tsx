import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import * as yup from 'yup';





const TaskSchema = yup.object().shape({
  name: yup.string().required('Nom de la tâche est requis'),
  description: yup.string(),
  createdAt: yup.date().required('Date et heure de création sont requises'),
  status: yup.string().required('Statut de la tâche est requis'),
});


const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'done', label: 'Done' },
  { value: 'validated', label: 'Validé' },
];

type TaskFormInputs = yup.InferType<typeof TaskSchema>;


const CreateTaskForm = () => {

  const { control, handleSubmit, formState: { errors } } = useForm<TaskFormInputs>({
    resolver: yupResolver(TaskSchema),
  });

  const onSubmit: SubmitHandler<TaskFormInputs> = data => {
    console.log('Task Created:', data);
    // Code to store task in IndexedDB can be added here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
         <h1 className="text-2xl mb-4">Création de Tâches</h1>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nom de la tâche</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...field}
              />
            )}
          />
          {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description de la tâche</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...field}
              />
            )}
          />
          {errors.description && <p className="text-red-500 text-xs italic">{errors.description.message}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Date et heure de création</label>
          <Controller
            name="createdAt"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                showTimeSelect
                dateFormat="Pp"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            )}
          />
          {errors.createdAt && <p className="text-red-500 text-xs italic">{errors.createdAt.message}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Statut</label>
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
          {errors.status && <p className="text-red-500 text-xs italic">{errors.status.message}</p>}
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Créer la tâche
        </button>
    </form>
  );
    
}

export default CreateTaskForm