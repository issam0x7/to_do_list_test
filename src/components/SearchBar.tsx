import ReactSelect from "react-select"





const SearchBar = () => {
  return (
    <div className="">
        <input type="text" placeholder="Rechercher" />
        <ReactSelect options={[]} />
    </div>
  )
}

export default SearchBar