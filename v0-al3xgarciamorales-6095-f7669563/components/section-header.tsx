import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Accent = "primary" | "accent" | "warning" | "success" | "danger"

const ACCENT: Record<Accent, { icon: string; dot: string }> = {
  primary: { icon: "border-primary/30 bg-primary/15 text-primary", dot: "bg-primary" },
  accent: { icon: "border-accent/30 bg-accent/15 text-accent", dot: "bg-accent" },
  warning: { icon: "border-warning/30 bg-warning/15 text-warning", dot: "bg-warning" },
  success: { icon: "border-success/30 bg-success/15 text-success", dot: "bg-success" },
  danger: { icon: "border-danger/30 bg-danger/15 text-danger", dot: "bg-danger" },
}

export function SectionHeader({
  title,
  subtitle,
  icon,
  accent = "primary",
}: {
  title: string
  subtitle?: string
  icon?: ReactNode
  accent?: Accent
}) {
  const a = ACCENT[accent]
  return (
    <div className="mb-5 flex items-start gap-3">
      {icon && (
        <div
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
            a.icon,
          )}
        >
          {icon}
        </div>
      )}
      <div>
        <div className="flex items-center gap-2">
          <span className={cn("h-4 w-1 rounded-full", a.dot)} />
          <h2 className="text-balance text-lg font-semibold tracking-tight text-foreground md:text-xl">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="mt-1 text-pretty text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
