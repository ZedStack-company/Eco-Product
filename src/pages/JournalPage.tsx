import { Link } from 'react-router-dom';
import HeroSection from '../components/ui/HeroSection';
import SectionTitle from '../components/ui/SectionTitle';
import heroForest from '../assets/hero-forest.jpg';
import blogAutumn from '../assets/blog-autumn.jpg';
import blogCrafts from '../assets/blog-crafts.jpg';
import productsHero from '../assets/products-hero.jpg';

const JournalPage = () => {
  const articles = [
    {
      id: 1,
      title: 'Autumn in Romania',
      date: 'MAY 12, 2023',
      author: 'Emily Thomas',
      excerpt: 'How the west density flows through the trees, a gentle way chilling to old that afternoon in.',
      image: blogAutumn,
      link: '/journal/autumn-romania'
    },
    {
      id: 2,
      title: 'Into the Beguiling Wild',
      date: 'JUL 2, 2023',
      author: 'Emily Thomas',
      excerpt: 'Into The Beguiling Wild is a special ceramic collaboration with Wicksborough. Handmade, work begin.',
      image: blogCrafts,
      link: '/journal/beguiling-wild'
    },
    {
      id: 3,
      title: 'The Urban Woodsman',
      date: 'MAY 23, 2023',
      author: 'Emily Thomas',
      excerpt: 'The Urban Woodsman, a modern guide to escaping devices, towns, and bustle by fast-developing of Forest.',
      image: productsHero,
      link: '/journal/urban-woodsman'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        backgroundImage={heroForest}
        title="California Road Trip"
        className="min-h-[70vh]"
      >
        <Link to="/journal/california-road-trip" className="eco-button-inverse">
          CONTINUE READING
        </Link>
      </HeroSection>

      {/* Filter Tags */}
      <section className="py-8 bg-muted/30">
        <div className="container-eco text-center">
          <div className="flex justify-center space-x-8">
            <button className="text-sm font-medium tracking-wide uppercase border-b-2 border-foreground pb-2">
              LIFESTYLE
            </button>
            <button className="text-sm font-medium tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors pb-2">
              PHOTO JOURNAL
            </button>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-eco">
        <div className="container-eco">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {articles.map((article) => (
              <article key={article.id} className="group cursor-pointer">
                <Link to={article.link}>
                  <div className="mb-4 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="heading-md mb-2 group-hover:text-muted-foreground transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {article.date}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Written by {article.author}
                  </p>
                  <p className="text-body mb-4">
                    {article.excerpt}
                  </p>
                  <button className="text-sm font-medium tracking-wide uppercase border-b border-foreground hover:text-muted-foreground transition-colors">
                    CONTINUE READING
                  </button>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="section-eco bg-muted/30">
        <div className="container-eco">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
                SEASONAL SALE
              </span>
              <h2 className="heading-lg">
                Up to 50% off home goods
              </h2>
              <Link to="/shop" className="eco-button">
                SHOP NOW
              </Link>
            </div>
            <div>
              <img 
                src={productsHero} 
                alt="Home goods sale" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-eco">
        <div className="container-eco text-center">
          <SectionTitle 
            title="Stay Updated"
            subtitle="Subscribe to our journal for the latest stories and sustainable living tips"
            className="mb-8"
          />
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-border focus:outline-none focus:border-foreground"
            />
            <button className="eco-button ml-2">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JournalPage;