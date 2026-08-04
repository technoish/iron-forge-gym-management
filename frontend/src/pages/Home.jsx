import Hero from '../components/home/Hero'
import Stats from '../components/home/Stats'
import WhyChooseUs from '../components/home/WhyChooseUs'
import FeaturedServices from '../components/home/FeaturedServices'
import MembershipPreview from '../components/home/MembershipPreview'
import TrainerPreview from '../components/home/TrainerPreview'
import Testimonials from '../components/home/Testimonials'
import Gallery from '../components/home/Gallery'
import FAQ from '../components/home/FAQ'
import CTA from '../components/home/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <WhyChooseUs />
      <FeaturedServices />
      <MembershipPreview />
      <TrainerPreview />
      <Testimonials />
      <Gallery />
      <FAQ />
      <CTA />
    </>
  )
}
