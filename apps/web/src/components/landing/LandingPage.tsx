import LandingNavbar from './LandingNavbar'
import HeroSection from './HeroSection'
import BentoFeatureGrid from './BentoFeatureGrid'
import StreamerShowcaseSection from './StreamerShowcaseSection'
import TemplateGallerySection from './TemplateGallerySection'
import ComparisonMatrixSection from './ComparisonMatrixSection'
import TestimonialsAndStatsSection from './TestimonialsAndStatsSection'
import LandingFooter from './LandingFooter'
import { useUiStore } from '../../store/useUiStore'

export default function LandingPage() {
  const theme = useUiStore((s) => s.theme)
  const pageBgClass = theme === 'dark' ? 'studio-grid-dark' : 'studio-grid-light'

  return (
    <div
      className={`min-h-screen ${pageBgClass} text-foreground flex flex-col font-sans antialiased selection:bg-rose-500/30 selection:text-rose-200 transition-colors duration-200 relative`}
    >
      {/* Sticky Frosted Header */}
      <LandingNavbar />

      {/* Main Landing Sections */}
      <main className="flex-1 w-full">
        <HeroSection />
        <BentoFeatureGrid />
        <StreamerShowcaseSection />
        <TemplateGallerySection />
        <ComparisonMatrixSection />
        <TestimonialsAndStatsSection />
      </main>

      {/* Landing Footer & Shortcuts */}
      <LandingFooter />
    </div>
  )
}
