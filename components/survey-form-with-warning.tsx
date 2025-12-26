"use client"

import { useState } from "react"
import { SurveyForm } from "./survey-form"
import { SurveyWarningDialog } from "./survey-warning-dialog"

export function SurveyFormWithWarning({
  surveyId,
  reward,
  estimatedTime,
}: {
  surveyId: string
  reward: number
  estimatedTime: number
}) {
  const [showWarning, setShowWarning] = useState(true)
  const [accepted, setAccepted] = useState(false)

  if (!accepted) {
    return (
      <SurveyWarningDialog
        open={showWarning}
        onClose={() => {
          window.location.href = "/surveys"
        }}
        onAccept={() => {
          setAccepted(true)
          setShowWarning(false)
        }}
        reward={reward}
        estimatedTime={estimatedTime}
      />
    )
  }

  return <SurveyForm surveyId={surveyId} reward={reward} />
}
