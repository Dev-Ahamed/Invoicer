import InvoiceContext from "@/app/context/InvoiceContext";
import React, { useContext } from "react";
import { CldUploadButton, CldImage } from "next-cloudinary";

const FormPreview = () => {
  const { formData } = useContext(InvoiceContext);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      {/* Logo and Inoice Label */}
      <div className="flex justify-between">
        <div className="w-[240px] h-[240px]">
          {formData.logoUrl && (
            <CldImage
              width="240"
              height="240"
              src={formData.logoUrl}
              alt="Logo"
            />
          )}
        </div>
        <div>
          <p className="text-5xl">{formData.invoice}</p>
          <p className="text-sm text-right font-semibold">
            Invoice# {formData.invoiceNo}
          </p>
        </div>
      </div>

      {/* Company Details */}
      <div>
        <p className="font-extrabold">{formData.company}</p>
        <p>{formData.invoiceAuthor}</p>
        <p>{formData.address}</p>
        <p>{formData.cityStateZip}</p>
        <p>{formData.country}</p>
      </div>

      {/* Client Details */}
      <div className="flex justify-between pt-5">
        {/* Left Side */}
        <div className="">
          <p
            className={`${
              formData.clientCompany ? "block font-light" : "hidden"
            }`}
          >
            Bill To:
          </p>
          <p className="font-extrabold">{formData.clientCompany}</p>
          <p>{formData.clientAddress}</p>
          <p>{formData.clientCityStateZip}</p>
          <p>{formData.clientCountry}</p>
        </div>
        {/* Right Side */}
        <div className="flex gap-10 items-end">
          <div className="text-right flex flex-col gap-2 justify-center items-center text-sm">
            <p className={`${formData.invoiceDate ? "block" : "hidden"}`}>
              Invoice Date:
            </p>
            <p className={`${formData.dueDate ? "block" : "hidden"}`}>
              Due Date:
            </p>
          </div>
          <div className="text-right flex flex-col justify-center items-center gap-2 font-semibold">
            <p className={`${formData.invoiceDate ? "block" : "hidden"}`}>
              {formData.invoiceDate}
            </p>
            <p className={`${formData.dueDate ? "block" : "hidden"}`}>
              {formData.dueDate}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="px-3 py-2 bg-slate-950 text-slate-200">
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Item Description</th>
              <th className="px-3 py-2 text-right">Qty</th>
              <th className="px-3 py-2 text-right">Price</th>
              <th className="px-3 py-2 text-right">TAX</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {formData.tableData.map((item, index) => {
              if (item.itemName === "") {
                return;
              }
              return (
                <tr
                  key={index}
                  className="px-3 py-2 text-slate-950 border-b-2 border-slate-950 align-top"
                >
                  <td className="px-3 py-2 text-left">{index + 1}</td>
                  <td className="px-3 py-2 text-left">{item.itemName}</td>
                  <td className="px-3 py-2 text-right">{item.qty}</td>
                  <td className="px-3 py-2 text-right">{item.price}.00</td>
                  <td className="px-3 py-2 text-right">
                    <p>{item.taxAmount}.00</p>
                    <p className="text-slate-400">{item.tax}%</p>
                  </td>
                  <td className="px-3 py-2 text-right">{item.amount}.00</td>
                </tr>
              );
            })}

            {/* Total details */}
            <tr>
              <td colSpan="3"></td>
              <td className="px-3 py-2 text-right">Sub total</td>
              <td className="px-3 py-2 text-right">
                {formData.totals.totalTax}.00
              </td>
              <td className="px-3 py-2 text-right">
                {formData.totals.totalAmount}.00
              </td>
            </tr>
            <tr>
              <td colSpan="3"></td>
              <td className="px-3 py-2 text-right font-extrabold">Total</td>
              <td colSpan="2" className="px-3 py-2 text-right font-extrabold">
                {formData.totals.total}.00
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notes and Terms & Conditions */}
      {formData.notes && (
        <div className="mb-5">
          <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
            Notes
          </p>
          <p className="font-normal text-sm py-1 pr-3">{formData.notes}</p>
        </div>
      )}

      {formData.termsAndConditions && (
        <div>
          <p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
            Terms & Conditions
          </p>
          <p className="font-normal text-sm py-1 pr-3">
            {formData.termsAndConditions}
          </p>
        </div>
      )}
    </div>
  );
};

export default FormPreview;
