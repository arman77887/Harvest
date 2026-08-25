import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { AdminSidebar } from "@/components/AdminSidebar";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("CRITICAL ERROR: JWT_SECRET environment variable is missing.");
  }
  return new TextEncoder().encode(secret);
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    
    if (payload.role !== "ADMIN") {
      redirect("/account");
    }
  } catch (error) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
