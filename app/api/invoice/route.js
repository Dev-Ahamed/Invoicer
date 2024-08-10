import db from "@/app/libs/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.json();

    // Convert correct data type for store in db
    const formattedData = {
      ...formData,
      invoiceDate: new Date(formData.invoiceDate).toISOString(),
      dueDate: new Date(formData.dueDate).toISOString(),
      tableData: formData.tableData.map((item) => ({
        ...item,
        qty: parseInt(item.qty, 10),
        price: parseFloat(item.price),
        tax: parseFloat(item.tax),
        taxAmount: parseFloat(item.taxAmount),
        amount: parseFloat(item.amount),
      })),
      totals: {
        totalTax: parseFloat(formData.totals.totalTax),
        totalAmount: parseFloat(formData.totals.totalAmount),
        total: parseFloat(formData.totals.total),
      },
    };

    const invoice = await db.invoices.create({
      data: formattedData,
    });
    console.log(invoice);

    return NextResponse.json({
      status: 200,
      result: invoice,
      message: "Invoice Created",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, error: error });
  }
}

export async function GET(req) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  console.log(userId);

  try {
    const invoices = await db.invoices.findMany({
      where: { userId: userId },
      orderBy: { id: "desc" },
    });
    // console.log(invoices);

    return NextResponse.json({
      status: 200,
      invoices: invoices,
      message: "Invoices loaded successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Failed to load invoices",
      error: error,
    });
  }
}
