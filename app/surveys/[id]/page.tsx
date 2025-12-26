import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SurveyFormWithWarning } from "@/components/survey-form-with-warning"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Clock, DollarSign } from "lucide-react"
import { AdLeaderboard } from "@/components/ad-banner"

export default async function SurveyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get survey
  const { data: survey } = await supabase.from("surveys").select("*").eq("id", id).eq("is_active", true).single()

  if (!survey) {
    notFound()
  }

  // Check if already completed
  const { data: completion } = await supabase
    .from("survey_completions")
    .select("*")
    .eq("survey_id", id)
    .eq("user_id", user.id)
    .single()

  if (completion) {
    redirect("/surveys")
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdLeaderboard />

      <Button variant="ghost" asChild>
        <Link href="/surveys">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Surveys
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{survey.title}</CardTitle>
          <CardDescription>{survey.description}</CardDescription>
          <div className="mt-4 flex items-center justify-between gap-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-800">${survey.reward_amount.toFixed(2)}</div>
                <div className="text-sm text-green-700">You'll earn this amount</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>~{survey.estimated_time_minutes} min</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SurveyFormWithWarning
            surveyId={survey.id}
            reward={survey.reward_amount}
            estimatedTime={survey.estimated_time_minutes}
          />
        </CardContent>
      </Card>

      <AdLeaderboard />
    </div>
  )
}
