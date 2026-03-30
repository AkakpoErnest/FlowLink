import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import SecuritySection from '@/components/home/SecuritySection'
import CtaSection from '@/components/home/CtaSection'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SecuritySection />
      <CtaSection />
      <Footer />
    </div>
  )
}
