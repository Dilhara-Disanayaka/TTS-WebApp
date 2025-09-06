"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

const Slider = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex h-5 w-full touch-none select-none items-center", className)}
      {...props}
    >
      {children}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = "Slider"

const SliderTrack = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Track
    ref={ref}
    className={cn("relative h-1 w-full grow overflow-hidden rounded-full bg-muted/60", className)}
    {...props}
  />
))
SliderTrack.displayName = "SliderTrack"

const SliderRange = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Range
    ref={ref}
    className={cn("absolute h-full rounded-full bg-primary", className)}
    {...props}
  />
))
SliderRange.displayName = "SliderRange"

const SliderThumb = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Thumb
    ref={ref}
    className={cn(
      "block h-4 w-4 rounded-full border border-input bg-background shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
SliderThumb.displayName = "SliderThumb"

export { Slider, SliderTrack, SliderRange, SliderThumb }
