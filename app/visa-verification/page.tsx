"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Loader2, Shield, AlertTriangle } from "lucide-react"

export default function VisaVerificationPage() {
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [connectionData, setConnectionData] = useState<any>(null)
  const [aliasId, setAliasId] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [verificationData, setVerificationData] = useState<any>(null)

  const testConnection = async () => {
    setConnectionStatus("loading")
    setConnectionData(null)

    try {
      const response = await fetch("/api/visa/helloworld")
      const data = await response.json()

      if (data.success) {
        setConnectionStatus("success")
        setConnectionData(data.data)
      } else {
        setConnectionStatus("error")
        setConnectionData(data)
      }
    } catch (error) {
      setConnectionStatus("error")
      setConnectionData({ error: "Failed to connect to Visa API" })
    }
  }

  const verifyAlias = async () => {
    if (!aliasId.trim()) return

    setVerificationStatus("loading")
    setVerificationData(null)

    try {
      const response = await fetch("/api/visa/resolve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aliasId }),
      })
      const data = await response.json()

      if (data.success) {
        setVerificationStatus("success")
        setVerificationData(data.data)
      } else {
        setVerificationStatus("error")
        setVerificationData(data)
      }
    } catch (error) {
      setVerificationStatus("error")
      setVerificationData({ error: "Failed to verify alias" })
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Visa Verification Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Verify merchants and validate transactions using Visa's trusted network
          </p>
        </div>

        {/* Connection Test Card */}
        <Card className="rounded-2xl border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Test Visa API Connection
            </CardTitle>
            <CardDescription>Verify that AfroSecured can securely connect to Visa's Developer Sandbox</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testConnection} disabled={connectionStatus === "loading"} className="w-full" size="lg">
              {connectionStatus === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                "Test Connection"
              )}
            </Button>

            {connectionStatus !== "idle" && (
              <div className="p-4 rounded-xl bg-muted space-y-2">
                <div className="flex items-center gap-2">
                  {connectionStatus === "success" ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="font-semibold text-green-500">Connected Successfully</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-semibold text-red-500">Connection Failed</span>
                    </>
                  )}
                </div>
                <pre className="text-sm overflow-auto p-3 bg-background rounded-lg">
                  {JSON.stringify(connectionData, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Merchant Verification Card */}
        <Card className="rounded-2xl border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Merchant Verification
            </CardTitle>
            <CardDescription>
              Enter a merchant alias or payment ID to verify legitimacy through Visa's network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter merchant alias or payment ID..."
                value={aliasId}
                onChange={(e) => setAliasId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verifyAlias()}
                className="flex-1"
              />
              <Button onClick={verifyAlias} disabled={verificationStatus === "loading" || !aliasId.trim()} size="lg">
                {verificationStatus === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
              </Button>
            </div>

            {verificationStatus !== "idle" && (
              <div className="space-y-4">
                {verificationStatus === "success" && verificationData?.aliasResolution ? (
                  <div className="p-6 rounded-xl bg-green-500/10 border-2 border-green-500/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                        <span className="font-semibold text-lg">Merchant Verified</span>
                      </div>
                      <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30">
                        Trust Score: {verificationData.aliasResolution.trustScore}%
                      </Badge>
                    </div>

                    <div className="grid gap-3">
                      <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                        <span className="text-muted-foreground">Merchant Name</span>
                        <span className="font-semibold">{verificationData.aliasResolution.merchantName}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                        <span className="text-muted-foreground">Merchant ID</span>
                        <span className="font-mono text-sm">{verificationData.aliasResolution.merchantId}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="bg-green-500 text-white">{verificationData.aliasResolution.status}</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                        <span className="text-muted-foreground">Verified On</span>
                        <span className="text-sm">
                          {new Date(verificationData.aliasResolution.verificationDate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-red-500/10 border-2 border-red-500/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                      <span className="font-semibold text-lg">Verification Failed</span>
                    </div>
                    <pre className="text-sm overflow-auto p-3 bg-background rounded-lg">
                      {JSON.stringify(verificationData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
