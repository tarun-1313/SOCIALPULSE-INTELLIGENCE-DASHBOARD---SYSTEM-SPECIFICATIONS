import { Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <div className="py-20 px-4 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Get in Touch</h1>
        <p className="text-xl text-zinc-400 leading-relaxed">
          Have questions about our enterprise plans or custom API integrations? Our team is here to help.
        </p>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Mail className="size-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">tarunchaudhari1313@gmail.com</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Email Support</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Phone className="size-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">+91 9518391245</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Business Sales</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-4xl shadow-2xl space-y-6">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">First Name</label>
              <input
                type="text"
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Last Name</label>
              <input
                type="text"
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Message</label>
            <textarea className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
          </div>
          <Button className="w-full h-12 bg-primary text-white hover:bg-primary/90 rounded-xl font-bold">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  )
}
