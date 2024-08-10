import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aahameduumar125@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

const generateEmailHtml = (invoiceUrl) => `
  <div>
    <h1>Invoice</h1>
    <p>Your invoice is ready. You can view it <a href="${invoiceUrl}">here</a>.</p>
  </div>
`;

export async function POST(req) {
  try {
    const { email, invoiceUrl } = await req.json();
    console.log(email, invoiceUrl);

    const mailOptions = {
      from: `Invoicer <aahameduumar125@gmail.com>`,
      to: email,
      subject: "Invoice",
      html: generateEmailHtml(invoiceUrl),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return NextResponse.json({
      status: 200,
      message: info.response,
      email: email,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, error: `Error: ${error}` });
  }
}
