"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Gift } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdLeaderboard } from "@/components/ad-banner"

export default function EnterCodePage() {
  const [referralCode, setReferralCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      // Get current user profile
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile?.referred_by) {
        setError("You have already used a referral code")
        setLoading(false)
        return
      }

      // Find the referrer by code
      const { data: referrer, error: referrerError } = await supabase
        .from("profiles")
        .select("id, referral_code, referral_code_usage_count, referral_count")
        .eq("referral_code", referralCode.trim().toUpperCase())
        .single()

      if (referrerError || !referrer) {
        setError("Invalid referral code")
        setLoading(false)
        return
      }

      if (referrer.id === user.id) {
        setError("You cannot use your own referral code")
        setLoading(false)
        return
      }

      // Check if referral code has been used 4 times already
      if (referrer.referral_code_usage_count >= 4) {
        setError("This referral code has reached its usage limit")
        setLoading(false)
        return
      }

      // Check if referrer has already made 4 referrals
      if (referrer.referral_count >= 4) {
        setError("This referrer has reached their referral limit")
        setLoading(false)
        return
      }

      // Update current user's profile with referrer
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ referred_by: referrer.id })
        .eq("id", user.id)

      if (updateError) {
        setError("Failed to apply referral code")
        setLoading(false)
        return
      }

      // Increment usage count on referrer's code
      await supabase
        .from("profiles")
        .update({ referral_code_usage_count: referrer.referral_code_usage_count + 1 })
        .eq("id", referrer.id)

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-2xl space-y-6">
        <AdLeaderboard />

        <Card className="w-full">
          <CardHeader>
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-purple-100 p-3">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Enter Referral Code</CardTitle>
            <CardDescription className="text-center">
              Get connected with someone who referred you and they'll earn $5 when you complete your first survey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-900">
                  Referral code applied successfully! Redirecting...
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="code">Referral Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter code (e.g., ABC123)"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    required
                    className="text-center text-lg font-semibold uppercase tracking-wider"
                    maxLength={6}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading || !referralCode.trim()}>
                  {loading ? "Applying..." : "Apply Code"}
                </Button>

                <Button type="button" variant="ghost" className="w-full" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Skip for now
                  </Link>
                </Button>
              </form>
            )}

            <div className="mt-6 rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-gray-900">How it works:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Enter a friend's referral code</li>
                <li>• They earn $5 when you complete your first survey</li>
                <li>• Each code can only be used 4 times</li>
                <li>• You can only use one referral code per account</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <AdLeaderboard />
      </div>
    </div>
  )
}
