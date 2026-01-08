"use client"

import { useState, useEffect, useCallback } from "react"
import { Camera, MessageCircle, HelpCircle, Recycle, Leaf, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CameraSection } from "@/components/camera-section"
import { ChatSection } from "@/components/chat-section"
import { QuizSection } from "@/components/quiz-section"

export function WasteClassifier() {
  const [ecoPoints, setEcoPoints] = useState(0)
  const [streakDays, setStreakDays] = useState(0)

  useEffect(() => {
    // Load stats from localStorage
    try {
      const raw = localStorage.getItem("wasteStats")
      if (raw) {
        const obj = JSON.parse(raw)
        setEcoPoints(obj.ecoPoints || 0)
        setStreakDays(obj.streakDays || 0)
      }
    } catch (e) {
      console.warn("Không đọc được stats:", e)
    }
  }, [])

  const bumpStats = useCallback(() => {
    setEcoPoints((prev) => {
      const newPoints = prev + 1
      const today = new Date().toISOString().slice(0, 10)

      try {
        const raw = localStorage.getItem("wasteStats")
        const obj = raw ? JSON.parse(raw) : {}
        const lastUsedDate = obj.lastUsedDate
        let newStreak = streakDays

        if (!lastUsedDate) {
          newStreak = 1
        } else if (today !== lastUsedDate) {
          const prev = new Date(lastUsedDate)
          const curr = new Date(today)
          const diffMs = curr.getTime() - prev.getTime()
          const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
          newStreak = diffDays === 1 ? streakDays + 1 : 1
        }

        setStreakDays(newStreak)
        localStorage.setItem(
          "wasteStats",
          JSON.stringify({
            ecoPoints: newPoints,
            streakDays: newStreak,
            lastUsedDate: today,
          }),
        )
      } catch (e) {
        console.warn("Không lưu được stats:", e)
      }

      return newPoints
    })
  }, [streakDays])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <Recycle className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Phân loại rác thông minh</h1>
                <p className="text-xs opacity-80">AI chạy trên trình duyệt – bảo mật dữ liệu</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Leaf className="h-4 w-4" />
                  <span className="font-semibold">{ecoPoints}</span>
                  <span className="opacity-80">điểm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4" />
                  <span className="font-semibold">{streakDays}</span>
                  <span className="opacity-80">ngày</span>
                </div>
              </div>
              <p className="mt-0.5 text-xs opacity-60">TensorFlow.js | MobileNet</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="camera" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Camera</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Chat AI</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera">
            <CameraSection onClassify={bumpStats} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatSection onMessage={bumpStats} />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizSection onCorrectAnswer={bumpStats} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        <p>Demo giáo dục – không thay thế quy định phân loại rác chính thức tại địa phương.</p>
      </footer>
    </div>
  )
}
