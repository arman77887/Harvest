import React from "react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ProductGrid } from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";

export const revalidate = 0;

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, search, sort } = searchParams;

  let whereClause: any = {};

  if (category) {
    whereClause.category = {
      slug: category,
    };
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderByClause: any = { createdAt: "desc" };
  if (sort === "price-asc") orderByClause = { price: "asc" };
  if (sort === "price-desc") orderByClause = { price: "desc" };

  let products: any[] = [];
  let categories: any[] = [];

  try {
    const [rawProducts, rawCategories] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: orderByClause,
        include: { category: true },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    products = rawProducts.map((p) => ({
      ...p,
      price: Number(p.price),
    }));

    categories = rawCategories;
  } catch (error) {
    console.error("Error fetching products catalog:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Farm Products</h1>
        <p className="text-gray-500 text-sm mt-1">
          Browse our fresh collection of organic crops, dairy, and fruits.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <form action="/products" method="GET" className="w-full md:w-96 relative">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="text"
            name="search"
            defaultValue={search || ""}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-harvest-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </form>

        <div className="w-full md:w-auto flex items-center justify-end space-x-3 text-xs">
          <span className="text-gray-500 font-medium">Sort by:</span>
          <a
            href={`/products?${new URLSearchParams({
              ...(category && { category }),
              ...(search && { search }),
              sort: "newest",
            }).toString()}`}
            className={`px-3 py-1.5 rounded-md font-medium ${
              !sort || sort === "newest"
                ? "bg-harvest-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Newest
          </a>
          <a
            href={`/products?${new URLSearchParams({
              ...(category && { category }),
              ...(search && { search }),
              sort: "price-asc",
            }).toString()}`}
            className={`px-3 py-1.5 rounded-md font-medium ${
              sort === "price-asc"
                ? "bg-harvest-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Price: Low to High
          </a>
          <a
            href={`/products?${new URLSearchParams({
              ...(category && { category }),
              ...(search && { search }),
              sort: "price-desc",
            }).toString()}`}
            className={`px-3 py-1.5 rounded-md font-medium ${
              sort === "price-desc"
                ? "bg-harvest-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Price: High to Low
          </a>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <CategoryBadge name="All Items" slug="" isActive={!category} />
        {categories.map((cat) => (
          <CategoryBadge
            key={cat.id}
            name={cat.name}
            slug={cat.slug}
            isActive={category === cat.slug}
          />
        ))}
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} />
    </div>
  );
}
