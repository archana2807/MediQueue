import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedBooksSection from "@/components/home/FeaturedBooksSection";
import BestSellersSection from "@/components/home/BestSellersSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CTASection from "@/components/home/CTASection";
import { categories } from "@/data/categories";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategorySection categories={categories} />
      <FeaturedBooksSection />
      <BestSellersSection />
      <TestimonialSection />
      <CTASection />
    </div>
  );
}