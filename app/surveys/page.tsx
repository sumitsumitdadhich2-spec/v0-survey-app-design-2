import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, DollarSign, ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdLeaderboard, AdRectangle } from "@/components/ad-banner"

export default async function SurveysPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single()

  if (wallet?.earning_disabled || (wallet?.total_earned ?? 0) >= 25) {
    return (
      <div className="flex flex-col gap-6">
        <AdLeaderboard />

        <Button variant="ghost" asChild className="w-fit">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Congratulations!</h2>
            <p className="mb-4 text-gray-700">{"You've reached the $25 earning limit from surveys!"}</p>
            <div className="mx-auto max-w-md space-y-2 text-left text-sm text-gray-600">
              <p>
                {"✓ You've completed 20 surveys and earned $"}
                {(wallet?.total_earned ?? 0).toFixed(2)}
              </p>
              <p>{"✓ You can now withdraw your earnings once you reach $25"}</p>
              <p className="font-semibold text-green-700">
                {"✓ When you reach $30, your funds will automatically be submitted for withdrawal!"}
              </p>
              <p>{"✓ Keep earning through referrals to reach $30 faster!"}</p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild>
                <Link href="/wallet">View Wallet</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/referrals">Earn More via Referrals</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { data: assignments } = await supabase.from("survey_assignments").select("survey_id").eq("user_id", user.id)

  let assignedSurveyIds = assignments?.map((a) => a.survey_id) || []

  // If user has no assignments, assign 20 random surveys
  if (assignedSurveyIds.length === 0) {
    const { data: availableSurveys } = await supabase.from("surveys").select("id").eq("is_active", true).limit(20)

    if (availableSurveys && availableSurveys.length > 0) {
      const assignmentsToInsert = availableSurveys.map((survey) => ({
        user_id: user.id,
        survey_id: survey.id,
      }))

      await supabase.from("survey_assignments").insert(assignmentsToInsert)
      assignedSurveyIds = availableSurveys.map((s) => s.id)
    }
  }

  const { data: surveys } = await supabase
    .from("surveys")
    .select("*")
    .in("id", assignedSurveyIds)
    .eq("is_active", true)
    .order("reward_amount", {
      ascending: false,
    })

  // Get user's completed surveys
  const { data: completedSurveys } = await supabase
    .from("survey_completions")
    .select("survey_id")
    .eq("user_id", user.id)

  const completedSurveyIds = new Set(completedSurveys?.map((s) => s.survey_id) || [])

  // Filter available surveys
  const availableSurveys = surveys?.filter((survey) => !completedSurveyIds.has(survey.id)) || []
  const completedSurveysList = surveys?.filter((survey) => completedSurveyIds.has(survey.id)) || []

  const completedCount = completedSurveys?.length || 0
  const surveysNeeded = 20
  const currentBalance = wallet?.balance || 0
  const progressPercent = Math.min((completedCount / surveysNeeded) * 100, 100)

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
        <h1 className="text-3xl font-bold text-gray-900">Available Surveys</h1>
        <p className="mt-1 text-sm text-gray-600">Complete surveys to earn money. Each survey takes about 2 minutes.</p>
      </div>

      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Your Progress
          </CardTitle>
          <CardDescription>
            Complete 20 surveys to reach $25 minimum withdrawal. At $30, automatic withdrawal is triggered!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-900">
                {completedCount} / {surveysNeeded}
              </div>
              <p className="text-sm text-gray-600">Surveys completed</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-700">${currentBalance.toFixed(2)}</div>
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
          {completedCount < surveysNeeded && (
            <p className="text-sm text-gray-700">
              Complete <span className="font-semibold">{surveysNeeded - completedCount} more surveys</span> to unlock
              withdrawals!
            </p>
          )}
        </CardContent>
      </Card>

      <AdRectangle />

      {/* Available Surveys */}
      {availableSurveys.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableSurveys.map((survey) => (
            <Card key={survey.id} className="flex flex-col transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-relaxed">{survey.title}</CardTitle>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    ${survey.reward_amount.toFixed(2)}
                  </Badge>
                </div>
                <CardDescription className="leading-relaxed">{survey.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>~{survey.estimated_time_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Earn ${survey.reward_amount.toFixed(2)}</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/surveys/${survey.id}`}>Start Survey</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No surveys available at the moment. Check back soon!</p>
          </CardContent>
        </Card>
      )}

      {/* Completed Surveys */}
      {completedSurveysList.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Completed Surveys</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedSurveysList.map((survey) => (
              <Card key={survey.id} className="opacity-60">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-relaxed">{survey.title}</CardTitle>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <CardDescription className="leading-relaxed">{survey.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>Earned ${survey.reward_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <AdLeaderboard className="mt-6" />
    </div>
  )
}
