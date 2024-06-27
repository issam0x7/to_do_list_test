import { globalStatusOptions } from "../contants/todoStatus";
import { TaskStatus } from "../types/task";
import CustomSelect from "./ui/select";



interface ISearchBarProps {
  setSearch: (search: string) => void;
  setSelectedStatus: (status: TaskStatus | "") => void;
}

const statusOptions = [
  { value: "", label: "Tous" },
 ...globalStatusOptions
];



const SearchBar = ({ setSearch, setSelectedStatus } : ISearchBarProps) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        className="shadow flex-grow-0 appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher"
      />
      <CustomSelect options={statusOptions}  onChange={(option ) => setSelectedStatus(option?.value as TaskStatus)} />
    </div>
  );
};

export default SearchBar;
