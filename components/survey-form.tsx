"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight, Loader2, SkipForward, AlertCircle } from "lucide-react"
import { CelebrationModal } from "@/components/celebration-modal"
import { AdBanner } from "@/components/ad-banner"

const sampleQuestions = [
  {
    id: "q1",
    question: "How often do you use this product or service?",
    type: "radio" as const,
    options: ["Daily", "Several times a week", "Once a week", "Rarely"],
    required: true,
  },
  {
    id: "q2",
    question: "What is your primary reason for choosing this option?",
    type: "radio" as const,
    options: ["Price", "Quality", "Brand reputation", "Convenience"],
    required: true,
  },
  {
    id: "q3",
    question: "How satisfied are you with your experience?",
    type: "radio" as const,
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"],
    required: true,
  },
  {
    id: "q4",
    question: "Rate the value for money you received",
    type: "radio" as const,
    options: ["Excellent value", "Good value", "Fair value", "Poor value"],
    required: true,
  },
  {
    id: "q5",
    question: "Please describe your experience in detail. What did you like or dislike? (Minimum 10 words required)",
    type: "text" as const,
    required: true,
    minWords: 10,
  },
  {
    id: "q6",
    question: "Would you recommend this to others?",
    type: "radio" as const,
    options: ["Definitely yes", "Probably yes", "Not sure", "Probably no"],
    required: true,
  },
  {
    id: "q7",
    question: "What improvements would you suggest? Share your thoughts in at least 10 words",
    type: "text" as const,
    required: true,
    minWords: 10,
  },
  {
    id: "q8",
    question: "How does this compare to similar options you've used?",
    type: "radio" as const,
    options: ["Much better", "Somewhat better", "About the same", "Worse"],
    required: true,
  },
  {
    id: "q9",
    question: "What feature or aspect is most important to you?",
    type: "radio" as const,
    options: ["Ease of use", "Reliability", "Customer support", "Price"],
    required: true,
  },
  {
    id: "q10",
    question: "Tell us about your overall impression and any additional feedback (Minimum 10 words)",
    type: "text" as const,
    required: true,
    minWords: 10,
  },
]

export function SurveyForm({ surveyId, reward }: { surveyId: string; reward: number }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [startTime] = useState(Date.now())
  const [finalReward, setFinalReward] = useState(reward)
  const router = useRouter()
  const { toast } = useToast()

  const currentQuestion = sampleQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100
  const isLastQuestion = currentQuestionIndex === sampleQuestions.length - 1
  const currentAnswer = answers[currentQuestion.id]

  const wordCount = currentAnswer
    ? currentAnswer
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    : 0
  const minWords = currentQuestion.type === "text" ? currentQuestion.minWords || 10 : 0
  const canProceed =
    !currentQuestion.required || (currentQuestion.type === "text" ? wordCount >= minWords : currentAnswer?.trim())

  const handleRadioChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleTextChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleNext = () => {
    if (canProceed && !isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    if (!currentQuestion.required && !isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleSubmit = async () => {
    if (!canProceed) {
      toast({
        title: "Answer Required",
        description:
          currentQuestion.type === "text"
            ? `Please write at least ${minWords} words before submitting.`
            : "Please answer this question before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const completionTime = (Date.now() - startTime) / 1000 / 60 // minutes
      const minimumTime = 2 // 2 minutes minimum

      let calculatedReward = reward

      // If completed too quickly, reduce reward
      if (completionTime < minimumTime) {
        calculatedReward = reward * 0.5 // 50% penalty for rushing
        toast({
          title: "Quick Completion Notice",
          description: `You completed the survey in ${completionTime.toFixed(1)} minutes. Full rewards require at least ${minimumTime} minutes.`,
          variant: "destructive",
        })
      } else {
        // Random chance of reduced reward to encourage careful completion
        const shouldReduceReward = Math.random() < 0.3 // 30% chance
        if (shouldReduceReward) {
          calculatedReward = reward * 0.5
          toast({
            title: "Quality Check",
            description: "Some answers require more detail. You received partial payment.",
          })
        }
      }

      setFinalReward(calculatedReward)

      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase.rpc("complete_survey", {
        p_survey_id: surveyId,
        p_user_id: user.id,
      })

      if (error) throw error

      const result = data as { success: boolean; error?: string; reward?: number }

      if (!result.success) {
        throw new Error(result.error || "Failed to complete survey")
      }

      // Show celebration modal
      setShowCelebration(true)
    } catch (error) {
      console.error("Survey submission error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit survey",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleCelebrationClose = () => {
    setShowCelebration(false)
    router.push("/surveys")
    router.refresh()
  }

  return (
    <>
      <AdBanner position="top" className="mb-6" />

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {sampleQuestions.length}
            </span>
            <span className="text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="min-h-[300px] space-y-6 rounded-lg border border-gray-200 bg-white p-6">
          <Label className="text-lg font-semibold text-gray-900">
            {currentQuestion.question}
            {!currentQuestion.required && <span className="ml-2 text-sm font-normal text-gray-500">(Optional)</span>}
          </Label>

          {currentQuestion.type === "radio" && currentQuestion.options && (
            <RadioGroup value={currentAnswer || ""} onValueChange={handleRadioChange}>
              {currentQuestion.options.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} />
                  <Label htmlFor={`${currentQuestion.id}-${option}`} className="flex-1 cursor-pointer font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === "text" && (
            <div className="space-y-2">
              <Textarea
                value={currentAnswer || ""}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Please write your answer here... (Minimum 10 words required)"
                rows={6}
                className="resize-none"
              />
              <div className="flex items-center justify-between text-sm">
                <div
                  className={`flex items-center gap-2 ${wordCount >= minWords ? "text-green-600" : "text-amber-600"}`}
                >
                  {wordCount < minWords && <AlertCircle className="h-4 w-4" />}
                  <span className="font-medium">
                    {wordCount}/{minWords} words
                  </span>
                </div>
                {wordCount < minWords && (
                  <span className="text-amber-600">
                    {minWords - wordCount} more word{minWords - wordCount !== 1 ? "s" : ""} needed
                  </span>
                )}
                {wordCount >= minWords && <span className="text-green-600 font-medium">✓ Ready to proceed</span>}
              </div>
            </div>
          )}
        </div>

        <AdBanner position="middle" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className="flex-1 bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {!isLastQuestion ? (
              <Button type="button" onClick={handleNext} disabled={!canProceed} className="flex-1">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={!canProceed || isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Survey"
                )}
              </Button>
            )}
          </div>

          {!currentQuestion.required && !isLastQuestion && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700"
              size="sm"
            >
              <SkipForward className="mr-2 h-3 w-3" />
              Skip this question
            </Button>
          )}
        </div>

        {/* Earning reminder */}
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <p className="text-sm text-green-700">
            Complete this survey carefully and earn <span className="font-bold">${reward.toFixed(2)}</span>
          </p>
          <p className="mt-1 text-xs text-green-600">Quick or careless completion may result in reduced payment</p>
        </div>
      </div>

      <AdBanner position="bottom" className="mt-6" />

      <CelebrationModal open={showCelebration} onClose={handleCelebrationClose} amount={finalReward} />
    </>
  )
}
