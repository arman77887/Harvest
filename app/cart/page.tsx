"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 5.99) : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-harvest-50 rounded-full flex items-center justify-center mx-auto text-harvest-600">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Looks like you haven't added any fresh produce to your cart yet. Explore our fresh harvest catalog!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-harvest-600 hover:bg-harvest-700 text-white font-semibold px-6 py-3 rounded-lg text-sm transition shadow-sm"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-sm text-gray-500 mt-1">
            You have {cart.reduce((sum, item) => sum + item.quantity, 0)} items in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.id}`} className="font-semibold text-gray-900 hover:text-harvest-600 text-base truncate block">
                  {item.name}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatCurrency(Number(item.price))} each
                </p>
                <div className="text-sm font-bold text-gray-900 mt-2 sm:hidden">
                  Total: {formatCurrency(Number(item.price) * item.quantity)}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-l-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-r-lg disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="hidden sm:block text-right w-24">
                  <span className="text-sm font-bold text-gray-900 block">
                    {formatCurrency(Number(item.price) * item.quantity)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 transition p-1"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 text-harvest-600 hover:text-harvest-700 text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-gray-900">
                {shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : formatCurrency(shipping)}
              </span>
            </div>
            {subtotal < 50 && subtotal > 0 && (
              <p className="text-xs text-harvest-600 bg-harvest-50 p-2.5 rounded-lg border border-harvest-100">
                Add {formatCurrency(50 - subtotal)} more to qualify for FREE shipping!
              </p>
            )}
            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-harvest-600 hover:bg-harvest-700 text-white font-semibold py-3 px-4 rounded-xl text-center block text-sm transition shadow-md"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
