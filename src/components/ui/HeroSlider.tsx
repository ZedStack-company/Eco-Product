import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 5000; // 5 seconds per slide

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setProgress(0);
    });
  }, [api]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (api) {
            api.scrollNext();
          }
          return 0;
        }
        return prev + (100 / (SLIDE_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(timer);
  }, [api, current]);

  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
      setProgress(0);
    }
  };

  return (
    <div className="relative">
      <Carousel 
        className="w-full"
        setApi={setApi}
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
                  <div className="max-w-4xl mx-auto animate-fade-in">
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
      </Carousel>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 right-8 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="relative w-10 h-10 rounded-full bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors"
          >
            {index + 1}
            {current === index && (
              <div 
                className="absolute inset-0 rounded-full border-2 border-white"
                style={{
                  background: `conic-gradient(from 0deg, white ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;