import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "CRITICAL ERROR: JWT_SECRET environment variable is missing."
    );
  }

  return new TextEncoder().encode(secret);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          message: "Name must be at least 2 characters long",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already registered",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    const secret = getJwtSecret();

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    const response = NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        message:
          error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
