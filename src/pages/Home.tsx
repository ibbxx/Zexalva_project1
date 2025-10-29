import Hero from '@/components/zexalva/Hero';
import ProductShowcase from '@/components/zexalva/ProductShowcase';
import BrandBillboard from '@/components/zexalva/BrandBillboard';
import CTABanner from '@/components/zexalva/CTABanner';

export default function Home() {
  return (
    <div>
      <Hero />
      <ProductShowcase />
      <BrandBillboard />
      <CTABanner />
    </div>
  );
}
