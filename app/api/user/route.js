import db from "@/app/libs/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // check if user already exists
    const userExist = await db.user.findUnique({
      where: { email },
    });

    if (userExist) {
      return NextResponse.json({
        message: "This email already registered!",
        user: null,
        status: 409,
      });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: { name, email, password: hashedPassword },
    });

    console.log(newUser);
    return NextResponse.json({
      status: 200,
      message: "Registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500, error: error });
  }
}
