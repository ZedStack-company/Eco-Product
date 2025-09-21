import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  variant?: 'default' | 'outlined' | 'subtle';
}

const variantClasses = {
  default: 'border border-border',
  outlined: 'border-2 border-border',
  subtle: 'bg-muted/30 border-0',
};

const FormSection = ({
  title,
  description,
  children,
  className,
  headerClassName,
  contentClassName,
  variant = 'default',
}: FormSectionProps) => {
  return (
    <Card className={cn(variantClasses[variant], className)}>
      {(title || description) && (
        <CardHeader className={cn('pb-4', headerClassName)}>
          {title && (
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
      )}
      <CardContent className={cn(contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default FormSection;