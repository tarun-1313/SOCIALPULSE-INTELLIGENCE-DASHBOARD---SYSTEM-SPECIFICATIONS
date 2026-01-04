import { ArrowRight, BarChart3, TrendingUp, Users, Shield, Zap, Layout, FileText, Facebook, Instagram, Linkedin, Twitter, MousePointerClick, Globe, Lock, Cpu, Check, Plus, MessageSquare, Mail, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HeroCarousel } from "@/components/hero-carousel"
import { DashboardFlipCard } from "@/components/dashboard-flip-card"

export const metadata: Metadata = {
  title: "SocialPulse | Next-Gen Social Media Analytics Dashboard",
  description: "Master your social presence with real-time insights, visual analytics, and secure OAuth-based connections for Facebook, Instagram, LinkedIn, and Twitter.",
  keywords: ["social media analytics", "dashboard", "facebook analytics", "instagram insights", "business intelligence", "social media management"],
}

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-background to-background" />
        <div className="container relative mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Zap className="size-3" />
            Next-Gen Social Analytics
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white max-w-4xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Master Your Social Presence with <span className="text-primary">SocialPulse</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Eliminate manual tracking. Gain real-time insights, visual analytics, and secure OAuth-based connections to help
            your business make data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <Link href="/signup">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-bold bg-primary text-white hover:bg-primary/90 rounded-xl"
              >
                Start Free Trial
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base font-bold border-white/10 hover:bg-white/5 rounded-xl bg-transparent"
              >
                View Demo Dashboard
              </Button>
            </Link>
          </div>

          {/* Hero Image / Carousel Component */}
          <HeroCarousel />
        </div>
      </section>

      {/* Platform Support Section */}
      <section className="py-20 px-4 border-b border-white/5">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {[
              { icon: Facebook, name: "Facebook", color: "hover:text-blue-500" },
              { icon: Instagram, name: "Instagram", color: "hover:text-pink-500" },
              { icon: Linkedin, name: "LinkedIn", color: "hover:text-blue-700" },
              { icon: Twitter, name: "Twitter / X", color: "hover:text-sky-400" },
            ].map((platform, i) => (
              <div key={i} className={`flex items-center gap-2 group cursor-default transition-colors ${platform.color}`}>
                <platform.icon className="size-8" />
                <span className="font-bold text-xl hidden sm:inline">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-black/40">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">How It Works</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Get up and running in minutes with our streamlined three-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 z-0" />
            {[
              {
                step: "01",
                title: "Connect Accounts",
                desc: "Securely link your social media profiles using official OAuth 2.0 protocols.",
                icon: MousePointerClick,
              },
              {
                step: "02",
                title: "Aggregate Data",
                desc: "Our engine pulls and processes historical and real-time data automatically.",
                icon: Cpu,
              },
              {
                step: "03",
                title: "Optimize Growth",
                desc: "Receive AI-driven insights and visual reports to scale your presence.",
                icon: TrendingUp,
              },
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-6 group">
                <div className="size-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xl group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <item.icon className="size-8" />
                </div>
                <div className="space-y-2">
                  <span className="text-primary font-mono text-sm font-bold tracking-widest">{item.step}</span>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-black/20">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Enterprise-Grade Social Intelligence</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Built for teams who demand deep insights and secure integrations across the entire social ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Power BI-Style Analytics",
                desc: "Experience high-fidelity data visualization with interactive charts that rival dedicated BI tools.",
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                icon: Lock,
                title: "OAuth Secure Connect",
                desc: "One-click secure connections using official API protocols. We never store your passwords.",
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
              },
              {
                icon: Cpu,
                title: "Real-time Processing",
                desc: "Our engine processes thousands of data points per second for up-to-the-minute reporting.",
                color: "text-purple-400",
                bg: "bg-purple-400/10",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass p-8 rounded-2xl space-y-6 hover:translate-y-[-8px] hover:border-primary/50 transition-all duration-500 group"
              >
                <div className={`size-14 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="size-7" />
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Use Cases */}
      <section className="py-24 px-4 bg-primary/5">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-10 bg-primary/10 blur-3xl rounded-full animate-pulse" />
              <div className="grid grid-cols-2 gap-4 relative">
                <div className="glass p-6 rounded-2xl space-y-4 transform hover:scale-105 transition-transform duration-500">
                  <TrendingUp className="text-emerald-400 size-8" />
                  <h4 className="text-white font-bold">Marketing Agencies</h4>
                  <p className="text-xs text-zinc-500">Manage 50+ client accounts with unified reporting and automated PDF exports.</p>
                </div>
                <div className="glass p-6 rounded-2xl space-y-4 mt-8 transform hover:scale-105 transition-transform duration-500">
                  <Users className="text-blue-400 size-8" />
                  <h4 className="text-white font-bold">E-commerce Brands</h4>
                  <p className="text-xs text-zinc-500">Track ROI on social campaigns and monitor customer sentiment in real-time.</p>
                </div>
                <div className="glass p-6 rounded-2xl space-y-4 transform hover:scale-105 transition-transform duration-500">
                  <Globe className="text-purple-400 size-8" />
                  <h4 className="text-white font-bold">Global Enterprises</h4>
                  <p className="text-xs text-zinc-500">Regional performance tracking with multi-currency and timezone support.</p>
                </div>
                <div className="glass p-6 rounded-2xl space-y-4 mt-8 transform hover:scale-105 transition-transform duration-500">
                  <Shield className="text-orange-400 size-8" />
                  <h4 className="text-white font-bold">SaaS Companies</h4>
                  <p className="text-xs text-zinc-500">Analyze user engagement trends and product-led growth through social channels.</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Designed for <span className="text-primary">Real Business</span> Growth
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                SocialPulse isn't just another dashboard. It's a strategic tool designed to solve complex data challenges for modern businesses.
              </p>
              <ul className="space-y-4">
                {[
                  "Consolidated cross-platform data streams",
                  "Automated executive-ready reporting",
                  "Secure team collaboration workflows",
                  "Historical data archival and trend analysis"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Zap className="size-3 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="link" className="text-primary p-0 h-auto font-bold group">
                Explore all use cases <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Choose the plan that fits your business needs. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$0",
                desc: "Perfect for individuals and side projects.",
                features: ["Up to 3 social accounts", "Weekly email reports", "Basic visual charts", "24h data refresh"],
                cta: "Get Started",
                popular: false,
              },
              {
                name: "Professional",
                price: "$49",
                desc: "Ideal for growing brands and marketers.",
                features: ["Up to 15 social accounts", "Daily automated reports", "Advanced BI analytics", "Real-time data processing", "Team collaboration (3 seats)"],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                desc: "For large-scale agencies and companies.",
                features: ["Unlimited accounts", "White-label reporting", "Custom API access", "Dedicated account manager", "SSO & Advanced Security"],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, i) => (
              <div key={i} className={`glass p-8 rounded-4xl flex flex-col space-y-8 relative ${plan.popular ? 'border-primary ring-2 ring-primary/20 scale-105 z-10' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-zinc-500">/mo</span>}
                  </div>
                  <p className="text-sm text-zinc-500">{plan.desc}</p>
                </div>
                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm text-zinc-300">
                      <Check className="size-4 text-primary shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
                <Link href={`/checkout/${plan.name.toLowerCase()}`} className="w-full">
                  <Button className={`w-full h-12 rounded-xl font-bold ${plan.popular ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Breakdown Section */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white leading-tight">
              A Centralized Platform for Your Entire <span className="text-primary">Social Ecosystem</span>
            </h2>
            <div className="space-y-6">
              {[
                {
                  icon: Layout,
                  title: "Immersive Feed",
                  text: "Analyze content performance with a content-first layout similar to native apps.",
                },
                {
                  icon: Users,
                  title: "Audience Insights",
                  text: "Understand your demographics and sentiment across all connected platforms.",
                },
                {
                  icon: FileText,
                  title: "Dynamic Reports",
                  text: "Generate weekly and monthly reports as PDF or CSV with a single click.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="shrink-0 size-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary mt-1 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <item.icon className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{item.title}</h4>
                    <p className="text-sm text-zinc-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img
              src="/analytics-data-visualization-ui.jpg"
              alt="Analytics Visuals"
              className="relative rounded-2xl border border-white/10 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Data-Driven Decision Section */}
      <section className="py-24 px-4 bg-zinc-950/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                <TrendingUp className="size-3" />
                Data-Driven Growth
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                How to make <span className="text-primary">smarter decisions</span> based on your data
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Raw data is just the beginning. SocialPulse transforms your social metrics into actionable strategies that drive real business results.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Identify Peak Engagement",
                    desc: "Analyze when your audience is most active to schedule posts for maximum reach and interaction.",
                  },
                  {
                    title: "Sentiment Analysis",
                    desc: "Go beyond likes and shares. Understand the emotional tone of your audience's comments and mentions.",
                  },
                  {
                    title: "Competitor Benchmarking",
                    desc: "Compare your performance against industry leaders to identify gaps and opportunities in your strategy.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="shrink-0 size-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-1 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Check className="size-3" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{item.title}</h4>
                      <p className="text-sm text-zinc-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flip Card Component */}
            <DashboardFlipCard />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-primary/5">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Trusted by Industry Leaders</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              See how SocialPulse is helping teams across the globe achieve their social media goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Jenkins",
                role: "Marketing Director at Flux",
                quote: "SocialPulse has completely transformed how we report to our clients. The visual analytics are unmatched.",
                avatar: "SJ",
              },
              {
                name: "Michael Chen",
                role: "Founder of GrowthScale",
                quote: "The real-time data processing is a game-changer. We can react to trends as they happen, not days later.",
                avatar: "MC",
              },
              {
                name: "Elena Rodriguez",
                role: "Social Media Lead at Aura",
                quote: "I've tried every tool out there, but SocialPulse is the only one that feels like it was built for power users.",
                avatar: "ER",
              },
            ].map((t, i) => (
              <div key={i} className="glass p-8 rounded-3xl space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex gap-1 text-primary">
                    {[...Array(5)].map((_, j) => (
                      <Sparkles key={j} className="size-4 fill-primary" />
                    ))}
                  </div>
                  <p className="text-zinc-300 italic">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="size-10 border border-white/10">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">{t.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-white font-bold text-sm">{t.name}</h4>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-zinc-500">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {[
            {
              q: "Is my data secure?",
              a: "Absolutely. We use official OAuth 2.0 protocols and never store your passwords. Your data is encrypted at rest and in transit.",
            },
            {
              q: "Can I cancel my subscription anytime?",
              a: "Yes, you can cancel your subscription at any time from your settings page. You will continue to have access until the end of your billing cycle.",
            },
            {
              q: "Which platforms are supported?",
              a: "We currently support Facebook, Instagram, LinkedIn, and Twitter/X. We are constantly adding support for new platforms.",
            },
            {
              q: "Do you offer a free trial?",
              a: "Yes, all our paid plans come with a 14-day free trial. No credit card is required to start.",
            },
            {
              q: "Can I export my reports?",
              a: "Yes, you can export all your data and reports in PDF and CSV formats with a single click.",
            },
          ].map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="glass px-6 rounded-2xl border-none">
              <AccordionTrigger className="text-white hover:text-primary font-bold py-6 text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-400 pb-6">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="glass p-12 rounded-4xl md:rounded-[4rem] text-center space-y-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto">
                <Mail className="size-8" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                Get the Latest Social Insights
              </h2>
              <p className="text-zinc-400 text-lg">
                Join our newsletter and receive weekly tips on how to grow your social presence using data.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90">
                  Subscribe Now
                </Button>
              </div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                No spam. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="glass p-12 rounded-4xl md:rounded-[4rem] text-center space-y-8 relative overflow-hidden group border-2 border-primary/20">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
            <div className="absolute -top-24 -right-24 size-64 bg-primary/20 blur-3xl rounded-full opacity-50" />
            <div className="absolute -bottom-24 -left-24 size-64 bg-blue-500/10 blur-3xl rounded-full opacity-50" />
            
            <h2 className="text-3xl md:text-6xl font-bold text-white relative z-10 tracking-tight">
              Ready to boost your <span className="text-primary text-glow">data-driven decisions?</span>
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto relative z-10 text-lg">
              Join over 1,000+ businesses using SocialPulse to manage their social media presence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link href="/signup">
                <Button size="lg" className="h-14 px-10 text-lg font-bold bg-white text-black hover:bg-zinc-200 rounded-2xl shadow-xl shadow-white/10">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-white/10 hover:bg-white/5 rounded-2xl">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
