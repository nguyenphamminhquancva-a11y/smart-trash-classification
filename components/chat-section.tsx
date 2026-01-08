"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, ImagePlus, Trash2, Bot, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { generateAIResponse } from "@/lib/ai-engine"
import { WASTE_ADVICE, mapImageNetLabelToBaseType } from "@/lib/waste-data"
import Script from "next/script"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatSectionProps {
  onMessage: () => void
}

const WELCOME_TEXT = `Xin chào! 👋 Tôi là AI phân loại rác thông minh (hoàn toàn miễn phí!). Bạn có thể:

• Hỏi về cách phân loại bất kỳ loại rác nào
• Gửi ảnh để tôi nhận diện loại rác
• Hỏi về ký hiệu trên bao bì (PET, HDPE, PP...)
• Tìm hiểu về tái chế và bảo vệ môi trường

Hãy bắt đầu bằng cách mô tả hoặc gửi ảnh loại rác bạn muốn phân loại!`

export function ChatSection({ onMessage }: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_TEXT,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Image recognition state
  const [scriptsLoaded, setScriptsLoaded] = useState(false)
  const [net, setNet] = useState<any>(null)
  const [imageProcessing, setImageProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Load model for image recognition
  useEffect(() => {
    if (!scriptsLoaded) return

    const loadModel = async () => {
      try {
        // @ts-ignore
        const model = await window.mobilenet.load()
        setNet(model)
      } catch (e) {
        console.error("Lỗi tải model:", e)
      }
    }

    loadModel()
  }, [scriptsLoaded])

  const handleSendText = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    onMessage()

    // Simulate thinking delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))

    const aiResponse = generateAIResponse(userMessage.content)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageProcessing(true)
    const url = URL.createObjectURL(file)

    if (!net) {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `[Gửi ảnh: ${file.name}]`,
      }
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Mô hình AI chưa tải xong, vui lòng đợi vài giây và thử lại!",
      }
      setMessages((prev) => [...prev, userMsg, assistantMsg])
      setImageProcessing(false)
      URL.revokeObjectURL(url)
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = async () => {
      try {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.drawImage(img, 0, 0)

        const predictions = await net.classify(canvas)

        const userMsg: Message = {
          id: Date.now().toString(),
          role: "user",
          content: `[Gửi ảnh: ${file.name}]`,
        }
        setMessages((prev) => [...prev, userMsg])

        await new Promise((resolve) => setTimeout(resolve, 300))

        let responseText: string

        if (!predictions || predictions.length === 0) {
          responseText = "Tôi không thể nhận diện được vật thể trong ảnh. Bạn có thể mô tả thêm về loại rác này không?"
        } else {
          const top = predictions[0]
          const category = mapImageNetLabelToBaseType(top.className)
          const advice = WASTE_ADVICE[category]

          responseText = `📷 **Kết quả nhận diện ảnh**

🔍 **Vật thể:** ${top.className}
📊 **Độ tin cậy:** ${(top.probability * 100).toFixed(1)}%
🏷️ **Phân loại:** ${advice.icon} ${advice.displayName}

---

${advice.text}

${advice.tips}

💡 Nếu kết quả chưa chính xác, bạn có thể mô tả thêm về vật thể để tôi hỗ trợ tốt hơn!`
        }

        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responseText,
        }
        setMessages((prev) => [...prev, assistantMsg])
        onMessage()
      } catch (e) {
        console.error(e)
        const errorMsg: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: "Có lỗi khi phân tích ảnh, vui lòng thử lại với ảnh khác.",
        }
        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setImageProcessing(false)
        URL.revokeObjectURL(url)
      }
    }
    img.onerror = () => {
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Không tải được ảnh, hãy thử ảnh khác.",
      }
      setMessages((prev) => [...prev, errorMsg])
      setImageProcessing(false)
      URL.revokeObjectURL(url)
    }
    img.src = url

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const clearHistory = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: WELCOME_TEXT,
      },
    ])
  }

  const renderContent = (content: string) => {
    // Split by **text** pattern and render bold
    const parts = content.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js"
        onLoad={() => {
          const script = document.createElement("script")
          script.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js"
          script.onload = () => setScriptsLoaded(true)
          document.head.appendChild(script)
        }}
      />

      <canvas ref={canvasRef} className="hidden" />

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Chat AI phân loại rác
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </CardTitle>
              <CardDescription>Hỏi AI thông minh về rác bằng văn bản hoặc gửi ảnh</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              Free AI
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Chat Area */}
          <div ref={scrollRef} className="h-96 overflow-y-auto rounded-lg bg-muted p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-card text-card-foreground shadow-sm border"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{renderContent(msg.content)}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-card px-4 py-3 text-muted-foreground shadow-sm border">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Đang suy nghĩ...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="mt-4 flex gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || imageProcessing}
            >
              {imageProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi về cách phân loại rác..."
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendText()
                }
              }}
            />
            <Button onClick={handleSendText} disabled={isLoading || !inputValue.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>

          {/* Hints & Clear */}
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <p>Gợi ý: "Chai nhựa PET bỏ đâu?", "Pin cũ xử lý thế nào?"...</p>
            <Button variant="ghost" size="sm" onClick={clearHistory} disabled={isLoading}>
              <Trash2 className="mr-1 h-3 w-3" />
              Xoá lịch sử
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
