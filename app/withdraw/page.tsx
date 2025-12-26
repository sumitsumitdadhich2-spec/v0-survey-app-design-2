import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WithdrawalForm } from "@/components/withdrawal-form"
import { DollarSign, Clock, CheckCircle2, XCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdLeaderboard, AdRectangle } from "@/components/ad-banner"

export default async function WithdrawPage() {
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

  // Get payment methods
  const { data: paymentMethods } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("user_id", user.id)
    .order("is_primary", { ascending: false })

  // Get withdrawal history
  const { data: withdrawals } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const canWithdraw = wallet && wallet.balance >= 25
  const hasPaymentMethod = paymentMethods && paymentMethods.length > 0

  const completedCount = completedSurveys?.length || 0
  const surveysNeeded = Math.max(0, 20 - completedCount)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdLeaderboard />

      <Button variant="ghost" asChild className="w-fit">
        <Link href="/wallet">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Wallet
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Withdraw Funds</h1>
        <p className="mt-1 text-sm text-gray-600">Request a withdrawal to your payment method</p>
      </div>

      {/* Balance Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Available Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-900">${wallet?.balance?.toFixed(2) || "0.00"}</div>
          <p className="mt-2 text-sm text-gray-600">Minimum withdrawal: $25.00</p>
        </CardContent>
      </Card>

      <AdRectangle />

      {/* Warnings */}
      {!canWithdraw && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900">Insufficient Balance</h3>
              <p className="mt-1 text-sm text-orange-800">
                Complete <span className="font-semibold">{surveysNeeded} more surveys</span> to reach the minimum
                withdrawal amount of $25.00
              </p>
              <p className="mt-1 text-sm text-orange-700">You need ${(25 - (wallet?.balance || 0)).toFixed(2)} more</p>
              <Button asChild variant="outline" className="mt-3 bg-white">
                <Link href="/surveys">Browse Surveys</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasPaymentMethod && canWithdraw && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div>
              <h3 className="font-semibold text-orange-900">No Payment Method</h3>
              <p className="mt-1 text-sm text-orange-800">
                Please add a payment method before requesting a withdrawal.
              </p>
              <Button asChild variant="outline" className="mt-3 bg-transparent">
                <Link href="/payment-methods">Add Payment Method</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Withdrawal Form */}
      {canWithdraw && hasPaymentMethod && (
        <Card>
          <CardHeader>
            <CardTitle>Request Withdrawal</CardTitle>
            <CardDescription>Choose a payment method and amount to withdraw</CardDescription>
          </CardHeader>
          <CardContent>
            <WithdrawalForm maxAmount={wallet?.balance || 0} paymentMethods={paymentMethods || []} userId={user.id} />
          </CardContent>
        </Card>
      )}

      {/* Withdrawal History */}
      {withdrawals && withdrawals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>Track your withdrawal requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">${withdrawal.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(withdrawal.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      via {withdrawal.payment_method}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium capitalize ${getStatusColor(withdrawal.status)}`}
                  >
                    {getStatusIcon(withdrawal.status)}
                    {withdrawal.status}
                  </span>
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
