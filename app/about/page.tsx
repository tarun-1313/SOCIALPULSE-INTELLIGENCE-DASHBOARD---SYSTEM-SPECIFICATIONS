import { BarChart3, Users, Globe, Zap, Heart, Shield, Rocket, Target, Award } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AboutPage() {
  return (
    <div className="py-20 px-4 space-y-24 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">Our Mission</h1>
        <p className="text-xl text-zinc-400 leading-relaxed">
          SocialPulse was founded to empower organizations with real-time, actionable insights that eliminate the
          guesswork in social media management.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Our Story</h2>
          <p className="text-zinc-400 leading-relaxed">
            It started in 2024 when a group of data analysts and developers realized how fragmented social media data had become. Companies were spending hours manually exporting CSVs from multiple platforms just to get a basic overview of their performance.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            We built SocialPulse to be the bridge between raw platform data and strategic decision-making. Today, we're proud to support over 1,000 businesses in navigating the complex world of social analytics.
          </p>
          <div className="flex gap-8 py-4">
            <div>
              <div className="text-3xl font-bold text-primary">1k+</div>
              <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Businesses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50M+</div>
              <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Data Points</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Uptime</div>
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="glass p-2 rounded-3xl relative overflow-hidden">
            <img 
              src="/Story.png" 
              alt="Our Story" 
              className="rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">Core Values</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">The principles that guide everything we do at SocialPulse.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Data Integrity",
              desc: "We believe in providing accurate, unaltered data that businesses can trust.",
              icon: Shield,
              color: "text-blue-400",
              bg: "bg-blue-400/10"
            },
            {
              title: "User-Centric Design",
              desc: "Analytics shouldn't be complicated. We build tools that anyone can use.",
              icon: Heart,
              color: "text-red-400",
              bg: "bg-red-400/10"
            },
            {
              title: "Continuous Innovation",
              desc: "The social landscape changes daily. We evolve just as fast.",
              icon: Rocket,
              color: "text-orange-400",
              bg: "bg-orange-400/10"
            }
          ].map((v, i) => (
            <div key={i} className="glass p-8 rounded-3xl space-y-4 hover:border-primary/50 transition-colors group">
              <div className={`size-12 rounded-xl ${v.bg} flex items-center justify-center ${v.color} group-hover:scale-110 transition-transform`}>
                <v.icon className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{v.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
        <div className="space-y-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Globe className="size-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Centralized Monitoring</h3>
          <p className="text-zinc-500 leading-relaxed">
            We provide a single source of truth for all your social platforms, from Facebook and Twitter to emerging
            networks.
          </p>
        </div>
        <div className="space-y-4">
          <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Zap className="size-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Real-Time Processing</h3>
          <p className="text-zinc-500 leading-relaxed">
            Our backend architecture is designed for low-latency data fetching, ensuring your dashboard is always up to
            date.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">Meet the Team</h2>
          <p className="text-zinc-500 max-w-xl mx-auto">The humans behind the algorithms.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Tarun Chaudhari", role: "CEO & Co-founder", avatar: "AR" },
            { name: "Kalpesh Patil", role: "CTO", avatar: "JS" },
            { name: "Vivek Patil", role: "Head of Product", avatar: "TW" },
            { name: "Gaurav And Harshal ", role: "Lead Designer", avatar: "ML" }
          ].map((member, i) => (
            <div key={i} className="glass p-6 rounded-3xl text-center space-y-4 group">
              <Avatar className="size-24 mx-auto border-2 border-white/5 group-hover:border-primary transition-colors">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{member.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-white font-bold">{member.name}</h4>
                <p className="text-xs text-zinc-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Section */}
      <div className="glass p-12 rounded-[3rem] space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Award className="size-32 text-primary" />
        </div>
        <div className="space-y-4 relative z-10">
          <h2 className="text-3xl font-bold text-white">Who It Is For</h2>
          <p className="text-zinc-400 max-w-xl">SocialPulse is designed for professionals who take data seriously.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
          {[
            { label: "Companies", icon: Target, desc: "Scale your brand with data-driven strategies." },
            { label: "Marketers", icon: Zap, desc: "Optimize campaigns with real-time feedback." },
            { label: "Analysts", icon: Users, desc: "Deep dive into cross-platform performance." },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-4 p-8 rounded-4xl bg-white/5 hover:bg-white/10 transition-colors">
              <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <item.icon className="size-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">{item.label}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
