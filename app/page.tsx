import HeroSection from '@/components/sections/HeroSection';
import FeaturesBar from '@/components/sections/FeaturesBar';
import CategoryGrid from '@/components/sections/CategoryGrid';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import PromoBanner from '@/components/sections/PromoBanner';
import FeaturedBrands from '@/components/sections/FeaturedBrands';
import BlogSection from '@/components/sections/BlogSection';
import NewsletterCTA from '@/components/sections/NewsletterCTA';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesBar />
      <CategoryGrid />
      <FeaturedBrands />
      <NewsletterCTA />
    </>
  );
}
