"use client";
import InvoiceContext from "@/app/context/InvoiceContext";
import FormPreview from "@/components/FormPreview";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { FaCloudArrowUp } from "react-icons/fa6";
import { IoMdMail, IoMdPrint } from "react-icons/io";
import { useReactToPrint } from "react-to-print";

const page = ({ params }) => {
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const { formData, setFormData, isSubmitted, setIsSubmitted } =
    useContext(InvoiceContext);

  useEffect(() => {
    getInvoice();
  }, []);

  const getInvoice = async () => {
    try {
      setIsSubmitted(true);
      const res = await fetch(`/api/invoice/${params.id}`, {
        cache: "no-store",
      });

      const result = await res.json();

      const updatedInvoice = {
        ...result.invoice,
        invoiceDate: new Date(result.invoice.invoiceDate).toLocaleDateString(),
        dueDate: new Date(result.invoice.dueDate).toLocaleDateString(),
      };

      setFormData(updatedInvoice);
      console.log(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitted(false);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmail(value);
    // console.log(name, value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setSending(true);
      const invoiceUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/invoice/view/${params.id}`;

      const res = await fetch(`/api/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, invoiceUrl }),
      });

      const result = await res.json();
      console.log(result);

      if (result.status === 200) {
        setEmail("");
        setShowEmail(false);
        setSending(false);
        toast.success(`Invoice sent to ${result.email}`);
        console.log(result);
      }

      if (result.status === 500) {
        setSending(false);
        toast.error("Email not sent, try again!");
        console.log(result);
      }
    } catch (error) {
      toast.error("Oops something went wrong, try again!");
      setSending(false);
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-16">
      {isSubmitted ? (
        <div className="flex items-center justify-center h-[500px] rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-violet-600"
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
        </div>
      ) : (
        <>
          {/* Buttons */}
          <div className="flex justify-between mb-10">
            <div className="flex gap-4">
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
            <div className="flex gap-4 items-center">
              <div className="relative">
                <button
                  onClick={() => setShowEmail(!showEmail)}
                  className="flex gap-2 items-center border px-2 py-1 hover:shadow-sm transition-all"
                  disabled={sending ? true : false}
                >
                  <IoMdMail className="text-[20px]" />
                  <span>{sending ? "Sending..." : "Send"}</span>
                </button>

                {showEmail && (
                  <div
                    className={`w-[350px] rounded-lg shadow-md flex justify-center absolute bg-violet-700 px-4 py-2 right-[10%] bottom-[-10%] transform transition-all duration-1000 ease-in-out ${
                      showEmail
                        ? "translate-y-full max-h-[200px] opacity-100"
                        : "opacity-0 max-h-0 overflow-hidden"
                    }`}
                  >
                    <form
                      onSubmit={handleSubmit}
                      className="bottom-0 left-0 flex items-center gap-4"
                    >
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-slate-100"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 16"
                          >
                            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                            <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={email}
                          onChange={handleInputChange}
                          id="input-group-1"
                          className="bg-violet-700 border border-gray-300 text-slate-100 text-sm rounded-lg outline-none block w-full ps-10 p-2.5"
                          placeholder="smaple@email.com"
                        />
                      </div>

                      <button
                        type="submit"
                        className="flex gap-2 items-center border px-2 py-1 hover:shadow-sm transition-all text-slate-50"
                      >
                        <span>Send</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div ref={invoiceRef}>
            <FormPreview />
          </div>
        </>
      )}
    </div>
  );
};

export default page;
