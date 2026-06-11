"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts"

interface SpcChartProps {
  history: any[]
}

export function SpcChart({
  history,
}: SpcChartProps) {

  const formattedData = history.map(
    (item) => ({

      ...item,

      time: new Date(
        item.ts * 1000
      ).toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }
      ),
    })
  )

  if (!formattedData.length) {

    return (

      <div className="
        h-[500px]
        flex
        items-center
        justify-center
        text-zinc-500
      ">
        Waiting for data...
      </div>
    )
  }

  return (

    <div className="h-[500px] w-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart
          data={formattedData}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 20,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272a"
          />

          <XAxis
            dataKey="time"
            stroke="#71717a"
            tick={{
              fill: "#a1a1aa",
              fontSize: 12,
            }}
          />

          <YAxis
            stroke="#71717a"
            tick={{
              fill: "#a1a1aa",
              fontSize: 12,
            }}
          />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="AZUL_CameraKalman"
            stroke="#06b6d4"
            strokeWidth={3}
            dot={false}
            name="Kalman"
          />

          <Line
            type="monotone"
            dataKey="AZUL_CameraMean"
            stroke="#22c55e"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Mean"
          />

          <Line
            type="monotone"
            dataKey="AZUL_CameraUCL"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="10 5"
            dot={false}
            name="UCL"
          />

          <Line
            type="monotone"
            dataKey="AZUL_CameraLCL"
            stroke="#f97316"
            strokeWidth={2}
            strokeDasharray="10 5"
            dot={false}
            name="LCL"
          />

          <Brush
            dataKey="time"
            height={30}
            stroke="#06b6d4"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}