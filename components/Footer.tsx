import React from "react";
import Link from "next/link";
import { Sprout, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-xl">
              <Sprout className="w-7 h-7 text-harvest-500" />
              <span>Harvest<span className="text-harvest-500">Hub</span></span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your direct connection to fresh, organic agricultural produce delivered directly from verified local farms to your home.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Quick Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-harvest-400 transition">All Products</Link>
              </li>
              <li>
                <Link href="/products?category=fresh-vegetables" className="hover:text-harvest-400 transition">Vegetables</Link>
              </li>
              <li>
                <Link href="/products?category=organic-fruits" className="hover:text-harvest-400 transition">Organic Fruits</Link>
              </li>
              <li>
                <Link href="/products?category=grains-pulses" className="hover:text-harvest-400 transition">Grains & Pulses</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/account" className="hover:text-harvest-400 transition">My Account</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-harvest-400 transition">Shopping Cart</Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-harvest-400 transition">Checkout</Link>
              </li>
              <li>
                <span className="text-gray-400">Cash on Delivery Available</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Contact Harvest</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-harvest-500 flex-shrink-0" />
                <span>123 Farm Agriculture Way, Green Valley</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-harvest-500 flex-shrink-0" />
                <span>+1 (800) 555-HARVEST</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-harvest-500 flex-shrink-0" />
                <span>support@harvest.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} All-in-One Harvest Hub Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
