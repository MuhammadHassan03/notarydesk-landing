import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import SocialProof from '@/components/SocialProof'
import ProblemSection from '@/components/ProblemSection'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import CompetitorSection from '@/components/CompetitorSection'
import Roadmap from '@/components/Roadmap'
import Pricing from '@/components/Pricing'
import Testimonials from '@/components/Testimonials'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SocialProof />
        <ProblemSection />
        <Features />
        <HowItWorks />
        <CompetitorSection />
        <Roadmap />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
