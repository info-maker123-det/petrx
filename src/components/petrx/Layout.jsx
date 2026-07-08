import React from "react";
import { Outlet } from "react-router-dom";
import FluidHeader from "./FluidHeader";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-porcelain flex flex-col">
      <FluidHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}