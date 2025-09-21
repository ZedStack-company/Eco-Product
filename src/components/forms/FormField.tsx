import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label?: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  description?: string;
}

const FormField = ({
  label,
  children,
  error,
  required,
  className,
  labelClassName,
  description,
}: FormFieldProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label className={cn(
          'text-sm font-medium',
          error && 'text-destructive',
          labelClassName
        )}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {children}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

export default FormField;