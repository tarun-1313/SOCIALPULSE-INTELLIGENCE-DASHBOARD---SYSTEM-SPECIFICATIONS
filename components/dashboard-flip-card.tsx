"use client"

export function DashboardFlipCard() {
  return (
    <div className="relative group perspective-1000">
      <div className="absolute -inset-20 bg-primary/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative h-[400px] md:h-[500px] w-full transition-all duration-1000 preserve-3d group-hover:rotate-y-180">
        {/* Front Side (Dashboard 1) */}
        <div className="absolute inset-0 backface-hidden z-20">
          <div className="glass p-3 rounded-4xl border-white/10 shadow-2xl h-full flex items-center justify-center overflow-hidden">
            <img
              src="/dashboard 1.png"
              alt="Data Visualization Dashboard"
              className="rounded-2xl w-full h-auto object-cover"
            />
            <div className="absolute bottom-6 right-6 bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold animate-pulse">
              Hover to flip
            </div>
          </div>
        </div>

        {/* Back Side (Dashboard 2) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 z-10">
          <div className="glass p-3 rounded-4xl border-white/10 shadow-2xl h-full flex items-center justify-center overflow-hidden bg-primary/5">
            <img
              src="/dashboard 2.jpg"
              alt="Social Analytics Dashboard"
              className="rounded-2xl w-full h-auto object-cover"
            />
            <div className="absolute top-6 left-6 bg-primary/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold">
              Analytics View
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
