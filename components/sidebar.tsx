import { Home, MessageCircle, Heart, User, Menu, BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", href: "/", active: true },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: TrendingUp, label: "Trends", href: "/trends" },
  { icon: MessageCircle, label: "Messages", href: "/messages" },
  { icon: Heart, label: "Notifications", href: "/notifications" },
  { icon: User, label: "Profile", href: "/profile" },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 border-r border-white/5 bg-black h-screen flex-col fixed left-0 top-0 z-50 px-3 py-8">
      <Link href="/" className="px-3 mb-10 flex items-center gap-2 group">
        <div className="size-8 rounded-lg bg-gradient-to-tr from-instagram-start via-instagram-mid to-instagram-end flex items-center justify-center transition-transform group-hover:scale-110">
          <BarChart3 className="size-5 text-white" />
        </div>
        <span className="font-bold text-2xl tracking-tighter text-white">SocialPulse</span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group",
              item.active ? "text-white font-bold" : "text-zinc-400 hover:text-white hover:bg-white/5",
            )}
          >
            <item.icon
              className={cn(
                "size-6 transition-all group-hover:scale-110",
                item.active ? "text-white fill-current" : "group-hover:text-white",
              )}
            />
            <span className="text-base tracking-wide">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
        <button className="flex w-full items-center gap-4 px-3 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group">
          <Menu className="size-6 transition-all group-hover:rotate-90" />
          <span className="text-base">More</span>
        </button>
      </div>
    </aside>
  )
}
