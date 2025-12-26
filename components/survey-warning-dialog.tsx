"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, DollarSign, CheckCircle2 } from "lucide-react"

interface SurveyWarningDialogProps {
  open: boolean
  onClose: () => void
  onAccept: () => void
  reward: number
  estimatedTime: number
}

export function SurveyWarningDialog({ open, onClose, onAccept, reward, estimatedTime }: SurveyWarningDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            Important Survey Guidelines
          </DialogTitle>
          <DialogDescription className="sr-only">
            Please read these important guidelines before starting the survey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Earning Amount */}
          <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4">
            <DollarSign className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Earn ${reward.toFixed(2)}</p>
              <p className="text-sm text-green-700">Complete this survey carefully to receive the full amount</p>
            </div>
          </div>

          {/* Time Requirement */}
          <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
            <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-800">Minimum {estimatedTime} Minutes Required</p>
              <p className="text-sm text-blue-700">
                Completing too quickly (under {estimatedTime} minutes) will result in reduced payment or no payment
              </p>
            </div>
          </div>

          {/* Quality Guidelines */}
          <div className="space-y-3 rounded-lg bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-800">Answer Carefully</p>
                <p className="text-sm text-amber-700">Random or careless answers may result in payment deduction</p>
              </div>
            </div>
          </div>

          {/* Rules List */}
          <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="font-semibold text-gray-800">Follow These Rules:</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Answer all questions honestly and carefully</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>For text questions, write at least 10 words</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Take your time - rushing reduces your earnings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Complete all 10 questions to receive payment</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700">
            I Understand, Start Survey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
