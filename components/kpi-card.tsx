import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Accent = "primary" | "accent" | "warning" | "danger"

const ACCENT: Record<Accent, { text: string; bar: string; glow: string; iconBg: string }> = {
  primary: {
    text: "text-primary",
    bar: "bg-primary",
    glow: "before:bg-primary/10",
    iconBg: "bg-primary/15 text-primary",
  },
  accent: {
    text: "text-accent",
    bar: "bg-accent",
    glow: "before:bg-accent/10",
    iconBg: "bg-accent/15 text-accent",
  },
  warning: {
    text: "text-warning",
    bar: "bg-warning",
    glow: "before:bg-warning/10",
    iconBg: "bg-warning/15 text-warning",
  },
  danger: {
    text: "text-danger",
    bar: "bg-danger",
    glow: "before:bg-danger/10",
    iconBg: "bg-danger/15 text-danger",
  },
}

export function KpiCard({
  label,
  value,
  unit,
  hint,
  icon,
  accent = "primary",
}: {
  label: string
  value: string
  unit?: string
  hint?: string
  icon: ReactNode
  accent?: Accent
}) {
  const a = ACCENT[accent]
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80",
        "before:absolute before:-right-10 before:-top-10 before:h-32 before:w-32 before:rounded-full before:blur-2xl before:transition-opacity before:duration-500",
        a.glow,
      )}
    >
      <div className="relative flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", a.iconBg)}>
          {icon}
        </span>
      </div>
      <div className="relative mt-4 flex items-baseline gap-1.5">
        <span className="font-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums md:text-4xl">
          {value}
        </span>
        {unit && <span className={cn("text-sm font-medium", a.text)}>{unit}</span>}
      </div>
      <div className="relative mt-3 flex items-center justify-between">
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        <span className="h-1 flex-1" />
      </div>
      <div className="relative mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div className={cn("h-full w-1/3 rounded-full transition-all", a.bar)} />
      </div>
    </div>
  )
}
