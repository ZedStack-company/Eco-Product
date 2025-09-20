import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";
import heroForest from '../../assets/hero-forest.jpg';
import productsHero from '../../assets/products-hero.jpg';
import ecoHome from '../../assets/eco-home.jpg';

interface Slide {
  id: number;
  backgroundImage: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  buttonVariant?: 'default' | 'inverse';
}

const slides: Slide[] = [
  {
    id: 1,
    backgroundImage: heroForest,
    title: "Sustainable Living",
    subtitle: "Discover eco-friendly products for a better tomorrow",
    buttonText: "SHOP NOW",
    buttonLink: "/shop",
    buttonVariant: "inverse"
  },
  {
    id: 2,
    backgroundImage: productsHero,
    title: "Handcrafted Excellence",
    subtitle: "Artisan-made products with natural materials",
    buttonText: "EXPLORE",
    buttonLink: "/shop",
    buttonVariant: "inverse"
  },
  {
    id: 3,
    backgroundImage: ecoHome,
    title: "Eco Home Collection",
    subtitle: "Transform your space with sustainable design",
    buttonText: "DISCOVER",
    buttonLink: "/shop",
    buttonVariant: "inverse"
  }
];

const HeroSlider = () => {
  return (
    <div className="relative">
      <Carousel 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <section 
                className="relative min-h-screen flex items-center justify-center text-center text-white image-zoom-slow"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundAttachment: 'fixed'
                }}
              >
                <div className="container-eco relative z-10">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="heading-xl mb-6">{slide.title}</h1>
                    {slide.subtitle && (
                      <p className="text-xl md:text-2xl font-light mb-8 text-white/90">
                        {slide.subtitle}
                      </p>
                    )}
                    <Link 
                      to={slide.buttonLink} 
                      className={slide.buttonVariant === 'inverse' ? 'eco-button-inverse' : 'eco-button'}
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </section>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30" />
        <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30" />
      </Carousel>
    </div>
  );
};

export default HeroSlider;