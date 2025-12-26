"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface PaymentMethod {
  id: string
  method_type: string
  method_details: {
    email?: string
    account_name?: string
    account_number?: string
    bank_name?: string
  }
  is_primary: boolean
}

export function WithdrawalForm({
  maxAmount,
  paymentMethods,
  userId,
}: {
  maxAmount: number
  paymentMethods: PaymentMethod[]
  userId: string
}) {
  const [amount, setAmount] = useState("")
  const [selectedMethod, setSelectedMethod] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const withdrawAmount = Number.parseFloat(amount)

    if (!selectedMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please choose a payment method",
        variant: "destructive",
      })
      return
    }

    if (Number.isNaN(withdrawAmount) || withdrawAmount < 25) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal amount is $25.00",
        variant: "destructive",
      })
      return
    }

    if (withdrawAmount > maxAmount) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const selectedPaymentMethod = paymentMethods.find((pm) => pm.id === selectedMethod)
      if (!selectedPaymentMethod) throw new Error("Payment method not found")

      // Create withdrawal request
      const { error: withdrawalError } = await supabase.from("withdrawals").insert({
        user_id: userId,
        amount: withdrawAmount,
        status: "pending",
        payment_method: selectedPaymentMethod.method_type,
        payment_details: selectedPaymentMethod.method_details,
      })

      if (withdrawalError) throw withdrawalError

      // Update wallet balance
      const { error: walletError } = await supabase
        .from("wallets")
        .update({
          balance: maxAmount - withdrawAmount,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      if (walletError) throw walletError

      // Record transaction
      const { error: transactionError } = await supabase.from("transactions").insert({
        user_id: userId,
        type: "withdrawal",
        amount: withdrawAmount,
        description: `Withdrawal to ${selectedPaymentMethod.method_type}`,
      })

      if (transactionError) throw transactionError

      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted for review",
      })

      router.push("/wallet")
      router.refresh()
    } catch (error) {
      console.error("Withdrawal error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process withdrawal",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="payment-method">Payment Method</Label>
        <Select value={selectedMethod} onValueChange={setSelectedMethod}>
          <SelectTrigger id="payment-method">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((method) => (
              <SelectItem key={method.id} value={method.id}>
                {method.method_type === "paypal"
                  ? `PayPal - ${method.method_details.email}`
                  : `Bank - ${method.method_details.account_name}`}
                {method.is_primary && " (Primary)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="25"
            max={maxAmount}
            placeholder="25.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-8"
            disabled={isSubmitting}
          />
        </div>
        <p className="text-sm text-gray-600">Available: ${maxAmount.toFixed(2)} | Min: $25.00</p>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <h4 className="font-semibold text-gray-900">Processing Time</h4>
        <p className="mt-1 text-sm text-gray-600">
          Withdrawals are typically processed within 3-5 business days. You'll receive an email when your withdrawal is
          approved.
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Request Withdrawal"
        )}
      </Button>
    </form>
  )
}
