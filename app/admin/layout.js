import React from "react";
import HeaderNav from "@/app/components/layout/HeaderNav";
import AdminNav from "@/app/components/admin/AdminNav";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <HeaderNav />

      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-3.5 sm:px-6 2xl:px-8 flex flex-col gap-6">
        <AdminNav />
        {children}
      </div>
    </div>
  );
}

