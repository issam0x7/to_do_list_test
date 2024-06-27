import React from "react";
import Select, { ActionMeta, SingleValue } from "react-select";

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  options: Option[];
  defaultValue?: Option;   
  onChange: (
    selectedOption: SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => void;
  placeholder?: string;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onChange,

  placeholder,
}) => {
  return (
    <Select
      options={options}
      onChange={onChange}
      //   value={value}
      placeholder={placeholder}
      styles={{
        control: (provided) => ({
          ...provided,
          backgroundColor: "#242424",
          color: "white",
          width: "120px",
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: "#242424",
          color: "white",
          border: "1px solid white",
        }),
        option: (provided) => ({
          ...provided,
          backgroundColor: "#242424",
          color: "white",
        }),
        placeholder: (provided) => ({
          ...provided,
          color: "white",
        }),
        input: (provided) => ({
          ...provided,
          color: "white",
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "white",
          }),
        
      }}
    />
  );
};

export default CustomSelect;
