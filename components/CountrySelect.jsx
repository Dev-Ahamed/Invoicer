import React from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

const CountrySelect = ({ name, value, onChange }) => {
  const options = countryList().getData();

  return (
    <>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border border-transparent hover:border-blue-500 rounded-md focus:border-blue-500 focus:outline-none py-1 pr-3 pl-[3px]`}
      >
        <option value="Select a country" disabled>
          Select a country
        </option>
        {options.map((country) => (
          <option key={country.value} value={country.label}>
            {country.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default CountrySelect;
