
import { cn } from "@/lib/utils";
import React from "react";

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  isGlass?: boolean;
  noPadding?: boolean;
  animate?: boolean;
}

const CustomCard = ({
  children,
  className,
  isGlass = false,
  noPadding = false,
  animate = false,
  ...props
}: CustomCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-soft transition-all duration-200",
        isGlass && "glass-effect",
        !noPadding && "p-6",
        animate && "hover:translate-y-[-2px] hover:shadow-glass",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default CustomCard;
