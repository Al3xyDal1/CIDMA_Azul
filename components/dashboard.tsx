"use client"

import { useMemo, useState } from "react"

import { useMqttCell } from "@/hooks/use-mqtt-cell"

import { Gauge } from "@/components/gauge"
import { KpiCard } from "@/components/kpi-card"
import { SpcChart } from "@/components/spc-chart"
import { TrafficLight } from "@/components/traffic-light"
import { ConnectionIndicator } from "@/components/connection-indicator"
import { ProductionSection } from "@/components/production-section"

export function Dashboard() {

  const {
    data,
    history,
    status
  } = useMqttCell()

  const [timeFilter, setTimeFilter] =
    useState("5m")

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

  if (!data) {

    return (

      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      ">
        Waiting for MQTT data...
      </div>
    )
  }

  return (

    <div className="
      min-h-screen
      bg-black
      text-white
      p-6
    ">

      <div className="
        flex
        justify-between
        items-center
        mb-8
      ">

        <div>

          <h1 className="
            text-4xl
            font-bold
          ">
            Proceso Celda de Manufactura CIDMA
          </h1>

          <p className="
            text-zinc-400
            mt-2
          ">
            Equipo Azul
          </p>

        </div>

        <ConnectionIndicator
          status={status}
        />

      </div>

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-4
        mb-8
      ">

        <KpiCard
          label="Bottle Cost"
          value={data.AZUL_TotalRevenue_MXN}
          unit="MXN"
        />

        <KpiCard
          label="Money Lost"
          value={data.AZUL_MoneyLost_MXN}
          unit="MXN"
        />

        <KpiCard
          label="Energy Cost"
          value={data.AZUL_EnergyCost_MXN}
          unit="MXN"
        />

        <KpiCard
          label="Energy"
          value={data.AZUL_Energy_kWh}
          unit="kWh"
        />

      </div>

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
        mb-8
      ">

        <div className="
          xl:col-span-2
          bg-zinc-950
          border
          border-zinc-800
          rounded-2xl
          p-6
        ">

          <h2 className="
            text-xl
            font-semibold
            mb-6
          ">
            OEE Monitoring
          </h2>

          <div className="
            flex
            flex-col
            xl:flex-row
            gap-8
            items-center
          ">

            <Gauge
              label="OEE"
              value={data.AZUL_OEE}
              size="lg"
            />

            <div className="
              grid
              grid-cols-3
              gap-4
              w-full
            ">

              <Gauge
                label="Availability"
                value={data.AZUL_Availability}
                size="sm"
              />

              <Gauge
                label="Performance"
                value={data.AZUL_Performance}
                size="sm"
              />

              <Gauge
                label="Quality"
                value={data.AZUL_Quality}
                size="sm"
              />

            </div>

          </div>

        </div>

        <div className="
          bg-zinc-950
          border
          border-zinc-800
          rounded-2xl
          p-6
        ">

          <h2 className="
            text-xl
            font-semibold
            mb-6
          ">
            Process Status
          </h2>

          <TrafficLight
            value={data.AZUL_TrafficLight}
          />

        </div>

      </div>

      <div className="
        bg-zinc-950
        border
        border-zinc-800
        rounded-2xl
        p-6
        mb-8
      ">

        <div className="
          flex
          items-center
          gap-2
          mb-6
        ">

          <button
            onClick={() =>
              setTimeFilter("5m")
            }
            className={`
              px-4
              py-2
              rounded-lg
              transition
              ${
                timeFilter === "5m"
                  ? "bg-cyan-500 text-black"
                  : "bg-zinc-800 text-zinc-300"
              }
            `}
          >
            5 Min
          </button>

          <button
            onClick={() =>
              setTimeFilter("1h")
            }
            className={`
              px-4
              py-2
              rounded-lg
              transition
              ${
                timeFilter === "1h"
                  ? "bg-cyan-500 text-black"
                  : "bg-zinc-800 text-zinc-300"
              }
            `}
          >
            1 Hour
          </button>

          <button
            onClick={() =>
              setTimeFilter("1d")
            }
            className={`
              px-4
              py-2
              rounded-lg
              transition
              ${
                timeFilter === "1d"
                  ? "bg-cyan-500 text-black"
                  : "bg-zinc-800 text-zinc-300"
              }
            `}
          >
            1 Day
          </button>

          <button
            onClick={() =>
              setTimeFilter("1m")
            }
            className={`
              px-4
              py-2
              rounded-lg
              transition
              ${
                timeFilter === "1m"
                  ? "bg-cyan-500 text-black"
                  : "bg-zinc-800 text-zinc-300"
              }
            `}
          >
            1 Month
          </button>

          <button
            onClick={exportCSV}
            className="
              ml-auto
              px-4
              py-2
              rounded-lg
              bg-emerald-500
              hover:bg-emerald-400
              text-black
            "
          >
            Export CSV
          </button>

        </div>

        <SpcChart
          history={filteredHistory}
        />

      </div>

      <ProductionSection
        robot={data.AZUL_RobotCompleted}
        camera={data.AZUL_CameraCompleted}
        warehouse={data.AZUL_WarehouseCompleted}
        good={data.AZUL_GoodBottles}
        bad={data.AZUL_BadBottles}
      />

    </div>
  )
}