"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function SignOutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      className="text-zinc-400 hover:text-white border-white/10 bg-transparent"
    >
      Sign Out
    </Button>
  )
}
