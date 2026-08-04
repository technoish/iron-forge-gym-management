import { FAQS } from '../../constants/data'
import SectionTitle from '../ui/SectionTitle'
import FAQAccordion from '../ui/FAQAccordion'

export default function FAQ() {
  return (
    <section className="py-24 sm:py-28">
      <div className="container-app grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
        <SectionTitle
          align="left"
          eyebrow="Questions"
          title="Everything you need to know before joining"
          description="Can't find what you're after? Our front desk team is at the gym every day we're open."
        />
        <FAQAccordion items={FAQS} />
      </div>
    </section>
  )
}
