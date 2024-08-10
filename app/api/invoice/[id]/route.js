import db from "@/app/libs/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const invoice = await db.invoices.findUnique({
      where: {
        id: params.id,
      },
    });
    // console.log(invoice);

    return NextResponse.json({
      status: 200,
      invoice: invoice,
      message: "success",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Failed to load invoice",
    });
  }
}
