"use client"

import {
  Activity,
  Banknote,
  BarChart3,
  CircleDollarSign,
  Gauge as GaugeIcon,
  LineChart,
  Package,
  TrafficCone,
  TrendingDown,
  Zap,
  Clock,
  Download,
} from "lucide-react"

import { useMemo, useState } from "react"

import { useMqttCell } from "@/hooks/use-mqtt-cell"

import { ConnectionIndicator } from "@/components/connection-indicator"
import { SectionHeader } from "@/components/section-header"
import { KpiCard } from "@/components/kpi-card"
import { TrafficLight } from "@/components/traffic-light"
import { SpcChart } from "@/components/spc-chart"
import { ProductionSection } from "@/components/production-section"
import { Gauge } from "@/components/gauge"

import { Button } from "@/components/ui/button"

import {
  formatMXN,
  formatNumber,
  formatClock,
  formatDuration,
} from "@/lib/format"

export function Dashboard() {

  const {
    status,
    data,
    history,
    lastUpdate,
  } = useMqttCell()

  // ===========================================================================
  // TIME FILTER
  // ===========================================================================
  const [timeFilter, setTimeFilter] =
    useState("5m")

  // ===========================================================================
  // FILTERED HISTORY
  // ===========================================================================
  const filteredHistory = useMemo(() => {

    const now =
      Date.now() / 1000

    let seconds = 300

    switch (timeFilter) {

      case "5m":
        seconds = 300
        break

      case "1h":
        seconds = 3600
        break

      case "1d":
        seconds = 86400
        break

      case "1m":
        seconds = 2592000
        break
    }

    return history.filter(
      (item) =>
        now - item.ts <= seconds
    )

  }, [history, timeFilter])

  // ===========================================================================
  // EXPORT CSV
  // ===========================================================================
  const exportCSV = () => {

    if (!history.length) return

    const headers =
      Object.keys(history[0])

    const csvRows = []

    csvRows.push(
      headers.join(",")
    )

    history.forEach((row) => {

      const values =
        headers.map((header) => {

          let value =
            row[
              header as keyof typeof row
            ]

          if (header === "ts") {

            value = new Date(
              Number(value) * 1000
            ).toLocaleString()
          }

          return `"${value}"`
        })

      csvRows.push(
        values.join(",")
      )
    })

    const csvContent =
      csvRows.join("\n")

    const blob = new Blob(
      [csvContent],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    )

    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement("a")

    const filename =
      `CIDMA_EquipoAzul_${
        new Date()
          .toISOString()
          .replace(/[:.]/g, "-")
      }.csv`

    link.href = url

    link.setAttribute(
      "download",
      filename
    )

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)
  }

  return (

    <div className="min-h-screen bg-background">

      {/* =============================================================== */}
      {/* HEADER */}
      {/* =============================================================== */}
      <header className="
        sticky
        top-0
        z-20
        border-b
        border-border
        bg-background/80
        backdrop-blur-xl
      ">

        <div className="
          mx-auto
          flex
          max-w-7xl
          flex-col
          gap-3
          px-4
          py-4
          md:flex-row
          md:items-center
          md:justify-between
          md:px-6
          md:py-5
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-primary/15
              text-primary
              glow-primary
            ">

              <Activity className="h-6 w-6" />

            </div>

            <div>

              <h1 className="
                text-balance
                text-xl
                font-semibold
                tracking-tight
                text-foreground
                md:text-2xl
              ">
                CIDMA Manufacturing Cell Process
              </h1>

              <p className="
                text-sm
                font-medium
                text-primary
              ">
                Blue Team
              </p>

            </div>

          </div>

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              hidden
              items-center
              gap-2
              rounded-full
              border
              border-border
              bg-card/60
              px-3.5
              py-2
              text-xs
              text-muted-foreground
              backdrop-blur-sm
              sm:flex
            ">

              <Clock className="h-3.5 w-3.5" />

              <span className="
                font-mono
                tabular-nums
              ">
                {formatClock(data?.ts)}
              </span>

            </div>

            <ConnectionIndicator
              status={status}
            />

          </div>

        </div>

      </header>

      {/* =============================================================== */}
      {/* MAIN */}
      {/* =============================================================== */}
      <main className="
        mx-auto
        max-w-7xl
        space-y-12
        px-4
        py-8
        md:px-6
        md:py-10
      ">

        {/* =========================================================== */}
        {/* FINANCIAL */}
        {/* =========================================================== */}
        <section>

          <SectionHeader
            title="Financial and Energy Indicators"
            subtitle="Accumulated production value, losses and energy footprint"
            icon={
              <CircleDollarSign className="h-5 w-5" />
            }
            accent="primary"
          />

          <div className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
          ">

            <KpiCard
              label="Bottle Production Cost"
              value={formatMXN(data?.AZUL_TotalRevenue_MXN ?? 0)}
              hint="Accumulated value of produced bottles"
              icon={<Banknote className="h-5 w-5" />}
              accent="primary"
            />

            <KpiCard
              label="Money Lost"
              value={formatMXN(data?.AZUL_MoneyLost_MXN ?? 0)}
              hint="Cost of defective output"
              icon={<TrendingDown className="h-5 w-5" />}
              accent="danger"
            />

            <KpiCard
              label="Energy Cost"
              value={formatMXN(data?.AZUL_EnergyCost_MXN ?? 0)}
              hint="Electricity expenditure"
              icon={<CircleDollarSign className="h-5 w-5" />}
              accent="warning"
            />

            <KpiCard
              label="Energy Consumption"
              value={formatNumber(data?.AZUL_Energy_kWh ?? 0, 2)}
              unit="kWh"
              hint="Total cell consumption"
              icon={<Zap className="h-5 w-5" />}
              accent="accent"
            />

          </div>

        </section>

        {/* =========================================================== */}
        {/* TRAFFIC LIGHT */}
        {/* =========================================================== */}
        <section>

          <SectionHeader
            title="Process Status"
            subtitle="Live operational state of the manufacturing cell"
            icon={<TrafficCone className="h-5 w-5" />}
            accent="warning"
          />

          <TrafficLight
            value={data?.AZUL_TrafficLight ?? 0}
          />

        </section>

        {/* =========================================================== */}
        {/* SPC */}
        {/* =========================================================== */}
        <section>

          <SectionHeader
            title="Kalman Filter and Statistical Process Control"
            subtitle="Historical and real-time monitoring of filling stability and control limits"
            icon={<LineChart className="h-5 w-5" />}
            accent="accent"
          />

          {/* FILTER BAR */}
          <div className="
            mb-5
            flex
            flex-wrap
            items-center
            gap-2
          ">

            <Button
              variant={
                timeFilter === "5m"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setTimeFilter("5m")
              }
            >
              5 Min
            </Button>

            <Button
              variant={
                timeFilter === "1h"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setTimeFilter("1h")
              }
            >
              1 Hour
            </Button>

            <Button
              variant={
                timeFilter === "1d"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setTimeFilter("1d")
              }
            >
              1 Day
            </Button>

            <Button
              variant={
                timeFilter === "1m"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setTimeFilter("1m")
              }
            >
              1 Month
            </Button>

            <div className="ml-auto">

              <Button
                variant="secondary"
                onClick={exportCSV}
              >

                <Download className="
                  mr-2
                  h-4
                  w-4
                " />

                Export CSV

              </Button>

            </div>

          </div>

          <SpcChart
            history={filteredHistory}
          />

        </section>

        {/* =========================================================== */}
        {/* PRODUCTION */}
        {/* =========================================================== */}
        <section>

          <SectionHeader
            title="Bottle Production Monitoring"
            subtitle="Completed bottles by station"
            icon={<Package className="h-5 w-5" />}
            accent="success"
          />

          <ProductionSection
            robot={data?.AZUL_RobotCompleted ?? 0}
            camera={data?.AZUL_CameraCompleted ?? 0}
            warehouse={data?.AZUL_WarehouseCompleted ?? 0}
            good={data?.AZUL_GoodBottles ?? 0}
            bad={data?.AZUL_BadBottles ?? 0}
          />

        </section>

        {/* =========================================================== */}
        {/* OEE */}
        {/* =========================================================== */}
        <section>

          <SectionHeader
            title="Overall Equipment Effectiveness"
            subtitle="Global process efficiency and performance indicators"
            icon={<GaugeIcon className="h-5 w-5" />}
            accent="accent"
          />

          <div className="
            grid
            gap-4
            lg:grid-cols-3
          ">

            <div className="
              flex
              items-center
              justify-center
              lg:col-span-1
            ">

              <Gauge
                value={data?.AZUL_OEE ?? 0}
                label="OEE"
                size="lg"
              />

            </div>

            <div className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-3
              lg:col-span-2
            ">

              <Gauge
                value={data?.AZUL_Availability ?? 0}
                label="Availability"
                size="sm"
              />

              <Gauge
                value={data?.AZUL_Performance ?? 0}
                label="Performance"
                size="sm"
              />

              <Gauge
                value={data?.AZUL_Quality ?? 0}
                label="Quality"
                size="sm"
              />

            </div>

          </div>

        </section>

        {/* =========================================================== */}
        {/* FOOTER */}
        {/* =========================================================== */}
        <footer className="
          flex
          flex-col
          items-center
          justify-between
          gap-2
          border-t
          border-border
          pt-6
          text-xs
          text-muted-foreground
          sm:flex-row
        ">

          <span className="
            flex
            items-center
            gap-2
          ">

            <BarChart3 className="h-3.5 w-3.5" />

            CIDMA Smart Factory · HiveMQ · /Tec/Pue/Ingles/Azul/Celda

          </span>

          <span className="
            font-mono
            tabular-nums
          ">

            {data
              ? `Active ${formatDuration(
                  data.AZUL_ActiveTime_s
                )} / Elapsed ${formatDuration(
                  data.AZUL_ElapsedTime_s
                )}`
              : "Awaiting telemetry…"}

          </span>

        </footer>

      </main>

    </div>
  )
}
