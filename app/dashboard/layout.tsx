import type React from "react"
import { NavMenu } from "@/components/nav-menu"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      <NavMenu />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  )
}
