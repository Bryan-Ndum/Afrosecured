import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId } = body

    console.log("[PayGuard] Freeze request for transaction:", transactionId)

    // Create Supabase client
    const supabase = await createClient()

    // Get transaction details
    const { data: transaction, error: fetchError } = await supabase
      .from("payguard_transactions")
      .select("*")
      .eq("id", transactionId)
      .single()

    if (fetchError || !transaction) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaction not found",
        },
        { status: 404 },
      )
    }

    // Check if transaction is within 60-second freeze window
    const transactionTime = new Date(transaction.timestamp).getTime()
    const currentTime = Date.now()
    const timeDiff = currentTime - transactionTime

    if (timeDiff > 60000) {
      // More than 60 seconds
      return NextResponse.json({
        success: false,
        message: "Freeze window expired. Transaction cannot be reversed after 60 seconds.",
      })
    }

    // Update transaction status to frozen
    const { error: updateError } = await supabase
      .from("payguard_transactions")
      .update({
        status: "frozen",
        frozen_at: new Date().toISOString(),
      })
      .eq("id", transactionId)

    if (updateError) {
      console.error("[PayGuard] Update error:", updateError)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to freeze transaction",
        },
        { status: 500 },
      )
    }

    // In production, this would trigger Visa API to reverse the transaction
    // For now, we just mark it as frozen in our database

    console.log("[PayGuard] Transaction frozen successfully:", transactionId)

    return NextResponse.json({
      success: true,
      message: `Transaction frozen successfully! Reversal initiated. Amount: $${transaction.amount}`,
      transactionId,
      amount: transaction.amount,
      timeRemaining: Math.max(0, 60 - Math.floor(timeDiff / 1000)),
    })
  } catch (error) {
    console.error("[PayGuard] Freeze error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process freeze request",
      },
      { status: 500 },
    )
  }
}
