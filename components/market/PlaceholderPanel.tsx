"use client"

import { motion } from "framer-motion"
import { MessageSquare, Users, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface PlaceholderPanelProps {
  height?: number
  className?: string
}

export function PlaceholderPanel({ height = 200, className = '' }: PlaceholderPanelProps) {
  const features = [
    {
      icon: MessageSquare,
      title: "Related Markets",
      description: "Discover correlated prediction markets",
      color: "#00F0FF"
    },
    {
      icon: Users,
      title: "Community Comments",
      description: "Real-time discussion and analysis",
      color: "#39FF14"
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Advanced analytics and trends",
      color: "#FF4D00"
    },
    {
      icon: Zap,
      title: "Live Updates",
      description: "Breaking news and event alerts",
      color: "#00F0FF"
    }
  ]

  return (
    <motion.div
      className={`w-full bg-black border border-[#39FF14]/20 rounded-lg overflow-hidden ${className}`}
      style={{ height }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="text-center mb-6">
          <h3 className="text-lg font-mono text-[#00F0FF] mb-2">
            Enhanced Features Coming Soon
          </h3>
          <p className="text-sm text-muted-foreground">
            Building the most advanced prediction market terminal
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card className="bg-black/50 border-[#39FF14]/10 hover:border-[#39FF14]/30 transition-colors h-full">
                <CardContent className="p-4 flex flex-col items-center text-center h-full justify-center">
                  <feature.icon
                    className="w-8 h-8 mb-3"
                    style={{ color: feature.color }}
                  />
                  <h4 className="font-medium text-sm text-white mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-px bg-[#00F0FF]/20 animate-pulse"
               style={{
                 background: 'linear-gradient(90deg, transparent, #00F0FF, transparent)',
                 animation: 'scanline 2s linear infinite'
               }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </motion.div>
  )
}