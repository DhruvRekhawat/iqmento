import * as React from "react";

import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";

export interface SectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: React.ReactNode;
  eyebrowVariant?: BadgeProps["variant"];
  title: string;
  description?: React.ReactNode;
  align?: "left" | "center" | "right";
  clamp?: "none" | "short" | "long";
  direction?: "row" | "col";
}

const alignmentMap = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
} as const;

const clampMap = {
  none: "",
  short: "[--clamp-lines:3]",
  long: "[--clamp-lines:5]",
} as const;

const directionMap = {
  row: "md:flex-row flex-col gap-5",
  col: "flex-col gap-5",
} as const;

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    {
      eyebrow,
      eyebrowVariant = "glass",
      title,
      description,
      align = "left",
      clamp = "none",
      direction = "col",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full",
          directionMap[direction],
          alignmentMap[align],
          clampMap[clamp],
          className
        )}
        {...props}
      >
        {eyebrow && (
          <Badge variant={eyebrowVariant} className="tracking-[0.22em] uppercase">
            {eyebrow}
          </Badge>
        )}
        <div className={cn("flex flex-col gap-4", directionMap[direction])}>
          <div className="text-pretty text-4xl font-semibold leading-[1.1] text-foreground-strong sm:text-5xl">
            {title}
          </div>
          {description && (
            <p className="text-pretty text-base text-foreground-muted sm:text-md max-w-[400px]">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);
SectionHeader.displayName = "SectionHeader";

export { SectionHeader };
