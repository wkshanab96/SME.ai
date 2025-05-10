import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-lg transition-shadow', 
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg',
        outline: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        flat: 'bg-white dark:bg-gray-800',
        gradient: 'bg-gradient-to-r from-blue-600/5 to-purple-600/5 shadow-md hover:shadow-lg',
      },
      padding: {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    }
  }
);

export interface CardProps extends 
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  fullWidth?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, subtitle, action, footer, children, variant, padding, fullWidth, ...props }, ref) => {
    return (
      <div 
        className={`${cardVariants({ variant, padding, className })} ${fullWidth ? 'w-full' : ''}`}
        ref={ref}
        {...props}
      >
        {(title || action) && (
          <div className="flex items-center justify-between mb-4">
            <div>
              {title && <h3 className="text-lg font-medium">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
        <div>{children}</div>
        {footer && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };