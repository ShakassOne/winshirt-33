import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RadialMenu from "@/components/layout/RadialMenu";

const MenuDemo = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center text-center p-6">
        <h1 className="text-3xl font-bold">Demo du menu radial</h1>
      </main>
      <Footer />
      <RadialMenu />
    </div>
  );
};

export default MenuDemo;
