"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Upload, LayoutDashboard, Cloud, FileSpreadsheet } from "lucide-react"
import type { SuccessStepProps } from "@/types/expense-tracker"
import { DASHBOARD_URL } from "@/lib/constants"

export default function SuccessStep({ fileName, onUploadAnother }: SuccessStepProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const currentTime = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#1f2937", "#374151", "#4b5563", "#6b7280", "#9ca3af"][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <Card className="p-8 shadow-lg border-0 bg-card">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle2 className="w-16 h-16 text-gray-700 dark:text-gray-300" />
            </div>
            <div className="absolute inset-0 bg-gray-500/20 animate-ping" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold text-center mb-2">Receipt Processed!</h1>

        {/* Summary Card */}
        <Card className="p-5 mb-6 bg-accent border-border space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">File name</p>
            <p className="font-medium truncate">{fileName}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Upload time</p>
            <p className="font-medium">{currentTime}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Badge
              variant="secondary"
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0"
            >
              <Cloud className="w-3.5 h-3.5 mr-1.5" />
              Saved to Google Drive
            </Badge>
            <Badge
              variant="secondary"
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
              Added to spreadsheet
            </Badge>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onUploadAnother}
            className="w-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
            size="lg"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Another
          </Button>

          <Button
            variant="outline"
            className="w-full h-14 text-lg font-semibold border-2 bg-transparent"
            size="lg"
            asChild
          >
            <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
              <LayoutDashboard className="w-5 h-5 mr-2" />
              View Dashboard
            </a>
          </Button>
        </div>
      </Card>
    </div>
  )
}
