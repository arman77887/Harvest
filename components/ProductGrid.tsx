"use client";

import React from "react";
import { ProductCard, ProductCardProps } from "@/components/ProductCard";
import { PackageSearch } from "lucide-react";

interface ProductGridProps {
  products: ProductCardProps["product"][];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200 p-8 my-6">
        <PackageSearch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-800">No products found</h3>
        <p className="text-sm text-gray-500 mt-1">
          Try adjusting your search filters or browse other categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
