"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function AddPaymentMethodForm({ userId, isFirstMethod }: { userId: string; isFirstMethod: boolean }) {
  const [methodType, setMethodType] = useState<"paypal" | "bank">("paypal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // PayPal fields
  const [paypalEmail, setPaypalEmail] = useState("")

  // Bank fields
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [bankName, setBankName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const methodDetails =
        methodType === "paypal"
          ? { email: paypalEmail }
          : {
              account_name: accountName,
              account_number: accountNumber,
              routing_number: routingNumber,
              bank_name: bankName,
            }

      const { error } = await supabase.from("payment_methods").insert({
        user_id: userId,
        method_type: methodType,
        method_details: methodDetails,
        is_primary: isFirstMethod,
      })

      if (error) throw error

      toast({
        title: "Payment Method Added",
        description: "Your payment method has been saved successfully",
      })

      router.push("/payment-methods")
      router.refresh()
    } catch (error) {
      console.error("Add payment method error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add payment method",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label>Payment Method Type</Label>
        <RadioGroup value={methodType} onValueChange={(value) => setMethodType(value as "paypal" | "bank")}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="cursor-pointer font-normal">
              PayPal
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bank" id="bank" />
            <Label htmlFor="bank" className="cursor-pointer font-normal">
              Bank Account
            </Label>
          </div>
        </RadioGroup>
      </div>

      {methodType === "paypal" ? (
        <div className="space-y-2">
          <Label htmlFor="paypal-email">PayPal Email</Label>
          <Input
            id="paypal-email"
            type="email"
            placeholder="your@email.com"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <p className="text-sm text-gray-600">Enter the email address associated with your PayPal account</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="account-name">Account Holder Name</Label>
            <Input
              id="account-name"
              type="text"
              placeholder="John Doe"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input
              id="bank-name"
              type="text"
              placeholder="Bank of America"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                type="text"
                placeholder="123456789"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routing-number">Routing Number</Label>
              <Input
                id="routing-number"
                type="text"
                placeholder="987654321"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              Your bank account information is encrypted and stored securely. We'll never share your details with third
              parties.
            </p>
          </div>
        </>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Add Payment Method"
          )}
        </Button>
      </div>
    </form>
  )
}
