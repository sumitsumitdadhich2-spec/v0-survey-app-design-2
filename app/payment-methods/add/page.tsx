import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddPaymentMethodForm } from "@/components/add-payment-method-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AddPaymentMethodPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has any payment methods
  const { count } = await supabase
    .from("payment_methods")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const isFirstMethod = count === 0

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button variant="ghost" asChild className="w-fit">
        <Link href="/payment-methods">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payment Methods
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Add Payment Method</CardTitle>
          <CardDescription>Choose how you want to receive your earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <AddPaymentMethodForm userId={user.id} isFirstMethod={isFirstMethod} />
        </CardContent>
      </Card>
    </div>
  )
}
