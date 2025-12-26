import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ArrowUpRight, ArrowDownRight, Gift, ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdLeaderboard, AdRectangle } from "@/components/ad-banner"

export default async function WalletPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get wallet data
  const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single()

  const { data: completedSurveys } = await supabase
    .from("survey_completions")
    .select("survey_id")
    .eq("user_id", user.id)

  // Get all transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const canWithdrawSurvey = wallet && wallet.survey_earnings >= 25
  const canWithdrawReferral = wallet && wallet.referral_earnings >= 25
  const canWithdraw = canWithdrawSurvey || canWithdrawReferral

  const completedCount = completedSurveys?.length || 0
  const surveysNeeded = Math.max(0, 20 - completedCount)
  const surveyEarnings = wallet?.survey_earnings || 0
  const referralEarnings = wallet?.referral_earnings || 0

  return (
    <div className="flex flex-col gap-6">
      <AdLeaderboard />

      <Button variant="ghost" asChild className="w-fit">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your earnings and track transactions</p>
        </div>
        {canWithdraw && (
          <Button asChild>
            <Link href="/withdraw">Withdraw Funds</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-900">${wallet?.balance?.toFixed(2) || "0.00"}</div>
            <p className="mt-2 text-sm text-gray-600">{canWithdraw ? "Ready to withdraw" : "Keep earning to unlock"}</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Survey Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">${surveyEarnings.toFixed(2)}</div>
            <p className="mt-2 text-xs text-gray-600">
              {surveyEarnings >= 24
                ? "Max limit reached ($24)"
                : `Need $${(25 - surveyEarnings).toFixed(2)} more to withdraw`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gift className="h-5 w-5 text-purple-600" />
              Referral Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">${referralEarnings.toFixed(2)}</div>
            <p className="mt-2 text-xs text-gray-600">
              {referralEarnings >= 25
                ? "Ready to withdraw"
                : `Need $${(25 - referralEarnings).toFixed(2)} more to withdraw`}
            </p>
          </CardContent>
        </Card>
      </div>

      <AdRectangle />

      {/* Withdrawal Info */}
      {!canWithdraw && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-orange-100 p-2">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900">Withdrawal Requirements</h3>
                <div className="mt-2 space-y-2 text-sm text-orange-800">
                  <p>
                    <strong>Survey Earnings:</strong> ${surveyEarnings.toFixed(2)} / $25.00 minimum
                    {surveyEarnings < 24 && ` (${surveysNeeded} more surveys needed)`}
                  </p>
                  <p>
                    <strong>Referral Earnings:</strong> ${referralEarnings.toFixed(2)} / $25.00 minimum
                    {referralEarnings < 25 && ` (${Math.ceil((25 - referralEarnings) / 5)} more referrals needed)`}
                  </p>
                  <p className="mt-2 text-xs text-orange-700">
                    Note: Survey and referral earnings are tracked separately. Each requires $25 minimum to withdraw.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All your earnings and withdrawals</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => {
                let icon = ArrowUpRight
                let iconColor = "text-green-600"
                let iconBg = "bg-green-100"

                if (transaction.type === "withdrawal") {
                  icon = ArrowDownRight
                  iconColor = "text-red-600"
                  iconBg = "bg-red-100"
                } else if (transaction.type === "referral_bonus") {
                  icon = Gift
                  iconColor = "text-purple-600"
                  iconBg = "bg-purple-100"
                }

                const Icon = icon

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${iconBg}`}>
                        <Icon className={`h-4 w-4 ${iconColor}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {transaction.type === "survey_reward"
                            ? "Survey Reward"
                            : transaction.type === "referral_bonus"
                              ? "Referral Bonus"
                              : "Withdrawal"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-lg font-semibold ${transaction.type === "withdrawal" ? "text-red-600" : "text-green-600"}`}
                    >
                      {transaction.type === "withdrawal" ? "-" : "+"}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-600">No transactions yet</p>
              <Button variant="outline" className="mt-4 bg-transparent" asChild>
                <Link href="/surveys">Start Earning</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AdLeaderboard className="mt-4" />
    </div>
  )
}
