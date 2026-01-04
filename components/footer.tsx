import Link from "next/link"
import { BarChart3 } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <BarChart3 className="size-6 text-primary" />
              <span className="font-bold text-lg text-white">SocialPulse</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Empowering organizations with real-time social media insights and advanced visual analytics.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/analytics" className="text-sm text-zinc-500 hover:text-primary transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-zinc-500 hover:text-primary transition-colors">
                  Reports
                </Link>
              </li>
              <li>
                <Link href="/content" className="text-sm text-zinc-500 hover:text-primary transition-colors">
                  Content Analysis
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-zinc-500 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-zinc-500 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-zinc-500 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-zinc-500 mb-4">Get the latest analytics trends delivered to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">© 2026 SocialPulse Analytics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
