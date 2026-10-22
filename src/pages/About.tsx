import React from 'react';
import { SectionHeading } from '../components/SectionHeading';
import { SEO } from '../components/SEO';
import { SHOP_CONFIG } from '../config/shop';
import { Sparkles, Heart, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About Us - Ashapura Farsan, Mira Road"
        description="Discover the heritage of Ashapura Farsan in Shantipark, Mira Road. Handcrafted Gujarati farsan, pure ingredients, traditional recipes, and authentic taste since day one."
      />

      <div className="bg-cream-50 min-h-screen py-10 sm:py-16">
        <div className="container-custom max-w-4xl">
          <SectionHeading
            eyebrow="OUR HERITAGE & TRADITION"
            titleRegular="Handcrafted With"
            titleItalic="Love"
            subtitle="The timeless story of bringing authentic Saurashtra & Gujarat farsan flavors to Mira Road."
          />

          {/* Story Block with Warm Visual Language */}
          <div className="bg-white border border-line rounded-card p-6 sm:p-10 shadow-card mt-6 space-y-6 text-brown-700 text-sm leading-relaxed">
            <div className="border-l-4 border-orange-600 pl-4 py-1 italic font-serif text-base sm:text-lg text-brown-900 bg-peach-100/40 rounded-r">
              &ldquo;Har bite mein tradition — from our kitchen to your festive celebrations and daily evening tea.&rdquo;
            </div>

            <p>
              Located at <strong>{SHOP_CONFIG.address}</strong>, Ashapura Farsan has been a beloved neighborhood landmark for families seeking genuine, unadulterated Gujarati taste. Our journey began with a simple devotion: to craft snacks the way they were traditionally prepared in Gujarati homes — with pure ingredients, hand-pounded spices, and zero artificial preservatives.
            </p>

            <p>
              Every morning, our frying kadhais heat up early to prepare fresh batches of golden Bhavnagri Gathiya, crisp Ratlami Sev, flaky Farsi Puris, and fragrant Butter Rice Chakli. Whether you are craving light diet chivda or festive sweets like peanut jaggery chikki and plum cakes, each recipe is perfected over generations.
            </p>

            {/* 3 Pillars / Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-cream-100 p-4 rounded-lg border border-line text-center">
                <Sparkles size={24} className="text-orange-600 mx-auto mb-2" />
                <h4 className="font-serif font-bold text-brown-900 text-xs uppercase tracking-wider mb-1">
                  100% In-House
                </h4>
                <p className="text-[11px] text-brown-500">
                  Fried and baked daily right in our dedicated shop kitchen.
                </p>
              </div>

              <div className="bg-cream-100 p-4 rounded-lg border border-line text-center">
                <Award size={24} className="text-orange-600 mx-auto mb-2" />
                <h4 className="font-serif font-bold text-brown-900 text-xs uppercase tracking-wider mb-1">
                  Pure Ingredients
                </h4>
                <p className="text-[11px] text-brown-500">
                  Pure groundnut oil, quality besan, and authentic Indian spices.
                </p>
              </div>

              <div className="bg-cream-100 p-4 rounded-lg border border-line text-center">
                <Heart size={24} className="text-orange-600 mx-auto mb-2" />
                <h4 className="font-serif font-bold text-brown-900 text-xs uppercase tracking-wider mb-1">
                  No Preservatives
                </h4>
                <p className="text-[11px] text-brown-500">
                  Honest, clean snacks you can confidently share with children and elders.
                </p>
              </div>

              <div className="bg-cream-100 p-4 rounded-lg border border-line text-center">
                <Clock size={24} className="text-orange-600 mx-auto mb-2" />
                <h4 className="font-serif font-bold text-brown-900 text-xs uppercase tracking-wider mb-1">
                  Open Every Day
                </h4>
                <p className="text-[11px] text-brown-500">
                  Serving Mira Road 365 days a year from 10:00 AM to 10:00 PM.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-serif font-semibold text-brown-900">
                  Visit us at Shantipark, Mira Road
                </p>
                <p className="text-xs text-brown-500">
                  Warm hospitality and fresh tasting samples always await you.
                </p>
              </div>

              <Link
                to="/shop"
                className="h-10 px-6 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-full shadow-cta flex items-center justify-center transition-colors"
              >
                Browse Our Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default About;
