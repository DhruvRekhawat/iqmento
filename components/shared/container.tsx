import * as React from "react";

import { cn } from "@/lib/utils";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  bleed?: boolean;
};

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, bleed = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          bleed
            ? "w-full"
            : "mx-auto w-full max-w-[1200px] px-6 sm:px-10 lg:px-16",
          className
        )}
        {...props}
      />
    );
  }
);
Container.displayName = "Container";

export { Container };
