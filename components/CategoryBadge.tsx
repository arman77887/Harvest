import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  name: string;
  slug: string;
  isActive?: boolean;
}

export function CategoryBadge({ name, slug, isActive = false }: CategoryBadgeProps) {
  return (
    <Link
      href={slug ? `/products?category=${slug}` : "/products"}
      className={cn(
        "px-4 py-2 rounded-full text-xs font-medium transition flex-shrink-0 border",
        isActive
          ? "bg-harvest-600 text-white border-harvest-600 shadow-sm"
          : "bg-white text-gray-700 border-gray-200 hover:border-harvest-500 hover:text-harvest-600"
      )}
    >
      {name}
    </Link>
  );
}
