import { HeroSection } from '../components/home/HeroSection';
import { CollectionsSection } from '../components/home/CollectionsSection';
import { StormBanner } from '../components/home/StormBanner';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CollectionsSection />
      <StormBanner />
    </>
  );
}
