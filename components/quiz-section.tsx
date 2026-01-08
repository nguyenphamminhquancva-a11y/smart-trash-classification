"use client"

import { useState, useEffect } from "react"
import { HelpCircle, CheckCircle2, XCircle, RefreshCw, Trophy, Award, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QUIZ_DATA } from "@/lib/waste-data"

const ACHIEVEMENTS = [
  {
    id: "beginner",
    title: "Người mới bắt đầu",
    description: "Trả lời đúng 5 câu hỏi",
    icon: Star,
    requiredScore: 5,
    color: "text-amber-500",
    bgColor: "bg-amber-100",
  },
  {
    id: "expert",
    title: "Chuyên gia môi trường",
    description: "Trả lời đúng 15 câu hỏi",
    icon: Award,
    requiredScore: 15,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    id: "master",
    title: "Bậc thầy tái chế",
    description: "Trả lời đúng 30 câu hỏi",
    icon: Trophy,
    requiredScore: 30,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100",
  },
]

interface QuizSectionProps {
  onCorrectAnswer: () => void
}

export function QuizSection({ onCorrectAnswer }: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState<(typeof ACHIEVEMENTS)[0] | null>(null)

  useEffect(() => {
    // Load quiz stats from localStorage
    try {
      const raw = localStorage.getItem("quizStats")
      if (raw) {
        const obj = JSON.parse(raw)
        setQuizScore(obj.score || 0)
        setUnlockedAchievements(obj.achievements || [])
      }
    } catch (e) {
      console.warn("Không đọc được quiz stats:", e)
    }
    loadRandomQuestion()
  }, [])

  const loadRandomQuestion = () => {
    let newIndex = Math.floor(Math.random() * QUIZ_DATA.length)
    while (newIndex === currentIndex && QUIZ_DATA.length > 1) {
      newIndex = Math.floor(Math.random() * QUIZ_DATA.length)
    }
    setCurrentIndex(newIndex)
    setSelectedAnswer(null)
    setAnswered(false)
    setNewAchievement(null)
  }

  const checkAchievements = (newScore: number) => {
    for (const achievement of ACHIEVEMENTS) {
      if (newScore >= achievement.requiredScore && !unlockedAchievements.includes(achievement.id)) {
        setUnlockedAchievements((prev) => {
          const updated = [...prev, achievement.id]
          // Save to localStorage
          try {
            localStorage.setItem("quizStats", JSON.stringify({ score: newScore, achievements: updated }))
          } catch (e) {
            console.warn("Không lưu được quiz stats:", e)
          }
          return updated
        })
        setNewAchievement(achievement)
        return
      }
    }
    // Save score even if no new achievement
    try {
      localStorage.setItem("quizStats", JSON.stringify({ score: newScore, achievements: unlockedAchievements }))
    } catch (e) {
      console.warn("Không lưu được quiz stats:", e)
    }
  }

  const handleAnswer = (index: number) => {
    if (answered) return

    setSelectedAnswer(index)
    setAnswered(true)

    if (index === QUIZ_DATA[currentIndex].correctIndex) {
      onCorrectAnswer()
      const newScore = quizScore + 1
      setQuizScore(newScore)
      checkAchievements(newScore)
    }
  }

  const question = QUIZ_DATA[currentIndex]
  const isCorrect = selectedAnswer === question.correctIndex

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Tiến độ thành tựu</span>
            <span className="text-sm text-muted-foreground">{quizScore} câu đúng</span>
          </div>
          <div className="flex gap-2">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id)
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className={`flex-1 flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                    isUnlocked
                      ? `${achievement.bgColor} border-current ${achievement.color}`
                      : "bg-muted/30 border-muted-foreground/20 opacity-50"
                  }`}
                >
                  <Icon className={`h-6 w-6 mb-1 ${isUnlocked ? achievement.color : "text-muted-foreground"}`} />
                  <span className={`text-xs font-medium text-center ${isUnlocked ? "" : "text-muted-foreground"}`}>
                    {achievement.title}
                  </span>
                  <span className="text-xs text-muted-foreground mt-0.5">{achievement.requiredScore} câu</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {newAchievement && (
        <Card className={`border-2 ${newAchievement.color} ${newAchievement.bgColor} animate-pulse`}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-white ${newAchievement.color}`}>
                <newAchievement.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold">Chúc mừng! Bạn đã mở khóa thành tựu mới!</p>
                <p className={`text-sm font-medium ${newAchievement.color}`}>
                  {newAchievement.title} - {newAchievement.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Quiz nhanh về rác & môi trường
              </CardTitle>
              <CardDescription>Trả lời câu hỏi trắc nghiệm để kiểm tra kiến thức phân loại rác</CardDescription>
            </div>
            <Badge variant="secondary">Game</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Question */}
          <div className="mb-6">
            <p className="text-lg font-semibold">{question.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              let variant: "outline" | "default" | "destructive" = "outline"
              let icon = null

              if (answered) {
                if (index === question.correctIndex) {
                  variant = "default"
                  icon = <CheckCircle2 className="h-4 w-4" />
                } else if (index === selectedAnswer) {
                  variant = "destructive"
                  icon = <XCircle className="h-4 w-4" />
                }
              }

              return (
                <Button
                  key={index}
                  variant={variant}
                  className={`w-full justify-start text-left h-auto py-3 px-4 ${
                    answered && index === question.correctIndex
                      ? "bg-green-600 hover:bg-green-600 text-white"
                      : answered && index === selectedAnswer && index !== question.correctIndex
                        ? "bg-red-500 hover:bg-red-500 text-white"
                        : ""
                  }`}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                >
                  <span className="flex items-center gap-2">
                    {icon}
                    {option}
                  </span>
                </Button>
              )
            })}
          </div>

          {/* Feedback */}
          {answered && (
            <div
              className={`mt-6 rounded-lg p-4 ${isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            >
              <p className="font-semibold">{isCorrect ? "Đúng rồi!" : "Chưa chính xác."}</p>
              <p className="mt-1 text-sm">{question.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          <div className="mt-6">
            <Button variant="outline" onClick={loadRandomQuestion}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Câu hỏi khác
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
