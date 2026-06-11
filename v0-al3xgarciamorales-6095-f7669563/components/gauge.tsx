"use client"

import { cn } from "@/lib/utils"

function colorFor(value: number): { stroke: string; text: string } {
  if (value >= 90) return { stroke: "var(--success)", text: "text-success" }
  if (value >= 70) return { stroke: "var(--warning)", text: "text-warning" }
  return { stroke: "var(--danger)", text: "text-danger" }
}

export function Gauge({
  value,
  label,
  size = "lg",
}: {
  value: number
  label: string
  size?: "lg" | "sm"
}) {
  const clamped = Math.max(0, Math.min(100, value || 0))
  const isLg = size === "lg"
  const dim = isLg ? 220 : 130
  const stroke = isLg ? 16 : 11
  const radius = (dim - stroke) / 2
  const cx = dim / 2
  const cy = dim / 2
  // 270-degree arc (gauge style), starting at 135deg
  const startAngle = 135
  const sweep = 270
  const circumference = 2 * Math.PI * radius
  const arcLength = (sweep / 360) * circumference
  const progress = (clamped / 100) * arcLength
  const { stroke: color, text } = colorFor(clamped)

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-5 shadow-lg">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="rotate-90 scale-x-[-1]">
          {/* track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            transform={`rotate(${startAngle - 90} ${cx} ${cy})`}
          />
          {/* value */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            transform={`rotate(${startAngle - 90} ${cx} ${cy})`}
            style={{
              transition: "stroke-dasharray 0.7s cubic-bezier(0.4,0,0.2,1), stroke 0.4s",
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-mono font-semibold tabular-nums", isLg ? "text-5xl" : "text-2xl", text)}>
            {clamped.toFixed(isLg ? 1 : 0)}
          </span>
          <span className={cn("font-medium text-muted-foreground", isLg ? "text-sm" : "text-[10px]")}>
            %
          </span>
        </div>
      </div>
      <span
        className={cn(
          "mt-2 text-center font-medium tracking-wide text-foreground",
          isLg ? "text-base" : "text-sm",
        )}
      >
        {label}
      </span>
    </div>
  )
}
