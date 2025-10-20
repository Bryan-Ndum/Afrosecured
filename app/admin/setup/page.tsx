"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AdminSetupPage() {
  const email = "afrosecured@gmail.com"
  const password = "Pembroke$23"
  const confirmPassword = "Pembroke$23" // Added to maintain consistency with the original code

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSetup = async () => {
    setLoading(true)
    setError("")
    setSuccess(false)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError

      if (authData.user) {
        // Create admin profile
        const { error: profileError } = await supabase.from("user_profiles").insert({
          id: authData.user.id,
          email: email,
          role: "admin",
        })

        if (profileError) throw profileError

        setSuccess(true)

        setTimeout(() => {
          window.location.href = "/auth/login"
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create admin account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/50 border-slate-800 p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="w-8 h-8 text-cyan-500" />
          <h1 className="text-2xl font-bold text-white">Admin Setup</h1>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-green-400 font-medium">Admin account created successfully!</p>
                <p className="text-green-400/70 text-sm">Redirecting to login...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <p className="text-sm text-slate-300 mb-2">
                  <span className="font-semibold">Email:</span> {email}
                </p>
                <p className="text-sm text-slate-300">
                  <span className="font-semibold">Password:</span> {password}
                </p>
              </div>

              <p className="text-xs text-slate-400 text-center">
                Click below to create your admin account with these credentials
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button onClick={handleSetup} disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700">
              {loading ? "Creating Admin Account..." : "Create Admin Account"}
            </Button>

            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-400">
                ⚠️ After creating your account, you should delete this setup page for security.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
