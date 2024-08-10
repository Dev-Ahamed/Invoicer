"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { FaCloudDownloadAlt, FaEdit } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoMdPrint, IoMdMail } from "react-icons/io";
import { FaCloudArrowUp } from "react-icons/fa6";
import FormPreview from "@/components/FormPreview";
import FormInput from "@/components/FormInput";
import CountrySelect from "@/components/CountrySelect";
import ItemTable from "@/components/ItemTable";
import InvoiceContext from "../context/InvoiceContext";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

const page = () => {
  const { data: session, status } = useSession();
  const [isPreview, setIsPreview] = useState(false);

  const { formData, setFormData, isSubmitted, setIsSubmitted } =
    useContext(InvoiceContext);

  const router = useRouter();

  useEffect(() => {
    setFormData({
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
    });
  }, []);

  const invoiceRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const generatePDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitted(true);
      console.log("Session: ", session);

      if (!session?.user) {
        router.push("/login");
      } else {
        const response = await fetch("/api/invoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userId: session?.user?.id,
          }),
        });

        const result = await response.json();

        if (result.status === 200) {
          setFormData({
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
                price: "100.00",
                tax: "10",
                taxAmount: "20.00",
                amount: "200.00",
              },
            ],
            totals: { totalTax: 0, totalAmount: 0, total: 0 },
            notes: "It was great doing business with you.",
            termsAndConditions: "Please make the payment by the due date.",
          });
          toast.success("Invoice Submitted");
          router.push("/invoices");
        } else if (result.status === 500) {
          toast.error("Not Submitted");
        }
        console.log("Result: ", result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitted(false);
    }
  };

  console.log(formData);

  return (
    <div className="bg-slate-50 py-10 px-10">
      {/* Buttons */}
      <div className="flex justify-between mb-10">
        <div className="flex gap-4">
          <button
            className="flex gap-2 items-center border px-2 py-1 hover:shadow-sm transition-all"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? (
              <>
                <FaEdit className="text-[20px]" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <MdOutlineRemoveRedEye className="text-[20px]" />
                <span>Preview</span>
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="flex gap-2 items-center border px-2 py-1 hover:shadow-sm transition-all"
          >
            <IoMdPrint className="text-[20px]" />
            <span>Print</span>
          </button>
          <button
            onClick={generatePDF}
            className="flex gap-2 items-center border px-2 py-1 hover:shadow-sm transition-all"
          >
            <FaCloudDownloadAlt className="text-[20px]" />
            <span>Download</span>
          </button>
        </div>
        <div className="flex gap-4">
          <Link
            href="/invoices"
            className="flex gap-2 items-center border px-2 py-1 hover:shadow-sm transition-all"
          >
            <FaCloudArrowUp className="text-[20px]" />
            <span>My invoices</span>
          </Link>
          <button className="flex gap-2 items-center border px-2 py-1 hover:shadow-sm transition-all">
            <IoMdMail className="text-[20px]" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Invoice Form */}
      {isPreview ? (
        <div ref={invoiceRef}>
          <FormPreview />
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 pt-10 pr-[33px] pl-[35px]"
            >
              {/* Image & Invoice Label */}
              <div className="flex justify-between">
                {/* Image Upload */}

                <div className="flex items-center justify-start gap-4 w-1/2">
                  {formData.logoUrl ? (
                    <CldImage
                      width="240"
                      height="240"
                      src={formData.logoUrl}
                      alt="Logo"
                    />
                  ) : (
                    <>
                      <div className="w-[40%]">
                        <CldUploadWidget
                          uploadPreset="InvoicePreset"
                          onSuccess={(result, { widget }) => {
                            setFormData((prev) => ({
                              ...prev,
                              logoUrl: result?.info.secure_url,
                            })); // { public_id, secure_url, etc }
                            console.log(result);
                            widget.close();
                          }}
                        >
                          {({ open }) => {
                            function handleOnClick() {
                              setFormData((prev) => ({ ...prev, logoUrl: "" }));
                              open();
                            }
                            return (
                              <button
                                type="button"
                                className="flex flex-col items-center justify-center w-full px-5 pt-5 pb-[15px] border-[1px] border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 dark:hover:bg-blue-800 dark:bg-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:hover:border-blue-500"
                                onClick={handleOnClick}
                              >
                                <FaCloudArrowUp className="w-8 h-5 text-gray-500 dark:text-gray-400" />
                                Upload
                              </button>
                            );
                          }}
                        </CldUploadWidget>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h2 className="font-semibold">Upload Logo</h2>
                        <div className="text-[10px] text-slate-500">
                          <p>240 x 240 pixels @ 72 DPI,</p>
                          <p>Maximum size of 1MB.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Invoice Label */}
                <div className="w-1/2">
                  <FormInput
                    placeholder="INVOICE"
                    className="text-5xl h-[50%] text-right"
                    name="invoice"
                    value={formData.invoice}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Company Details */}
              <div className="relative flex w-1/2 flex-col text-sm">
                <FormInput
                  placeholder="Your Company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
                <FormInput
                  placeholder="Your Name"
                  name="invoiceAuthor"
                  value={formData.invoiceAuthor}
                  onChange={handleInputChange}
                />
                <FormInput
                  placeholder="Company's Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                <FormInput
                  placeholder="City, State Zip"
                  name="cityStateZip"
                  value={formData.cityStateZip}
                  onChange={handleInputChange}
                />
                <CountrySelect
                  name="country"
                  onChange={handleInputChange}
                  value={formData.country}
                />
              </div>

              {/* Client Details */}
              <div className="flex text-sm gap-3">
                {/* Left Side */}
                <div className="w-1/2">
                  <h2 className="font-semibold text-[16px]">Bill To:</h2>
                  <FormInput
                    placeholder="Your Client's Company"
                    name="clientCompany"
                    value={formData.clientCompany}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    placeholder="Client's Address"
                    name="clientAddress"
                    value={formData.clientAddress}
                    onChange={handleInputChange}
                  />
                  <FormInput
                    placeholder="City, State Zip"
                    name="clientCityStateZip"
                    value={formData.clientCityStateZip}
                    onChange={handleInputChange}
                  />
                  <CountrySelect
                    name="clientCountry"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Right Side */}
                <div className="w-1/2">
                  <div className="flex items-center">
                    <h2 className="font-semibold text-[14px] w-1/2">
                      Invoice No
                    </h2>
                    {/* <FormInput placeholder="Invoice#" /> */}
                    <FormInput
                      name="invoiceNo"
                      value={formData.invoiceNo}
                      placeholder="INV-01"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex items-center">
                    <h2 className="font-semibold text-[14px] w-1/2">
                      Invoice Date
                    </h2>
                    {/* <FormInput placeholder="Invoice Date" /> */}
                    <FormInput
                      name="invoiceDate"
                      value={formData.invoiceDate}
                      type="date"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex items-center">
                    <h2 className="font-semibold text-[14px] w-1/2">
                      Due Date
                    </h2>
                    {/* <FormInput placeholder="Due Date" /> */}
                    <FormInput
                      name="dueDate"
                      value={formData.dueDate}
                      type="date"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Item Table */}
              <ItemTable />

              {/* Notes */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                  Notes
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full border border-transparent font-normal hover:border-blue-500 rounded-md focus:border-blue-500 focus:outline-none py-1 pr-3"
                  ></textarea>
                </label>
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                  Terms & Conditions
                  <textarea
                    name="termsAndConditions"
                    value={formData.termsAndConditions}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full border border-transparent font-normal hover:border-blue-500 rounded-md focus:border-blue-500 focus:outline-none py-1 pr-3"
                  ></textarea>
                </label>
              </div>

              {isSubmitted ? (
                <div
                  role="status"
                  className="flex justify-center items-center bg-violet-400 text-white px-4 py-2"
                >
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-violet-700"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="bg-violet-700 text-white px-4 py-2"
                >
                  Create Invoice
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
