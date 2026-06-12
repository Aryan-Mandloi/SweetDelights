import React from 'react';
import { Award, Compass, Heart, Users, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const coreValues = [
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: 'Baked with Love',
      description: 'Every recipe is handled with absolute care, ensuring that the final masterpiece carries the warmth and joy of our kitchen directly to your celebrations.'
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Premium Ingredients',
      description: 'We source only the finest Madagascar vanilla bean, Belgian dark chocolates, organic free-range dairy, and fresh local fruits to craft our premium layers.'
    },
    {
      icon: <Compass className="h-8 w-8 text-primary" />,
      title: 'Artisanal Customization',
      description: 'Your vision guides our piping bags. From custom flavor notes and tier heights to personalized messages and toppings, we bake bespoke dreams.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Family & Tradition',
      description: 'Rooted in heritage baking, we blend timeless classical culinary techniques with modern, stunning aesthetics to wow your guests.'
    }
  ];

  const milestones = [
    { year: '2016', title: 'The Tiny Hearth', desc: 'Opened a single-oven boutique stall in Sweetville, baking custom cookies and standard sponge cakes for local birthdays.' },
    { year: '2019', title: 'Flourishing Flavors', desc: 'Expanded into a flagship cake laboratory, introducing customized multi-tiered wedding cakes and chocolate truffle specialities.' },
    { year: '2022', title: 'Gourmet Gold Award', desc: 'Received the National Patisserie Guild award for innovative flavor pairings and outstanding customer satisfaction metrics.' },
    { year: '2026', title: 'SweetDelights Online', desc: 'Launched our premium online portal to let anyone customize their dream cake configurations and schedule home dispatches.' }
  ];

  return (
    <div className="bg-cream dark:bg-[#121212] min-h-screen text-secondary dark:text-gray-300 transition-colors duration-300">
      {/* Page Header Hero banner */}
      <section className="relative bg-secondary dark:bg-[#0d0d0f] text-white overflow-hidden py-24 sm:py-32 transition-colors duration-300">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
            alt="Bakery Kitchen Backdrop" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold font-serif leading-tight">Our Story</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base font-medium">
            Discover the passion, pure premium ingredients, and master baking processes that go into crafting every single slice of SweetDelights.
          </p>
        </div>
      </section>

      {/* Story & Concept Section */}
      <section className="py-20 bg-white dark:bg-[#121212] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">A Decade of Sweet Memories</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-secondary dark:text-white leading-tight">We Don't Just Bake Cakes. We Bake Joy.</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              SweetDelights started as a humble dream in a family kitchen. Guided by time-tested family recipes and an insatiable desire to create gorgeous visual showstoppers, we set out to redefine the online cake experience. Today, we are proud to be the heart of thousands of birthday parties, weddings, and cozy Sunday cheat-meals.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              Our philosophy is simple: a cake should taste even more magnificent than it looks. We spend hours refining crumb structures, whipping silky Swiss meringue buttercreams, and balancing sweetness profiles so that each bite delivers rich, gourmet luxury.
            </p>
            <div className="pt-4 flex flex-wrap gap-6 text-xs font-bold uppercase tracking-wide">
              <div className="flex items-center gap-2 text-secondary dark:text-white"><CheckCircle className="h-5 w-5 text-primary" /> 100% Organic Vanilla</div>
              <div className="flex items-center gap-2 text-secondary dark:text-white"><CheckCircle className="h-5 w-5 text-primary" /> Hand-piped Frosting</div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%]"></div>
            <img 
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Mixing gourmet icing" 
              className="relative z-10 w-full max-w-lg mx-auto rounded-[30px] shadow-2xl border-4 border-white dark:border-[#2d2d30] transform hover:scale-[1.02] transition-transform duration-500" 
            />
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-cream dark:bg-[#18181b] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-secondary dark:text-white">What Guides Our Kitchen</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-xs sm:text-sm">
              Our core values guide the flour we choose, the designs we sketch, and the smiles we aim to put on your faces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-[#1e1e22] p-8 rounded-3xl shadow-md border border-secondary/5 dark:border-[#2d2d32] dark:shadow-none hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center">
                    {value.icon}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-secondary dark:text-white">{value.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seeding & Milestones Timeline */}
      <section className="py-20 bg-white dark:bg-[#121212] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-secondary dark:text-white">Our Sweet Milestones</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-xs sm:text-sm">
              Tracing our path from a minor bakery stand to an advanced artisanal online patisserie.
            </p>
          </div>

          <div className="relative border-l border-gray-100 dark:border-[#2d2d30] max-w-3xl mx-auto pl-8 space-y-12">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-[45px] top-0.5 bg-primary text-white text-[10px] font-black rounded-full h-8 w-8 flex items-center justify-center border-4 border-white dark:border-[#121212] shadow">
                  {idx + 1}
                </span>
                <div className="space-y-1">
                  <span className="text-xs font-black text-primary uppercase tracking-wider">{m.year} — {m.title}</span>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Call out */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">Ready to Experience Gourmet Cake?</h2>
          <p className="text-pink-100 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Choose your signature flavors, select customized decorations, add custom greeting scripts, and schedule a fresh, direct-to-door delivery.
          </p>
          <div className="pt-4">
            <Link 
              to="/catalog" 
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-cream text-primary font-bold rounded-full transition-all shadow-lg hover:shadow-xl text-xs uppercase tracking-wider"
            >
              Start Personalizing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
