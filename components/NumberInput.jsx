import React, { memo } from "react";

const NumberInput = memo(
  ({
    type = "number",
    placeholder = "",
    className = "",
    name = "",
    value = "",
    onChange = () => {},
    min = "",
    max = "",
  }) => {
    return (
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className={`w-full border border-transparent hover:border-blue-500 rounded-md focus:border-blue-500 focus:outline-none py-1
        ${className ? className : ""}`}
      />
    );
  }
);

NumberInput.displayName = "NumberInput"; // Assigning displayName

export default NumberInput;
