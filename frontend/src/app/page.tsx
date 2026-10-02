import HeroSection from '@/components/home/HeroSection';
import ValuePropositions from '@/components/home/ValuePropositions';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanner from '@/components/home/PromoBanner';

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 w-full overflow-hidden">
      {/* 1. Hero Section Banner with Brand Identity & CTAs */}
      <HeroSection />

      {/* 2. Value Propositions & USP Pillars (100% Cotton, Fast Shipping, Size Return Guarantee) */}
      <ValuePropositions />

      {/* 3. Featured Collections (Oversized Tees, Hoodies, Pants, Accessories) */}
      <FeaturedCollections />

      {/* 4. Featured Products (Dynamic / Fallback Showcase) */}
      <FeaturedProducts />

      {/* 5. Limited Drop Promo / Lookbook Callout */}
      <PromoBanner />
    </div>
  );
}
