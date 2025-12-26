"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, DollarSign } from "lucide-react"
import confetti from "canvas-confetti"

export function CelebrationModal({
  open,
  onClose,
  amount,
}: {
  open: boolean
  onClose: () => void
  amount: number
}) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (open) {
      setAnimate(true)
      // Trigger confetti
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center space-y-6 py-6 text-center">
          <div
            className={`rounded-full bg-green-100 p-6 transition-transform duration-500 ${animate ? "scale-100" : "scale-0"}`}
          >
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Congratulations!</h2>
            <p className="text-gray-600">You've completed the survey</p>
          </div>

          <div
            className={`flex items-center gap-2 rounded-lg bg-green-50 px-8 py-4 transition-all duration-700 ${animate ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
          >
            <DollarSign className="h-8 w-8 text-green-600" />
            <span className="text-4xl font-bold text-green-600">${amount.toFixed(2)}</span>
          </div>

          <p className="text-sm text-gray-600">has been added to your wallet!</p>

          <Button onClick={onClose} size="lg" className="w-full">
            Continue to Surveys
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
