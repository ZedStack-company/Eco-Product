import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import PageContainer from './PageContainer';

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  background?: 'default' | 'muted' | 'accent' | 'primary';
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  as?: keyof JSX.IntrinsicElements;
}



const backgroundClasses = {
  default: 'bg-background',
  muted: 'bg-muted/30',
  accent: 'bg-accent/10',
  primary: 'bg-primary/5',
};

const paddingClasses = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
};

const PageSection = ({
  children,
  className,
  containerClassName,
  background = 'default',
  padding = 'lg',
  maxWidth = 'xl',
  as: Component = 'section',
}: PageSectionProps) => {
  return (
    <Component className={cn(
      backgroundClasses[background],
      paddingClasses[padding],
      className
    )}>
      <PageContainer maxWidth={maxWidth} className={containerClassName}>
        {children}
      </PageContainer>
    </Component>
  );
};

export default PageSection;