import React, { useState } from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { SEO } from '../components/SEO';
import { ChevronDown, HelpCircle, Phone } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

interface FAQItem {
  question: string;
  answer: string;
  ownerComment: string;
}

export const FAQ: React.FC = () => {
  const { contact } = useStoreSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "Which areas do you deliver to in Mira Road and beyond?",
      // TODO(owner): confirm delivery radius and pin codes
      answer: "We provide home delivery across Shantipark and most areas of Mira Road (East and West). For deliveries in Bhayandar or nearby suburbs, please connect with us directly on WhatsApp to confirm delivery partner availability.",
      ownerComment: "// TODO(owner): confirm delivery radius and pin codes",
    },
    {
      question: "Is there any minimum order requirement for home delivery?",
      // TODO(owner): confirm minimum order value for free delivery
      answer: "There is no minimum order amount for store pickups! For home delivery in Mira Road, we generally recommend a minimum order of ₹300, or a nominal delivery fee may apply depending on your exact distance.",
      ownerComment: "// TODO(owner): confirm minimum order value for free delivery",
    },
    {
      question: "What payment methods do you accept?",
      // TODO(owner): confirm accepted payment modes (UPI, Cash, Cards)
      answer: "We accept all UPI applications (Google Pay, PhonePe, Paytm), cash on pickup/delivery, and standard payment links shared directly in your WhatsApp order chat.",
      ownerComment: "// TODO(owner): confirm accepted payment modes (UPI, Cash, Cards)",
    },
    {
      question: "How fresh are your farsan, namkeen, and wafers?",
      // TODO(owner): confirm frying and shelf-life schedule
      answer: "All our items are prepared fresh in-house on a daily basis without artificial preservatives. Most farsan items stay crisp for 3 to 4 weeks when stored in an airtight dry container.",
      ownerComment: "// TODO(owner): confirm frying and shelf-life schedule",
    },
    {
      question: "Do you take bulk orders for festivals, weddings, and society events?",
      // TODO(owner): confirm bulk discount slabs and lead time
      answer: "Yes! We specialize in bulk packaging for Diwali, Holi, Raksha Bandhan, wedding welcome kits, and corporate gifting. Please give us at least 24 to 48 hours notice for customized bulk quantities.",
      ownerComment: "// TODO(owner): confirm bulk discount slabs and lead time",
    },
    {
      question: "What are your shop operational timings?",
      // TODO(owner): confirm special holiday hours
      answer: "Our shop at Shop No 15, Shantipark, Mira Road is open daily from 10:00 AM to 10:00 PM, 365 days a year, including Sundays and public holidays.",
      ownerComment: "// TODO(owner): confirm special holiday hours",
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <SEO
        title="Frequently Asked Questions (FAQ) - Ashapura Farsan"
        description="Find answers to common questions about ordering, delivery areas in Mira Road, freshness, payment methods, and bulk festival orders at Ashapura Farsan."
      />

      <div className="bg-cream-50 min-h-screen py-10 sm:py-16">
        <div className="container-custom max-w-3xl">
          <SectionHeading
            eyebrow="HELP & INFORMATION"
            titleRegular="Frequently Asked"
            titleItalic="Questions"
            subtitle="Everything you need to know about placing orders, freshness, store pickup, and delivery."
          />

          {/* Accordion container */}
          <div className="space-y-3 mt-6">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-line rounded-card shadow-card overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:bg-cream-100 transition-colors"
                  >
                    <span className="font-serif font-semibold text-brown-900 text-sm sm:text-base">
                      {faq.question}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full bg-peach-halo flex items-center justify-center text-brown-900 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-orange-600 bg-orange-500/10' : ''
                      }`}
                    >
                      <ChevronDown size={16} strokeWidth={2} />
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${index}`}
                      className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-brown-700 leading-relaxed border-t border-line/40"
                    >
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Box for more questions */}
          <div className="bg-cream-100 border border-line rounded-card p-6 mt-10 text-center space-y-3">
            <HelpCircle size={28} className="text-orange-600 mx-auto" />
            <h3 className="font-serif font-semibold text-brown-900 text-base">
              Have another question?
            </h3>
            <p className="text-xs text-brown-700 max-w-md mx-auto">
              Feel free to call us or drop a quick WhatsApp message. Our shop counter staff will be glad to assist you.
            </p>
            <div className="pt-2">
              <a
                href={`tel:${contact.phone_primary_raw}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta transition-colors"
              >
                <Phone size={14} />
                <span>Call {contact.phone_primary}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FAQ;
