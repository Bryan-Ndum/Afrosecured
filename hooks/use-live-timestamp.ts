"use client"

import { useState, useEffect } from "react"

export function useLiveTimestamp(dateString: string, updateInterval = 60000) {
  const [timestamp, setTimestamp] = useState(() => formatFullDate(dateString))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(formatFullDate(dateString))
    }, updateInterval)

    return () => clearInterval(interval)
  }, [dateString, updateInterval])

  return timestamp
}

function formatFullDate(dateString: string): string {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }

  return date.toLocaleString("en-US", options)
}

export function useLiveTime(updateInterval = 1000) {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, updateInterval)

    return () => clearInterval(interval)
  }, [updateInterval])

  return time
}
