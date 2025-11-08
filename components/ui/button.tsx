import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-ui text-sm font-semibold tracking-[-0.04em] transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(35,81,119,0.35)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-surface-strong text-foreground-strong border border-[rgba(16,19,34,0.12)] shadow-soft hover:-translate-y-0.5 hover:shadow-card",
        accent:
          "gradient-iris text-white border border-black/10 shadow-card hover:-translate-y-0.5",
        glass:
          "bg-glass text-foreground-strong border border-white/25 shadow-soft hover:shadow-card",
        outline:
          "bg-transparent text-foreground border border-[rgba(16,19,34,0.12)] hover:border-[rgba(16,19,34,0.24)] hover:bg-surface-muted/60",
        ghost:
          "bg-transparent text-foreground hover:text-foreground-strong hover:bg-surface-muted/50",
        link: "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-10 px-5 text-xs",
        md: "h-12 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-12 w-12",
      },
      weight: {
        medium: "font-medium",
        semibold: "font-semibold",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      weight: "semibold",
    },
  }
);

export type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, weight, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, weight }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
