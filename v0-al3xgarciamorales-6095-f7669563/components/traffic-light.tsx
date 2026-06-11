"use client"

import { cn } from "@/lib/utils"

type LightState = 1 | 2 | 3 | 0

const STATES: Record<
  number,
  { label: string; description: string; color: string; text: string }
> = {
  1: {
    label: "Normal",
    description: "Process running within nominal parameters",
    color: "success",
    text: "text-success",
  },
  2: {
    label: "Caution",
    description: "Process requires operator attention",
    color: "warning",
    text: "text-warning",
  },
  3: {
    label: "Stopped",
    description: "Process halted — intervention required",
    color: "danger",
    text: "text-danger",
  },
  0: {
    label: "No Signal",
    description: "Awaiting process data",
    color: "muted",
    text: "text-muted-foreground",
  },
}

function Lamp({
  active,
  color,
}: {
  active: boolean
  color: "success" | "warning" | "danger"
}) {
  const bg = {
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  }[color]
  const glow = {
    success: "glow-success",
    warning: "glow-warning",
    danger: "glow-danger",
  }[color]

  return (
    <div
      className={cn(
        "relative h-16 w-16 rounded-full border transition-all duration-500 md:h-20 md:w-20",
        active
          ? cn(bg, glow, "border-transparent scale-100")
          : "scale-90 border-border bg-secondary/60",
      )}
      aria-hidden="true"
    >
      {active && (
        <span className="absolute inset-2 rounded-full bg-white/25 blur-[2px]" />
      )}
    </div>
  )
}

export function TrafficLight({ value }: { value: number }) {
  const state = (Math.round(value) as LightState) ?? 0
  const meta = STATES[state] ?? STATES[0]

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-6 shadow-lg md:flex-row md:gap-8 md:p-8">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-background/60 p-5">
        <Lamp active={state === 3} color="danger" />
        <Lamp active={state === 2} color="warning" />
        <Lamp active={state === 1} color="success" />
      </div>
      <div className="text-center md:text-left">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Current Status
        </span>
        <p className={cn("mt-1 text-3xl font-semibold tracking-tight md:text-4xl", meta.text)}>
          {meta.label}
        </p>
        <p className="mt-2 max-w-xs text-pretty text-sm text-muted-foreground">
          {meta.description}
        </p>
      </div>
    </div>
  )
}
