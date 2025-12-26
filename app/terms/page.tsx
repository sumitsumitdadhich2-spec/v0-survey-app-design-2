import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms & Conditions</CardTitle>
            <p className="mt-2 text-sm text-gray-600">Last updated: December 26, 2025</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using SurveyPay, you accept and agree to be bound by the terms and provision of this
              agreement. You must accept these terms during registration to use our service.
            </p>

            <h2>2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use this service. By registering, you represent and warrant that you
              meet this age requirement.
            </p>

            <h2>3. Account Registration</h2>
            <p>
              You must provide accurate and complete information during the registration process. You are responsible
              for maintaining the confidentiality of your account credentials.
            </p>

            <h2>4. Survey Participation</h2>
            <p>
              Surveys are available on a first-come, first-served basis. You can only complete each survey once.
              Fraudulent or duplicate responses will result in account termination without payment.
            </p>

            <h2>5. Earnings and Payments</h2>

            <h3>5.1 Survey Earnings</h3>
            <ul>
              <li>Survey rewards are credited to your account immediately upon completion</li>
              <li>Survey earnings are tracked separately from referral earnings</li>
              <li>
                <strong>Maximum survey earning limit is $24.00</strong>
              </li>
              <li>After reaching $24 in survey earnings, no new surveys will be available</li>
              <li>Survey earnings alone cannot reach exactly $25 - they stop at $24</li>
              <li>Minimum withdrawal for survey earnings is $25.00 (must be combined with referral earnings)</li>
            </ul>

            <h3>5.2 Referral Earnings</h3>
            <ul>
              <li>Referral earnings are tracked separately from survey earnings</li>
              <li>You earn $5 for each successful referral (when they complete their first survey)</li>
              <li>
                <strong>Maximum 4 referrals per user</strong> - you cannot refer more than 4 people
              </li>
              <li>Each referral code can only be used 4 times</li>
              <li>Minimum withdrawal for referral earnings is $25.00</li>
              <li>You must earn at least $25 in referral earnings separately to withdraw them</li>
            </ul>

            <h3>5.3 Withdrawal Requirements</h3>
            <ul>
              <li>Both survey and referral earnings require a minimum of $25 to withdraw</li>
              <li>Survey earnings and referral earnings are separate and tracked independently</li>
              <li>Withdrawals are processed within 3-5 business days after approval</li>
              <li>You must have a verified payment method on file to receive payments</li>
              <li>We reserve the right to hold or cancel payments if fraud is suspected</li>
            </ul>

            <h2>6. Referral Program</h2>
            <p>
              You will earn $5 for each friend who signs up using your referral code and completes their first survey.
              Each user can make a maximum of 4 successful referrals. Each referral code can be used a maximum of 4
              times. Referral bonuses are credited to your referral earnings balance, which is separate from survey
              earnings. Referral bonuses cannot be earned through self-referrals or fraudulent means.
            </p>

            <h2>7. Survey System</h2>
            <ul>
              <li>You will have access to 20 available surveys at a time</li>
              <li>When you complete a survey, a new survey will automatically be assigned to you</li>
              <li>This continues until you reach the $24 survey earning limit</li>
              <li>
                After reaching $24 in survey earnings, all surveys will be removed and you cannot earn more from surveys
              </li>
              <li>Each survey can only be completed once per account</li>
              <li>Survey rewards vary from $1.00 to $1.50 per survey</li>
              <li>Average completion time is approximately 2 minutes per survey</li>
            </ul>

            <h2>8. Account Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of these terms or
              suspected fraudulent activity.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Continued use of the service after changes constitutes acceptance
              of the new terms.
            </p>

            <h2>10. Contact</h2>
            <p>If you have any questions about these terms, please contact us at support@surveypay.com</p>

            <div className="mt-8 flex gap-3">
              <Button asChild>
                <Link href="/">Back to Home</Link>
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
