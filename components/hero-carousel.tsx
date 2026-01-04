"use client"

import { useState, useEffect } from "react"

export function HeroCarousel() {
  const [currentImage, setCurrentImage] = useState(0)
  const images = ["/image 1.svg", "/image 2.jpg", "/image 3.jpg", "/image 4.png", "/image 5.webp"]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="mt-20 glass rounded-2xl p-2 max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000 delay-500 shadow-2xl shadow-primary/20 relative h-[300px] md:h-[600px] overflow-hidden">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`SocialPulse Dashboard Preview ${index + 1}`}
          className={`absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] rounded-xl object-cover transition-all duration-1000 ${
            index === currentImage ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-95 translate-x-8"
          }`}
        />
      ))}
      {/* Image Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentImage ? "w-8 bg-primary" : "w-2 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
