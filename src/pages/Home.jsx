import React from "react";
import HeroSection from "@/components/petrx/HeroSection";
import TrustBar from "@/components/petrx/TrustBar";
import ShopByPet from "@/components/petrx/ShopByPet";
import FeaturedProducts from "@/components/petrx/FeaturedProducts";
import AutoShipSection from "@/components/petrx/AutoShipSection";
import HowItWorks from "@/components/petrx/HowItWorks";
import WhyPetRx from "@/components/petrx/WhyPetRx";

export default function Home() {
  return (
    <div className="min-h-screen bg-porcelain">
      <HeroSection />
      <TrustBar />
      <ShopByPet />
      <FeaturedProducts />
      <AutoShipSection />
      <HowItWorks />
      <WhyPetRx />
    </div>
  );
}