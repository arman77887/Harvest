import React from "react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  let totalProducts = 0;
  let totalOrders = 0;
  let totalCustomers = 0;
  let totalRevenue = 0;
  let recentOrders: any[] = [];

  try {
    const [
      productsCount,
      ordersCount,
      customersCount,
      orders,
    ] = await Promise.all([
      prisma.product.count(),

      prisma.order.count(),

      prisma.user.count({
        where: {
          role: "CUSTOMER",
        },
      }),

      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      }),
    ]);

    totalProducts = productsCount;
    totalOrders = ordersCount;
    totalCustomers = customersCount;
    recentOrders = orders;

    // Order model-এ total field ব্যবহার করতে হবে
    const allOrders = await prisma.order.findMany({
      select: {
        total: true,
      },
    });

    totalRevenue = allOrders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );
  } catch (error) {
    console.error(
      "Failed to load admin dashboard stats:",
      error
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color:
        "text-green-600 bg-green-50 border-green-200",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color:
        "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color:
        "text-harvest-600 bg-harvest-50 border-harvest-200",
    },
    {
      title: "Customers",
      value: totalCustomers,
      icon: Users,
      color:
        "text-purple-600 bg-purple-50 border-purple-200",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Overview
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Monitor your store metrics, sales revenue,
          and recent activities.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <a
              key={index}
              href={card.title === "Customers" ? "/admin/customers" : "#"}
              className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between ${
                card.title === "Customers"
                  ? "hover:shadow-md hover:border-purple-200 transition cursor-pointer"
                  : ""
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </h3>
              </div>

              <div
                className={`p-3 rounded-xl border ${card.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </a>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-harvest-600" />
            <span>Recent Orders</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">
                  Order ID
                </th>

                <th className="px-6 py-3.5">
                  Customer
                </th>

                <th className="px-6 py-3.5">
                  Date
                </th>

                <th className="px-6 py-3.5">
                  Status
                </th>

                <th className="px-6 py-3.5 text-right">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-400 text-xs"
                  >
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition"
                  >
                    {/* Order ID */}
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      #{order.orderNumber}
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      {order.user?.name || "Customer"}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "CANCELLED"
                            ? "bg-red-100 text-red-700"
                            : order.status === "PROCESSING"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "SHIPPED"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-bold text-gray-900 text-right">
                      {formatCurrency(
                        Number(order.total)
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
