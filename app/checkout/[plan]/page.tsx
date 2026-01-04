"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, CreditCard, QrCode, Smartphone, ArrowLeft, Loader2, Sparkles, Zap, Shield, Trophy } from "lucide-react"
import Link from "next/link"
import { jsPDF } from "jspdf"

const PLAN_DETAILS = {
  starter: {
    name: "Starter",
    price: "$0",
    description: "Perfect for individuals and side projects.",
    features: ["Up to 3 social accounts", "Weekly email reports", "Basic visual charts", "24h data refresh"],
    color: "from-blue-500/20 to-cyan-500/20"
  },
  professional: {
    name: "Professional",
    price: "$49",
    description: "Ideal for growing brands and marketers.",
    features: ["Up to 15 social accounts", "Daily automated reports", "Advanced BI analytics", "Real-time data processing", "Team collaboration (3 seats)"],
    color: "from-primary/20 to-blue-600/20"
  },
  enterprise: {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale agencies and companies.",
    features: ["Unlimited accounts", "White-label reporting", "Custom API access", "Dedicated account manager", "SSO & Advanced Security"],
    color: "from-purple-500/20 to-pink-500/20"
  }
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const planKey = (params.plan as string)?.toLowerCase() || "professional"
  const plan = PLAN_DETAILS[planKey as keyof typeof PLAN_DETAILS] || PLAN_DETAILS.professional

  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [transactionId, setTransactionId] = useState("")
  const [customerName, setCustomerName] = useState("")

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      setTransactionId(`TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)
    }, 2000)
  }

  const handleDownloadReceipt = () => {
    const doc = new jsPDF()
    const date = new Date().toLocaleDateString()
    const time = new Date().toLocaleTimeString()

    // Header
    doc.setFillColor(3, 169, 244) // Brand color
    doc.rect(0, 0, 210, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text("SOCIALPULSE", 105, 25, { align: 'center' })
    
    // Receipt Title
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(18)
    doc.text("OFFICIAL RECEIPT", 20, 55)
    
    // Transaction Info
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Transaction ID: ${transactionId}`, 20, 65)
    doc.text(`Date: ${date} ${time}`, 20, 70)
    doc.text(`Status: SUCCESSFUL / PAID`, 20, 75)
    
    // Horizontal Line
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 85, 190, 85)
    
    // Customer Details
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text("CUSTOMER DETAILS", 20, 95)
    doc.setFontSize(10)
    doc.text(`Name: ${customerName || "Valued Customer"}`, 20, 105)
    
    // Plan Details
    doc.setFontSize(12)
    doc.text("SUBSCRIPTION DETAILS", 20, 120)
    doc.setFontSize(10)
    doc.text(`Plan: ${plan.name} Membership`, 20, 130)
    doc.text(`Amount: ${plan.price}`, 20, 135)
    
    // Features
    doc.setFontSize(12)
    doc.text("INCLUDED FEATURES:", 20, 150)
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 80)
    plan.features.forEach((feature, index) => {
      doc.text(`• ${feature}`, 25, 160 + (index * 7))
    })
    
    // Footer
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 250, 190, 250)
    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text("Thank you for choosing SocialPulse!", 105, 260, { align: 'center' })
    doc.text("For any queries, contact support@socialpulse.com", 105, 265, { align: 'center' })
    
    // Save the PDF
    doc.save(`SocialPulse_Receipt_${transactionId}.pdf`)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div 
          className="max-w-md w-full animate-in fade-in zoom-in duration-500"
        >
          <Card className="glass border-primary/50 overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
            <div className="absolute -top-24 -right-24 size-64 bg-primary/20 blur-3xl rounded-full opacity-50" />
            
            <CardHeader className="text-center pt-12 pb-8 relative z-10">
              <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto mb-6 border-2 border-primary/50 animate-bounce">
                <Trophy className="size-10" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2">Payment Successful!</CardTitle>
              <CardDescription className="text-zinc-400 text-lg">
                Welcome to the inner circle.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center space-y-6 pb-12 relative z-10">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold">Current Status</p>
                <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <Sparkles className="text-primary size-6" />
                  {plan.name} Member
                  <Sparkles className="text-primary size-6" />
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-zinc-400">
                  Your account has been upgraded successfully. You now have full access to all {plan.name} features.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/">
                    <Button className="w-full h-12 bg-primary text-white font-bold hover:bg-primary/90 rounded-xl">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadReceipt}
                    className="w-full h-12 border-white/10 hover:bg-white/5 rounded-xl text-zinc-400"
                  >
                    Download Receipt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Plan Summary */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-white">Order Summary</h2>
            <Card className="glass border-white/10 overflow-hidden">
              <div className={`h-2 bg-linear-to-r ${plan.color}`} />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-white">{plan.name} Plan</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">{plan.price}</span>
                    <span className="text-zinc-500 text-sm block">/month</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="bg-white/5 border-t border-white/10 pt-6">
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>{plan.price}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Tax (0%)</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span>{plan.price}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
              <div className="flex gap-3">
                <Shield className="text-primary size-5 shrink-0" />
                <p className="text-xs text-zinc-400">
                  <span className="text-white font-bold block mb-1">Secure Checkout</span>
                  Your payment information is encrypted and never stored on our servers.
                </p>
              </div>
              <div className="flex gap-3">
                <Zap className="text-primary size-5 shrink-0" />
                <p className="text-xs text-zinc-400">
                  <span className="text-white font-bold block mb-1">Instant Activation</span>
                  Your account features will be unlocked immediately after payment.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white">Payment Details</h2>
            
            <Card className="glass border-white/10">
              <CardContent className="pt-6 space-y-8">
                {/* Customer Information Section */}
                <div className="space-y-4 pb-6 border-b border-white/5">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-primary" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer-name" className="text-zinc-400">Full Name</Label>
                      <Input 
                        id="customer-name" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe" 
                        className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-primary" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-email" className="text-zinc-400">Email Address</Label>
                      <Input 
                        id="customer-email" 
                        type="email"
                        placeholder="john@example.com" 
                        className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-primary" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="space-y-8">
                  <TabsList className="grid w-full grid-cols-3 bg-white/5 p-1 rounded-xl">
                    <TabsTrigger value="card" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                      <CreditCard className="size-4 mr-2" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger value="upi" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                      <Smartphone className="size-4 mr-2" />
                      UPI
                    </TabsTrigger>
                    <TabsTrigger value="qr" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                      <QrCode className="size-4 mr-2" />
                      QR Code
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-8">
                    <TabsContent value="card">
                      <form 
                        className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
                        onSubmit={handlePayment} 
                      >
                        <div className="space-y-2">
                          <Label htmlFor="card-number" className="text-zinc-400">Card Number</Label>
                          <div className="relative">
                            <Input id="card-number" placeholder="0000 0000 0000 0000" className="bg-white/5 border-white/10 text-white rounded-xl h-12 pl-12 focus:ring-primary" required />
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 size-5" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-expiry" className="text-zinc-400">Expiry Date</Label>
                            <Input id="card-expiry" placeholder="MM/YY" className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-primary" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="card-cvc" className="text-zinc-400">CVC</Label>
                            <Input id="card-cvc" placeholder="123" className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-primary" required />
                          </div>
                        </div>
                        <Button type="submit" disabled={isProcessing} className="w-full h-14 bg-primary text-white font-bold hover:bg-primary/90 rounded-xl text-lg mt-4">
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 size-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            `Pay ${plan.price}`
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="upi">
                      <form 
                        className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
                        onSubmit={handlePayment} 
                      >
                        <div className="space-y-4">
                          <Label className="text-zinc-400">Select UPI App</Label>
                          <RadioGroup defaultValue="gpay" className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 border border-white/10 bg-white/5 p-4 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                              <RadioGroupItem value="gpay" id="gpay" />
                              <Label htmlFor="gpay" className="flex-1 cursor-pointer text-white">Google Pay</Label>
                            </div>
                            <div className="flex items-center space-x-2 border border-white/10 bg-white/5 p-4 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                              <RadioGroupItem value="phonepe" id="phonepe" />
                              <Label htmlFor="phonepe" className="flex-1 cursor-pointer text-white">PhonePe</Label>
                            </div>
                            <div className="flex items-center space-x-2 border border-white/10 bg-white/5 p-4 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                              <RadioGroupItem value="paytm" id="paytm" />
                              <Label htmlFor="paytm" className="flex-1 cursor-pointer text-white">Paytm</Label>
                            </div>
                            <div className="flex items-center space-x-2 border border-white/10 bg-white/5 p-4 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other" className="flex-1 cursor-pointer text-white">Other UPI ID</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="upi-id" className="text-zinc-400">Enter UPI ID</Label>
                          <div className="relative">
                            <Input id="upi-id" placeholder="username@upi" className="bg-white/5 border-white/10 text-white rounded-xl h-12 pl-12 focus:ring-primary" required />
                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 size-5" />
                          </div>
                        </div>
                        <Button type="submit" disabled={isProcessing} className="w-full h-14 bg-primary text-white font-bold hover:bg-primary/90 rounded-xl text-lg">
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 size-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            `Pay ${plan.price}`
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="qr">
                      <div 
                        className="flex flex-col items-center space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
                      >
                        <div className="p-8 bg-white rounded-3xl shadow-2xl relative group">
                          <QrCode className="size-48 text-black" />
                          <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                            <span className="text-black text-xs font-bold">SCAN TO PAY</span>
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-white font-bold">Scan this QR code using any UPI app</p>
                          <p className="text-zinc-500 text-sm">Amount to pay: <span className="text-white font-bold">{plan.price}</span></p>
                        </div>
                        <div className="w-full max-w-sm">
                          <Button onClick={handlePayment} disabled={isProcessing} className="w-full h-14 bg-primary text-white font-bold hover:bg-primary/90 rounded-xl text-lg">
                            {isProcessing ? (
                              <>
                                <Loader2 className="mr-2 size-5 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "I have completed the payment"
                            )}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
