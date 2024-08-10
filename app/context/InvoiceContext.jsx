"use client";
import React, { createContext, useState } from "react";

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    invoice: "INVOICE",
    logoUrl: "",
    company: "",
    invoiceAuthor: "",
    address: "",
    cityStateZip: "",
    country: "Sri Lanka",
    clientCompany: "",
    clientAddress: "",
    clientCityStateZip: "",
    clientCountry: "Sri Lanka",
    invoiceNo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    tableData: [
      {
        itemName: "item1",
        qty: "2",
        price: "100",
        tax: "10",
        taxAmount: "20",
        amount: "200",
      },
    ],
    totals: { totalTax: 0, totalAmount: 0, total: 0 },
    notes: "It was great doing business with you.",
    termsAndConditions: "Please make the payment by the due date.",
    userId: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const ContextValue = {
    formData,
    setFormData,
    isSubmitted,
    setIsSubmitted,
  };

  return (
    <InvoiceContext.Provider value={ContextValue}>
      {children}
    </InvoiceContext.Provider>
  );
};

export default InvoiceContext;
