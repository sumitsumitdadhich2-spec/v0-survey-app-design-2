import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Gift, Share2, CheckCircle2, ArrowLeft } from "lucide-react"
import { ReferralLink } from "@/components/referral-link"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdLeaderboard, AdRectangle } from "@/components/ad-banner"

export default async function ReferralsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile with referral code
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get referred users
  const { data: referredUsers } = await supabase
    .from("profiles")
    .select("id, email, created_at, referral_bonus_earned")
    .eq("referred_by", user.id)
    .order("created_at", { ascending: false })

  // Count bonus earned
  const bonusEarned = referredUsers?.filter((r) => r.referral_bonus_earned).length || 0
  const pendingBonus = (referredUsers?.length || 0) - bonusEarned

  const totalReferrals = referredUsers?.length || 0
  const maxReferrals = 4
  const referralProgressPercent = Math.min((totalReferrals / maxReferrals) * 100, 100)

  const referralLink = profile?.referral_code
    ? `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.com"}/auth/sign-up?ref=${profile.referral_code}`
    : ""

  return (
    <div className="flex flex-col gap-6">
      <AdLeaderboard />

      <Button variant="ghost" asChild className="w-fit">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Referral Program</h1>
        <p className="mt-1 text-sm text-gray-600">
          Invite friends and earn $5 for each friend who completes their first survey (Max 4 referrals)
        </p>
      </div>

      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle>Your Referral Progress</CardTitle>
          <CardDescription>
            {totalReferrals < maxReferrals
              ? `You can refer ${maxReferrals - totalReferrals} more ${maxReferrals - totalReferrals === 1 ? "friend" : "friends"}`
              : "You've reached the maximum referral limit!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-900">
                {totalReferrals} / {maxReferrals}
              </div>
              <p className="text-sm text-gray-600">Referrals made</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-700">${(bonusEarned * 5).toFixed(2)}</div>
              <p className="text-sm text-gray-600">Total earned</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-purple-900">{Math.round(referralProgressPercent)}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-purple-100">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500"
                style={{ width: `${referralProgressPercent}%` }}
              />
            </div>
          </div>
          {totalReferrals >= maxReferrals && (
            <div className="rounded-lg bg-green-100 p-3 text-center text-sm font-medium text-green-800">
              Congratulations! You've completed all 4 referrals
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReferrals}</div>
            <p className="text-xs text-gray-600">Out of {maxReferrals} maximum</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bonuses Earned</CardTitle>
            <Gift className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bonusEarned}</div>
            <p className="text-xs text-gray-600">${(bonusEarned * 5).toFixed(2)} total earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bonuses</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBonus}</div>
            <p className="text-xs text-gray-600">Waiting for first survey</p>
          </CardContent>
        </Card>
      </div>

      <AdRectangle />

      {/* Referral Link */}
      {totalReferrals < maxReferrals && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              <CardTitle>Your Referral Link</CardTitle>
            </div>
            <CardDescription>Share this link with friends to earn $5 per referral</CardDescription>
          </CardHeader>
          <CardContent>
            <ReferralLink link={referralLink} code={profile?.referral_code || ""} />
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Share Your Link</h3>
              <p className="text-sm text-gray-600">Send your unique referral link to friends and family</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">They Sign Up</h3>
              <p className="text-sm text-gray-600">Your friend creates an account using your referral link</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">They Complete First Survey</h3>
              <p className="text-sm text-gray-600">Once they finish their first survey, you both get rewarded</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-600">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Earn $5 Bonus</h3>
              <p className="text-sm text-gray-600">$5 is automatically added to your wallet</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referred Users List */}
      {referredUsers && referredUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
            <CardDescription>Track the status of your referred friends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referredUsers.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{referral.email}</p>
                    <p className="text-sm text-gray-600">Joined {new Date(referral.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    {referral.referral_bonus_earned ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                        <CheckCircle2 className="h-4 w-4" />
                        Earned $5
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <AdLeaderboard className="mt-4" />
    </div>
  )
}
