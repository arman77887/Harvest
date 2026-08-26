"use client";

import React, { useEffect, useState } from "react";
import {
  Loader2,
  Users,
  ShoppingBag,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    orders: number;
  };
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await fetch("/api/users", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to load customers"
          );
        }

        setCustomers(
          data.filter((user: Customer) => user.role === "CUSTOMER")
        );
      } catch (err: any) {
        setError(err.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-harvest-600 mb-3" />
        Loading customers...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-purple-600" />

          <h1 className="text-3xl font-bold text-gray-900">
            Customers
          </h1>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          View registered customers and their order history.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3" />
            No customers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <div className="font-semibold text-gray-900">
                        {customer.name}
                      </div>

                      <div className="text-xs text-gray-400 mt-1">
                        ID: {customer.id}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-gray-600">
                      {customer.email}
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {customer._count.orders}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-gray-500 text-xs">
                      {new Date(
                        customer.createdAt
                      ).toLocaleDateString()}
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
