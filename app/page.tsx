import {
  Nav, Hero, SocialProof, ProblemSection,
  Features, HowItWorks, CompetitorSection,
  Pricing, Testimonials, FinalCTA, Footer,
  WaitlistStrip, BackToTop,
} from '@/components/landing'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WaitlistStrip />
        <SocialProof />
        <ProblemSection />
        <Features />
        <HowItWorks />
        <CompetitorSection />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}