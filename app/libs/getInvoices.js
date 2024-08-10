export async function getInvoices() {
  const res = await fetch("http://localhost:3000/api/invoice", {
    cache: "no-store",
  });

  const invoices = await res.json();
  return invoices;
}