import React from "react"

interface ProgressBarProps {
  progress: number
  height?: number
  animated?: boolean
}

export default function ProgressBar({
  progress,
  height = 8,
  animated = true,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  const color = progress === 100 ? "hsl(var(--success))" : progress < 30 ? "hsl(var(--destructive))" : "#ff5c00"

  return (
    <div
      className="w-full bg-secondary rounded-full overflow-hidden"
      style={{ height }}
    >
      <div
        className={`h-full ${
          animated ? "transition-all duration-500 ease-in-out" : ""
        }`}
        style={{
          width: `${clampedProgress}%`,
          backgroundColor: color,
        }}
      >
        <div
          className={`h-full w-full ${animated ? "animate-pulse" : ""}`}
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}


