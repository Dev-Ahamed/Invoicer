import { Inter } from "next/font/google";
import "../styles/main.scss";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { InvoiceProvider } from "./context/InvoiceContext";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Invoice Generator",
  description: "Invoice Generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen`}>
        <AuthProvider>
          <InvoiceProvider>
            <NavBar />
            <div className="mt-16"></div>
            <Toaster position="top-center" reverseOrder={false} />
            {children}
            <Footer />
          </InvoiceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
