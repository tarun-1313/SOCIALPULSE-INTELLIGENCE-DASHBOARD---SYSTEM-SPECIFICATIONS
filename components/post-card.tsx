"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: {
    id: string
    content: string
    platform: string
    likes: number
    comments: number
    posted_at: string
  }
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)

  const sentimentScore = Math.floor(Math.random() * 40) + 60 // Simulated score between 60-100
  const isPositive = sentimentScore > 75

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  return (
    <Card className="glass rounded-none lg:rounded-2xl overflow-hidden border-none shadow-none">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold ring-1 ring-white/10 uppercase">
              {post.platform.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-none tracking-tight">{post.platform} Account</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-widest">
                {new Date(post.posted_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <button className="text-zinc-500 hover:text-white transition-colors">
            <MoreHorizontal className="size-5" />
          </button>
        </div>

        <div className="aspect-square w-full bg-zinc-900 flex flex-col items-center justify-center p-8 relative group cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-30 group-hover:opacity-50 transition-opacity" />

          <div className="absolute top-4 left-4 z-30">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <Sparkles className={cn("size-3", isPositive ? "text-emerald-400" : "text-amber-400")} />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                AI Sentiment: {sentimentScore}%
              </span>
            </div>
          </div>

          <p className="text-xl font-medium text-white text-center leading-relaxed tracking-tight relative z-10 px-6">
            "{post.content}"
          </p>

          <div
            className={cn(
              "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-8 backdrop-blur-sm z-20",
              isLiked && "opacity-100 bg-black/20",
            )}
            onClick={handleLike}
          >
            <div className="flex flex-col items-center text-white scale-90 group-hover:scale-100 transition-transform">
              <Heart
                className={cn("size-8 mb-1 transition-colors", isLiked ? "fill-red-500 text-red-500" : "fill-white")}
              />
              <span className="text-sm font-bold">{likesCount.toLocaleString()}</span>
            </div>
            <div
              className="flex flex-col items-center text-white scale-90 group-hover:scale-100 transition-transform"
              onClick={(e) => {
                e.stopPropagation()
                setShowComments(!showComments)
              }}
            >
              <MessageCircle className="size-8 fill-white mb-1" />
              <span className="text-sm font-bold">{post.comments}</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={cn(
                  "transition-all active:scale-125",
                  isLiked ? "text-red-500" : "text-white hover:text-zinc-400",
                )}
              >
                <Heart className={cn("size-6", isLiked && "fill-current")} />
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="text-white hover:text-zinc-400 transition-colors"
              >
                <MessageCircle className="size-6" />
              </button>
              <button className="text-white hover:text-zinc-400 transition-colors">
                <Share2 className="size-6" />
              </button>
            </div>
            <button className="text-white hover:text-zinc-400 transition-colors">
              <Bookmark className="size-6" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-white tracking-tight">{likesCount.toLocaleString()} likes</p>
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
              <span className="font-bold text-white mr-2">{post.platform.toLowerCase()}</span>
              {post.content}
            </p>
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-xs text-zinc-500 font-medium hover:text-zinc-300 transition-colors"
            >
              {showComments ? "Hide comments" : `View all ${post.comments} comments`}
            </button>
          </div>

          {showComments && (
            <div className="pt-4 mt-4 border-t border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex gap-3">
                <div className="size-7 rounded-full bg-zinc-800 shrink-0" />
                <div className="flex-1">
                  <p className="text-[11px] text-white">
                    <span className="font-bold mr-2">analyst_pro</span>
                    Great engagement on this post! The sentiment looks very positive.
                  </p>
                  <p className="text-[9px] text-zinc-600 mt-1 uppercase font-bold tracking-widest">2h • Reply</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="size-7 rounded-full bg-zinc-800 shrink-0" />
                <div className="flex-1">
                  <p className="text-[11px] text-white">
                    <span className="font-bold mr-2">data_wizard</span>
                    Reach is up 12% compared to last week.
                  </p>
                  <p className="text-[9px] text-zinc-600 mt-1 uppercase font-bold tracking-widest">5h • Reply</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
