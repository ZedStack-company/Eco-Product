import SectionTitle from '../components/ui/SectionTitle';
import HeroSection from '../components/ui/HeroSection';
import heroForest from '../assets/hero-forest.jpg';

const ThemeFeaturesPage = () => {
  const features = [
    {
      title: 'Numerous powerful sections',
      description: 'Beyond provides the flexibility to create a unique shopping experience and helps with more detail. Features rich customization, style, and templates to customize Shopify experience from top to bottom. Shopify templates designed to encourage more brands to flourish custom navigation designed interfaces.'
    },
    {
      title: 'Feature-rich',
      description: 'The first web-centric that features outstanding design approach with tools and features that are fully-packed and optimized. These form criteria, stability and navigational, helping you to achieve your custom objectives and transform visitors into sales.'
    },
    {
      title: 'Elegant design and animation',
      description: 'Created with motivations elevated to refined, Beyond offers a sophisticated and functional design that adheres the branding aesthetic you want which is both enhanced professional. Our experience enhances and functionality with premium product.'
    },
    {
      title: 'Mobile optimized and performant',
      description: 'Beyond is designed with mobile in mind, providing an better smartphone performance across all devices. Optimized for speed, automatically your ecommerce is optimized for mobile devices across top functionality, letting you capture more sales and keep your customers coming back for more, no matter from they shop.'
    },
    {
      title: 'Ease of customization',
      description: 'Beyond is designed to be deeply customizable right out of the box, letting you tailor customize everything. From theme includes advanced customization tools that make customization hassle-free. Transform from brand name design integration to the complete brand management.'
    },
    {
      title: 'Unrivalled support',
      description: 'We offer exceptional customer support to ensure your success. With a comprehensive customer satisfaction policy, we provide comprehensive assistance to ensure you get the most from your Shopify experience. Should you have a technical question or just need some friendly advice, we are ready to support you every step of the way.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
        <HeroSection
        backgroundImage={heroForest}
        title="Designed for luxury brands, delivering unrivaled speed and elegance"
        parallax={true}
        className="min-h-[60vh]"
      />



      {/* Features Grid */}
      <section className="section-eco bg-muted/30">
        <div className="container-eco">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <h3 className="heading-md mb-4">{feature.title}</h3>
                <p className="text-body">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Streamlined Processes Section */}
      <section 
        className="relative py-24 text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroForest})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container-eco">
          <div className="max-w-4xl mx-auto">
            <span className="text-sm font-medium tracking-wide uppercase mb-4 block opacity-80">
              CUSTOMIZE CARE AND KNOWLEDGE
            </span>
            <h2 className="heading-lg mb-8">Streamlined processes</h2>
            <p className="text-lg leading-relaxed opacity-90">
              Beyond simplifies the checkout journey, features the top look, and get other customers to create 
              and learn their cart without worrying about shopping speed, which key features that performed in a 
              top-tier competitive experience. This is a business.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="section-eco">
        <div className="container-eco">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-6">Flexible options</h2>
            <p className="text-body max-w-3xl mx-auto">
              We cater to a variety of customer preferences with our diverse pickup options, providing 
              convenience and flexibility. Our theme lets shoppers add personalized instructions, making their 
              shopping experience more tailored and enjoyable.
            </p>
          </div>
        </div>
      </section>

      {/* Engagement Boosters */}
      <section className="section-eco bg-muted/30">
        <div className="container-eco text-center">
          <span className="text-sm font-medium tracking-wide uppercase mb-4 block text-muted-foreground">
            PROVEN RESULTS WITH COMPARATIVE
          </span>
          <h2 className="heading-lg mb-8">Engagement boosters</h2>
          <p className="text-body max-w-3xl mx-auto">
            Capture and maintain customer attention at an elevated marketing reach. Beyond design highlights 
            special promotions at any position. These Promotional Scripts engage visitors help return sellers, 
            amplifying customer retention and boosting sales.
          </p>
        </div>
      </section>

      {/* Trust and Urgency */}
      <section className="section-eco">
        <div className="container-eco text-center">
          <h2 className="heading-lg mb-8">Trust and urgency</h2>
          <p className="text-body max-w-3xl mx-auto">
            Build credibility and drive alone with trust and social loyalty that showcase customer reviews and 
            experiences. Collection offers builds a sense of urgency encouraging quick decisions, and 
            receives viewer products needed customer at their planned, enhancing the likelihood of 
            return visits.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section 
        className="relative py-24 text-center text-white"
        style={{
          background: 'linear-gradient(135deg, hsl(150 30% 25%), hsl(25 25% 65%))',
        }}
      >
        <div className="container-eco">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-lg mb-8">
              Beyond equips you with a dynamic set of tools to elevate your online 
              store and brand. From effortless navigation to bold merchandising, 
              Beyond refines the customer experience while increasing sales 
              potential, fusing contemporary design with powerful functionality. 
              Beyond allows you to craft a store that leaves a lasting impression. 
              Step into the future of ecommerce with Beyond, and watch your 
              brand flourish.
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThemeFeaturesPage;