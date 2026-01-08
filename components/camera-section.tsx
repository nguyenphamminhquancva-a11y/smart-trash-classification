"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, CameraOff, ScanLine, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WASTE_ADVICE, mapImageNetLabelToBaseType, type WasteCategory } from "@/lib/waste-data"
import Script from "next/script"

interface CameraSectionProps {
  onClassify: () => void
}

interface Prediction {
  className: string
  probability: number
}

export function CameraSection({ onClassify }: CameraSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelLoading, setModelLoading] = useState(true)
  const [isClassifying, setIsClassifying] = useState(false)
  const [result, setResult] = useState<{
    category: WasteCategory
    label: string
    confidence: number
    top3: Prediction[]
  } | null>(null)
  const [net, setNet] = useState<any>(null)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  // Load model when scripts are ready
  useEffect(() => {
    if (!scriptsLoaded) return

    const loadModel = async () => {
      try {
        setModelLoading(true)
        // @ts-ignore
        const model = await window.mobilenet.load()
        setNet(model)
        setModelLoaded(true)
      } catch (e) {
        console.error("Lỗi tải model:", e)
      } finally {
        setModelLoading(false)
      }
    }

    loadModel()
  }, [scriptsLoaded])

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Trình duyệt của bạn không hỗ trợ camera.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (e: any) {
      console.error(e)
      alert("Không truy cập được camera: " + e.message)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  const classifyImage = async () => {
    if (!net || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const width = video.videoWidth
    const height = video.videoHeight

    if (!width || !height) {
      alert("Camera chưa sẵn sàng")
      return
    }

    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0, width, height)

    setIsClassifying(true)

    try {
      const predictions: Prediction[] = await net.classify(canvas)

      if (predictions && predictions.length > 0) {
        const top = predictions[0]
        const category = mapImageNetLabelToBaseType(top.className)

        setResult({
          category,
          label: top.className,
          confidence: top.probability,
          top3: predictions.slice(0, 3),
        })

        onClassify()
      } else {
        setResult({
          category: "other",
          label: "Không nhận diện được",
          confidence: 0,
          top3: [],
        })
      }
    } catch (e) {
      console.error(e)
      alert("Lỗi khi phân loại hình ảnh")
    } finally {
      setIsClassifying(false)
    }
  }

  const advice = result ? WASTE_ADVICE[result.category] : null

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js"
        onLoad={() => {
          // Load mobilenet after tf.js
          const script = document.createElement("script")
          script.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js"
          script.onload = () => setScriptsLoaded(true)
          document.head.appendChild(script)
        }}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Camera Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Camera
                </CardTitle>
                <CardDescription>Bật camera rồi chụp để AI nhận diện và phân loại rác</CardDescription>
              </div>
              <Badge variant="secondary">Real-time</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />

              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <CameraOff className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Camera chưa bật</p>
                </div>
              )}

              {isClassifying && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-medium">Đang phân tích...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {!cameraActive ? (
                <Button onClick={startCamera} disabled={!modelLoaded}>
                  <Camera className="mr-2 h-4 w-4" />
                  Bật camera
                </Button>
              ) : (
                <>
                  <Button onClick={classifyImage} disabled={isClassifying}>
                    <ScanLine className="mr-2 h-4 w-4" />
                    Chụp & phân loại
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    <CameraOff className="mr-2 h-4 w-4" />
                    Tắt camera
                  </Button>
                </>
              )}
            </div>

            {/* Status */}
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              {modelLoading ? (
                <>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                  <span>Đang tải mô hình AI...</span>
                </>
              ) : modelLoaded ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Mô hình AI sẵn sàng</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Lỗi tải mô hình</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Result Card */}
        <Card>
          <CardHeader>
            <CardTitle>Kết quả & tư vấn</CardTitle>
            <Badge variant={result ? "default" : "outline"}>{result ? "Từ camera" : "Chưa có kết quả"}</Badge>
          </CardHeader>
          <CardContent>
            {result && advice ? (
              <div className="space-y-4">
                {/* Category */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${advice.color} text-2xl text-white`}
                  >
                    {advice.icon}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{advice.displayName}</p>
                    <p className="text-sm text-muted-foreground">Nhận dạng: {result.label}</p>
                  </div>
                </div>

                {/* Confidence */}
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm font-medium">Độ tin cậy: {(result.confidence * 100).toFixed(1)}%</p>
                  {result.top3.length > 0 && (
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {result.top3.map((p, i) => (
                        <p key={i}>
                          #{i + 1}: {p.className} ({(p.probability * 100).toFixed(1)}%)
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Advice */}
                <div>
                  <h4 className="font-semibold text-primary">{advice.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{advice.description}</p>
                  <ul className="mt-3 space-y-2">
                    {advice.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Hãy bật camera, đưa vật cần quét vào khung rồi bấm "Chụp & phân loại".
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
