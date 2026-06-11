"use client"

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

export function ProductionSection({
  robot,
  camera,
  warehouse,
  good,
  bad,
}: {
  robot: number
  camera: number
  warehouse: number
  good: number
  bad: number
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const data = [
    { station: "Robot", value: robot, fill: "var(--chart-1)" },
    { station: "Camera", value: camera, fill: "var(--chart-2)" },
    { station: "Warehouse", value: warehouse, fill: "var(--chart-3)" },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-lg lg:col-span-2">
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Completed bottles by station
        </p>
        <div className="h-[260px] w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 24, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="station"
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={88} isAnimationActive animationDuration={500}>
                {data.map((d) => (
                  <Cell key={d.station} fill={d.fill} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v: number) => formatNumber(v)}
                  className="fill-foreground"
                  style={{ fontSize: 12, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          ) : null}
        </div>
      </div>

      <div className="grid grid-rows-2 gap-4">
        <CountTile label="Good Bottles" value={good} accent="success" icon={<CheckCircle2 className="h-5 w-5" />} />
        <CountTile label="Bad Bottles" value={bad} accent="danger" icon={<XCircle className="h-5 w-5" />} />
      </div>
    </div>
  )
}

function CountTile({
  label,
  value,
  accent,
  icon,
}: {
  label: string
  value: number
  accent: "success" | "danger"
  icon: React.ReactNode
}) {
  const styles = {
    success: { text: "text-success", bg: "bg-success/15 text-success", border: "border-success/30" },
    danger: { text: "text-danger", bg: "bg-danger/15 text-danger", border: "border-danger/30" },
  }[accent]

  return (
    <div className={cn("flex flex-col justify-center rounded-2xl border bg-card p-5 shadow-lg", styles.border)}>
      <div className="flex items-center gap-2">
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", styles.bg)}>{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <span className={cn("mt-3 font-mono text-4xl font-semibold tabular-nums", styles.text)}>
        {formatNumber(value)}
      </span>
    </div>
  )
}
