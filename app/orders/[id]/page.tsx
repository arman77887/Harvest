"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, Package, ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number | string;
  product: Product;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number | string;
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
  paymentNumber?: string | null;
  transactionId?: string | null;
  paymentStatus?: string;
  createdAt: string;
  orderItems: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          cache: "no-store",
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load order");
        }

        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-harvest-600 mb-3" />
          <p className="text-sm text-gray-500">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-red-800">
            Order Not Found
          </h1>

          <p className="text-sm text-red-600 mt-2">
            {error || "We could not find this order."}
          </p>

          <Link
            href="/account"
            className="inline-flex items-center gap-2 mt-6 bg-harvest-600 hover:bg-harvest-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to My Account
          </Link>
        </div>
      </div>
    );
  }

  const total = Number(order.total);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-500 mt-2">
          Thank you for your order. We&apos;ll start preparing it shortly.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">
              Order Number
            </p>

            <p className="text-lg font-bold text-gray-900 mt-1">
              #{order.orderNumber}
            </p>
          </div>

          <span className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold">
            <Package className="w-4 h-4" />
            {order.status}
          </span>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Order Items
          </h2>

          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.product.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="font-bold text-gray-900">
                  {formatCurrency(
                    Number(item.price) * item.quantity
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Delivery Information
              </h3>

              <p className="text-sm text-gray-600">
                {order.shippingAddress}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Phone: {order.phone}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Payment
              </h3>

              <p className="text-sm font-semibold text-gray-900">
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : order.paymentMethod}
              </p>

              {order.paymentNumber && (
                <p className="text-sm text-gray-600 mt-1">
                  Payment Number: {order.paymentNumber}
                </p>
              )}

              {order.transactionId && (
                <p className="text-sm text-gray-600 mt-1">
                  Transaction ID: {order.transactionId}
                </p>
              )}

              {order.paymentMethod !== "COD" && (
                <p className="text-sm mt-2">
                  Payment Status:{" "}
                  <span
                    className={
                      order.paymentStatus === "VERIFIED"
                        ? "font-bold text-green-600"
                        : order.paymentStatus === "REJECTED"
                        ? "font-bold text-red-600"
                        : "font-bold text-yellow-600"
                    }
                  >
                    {order.paymentStatus || "PENDING"}
                  </span>
                </p>
              )}

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-harvest-700">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col sm:flex-row gap-3 justify-center border-t border-gray-100">
          <Link
            href="/products"
            className="px-5 py-2.5 rounded-lg bg-harvest-600 hover:bg-harvest-700 text-white text-sm font-semibold text-center"
          >
            Continue Shopping
          </Link>

          <Link
            href="/account"
            className="px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold text-center"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
