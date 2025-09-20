interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
}

const SectionTitle = ({ 
  title, 
  subtitle, 
  className = '', 
  centered = true 
}: SectionTitleProps) => {
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="heading-lg mb-4">{title}</h2>
      {subtitle && (
        <p className="text-body max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;