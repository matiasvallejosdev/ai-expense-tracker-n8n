"use client"

import { useState, useRef, type DragEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload, FileText, ImageIcon, X, Loader2 } from "lucide-react"
import type { UploadStepProps } from "@/types/expense-tracker"
import { validateFile, formatFileSize, getFileIcon } from "@/lib/file-utils"
import { FILE_UPLOAD_CONFIG } from "@/lib/constants"
import { ExpenseService } from "@/services/expense-service"

export default function UploadStep({ onBack, onFileSelect, onProcessComplete, selectedFile }: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (file: File) => {
    const validationResult = validateFile(file)

    if (!validationResult.isValid && validationResult.error) {
      toast({
        title: validationResult.error.title,
        description: validationResult.error.description,
        variant: "destructive",
      })
      return
    }

    onFileSelect(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    onFileSelect(null as any)
  }

  const handleProcessReceipt = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload to n8n webhook
      const response = await ExpenseService.uploadExpense(selectedFile)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.success) {
        toast({
          title: "Success!",
          description: response.message || "Receipt uploaded successfully",
        })

        setTimeout(() => {
          setIsProcessing(false)
          onProcessComplete()
        }, 500)
      } else {
        throw new Error(response.error || "Upload failed")
      }
    } catch (error) {
      setIsProcessing(false)
      setUploadProgress(0)

      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload receipt. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderFileIcon = (type: string) => {
    const iconType = getFileIcon(type)
    if (iconType === "pdf") return <FileText className="w-6 h-6 text-gray-600" />
    return <ImageIcon className="w-6 h-6 text-gray-600" />
  }

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <Card className="p-6 shadow-lg border-0 bg-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-sm font-medium text-muted-foreground">Step 2 of 3</div>
        </div>

        {/* Upload Area */}
        {!selectedFile ? (
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed p-12 text-center cursor-pointer
              transition-all duration-200 mb-6
              ${
                isDragging
                  ? "border-primary bg-accent scale-[0.98]"
                  : "border-border hover:border-primary hover:bg-accent/50"
              }
            `}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-accent flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold mb-1">Tap to upload or drag & drop</p>
                <p className="text-sm text-muted-foreground">PDF, JPG, PNG • Max 10MB</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={FILE_UPLOAD_CONFIG.acceptedExtensions}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileChange(file)
              }}
              className="hidden"
            />
          </div>
        ) : (
          <Card className="p-4 mb-6 bg-accent border-border">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">{renderFileIcon(selectedFile.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{uploadProgress < 50 ? "Uploading to secure storage..." : "AI is analyzing your receipt..."}</span>
            </div>
            <div className="w-full h-2 bg-secondary overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <Button
          onClick={handleProcessReceipt}
          disabled={!selectedFile || isProcessing}
          className="w-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Process Receipt"
          )}
        </Button>

        <button
          onClick={onBack}
          className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          I'll do this later
        </button>
      </Card>
    </div>
  )
}
