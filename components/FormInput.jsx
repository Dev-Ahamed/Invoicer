import React from "react";

const FormInput = ({
  type = "text",
  placeholder = "",
  className = "",
  name = "",
  value = "",
  required,
  onChange = () => {},
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      required={required ? true : false}
      onChange={onChange}
      className={`w-full border border-transparent hover:border-blue-500 rounded-md focus:border-blue-500 focus:outline-none py-1 pr-3 pl-[3px]
        ${className ? className : ""}`}
    />
  );
};

export default FormInput;
