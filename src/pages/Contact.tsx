import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { SEO } from '../components/SEO';
import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { WhatsAppIcon } from '../components/Icons';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const Contact: React.FC = () => {
  const { contact } = useStoreSettings();

  return (
    <>
      <SEO
        title="Contact Us & Store Location - Ashapura Farsan"
        description={`Visit Ashapura Farsan at ${contact.address}. Call or WhatsApp ${contact.phone_primary}. Open daily ${contact.hours}.`}
      />

      <div className="bg-cream-50 min-h-screen py-10 sm:py-16">
        <div className="container-custom max-w-4xl">
          <SectionHeading
            eyebrow="GET IN TOUCH"
            titleRegular="Store Location &"
            titleItalic="Contact"
            subtitle="Drop by our counter in Shantipark or reach out directly for delivery and bulk festival inquiries."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* Left Card: Store Details */}
            <div className="bg-white border border-line rounded-card p-6 sm:p-8 shadow-card space-y-6">
              <h3 className="font-serif font-semibold text-brown-900 text-lg border-b border-line pb-3">
                Shop Details
              </h3>

              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-peach-halo text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brown-900 uppercase tracking-wider">
                    Our Location
                  </h4>
                  <p className="text-sm text-brown-700 mt-0.5">
                    {contact.full_address}
                  </p>
                  <a
                    href={contact.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:underline mt-2"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Telephones */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-peach-halo text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brown-900 uppercase tracking-wider">
                    Call Us (Tap to Call)
                  </h4>
                  <div className="flex flex-col gap-1 text-sm text-brown-700 mt-1">
                    <a
                      href={`tel:${contact.phone_primary_raw}`}
                      className="hover:text-orange-600 font-semibold transition-colors"
                    >
                      {contact.phone_primary} (Primary)
                    </a>
                    {contact.phone_secondary && contact.phone_secondary_raw && (
                      <a
                        href={`tel:${contact.phone_secondary_raw}`}
                        className="hover:text-orange-600 font-semibold transition-colors"
                      >
                        {contact.phone_secondary} (Alternate)
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-peach-halo text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brown-900 uppercase tracking-wider">
                    Business Hours
                  </h4>
                  <p className="text-sm text-brown-700 mt-0.5 font-medium">
                    {contact.hours}
                  </p>
                  <p className="text-xs text-brown-500">
                    Open 7 days a week, including all public holidays.
                  </p>
                </div>
              </div>

              {/* WhatsApp Direct Button */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${contact.whatsapp_number}?text=${encodeURIComponent('Hello Ashapura Farsan, I have a query about your snacks.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-full shadow-cta flex items-center justify-center gap-2 transition-colors"
                >
                  <WhatsAppIcon size={16} />
                  <span>Send Message on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Card: Directions & Neighborhood Info */}
            <div className="bg-cream-100 border border-line rounded-card p-6 sm:p-8 shadow-card flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-semibold text-brown-900 text-lg border-b border-line pb-3 mb-4">
                  Visit Shantipark, Mira Road
                </h3>
                <p className="text-xs text-brown-700 leading-relaxed mb-4">
                  Ashapura Farsan is conveniently situated right in the heart of Shantipark, Mira Road. Easy to reach from Mira Road railway station, with quick street access and dedicated counter pickup.
                </p>

                <div className="bg-white p-4 rounded-lg border border-line space-y-2 mb-4 text-xs text-brown-700">
                  <p className="font-bold text-brown-900">Landmarks nearby:</p>
                  <ul className="list-disc pl-4 space-y-1 text-brown-600">
                    <li>Near Shantipark main market circle</li>
                    <li>5-7 minutes auto ride from Mira Road Railway Station (East)</li>
                    <li>Ample parking space for quick parcel pickups</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-peach-halo/60 rounded-lg border border-line text-xs text-brown-800">
                <p className="font-bold text-brown-900 mb-1">Bulk & Festival Orders:</p>
                <p>
                  Planning for Diwali, Raksha Bandhan, wedding gifting or society events? Reach out on WhatsApp at least 24 hours in advance for customized gift boxes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
