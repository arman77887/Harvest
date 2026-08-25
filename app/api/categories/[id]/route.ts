import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("CRITICAL ERROR: JWT_SECRET environment variable is missing.");
  }
  return new TextEncoder().encode(secret);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.userId as string;
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete category:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
