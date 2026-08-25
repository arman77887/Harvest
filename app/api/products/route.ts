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

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { name, slug, description, price, stock, imageUrl, categoryId } = body;

    if (!name || !slug || price === undefined || stock === undefined || !imageUrl || !categoryId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || "",
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        imageUrl,
        categoryId,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
