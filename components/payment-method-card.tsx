"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Building2, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

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

export function PaymentMethodCard({ method }: { method: PaymentMethod }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this payment method?")) return

    setIsDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("payment_methods").delete().eq("id", method.id)

      if (error) throw error

      toast({
        title: "Payment Method Deleted",
        description: "Your payment method has been removed",
      })

      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const Icon = method.method_type === "paypal" ? CreditCard : Building2
  const iconColor = method.method_type === "paypal" ? "text-blue-600" : "text-green-600"
  const iconBg = method.method_type === "paypal" ? "bg-blue-100" : "bg-green-100"

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`rounded-lg p-3 ${iconBg}`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 capitalize">{method.method_type}</h3>
                {method.is_primary && <Badge variant="secondary">Primary</Badge>}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {method.method_type === "paypal"
                  ? method.method_details.email
                  : `${method.method_details.bank_name} - ${method.method_details.account_name}`}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
