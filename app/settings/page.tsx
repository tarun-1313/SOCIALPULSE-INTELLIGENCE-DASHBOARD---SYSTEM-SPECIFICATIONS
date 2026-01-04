import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import {
  Settings2,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: connections } = await supabase
    .from("social_media_connections")
    .select("*")
    .eq("user_id", user.id)

  const isConnected = (platform: string) =>
    connections?.some(
      (c) => c.platform === platform && c.is_active
    )

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Settings2 className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">
            Settings & Integrations
          </h1>
          <p className="text-zinc-400">
            Securely connect your social media accounts using official authorization
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="glass rounded-2xl p-6 border-l-4 border-primary">
        <div className="flex gap-3">
          <Shield className="text-primary mt-1" />
          <div>
            <h3 className="text-white font-bold">
              Secure OAuth-Based Connection
            </h3>
            <p className="text-sm text-zinc-400">
              We never ask for your passwords, email credentials, or phone numbers.
              All connections use official OAuth authorization provided by the platforms.
            </p>
          </div>
        </div>
      </div>

      {/* Social Platform Connections */}
      <div className="grid md:grid-cols-2 gap-6">

        {[
          "instagram",
          "facebook",
          "linkedin",
          "twitter",
        ].map((platform) => (
          <div
            key={platform}
            className="glass rounded-xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold capitalize">
                {platform}
              </h3>
              {isConnected(platform) ? (
                <span className="flex items-center gap-1 text-emerald-400 text-sm">
                  <CheckCircle2 size={16} />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-400 text-sm">
                  <XCircle size={16} />
                  Not Connected
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-400">
              Connect your {platform} account to fetch real-time analytics
              such as followers, engagement, reach, and growth trends.
            </p>

            <a
              href={`/api/oauth/${platform}`}
              className="inline-block w-full text-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 transition"
            >
              {isConnected(platform)
                ? "Reconnect Account"
                : "Connect Account"}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
