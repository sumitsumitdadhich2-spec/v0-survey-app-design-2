"use client"

export function AdBanner({ position, className = "" }: { position: "top" | "bottom" | "middle"; className?: string }) {
  return (
    <div className={`w-full rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/30 ${className}`}>
      <div className="flex min-h-[100px] items-center justify-center p-4 text-center">
        <div className="text-sm text-blue-600">
          <div className="font-semibold">📢 Advertisement Space - {position}</div>
          <div className="mt-1 text-xs text-gray-600">
            {position === "top" && "Banner Ad (728x90 Desktop / 320x50 Mobile)"}
            {position === "middle" && "Medium Rectangle Ad (300x250 All Devices)"}
            {position === "bottom" && "Banner Ad (728x90 Desktop / 320x100 Mobile)"}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AdSidebar({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full rounded-lg border-2 border-dashed border-purple-200 bg-purple-50/30 ${className}`}>
      <div className="flex min-h-[250px] items-center justify-center p-4 text-center">
        <div className="text-sm text-purple-600">
          <div className="font-semibold">📢 Sidebar Ad</div>
          <div className="mt-1 text-xs text-gray-600">Medium Rectangle (300x250)</div>
        </div>
      </div>
    </div>
  )
}

export function AdLeaderboard({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full rounded-lg border-2 border-dashed border-green-200 bg-green-50/30 ${className}`}>
      <div className="flex min-h-[90px] items-center justify-center p-4 text-center">
        <div className="text-sm text-green-600">
          <div className="font-semibold">📢 Leaderboard Ad</div>
          <div className="mt-1 text-xs text-gray-600">Leaderboard (728x90 Desktop / 320x50 Mobile)</div>
        </div>
      </div>
    </div>
  )
}

export function AdRectangle({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full rounded-lg border-2 border-dashed border-orange-200 bg-orange-50/30 ${className}`}>
      <div className="flex min-h-[280px] items-center justify-center p-4 text-center">
        <div className="text-sm text-orange-600">
          <div className="font-semibold">📢 Large Rectangle Ad</div>
          <div className="mt-1 text-xs text-gray-600">336x280 or 300x250</div>
        </div>
      </div>
    </div>
  )
}
