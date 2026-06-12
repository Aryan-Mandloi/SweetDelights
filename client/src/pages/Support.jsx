import React, { useState } from 'react';
import { HelpCircle, RefreshCw, PhoneCall, Mail, Clock, MapPin, ChevronDown, MessageSquare, ShieldAlert } from 'lucide-react';

const Support = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'Do you offer same-day deliveries?',
      a: 'Yes! Same-day deliveries are available for signature catalog cakes if the order is placed before 12:00 PM local time. Custom cakes, multi-tiered wedding orders, or highly detailed theme decorations require a minimum of 48 to 72 hours advance notice.'
    },
    {
      q: 'Can I change my order customization details after placing it?',
      a: 'We begin preparation and pre-baking processes early! You can adjust your cake size, chosen frosting flavor, or custom text message up to 24 hours before your scheduled delivery time. Simply call our chef hotline or email us with your Order ID.'
    },
    {
      q: 'What premium ingredients do you source for baking?',
      a: 'We prioritize pure, high-end culinary excellence. We use certified organic flour, rich Madagascar bourbon vanilla beans, imported Belgian dark and white chocolates, and premium grass-fed dairy products. No artificial preservatives or hydrogenated oils are ever allowed in our kitchen.'
    },
    {
      q: 'Do you offer allergen-free, vegan, or gluten-free options?',
      a: 'Absolutely! We bake for everyone. When customizing your cake in the Catalog, you can choose Standard, gluten-free base modifications, or sugar-free icing. Please note that while we take extreme care to sanitize workstations, our facility does handle wheat, tree nuts, and dairy products.'
    },
    {
      q: 'How should I store my cake upon receiving it?',
      a: 'Our cakes are handcrafted with fresh, organic dairy buttercreams. We recommend keeping the cake in its protective box refrigerated until 30-45 minutes before serving. Letting it sit at cozy room temperature briefly allows the Swiss meringue buttercream to soften into a perfectly silky, delicious texture!'
    }
  ];

  const policyItems = [
    {
      title: 'Reporting Issues',
      desc: 'Since all our patisserie creations are freshly baked with perishable organic ingredients, any issues regarding visual damage, incorrect custom text messages, or structural flaws must be reported within 4 hours of courier delivery.'
    },
    {
      title: 'Refund Eligibility',
      desc: 'If we fail to deliver your cake, or if the delivered product is significantly damaged during transit or does not match your confirmed flavor/size specifications, you are eligible for a 100% full refund or equivalent SweetDelights store credits.'
    },
    {
      title: 'Replacements & Redelivery',
      desc: 'For immediate parties, our express chef team can rush a priority replacement cake to your address within 2-3 hours, subject to slot availability. Alternatively, we can reschedule your dispatch to a future date of your choice.'
    }
  ];

  return (
    <div className="bg-cream dark:bg-[#121212] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-secondary dark:text-gray-300 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 dark:bg-primary/20 px-4 py-1.5 rounded-full">
            Customer Care Center
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-secondary dark:text-white leading-tight">
            How Can We Help You?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Get instant answers to FAQs, review our fresh-bake refund and replace policies, or get in touch directly with our support kitchen.
          </p>
        </div>

        {/* Support Options Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <a href="#faq" className="card p-6 flex flex-col items-center text-center space-y-4 hover:border-primary/30 transition-all duration-300">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <HelpCircle className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-secondary dark:text-white">Read FAQs</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Find quick solutions for shipping schedules, custom toppings, storing instructions, and allergen parameters.
            </p>
          </a>

          <a href="#policy" className="card p-6 flex flex-col items-center text-center space-y-4 hover:border-primary/30 transition-all duration-300">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <RefreshCw className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-secondary dark:text-white">Refunds & Returns</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Understand our fresh-guarantee policies, replacement protocols, and courier refund qualifications.
            </p>
          </a>

          <a href="#contact" className="card p-6 flex flex-col items-center text-center space-y-4 hover:border-primary/30 transition-all duration-300">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <PhoneCall className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-secondary dark:text-white">Direct Kitchen Line</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Need immediate help? Call our support staff or send chef teams email notes regarding bulk orders.
            </p>
          </a>
        </div>

        {/* FAQs SECTION */}
        <section id="faq" className="scroll-mt-24 space-y-8 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-lg border border-secondary/5 dark:border-[#2d2d30] transition-colors duration-300">
          <div className="flex items-center gap-3 pb-4 border-b dark:border-[#2d2d30]">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-serif font-bold text-secondary dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-gray-100 dark:border-[#2d2d30] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left font-bold text-sm text-secondary dark:text-white hover:bg-cream/20 dark:hover:bg-[#252528]/20 transition-all"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${activeFaq === idx ? 'transform rotate-180 text-primary' : ''}`} />
                </button>
                
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-600 dark:text-gray-400 leading-relaxed animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* POLICY SECTION */}
        <section id="policy" className="scroll-mt-24 space-y-8 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-lg border border-secondary/5 dark:border-[#2d2d30] transition-colors duration-300">
          <div className="flex items-center gap-3 pb-4 border-b dark:border-[#2d2d30]">
            <RefreshCw className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-serif font-bold text-secondary dark:text-white">Refund & Replacement Guarantee</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {policyItems.map((policy, idx) => (
              <div key={idx} className="bg-cream/40 dark:bg-[#151518]/50 p-6 rounded-2xl border border-secondary/5 dark:border-[#2d2d30] space-y-3">
                <h4 className="font-serif font-bold text-secondary dark:text-white text-base">{policy.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{policy.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-relaxed font-semibold">
              ⚠️ <strong>Perishable Product Notice:</strong> Because SweetDelights products are preservative-free and strictly made to order, refunds cannot be processed for delays caused by wrong delivery addresses, incorrect phone numbers, or if the courier is unable to find a recipient at the designated dispatch time.
            </p>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="scroll-mt-24 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            
            {/* Contact Details Column */}
            <div className="md:col-span-2 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-lg border border-secondary/5 dark:border-[#2d2d30] space-y-6 transition-colors duration-300">
              <h2 className="text-2xl font-serif font-bold text-secondary dark:text-white flex items-center gap-2 pb-4 border-b dark:border-[#2d2d30]">
                <MessageSquare className="h-6 w-6 text-primary" />
                Kitchen Info
              </h2>

              <div className="space-y-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block text-secondary dark:text-white text-sm font-bold">Email Us</span>
                    <a href="mailto:support@sweetdelights.com" className="text-gray-400 hover:text-primary transition-colors text-xs font-medium">support@sweetdelights.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                    <PhoneCall className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block text-secondary dark:text-white text-sm font-bold">Direct Hotline</span>
                    <span className="text-gray-400 text-xs font-medium">+1 (800) 555-CAKE</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block text-secondary dark:text-white text-sm font-bold">Oven Hours</span>
                    <span className="text-gray-400 text-xs font-medium">Mon - Sun: 8:00 AM - 9:00 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block text-secondary dark:text-white text-sm font-bold">Boutique Kitchen</span>
                    <span className="text-gray-400 text-xs font-medium">456 Frosting Avenue, Patisserie Plaza, Suite 10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="md:col-span-3 bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-lg border border-secondary/5 dark:border-[#2d2d30] transition-colors duration-300">
              <h2 className="text-2xl font-serif font-bold text-secondary dark:text-white pb-4 border-b dark:border-[#2d2d30] mb-6">
                Send a Message
              </h2>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for contacting us! Our kitchen staff will get back to you shortly.'); e.target.reset(); }} className="space-y-4 text-xs font-semibold text-gray-600 dark:text-gray-400">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#2d2d32] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#2d2d32] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label>Order ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. #65B9A1"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#2d2d32] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label>Your Message *</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Tell us details regarding your order, modifications, or inquiries..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-[#2d2d32] dark:bg-[#151518] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs leading-relaxed font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary hover:bg-accent text-white font-bold rounded-xl transition-all shadow-md uppercase tracking-wider text-xs"
                >
                  Send Inquiry
                </button>
              </form>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Support;
