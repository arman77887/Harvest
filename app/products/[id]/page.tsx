"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronRight,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  Loader2,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  imageUrl: string;
  category?: {
    name: string;
    slug: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const { addToCart, cart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!productId) return;
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-harvest-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-gray-500 mt-2">The product you are looking for does not exist.</p>
        <Link
          href="/products"
          className="mt-4 inline-block bg-harvest-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-harvest-700"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const numericPrice = Number(product.price);
  const cartItem = cart.find((item) => item.id === product.id);
  const currentInCart = cartItem ? cartItem.quantity : 0;
  const maxAvailable = product.stock - currentInCart;

  const handleAddToCart = () => {
    if (quantity <= maxAvailable && product.stock > 0) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: numericPrice,
          imageUrl: product.imageUrl,
          stock: product.stock,
        });
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-harvest-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-harvest-600">Products</Link>
        <ChevronRight className="w-3 h-3" />
        {product.category && (
          <>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-harvest-600">
              {product.category.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
        {/* Product Image */}
        <div className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            className="object-cover"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Meta */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {product.category && (
              <span className="text-xs font-semibold text-harvest-600 bg-harvest-50 px-3 py-1 rounded-full inline-block">
                {product.category.name}
              </span>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-extrabold text-gray-900">
                {formatCurrency(numericPrice)}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {product.stock > 0 ? `${product.stock} units in stock` : "Out of stock"}
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed pt-2 border-t border-gray-100">
              {product.description}
            </p>
          </div>

          {/* Action Area */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            {product.stock > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-l-lg"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-1 text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(maxAvailable, q + 1))}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-r-lg"
                      disabled={quantity >= maxAvailable}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={maxAvailable <= 0 || quantity > maxAvailable}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition ${
                    added
                      ? "bg-green-600 text-white"
                      : maxAvailable <= 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-harvest-600 hover:bg-harvest-700 text-white shadow-md active:scale-95"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
              >
                Currently Unavailable
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-harvest-600 flex-shrink-0" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-harvest-600 flex-shrink-0" />
                <span>Quality Assured</span>
              </div>
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-harvest-600 flex-shrink-0" />
                <span>Freshness Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
