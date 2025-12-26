import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Users, Clock, Shield, Gift } from "lucide-react"
import Link from "next/link"
import { AdLeaderboard } from "@/components/ad-banner"

export default function HomePage() {
  const features = [
    {
      icon: DollarSign,
      title: "Earn Real Money",
      description: "Get paid for your opinions. Each survey pays between $2.50 and $5.00",
    },
    {
      icon: Clock,
      title: "Quick Surveys",
      description: "Most surveys take just 2 minutes to complete. Earn money in your spare time",
    },
    {
      icon: Users,
      title: "Refer Friends",
      description: "Earn $5 for every friend who completes their first survey",
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Your data is encrypted and protected. We never share your information",
    },
  ]

  const stats = [
    { value: "$25", label: "Minimum Withdrawal" },
    { value: "2 min", label: "Average Survey Time" },
    { value: "$5", label: "Referral Bonus" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SurveyPay</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 pt-6">
        <AdLeaderboard />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-5xl font-bold leading-tight text-gray-900">Earn Money by Sharing Your Opinion</h2>
          <p className="mt-6 text-xl leading-relaxed text-gray-600">
            Take quick surveys, get paid instantly. Withdraw your earnings via PayPal or bank transfer. Start earning
            today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="text-lg">
              <Link href="/auth/sign-up">Sign Up Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white p-6 shadow-sm">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900">Why Choose SurveyPay?</h3>
          <p className="mt-4 text-lg text-gray-600">Simple, fast, and reliable way to earn money online</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{feature.title}</h4>
                  <p className="mt-2 leading-relaxed text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <div className="container mx-auto px-6">
        <AdLeaderboard />
      </div>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold text-gray-900">How It Works</h3>
            <p className="mt-4 text-lg text-gray-600">Start earning in just three simple steps</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Sign Up</h4>
              <p className="mt-2 text-gray-600">Create your free account in less than a minute</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Take Surveys</h4>
              <p className="mt-2 text-gray-600">Complete quick surveys and earn money for each one</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Get Paid</h4>
              <p className="mt-2 text-gray-600">Withdraw your earnings via PayPal or bank transfer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="py-12 text-center">
            <Gift className="mx-auto h-16 w-16 text-blue-600" />
            <h3 className="mt-6 text-3xl font-bold text-gray-900">Ready to Start Earning?</h3>
            <p className="mt-4 text-lg text-gray-600">Join thousands of users already earning money with SurveyPay</p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/auth/sign-up">Create Free Account</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <div className="container mx-auto px-6 pb-6">
        <AdLeaderboard />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900">SurveyPay</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <Link href="/about" className="hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="hover:text-gray-900">
                Contact
              </Link>
              <Link href="/terms" className="hover:text-gray-900">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="hover:text-gray-900">
                Privacy Policy
              </Link>
            </div>
            <p className="text-sm text-gray-600">© 2025 SurveyPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
