"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[14px] border border-transparent bg-clip-padding text-[15px] font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_8px_24px_rgba(74,53,233,0.15)] [a]:hover:opacity-90 hover:opacity-90",
        outline:
          "border border-primary text-primary bg-transparent hover:bg-primary/10 aria-expanded:bg-primary/10 aria-expanded:text-primary",
        secondary:
          "bg-secondary text-white hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-white shadow-[0_4px_12px_rgba(107,92,255,0.15)]",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive dark:hover:bg-destructive/90 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        fab: "bg-primary text-white rounded-full shadow-[0_8px_24px_rgba(74,53,233,0.3)] hover:opacity-90 w-14 h-14",
      },
      size: {
        default:
          "h-12 px-5 py-2 min-w-[120px]",
        xs: "h-8 rounded-[10px] px-3 text-xs",
        sm: "h-10 rounded-[12px] px-4 text-sm",
        lg: "h-14 rounded-[16px] px-8 text-base",
        icon: "size-12",
        "icon-xs": "size-8 rounded-[10px]",
        "icon-sm": "size-10 rounded-[12px]",
        "icon-lg": "size-14 rounded-[16px]",
        fab: "size-14 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
