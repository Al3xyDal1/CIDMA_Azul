"use client"

import type { ConnectionStatus } from "@/hooks/use-mqtt-cell"
import { cn } from "@/lib/utils"

const CONFIG: Record<
  ConnectionStatus,
  { label: string; dot: string; ring: string; text: string }
> = {
  connected: {
    label: "Connected",
    dot: "bg-success",
    ring: "shadow-[0_0_12px_2px_var(--success)]",
    text: "text-success",
  },
  reconnecting: {
    label: "Reconnecting",
    dot: "bg-warning",
    ring: "shadow-[0_0_12px_2px_var(--warning)]",
    text: "text-warning",
  },
  disconnected: {
    label: "Disconnected",
    dot: "bg-danger",
    ring: "shadow-[0_0_12px_2px_var(--danger)]",
    text: "text-danger",
  },
}

export function ConnectionIndicator({ status }: { status: ConnectionStatus }) {
  const c = CONFIG[status]
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border bg-card/60 px-3.5 py-2 backdrop-blur-sm">
      <span className="relative flex h-2.5 w-2.5">
        {status !== "disconnected" && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              c.dot,
            )}
          />
        )}
        <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", c.dot, c.ring)} />
      </span>
      <span className={cn("text-xs font-medium tracking-wide", c.text)}>{c.label}</span>
    </div>
  )
}
