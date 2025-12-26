import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, Users, Shield, Clock, Award, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <DollarSign className="h-10 w-10 text-blue-600" />
              <div>
                <CardTitle className="text-3xl">About SurveyPay</CardTitle>
                <p className="mt-2 text-sm text-gray-600">Your trusted platform for earning money through surveys</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-gray-700">
                SurveyPay was founded with a simple mission: to provide an easy, transparent, and rewarding way for
                people to earn money by sharing their opinions. We believe everyone's voice matters, and we're committed
                to making online earning accessible to everyone.
              </p>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Why Choose Us</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Fair Compensation</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      We offer competitive rewards for your time and ensure transparent payment processing
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-100">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Data Protection</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      Your privacy is our priority. We use industry-standard encryption to protect your data
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quick Surveys</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      Most surveys take just 2 minutes to complete, perfect for earning in your spare time
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Referral Rewards</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      Earn $5 for every friend who joins and completes their first survey
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
              <div className="mt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Create Your Account</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      Sign up in less than a minute with just your email address. It's completely free to join.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Complete Surveys</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      Browse available surveys, choose the ones you like, and complete them at your own pace. Each
                      survey earns you money instantly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Get Paid</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      Once you reach $25, request a withdrawal via PayPal or bank transfer. It's that simple!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900">Our Commitment</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Award className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                  <p className="leading-relaxed text-gray-700">
                    <strong>Transparency:</strong> We clearly communicate survey rewards, withdrawal requirements, and
                    earning limits
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                  <p className="leading-relaxed text-gray-700">
                    <strong>Reliability:</strong> We process withdrawals on time and maintain consistent survey
                    availability
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                  <p className="leading-relaxed text-gray-700">
                    <strong>Security:</strong> Your personal information and payment details are protected with
                    industry-leading security measures
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-lg bg-blue-50 p-6">
              <h2 className="text-xl font-bold text-gray-900">Ready to Start Earning?</h2>
              <p className="mt-2 leading-relaxed text-gray-700">
                Join thousands of users who are already earning money with SurveyPay. It's free to sign up and takes
                less than a minute.
              </p>
              <div className="mt-4 flex gap-3">
                <Button asChild>
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </section>

            <div className="flex gap-3 border-t border-gray-200 pt-6">
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/terms">Terms & Conditions</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
