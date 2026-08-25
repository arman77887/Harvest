import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { checkoutSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    let orders;

    if (session.role === "ADMIN") {
      orders = await prisma.order.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      orders = await prisma.order.findMany({
        where: { userId: session.id },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("GET Orders Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in to place an order" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Validation error", errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { shippingAddress, phone, paymentMethod, items } = validation.data;

    // Atomic Transaction for Stock Verification & Order Creation
    const order = await prisma.$transaction(async (tx) => {
      let grandTotal = 0;
      const orderItemsToCreate = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for '${product.name}'. Requested: ${item.quantity}, Available: ${product.stock}`
          );
        }

        // Decrement product stock safely
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        const itemTotal = Number(product.price) * item.quantity;
        grandTotal += itemTotal;

        orderItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.id,
          total: grandTotal,
          shippingAddress,
          phone,
          paymentMethod,
          status: "PENDING",
          orderItems: {
            create: orderItemsToCreate,
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return createdOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("POST Order Error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to process order" },
      { status: 400 }
    );
  }
}
