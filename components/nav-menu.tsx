"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Home, FileText, Users, Wallet, CreditCard, LogOut, Menu, Gift } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function NavMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/surveys", label: "Surveys", icon: FileText },
    { href: "/referrals", label: "Referrals", icon: Users },
    { href: "/enter-code", label: "Enter Code", icon: Gift },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/withdraw", label: "Withdraw", icon: CreditCard },
  ]

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => mobile && setIsOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-blue-100 text-blue-900" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        )
      })}
      <Button
        variant="ghost"
        className="flex w-full items-center justify-start gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        onClick={handleSignOut}
      >
        <LogOut className="h-5 w-5" />
        Sign Out
      </Button>
    </>
  )

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden w-64 flex-col gap-2 border-r border-gray-200 bg-white p-4 md:flex">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">SurveyPay</h1>
          <p className="text-xs text-gray-600">Earn money sharing opinions</p>
        </div>
        <NavLinks />
      </nav>

      {/* Mobile Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 md:hidden">
        <h1 className="text-xl font-bold text-gray-900">SurveyPay</h1>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">SurveyPay</h1>
              <p className="text-xs text-gray-600">Earn money sharing opinions</p>
            </div>
            <div className="flex flex-col gap-2">
              <NavLinks mobile />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
