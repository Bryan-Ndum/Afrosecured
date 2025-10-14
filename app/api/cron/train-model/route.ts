import { NextResponse } from "next/server"
import { MLTrainingService } from "@/services/ml-training-service"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const mlService = new MLTrainingService()

    console.log("[v0] Collecting training data...")
    const trainingData = await mlService.collectTrainingData()

    if (trainingData.length < 100) {
      return NextResponse.json({
        message: "Insufficient training data",
        dataPoints: trainingData.length,
      })
    }

    console.log("[v0] Training model with", trainingData.length, "samples")
    const metrics = await mlService.trainModel(trainingData)

    console.log("[v0] Model trained successfully:", metrics)

    return NextResponse.json({
      success: true,
      metrics,
      trainingDataSize: trainingData.length,
      trainedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Model training failed:", error)
    return NextResponse.json(
      {
        error: "Model training failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
