"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function ReferralLink({ link, code }: { link: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      toast({
        title: "Link Copied!",
        description: "Your referral link has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={link} readOnly className="font-mono text-sm" />
        <Button onClick={handleCopy} variant="outline" className="shrink-0 bg-transparent">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <div className="rounded-lg bg-white p-4">
        <p className="text-sm text-gray-600">
          Your unique referral code: <span className="font-mono font-semibold text-gray-900">{code}</span>
        </p>
      </div>
    </div>
  )
}
