import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sprout, ArrowRight, ShieldCheck, Truck, Clock } from "lucide-react";
import { ProductGrid } from "@/components/ProductGrid";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let categories: any[] = [];

  try {
    const rawProducts = await prisma.product.findMany({
      take: 8,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    featuredProducts = rawProducts.map((p) => ({
      ...p,
      price: Number(p.price),
    }));

    categories = await prisma.category.findMany({
      take: 6,
    });
  } catch (error) {
    console.error("Failed to load home page data:", error);
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-harvest-700 via-harvest-600 to-green-800 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="bg-white/10 text-harvest-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center">
              <Sprout className="w-3.5 h-3.5 mr-1" /> Direct from Farmers
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Fresh Farm Produce <br /> Delivered to Your Door
            </h1>
            <p className="text-harvest-100 text-base sm:text-lg max-w-lg">
              Order 100% organic vegetables, fruits, dairy, and wholesome grains harvested directly from local sustainable farms.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className="bg-white text-harvest-700 hover:bg-harvest-50 px-6 py-3 rounded-lg font-semibold shadow-md transition flex items-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
              alt="Fresh Organic Vegetables"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="bg-harvest-100 p-3 rounded-lg text-harvest-700">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
              <p className="text-xs text-gray-500 mt-1">
                Same-day and next-day delivery available for maximum freshness.
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="bg-harvest-100 p-3 rounded-lg text-harvest-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">100% Organic Quality</h3>
              <p className="text-xs text-gray-500 mt-1">
                Certified organic products directly sourced from vetted farms.
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-4">
            <div className="bg-harvest-100 p-3 rounded-lg text-harvest-700">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Always Fresh</h3>
              <p className="text-xs text-gray-500 mt-1">
                Harvested upon order to keep nutrients and taste intact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-sm text-gray-500">Explore produce by category</p>
            </div>
            <Link
              href="/products"
              className="text-harvest-600 hover:text-harvest-700 text-sm font-semibold flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="bg-white border border-gray-100 hover:border-harvest-500 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition group"
              >
                <div className="w-12 h-12 bg-harvest-50 group-hover:bg-harvest-100 rounded-full flex items-center justify-center mx-auto mb-2 text-harvest-700 font-bold">
                  {cat.name.charAt(0)}
                </div>
                <span className="font-medium text-sm text-gray-800 group-hover:text-harvest-600">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-sm text-gray-500">Handpicked fresh produce for you</p>
          </div>
          <Link
            href="/products"
            className="text-harvest-600 hover:text-harvest-700 text-sm font-semibold flex items-center space-x-1"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
      }
