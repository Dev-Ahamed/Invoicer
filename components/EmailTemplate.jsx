import * as React from "react";

export const EmailTemplate = ({ invoiceUrl }) => {
  return (
    <div>
      <h1>
        Here is your latest purchase,{" "}
        <a href={invoiceUrl} className="underline text-blue-500">
          invoice
        </a>
      </h1>
    </div>
  );
};
