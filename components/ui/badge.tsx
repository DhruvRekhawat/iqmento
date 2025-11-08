import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-colors",
  {
    variants: {
      variant: {
        glass: "bg-glass border-white/30 text-foreground-strong backdrop-blur-md",
        outline: "bg-transparent border-[rgba(16,19,34,0.12)] text-foreground-soft",
        solid: "bg-primary text-primary-foreground border-transparent shadow-soft",
        violet:
          "gradient-violet text-white border-transparent shadow-soft",
        sunrise:
          "gradient-sunrise text-foreground-strong border-transparent shadow-soft",
      },
    },
    defaultVariants: {
      variant: "glass",
    },
  }
);

export type BadgeProps =
  React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        className={cn(badgeVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
