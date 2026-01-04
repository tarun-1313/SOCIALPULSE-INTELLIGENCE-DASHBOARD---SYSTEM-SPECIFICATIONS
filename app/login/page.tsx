"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BarChart3, Lock, Mail, Loader2, ArrowRight, Github, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Ensure user profile exists after successful login
      if (data.user) {
        try {
          // This will create a profile if it doesn't exist
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .single()

          if (!profile) {
            // Create profile if it doesn't exist
            await supabase.from('user_profiles').insert({
              user_id: data.user.id,
              email: data.user.email!,
              full_name: data.user.user_metadata?.full_name || data.user.email!,
              role: 'viewer',
            })
          }
        } catch (profileError) {
          console.error('Error ensuring user profile:', profileError)
          // Continue with login even if profile creation fails
        }
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in to SocialPulse.",
      })
      
      // Use replace instead of push to prevent back button issues
      router.replace("/dashboard")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = (provider: 'github' | 'google') => {
    // Use the standardized API route we created
    window.location.href = `/api/oauth/${provider}`
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-[450px] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
              <BarChart3 className="size-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-white">SocialPulse</span>
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Secure Login</h1>
          <p className="text-zinc-500">Access your organization's analytics dashboard.</p>
        </div>

        <div className="glass p-8 rounded-4xl shadow-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-white hover:bg-primary/90 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
              <span className="bg-[#151720] px-3 text-zinc-600">Secure Auth</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('github')}
              className="h-11 bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              <Github className="size-4 mr-2" />
              GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              className="h-11 bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              <Chrome className="size-4 mr-2" />
              Google
            </Button>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-[11px] text-zinc-500 leading-relaxed text-center">
          <p>
            Authentication uses industry-standard <strong>JWT (JSON Web Tokens)</strong> and password hashing. Your data
            is encrypted in transit and at rest.
          </p>
        </div>
      </div>
    </div>
  )
}
