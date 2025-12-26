import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Building2, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PaymentMethodCard } from "@/components/payment-method-card"

export default async function PaymentMethodsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get payment methods
  const { data: paymentMethods } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("user_id", user.id)
    .order("is_primary", { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" asChild className="w-fit">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p className="mt-1 text-sm text-gray-600">Manage how you receive your earnings</p>
        </div>
        <Button asChild>
          <Link href="/payment-methods/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Payment Method
          </Link>
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">PayPal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Fast and secure payments directly to your PayPal account. No fees for withdrawals over $25.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Bank Transfer</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Direct deposit to your bank account. Processing typically takes 3-5 business days.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods List */}
      {paymentMethods && paymentMethods.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {paymentMethods.map((method) => (
            <PaymentMethodCard key={method.id} method={method} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No payment methods added yet</p>
            <Button variant="outline" className="mt-4 bg-transparent" asChild>
              <Link href="/payment-methods/add">Add Your First Payment Method</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
