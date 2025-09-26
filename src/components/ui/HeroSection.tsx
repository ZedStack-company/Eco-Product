import { ReactNode } from 'react';

interface HeroSectionProps {
  backgroundImage: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  parallax?: boolean;
}

const HeroSection = ({ 
  backgroundImage, 
  title, 
  subtitle, 
  children, 
  className = '',
  parallax = false 
}: HeroSectionProps) => {
  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center text-center text-white ${
        parallax ? 'parallax-bg' : ''
      } ${className}`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        ...(parallax && { backgroundAttachment: 'fixed' })
      }}
    >
      <div className="container-eco relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-xl mb-6 text-white">{title}</h1>
          {subtitle && (
            <p className="text-xl md:text-2xl font-light mb-8 text-white/90">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;