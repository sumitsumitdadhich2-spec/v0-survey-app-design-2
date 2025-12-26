"use client"

import type React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const referralCode = searchParams.get("ref")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedTerms) {
      setError("You must accept the Terms & Conditions to continue")
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) throw authError

      // If referral code provided, update the profile
      if (referralCode && authData.user) {
        // Wait a moment for the trigger to create the profile
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Find referrer by referral code
        const { data: referrerData } = await supabase
          .from("profiles")
          .select("id")
          .eq("referral_code", referralCode.toUpperCase())
          .single()

        if (referrerData) {
          // Update the new user's profile with referrer
          await supabase.from("profiles").update({ referred_by: referrerData.id }).eq("id", authData.user.id)
        }
      }

      router.push("/auth/verify-email")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">SurveyPay</h1>
          <p className="mt-2 text-sm text-gray-600">Earn money by sharing your opinion</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Sign up to start earning money from surveys</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">Confirm Password</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {referralCode && (
                  <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                    {"You were referred! You'll get $5 after completing your first survey."}
                  </div>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    disabled={isLoading}
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed text-gray-700">
                    {"I accept the "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
                    >
                      Terms & Conditions
                    </Link>
                    {" and "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || !acceptedTerms}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
                <p className="text-center text-xs text-gray-500">
                  By signing up, you agree to complete at least 20 surveys to reach the $25 minimum withdrawal threshold
                </p>
              </div>
              <div className="mt-4 text-center text-sm">
                {"Already have an account? "}
                <Link href="/auth/login" className="font-medium text-blue-600 underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  )
}
