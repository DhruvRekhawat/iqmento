import * as React from "react";

import { cn } from "@/lib/utils";
import { Container } from "./container";

export interface SectionProps
  extends React.ComponentPropsWithoutRef<"section"> {
  bleed?: boolean;
  spacing?: "compact" | "default" | "loose";
  variant?: "default" | "hero";
}

const spacingMap = {
  compact: "py-12 sm:py-16 ",
  default: "py-16 sm:py-24",
  loose: "py-4 px-4",
} as const;

const variantMap = {
  default: "",
  hero: "relative isolate overflow-hidden border border-[#070707] bg-[#050505] text-white ",
} as const;

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      children,
      bleed = false,
      spacing = "default",
      variant = "default",
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "w-full",
          spacingMap[spacing],
          variantMap[variant],
          className
        )}
        {...props}
      >
        <Container bleed={bleed}>{children}</Container>
      </section>
    );
  }
);
Section.displayName = "Section";

export { Section };

