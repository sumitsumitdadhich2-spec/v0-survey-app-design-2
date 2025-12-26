"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Mail, MessageSquare, HelpCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-4xl px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Contact Us</CardTitle>
            <p className="mt-2 text-sm text-gray-600">
              Have questions? We're here to help. Reach out and we'll get back to you within 24 hours.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-900">Get in Touch</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Our support team is available to answer any questions about surveys, payments, or your account.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Email Support</p>
                      <p className="text-sm text-gray-600">support@surveypay.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <HelpCircle className="mt-0.5 h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">General Inquiries</p>
                      <p className="text-sm text-gray-600">info@surveypay.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Report Issues</p>
                      <p className="text-sm text-gray-600">issues@surveypay.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your question or issue in detail..."
                      className="min-h-32 resize-none"
                      required
                    />
                  </div>

                  {submitted && (
                    <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
                      Thank you for contacting us! We've received your message and will respond within 24 hours.
                    </div>
                  )}

                  <Button type="submit" className="w-full sm:w-auto">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>

                <div className="mt-8 rounded-lg bg-blue-50 p-6">
                  <h4 className="font-semibold text-gray-900">Frequently Asked Questions</h4>
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    <li>• How do I withdraw my earnings? Visit the Withdraw page once you reach $25</li>
                    <li>• When will I receive my payment? Withdrawals are processed within 3-5 business days</li>
                    <li>• How many surveys can I complete? You can complete up to 20 surveys to earn $24</li>
                    <li>• What about referrals? Earn $5 per referral, maximum 4 referrals per user</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3 border-t border-gray-200 pt-6">
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">About Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
