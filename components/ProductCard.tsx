"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number | string | any;
    stock: number;
    imageUrl: string;
    category?: {
      name: string;
      slug: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = useCart();
  const numericPrice = Number(product.price);
  
  const cartItem = cart.find((item) => item.id === product.id);
  const currentQtyInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;
  const isMaxInCart = currentQtyInCart >= product.stock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock && !isMaxInCart) {
      addToCart({
        id: product.id,
        name: product.name,
        price: numericPrice,
        imageUrl: product.imageUrl,
        stock: product.stock,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between group">
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition duration-300"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {product.category && (
            <span className="text-xs font-medium text-harvest-600 bg-harvest-50 px-2 py-0.5 rounded-full inline-block mb-2">
              {product.category.name}
            </span>
          )}
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 text-base line-clamp-1 group-hover:text-harvest-600 transition">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(numericPrice)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isMaxInCart}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isMaxInCart
                ? "bg-harvest-100 text-harvest-700 cursor-default"
                : "bg-harvest-600 text-white hover:bg-harvest-700 active:scale-95 shadow-sm"
            }`}
          >
            {isMaxInCart ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added ({currentQtyInCart})</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
