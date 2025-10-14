import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { URLhausClient } from "@/lib/threat-intelligence/urlhaus-client"
import { AbuseIPDBClient } from "@/lib/threat-intelligence/abuseipdb-client"
import { AlienVaultClient } from "@/lib/threat-intelligence/alienvault-client"

export const maxDuration = 60 // Reduced maxDuration from 300 to 60 to comply with Vercel limits
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const startTime = Date.now()

  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const results = {
      urlhaus: { synced: 0, errors: 0, error: null as string | null },
      abuseipdb: { synced: 0, errors: 0, error: null as string | null },
      alienvault: { added: 0, updated: 0, error: null as string | null },
    }

    // Sync URLhaus data (no API key required)
    try {
      const urlhaus = new URLhausClient()
      const urlhausResults = await urlhaus.syncToDatabase()
      results.urlhaus = { ...urlhausResults, error: null }
    } catch (error) {
      results.urlhaus.error = error instanceof Error ? error.message : "Unknown error"
    }

    // Sync AbuseIPDB data (optional - skips if no API key)
    try {
      const abuseipdb = new AbuseIPDBClient()
      const abuseipdbResults = await abuseipdb.syncToDatabase()
      results.abuseipdb = { ...abuseipdbResults, error: null }
    } catch (error) {
      results.abuseipdb.error = error instanceof Error ? error.message : "Unknown error"
    }

    // Sync AlienVault OTX data
    try {
      const alienVault = new AlienVaultClient()
      const alienVaultResults = await alienVault.syncToDatabase(supabase)
      results.alienvault = { ...alienVaultResults, error: null }
    } catch (error) {
      results.alienvault.error = error instanceof Error ? error.message : "Unknown error"
    }

    // Log automation run
    await supabase.from("automation_logs").insert({
      job_name: "sync-threat-intelligence",
      job_type: "cron",
      status: results.urlhaus.error || results.abuseipdb.error || results.alienvault.error ? "partial" : "success",
      items_processed: results.urlhaus.synced + results.abuseipdb.synced + results.alienvault.added,
      items_failed:
        (results.urlhaus.error ? 1 : 0) + (results.abuseipdb.error ? 1 : 0) + (results.alienvault.error ? 1 : 0),
      execution_time_ms: Date.now() - startTime,
      metadata: results,
    })

    return NextResponse.json({
      success: true,
      results,
      executionTime: Date.now() - startTime,
    })
  } catch (error) {
    console.error("Threat intelligence sync error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
