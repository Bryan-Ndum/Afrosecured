import { NextResponse } from "next/server"
import { OfflineSyncService } from "@/services/offline-sync-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const deviceId = searchParams.get("deviceId")

  if (!deviceId) {
    return NextResponse.json({ error: "Device ID required" }, { status: 400 })
  }

  try {
    const syncService = new OfflineSyncService()

    const lastSync = await syncService.getDeviceLastSync(deviceId)
    const syncPackage = await syncService.generateSyncPackage()

    if (syncPackage.version <= lastSync) {
      return NextResponse.json({
        upToDate: true,
        currentVersion: lastSync,
      })
    }

    const compressed = await syncService.compressSyncPackage(syncPackage)
    await syncService.recordSync(deviceId, syncPackage.version)

    return new NextResponse(compressed, {
      headers: {
        "Content-Type": "application/octet-stream",
        "X-Sync-Version": syncPackage.version.toString(),
        "X-Last-Updated": syncPackage.lastUpdated,
      },
    })
  } catch (error) {
    console.error("[v0] Sync package generation failed:", error)
    return NextResponse.json(
      {
        error: "Sync failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
