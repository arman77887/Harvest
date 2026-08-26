"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { User, ShoppingBag, LogOut, Loader2, ChevronRight, PackageCheck } from "lucide-react";

interface Order {
  id: string;
  createdAt: string;
  totalAmount: number | string;
  status: string;
  items: {
    id: string;
    quantity: number;
    price: number | string;
    product: {
      name: string;
    };
  }[];
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);

        const ordersRes = await fetch("/api/orders");
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-harvest-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-harvest-100 text-harvest-700 rounded-full flex items-center justify-center font-bold text-xl">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold flex items-center space-x-2 transition"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Logout</span>
        </button>
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-harvest-600" />
          <span>My Order History</span>
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-gray-100 text-center space-y-3">
            <PackageCheck className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
            <Link
              href="/products"
              className="inline-block bg-harvest-600 text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-harvest-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-gray-900 text-sm">
                      Order #{order.id.slice(-8)}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400 block">Total</span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(Number(order.totalAmount))}
                    </span>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="text-xs text-harvest-600 font-semibold hover:text-harvest-700 flex items-center space-x-1"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  }
      
