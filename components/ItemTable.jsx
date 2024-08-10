import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AiOutlineCloseCircle, AiOutlinePlus } from "react-icons/ai";
import FormInput from "./FormInput";
import NumberInput from "./NumberInput";
import InvoiceContext from "@/app/context/InvoiceContext";

const ItemTable = (props) => {
  const { formData, setFormData } = useContext(InvoiceContext);

  useEffect(() => {
    const newTotals = totalTaxAndAmount();
    setFormData((prev) => ({ ...prev, totals: newTotals }));
  }, [formData.tableData, setFormData]);

  const addRow = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tableData: [
        ...prevFormData.tableData,
        {
          itemName: "",
          qty: "1",
          price: "1.00",
          tax: "0",
          taxAmount: "0.00",
          amount: "1.00",
        },
      ],
    }));
  };

  const removeRow = (index) => {
    const updatedTableData = formData.tableData;
    if (updatedTableData.length === 1) {
      return;
    }
    updatedTableData.splice(index, 1); // splice method used to add/remove elements from an array - the first parameter is which elements should be removed, 2nd is how many elements should be removed from 1st parameter
    setFormData((prev) => ({ ...prev, tableData: updatedTableData }));
    const newTotals = totalTaxAndAmount();
    setFormData((prev) => ({ ...prev, totals: newTotals }));
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;

    const updatedTableData = formData.tableData;
    updatedTableData[index][name] = value;

    if (updatedTableData[index].qty < 1 || updatedTableData[index].qty === "") {
      updatedTableData[index].qty = 1;
    }

    if (
      updatedTableData[index].price < 1 ||
      updatedTableData[index].price === ""
    ) {
      updatedTableData[index].price = 1.0;
    }

    if (updatedTableData[index].tax < 0 || updatedTableData[index].tax === "") {
      updatedTableData[index].tax = 0;
    }

    if (name === "qty" || name === "price") {
      const qty = parseFloat(updatedTableData[index].qty);
      const price = parseFloat(updatedTableData[index].price);
      updatedTableData[index].amount = (qty * price).toFixed(2);
    }

    setFormData((prev) => ({ ...prev, tableData: updatedTableData }));
    taxCalculation(index);
  };

  console.log(formData);

  const taxCalculation = (index) => {
    const taxAmount = (
      (formData.tableData[index].tax / 100) *
      formData.tableData[index].price *
      formData.tableData[index].qty
    ).toFixed(2);
    console.log(taxAmount);
    console.log(index);

    const updatedTableData = formData.tableData;
    updatedTableData[index].taxAmount = taxAmount;
    setFormData((prev) => ({ ...prev, tableData: updatedTableData }));
    const newTotals = totalTaxAndAmount();
    setFormData((prev) => ({ ...prev, totals: newTotals }));
  };

  const totalTaxAndAmount = () => {
    const totals = formData.tableData.reduce(
      (acc, item) => {
        const taxAmount = parseFloat(item.taxAmount) || 0;
        const amount = parseFloat(item.amount) || 0;

        acc.totalTax += taxAmount;
        acc.totalAmount += amount;
        acc.total = acc.totalTax + acc.totalAmount;

        return acc;
      },
      { totalTax: 0, totalAmount: 0, total: 0 }
    );

    totals.totalTax = totals.totalTax.toFixed(2);
    totals.totalAmount = totals.totalAmount.toFixed(2);
    totals.total = (
      parseFloat(totals.totalTax) + parseFloat(totals.totalAmount)
    ).toFixed(2);

    return totals;
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-6">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-sm text-gray-200 bg-gray-950 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 w-[40%]">
              Item Description
            </th>
            <th scope="col" className="px-6 py-3 text-right w-[17%]">
              Qty
            </th>
            <th scope="col" className="px-6 py-3 text-right w-[17%]">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-right w-[17%]">
              TAX
            </th>
            <th scope="col" className="px-6 py-3 text-right w-[17%]">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 w-[1%]">
              Delete
            </th>
          </tr>
        </thead>
        <tbody className="text-black">
          {formData.tableData.map((row, index) => {
            return (
              <tr
                key={index}
                className="group relative odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b-2 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white w-[40%]"
                >
                  <textarea
                    required
                    rows="2"
                    name="itemName"
                    value={row.itemName}
                    placeholder="Item name/description"
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full border border-transparent hover:border-blue-500 rounded-md focus:border-blue-500 focus:outline-none py-1 pr-3 pl-[3px]"
                  ></textarea>
                </th>
                <td className="px-2 py-4 align-top w-[17%]">
                  <NumberInput
                    name="qty"
                    min={1}
                    value={row.qty}
                    onChange={(e) => handleInputChange(index, e)}
                    className="text-right"
                  />
                </td>
                <td className="px-2 py-4 align-top w-[17%]">
                  <NumberInput
                    name="price"
                    min={1}
                    value={row.price}
                    onChange={(e) => handleInputChange(index, e)}
                    className="text-right"
                  />
                </td>
                <td className="px-2 py-4 align-top w-[17%]">
                  <div className="flex flex-col justify-center">
                    <NumberInput
                      value={row.tax}
                      onChange={(e) => handleInputChange(index, e)}
                      name="tax"
                      min={0}
                      className="text-right px-0"
                    />
                    <p className="text-right">{row.taxAmount}</p>
                  </div>
                </td>
                <td className="px-2 py-4 align-top text-center w-[17%]">
                  {row.amount}
                </td>
                <td className="absolute px-6 py-4 align-top w-[1%]">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="hidden group-hover:block"
                  >
                    <AiOutlineCloseCircle className="text-red-600 text-xl" />
                  </button>
                </td>
              </tr>
            );
          })}
          {/* Add Item Btn and Total Details Row */}
          <tr>
            <td className="py-2 px-4 align-top" colSpan="2">
              {/* Add Item Btn */}
              <button
                type="button"
                onClick={addRow}
                className="flex gap-2 items-center"
              >
                <AiOutlinePlus className="bg-blue-500 rounded-full text-white w-4 h-4 p-[2px] text-lg" />
                <span className="text-blue-500">Add New Item</span>
              </button>
            </td>
            {/* Total Details */}
            <td className="text-right">Sub Total</td>
            {/* Total Tax */}
            <td className="text-right">{formData.totals.totalTax}</td>
            {/* Total Amount */}
            <td className="text-center">{formData.totals.totalAmount}</td>
          </tr>
          <tr>
            <td colSpan="2"></td>
            <td className="text-right font-extrabold text-[16px]">Total</td>
            <td></td>
            <td className="text-center font-extrabold text-[16px]">
              {formData.totals.total}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default memo(ItemTable);
