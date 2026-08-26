"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { ShieldCheck, Loader2, ArrowLeft, Copy, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PAYMENT_METHODS } from "@/lib/payment-methods";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    shippingAddress: "",
    city: "",
    phone: "",
    paymentMethod: "BKASH",
    paymentNumber: "",
    transactionId: "",
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mt-2">Add items to cart before proceeding to checkout.</p>
        <Link
          href="/products"
          className="mt-4 inline-block bg-harvest-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-harvest-700"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const selectedPayment =
        formData.paymentMethod === "BKASH" ||
        formData.paymentMethod === "NAGAD" ||
        formData.paymentMethod === "ROCKET"
          ? PAYMENT_METHODS[formData.paymentMethod]
          : null;

      const payload = {
        ...formData,
        paymentNumber: selectedPayment?.number || "",
        transactionId: formData.transactionId.trim(),
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: total,
      };

      if (
        formData.paymentMethod !== "COD" &&
        (!formData.paymentNumber || !formData.transactionId)
      ) {
        throw new Error(
          "Please provide the payment number and transaction ID."
        );
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create order");
      }

      const order = await res.json();
      clearCart();
      router.push(`/orders/${order.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/cart" className="p-2 text-gray-500 hover:text-gray-700 bg-white rounded-lg border border-gray-200">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500 mt-0.5">Complete your order details below</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-harvest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  required
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-harvest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 555-019-2834"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-harvest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  City / Region *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Harvest Valley"
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-harvest-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="shippingAddress"
                required
                value={formData.shippingAddress}
                onChange={handleChange}
                placeholder="123 Farm Street, Apt 4B"
                className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-harvest-500"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["COD", "Cash on Delivery"],
                ["BKASH", "bKash"],
                ["NAGAD", "Nagad"],
                ["ROCKET", "Rocket"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${
                    formData.paymentMethod === value
                      ? "border-harvest-500 bg-harvest-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={formData.paymentMethod === value}
                    onChange={handleChange}
                    className="text-harvest-600 focus:ring-harvest-500"
                  />

                  <span className="text-sm font-semibold text-gray-900">
                    {label}
                  </span>
                </label>
              ))}
            </div>

            {formData.paymentMethod !== "COD" && (
              <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Send Payment
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Send the exact order amount to the number below.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500">
                    Payment Number
                  </p>

                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {formData.paymentMethod === "BKASH" &&
                      "01XXXXXXXXX"}

                    {formData.paymentMethod === "NAGAD" &&
                      "01XXXXXXXXX"}

                    {formData.paymentMethod === "ROCKET" &&
                      "01XXXXXXXXX"}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Method: {formData.paymentMethod}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Payment Number *
                  </label>

                  <input
                    type="tel"
                    name="paymentNumber"
                    required
                    value={formData.paymentNumber}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-harvest-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Transaction ID *
                  </label>

                  <input
                    type="text"
                    name="transactionId"
                    required
                    value={formData.transactionId}
                    onChange={handleChange}
                    placeholder="Enter transaction ID"
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-harvest-500"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
                  After sending payment, enter your payment number and
                  transaction ID above. Your payment will remain
                  <strong> PENDING </strong>
                  until an admin verifies it.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary & Confirm */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
            Items ({cart.length})
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <div className="truncate pr-2">
                  <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-gray-400">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-gray-900 flex-shrink-0">
                  {formatCurrency(Number(item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900">
                {shipping === 0 ? "FREE" : formatCurrency(shipping)}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-bold text-gray-900">
              <span>Total Amount</span>
              <span className="text-harvest-700">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-harvest-600 hover:bg-harvest-700 text-white font-semibold py-3 px-4 rounded-xl text-center block text-sm transition shadow-md disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Placing Order...</span>
              </span>
            ) : (
              "Place Order"
            )}
          </button>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-harvest-600" />
            <span>100% Guaranteed Fresh Delivery</span>
          </div>
        </div>
      </form>
    </div>
  );
}
