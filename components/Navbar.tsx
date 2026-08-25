"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, User, LogOut, Menu, X, Search, Sprout, LayoutDashboard } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic session state synchronization
    const checkUserSession = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.status === 401) {
          setUser(null);
        }
      } catch (err) {
        // Ignore fetch errors during layout render
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  if (pathname.startsWith("/admin")) {
    return null; // Admin views use AdminSidebar
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-harvest-700 font-bold text-xl">
            <Sprout className="w-7 h-7 text-harvest-600" />
            <span className="tracking-tight text-gray-900">Harvest<span className="text-harvest-600">Hub</span></span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fresh vegetables, fruits, grains..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-harvest-500 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
            </div>
          </form>

          {/* Navigation Links & Cart */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-harvest-600 transition">
              All Shop
            </Link>

            <Link href="/cart" className="relative text-gray-700 hover:text-harvest-600 transition p-2">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-harvest-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center text-sm font-medium text-harvest-700 bg-harvest-50 px-3 py-1.5 rounded-md hover:bg-harvest-100 transition"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-1.5" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/account"
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-harvest-600 transition"
                >
                  <User className="w-4 h-4 mr-1" />
                  Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-harvest-600 px-3 py-2 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-harvest-600 text-white px-4 py-2 rounded-lg hover:bg-harvest-700 transition shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Cart & Menu Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link href="/cart" className="relative text-gray-700 p-1">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-harvest-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-harvest-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
            </div>
          </form>

          <div className="space-y-2 pt-2">
            <Link
              href="/products"
              onClick={() => setIsMenuOpen(false)}
              className="block text-base font-medium text-gray-700 hover:text-harvest-600 py-1"
            >
              All Products
            </Link>
            <Link
              href="/account"
              onClick={() => setIsMenuOpen(false)}
              className="block text-base font-medium text-gray-700 hover:text-harvest-600 py-1"
            >
              My Account / Orders
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block text-base font-medium text-harvest-600 py-1"
            >
              Log In / Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
