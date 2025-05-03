import React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary-blue hover:bg-blue-700 text-white shadow-sm",
        secondary: "bg-primary-purple hover:bg-purple-700 text-white shadow-sm",
        outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20",
        ghost: "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400",
        gradient: "bg-gradient-primary hover:opacity-90 text-white shadow-sm",
      },
      size: {
        sm: "h-8 px-3 py-1",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 py-3",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'href'>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, size, fullWidth, href, startIcon, endIcon, isLoading, disabled, ...props }, ref) => {
    const isDisabled = isLoading || disabled;
    
    if (href) {
      return (
        <Link 
          href={href} 
          className={buttonVariants({ variant, size, fullWidth, className })}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {isLoading ? (
            <span className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          ) : (
            <>
              {startIcon && <span className="mr-2">{startIcon}</span>}
              {children}
              {endIcon && <span className="ml-2">{endIcon}</span>}
            </>
          )}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, className })}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <span className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </span>
        ) : (
          <>
            {startIcon && <span className="mr-2">{startIcon}</span>}
            {children}
            {endIcon && <span className="ml-2">{endIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };