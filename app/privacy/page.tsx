import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="mt-2 text-sm text-gray-600">Last updated: December 26, 2025</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> Email address, name, and password
              </li>
              <li>
                <strong>Survey Responses:</strong> Your answers to survey questions
              </li>
              <li>
                <strong>Payment Information:</strong> PayPal email or bank account details for withdrawals
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you use our service
              </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and maintain our service</li>
              <li>Process survey responses and payments</li>
              <li>Manage your account and referrals</li>
              <li>Communicate with you about your account</li>
              <li>Improve our service and develop new features</li>
              <li>Detect and prevent fraud</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul>
              <li>
                <strong>Survey Partners:</strong> Anonymized survey responses only
              </li>
              <li>
                <strong>Payment Processors:</strong> To process withdrawals
              </li>
              <li>
                <strong>Service Providers:</strong> Who help us operate our platform
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law
              </li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. Your payment details are
              encrypted and stored securely. However, no method of transmission over the Internet is 100% secure.
            </p>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your data</li>
            </ul>

            <h2>6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to maintain your session, remember your preferences, and analyze
              site usage. You can control cookies through your browser settings.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide
              services. We may retain certain information as required by law or for legitimate business purposes.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our service is not intended for users under 18 years of age. We do not knowingly collect information from
              children.
            </p>

            <h2>9. International Users</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. By using our
              service, you consent to such transfers.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new
              policy on this page.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or how we handle your data, please contact us at
              privacy@surveypay.com
            </p>

            <div className="mt-8 flex gap-3">
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/terms">Terms & Conditions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
