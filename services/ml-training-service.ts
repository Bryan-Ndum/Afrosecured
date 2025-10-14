import { createClient } from "@/lib/supabase/server"

interface TrainingData {
  features: number[]
  label: number // 0 = legitimate, 1 = fraud
  transactionId: string
}

interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
}

export class MLTrainingService {
  private supabase = createClient()

  async collectTrainingData(): Promise<TrainingData[]> {
    const { data: transactions } = await this.supabase
      .from("transactions")
      .select("*")
      .not("is_fraud", "is", null)
      .order("created_at", { ascending: false })
      .limit(10000)

    if (!transactions) return []

    return transactions.map((tx) => ({
      features: this.extractFeatures(tx),
      label: tx.is_fraud ? 1 : 0,
      transactionId: tx.id,
    }))
  }

  private extractFeatures(transaction: any): number[] {
    return [
      transaction.amount,
      this.getHourOfDay(transaction.created_at),
      this.getDayOfWeek(transaction.created_at),
      transaction.sender_transaction_count || 0,
      transaction.recipient_transaction_count || 0,
      transaction.time_since_last_transaction || 0,
      transaction.amount_deviation_from_average || 0,
      transaction.is_new_recipient ? 1 : 0,
      transaction.is_international ? 1 : 0,
      transaction.device_change ? 1 : 0,
    ]
  }

  private getHourOfDay(timestamp: string): number {
    return new Date(timestamp).getHours()
  }

  private getDayOfWeek(timestamp: string): number {
    return new Date(timestamp).getDay()
  }

  async trainModel(trainingData: TrainingData[]): Promise<ModelMetrics> {
    // Simple logistic regression implementation
    const weights = new Array(trainingData[0].features.length).fill(0)
    const learningRate = 0.01
    const epochs = 100

    for (let epoch = 0; epoch < epochs; epoch++) {
      for (const sample of trainingData) {
        const prediction = this.sigmoid(this.dotProduct(weights, sample.features))
        const error = sample.label - prediction

        for (let i = 0; i < weights.length; i++) {
          weights[i] += learningRate * error * sample.features[i]
        }
      }
    }

    await this.saveModel(weights)
    return this.evaluateModel(weights, trainingData)
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x))
  }

  private dotProduct(weights: number[], features: number[]): number {
    return weights.reduce((sum, w, i) => sum + w * features[i], 0)
  }

  private async saveModel(weights: number[]): Promise<void> {
    await this.supabase.from("ml_models").insert({
      model_type: "fraud_detection",
      weights: weights,
      version: Date.now(),
      trained_at: new Date().toISOString(),
    })
  }

  private evaluateModel(weights: number[], testData: TrainingData[]): ModelMetrics {
    let truePositives = 0
    let falsePositives = 0
    let trueNegatives = 0
    let falseNegatives = 0

    for (const sample of testData) {
      const prediction = this.sigmoid(this.dotProduct(weights, sample.features))
      const predictedLabel = prediction > 0.5 ? 1 : 0

      if (predictedLabel === 1 && sample.label === 1) truePositives++
      if (predictedLabel === 1 && sample.label === 0) falsePositives++
      if (predictedLabel === 0 && sample.label === 0) trueNegatives++
      if (predictedLabel === 0 && sample.label === 1) falseNegatives++
    }

    const accuracy = (truePositives + trueNegatives) / testData.length
    const precision = truePositives / (truePositives + falsePositives) || 0
    const recall = truePositives / (truePositives + falseNegatives) || 0
    const f1Score = (2 * (precision * recall)) / (precision + recall) || 0

    return { accuracy, precision, recall, f1Score }
  }

  async getLatestModel(): Promise<number[]> {
    const { data } = await this.supabase
      .from("ml_models")
      .select("weights")
      .eq("model_type", "fraud_detection")
      .order("trained_at", { ascending: false })
      .limit(1)
      .single()

    return data?.weights || []
  }

  async predictFraud(features: number[]): Promise<number> {
    const weights = await this.getLatestModel()
    if (weights.length === 0) return 0.5

    return this.sigmoid(this.dotProduct(weights, features))
  }
}
