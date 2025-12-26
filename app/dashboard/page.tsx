import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdLeaderboard, AdRectangle } from "@/components/ad-banner"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get wallet data
  const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single()

  // Get survey completion count
  const { count: surveysCompleted } = await supabase
    .from("survey_completions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  // Get referral count
  const { count: referralCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("referred_by", user.id)

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const surveysNeeded = 20
  const progressPercent = Math.min(((surveysCompleted || 0) / surveysNeeded) * 100, 100)
  const remainingSurveys = Math.max(0, surveysNeeded - (surveysCompleted || 0))

  const stats = [
    {
      title: "Current Balance",
      value: `$${wallet?.balance?.toFixed(2) || "0.00"}`,
      description: "Available for withdrawal",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Earned",
      value: `$${wallet?.total_earned?.toFixed(2) || "0.00"}`,
      description: "Lifetime earnings",
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Surveys Completed",
      value: surveysCompleted || 0,
      description: "Total surveys",
      icon: FileText,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Referrals",
      value: referralCount || 0,
      description: "Friends referred",
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <AdLeaderboard />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Welcome back! Here's your earning summary</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`rounded-lg p-2 ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {remainingSurveys > 0
              ? `Complete ${remainingSurveys} more surveys to reach $25 minimum withdrawal`
              : "You can now withdraw your earnings!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-900">
                {surveysCompleted || 0} / {surveysNeeded}
              </div>
              <p className="text-sm text-gray-600">Surveys completed</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-700">${wallet?.balance?.toFixed(2) || "0.00"}</div>
              <p className="text-sm text-gray-600">Current balance</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress to $25</span>
              <span className="font-semibold text-blue-900">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <AdRectangle />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these options</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/surveys">Browse Surveys</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/referrals">Share Referral Link</Link>
          </Button>
          {wallet && wallet.balance >= 25 && (
            <Button variant="outline" asChild>
              <Link href="/withdraw">Request Withdrawal</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest earnings and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions && recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.type === "survey_reward"
                        ? "Survey Completed"
                        : transaction.type === "referral_bonus"
                          ? "Referral Bonus"
                          : "Withdrawal"}
                    </p>
                    <p className="text-sm text-gray-600">{new Date(transaction.created_at).toLocaleDateString()}</p>
                  </div>
                  <div
                    className={`text-lg font-semibold ${transaction.type === "withdrawal" ? "text-red-600" : "text-green-600"}`}
                  >
                    {transaction.type === "withdrawal" ? "-" : "+"}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-600">No activity yet. Complete a survey to get started!</p>
          )}
        </CardContent>
      </Card>

      <AdLeaderboard className="mt-4" />
    </div>
  )
}
