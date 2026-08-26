"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import {
  Loader2,
  ShoppingBag,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number | string;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  orderNumber?: string;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  phone: string;
  shippingAddress: string;
  city?: string;
  total: number | string;
  totalAmount?: number | string;
  status: string;
  paymentMethod: string;
  paymentNumber?: string | null;
  transactionId?: string | null;
  paymentStatus?: string;
  orderItems: OrderItem[];
}

const STATUS_OPTIONS = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setError("");

      const res = await fetch("/api/orders", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrder = async (
    orderId: string,
    data: { status?: string; paymentStatus?: string }
  ) => {
    setUpdatingId(orderId);
    setError("");

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.message || "Failed to update order"
        );
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                ...(data.status
                  ? { status: data.status }
                  : {}),
                ...(data.paymentStatus
                  ? { paymentStatus: data.paymentStatus }
                  : {}),
              }
            : order
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-harvest-600 mb-3" />
        Loading orders...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Order Management
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage customer orders, payments, and delivery status.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3" />
            No customer orders have been placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Order Status</th>
                  <th className="px-6 py-4">Payment Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 align-top"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-900">
                        #{order.orderNumber || order.id.slice(-8)}
                      </div>

                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="font-semibold text-gray-900">
                        {order.customerName ||
                          order.customerEmail ||
                          "Customer"}
                      </div>

                      {order.customerEmail && (
                        <div className="text-xs text-gray-400 mt-1">
                          {order.customerEmail}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mt-1">
                        {order.phone}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-xs">
                      {order.orderItems?.map((item) => (
                        <div
                          key={item.id}
                          className="mb-1 max-w-xs"
                        >
                          • {item.product?.name} × {item.quantity}
                        </div>
                      ))}
                    </td>

                    <td className="px-6 py-5 font-bold text-gray-900 whitespace-nowrap">
                      {formatCurrency(
                        Number(order.total ?? order.totalAmount ?? 0)
                      )}
                    </td>

                    <td className="px-6 py-5 min-w-[220px]">
                      <div className="font-bold text-gray-900">
                        {order.paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : order.paymentMethod}
                      </div>

                      {order.paymentNumber && (
                        <div className="text-xs text-gray-600 mt-2">
                          <span className="font-semibold">
                            Number:
                          </span>{" "}
                          {order.paymentNumber}
                        </div>
                      )}

                      {order.transactionId && (
                        <div className="text-xs text-gray-600 mt-1 break-all">
                          <span className="font-semibold">
                            TXN:
                          </span>{" "}
                          {order.transactionId}
                        </div>
                      )}

                      {order.paymentMethod !== "COD" && (
                        <div className="mt-2">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                              order.paymentStatus === "VERIFIED"
                                ? "bg-green-100 text-green-700"
                                : order.paymentStatus === "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            PAYMENT:{" "}
                            {order.paymentStatus || "PENDING"}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          updateOrder(order.id, {
                            status: e.target.value,
                          })
                        }
                        className="bg-gray-50 border border-gray-200 rounded-lg text-xs py-2 px-3 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-harvest-500 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-6 py-5">
                      {order.paymentMethod === "COD" ? (
                        <span className="text-xs text-gray-400">
                          No online verification
                        </span>
                      ) : (
                        <div className="flex flex-col gap-2 min-w-[130px]">
                          <button
                            type="button"
                            disabled={
                              updatingId === order.id ||
                              order.paymentStatus === "VERIFIED"
                            }
                            onClick={() =>
                              updateOrder(order.id, {
                                paymentStatus: "VERIFIED",
                              })
                            }
                            className="inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-lg disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Verify
                          </button>

                          <button
                            type="button"
                            disabled={
                              updatingId === order.id ||
                              order.paymentStatus === "REJECTED"
                            }
                            onClick={() =>
                              updateOrder(order.id, {
                                paymentStatus: "REJECTED",
                              })
                            }
                            className="inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
