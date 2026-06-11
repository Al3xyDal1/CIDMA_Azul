"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import mqtt from "mqtt"

const BROKER_URL = "wss://broker.hivemq.com:8884/mqtt"

const TOPICS = [
  "/Tec/Pue/Ingles/Azul/Celda",
  "Tec/Pue/Ingles/Azul/Celda",
]

const MAX_HISTORY = 50000

export type CellPayload = {
  ts: number

  AZUL_Availability: number
  AZUL_Performance: number
  AZUL_Quality: number
  AZUL_OEE: number

  AZUL_TotalBottles: number
  AZUL_GoodBottles: number
  AZUL_BadBottles: number

  AZUL_RobotCompleted: number
  AZUL_CameraCompleted: number
  AZUL_WarehouseCompleted: number

  AZUL_Energy_kWh: number
  AZUL_EnergyCost_MXN: number

  AZUL_TotalRevenue_MXN: number
  AZUL_MoneyLost_MXN: number

  AZUL_CameraKalman: number
  AZUL_CameraMean: number
  AZUL_CameraStd: number
  AZUL_CameraUCL: number
  AZUL_CameraLCL: number
  AZUL_MRMean: number

  AZUL_TrafficLight: number

  AZUL_ActiveTime_s: number
  AZUL_ElapsedTime_s: number
}

export type ConnectionStatus =
  | "connected"
  | "reconnecting"
  | "disconnected"

const num = (v: unknown): number => {
  const n =
    typeof v === "string"
      ? Number.parseFloat(v)
      : (v as number)

  return Number.isFinite(n) ? n : 0
}

export function useMqttCell() {

  const [status, setStatus] =
    useState<ConnectionStatus>("disconnected")

  const [data, setData] =
    useState<CellPayload | null>(null)

  const [history, setHistory] =
    useState<CellPayload[]>([])

  const [lastUpdate, setLastUpdate] =
    useState<number | null>(null)

  const clientRef =
    useRef<mqtt.MqttClient | null>(null)

  const handleMessage = useCallback((raw: string) => {

    let parsed: Record<string, unknown>

    try {

      parsed = JSON.parse(raw)

      if (Array.isArray(parsed)) {
        parsed = parsed[0] ?? {}
      }

    } catch (err) {

      console.log(
        "[MQTT] Failed to parse payload:",
        err
      )

      return
    }

    const ts =
      num(parsed.ts) ||
      Math.floor(Date.now() / 1000)

    const payload: CellPayload = {

      ts,

      AZUL_Availability:
        num(parsed.AZUL_Availability),

      AZUL_Performance:
        num(parsed.AZUL_Performance),

      AZUL_Quality:
        num(parsed.AZUL_Quality),

      AZUL_OEE:
        num(parsed.AZUL_OEE),

      AZUL_TotalBottles:
        num(parsed.AZUL_TotalBottles),

      AZUL_GoodBottles:
        num(parsed.AZUL_GoodBottles),

      AZUL_BadBottles:
        num(parsed.AZUL_BadBottles),

      AZUL_RobotCompleted:
        num(parsed.AZUL_RobotCompleted),

      AZUL_CameraCompleted:
        num(parsed.AZUL_CameraCompleted),

      AZUL_WarehouseCompleted:
        num(parsed.AZUL_WarehouseCompleted),

      AZUL_Energy_kWh:
        num(parsed.AZUL_Energy_kWh),

      AZUL_EnergyCost_MXN:
        num(parsed.AZUL_EnergyCost_MXN),

      AZUL_TotalRevenue_MXN:
        num(parsed.AZUL_TotalRevenue_MXN),

      AZUL_MoneyLost_MXN:
        num(parsed.AZUL_MoneyLost_MXN),

      AZUL_CameraKalman:
        num(parsed.AZUL_CameraKalman),

      AZUL_CameraMean:
        num(parsed.AZUL_CameraMean),

      AZUL_CameraStd:
        num(parsed.AZUL_CameraStd),

      AZUL_CameraUCL:
        num(parsed.AZUL_CameraUCL),

      AZUL_CameraLCL:
        num(parsed.AZUL_CameraLCL),

      AZUL_MRMean:
        num(parsed.AZUL_MRMean),

      AZUL_TrafficLight:
        num(parsed.AZUL_TrafficLight),

      AZUL_ActiveTime_s:
        num(parsed.AZUL_ActiveTime_s),

      AZUL_ElapsedTime_s:
        num(parsed.AZUL_ElapsedTime_s),
    }

    setData(payload)

    setLastUpdate(Date.now())

    setHistory((prev) => {

      const next = [
        ...prev,
        payload
      ]

      return next.length > MAX_HISTORY
        ? next.slice(next.length - MAX_HISTORY)
        : next
    })

  }, [])

  useEffect(() => {

    setStatus("reconnecting")

    const client = mqtt.connect(
      BROKER_URL,
      {
        clientId:
          `cidma_azul_${
            Math.random()
              .toString(16)
              .slice(2, 10)
          }`,

        reconnectPeriod: 3000,
        connectTimeout: 8000,
        clean: true,
      }
    )

    clientRef.current = client

    client.on("connect", () => {

      console.log("[MQTT] Connected")

      setStatus("connected")

      client.subscribe(
        TOPICS,
        { qos: 1 },
        (err) => {

          if (err) {
            console.log(
              "[MQTT] Subscribe error:",
              err.message
            )
            return
          }

          console.log(
            "[MQTT] Subscribed"
          )
        }
      )
    })

    client.on("reconnect", () => {
      setStatus("reconnecting")
    })

    client.on("offline", () => {
      setStatus("disconnected")
    })

    client.on("error", (err) => {

      console.log(
        "[MQTT] Error:",
        err.message
      )

      setStatus("reconnecting")
    })

    client.on(
      "message",
      (_, message) => {

        handleMessage(
          message.toString()
        )
      }
    )

    return () => {

      client.end(true)

      clientRef.current = null
    }

  }, [handleMessage])

  return {
    status,
    data,
    history,
    lastUpdate
  }
}