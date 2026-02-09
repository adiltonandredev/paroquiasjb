import * as React from "react"
//import { slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export const Button = React.forwardRef<HTMLButtonElement, any>(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})