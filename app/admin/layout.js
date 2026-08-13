import React from "react";
import HeaderNav from "@/app/components/layout/HeaderNav";
import AdminNav from "@/app/components/admin/AdminNav";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <HeaderNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
        {/* Admin Navigation Tabs */}
        <AdminNav />

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
