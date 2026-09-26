import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-200 hover:text-zinc-950",
        destructive:
          "bg-red-600 text-zinc-50 shadow-sm hover:bg-red-700",
        outline:
          "border border-zinc-700 bg-zinc-900/60 text-zinc-200 backdrop-blur-sm shadow-sm hover:bg-zinc-800 hover:border-zinc-500 hover:text-zinc-100",
        secondary:
          "bg-zinc-800 text-zinc-100 shadow-sm hover:bg-zinc-700 hover:text-white",
        ghost:
          "text-zinc-300 hover:bg-zinc-800/80 hover:text-white",
        link:
          "text-zinc-300 underline-offset-4 hover:underline hover:text-white",
        glow:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-semibold shadow-[0_0_25px_-5px_rgba(245,158,11,0.4)] hover:brightness-110",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
