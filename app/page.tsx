import {
  Nav, Hero, SocialProof, ProblemSection,
  Features, HowItWorks, CompetitorSection,
  Roadmap, Pricing, Testimonials, FinalCTA, Footer,
  WaitlistStrip,
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
        {/* <Roadmap /> */}
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}