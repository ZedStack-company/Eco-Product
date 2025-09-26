import HeroSection from '../components/ui/HeroSection';
import SectionTitle from '../components/ui/SectionTitle';
import heroForest from '../assets/hero-forest.jpg';
import ecoHome from '../assets/eco-home.jpg';
import productsHero from '../assets/products-hero.jpg';

const AboutPage = () => {
  return (
    <div>
      {/* Hero Section with Parallax */}
      <HeroSection
        backgroundImage={heroForest}
        title="About"
        parallax={true}
        className="min-h-[60vh]"
      />

      {/* Story Section */}
      <section className="section-eco">
        <div className="container-eco">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="text-body">
                Since 2014, we've embarked on a journey to create something meaningful—a space that celebrates thoughtfully made, beautiful items for life and home. Our experience spans photography, art, logo, branding, and brand development. We believe quality is found not only in exceptional craftsmanship, we seek out items that are made with love and care, with a focus on sustainability and ethical meaning. Our vision is to inspire conscious living through products that tell a story and have lasting value.
              </p>
            </div>
            <div className="image-swap">
              <img 
                src={ecoHome} 
                alt="Sustainable home interior" 
                className="image-primary w-full h-auto"
              />
              <img 
                src={productsHero} 
                alt="Eco products collection" 
                className="image-secondary w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-eco bg-muted/30">
        <div className="container-eco">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="image-swap order-2 lg:order-1">
              <img 
                src={productsHero} 
                alt="Handcrafted products" 
                className="image-primary w-full h-auto"
              />
              <img 
                src={ecoHome} 
                alt="Sustainable craftsmanship" 
                className="image-secondary w-full h-auto"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <p className="text-body">
                Based on the south coast of England, we work with a curated selection of makers and artisans who share our vision of creating items that are both beautiful and eco-friendly. Our philosophy centers around slow living and intentional consumption, built from love promoting a lifestyle that values long-lasting, beautifully-made objects. We believe in the importance of knowing your makers to help visualize how these products can become part of your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Commitment Section */}
      <section 
        className="relative py-24 text-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroForest})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container-eco">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-lg mb-8 text-white">
              We are proud to contribute to environmental causes as part of the 1% for the Planet movement, ensuring that a portion of our sales goes directly to protecting our planet.
            </h2>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-eco">
        <div className="container-eco">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="text-body">
                Our philosophy promotes living less but living better, embracing slow design with care - using high-quality materials that are designed to last. We celebrate the unique beauty and character inherent in handmade goods, where each piece tells its own story and shows the care that goes into making it. The soul and energy that go into creating these products are what makes us whole as a commitment to responsible consumption.
              </p>
            </div>
            <div className="image-swap">
              <img 
                src={ecoHome} 
                alt="Artisan workspace" 
                className="image-primary w-full h-auto"
              />
              <img 
                src={productsHero} 
                alt="Handcrafted details" 
                className="image-secondary w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-eco bg-muted/30">
        <div className="container-eco text-center">
          <SectionTitle 
            title="Join Our Journey"
            subtitle="Discover products that make a difference in your home and the world"
            className="mb-8"
          />
          <button className="eco-button">
            EXPLORE OUR COLLECTION
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;