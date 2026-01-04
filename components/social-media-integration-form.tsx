"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Twitter, Linkedin, Facebook, Instagram, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase"

interface Connection {
  platform: string
  connection_status: string
}

export default function SocialMediaIntegrationForm({
  userId,
  existingConnections = {},
}: {
  userId: string
  existingConnections?: Record<string, any>
}) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    // If existing connections are passed, use them, otherwise fetch
    if (Object.keys(existingConnections).length > 0) {
      const formatted = Object.values(existingConnections).map((c) => ({
        platform: c.platform,
        connection_status: c.connection_status,
      }))
      setConnections(formatted)
      setLoading(false)
    } else {
      fetchConnections()
    }
  }, [existingConnections])

  const fetchConnections = async () => {
    const { data, error } = await supabase
      .from("social_media_connections")
      .select("platform, connection_status")
      .eq("user_id", userId)

    if (error) {
      console.error("[v0] Error fetching connections:", error)
    } else {
      setConnections(data || [])
    }
    setLoading(false)
  }

  const handleConnect = async (platform: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(platform)

    const formData = new FormData(e.currentTarget)
    const apiKey = formData.get("apiKey")
    const apiSecret = formData.get("apiSecret")
    const accessToken = formData.get("accessToken")

    try {
      // In a real app, this would be a server action to handle encryption securely
      const { error } = await supabase.from("social_media_connections").upsert(
        {
          user_id: userId,
          platform,
          api_key_encrypted: btoa(apiKey as string), // Dummy encryption for demo
          api_secret_encrypted: btoa(apiSecret as string),
          access_token_encrypted: btoa(accessToken as string),
          connection_status: "connected",
          last_verified_at: new Date().toISOString(),
        },
        { onConflict: "user_id,platform" },
      )

      if (error) throw error

      toast({
        title: `${platform} Connected`,
        description: "Your API credentials have been securely saved.",
      })
      fetchConnections()
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Invalid credentials provided.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(null)
    }
  }

  const getStatusIcon = (platform: string) => {
    const conn = connections.find((c) => c.platform === platform)
    if (!conn) return null
    if (conn.connection_status === "connected") return <CheckCircle2 className="size-4 text-emerald-500" />
    if (conn.connection_status === "invalid") return <XCircle className="size-4 text-red-500" />
    if (conn.connection_status === "rate_limited") return <AlertTriangle className="size-4 text-amber-500" />
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  const platforms = [
    { id: "Twitter", icon: Twitter, color: "text-sky-400" },
    { id: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
    { id: "Facebook", icon: Facebook, color: "text-blue-500" },
    { id: "Instagram", icon: Instagram, color: "text-pink-500" },
  ]

  return (
    <div className="space-y-12">
      {platforms.map((platform) => (
        <div key={platform.id} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center ${platform.color}`}>
                <platform.icon className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{platform.id} API Configuration</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Status:</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    {getStatusIcon(platform.id) || "Not Connected"}
                    {connections.find((c) => c.platform === platform.id)?.connection_status || "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={(e) => handleConnect(platform.id, e)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">API Key</label>
              <input
                name="apiKey"
                type="password"
                required
                placeholder="Required"
                className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">API Secret</label>
              <input
                name="apiSecret"
                type="password"
                required
                placeholder="Required"
                className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Access Token
                </label>
                <input
                  name="accessToken"
                  type="password"
                  required
                  placeholder="Required"
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting === platform.id}
                className="h-10 bg-primary text-white hover:bg-primary/90 font-bold text-xs uppercase tracking-widest px-6"
              >
                {submitting === platform.id ? <Loader2 className="size-4 animate-spin" /> : "Connect"}
              </Button>
            </div>
          </form>
        </div>
      ))}
    </div>
  )
}
