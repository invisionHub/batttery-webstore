import { fetchProducts } from '@/features/products/actions/get-products';
import {
  HeroSection,
  FeaturesBar,
  CategoryGrid,
  FeaturedProducts,
  BatteryCalculator,
  BatteryGuideSection,
  TrustSection,
  NewsletterCTA,
} from '@/components/sections';

export default async function HomePage() {
  const { product: products } = await fetchProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesBar />
      <CategoryGrid />
      <FeaturedProducts products={products || []} />
      <BatteryCalculator />
      <BatteryGuideSection />
      <TrustSection />
      <NewsletterCTA />
    </div>
  );
}
